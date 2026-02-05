import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllBlogPosts } from '@/src/lib/blog';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';

const THEME_MAP: { [key: string]: string } = {
  'life-philosophy': 'Life Philosophy',
  'relationships-character': 'Relationships & Character',
  'strategy-action': 'Strategy & Action',
  'success-perseverance': 'Success & Perseverance',
  'wisdom-learning': 'Wisdom & Learning'
};

const THEME_DESCRIPTIONS: { [key: string]: string } = {
  'life-philosophy': 'Discover profound Chinese idioms about life\'s meaning, perspective, and philosophical wisdom. These expressions capture ancient insights on how to live meaningfully.',
  'relationships-character': 'Learn Chinese idioms about interpersonal relationships, social bonds, moral character, and behavioral patterns. These sayings illuminate human nature and the dynamics of human connections.',
  'strategy-action': 'Master Chinese idioms about strategic thinking, decisive action, and tactical wisdom. These chengyu teach the art of effective planning and execution.',
  'success-perseverance': 'Study Chinese idioms about achievement, determination, and perseverance. These expressions inspire resilience and celebrate the path to success.',
  'wisdom-learning': 'Delve into Chinese idioms about knowledge, education, and intellectual growth. These sayings honor the pursuit of wisdom and lifelong learning.'
};

export async function generateStaticParams() {
  return Object.keys(THEME_MAP).map((theme) => ({
    theme,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string }> }): Promise<Metadata> {
  const { theme } = await params;
  const themeName = THEME_MAP[theme];

  if (!themeName) {
    return {
      title: 'Theme Not Found',
    };
  }

  const description = THEME_DESCRIPTIONS[theme] || `Comprehensive guide to Chinese idioms about ${themeName.toLowerCase()}. Learn chengyu with meanings, examples, and cultural context.`;

  return {
    title: `${themeName} Chinese Idioms - Complete Chengyu Guide`,
    description,
    keywords: [
      `${themeName.toLowerCase()} chinese idioms`,
      `${themeName.toLowerCase()} chengyu`,
      'chinese proverbs',
      'learn chinese idioms',
      themeName,
      'chinese culture',
      'mandarin idioms'
    ],
    openGraph: {
      title: `Chinese Idioms About ${themeName}`,
      description,
      url: `https://www.chineseidioms.com/themes/${theme}`,
      siteName: 'Daily Chinese Idioms',
      locale: 'en_US',
      alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/themes/${theme}`,
      languages: {
        'x-default': `/themes/${theme}`,
        'en': `/themes/${theme}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/themes/${theme}`])
        ),
      },
    },
  };
}

export default async function ThemePage({ params }: { params: Promise<{ theme: string }> }) {
  const { theme } = await params;
  const themeName = THEME_MAP[theme];

  if (!themeName) {
    return <div>Theme not found</div>;
  }

  const allPosts = await getAllBlogPosts();
  const themePosts = allPosts.filter(post => {
    const postTheme = post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-');
    return postTheme === theme;
  });

  // Structured data for theme pages
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${themeName} Chinese Idioms`,
    "description": THEME_DESCRIPTIONS[theme],
    "url": `https://www.chineseidioms.com/themes/${theme}`,
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Daily Chinese Idioms",
      "url": "https://www.chineseidioms.com"
    },
    "hasPart": themePosts.map(post => ({
      "@type": "DefinedTerm",
      "name": post.idiom.characters,
      "description": post.idiom.metaphoric_meaning,
      "url": `https://www.chineseidioms.com/blog/${post.slug}`
    })),
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://www.chineseidioms.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Themes",
          "item": "https://www.chineseidioms.com/themes"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": themeName,
          "item": `https://www.chineseidioms.com/themes/${theme}`
        }
      ]
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
          <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to All Idioms
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {themeName} Chinese Idioms
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            {THEME_DESCRIPTIONS[theme]}
          </p>
          <p className="text-gray-600 mt-4">
            {themePosts.length} idiom{themePosts.length !== 1 ? 's' : ''} in this category
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="mb-3">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {post.idiom.characters}
                </h2>
                <p className="text-sm text-gray-600 font-medium mb-1">
                  {post.idiom.pinyin}
                </p>
                <p className="text-xs text-gray-500 italic">
                  &ldquo;{post.idiom.meaning}&rdquo;
                </p>
              </div>

              <p className="text-gray-800 font-medium mb-3">
                {post.idiom.metaphoric_meaning}
              </p>

              <p className="text-sm text-gray-700 line-clamp-3">
                {post.idiom.description.substring(0, 150)}...
              </p>

              <p className="text-blue-600 text-sm mt-4 font-medium">
                Learn more →
              </p>
            </Link>
          ))}
        </div>

        {/* Related Themes */}
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Explore Other Themes</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(THEME_MAP)
              .filter(([key]) => key !== theme)
              .map(([key, name]) => (
                <Link
                  key={key}
                  href={`/themes/${key}`}
                  className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{name}</h3>
                  <p className="text-sm text-gray-600">
                    {THEME_DESCRIPTIONS[key]?.substring(0, 100)}...
                  </p>
                </Link>
              ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} Daily Chinese Idioms</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Built by Wilson
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
