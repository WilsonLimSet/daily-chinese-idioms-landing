import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllBlogPosts } from '@/src/lib/blog';
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

export const metadata: Metadata = {
  title: 'Chinese Idiom Themes - Browse Chengyu by Category',
  description: 'Browse Chinese idioms (chengyu) organized by theme: wisdom, success, relationships, strategy, philosophy, and character. Explore 365+ idioms with meanings and examples.',
  keywords: [
    'chinese idiom themes',
    'chengyu categories',
    'chinese proverbs by topic',
    'learn chinese idioms',
    'chinese wisdom',
    'chinese philosophy'
  ],
  openGraph: {
    title: 'Browse Chinese Idioms by Theme',
    description: 'Explore 365+ Chinese idioms organized by theme: wisdom, success, relationships, strategy, philosophy, and character.',
    url: 'https://www.chineseidioms.com/themes',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/themes',
  },
};

export default async function ThemesIndexPage() {
  const allPosts = await getAllBlogPosts();

  // Count idioms per theme
  const themeCounts = Object.keys(THEME_MAP).reduce((acc, theme) => {
    const count = allPosts.filter(post => {
      const postTheme = post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-');
      return postTheme === theme;
    }).length;
    acc[theme] = count;
    return acc;
  }, {} as { [key: string]: number });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Chinese Idiom Themes",
    "description": "Browse Chinese idioms organized by theme and category",
    "url": "https://www.chineseidioms.com/themes",
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Chinese Idioms",
      "url": "https://www.chineseidioms.com"
    },
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
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Browse Chinese Idioms by Theme
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Explore our collection of 365+ Chinese idioms (chengyu) organized by theme.
            Each category offers unique insights into Chinese culture, philosophy, and wisdom.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(THEME_MAP).map(([key, name]) => (
            <Link
              key={key}
              href={`/themes/${key}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-lg transition-all p-8 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
                  <p className="text-sm text-gray-600 font-medium">
                    {themeCounts[key]} idiom{themeCounts[key] !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">
                {THEME_DESCRIPTIONS[key]}
              </p>

              <p className="text-blue-600 text-sm mt-6 font-medium flex items-center gap-1">
                Explore {name} →
              </p>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">About Chinese Idiom Themes</h2>
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">What are Chinese idiom themes?</h3>
              <p className="text-gray-700">
                Chinese idioms (chengyu) are organized into thematic categories based on their core meanings
                and contexts. These themes help learners understand related idioms together and see patterns
                in Chinese cultural values and philosophical concepts.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">How are themes useful for learning?</h3>
              <p className="text-gray-700">
                Learning idioms by theme allows you to build contextual understanding, remember related
                expressions together, and grasp the cultural concepts that connect different sayings.
                It&apos;s more effective than learning idioms in isolation.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Which theme should I start with?</h3>
              <p className="text-gray-700">
                We recommend starting with &ldquo;Wisdom &amp; Learning&rdquo; or &ldquo;Success &amp; Perseverance&rdquo; as these
                themes contain frequently-used idioms in everyday Chinese conversation. However, choose
                the theme that most interests you for better motivation and retention.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} chineseidioms</p>
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
