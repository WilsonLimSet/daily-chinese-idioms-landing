import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SLANG_CATEGORIES, loadTranslatedSlang, getSlangEras } from '@/src/lib/slang';
import SlangEraFilter from '@/app/components/SlangEraFilter';
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
    title: `${getTranslation(lang, 'slangTitle')} | Chinese Idioms (${langName})`,
    description: getTranslation(lang, 'slangDescription'),
    keywords: ['chinese internet slang', 'chinese slang', '网络用语', 'YYDS', '内卷', langName.toLowerCase()],
    openGraph: {
      title: getTranslation(lang, 'slangTitle'),
      description: getTranslation(lang, 'slangDescription'),
      url: `https://www.chineseidioms.com/${lang}/slang`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/slang`,
      languages: {
        'x-default': '/slang',
        'en': '/slang',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/slang`])
        ),
      },
    },
  };
}

export default async function TranslatedSlangIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const allTerms = loadTranslatedSlang(lang);

  // All structured data values sourced from hardcoded slang definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": getTranslation(lang, 'slangTitle'),
      "description": getTranslation(lang, 'slangDescription'),
      "url": `https://www.chineseidioms.com/${lang}/slang`,
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
          "name": "What does YYDS mean in Chinese?",
          "acceptedAnswer": { "@type": "Answer", "text": allTerms.find(t => t.slug === 'yyds')?.meaning || 'GOAT - Greatest Of All Time' }
        },
        {
          "@type": "Question",
          "name": "What does 内卷 (nèi juǎn) mean?",
          "acceptedAnswer": { "@type": "Answer", "text": allTerms.find(t => t.slug === 'nei-juan')?.meaning || 'Involution - toxic competition' }
        },
        {
          "@type": "Question",
          "name": "What is Chinese internet slang?",
          "acceptedAnswer": { "@type": "Answer", "text": "Chinese internet slang refers to informal expressions used in Chinese social media, messaging apps, and online culture." }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": getTranslation(lang, 'home'), "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": getTranslation(lang, 'slangTitle'), "item": `https://www.chineseidioms.com/${lang}/slang` }
      ]
    }
  ];

  const featured = allTerms.filter(t => ['nei-juan', 'tang-ping', 'yyds'].includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Structured data sourced from hardcoded slang definitions, safe to embed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Nav */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            {getTranslation(lang, 'home')}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-sm font-medium text-neutral-400 mb-4">网络用语 · {allTerms.length} terms</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1] max-w-2xl">
            {getTranslation(lang, 'slangTitle')}
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed mt-5 max-w-xl">
            {getTranslation(lang, 'slangIndexIntro')}
          </p>

          {/* Featured terms */}
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {featured.map(term => (
              <Link
                key={term.slug}
                href={`/${lang}/slang/${term.slug}`}
                className="group p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-150"
              >
                <p className="text-2xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors duration-75">
                  {term.characters}
                </p>
                <p className="text-xs text-neutral-400 mt-1">{term.pinyin}</p>
                <p className="text-sm text-neutral-500 mt-3 leading-relaxed line-clamp-2">{term.meaning}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Content */}
      <SlangEraFilter
        terms={allTerms.map(t => ({ slug: t.slug, characters: t.characters, pinyin: t.pinyin, meaning: t.meaning, category: t.category, era: t.era }))}
        eras={getSlangEras()}
        categories={[...SLANG_CATEGORIES]}
        categoryLabels={Object.fromEntries(
          SLANG_CATEGORIES.map(cat => [
            cat,
            getTranslation(
              lang,
              ('slangCategory' + cat.replace(/[&\s]+/g, '')) as Parameters<typeof getTranslation>[1]
            ),
          ])
        )}
        langPrefix={`/${lang}`}
      />

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <AdUnit type="display" />
      </div>

      <footer className="border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerBuiltBy')}</a>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerBlog')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/dictionary`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'dictionary')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
