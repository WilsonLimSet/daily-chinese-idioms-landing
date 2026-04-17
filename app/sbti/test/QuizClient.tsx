'use client';

import { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import {
  calcDimensionScores,
  scoresToLevels,
  determineResult,
  encodeVector,
  drinkGatePosition,
  type Answers,
  type QuizQuestion,
  type SpecialQuestion,
  type TypePattern,
} from '@/src/lib/sbti-engine';

function typeCodeToSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]/g, '');
}

type Props = {
  resultBasePath: string;
  typePatterns: TypePattern[];
  main: QuizQuestion[];
  special: SpecialQuestion[];
  t: {
    /** Template with {cur} and {total} placeholders, e.g. "Q{cur} / {total}". */
    progressFormat: string;
    bonusLabel: string;
    back: string;
    next: string;
    submit: string;
    restart: string;
    computing: string;
    readAndReact: string;
    /** Template with {cur} and {total} placeholders. */
    resumeFormat: string;
    startOver: string;
    errorState: string;
    intro: {
      title: string;
      subtitle: string;
      attribution: string;
      disclaimer: string;
      start: string;
      questionCount: string;
      duration: string;
      socialProof?: string;
    };
  };
  dir?: 'ltr' | 'rtl';
};

type UIQuestion =
  | { kind: 'main'; q: QuizQuestion; mainIdx: number }
  | { kind: 'special'; q: SpecialQuestion; variant: 'gate' | 'trigger' };

const STORAGE_KEY = 'sbti-quiz-state-v2';
const SEED_KEY = 'sbti-quiz-seed-v1';
const LETTERS = ['A', 'B', 'C', 'D'];

function getOrCreateSeed(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(SEED_KEY);
    if (raw) return parseInt(raw, 10);
    const seed = Math.floor(Math.random() * 1_000_000);
    localStorage.setItem(SEED_KEY, String(seed));
    return seed;
  } catch {
    return Math.floor(Math.random() * 1_000_000);
  }
}

export default function QuizClient({
  resultBasePath,
  typePatterns,
  main,
  special,
  t,
  dir = 'ltr',
}: Props) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [idx, setIdx] = useState(0);
  const [seed, setSeed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [savedHasProgress, setSavedHasProgress] = useState(false);
  const questionHeadingRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setSeed(getOrCreateSeed());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: Answers; idx?: number };
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setAnswers(parsed.answers);
          setSavedHasProgress(true);
        }
        if (typeof parsed.idx === 'number') setIdx(parsed.idx);
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, idx }));
    } catch {}
  }, [answers, idx, hydrated]);

  const drinkGateIdx = useMemo(
    () => drinkGatePosition(seed || 0, main.length),
    [seed, main.length]
  );
  const drinkGateQ1 = special.find(s => s.kind === 'drink_gate');
  const drinkGateQ2 = special.find(s => s.kind === 'drink_trigger');
  const drinkAnswer = drinkGateQ1 ? answers[drinkGateQ1.id] : undefined;
  const showDrinkTrigger = drinkAnswer === 3 && !!drinkGateQ2;

  const flow: UIQuestion[] = useMemo(() => {
    const arr: UIQuestion[] = main.map((q, i) => ({ kind: 'main', q, mainIdx: i }));
    if (drinkGateQ1) arr.splice(drinkGateIdx, 0, { kind: 'special', q: drinkGateQ1, variant: 'gate' });
    if (showDrinkTrigger && drinkGateQ2) {
      const gateIdx = arr.findIndex(
        x => x.kind === 'special' && x.q.id === drinkGateQ1?.id
      );
      if (gateIdx >= 0) arr.splice(gateIdx + 1, 0, { kind: 'special', q: drinkGateQ2, variant: 'trigger' });
    }
    return arr;
  }, [main, drinkGateQ1, drinkGateQ2, drinkGateIdx, showDrinkTrigger]);

  const total = flow.length;
  const current = flow[Math.min(idx, Math.max(0, total - 1))];
  const isSpecial = current?.kind === 'special';
  const mainCount = main.length;
  const mainAnswered = current?.kind === 'main' ? current.mainIdx + 1 : null;
  const progressPct = Math.round(((idx + 1) / total) * 100);

  const pick = useCallback(
    (value: number) => {
      if (!current) return;
      setAnswers(prev => ({ ...prev, [current.q.id]: value }));
    },
    [current]
  );

  const startOver = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAnswers({});
    setIdx(0);
    setStarted(true);
  }, []);

  const canNext = current ? answers[current.q.id] != null : false;
  const isLast = idx >= total - 1;

  const submit = useCallback(() => {
    setSubmitting(true);
    const dimensionScores = calcDimensionScores(answers, main);
    const userLevels = scoresToLevels(dimensionScores);
    const isDrunk = drinkGateQ2 ? answers[drinkGateQ2.id] === 2 : false;
    const result = determineResult(userLevels, typePatterns, { isDrunk });
    const vector = encodeVector(userLevels);
    const slug = typeCodeToSlug(result.primary.code);
    const params = new URLSearchParams({
      v: vector,
      sim: String(result.primary.similarity),
    });
    if (result.secondary && result.mode !== 'normal') {
      params.set('sec', typeCodeToSlug(result.secondary.code));
    }
    router.push(`${resultBasePath}/${slug}?${params.toString()}`);
  }, [answers, drinkGateQ2, main, typePatterns, router, resultBasePath]);

  const goNext = useCallback(() => {
    if (!canNext) return;
    if (isLast) {
      submit();
      return;
    }
    setIdx(i => i + 1);
  }, [canNext, isLast, submit]);

  const goBack = useCallback(() => {
    setIdx(i => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    if (!started) return;
    questionHeadingRef.current?.focus();
  }, [idx, started]);

  useEffect(() => {
    if (!started) return;
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLButtonElement && e.target.getAttribute('role') === 'radio') {
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        goNext();
      } else if (e.key === 'ArrowLeft') {
        if (dir === 'rtl') goNext();
        else goBack();
      } else if (e.key === 'ArrowRight') {
        if (dir === 'rtl') goBack();
        else goNext();
      } else if (/^[1-4]$/.test(e.key)) {
        const n = parseInt(e.key, 10);
        const opt = current?.q.options[n - 1];
        if (opt) pick(opt.value);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [started, goNext, goBack, dir, current, pick]);

  // ---- Intro view ---------------------------------------------------------
  if (!started) {
    return (
      <div dir={dir}>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gray-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute -top-10 end-0 select-none text-[18rem] font-bold leading-none tracking-tight text-white/[0.03] md:text-[22rem]">
            SBTI
          </div>
          <nav className="relative mx-auto max-w-3xl px-6 pt-6">
            <Link
              href="/sbti"
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              ← SBTI
            </Link>
          </nav>
          <div className="relative mx-auto max-w-3xl px-6 pt-12 pb-20 md:pt-16 md:pb-24">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
              The Personality Test · Apr 2026
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Silly Behavioral
              <br />
              <span className="text-red-400">Type Indicator</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              {t.intro.subtitle}
            </p>

            {/* Meta strip */}
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                30 questions
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                27 types
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                ~5 minutes
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                Instant result
              </div>
            </div>

            {t.intro.socialProof && (
              <div className="mt-10 inline-flex items-center gap-2 rounded bg-red-500/15 px-3 py-1.5">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  {t.intro.socialProof}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* CTA + disclaimer block */}
        <section className="bg-gray-50">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Before you begin
                </p>
                <p className="text-lg leading-[1.7] text-gray-700">
                  {t.intro.disclaimer}
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gray-950 p-6">
                <div className="pointer-events-none absolute -top-4 -end-4 select-none font-serif text-[120px] leading-none text-white/[0.04]">
                  ?
                </div>
                <div className="relative">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded bg-red-500/20 px-2 py-0.5">
                    <span className="h-1 w-1 rounded-full bg-red-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300">
                      Hidden inside
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.65] text-white/80">
                    Two of the 27 types — <strong className="font-semibold text-white">HHHH</strong> and{' '}
                    <strong className="font-semibold text-white">DRUNK</strong> — are Easter eggs.
                    Only a specific pattern of answers will unlock them.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200/80 pt-8">
              {hydrated && savedHasProgress ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setStarted(true)}
                    className="group inline-flex flex-1 items-center justify-between gap-3 rounded-xl bg-gray-950 px-6 py-5 text-base font-semibold text-white transition hover:bg-red-500"
                  >
                    <span>
                      {t.resumeFormat
                        .replace('{cur}', String(Math.min(idx + 1, mainCount)))
                        .replace('{total}', String(mainCount))}
                    </span>
                    <ArrowRight className={'h-5 w-5 transition-transform group-hover:translate-x-1' + (dir === 'rtl' ? ' rotate-180' : '')} />
                  </button>
                  <button
                    type="button"
                    onClick={startOver}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-5 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                  >
                    {t.startOver}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="group inline-flex w-full items-center justify-between gap-3 rounded-xl bg-gray-950 px-6 py-5 text-base font-semibold text-white transition hover:bg-red-500"
                >
                  <span>{t.intro.start}</span>
                  <ArrowRight className={'h-5 w-5 transition-transform group-hover:translate-x-1' + (dir === 'rtl' ? ' rotate-180' : '')} />
                </button>
              )}
              <p className="mt-4 text-xs text-gray-400">
                <a
                  href="https://space.bilibili.com/417038183"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-gray-200 underline-offset-2 hover:text-gray-600 hover:decoration-gray-400"
                >
                  {t.intro.attribution}
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // ---- Error state --------------------------------------------------------
  if (!current) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center" dir={dir}>
        <p className="text-lg text-gray-700">{t.errorState}</p>
        <button
          type="button"
          onClick={startOver}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gray-950 px-5 py-3 text-sm font-semibold text-white hover:bg-red-500"
        >
          {t.restart}
        </button>
      </div>
    );
  }

  const selected = answers[current.q.id];
  const isLongText = current.q.text.length > 250;
  const questionLabel = isSpecial
    ? current.variant === 'trigger'
      ? `${t.bonusLabel} · 02`
      : `${t.bonusLabel} · 01`
    : mainAnswered != null
    ? t.progressFormat.replace('{cur}', String(mainAnswered)).replace('{total}', String(mainCount))
    : t.bonusLabel;

  // ---- Question view ------------------------------------------------------
  return (
    <div className="relative min-h-screen bg-gray-50" dir={dir}>
      {/* Massive Chinese-character watermark behind content — echoes festivals page */}
      <div className="pointer-events-none fixed inset-x-0 top-20 select-none text-center md:top-32">
        <span className="text-[28vw] font-bold leading-none tracking-tight text-gray-900/[0.025] md:text-[20rem]">
          Q{String((mainAnswered ?? 0) || idx + 1).padStart(2, '0')}
        </span>
      </div>

      <div className="relative mx-auto max-w-2xl px-6 pb-40 pt-8 md:pt-14">
        {/* Progress header */}
        <div className="flex items-baseline justify-between" aria-live="polite">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            {questionLabel}
          </span>
          <span className="text-xs tracking-[0.15em] text-gray-400">
            {String(progressPct).padStart(2, '0')}%
          </span>
        </div>
        <div
          className="relative mt-3 h-px bg-gray-200"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="absolute inset-y-0 h-px bg-red-500 transition-[width] duration-500"
            style={{ width: `${progressPct}%`, [dir === 'rtl' ? 'right' : 'left']: 0 }}
          />
        </div>

        {/* Question */}
        <div className="mt-12 md:mt-16">
          {isLongText ? (
            <div className="relative">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">
                  {t.readAndReact}
                </p>
              </div>
              <blockquote className="relative border-s-2 border-red-400 ps-5">
                <p
                  ref={questionHeadingRef}
                  tabIndex={-1}
                  className="text-[1.15rem] leading-[1.65] text-gray-700 focus:outline-none md:text-[1.3rem]"
                >
                  {current.q.text}
                </p>
              </blockquote>
            </div>
          ) : (
            <p
              ref={questionHeadingRef}
              tabIndex={-1}
              className="text-[1.6rem] font-bold leading-[1.2] tracking-tight text-gray-900 focus:outline-none md:text-[2rem]"
            >
              {current.q.text}
            </p>
          )}
        </div>

        {/* Options */}
        <div
          className="mt-10 divide-y divide-gray-200 border-y border-gray-200"
          role="radiogroup"
          aria-label={current.q.text.slice(0, 100)}
        >
          {current.q.options.map((opt, i) => {
            const isSel = selected === opt.value;
            return (
              <button
                key={`${current.q.id}-${i}`}
                type="button"
                role="radio"
                aria-checked={isSel}
                onClick={() => pick(opt.value)}
                className={
                  'group grid w-full grid-cols-[2.5rem_1fr] items-start gap-4 px-2 py-5 text-start transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ' +
                  (isSel
                    ? 'bg-gray-950 text-white'
                    : 'text-gray-800 hover:bg-white')
                }
              >
                <span
                  className={
                    'pt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ' +
                    (isSel ? 'text-red-300' : 'text-gray-400 group-hover:text-red-500')
                  }
                >
                  {LETTERS[i] ?? String(i + 1)}
                </span>
                <span
                  className={
                    'text-[1.05rem] leading-[1.5] transition-colors ' +
                    (isSel ? 'text-white' : 'text-gray-800')
                  }
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky bottom nav */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="mx-auto flex max-w-2xl items-stretch">
          <button
            type="button"
            onClick={goBack}
            disabled={idx === 0}
            className="flex items-center gap-2 border-e border-gray-200 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 transition hover:text-gray-900 disabled:opacity-30 disabled:hover:text-gray-500"
          >
            {dir === 'rtl' ? <ArrowRight className="h-4 w-4" /> : <ArrowLeft className="h-4 w-4" />}
            {t.back}
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={!canNext || submitting}
            className="group inline-flex flex-1 items-center justify-between gap-2 bg-gray-950 px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-red-500 disabled:opacity-40 disabled:hover:bg-gray-950"
          >
            <span>{isLast ? (submitting ? t.computing : t.submit) : t.next}</span>
            {dir === 'rtl' ? (
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            ) : (
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
