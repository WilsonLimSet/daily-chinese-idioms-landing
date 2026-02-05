import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllListiclesTranslated } from '@/src/lib/listicles';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';

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
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  return {
    title: `Chinese Idiom Lists - Curated Chengyu Collections (${langName})`,
    description: `Browse curated lists of Chinese idioms (chengyu) organized by topic in ${langName}: business, love, friendship, success, motivation, and more.`,
    keywords: ['chinese idiom lists', 'chengyu collections', 'chinese phrases by topic', 'learn chinese idioms', langName.toLowerCase()],
    openGraph: {
      title: `Chinese Idiom Lists - Curated Chengyu Collections (${langName})`,
      description: `Explore curated lists of Chinese idioms organized by topic in ${langName}.`,
      url: `https://www.chineseidioms.com/${lang}/blog/lists`,
      siteName: 'Daily Chinese Idioms',
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
            {t('backToAll') || 'Back to Blog'}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Chinese Idiom Lists
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore our curated collections of Chinese idioms (chengyu) organized by topic.
            Each list features carefully selected idioms with meanings, origins, and practical examples.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listicles.map((listicle) => (
            <Link
              key={listicle.slug}
              href={`/${lang}/blog/lists/${listicle.slug}`}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 border border-gray-100 hover:border-red-200 group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded">
                  {listicle.category}
                </span>
                <span className="text-xs text-gray-500">
                  {listicle.idiomIds.length} idioms
                </span>
              </div>

              <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                {listicle.title}
              </h2>

              <p className="text-gray-600 text-sm line-clamp-3">
                {listicle.description}
              </p>

              <div className="mt-4 text-sm font-medium text-red-600 group-hover:text-red-700">
                {t('learnMore') || 'Read list'} →
              </div>
            </Link>
          ))}
        </div>
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} {t('footerCopyright') || 'Daily Chinese Idioms'}</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBuiltBy') || 'Built by Wilson'}
              </a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBlog') || 'Blog'}
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
