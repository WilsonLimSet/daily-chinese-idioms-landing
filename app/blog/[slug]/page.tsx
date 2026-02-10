import { getBlogPost, getAllBlogPosts, type BlogPost } from '@/src/lib/blog';
import { LANGUAGES } from '@/src/lib/constants';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import { removeToneMarks } from '@/src/lib/utils/pinyin';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';
import '../blog.css';

// ISR: Revalidate pages every 24 hours
export const revalidate = 86400;

// Allow dynamic params for older posts not pre-generated
export const dynamicParams = true;

// Only pre-generate last 60 days of posts for faster builds
// Older posts will be generated on-demand with ISR
const DAYS_TO_PREGENERATE = 60;

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - DAYS_TO_PREGENERATE);

  // Only return recent posts for static generation
  const recentPosts = posts.filter((post: BlogPost) =>
    new Date(post.date) >= cutoffDate
  );

  return recentPosts.map((post: BlogPost) => ({
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

  // Compute pinyin without tones for search matching (people search "ma dao cheng gong" not "mǎ dào chéng gōng")
  const pinyinNoTones = removeToneMarks(post.idiom.pinyin).toLowerCase();

  // SEO title: characters + searchable pinyin + "Meaning" keyword + metaphoric meaning
  const title = `${post.idiom.characters} (${pinyinNoTones}) Meaning - ${post.idiom.metaphoric_meaning} | Chinese Idiom`;

  // Optimized meta description with keyword-rich content (150-160 chars)
  const description = `${post.idiom.characters} (${pinyinNoTones}): "${post.idiom.meaning}" - Learn the meaning, origin & usage of this Chinese idiom. ${post.idiom.metaphoric_meaning}. Examples & cultural context.`;

  return {
    title,
    description,
    keywords: [
      post.idiom.characters,
      post.idiom.pinyin,
      pinyinNoTones,
      `${pinyinNoTones} meaning`,
      `${post.idiom.characters} meaning`,
      `${post.idiom.characters} meaning in english`,
      `${post.idiom.characters} 意味`,
      `${post.idiom.characters} 英文`,
      'chinese idiom',
      'chengyu',
      post.idiom.theme.toLowerCase()
    ].join(', '),
    openGraph: {
      title,
      description,
      url: `https://www.chineseidioms.com/blog/${slug}`,
      siteName: 'Daily Chinese Idioms',
      locale: 'en_US',
      alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Daily Chinese Idioms'],
      tags: ['Chinese idioms', 'Chengyu', post.idiom.theme, 'Learn Chinese'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/blog/${slug}`,
      languages: {
        'x-default': `/blog/${slug}`,
        'en': `/blog/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog/${slug}`])
        ),
      },
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Get all posts for navigation and related content
  const allPosts = await getAllBlogPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  
  // Find semantically related posts (stronger topical relevance)
  const relatedPosts = allPosts
    .filter(p => {
      // Same theme OR similar meaning patterns
      const sameTheme = p.idiom.theme === post.idiom.theme;
      const similarMeaning = p.idiom.metaphoric_meaning.toLowerCase().includes(
        post.idiom.metaphoric_meaning.toLowerCase().split(' ')[0]
      );
      return (sameTheme || similarMeaning) && p.slug !== slug;
    })
    .slice(0, 8);
    
  // Generate pinyin variants using centralized utility function
  const noTones = removeToneMarks(post.idiom.pinyin).toLowerCase();
  const pinyinVariants = {
    withTones: post.idiom.pinyin,
    noTones,
    withSpaces: noTones
  };

  // Process markdown content
  const processedContent = await remark()
    .use(html)
    .process(post.content);
  const contentHtml = processedContent.toString();

  // Enhanced structured data with DefinedTerm and multiple schemas
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": post.idiom.characters,
      "alternateName": [
        pinyinVariants.withTones,
        pinyinVariants.noTones,
        pinyinVariants.withSpaces,
        `${post.idiom.characters} meaning`,
        `${post.idiom.characters} in english`
      ],
      "description": `${post.idiom.characters} literally means "${post.idiom.meaning}" and metaphorically means "${post.idiom.metaphoric_meaning}"`,
      "inDefinedTermSet": "https://www.chineseidioms.com/blog",
      "termCode": post.idiom.id || slug
    },
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "alternativeHeadline": `${post.idiom.characters} - Chinese Idiom Meaning and Examples`,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "name": "Daily Chinese Idioms",
        "url": "https://www.chineseidioms.com"
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
      "articleBody": post.idiom.description,
      "inLanguage": "en",
      "keywords": `${post.idiom.characters}, ${pinyinVariants.withTones}, ${pinyinVariants.noTones}, chinese idiom, chengyu, ${post.idiom.theme}`,
      "wordCount": post.content.split(' ').length,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.chineseidioms.com/blog/${slug}`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What does ${post.idiom.characters} mean?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${post.idiom.characters} (${post.idiom.pinyin}) literally means "${post.idiom.meaning}" and metaphorically means "${post.idiom.metaphoric_meaning}". It belongs to the ${post.idiom.theme} category of Chinese idioms.`
          }
        },
        {
          "@type": "Question",
          "name": `How do you pronounce ${post.idiom.characters}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${post.idiom.characters} is pronounced as "${post.idiom.pinyin}" in Mandarin Chinese.`
          }
        },
        {
          "@type": "Question",
          "name": `When is ${post.idiom.characters} used?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${post.idiom.characters} is used when ${post.idiom.example || `describing situations involving ${post.idiom.metaphoric_meaning.toLowerCase()}`}.`
          }
        }
      ]
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
          "name": "Blog",
          "item": "https://www.chineseidioms.com/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.idiom.characters,
          "item": `https://www.chineseidioms.com/blog/${slug}`
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
          
          {/* Definition Box - Above the fold, 40-60 words */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {post.idiom.characters} ({pinyinVariants.withTones}) literally means &ldquo;{post.idiom.meaning.toLowerCase()}&rdquo; 
              and expresses &ldquo;{post.idiom.metaphoric_meaning.toLowerCase()}&rdquo;. 
              This idiom is used when describing situations involving {post.idiom.theme.toLowerCase().replace('&', 'and')}. 
              It originates from ancient Chinese literature and remains commonly used in modern Mandarin.
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Also searched as:</strong> {pinyinVariants.noTones}, {pinyinVariants.withSpaces}, 
              {post.idiom.characters} meaning, {post.idiom.characters} in english
            </p>
          </div>

          <AdUnit slot="1234567890" />

          <p className="text-xl text-black font-medium">{post.idiom.metaphoric_meaning}</p>
        </header>

        <div className="blog-content">
          <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>

        <AdUnit slot="1234567891" />

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
        
        {/* Enhanced Related Posts Section with stronger topical relevance */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-2 text-gray-900">Related Chinese Idioms</h2>
            <p className="text-gray-800 mb-6">Similar idioms about {post.idiom.theme.toLowerCase()}</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/blog/${relatedPost.slug}`}
                  className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {relatedPost.idiom.characters}
                  </h3>
                  <p className="text-xs text-gray-700 mb-1 font-medium">{relatedPost.idiom.pinyin}</p>
                  <p className="text-sm text-gray-800 line-clamp-2">
                    {relatedPost.idiom.metaphoric_meaning}
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Learn more →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
        
        {/* FAQ Section for Featured Snippets */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">What does {post.idiom.characters} mean in English?</h3>
              <p className="text-gray-800">
                {post.idiom.characters} ({post.idiom.pinyin}) literally translates to &ldquo;{post.idiom.meaning}&rdquo; 
                and is used to express &ldquo;{post.idiom.metaphoric_meaning}&rdquo;. This Chinese idiom belongs to 
                the {post.idiom.theme} category.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">When is {post.idiom.characters} used?</h3>
              <p className="text-gray-800">
                <strong>Situation:</strong> {post.idiom.example || `This idiom applies when describing situations involving ${post.idiom.metaphoric_meaning.toLowerCase()}.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">What is the pinyin for {post.idiom.characters}?</h3>
              <p className="text-gray-800">
                The pinyin pronunciation for {post.idiom.characters} is &ldquo;{post.idiom.pinyin}&rdquo;.
              </p>
            </div>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
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