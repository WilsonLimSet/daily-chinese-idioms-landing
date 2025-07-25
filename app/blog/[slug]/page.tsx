import { getBlogPost, getAllBlogPosts, type BlogPost } from '@/src/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import '../blog.css';

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

  // Get all posts for navigation
  const allPosts = await getAllBlogPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Process markdown content
  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "datePublished": post.date,
    "dateModified": post.date,
    "author": {
      "@type": "Organization",
      "name": "Daily Chinese Idioms"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Daily Chinese Idioms",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com'}/icon.png`
      }
    },
    "description": post.idiom.metaphoric_meaning,
    "articleBody": post.idiom.description
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
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
          <h1 className="text-4xl font-bold text-black mt-2 mb-4">
            <span className="text-5xl text-black">{post.idiom.characters}</span>
          </h1>
          <p className="text-xl text-black font-medium">{post.idiom.metaphoric_meaning}</p>
        </header>

        <div className="blog-content">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>

        {/* Previous/Next Navigation */}
        <nav className="mt-12 flex justify-between items-center border-t pt-8">
          {prevPost ? (
            <Link 
              href={`/blog/${prevPost.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group max-w-[45%]"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-sm text-gray-500">Previous</div>
                <div className="font-medium">{prevPost.idiom.characters}</div>
                <div className="text-sm text-gray-600 line-clamp-1">{prevPost.idiom.metaphoric_meaning}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextPost ? (
            <Link 
              href={`/blog/${nextPost.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group max-w-[45%] text-right"
            >
              <div>
                <div className="text-sm text-gray-500">Next</div>
                <div className="font-medium">{nextPost.idiom.characters}</div>
                <div className="text-sm text-gray-600 line-clamp-1">{nextPost.idiom.metaphoric_meaning}</div>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </article>
    </div>
  );
}