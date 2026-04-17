import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import { getAllListicles } from '@/src/lib/listicles';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'SBTI Test: All 27 Personality Types Explained (2026 Guide)',
  description: 'The viral Chinese 27-type personality test, fully explained. Traits, strengths, compatibility, and the Chinese idiom (chengyu) that captures each type — CTRL, BOSS, DRUNK, MALO and more.',
  keywords: [
    'sbti',
    'sbti test',
    'sbti personality test',
    'sbti types',
    'sbti 27 types',
    'sbti meaning',
    'sbti vs mbti',
    'what is sbti',
    'sbti chinese idioms',
    'silly behavioral type indicator',
  ],
  alternates: {
    canonical: 'https://www.chineseidioms.com/sbti',
    languages: {
      'x-default': '/sbti',
      en: '/sbti',
      ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/sbti`])),
    },
  },
  openGraph: {
    title: 'SBTI Test — All 27 Personality Types Explained',
    description: 'The viral Chinese 27-type personality test. Full guide to every type — CTRL, BOSS, MALO, DRUNK and more — with traits, compatibility, and the chengyu that matches each one.',
    url: 'https://www.chineseidioms.com/sbti',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SBTI Test — All 27 Personality Types Explained',
    description: 'The viral Chinese 27-type personality test — every type explained, with the chengyu that captures its vibe.',
  },
};

const SBTI_TYPES: Array<{
  code: string;
  displayName: string;
  vibe: string;
  slug: string;
  isSpecial?: boolean;
}> = [
  { code: 'CTRL', displayName: 'The Controller', vibe: 'Control, execution, structure', slug: 'sbti-ctrl-personality-chinese-idioms' },
  { code: 'ATM-er', displayName: 'The Giver', vibe: 'Self-sacrificing, always pays', slug: 'sbti-atmer-personality-chinese-idioms' },
  { code: 'Dior-s', displayName: 'The Loser-Sage', vibe: 'Low desire, anti-hustle', slug: 'sbti-diors-personality-chinese-idioms' },
  { code: 'BOSS', displayName: 'The Leader', vibe: 'Direction, authority, upward force', slug: 'sbti-boss-personality-chinese-idioms' },
  { code: 'THAN-K', displayName: 'The Thankful One', vibe: 'Optimism, warmth, recovery', slug: 'sbti-thank-personality-chinese-idioms' },
  { code: 'OH-NO', displayName: 'The Disaster Preventer', vibe: 'Risk-aware, cautious, prevention-first', slug: 'sbti-ohno-personality-chinese-idioms' },
  { code: 'GOGO', displayName: 'The Doer', vibe: 'Action first, decisive momentum', slug: 'sbti-gogo-personality-chinese-idioms' },
  { code: 'SEXY', displayName: 'The Magnetic One', vibe: 'Presence, allure, attention-gravity', slug: 'sbti-sexy-personality-chinese-idioms' },
  { code: 'LOVE-R', displayName: 'The Romantic Maximalist', vibe: 'Intensity, devotion, idealism', slug: 'sbti-lover-personality-chinese-idioms' },
  { code: 'MUM', displayName: 'The Mother', vibe: 'Empathy, soothing, caregiving', slug: 'sbti-mum-personality-chinese-idioms' },
  { code: 'FAKE', displayName: 'The Mask Shifter', vibe: 'Adaptive, performative, layered', slug: 'sbti-fake-personality-chinese-idioms' },
  { code: 'OJBK', displayName: 'The Whatever Person', vibe: 'Easygoing, low-conflict, flow', slug: 'sbti-ojbk-personality-chinese-idioms' },
  { code: 'MALO', displayName: 'The Monkey Brain Trickster', vibe: 'Playful, inventive, anti-formal', slug: 'sbti-malo-personality-chinese-idioms' },
  { code: 'JOKE-R', displayName: 'The Clown', vibe: 'Humor with hidden depth', slug: 'sbti-joker-personality-chinese-idioms' },
  { code: 'WOC!', displayName: 'The "Whoa" Person', vibe: 'Loud reaction, quiet judgment', slug: 'sbti-woc-personality-chinese-idioms' },
  { code: 'THIN-K', displayName: 'The Thinker', vibe: 'Logic, analysis, deliberation', slug: 'sbti-think-personality-chinese-idioms' },
  { code: 'SHIT', displayName: 'The Bitter World-Saver', vibe: 'Cynical outside, caring inside', slug: 'sbti-shit-personality-chinese-idioms' },
  { code: 'ZZZZ', displayName: 'The Deadliner', vibe: 'Procrastination, emergency awakening', slug: 'sbti-zzzz-personality-chinese-idioms' },
  { code: 'POOR', displayName: 'The Narrow Beam', vibe: 'Intense focus, selective energy', slug: 'sbti-poor-personality-chinese-idioms' },
  { code: 'MONK', displayName: 'The Monk', vibe: 'Privacy, distance, sacred space', slug: 'sbti-monk-personality-chinese-idioms' },
  { code: 'IMSB', displayName: 'The Self-Defeating Fool', vibe: 'Overcomplicates, backfires', slug: 'sbti-imsb-personality-chinese-idioms' },
  { code: 'SOLO', displayName: 'The Isolated One', vibe: 'Defensive distance, hidden sensitivity', slug: 'sbti-solo-personality-chinese-idioms' },
  { code: 'FUCK', displayName: 'The Wild Force', vibe: 'Untamed, raw vitality, instinct', slug: 'sbti-fuck-personality-chinese-idioms' },
  { code: 'DEAD', displayName: 'The Exhausted Sage', vibe: 'Burnout, low thrill, post-meaning', slug: 'sbti-dead-personality-chinese-idioms' },
  { code: 'IMFW', displayName: 'The Fragile Believer', vibe: 'Sensitive, dependent, low armor', slug: 'sbti-imfw-personality-chinese-idioms' },
  { code: 'HHHH', displayName: 'The Fallback Laugher', vibe: 'Confusion, contradictions, absurdity', slug: 'sbti-hhhh-personality-chinese-idioms', isSpecial: true },
  { code: 'DRUNK', displayName: 'The Drunkard (hidden)', vibe: 'Escapism, chaos, alcohol-triggered', slug: 'sbti-drunk-personality-chinese-idioms', isSpecial: true },
];

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is the SBTI personality test?',
    a: 'SBTI (Silly Behavioral Type Indicator) is a viral Chinese personality test that parodies MBTI. It uses 15 dimensions and 30+ questions to sort people into 27 types with internet-slang names like CTRL, BOSS, MALO, and DRUNK. The test is for entertainment — not clinical assessment — but resonated because its labels feel brutally specific to modern life.',
  },
  {
    q: 'Where did SBTI come from?',
    a: 'SBTI was created by Chinese content creator @蛆肉儿串儿 on Bilibili as a joke to convince a friend to stop drinking. It went viral on Chinese social media on April 9, 2026, reaching 40+ million on the WeChat Index and crossing into global social platforms within days.',
  },
  {
    q: 'How many SBTI types are there?',
    a: "There are 27 SBTI types — 25 regular types plus 2 special ones: HHHH (a fallback for answers that don't match any pattern) and DRUNK (a hidden Easter-egg type triggered by specific alcohol-related answer choices).",
  },
  {
    q: 'What is SBTI vs MBTI?',
    a: 'MBTI (Myers-Briggs Type Indicator) is a classical, professionally framed personality model rooted in Jungian psychology with 16 types. SBTI is a satirical modern alternative built on internet culture with 27 types, deliberately-absurd names, and zero claim to scientific rigor. Think of MBTI as a self-serious mirror and SBTI as a meme-laden one.',
  },
  {
    q: 'What do the SBTI type names mean?',
    a: 'SBTI type names are stylized renderings of Chinese internet slang — for example, ATM-er references 送钱者 ("money-sender," someone who always pays), MALO references 吗喽 (a monkey-emoji slang term for chaotic goofiness), and SHIT references 愤世者 ("the bitter one"). Each English-side name is a phonetic or visual echo of the Chinese original.',
  },
  {
    q: 'Why match SBTI types to Chinese idioms (chengyu)?',
    a: 'SBTI is rooted in Chinese internet culture, and Chinese idioms (成语, chengyu) have centuries of precise emotional vocabulary for exactly the traits SBTI tries to capture. Pairing each SBTI type with 5 matching chengyu gives you a richer cultural read on who the type really is — and teaches you genuinely useful Chinese along the way.',
  },
  {
    q: 'Where can I take the SBTI test?',
    a: "You can take the SBTI test right here — see /sbti/test for the full 30-question quiz, free and in English. The result page shows your type, your 15-dimension radar, and links to the full profile with matching Chinese idioms. We also offer localized versions in 14 languages at /{lang}/sbti/test.",
  },
];

export default function SbtiHubPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SBTI Personality Test — All 27 Types',
      description: 'Every SBTI personality type paired with the Chinese idioms (chengyu) that capture its vibe.',
      url: 'https://www.chineseidioms.com/sbti',
      publisher: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        url: 'https://www.chineseidioms.com',
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: SBTI_TYPES.length,
        itemListElement: SBTI_TYPES.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `SBTI ${t.code} — ${t.displayName}`,
          url: `https://www.chineseidioms.com/sbti/${t.code.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(({ q, a }) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'SBTI Test Guide', item: 'https://www.chineseidioms.com/sbti' },
      ],
    },
  ];

  const regularTypes = SBTI_TYPES.filter(t => !t.isSpecial);
  const specialTypes = SBTI_TYPES.filter(t => t.isSpecial);

  const all = getAllListicles();
  const existingSbtiSlugs = new Set(all.filter(l => l.category === 'SBTI Personality').map(l => l.slug));

  return (
    <div className="min-h-screen flex flex-col">
      <Script
        id="sbti-hub-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-end pr-4"
        >
          <span className="text-[28vw] font-bold leading-none tracking-tight text-white/[0.035] md:text-[22rem]">
            SBTI
          </span>
        </div>

        <nav className="relative mx-auto max-w-5xl px-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </nav>

        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16 md:pt-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
            The Personality Guide · Apr 2026
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Silly Behavioral
            <br />
            <span className="text-red-400">Type Indicator</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            The viral Chinese parody of MBTI. 27 types. 15 dimensions. 30 questions. We paired every type with the Chinese idioms (chengyu, 成语) that capture its vibe.
          </p>

          {/* Quick nav: types */}
          <div className="mt-12 flex flex-wrap gap-2">
            {regularTypes.slice(0, 10).map(t => (
              <a
                key={t.code}
                href={`#${t.code.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.1]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                  {t.code}
                </span>
                <span className="text-white/60 group-hover:text-white/80">{t.displayName}</span>
              </a>
            ))}
            <span className="inline-flex items-center px-2 text-xs text-white/40">
              +{regularTypes.length - 10 + specialTypes.length} more
            </span>
          </div>
        </div>
      </section>

      {/* Take the test CTA — primary action bar */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Don&apos;t know your type yet?
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                Take the 30-question test
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-red-400" />~5 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-red-400" />Instant result
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1 w-1 rounded-full bg-red-400" />Free · no signup
                </span>
              </p>
            </div>
            <Link
              href="/sbti/test"
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              Start the test
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          {/* 25 regular types */}
          <article className="mb-20">
            <div className="mb-10 flex items-start gap-6 sm:gap-8">
              <div className="hidden w-24 shrink-0 pt-1 sm:block">
                <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">25</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  The catalogue
                </p>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  The 25 regular types
                </h2>
                <p className="mt-1 text-gray-500">Every type paired with matching chengyu.</p>
              </div>
            </div>

            <div className="grid gap-3 sm:ml-32 sm:grid-cols-2 lg:grid-cols-3">
              {regularTypes.map(t => {
                const exists = existingSbtiSlugs.has(t.slug);
                const anchor = t.code.toLowerCase().replace(/[^a-z0-9]/g, '');
                const card = (
                  <div
                    id={anchor}
                    className="group flex h-full flex-col justify-between rounded-lg border border-gray-200/80 bg-white p-5 transition hover:border-red-200 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-red-400" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                          {t.code}
                        </span>
                      </div>
                      <h3 className="mt-2 font-bold leading-snug text-gray-900 transition-colors group-hover:text-gray-900">
                        {t.displayName}
                      </h3>
                      <p className="mt-1 text-sm leading-[1.5] text-gray-500">{t.vibe}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 transition-colors group-hover:text-red-500">
                      <span>Read more</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                );
                return exists ? (
                  <Link key={t.code} href={`/blog/lists/${t.slug}`}>
                    {card}
                  </Link>
                ) : (
                  <div key={t.code} className="cursor-not-allowed opacity-50">
                    {card}
                  </div>
                );
              })}
            </div>
          </article>

          {/* Special types — dark callout */}
          <article className="mb-20">
            <div className="mb-10 flex items-start gap-6 sm:gap-8">
              <div className="hidden w-24 shrink-0 pt-1 sm:block">
                <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">02</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Hidden inside
                </p>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  The 2 special types
                </h2>
                <p className="mt-1 text-gray-500">
                  HHHH is the fallback. DRUNK is an Easter egg only unlocked by a specific answer.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:ml-32 md:grid-cols-2">
              {specialTypes.map(t => {
                const exists = existingSbtiSlugs.has(t.slug);
                const card = (
                  <div className="relative overflow-hidden rounded-xl bg-gray-950 p-6 transition hover:bg-gray-900">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-4 -right-4 select-none font-serif text-[100px] leading-none text-white/[0.05]"
                    >
                      {t.code === 'HHHH' ? '?' : '!'}
                    </div>
                    <div className="relative">
                      <div className="inline-flex items-center gap-1.5 rounded bg-red-500/20 px-2 py-0.5">
                        <span className="h-1 w-1 rounded-full bg-red-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300">
                          {t.code}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-white">{t.displayName}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">{t.vibe}</p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-red-300">
                        <span>Read more</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                );
                return exists ? (
                  <Link key={t.code} href={`/blog/lists/${t.slug}`}>
                    {card}
                  </Link>
                ) : (
                  <div key={t.code} className="cursor-not-allowed opacity-50">
                    {card}
                  </div>
                );
              })}
            </div>
          </article>

          <AdUnit type="in-article" />

          {/* FAQ */}
          <section className="mt-20 border-t border-gray-200 pt-16">
            <div className="mb-10 flex items-start gap-6 sm:gap-8">
              <div className="hidden w-24 shrink-0 pt-1 sm:block">
                <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">?</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Frequently asked
                </p>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  Questions people actually ask
                </h2>
              </div>
            </div>
            <div className="grid gap-x-12 gap-y-8 sm:ml-32 md:grid-cols-2">
              {FAQ.map(({ q, a }, i) => (
                <div key={i}>
                  <h3 className="mb-2 font-semibold text-gray-900">{q}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* App promo — dark editorial callout */}
          <section className="relative mt-20 overflow-hidden rounded-xl bg-gray-950 p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-8 -right-4 select-none text-[16rem] font-bold leading-none tracking-tight text-white/[0.03]"
            >
              成语
            </div>
            <div className="relative max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-red-300">
                Daily ritual
              </p>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Learn one Chinese idiom a day
              </h2>
              <p className="mt-3 text-base leading-[1.7] text-white/60">
                Every chengyu in our library has pinyin, literal meaning, cultural story, and a real example. Get one delivered to your home screen every day.
              </p>
              <a
                href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-red-400 hover:text-white"
              >
                Download the free app
                <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </section>

          <div className="mt-12 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-gray-900"
            >
              <BookOpen className="h-4 w-4" />
              Browse all Chinese idiom lists
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                Blog
              </Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                Privacy Policy
              </Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
