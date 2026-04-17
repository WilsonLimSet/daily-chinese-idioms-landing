'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

type UI = {
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  questionsLabel: string;
  typesLabel: string;
  minutesLabel: string;
  instantResult: string;
  hiddenInside: string;
  hiddenInsideDesc: string;
  beforeBegin: string;
  socialProof: string;
  begin: string;
  resumeFormat: string;
  startOver: string;
  progressFormat: string;
  answeredFormat: string;
  readAndReact: string;
  bonusLabel: string;
  submit: string;
  submitIncomplete: string;
  computing: string;
  restart: string;
  errorState: string;
};

type Props = {
  resultBasePath: string;
  typePatterns: TypePattern[];
  main: QuizQuestion[];
  special: SpecialQuestion[];
  subtitle: string;
  disclaimer: string;
  ui: UI;
  dir?: 'ltr' | 'rtl';
  backHref: string;
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

function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ''));
}

export default function QuizClient({
  resultBasePath,
  typePatterns,
  main,
  special,
  subtitle,
  disclaimer,
  ui,
  dir = 'ltr',
  backHref,
}: Props) {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [answers, setAnswers] = useState<Answers>({});
  const [seed, setSeed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [savedHasProgress, setSavedHasProgress] = useState(false);

  useEffect(() => {
    setSeed(getOrCreateSeed());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { answers?: Answers };
        if (parsed.answers && Object.keys(parsed.answers).length > 0) {
          setAnswers(parsed.answers);
          setSavedHasProgress(true);
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers }));
    } catch {}
  }, [answers, hydrated]);

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

  const mainCount = main.length;
  const mainAnsweredCount = main.filter(q => answers[q.id] != null).length;
  const gateAnswered = !drinkGateQ1 || answers[drinkGateQ1.id] != null;
  const triggerAnswered = !showDrinkTrigger || (drinkGateQ2 && answers[drinkGateQ2.id] != null);
  const allAnswered = mainAnsweredCount === mainCount && gateAnswered && triggerAnswered;
  const remainingMain = mainCount - mainAnsweredCount + (gateAnswered ? 0 : 1);
  const progressPct = Math.round((mainAnsweredCount / mainCount) * 100);
  const firstUnansweredIdx = main.findIndex(q => answers[q.id] == null);

  const pick = useCallback((qid: string, value: number) => {
    setAnswers(prev => ({ ...prev, [qid]: value }));
  }, []);

  const startOver = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setAnswers({});
    setStarted(true);
    setTimeout(() => {
      const el = document.getElementById('q-top');
      el?.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, 0);
  }, []);

  const submit = useCallback(() => {
    if (!allAnswered) return;
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
  }, [allAnswered, answers, drinkGateQ2, main, typePatterns, router, resultBasePath]);

  // Auto-scroll to next unanswered question when user picks an answer.
  const onPick = useCallback(
    (qid: string, value: number) => {
      pick(qid, value);
      // Find next question in visible flow and scroll to it
      const currentFlowIdx = flow.findIndex(x => x.q.id === qid);
      if (currentFlowIdx < 0 || currentFlowIdx >= flow.length - 1) return;
      // Delay so the state update + any dynamic insertion (drink trigger) resolves
      setTimeout(() => {
        const nextItem = flow[currentFlowIdx + 1];
        if (!nextItem) return;
        const el = document.getElementById(`q-${nextItem.q.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 180);
    },
    [pick, flow]
  );

  const scrollToFirstUnanswered = useCallback(() => {
    const first = flow.find(f => answers[f.q.id] == null);
    if (first) {
      const el = document.getElementById(`q-${first.q.id}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [flow, answers]);

  // -- Intro -----------------------------------------------------------------
  if (!started) {
    return (
      <div dir={dir}>
        <section className="relative overflow-hidden bg-gray-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
          <div className="pointer-events-none absolute -top-10 end-0 select-none text-[18rem] font-bold leading-none tracking-tight text-white/[0.03] md:text-[22rem]">
            SBTI
          </div>
          <nav className="relative mx-auto max-w-3xl px-6 pt-6">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
            >
              ← SBTI
            </Link>
          </nav>
          <div className="relative mx-auto max-w-3xl px-6 pt-12 pb-20 md:pt-16 md:pb-24">
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
              {ui.kicker}
            </p>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {ui.titleLine1}
              <br />
              <span className="text-red-400">{ui.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60">
              {subtitle}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                30 {ui.questionsLabel}
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                27 {ui.typesLabel}
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                ~5 {ui.minutesLabel}
              </div>
              <div className="flex items-center gap-2 text-white/50">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                {ui.instantResult}
              </div>
            </div>

            {ui.socialProof && (
              <div className="mt-10 inline-flex items-center gap-2 rounded bg-red-500/15 px-3 py-1.5">
                <span className="h-1 w-1 rounded-full bg-red-400" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-200">
                  {ui.socialProof}
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="bg-gray-50">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  {ui.beforeBegin}
                </p>
                <p className="text-lg leading-[1.7] text-gray-700">{disclaimer}</p>
              </div>
              <div className="relative overflow-hidden rounded-xl bg-gray-950 p-6">
                <div className="pointer-events-none absolute -top-4 -end-4 select-none font-serif text-[120px] leading-none text-white/[0.04]">
                  ?
                </div>
                <div className="relative">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded bg-red-500/20 px-2 py-0.5">
                    <span className="h-1 w-1 rounded-full bg-red-400" />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300">
                      {ui.hiddenInside}
                    </span>
                  </div>
                  <p className="text-[15px] leading-[1.65] text-white/80">
                    {ui.hiddenInsideDesc}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 border-t border-gray-200/80 pt-8">
              {hydrated && savedHasProgress ? (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => {
                      setStarted(true);
                      setTimeout(scrollToFirstUnanswered, 0);
                    }}
                    className="group inline-flex flex-1 items-center justify-between gap-3 rounded-xl bg-gray-950 px-6 py-5 text-base font-semibold text-white transition hover:bg-red-500"
                  >
                    <span>
                      {fmt(ui.resumeFormat, {
                        cur: Math.min(mainAnsweredCount + 1, mainCount),
                        total: mainCount,
                      })}
                    </span>
                    <span className={dir === 'rtl' ? 'rotate-180' : ''}>→</span>
                  </button>
                  <button
                    type="button"
                    onClick={startOver}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-5 text-sm font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-900"
                  >
                    {ui.startOver}
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setStarted(true)}
                  className="group inline-flex w-full items-center justify-between gap-3 rounded-xl bg-gray-950 px-6 py-5 text-base font-semibold text-white transition hover:bg-red-500"
                >
                  <span>{ui.begin}</span>
                  <span className={dir === 'rtl' ? 'rotate-180' : ''}>→</span>
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // -- Single-scroll quiz ----------------------------------------------------
  return (
    <div className="relative min-h-screen bg-gray-50" dir={dir}>
      {/* Sticky progress header */}
      <div className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-6 py-3">
          <div className="flex-1" aria-live="polite">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">
                {fmt(ui.answeredFormat, { answered: mainAnsweredCount, total: mainCount })}
              </span>
              <span className="text-[11px] tracking-[0.15em] text-gray-400">
                {String(progressPct).padStart(2, '0')}%
              </span>
            </div>
            <div
              className="relative mt-1.5 h-px bg-gray-200"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="absolute inset-y-0 h-px bg-red-500 transition-[width] duration-500"
                style={{
                  width: `${progressPct}%`,
                  [dir === 'rtl' ? 'right' : 'left']: 0,
                }}
              />
            </div>
          </div>
          {mainAnsweredCount > 0 && !allAnswered && firstUnansweredIdx >= 0 && (
            <button
              type="button"
              onClick={scrollToFirstUnanswered}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-600 transition hover:border-red-200 hover:text-red-500"
            >
              ↓ Next
            </button>
          )}
        </div>
      </div>

      <div id="q-top" className="mx-auto max-w-2xl px-6 pb-32 pt-10 md:pt-14">
        <div className="space-y-16">
          {flow.map((item) => {
            const q = item.q;
            const isSpecial = item.kind === 'special';
            const isTrigger = isSpecial && item.variant === 'trigger';
            const selected = answers[q.id];
            const isLongText = q.text.length > 250;
            const mainIdx = item.kind === 'main' ? item.mainIdx : null;
            const questionLabel = isSpecial
              ? isTrigger
                ? `${ui.bonusLabel} · 02`
                : `${ui.bonusLabel} · 01`
              : mainIdx != null
              ? fmt(ui.progressFormat, { cur: mainIdx + 1, total: mainCount })
              : '';

            return (
              <section
                key={q.id}
                id={`q-${q.id}`}
                className="scroll-mt-24"
                aria-labelledby={`q-title-${q.id}`}
              >
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={
                      'h-1 w-1 rounded-full ' +
                      (isSpecial ? 'bg-rose-400' : 'bg-red-400')
                    }
                  />
                  <p
                    className={
                      'text-[10px] font-semibold uppercase tracking-[0.2em] ' +
                      (isSpecial ? 'text-rose-500' : 'text-gray-400')
                    }
                  >
                    {questionLabel}
                  </p>
                </div>

                {isLongText ? (
                  <div>
                    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-red-500">
                      {ui.readAndReact}
                    </p>
                    <blockquote className="border-s-2 border-red-400 ps-5">
                      <p
                        id={`q-title-${q.id}`}
                        className="text-[1.1rem] leading-[1.65] text-gray-700 md:text-[1.25rem]"
                      >
                        {q.text}
                      </p>
                    </blockquote>
                  </div>
                ) : (
                  <h2
                    id={`q-title-${q.id}`}
                    className="text-[1.5rem] font-bold leading-[1.2] tracking-tight text-gray-900 md:text-[1.8rem]"
                  >
                    {q.text}
                  </h2>
                )}

                <div
                  className="mt-6 divide-y divide-gray-200 border-y border-gray-200"
                  role="radiogroup"
                  aria-labelledby={`q-title-${q.id}`}
                >
                  {q.options.map((opt, oi) => {
                    const isSel = selected === opt.value;
                    return (
                      <button
                        key={`${q.id}-${oi}`}
                        type="button"
                        role="radio"
                        aria-checked={isSel}
                        onClick={() => onPick(q.id, opt.value)}
                        className={
                          'group grid w-full grid-cols-[2.5rem_1fr] items-start gap-4 px-2 py-4 text-start transition focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 ' +
                          (isSel
                            ? 'bg-gray-950 text-white'
                            : 'text-gray-800 hover:bg-white')
                        }
                      >
                        <span
                          className={
                            'pt-0.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors ' +
                            (isSel
                              ? 'text-red-300'
                              : 'text-gray-400 group-hover:text-red-500')
                          }
                        >
                          {LETTERS[oi] ?? String(oi + 1)}
                        </span>
                        <span
                          className={
                            'text-[1.02rem] leading-[1.5] transition-colors ' +
                            (isSel ? 'text-white' : 'text-gray-800')
                          }
                        >
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* Submit block */}
        <div id="q-submit" className="mt-20 border-t border-gray-200 pt-10">
          <button
            type="button"
            onClick={submit}
            disabled={!allAnswered || submitting}
            className="group inline-flex w-full items-center justify-between gap-3 rounded-xl bg-gray-950 px-6 py-5 text-base font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-gray-950"
          >
            <span>{submitting ? ui.computing : ui.submit}</span>
            <span className={dir === 'rtl' ? 'rotate-180' : ''}>→</span>
          </button>
          {!allAnswered && !submitting && (
            <p className="mt-3 text-center text-xs text-gray-500">
              {fmt(ui.submitIncomplete, { remaining: remainingMain })}
            </p>
          )}
          <button
            type="button"
            onClick={startOver}
            className="mt-4 block w-full text-center text-xs font-medium uppercase tracking-[0.15em] text-gray-400 hover:text-gray-600"
          >
            {ui.restart}
          </button>
        </div>
      </div>
    </div>
  );
}
