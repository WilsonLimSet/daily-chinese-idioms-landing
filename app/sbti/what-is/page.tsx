import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight, Sparkles, Globe, Zap } from 'lucide-react';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'What Is SBTI? The Viral Chinese Personality Test Explained',
  description: 'SBTI (Silly Behavioral Type Indicator) is a 27-type personality test that went viral from Chinese social media in April 2026. Full explainer.',
  keywords: [
    'what is sbti',
    'sbti meaning',
    'sbti test',
    'sbti personality',
    'sbti explained',
    'silly behavioral type indicator',
    'chinese personality test',
    'sbti test origin',
    'sbti test real',
    'sbti accuracy',
  ].join(', '),
  alternates: {
    canonical: 'https://www.chineseidioms.com/sbti/what-is',
    languages: {
      'x-default': '/sbti/what-is',
      en: '/sbti/what-is',
      ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/sbti/what-is`])),
    },
  },
  openGraph: {
    title: 'What Is SBTI? The Viral Chinese Personality Test Explained',
    description: 'The 27-type personality test that broke Chinese social media — origin, mechanics, and cultural meaning.',
    url: 'https://www.chineseidioms.com/sbti/what-is',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'article',
  },
};

const FAQ = [
  {
    q: 'What does SBTI stand for?',
    a: 'SBTI stands for "Silly Behavioral Type Indicator" — a deliberate parody of MBTI ("Myers-Briggs Type Indicator"). The "silly" is self-aware: SBTI openly calls itself entertainment rather than a psychological assessment.',
  },
  {
    q: 'Who created SBTI?',
    a: 'SBTI was created by a Chinese content creator on Bilibili known as @蛆肉儿串儿 (Qū Ròu Er Chuàn Er). The creator originally made it as a joke to convince a friend to stop drinking, and it spread from Bilibili to Weibo, Xiaohongshu, and eventually global social media.',
  },
  {
    q: 'When did SBTI go viral?',
    a: 'April 9, 2026. Within days, the WeChat Index for "SBTI" hit 40.85 million and discussions across Chinese social platforms exceeded 20 million. English-language coverage followed within the week.',
  },
  {
    q: 'How does the SBTI test work?',
    a: 'You answer 30 multiple-choice questions about your daily habits, relationship styles, emotional patterns, and reactions. The test maps your answers across 15 dimensions organized into 5 models (self, emotion, attitude, behavior drive, social) and produces one of 27 types — 25 regular types, plus the fallback HHHH type and the hidden DRUNK type.',
  },
  {
    q: 'What are the 27 SBTI types?',
    a: 'The 25 regular types: CTRL (Controller), ATM-er (Giver), Dior-s (Loser-Sage), BOSS (Leader), THAN-K (Thankful One), OH-NO (Disaster Preventer), GOGO (Doer), SEXY (Magnetic One), LOVE-R (Romantic), MUM (Mother), FAKE (Mask Shifter), OJBK (Whatever Person), MALO (Trickster), JOKE-R (Clown), WOC (Whoa Person), THIN-K (Thinker), SHIT (Bitter World-Saver), ZZZZ (Deadliner), POOR (Narrow Beam), MONK (Monk), IMSB (Self-Defeating Fool), SOLO (Isolated One), FUCK (Wild Force), DEAD (Exhausted Sage), IMFW (Fragile Believer). Plus two special types: HHHH (fallback) and DRUNK (hidden).',
  },
  {
    q: 'Is SBTI accurate?',
    a: 'SBTI is explicitly entertainment. It has no scientific validation, no clinical research, and no claim to psychological accuracy. That said, many people find the labels shockingly specific — because they describe recognizable modern behaviors (the friend who always pays, the one who cancels plans, the workplace drunk) in ways serious tests avoid.',
  },
  {
    q: 'What is the DRUNK type?',
    a: 'DRUNK is a hidden Easter-egg type. To trigger it, you have to select "Drinking" on the hobby question AND choose a specific alcohol-related follow-up. It was added by the creator as a self-reference to the original "convince a friend to stop drinking" story.',
  },
  {
    q: 'What is the HHHH type?',
    a: 'HHHH is the fallback — if your answers contradict each other across the 15 dimensions (meaning your response pattern doesn\'t match any of the 25 regular types), the system returns HHHH. The name is onomatopoeia for the Chinese laugh "哈哈哈哈" (hahaha), suggesting "laugh or cry" at your own contradictions.',
  },
  {
    q: 'Can I take the SBTI test in English?',
    a: 'Yes. The test is available in English and about 12 other languages including Japanese, Korean, Spanish, Portuguese, French, German, Indonesian, and more. Type names stay in their original form (CTRL, BOSS, MALO) across languages because they\'re brand identifiers.',
  },
  {
    q: 'Where can I take the SBTI test?',
    a: 'Take it here: /sbti/test hosts the full 30-question quiz, free, no signup, instant result. Your answers stay in your browser (nothing sent to a server). We also have localized versions in 14 languages. Afterwards you land on a result page with your 15-dimension radar and links to your type\'s full profile with matching Chinese idioms (chengyu).',
  },
  {
    q: 'Why is SBTI rooted in Chinese culture?',
    a: 'The type names encode Chinese internet slang. ATM-er is 送钱者 (money-sender, someone who always pays). MALO is 吗喽 (monkey-emoji slang). SHIT is 愤世者 (cynic). DRUNK is 酒鬼 (drunkard). Each name is a phonetic or visual echo of a specific Chinese online archetype, which is why the test feels so "targeted" to anyone who\'s spent time on Chinese social media — and why we pair each type with matching Chinese idioms (chengyu, 成语).',
  },
  {
    q: 'How is SBTI different from MBTI?',
    a: 'MBTI has 16 types based on Jungian cognitive function theory; SBTI has 27 types based on internet culture and modern life satire. MBTI frames itself as serious self-knowledge; SBTI frames itself as a meme. MBTI type names are abstract (INTJ, ENFP); SBTI type names describe behaviors you\'d recognize in your group chat. See our full SBTI vs MBTI comparison.',
  },
];

export default function WhatIsSbtiPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'What Is SBTI? The Viral Chinese Personality Test Explained',
      description: 'SBTI origin, mechanics, type system, and cultural context.',
      author: { '@type': 'Organization', name: 'Chinese Idioms' },
      publisher: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        logo: { '@type': 'ImageObject', url: 'https://www.chineseidioms.com/icon.png' },
      },
      mainEntityOfPage: 'https://www.chineseidioms.com/sbti/what-is',
      datePublished: '2026-04-16',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id="what-is-sbti-ld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/sbti" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI Guide
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span>SBTI Explained</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            What Is SBTI? The Viral Chinese Personality Test Explained
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            SBTI is a 27-type personality test that went viral from Chinese social media on April 9, 2026. Unlike MBTI, it doesn&apos;t try to be serious — the names (CTRL, BOSS, DRUNK) and vibe are openly satirical. Here&apos;s everything you need to know.
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Sparkles className="w-8 h-8 text-indigo-500 mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">27 Types</h3>
            <p className="text-sm text-gray-600">25 regular + HHHH fallback + hidden DRUNK</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Zap className="w-8 h-8 text-orange-500 mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">15 Dimensions</h3>
            <p className="text-sm text-gray-600">Mapped across 5 models: self, emotion, attitude, behavior, social</p>
          </div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <Globe className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-bold text-gray-900 mb-1">12+ Languages</h3>
            <p className="text-sm text-gray-600">English, Chinese, Japanese, Korean, Spanish, and more</p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">How SBTI went viral</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            On April 9, 2026, a Bilibili creator known as @蛆肉儿串儿 posted a personality test originally made as a joke — a way to convince a friend to stop drinking. Within 48 hours, the hidden DRUNK type had become a meme; within a week, the WeChat Index for &quot;SBTI&quot; hit 40.85 million.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            What made it spread: every type name encodes a specific Chinese internet archetype. <strong>ATM-er</strong> is 送钱者 (the one who always pays). <strong>MALO</strong> is 吗喽 (the monkey-emoji chaos person). <strong>SHIT</strong> is 愤世者 (the bitter cynic who still cares). These labels felt more <em>true</em> to modern online life than any INTJ or ENFP ever could — which is exactly why they work as shareable result screenshots.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By April 15, the test had jumped languages: Japanese Twitter, Korean Naver, English TikTok, and Spanish Xiaohongshu crossposts. Chineseidioms.com pairs every SBTI type with the classical Chinese idioms (chengyu, 成语) that capture its vibe — bridging the viral Chinese internet language with its deeper cultural roots.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">The 27 SBTI types at a glance</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            {[
              'CTRL — Controller', 'ATM-er — Giver', 'Dior-s — Loser-Sage', 'BOSS — Leader', 'THAN-K — Thankful', 'OH-NO — Preventer',
              'GOGO — Doer', 'SEXY — Magnetic', 'LOVE-R — Romantic', 'MUM — Mother', 'FAKE — Mask Shifter', 'OJBK — Whatever',
              'MALO — Trickster', 'JOKE-R — Clown', 'WOC — Whoa', 'THIN-K — Thinker', 'SHIT — Bitter', 'ZZZZ — Deadliner',
              'POOR — Narrow Beam', 'MONK — Monk', 'IMSB — Self-Defeating', 'SOLO — Isolated', 'FUCK — Wild Force', 'DEAD — Exhausted',
              'IMFW — Fragile', 'HHHH — Fallback ★', 'DRUNK — Hidden ★',
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-gray-100 shadow-sm text-gray-700">{t}</div>
            ))}
          </div>
          <Link href="/sbti" className="inline-flex items-center gap-1 mt-4 text-indigo-600 hover:text-indigo-700 font-bold text-sm">
            Full type directory
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        <AdUnit type="in-article" />

        <section className="mb-12">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Find Your SBTI Type</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Take the test, then come back to read your type&apos;s full profile — traits, recognition signals, compatible matches, and Chinese idioms that capture the vibe.
          </p>
          <Link
            href="/sbti"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
          >
            Explore All 27 Types
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href="/sbti" className="text-gray-600 hover:text-gray-900">SBTI</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang="en" />
          </div>
        </div>
      </footer>
    </div>
  );
}
