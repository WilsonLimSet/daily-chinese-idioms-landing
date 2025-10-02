import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllBlogPosts } from '@/src/lib/blog-intl';
import { LANGUAGES } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';

const THEME_MAP: { [key: string]: string } = {
  'life-philosophy': 'Life Philosophy',
  'relationships-character': 'Relationships & Character',
  'strategy-action': 'Strategy & Action',
  'success-perseverance': 'Success & Perseverance',
  'wisdom-learning': 'Wisdom & Learning'
};

export async function generateStaticParams() {
  const params = [];

  for (const lang of Object.keys(LANGUAGES)) {
    for (const theme of Object.keys(THEME_MAP)) {
      params.push({ lang, theme });
    }
  }

  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ theme: string; lang: string }> }): Promise<Metadata> {
  const { theme, lang } = await params;
  const themeName = THEME_MAP[theme];
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];

  if (!themeName) {
    return {
      title: 'Theme Not Found',
    };
  }

  return {
    title: `${themeName} Chinese Idioms (${langName})`,
    description: `Learn Chinese idioms about ${themeName.toLowerCase()} in ${langName}. Complete chengyu guide with translations and cultural context.`,
    keywords: [
      `${themeName.toLowerCase()} chinese idioms`,
      `chengyu ${langName}`,
      'chinese proverbs',
      themeName,
      langName
    ],
    alternates: {
      languages: {
        'en': `/themes/${theme}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/themes/${theme}`])
        ),
      },
    },
  };
}

export default async function InternationalThemePage({ params }: { params: Promise<{ theme: string; lang: string }> }) {
  const { theme, lang } = await params;
  const themeName = THEME_MAP[theme];

  if (!themeName) {
    return <div>Theme not found</div>;
  }

  const allPosts = await getAllBlogPosts(lang);
  const themePosts = allPosts.filter(post => {
    const postTheme = post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-');
    return postTheme === theme;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/blog`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {getTranslation(lang, 'backToAll')}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {themeName} Chinese Idioms
          </h1>
          <p className="text-gray-600 mt-4">
            {themePosts.length} idioms
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {themePosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
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
                  href={`/${lang}/themes/${key}`}
                  className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
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
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
