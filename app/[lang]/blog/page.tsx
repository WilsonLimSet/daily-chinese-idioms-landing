import { getAllBlogPosts } from '@/src/lib/blog-intl';
import BlogClient from '@/app/blog/BlogClient';
import { LANGUAGES } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import { getAllListiclesTranslated } from '@/src/lib/listicles';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'International';

  const localeMap: { [key: string]: string } = {
    'es': 'es_ES',
    'pt': 'pt_BR',
    'id': 'id_ID',
    'vi': 'vi_VN',
    'ja': 'ja_JP',
    'ko': 'ko_KR',
    'th': 'th_TH',
    'hi': 'hi_IN',
    'ar': 'ar_AR',
    'fr': 'fr_FR',
    'tl': 'tl_PH',
    'ms': 'ms_MY',
    'ru': 'ru_RU'
  };

  const ogLocale = localeMap[lang] || 'en_US';
  const alternateLocales = Object.keys(LANGUAGES)
    .filter(l => l !== lang)
    .map(l => localeMap[l] || 'en_US');

  return {
    title: `Chinese Idioms Blog - ${langName} | 成语 Chengyu`,
    description: `Learn Chinese idioms (成语) with translations in ${langName}. Daily updates with meanings, examples, and cultural context.`,
    keywords: [
      'chinese idioms',
      'chengyu',
      '成语',
      'chinese proverbs',
      `chinese idioms ${langName.toLowerCase()}`,
      `chengyu ${langName.toLowerCase()}`,
      'learn chinese idioms',
      'chinese idioms with english meanings',
      langName,
    ],
    openGraph: {
      title: `Chinese Idioms Blog - ${langName}`,
      description: `Learn Chinese idioms with translations in ${langName}`,
      url: `https://www.chineseidioms.com/${lang}/blog`,
      siteName: 'Daily Chinese Idioms',
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `Chinese Idioms Blog - ${langName} | 成语`,
      description: `Learn Chinese idioms (成语) with translations in ${langName}. Daily updates with meanings and examples.`,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/blog`,
      languages: {
        'x-default': '/blog',
        'en': '/blog',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog`])
        ),
      },
    },
  };
}

export default async function InternationalBlogPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  // Fetch translated posts
  const posts = await getAllBlogPosts(lang);
  const listicles = getAllListiclesTranslated(lang);

  // Extract unique themes
  const themes = Array.from(new Set(posts.map(post => post.idiom.theme))).sort();

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];

  // Structured data for blog index (safe: only uses controlled data)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `Chinese Idioms Blog - ${langName}`,
    description: `Complete collection of Chinese idioms (chengyu) in ${langName}`,
    url: `https://www.chineseidioms.com/${lang}/blog`,
    inLanguage: lang,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Daily Chinese Idioms',
      url: 'https://www.chineseidioms.com'
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: getTranslation(lang, 'home') || 'Home',
          item: `https://www.chineseidioms.com/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: getTranslation(lang, 'footerBlog') || 'Blog',
          item: `https://www.chineseidioms.com/${lang}/blog`
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Featured Listicles Section */}
      <div className="bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">{getTranslation(lang, 'curatedLists') || 'Curated Idiom Lists'}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listicles.slice(0, 4).map((listicle) => (
              <Link
                key={listicle.slug}
                href={`/${lang}/blog/lists/${listicle.slug}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-4 border border-gray-100 hover:border-red-200"
              >
                <span className="text-xs text-red-600 font-medium">{listicle.category}</span>
                <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 text-sm">
                  {listicle.title}
                </h3>
                <p className="text-gray-600 text-xs mt-2 line-clamp-2">
                  {listicle.description}
                </p>
              </Link>
            ))}
          </div>
          {listicles.length > 4 && (
            <div className="mt-4 text-center">
              <Link
                href={`/${lang}/blog/lists`}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {getTranslation(lang, 'viewAllLists')} ({listicles.length}) →
              </Link>
            </div>
          )}
        </div>
      </div>
      <BlogClient posts={posts} themes={themes} lang={lang} />

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t">
        <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600">
          <Link href={`/${lang}/dictionary`} className="hover:text-red-600 transition-colors">Dictionary</Link>
          <span className="text-gray-300">|</span>
          <Link href={`/${lang}/themes/success-perseverance`} className="hover:text-red-600 transition-colors">Success Idioms</Link>
          <span className="text-gray-300">|</span>
          <Link href={`/${lang}/themes/life-philosophy`} className="hover:text-red-600 transition-colors">Life Philosophy</Link>
          <span className="text-gray-300">|</span>
          <Link href={`/${lang}/themes/wisdom-learning`} className="hover:text-red-600 transition-colors">Wisdom & Learning</Link>
          <span className="text-gray-300">|</span>
          <Link href={`/${lang}/themes/relationships-character`} className="hover:text-red-600 transition-colors">Relationships</Link>
        </div>
      </div>
    </>
  );
}