import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { HSK_LEVEL_DESCRIPTIONS, getHSKByLevel } from '@/src/lib/hsk';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'HSK Vocabulary Lists (Levels 1-6) — Essential Chinese Words | Chinese Idioms',
  description: 'Study essential Chinese vocabulary organized by HSK level (1-6). Each word includes pinyin pronunciation, English meaning, part of speech, and example sentences.',
  keywords: ['HSK vocabulary', 'HSK word list', 'HSK 1 vocabulary', 'HSK 2 words', 'HSK 3 vocabulary list', 'HSK 4 words', 'HSK 5 vocabulary', 'HSK 6 words', 'chinese proficiency test', 'learn chinese vocabulary'],
  openGraph: {
    title: 'HSK Vocabulary Lists (Levels 1-6)',
    description: 'Study essential Chinese vocabulary organized by HSK level. Each word includes pinyin, meaning, and examples.',
    url: 'https://www.chineseidioms.com/hsk',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/hsk',
    languages: {
      'x-default': '/hsk',
      'en': '/hsk',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/hsk`])
      ),
    },
  },
};

export default function HSKIndexPage() {
  // Static structured data for SEO, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "HSK Vocabulary Lists",
      "description": "Essential Chinese vocabulary organized by HSK level (1-6).",
      "url": "https://www.chineseidioms.com/hsk",
      "numberOfItems": 6,
      "hasPart": Object.entries(HSK_LEVEL_DESCRIPTIONS).map(([level, info]) => ({
        "@type": "ItemList",
        "name": info.title,
        "description": info.description,
        "url": `https://www.chineseidioms.com/hsk/${level}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the HSK test?",
          "acceptedAnswer": { "@type": "Answer", "text": "HSK (Hanyu Shuiping Kaoshi / 汉语水平考试) is China's standardized test of Chinese language proficiency for non-native speakers. It has 6 levels, from HSK 1 (beginner, ~150 words) to HSK 6 (advanced, ~5000 words)." }
        },
        {
          "@type": "Question",
          "name": "How many HSK levels are there?",
          "acceptedAnswer": { "@type": "Answer", "text": "There are 6 HSK levels. HSK 1-2 are beginner (CEFR A1-A2), HSK 3-4 are intermediate (B1-B2), and HSK 5-6 are advanced (C1-C2)." }
        },
        {
          "@type": "Question",
          "name": "How many words do I need for each HSK level?",
          "acceptedAnswer": { "@type": "Answer", "text": "HSK 1: 150 words, HSK 2: 300 words, HSK 3: 600 words, HSK 4: 1200 words, HSK 5: 2500 words, HSK 6: 5000+ words." }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "HSK Vocabulary", "item": "https://www.chineseidioms.com/hsk" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Safe static JSON-LD for SEO - contains only hardcoded content, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>HSK Vocabulary</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            HSK Vocabulary Lists
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            The HSK (汉语水平考试) is the standardized Chinese proficiency test. Browse vocabulary by level to build your Chinese skills systematically from beginner to mastery.
          </p>
        </header>

        <AdUnit type="display" />

        {/* Level Cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(HSK_LEVEL_DESCRIPTIONS).map(([level, info]) => {
            const levelNum = parseInt(level);
            const wordCount = getHSKByLevel(levelNum).length;
            const colors = [
              'from-green-500 to-emerald-600',
              'from-blue-500 to-indigo-600',
              'from-yellow-500 to-orange-600',
              'from-orange-500 to-red-600',
              'from-red-500 to-pink-600',
              'from-purple-500 to-violet-600',
            ];

            return (
              <Link
                key={level}
                href={`/hsk/${level}`}
                className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-14 h-14 bg-gradient-to-br ${colors[levelNum - 1]} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <span className="text-white font-bold text-xl">{level}</span>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {info.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1 mb-3">{info.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        CEFR {info.cefrLevel}
                      </span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {info.wordCount}
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {wordCount} curated words
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <AdUnit type="multiplex" />

        {/* About HSK */}
        <section className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About the HSK Test</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is the HSK?</h3>
              <p>The HSK (汉语水平考试, Hànyǔ Shuǐpíng Kǎoshì) is China&apos;s standardized test of Chinese language proficiency for non-native speakers. It is recognized worldwide by universities, employers, and government organizations.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How many levels does the HSK have?</h3>
              <p>The HSK has 6 levels, from HSK 1 (beginner, ~150 words) to HSK 6 (mastery, 5,000+ words). Each level tests listening, reading, and writing skills with increasing complexity. The levels roughly correspond to CEFR levels A1 through C2.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How should I study for the HSK?</h3>
              <p>Start with the level that matches your current ability. Focus on mastering all vocabulary for that level, practice with example sentences, and take mock tests. Our curated word lists include the most important words for each level.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Built by Wilson</a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/dictionary" className="text-gray-600 hover:text-gray-900 transition-colors">Dictionary</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
