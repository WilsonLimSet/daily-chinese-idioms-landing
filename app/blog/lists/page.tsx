import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { getAllListicles } from '@/src/lib/listicles';
import LanguageSelector from '@/app/components/LanguageSelector';

export const metadata: Metadata = {
  title: 'Chinese Idiom Lists - Curated Chengyu Collections by Topic',
  description: 'Browse curated lists of Chinese idioms (chengyu) organized by topic: business, love, friendship, success, motivation, and more. Each list features carefully selected idioms with meanings and examples.',
  keywords: ['chinese idiom lists', 'chengyu collections', 'chinese phrases by topic', 'learn chinese idioms', 'mandarin idiom guides'],
  openGraph: {
    title: 'Chinese Idiom Lists - Curated Chengyu Collections',
    description: 'Explore curated lists of Chinese idioms organized by topic. Perfect for learning idioms about business, love, friendship, success, and more.',
    url: 'https://www.chineseidioms.com/blog/lists',
    siteName: 'Daily Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/blog/lists',
  },
};

export default function ListiclesIndexPage() {
  const listicles = getAllListicles();

  // Structured data for SEO - static data only, safe to serialize
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
              href={`/blog/lists/${listicle.slug}`}
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
                Read list →
              </div>
            </Link>
          ))}
        </div>

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

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} Daily Chinese Idioms</p>
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
