import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { getAllListicles } from '@/src/lib/listicles';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'SBTI Personality Test Guide — All 27 Types Matched to Chinese Idioms',
  description: 'Got your SBTI result? Find the Chinese idiom (chengyu) that matches every one of the 27 SBTI personality types — CTRL, BOSS, DRUNK, MALO and more.',
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
  },
  openGraph: {
    title: 'SBTI Personality Test — All 27 Types Matched to Chinese Idioms',
    description: 'Every SBTI personality type paired with the Chinese idioms (chengyu) that capture its vibe. CTRL, BOSS, MALO, DRUNK and more.',
    url: 'https://www.chineseidioms.com/sbti',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SBTI Personality Test — All 27 Types + Chinese Idioms',
    description: 'Every SBTI type paired with the Chinese chengyu that captures its vibe.',
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
    a: "The official test is hosted at several Chinese-origin sites. We don't host the quiz ourselves — we're the place to land after you take it, to understand your type in depth and see which Chinese idioms match your result.",
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
          url: `https://www.chineseidioms.com/blog/lists/${t.slug}`,
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
    <div className="min-h-screen bg-gray-50">
      <Script
        id="sbti-hub-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span>SBTI Personality Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            SBTI Personality Test — All 27 Types, Explained with Chinese Idioms
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            SBTI (Silly Behavioral Type Indicator) is the viral Chinese parody of MBTI that took over social media in April 2026. We&apos;ve paired every one of the 27 types with the Chinese idioms (chengyu, 成语) that best capture its vibe — so you can read yourself in two cultural languages at once.
          </p>
        </header>

        <div className="mb-10 border-l-4 border-indigo-500 pl-6 py-4 bg-gradient-to-r from-indigo-50/50 to-transparent rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            <strong>Already have your SBTI result?</strong> Jump to your type below to see which 5 Chinese idioms match it — each one paired with pinyin, literal meaning, and the story behind it.
          </p>
        </div>

        <AdUnit type="display" />

        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">The 25 Regular Types</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regularTypes.map((t) => {
              const exists = existingSbtiSlugs.has(t.slug);
              const card = (
                <div className="group h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                      {t.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{t.displayName}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{t.vibe}</p>
                  <div className="mt-4 flex items-center gap-1 text-indigo-600 font-medium text-sm">
                    <span>See matching idioms</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
              return exists ? (
                <Link key={t.code} href={`/blog/lists/${t.slug}`}>{card}</Link>
              ) : (
                <div key={t.code} className="opacity-60 cursor-not-allowed">{card}</div>
              );
            })}
          </div>
        </section>

        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">The 2 Special Types</h2>
          <p className="text-gray-600 mb-6">HHHH is the fallback when your answers contradict each other; DRUNK is the hidden Easter-egg type unlocked by specific alcohol-related answers.</p>
          <div className="grid gap-4 md:grid-cols-2">
            {specialTypes.map((t) => {
              const exists = existingSbtiSlugs.has(t.slug);
              const card = (
                <div className="group h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-5 hover:shadow-xl hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-white/80 px-2 py-1 rounded">
                      {t.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-700 transition-colors">{t.displayName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.vibe}</p>
                  <div className="mt-4 flex items-center gap-1 text-orange-700 font-medium text-sm">
                    <span>See matching idioms</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
              return exists ? (
                <Link key={t.code} href={`/blog/lists/${t.slug}`}>{card}</Link>
              ) : (
                <div key={t.code} className="opacity-60 cursor-not-allowed">{card}</div>
              );
            })}
          </div>
        </section>

        <AdUnit type="in-article" />

        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map(({ q, a }, i) => (
              <details key={i} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <summary className="cursor-pointer font-semibold text-gray-900 text-base sm:text-lg flex items-start justify-between gap-4">
                  <span>{q}</span>
                  <ChevronRight className="w-5 h-5 mt-1 flex-shrink-0 text-gray-400 group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-3 text-gray-600 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-center">
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Learn Chinese Idioms Daily</h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              Every Chinese idiom (chengyu) in our library has pinyin, literal meaning, cultural story, and a real example. Get one delivered to your home screen every day.
            </p>
            <a
              href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
            >
              Download Free App
            </a>
          </div>
        </section>

        <div className="mt-12 text-center">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium">
            <BookOpen className="w-4 h-4" />
            Browse all Chinese idiom lists
          </Link>
        </div>
      </article>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
