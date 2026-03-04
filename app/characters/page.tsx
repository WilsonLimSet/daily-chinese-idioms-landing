import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllCharacterPages } from '@/src/lib/characters';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';

export const metadata: Metadata = {
  title: 'Browse Chinese Idioms by Character - Chengyu Dictionary',
  description: 'Explore Chinese idioms (chengyu) organized by individual characters. Find all idioms containing a specific Chinese character, with meanings, pinyin, and examples.',
  keywords: [
    'chinese idioms by character',
    'chengyu character search',
    'chinese character idioms',
    'browse idioms by hanzi',
    'chinese character dictionary',
    'chengyu dictionary',
  ],
  openGraph: {
    title: 'Browse Chinese Idioms by Character',
    description: 'Find Chinese idioms by individual characters. Explore 1000+ chengyu organized by the Chinese characters they contain.',
    url: 'https://www.chineseidioms.com/characters',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/characters',
    languages: {
      'x-default': '/characters',
      'en': '/characters',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/characters`])
      ),
    },
  },
};

export default function CharactersIndexPage() {
  const characters = getAllCharacterPages();

  // Safe static structured data from our own database - not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Browse Chinese Idioms by Character",
      "description": "Explore Chinese idioms organized by individual Chinese characters",
      "url": "https://www.chineseidioms.com/characters",
      "inLanguage": "en",
      "numberOfItems": characters.length,
    },
    {
      "@context": "https://schema.org",
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
          "name": "Characters",
          "item": "https://www.chineseidioms.com/characters"
        }
      ]
    }
  ];

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
            Browse Chinese Idioms by Character
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            Explore {characters.length}+ Chinese characters that appear in our collection of 1000+ idioms (chengyu).
            Click any character to see all idioms containing it.
          </p>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {characters.map((char) => (
            <Link
              key={char.character}
              href={`/characters/${char.slug}`}
              className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {char.character}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {char.count} idiom{char.count !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">About Browsing by Character</h2>
          <div className="space-y-6 max-w-3xl">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Why browse idioms by character?</h3>
              <p className="text-gray-700">
                Chinese idioms (chengyu) are built from individual characters, each carrying its own meaning.
                Browsing by character helps you discover patterns — how the same character appears across
                different idioms with different meanings, deepening your understanding of Chinese language.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">How are characters sorted?</h3>
              <p className="text-gray-700">
                Characters are sorted by frequency — those appearing in the most idioms come first.
                This naturally surfaces the most important and commonly-used characters in Chinese idioms.
              </p>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Built by Wilson</a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/dictionary" className="text-gray-600 hover:text-gray-900 transition-colors">Dictionary</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
