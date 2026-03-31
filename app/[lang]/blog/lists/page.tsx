import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllListiclesTranslated } from '@/src/lib/listicles';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import ListicleFilter from '@/app/components/ListicleFilter';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({ lang }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  return {
    title: `250+ Chinese Idiom Lists — Love, Life, Success & More | ${nativeName}`,
    description: `Explore 250+ curated Chinese idiom (成语) lists in ${nativeName}: love, patience, success, friendship, health, family & more. With pinyin, meanings, and example sentences.`,
    keywords: ['chinese idiom lists', 'chengyu collections', 'chinese phrases by topic', 'learn chinese idioms', langName.toLowerCase(), nativeName.toLowerCase()],
    openGraph: {
      title: `250+ Chinese Idiom Lists by Topic | ${nativeName}`,
      description: `Explore 250+ curated Chinese idiom lists in ${nativeName}: love, patience, success & more.`,
      url: `https://www.chineseidioms.com/${lang}/blog/lists`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/blog/lists`,
      languages: {
        'x-default': '/blog/lists',
        'en': '/blog/lists',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/blog/lists`])
        ),
      },
    },
  };
}

export default async function TranslatedListiclesIndexPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const listicles = getAllListiclesTranslated(lang);
  const t = (key: string) => getTranslation(lang, key as keyof typeof import('@/src/lib/translations').translations.en);

  // Structured data for SEO - this is safe static data, not user input
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Chinese Idiom Lists",
    "description": "Curated collections of Chinese idioms organized by topic",
    "url": `https://www.chineseidioms.com/${lang}/blog/lists`,
    "inLanguage": lang,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": listicles.length,
      "itemListElement": listicles.map((listicle, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": listicle.title,
        "url": `https://www.chineseidioms.com/${lang}/blog/lists/${listicle.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/blog`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {t('backToAll')}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              {t('chineseIdiomLists')}
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            {t('chineseIdiomListsDesc')}
          </p>
        </header>

        <ListicleFilter
          listicles={listicles.map(l => ({
            slug: l.slug,
            title: l.title,
            description: l.description,
            category: l.category,
            idiomCount: l.idiomIds.length,
          }))}
          categories={[...new Set(listicles.map(l => l.category))].sort()}
          langPrefix={`/${lang}`}
        />

        <AdUnit type="display" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit type="multiplex" />
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} {t('footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBuiltBy')}
              </a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBlog')}
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
