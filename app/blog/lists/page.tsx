import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllListicles } from '@/src/lib/listicles';
import LanguageSelector from '@/app/components/LanguageSelector';
import ListicleFilter from '@/app/components/ListicleFilter';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: '250+ Chinese Idiom Lists by Topic — Love, Life, Success, Patience & More',
  description: 'Explore 250+ curated Chinese idiom (成语) lists organized by topic: love, patience, success, friendship, health, family, hard work & more. Each list has pinyin, meanings, and example sentences.',
  keywords: ['chinese idiom lists', 'chengyu collections', 'chinese phrases by topic', 'learn chinese idioms', 'chinese proverbs by topic', 'mandarin idiom guides'],
  openGraph: {
    title: '250+ Chinese Idiom Lists by Topic',
    description: 'Explore 250+ curated Chinese idiom lists: love, patience, success, friendship, health & more. With pinyin, meanings, and examples.',
    url: 'https://www.chineseidioms.com/blog/lists',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/blog/lists',
    languages: {
      'x-default': 'https://www.chineseidioms.com/blog/lists',
      'en': 'https://www.chineseidioms.com/blog/lists',
      'es': 'https://www.chineseidioms.com/es/blog/lists',
      'pt': 'https://www.chineseidioms.com/pt/blog/lists',
      'id': 'https://www.chineseidioms.com/id/blog/lists',
      'vi': 'https://www.chineseidioms.com/vi/blog/lists',
      'ja': 'https://www.chineseidioms.com/ja/blog/lists',
      'ko': 'https://www.chineseidioms.com/ko/blog/lists',
      'th': 'https://www.chineseidioms.com/th/blog/lists',
      'hi': 'https://www.chineseidioms.com/hi/blog/lists',
      'ar': 'https://www.chineseidioms.com/ar/blog/lists',
      'fr': 'https://www.chineseidioms.com/fr/blog/lists',
      'tl': 'https://www.chineseidioms.com/tl/blog/lists',
      'ms': 'https://www.chineseidioms.com/ms/blog/lists',
      'ru': 'https://www.chineseidioms.com/ru/blog/lists',
    },
  },
};

export default function ListiclesIndexPage() {
  const listicles = getAllListicles();
  const categories = [...new Set(listicles.map(l => l.category))].sort();
  const listicleData = listicles.map(l => ({
    slug: l.slug,
    title: l.title,
    description: l.description,
    category: l.category,
    idiomCount: l.idiomIds.length,
  }));

  // Safe static JSON-LD for SEO — all data from hardcoded listicle definitions, not user input
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Chinese Idiom Lists",
    "description": "Curated collections of Chinese idioms organized by topic",
    "url": "https://www.chineseidioms.com/blog/lists",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": listicles.length,
      "itemListElement": listicles.map((listicle, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": listicle.title,
        "url": `https://www.chineseidioms.com/blog/lists/${listicle.slug}`
      }))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Safe static JSON-LD — hardcoded listicle data only, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
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
              Chinese Idiom Lists
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl">
            Explore our curated collections of Chinese idioms (chengyu) organized by topic.
            Each list features carefully selected idioms with meanings, origins, and practical examples.
          </p>
        </header>

        <ListicleFilter listicles={listicleData} categories={categories} />

        <AdUnit type="display" />

        {/* SEO Content Section */}
        <section className="mt-16 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">About Our Idiom Lists</h2>
          <div className="prose prose-gray max-w-3xl">
            <p>
              Our curated Chinese idiom lists help you learn chengyu in context. Instead of memorizing
              random expressions, you can focus on idioms relevant to specific situations - whether
              you&apos;re preparing for a business meeting, writing a wedding speech, or seeking motivation.
            </p>
            <p>
              Each list includes idioms with their pinyin pronunciation, literal meaning, metaphorical
              meaning, historical context, and practical usage examples. Click through to individual
              idiom pages for even more detailed explanations and related expressions.
            </p>
          </div>
        </section>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit type="multiplex" />
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Built by Wilson
              </a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href="/dictionary"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dictionary
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
