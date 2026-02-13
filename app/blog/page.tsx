import { getAllBlogPosts } from '@/src/lib/blog';
import { getAllListicles } from '@/src/lib/listicles';
import { LANGUAGES } from '@/src/lib/constants';
import BlogClient from './BlogClient';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import AdUnit from '@/app/components/AdUnit';

export const metadata = {
  title: '680+ Chinese Idioms (Chengyu) - Complete List with English Meanings & Pinyin',
  description: 'Browse 680+ Chinese idioms (chengyu/成语) with English translations, pinyin & examples. Search by characters, pinyin or meaning. Updated daily. The most complete chengyu resource online.',
  keywords: ['chinese idioms', 'chengyu', 'chinese idiom', 'chengyu list', 'chinese proverbs', 'learn chengyu', 'chinese idioms with meanings', 'chinese idioms dictionary', 'mandarin idioms', '成语'],
  openGraph: {
    title: '680+ Chinese Idioms (Chengyu) - English Meanings & Pinyin',
    description: 'Browse 680+ Chinese idioms with English translations, pinyin pronunciation & cultural context. Updated daily.',
    url: 'https://www.chineseidioms.com/blog',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/blog',
    languages: {
      'x-default': '/blog',
      'en': '/blog',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog`])
      ),
    },
    types: {
      'application/rss+xml': '/api/rss',
    },
  },
};

export default async function BlogPage() {
  // Fetch all posts at build time
  const posts = await getAllBlogPosts();
  const listicles = getAllListicles();

  // Extract unique themes server-side
  const themes = Array.from(new Set(posts.map(post => post.idiom.theme))).sort();

  return (
    <>
      {/* Featured Listicles Section */}
      <div className="bg-gradient-to-b from-red-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="w-5 h-5 text-red-600" />
            <h2 className="text-xl font-bold text-gray-900">Curated Idiom Lists</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {listicles.slice(0, 4).map((listicle) => (
              <Link
                key={listicle.slug}
                href={`/blog/lists/${listicle.slug}`}
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
                href="/blog/lists"
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                View all {listicles.length} curated lists →
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit type="display" />
      </div>
      <BlogClient posts={posts} themes={themes} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdUnit type="multiplex" />
      </div>

      {/* Quick Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t">
        <div className="flex flex-wrap gap-4 justify-center text-sm text-gray-600">
          <Link href="/dictionary" className="hover:text-red-600 transition-colors">Dictionary</Link>
          <span className="text-gray-300">|</span>
          <Link href="/themes/success-perseverance" className="hover:text-red-600 transition-colors">Success Idioms</Link>
          <span className="text-gray-300">|</span>
          <Link href="/themes/life-philosophy" className="hover:text-red-600 transition-colors">Life Philosophy</Link>
          <span className="text-gray-300">|</span>
          <Link href="/themes/wisdom-learning" className="hover:text-red-600 transition-colors">Wisdom & Learning</Link>
          <span className="text-gray-300">|</span>
          <Link href="/themes/relationships-character" className="hover:text-red-600 transition-colors">Relationships</Link>
          <span className="text-gray-300">|</span>
          <Link href="/faq" className="hover:text-red-600 transition-colors">FAQ</Link>
        </div>
      </div>
    </>
  );
}