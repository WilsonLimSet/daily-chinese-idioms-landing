import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { HSK_LEVEL_DESCRIPTIONS, getHSKByLevel } from '@/src/lib/hsk';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  return {
    title: `${getTranslation(lang, 'hskTitle')} | Chinese Idioms (${langName})`,
    description: getTranslation(lang, 'hskDescription'),
    keywords: ['HSK vocabulary', 'HSK word list', '汉语水平考试', 'HSK 1', 'HSK 2', 'HSK 3', langName.toLowerCase()],
    openGraph: {
      title: getTranslation(lang, 'hskTitle'),
      description: getTranslation(lang, 'hskDescription'),
      url: `https://www.chineseidioms.com/${lang}/hsk`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/hsk`,
      languages: {
        'x-default': '/hsk',
        'en': '/hsk',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/hsk`])
        ),
      },
    },
  };
}

export default async function TranslatedHSKIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  const colors = [
    'from-green-500 to-emerald-600',
    'from-blue-500 to-indigo-600',
    'from-yellow-500 to-orange-600',
    'from-orange-500 to-red-600',
    'from-red-500 to-pink-600',
    'from-purple-500 to-violet-600',
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": getTranslation(lang, 'hskTitle'),
      "description": getTranslation(lang, 'hskDescription'),
      "url": `https://www.chineseidioms.com/${lang}/hsk`,
      "inLanguage": lang,
      "numberOfItems": 6,
      "hasPart": Object.entries(HSK_LEVEL_DESCRIPTIONS).map(([level, info]) => ({
        "@type": "ItemList",
        "name": info.title,
        "url": `https://www.chineseidioms.com/${lang}/hsk/${level}`,
        "numberOfItems": getHSKByLevel(parseInt(level)).length
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the HSK test?",
          "acceptedAnswer": { "@type": "Answer", "text": "HSK (Hanyu Shuiping Kaoshi) is China's standardized test of Chinese language proficiency for non-native speakers. It has 6 levels, from HSK 1 (beginner, ~150 words) to HSK 6 (advanced, ~5000 words)." }
        },
        {
          "@type": "Question",
          "name": "How many HSK levels are there?",
          "acceptedAnswer": { "@type": "Answer", "text": "There are 6 HSK levels. HSK 1-2 are beginner (CEFR A1-A2), HSK 3-4 are intermediate (B1-B2), and HSK 5-6 are advanced (C1-C2)." }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": getTranslation(lang, 'hskTitle'), "item": `https://www.chineseidioms.com/${lang}/hsk` }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(structuredData)}
      </script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {getTranslation(lang, 'home')}
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4">
            <GraduationCap className="w-4 h-4" />
            <span>{getTranslation(lang, 'hskTitle')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            {getTranslation(lang, 'hskTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            {getTranslation(lang, 'hskIndexIntro')}
          </p>
        </header>

        <AdUnit type="display" />

        <div className="grid gap-6 sm:grid-cols-2">
          {Object.entries(HSK_LEVEL_DESCRIPTIONS).map(([level, info]) => {
            const levelNum = parseInt(level);
            const wordCount = getHSKByLevel(levelNum).length;

            return (
              <Link
                key={level}
                href={`/${lang}/hsk/${level}`}
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
                        {getTranslation(lang, 'hskCEFR')} {info.cefrLevel}
                      </span>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {wordCount} {getTranslation(lang, 'hskWords')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <AdUnit type="multiplex" />
      </main>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">{getTranslation(lang, 'footerBuiltBy')}</a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 transition-colors">{getTranslation(lang, 'footerBlog')}</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href={`/${lang}/dictionary`} className="text-gray-600 hover:text-gray-900 transition-colors">{getTranslation(lang, 'dictionary')}</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
