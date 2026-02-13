import { getAllBlogPosts } from '@/src/lib/blog';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

export const metadata = {
  title: 'Blog - Chinese Idioms',
  description: 'Learn a new Chinese idiom every day with historical context and practical examples.',
  alternates: {
    types: {
      'application/rss+xml': '/api/rss',
    },
  },
};

export default async function BlogPage() {
  const posts = await getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chinese Idioms Blog</h1>
              <p className="mt-2 text-gray-600">One idiom a day, with stories and meanings</p>
            </div>
            <Link href="/" className="text-blue-600 hover:text-blue-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl font-bold">{post.idiom.characters}</span>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {post.idiom.metaphoric_meaning}
              </h2>
              
              <p className="text-gray-600 text-sm mb-3">{post.idiom.pinyin}</p>
              
              <p className="text-gray-700 line-clamp-3">
                {post.idiom.description.substring(0, 150)}...
              </p>
              
              <div className="mt-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                  {post.idiom.theme}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}