import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { PHRASE_CATEGORIES, loadTranslatedPhrases } from '@/src/lib/phrases';
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
    title: `${getTranslation(lang, 'phrasesTitle')} | Chinese Idioms (${langName})`,
    description: getTranslation(lang, 'phrasesDescription'),
    keywords: ['chinese phrases', 'useful chinese phrases', 'practical chinese', 'mandarin phrases', langName.toLowerCase()],
    openGraph: {
      title: getTranslation(lang, 'phrasesTitle'),
      description: getTranslation(lang, 'phrasesDescription'),
      url: `https://www.chineseidioms.com/${lang}/phrases`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/phrases`,
      languages: {
        'x-default': '/phrases',
        'en': '/phrases',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/phrases`])
        ),
      },
    },
  };
}

export default async function TranslatedPhrasesIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const allTerms = loadTranslatedPhrases(lang);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": getTranslation(lang, 'phrasesTitle'),
      "description": getTranslation(lang, 'phrasesDescription'),
      "url": `https://www.chineseidioms.com/${lang}/phrases`,
      "inLanguage": lang,
      "numberOfItems": allTerms.length,
      "hasPart": allTerms.slice(0, 10).map(term => ({
        "@type": "DefinedTerm",
        "name": term.characters,
        "description": term.meaning
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What does 买单 (mǎi dān) mean?",
          "acceptedAnswer": { "@type": "Answer", "text": allTerms.find(t => t.slug === 'mai-dan')?.meaning || 'Check please / pay the bill' }
        },
        {
          "@type": "Question",
          "name": "What does 太贵了 (tài guì le) mean?",
          "acceptedAnswer": { "@type": "Answer", "text": allTerms.find(t => t.slug === 'tai-gui-le')?.meaning || 'Too expensive!' }
        },
        {
          "@type": "Question",
          "name": "What are the most useful Chinese phrases?",
          "acceptedAnswer": { "@type": "Answer", "text": "The most useful Chinese phrases include practical expressions for restaurants, shopping, travel, work, and daily life — covering real situations you'll encounter in China." }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": getTranslation(lang, 'phrasesTitle'), "item": `https://www.chineseidioms.com/${lang}/phrases` }
      ]
    }
  ];

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-amber-600 bg-amber-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

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
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full mb-4">
            <Globe className="w-4 h-4" />
            <span>{getTranslation(lang, 'phrasesTitle')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            {getTranslation(lang, 'phrasesTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            {getTranslation(lang, 'phrasesIndexIntro')}
          </p>
        </header>

        <AdUnit type="display" />

        {/* Category Filter */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{getTranslation(lang, 'phrasesCategory')}</h2>
          <div className="flex flex-wrap gap-2">
            {PHRASE_CATEGORIES.map(category => {
              const count = allTerms.filter(t => t.category === category).length;
              return (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(/[&\s]+/g, '-')}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-all"
                >
                  {category} ({count})
                </a>
              );
            })}
          </div>
        </section>

        {/* Phrases by Category */}
        {PHRASE_CATEGORIES.map((category, catIdx) => {
          const categoryTerms = allTerms.filter(t => t.category === category);
          if (categoryTerms.length === 0) return null;

          return (
            <section key={category} id={category.toLowerCase().replace(/[&\s]+/g, '-')} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {categoryTerms.map(term => (
                  <Link
                    key={term.slug}
                    href={`/${lang}/phrases/${term.slug}`}
                    className="group p-5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                      {term.characters}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{term.pinyin}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{term.meaning}</p>
                    <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor(term.difficulty)}`}>
                      {term.difficulty}
                    </span>
                  </Link>
                ))}
              </div>
              {catIdx > 0 && catIdx % 2 === 0 && <AdUnit type="in-article" />}
            </section>
          );
        })}

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
