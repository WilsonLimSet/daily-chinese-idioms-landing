import Link from 'next/link';
import { Search, BookOpen, Languages, Sparkles } from 'lucide-react';
import { getAllBlogPosts } from '@/src/lib/blog';
import { LANGUAGES } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({ lang }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';

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

  return {
    title: `Chinese Idioms Dictionary (Chengyu) - 365+ Expressions | ${langName}`,
    description: `Complete Chinese idioms dictionary with 365+ chengyu in ${langName}. Search by pinyin, characters, or meaning.`,
    keywords: [
      'chengyu dictionary',
      'chinese idiom dictionary',
      '成语词典',
      langName,
      `chinese idioms ${langName.toLowerCase()}`,
    ],
    openGraph: {
      title: `Chinese Idioms Dictionary - 365+ Chengyu | ${langName}`,
      description: `Complete searchable dictionary of Chinese idioms (chengyu) with pinyin, meanings, and examples in ${langName}.`,
      url: `https://www.chineseidioms.com/${lang}/dictionary`,
      siteName: 'Daily Chinese Idioms',
      locale: ogLocale,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/dictionary`,
      languages: {
        'x-default': '/dictionary',
        'en': '/dictionary',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/dictionary`])
        ),
      },
    },
  };
}

export default async function DictionaryPage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const allPosts = await getAllBlogPosts();

  // Group idioms by first pinyin letter for quick navigation
  const alphabetGroups: { [key: string]: typeof allPosts } = {};
  allPosts.forEach(post => {
    const firstLetter = post.idiom.pinyin.charAt(0).toUpperCase();
    if (!alphabetGroups[firstLetter]) {
      alphabetGroups[firstLetter] = [];
    }
    alphabetGroups[firstLetter].push(post);
  });

  // Group by theme for category navigation
  const themeGroups: { [key: string]: typeof allPosts } = {};
  allPosts.forEach(post => {
    const theme = post.idiom.theme;
    if (!themeGroups[theme]) {
      themeGroups[theme] = [];
    }
    themeGroups[theme].push(post);
  });

  const sortedLetters = Object.keys(alphabetGroups).sort();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Chinese Idioms Dictionary",
    "description": "Complete dictionary of Chinese idioms (chengyu) with meanings, pinyin, and examples",
    "url": `https://www.chineseidioms.com/${lang}/dictionary`,
    "inLanguage": lang,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Daily Chinese Idioms",
      "url": "https://www.chineseidioms.com"
    },
    "about": {
      "@type": "Thing",
      "name": "Chinese idioms",
      "alternateName": ["Chengyu", "成语"]
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `https://www.chineseidioms.com/${lang}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Dictionary",
          "item": `https://www.chineseidioms.com/${lang}/dictionary`
        }
      ]
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

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {getTranslation(lang, 'blogTitle')}
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-2">
              成语词典 (Chéngyǔ Cídiǎn)
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {getTranslation(lang, 'blogSubtitle')} - {allPosts.length}+ {getTranslation(lang, 'idioms')}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600">{allPosts.length}+</div>
              <div className="text-sm text-gray-600">{getTranslation(lang, 'idioms')}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600">5</div>
              <div className="text-sm text-gray-600">{getTranslation(lang, 'filterByTheme')}</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600">14</div>
              <div className="text-sm text-gray-600">Languages</div>
            </div>
            <div className="bg-white rounded-lg p-4 text-center shadow-sm">
              <div className="text-3xl font-bold text-red-600">Daily</div>
              <div className="text-sm text-gray-600">Updates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search CTA */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Link
            href={`/${lang}/blog`}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            {getTranslation(lang, 'searchPlaceholder')}
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-red-600" />
            {getTranslation(lang, 'filterByTheme')}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(themeGroups)
              .filter(([theme]) => [
                'Life Philosophy',
                'Wisdom & Learning',
                'Success & Perseverance',
                'Relationships & Character',
                'Strategy & Action'
              ].includes(theme))
              .sort((a, b) => b[1].length - a[1].length)
              .map(([theme, posts]) => {
                const themeSlug = theme.toLowerCase().replace(/[&\s]+/g, '-');
                return (
                  <Link
                    key={theme}
                    href={`/${lang}/themes/${themeSlug}`}
                    className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{theme}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {posts.length} {getTranslation(lang, 'idioms')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {posts.slice(0, 3).map(post => (
                        <span key={post.slug} className="text-sm bg-red-50 text-gray-900 px-2 py-1 rounded border border-red-100">
                          {post.idiom.characters}
                        </span>
                      ))}
                      {posts.length > 3 && (
                        <span className="text-sm text-gray-500">+{posts.length - 3}</span>
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>

      {/* A-Z Index */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Languages className="w-6 h-6 text-red-600" />
            Browse A-Z by Pinyin
          </h2>

          {/* Letter Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {sortedLetters.map(letter => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-red-100 rounded-lg font-medium text-gray-700 hover:text-red-700 transition-colors"
              >
                {letter}
              </a>
            ))}
          </div>

          {/* Idiom Lists by Letter */}
          <div className="space-y-8">
            {sortedLetters.map(letter => (
              <div key={letter} id={`letter-${letter}`} className="scroll-mt-20">
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b flex items-center gap-2">
                  <span className="w-8 h-8 bg-red-100 text-red-700 rounded flex items-center justify-center">
                    {letter}
                  </span>
                  <span className="text-gray-500 text-sm font-normal">
                    ({alphabetGroups[letter].length} {getTranslation(lang, 'idioms')})
                  </span>
                </h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {alphabetGroups[letter].slice(0, 12).map(post => (
                    <Link
                      key={post.slug}
                      href={`/${lang}/blog/${post.slug}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-2xl font-bold text-gray-900">{post.idiom.characters}</span>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-600">{post.idiom.pinyin}</p>
                        <p className="text-sm text-gray-800 truncate">{post.idiom.metaphoric_meaning}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {alphabetGroups[letter].length > 12 && (
                  <p className="text-sm text-gray-500 mt-4">
                    {getTranslation(lang, 'showing')} 12 {getTranslation(lang, 'of')} {alphabetGroups[letter].length}.
                    <Link href={`/${lang}/blog`} className="text-red-600 hover:underline ml-1">
                      {getTranslation(lang, 'searchPlaceholder')} →
                    </Link>
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {getTranslation(lang, 'learnDailyTitle')}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Sparkles className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{getTranslation(lang, 'widgetTitle')}</h3>
              <p className="text-gray-600 text-sm">
                {getTranslation(lang, 'widgetDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <Languages className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{getTranslation(lang, 'offlineTitle')}</h3>
              <p className="text-gray-600 text-sm">
                {getTranslation(lang, 'offlineDesc')}
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <BookOpen className="w-8 h-8 text-red-600 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">{getTranslation(lang, 'dailyUpdatesTitle')}</h3>
              <p className="text-gray-600 text-sm">
                {getTranslation(lang, 'dailyUpdatesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">© {new Date().getFullYear()} {getTranslation(lang, 'footerCopyright')}</p>
            <span className="hidden sm:inline text-gray-400">•</span>
            <a
              href="https://wilsonlimset.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              {getTranslation(lang, 'footerBuiltBy')}
            </a>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {getTranslation(lang, 'footerBlog')}
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link href={`/${lang}/dictionary`} className="text-gray-600 hover:text-gray-900 transition-colors">
              Dictionary
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <Link href={`/${lang}/privacy`} className="text-gray-600 hover:text-gray-900 transition-colors">
              {getTranslation(lang, 'footerPrivacy')}
            </Link>
            <span className="hidden sm:inline text-gray-400">•</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
