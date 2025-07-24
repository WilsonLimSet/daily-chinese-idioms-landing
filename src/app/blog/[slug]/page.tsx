import { getBlogPost, getAllBlogPosts, type BlogPost } from '@/src/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.idiom.metaphoric_meaning,
    openGraph: {
      title: post.title,
      description: post.idiom.metaphoric_meaning,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Process markdown content
  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/blog" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-8">
          <time className="text-gray-500 text-sm">{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          <h1 className="text-4xl font-bold text-gray-900 mt-2 mb-4">
            <span className="text-5xl">{post.idiom.characters}</span>
          </h1>
          <p className="text-xl text-gray-600">{post.idiom.metaphoric_meaning}</p>
        </header>

        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>

      </article>
    </div>
  );
}