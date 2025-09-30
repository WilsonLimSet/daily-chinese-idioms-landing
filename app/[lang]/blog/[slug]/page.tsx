import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPost } from '@/src/lib/blog-intl';
import Link from 'next/link';
import { Calendar, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import '@/app/blog/blog.css';

const LANGUAGES = {
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
};

export async function generateStaticParams() {
  const params = [];

  for (const lang of Object.keys(LANGUAGES)) {
    const posts = await getAllBlogPosts(lang);
    for (const post of posts) {
      params.push({ lang, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params
}: {
  params: { slug: string; lang: string }
}) {
  const post = await getBlogPost(params.slug, params.lang);

  if (!post) {
    return {
      title: 'Idiom Not Found',
    };
  }

  const langName = LANGUAGES[params.lang as keyof typeof LANGUAGES];

  return {
    title: `${post.idiom.characters} - ${post.idiom.metaphoric_meaning} | Chinese Idioms (${langName})`,
    description: `${post.idiom.metaphoric_meaning}: ${post.idiom.description.substring(0, 160)}...`,
    keywords: [
      post.idiom.characters,
      post.idiom.pinyin,
      'chinese idioms',
      'chengyu',
      '成语',
      post.idiom.theme,
      langName,
      `chinese idioms ${langName.toLowerCase()}`,
    ],
    alternates: {
      languages: {
        'en': `/blog/${params.slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog/${params.slug}`])
        ),
      },
    },
  };
}

export default async function InternationalBlogPostPage({
  params
}: {
  params: { slug: string; lang: string }
}) {
  const post = await getBlogPost(params.slug, params.lang);

  if (!post) {
    notFound();
  }

  const langName = LANGUAGES[params.lang as keyof typeof LANGUAGES];

  return (
    <div className="min-h-screen bg-gray-50">

      <article className="blog-content max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href={`/${params.lang}/blog`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to all idioms
        </Link>

        <header className="mb-8 pb-8 border-b">
          <div className="mb-4">
            <h1 className="text-5xl font-bold text-gray-900 mb-3">
              {post.idiom.characters}
              {post.idiom.traditionalCharacters && post.idiom.traditionalCharacters !== post.idiom.characters && (
                <span className="text-3xl text-gray-500 ml-3">({post.idiom.traditionalCharacters})</span>
              )}
            </h1>
            <div className="flex items-center gap-4 text-gray-600">
              <span className="text-lg font-medium">{post.idiom.pinyin}</span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-4 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              {post.idiom.metaphoric_meaning}
            </h2>
            <span className="inline-block px-3 py-1 text-sm font-medium bg-white text-gray-700 rounded-full shadow-sm">
              {post.idiom.theme}
            </span>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>

        {/* Language navigation footer */}
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Read this idiom in other languages:</h3>
          <div className="flex flex-wrap gap-2">
            <Link href={`/blog/${params.slug}`} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm">
              English
            </Link>
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <Link
                key={code}
                href={`/${code}/blog/${params.slug}`}
                className={`px-3 py-1 rounded-md text-sm ${
                  code === params.lang
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}