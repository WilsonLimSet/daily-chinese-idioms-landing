import { getAllBlogPosts } from '@/src/lib/blog-intl';
import BlogClient from '@/app/blog/BlogClient';
import { LANGUAGES } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';

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
    openGraph: {
      title: `Chinese Idioms Blog - ${langName}`,
      description: `Learn Chinese idioms with translations in ${langName}`,
      url: `https://www.chineseidioms.com/${lang}/blog`,
      siteName: 'Daily Chinese Idioms',
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/blog`,
      languages: {
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

  // Extract unique themes
  const themes = Array.from(new Set(posts.map(post => post.idiom.theme))).sort();

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];

  // Structured data for blog index
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
      <BlogClient posts={posts} themes={themes} lang={lang} />
    </>
  );
}