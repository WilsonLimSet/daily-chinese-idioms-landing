import { getBlogPost, getAllBlogPosts, type BlogPost } from '@/src/lib/blog';
import { getLocalizedSlugsForOriginal } from '@/src/lib/blog-intl';
import { LANGUAGES } from '@/src/lib/constants';
import { getListiclesForIdiom } from '@/src/lib/listicles';
import { getDramaForBlogSlug, getRelatedDramas } from '@/src/lib/dramas';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import { removeToneMarks } from '@/src/lib/utils/pinyin';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';
import '../blog.css';

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }));
}

// Custom meta overrides for high-traffic idioms with specific search intent
const IDIOM_META_OVERRIDES: Record<string, { title: string; description: string; extraKeywords: string[] }> = {
  'wu-ji-bi-fan': {
    title: '物极必反 (wù jí bì fǎn) — "Extremes Lead to Reversal" | Karate Kid Quote Explained',
    description: 'What does 物极必反 (wu ji bi fan) mean? "When things reach their extreme, they reverse." Made famous by Karate Kid — this 2000-year-old Chinese philosophy from the I Ching explains why nothing extreme lasts. Origin, meaning & examples.',
    extraKeywords: ['wu ji bi fan karate kid', 'wujibifan', 'gu yi bi fan', 'wu yi bi fan', 'bu yi bi fan', 'wu ji bi fan meaning', 'wu ji bi fan significado', 'frase karate kid wu ji bi fan', '物极必反 英文', '物极必反 meaning'],
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  // Detect article-style posts (no specific idiom)
  const isArticle = !post.idiom.characters;

  // Compute pinyin without tones for search matching (people search "ma dao cheng gong" not "mǎ dào chéng gōng")
  const pinyinNoTones = removeToneMarks(post.idiom.pinyin).toLowerCase();

  // Check for custom meta override
  const override = IDIOM_META_OVERRIDES[slug];

  // SEO title and description differ for article vs idiom posts
  const title = override?.title || (isArticle
    ? `${post.title} — Chinese Idioms`
    : `${post.idiom.characters} (${pinyinNoTones}) — "${post.idiom.metaphoric_meaning}" | Meaning & Origin`);

  const description = override?.description || (isArticle
    ? (post.idiom.description || post.title)
    : `What does ${post.idiom.characters} (${pinyinNoTones}) mean? "${post.idiom.metaphoric_meaning}" — literally "${post.idiom.meaning}". Learn the origin story, how to use it, and example sentences for this Chinese idiom (成语).`);

  // Generate pinyin misspelling variants (no spaces, common errors)
  const pinyinNoSpaces = pinyinNoTones.replace(/\s+/g, '');
  const misspellingKeywords = pinyinNoSpaces !== pinyinNoTones ? [pinyinNoSpaces] : [];

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
      post.idiom.theme.toLowerCase(),
      ...misspellingKeywords,
      ...(override?.extraKeywords || []),
    ].join(', '),
    openGraph: {
      title,
      description,
      url: `https://www.chineseidioms.com/blog/${slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.date,
      authors: ['Chinese Idioms'],
      tags: ['Chinese idioms', 'Chengyu', post.idiom.theme, 'Learn Chinese'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: (() => {
      const slugMap = getLocalizedSlugsForOriginal(slug);
      return {
        canonical: `https://www.chineseidioms.com/blog/${slug}`,
        languages: {
          'x-default': `/blog/${slug}`,
          'en': `/blog/${slug}`,
          ...Object.fromEntries(
            Object.keys(LANGUAGES).map(l => [l, `/${l}/blog/${slugMap[l] || slug}`])
          ),
        },
      };
    })(),
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  // Detect article-style posts (no specific idiom)
  const isArticle = !post.idiom.characters;

  // Detect drama-series article (e.g. pursuit-of-jade-*, first-frost-*)
  const drama = getDramaForBlogSlug(slug);
  const siblingDramas = drama ? getRelatedDramas(drama.slug, 3) : [];

  // Get all posts for navigation and related content
  const allPosts = await getAllBlogPosts();
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Find semantically related posts (stronger topical relevance)
  const relatedPosts = allPosts
    .filter(p => {
      if (!p.idiom.characters || !post.idiom.characters) {
        // For articles, match by theme only
        return p.idiom.theme === post.idiom.theme && p.slug !== slug;
      }
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

  // Enhanced structured data — different schemas for article vs idiom posts
  const structuredData = isArticle ? [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Organization",
        "name": "Chinese Idioms",
        "url": "https://www.chineseidioms.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Chinese Idioms",
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com'}/icon.png`
        }
      },
      "description": post.idiom.description || post.title,
      "inLanguage": "en",
      "keywords": `chinese idioms, chengyu, ${post.idiom.theme}, chinese culture, learn chinese`,
      "wordCount": post.content.split(' ').length,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.chineseidioms.com/blog/${slug}`
      }
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
          "name": post.title,
          "item": `https://www.chineseidioms.com/blog/${slug}`
        }
      ]
    }
  ] : [
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
        "name": "Chinese Idioms",
        "url": "https://www.chineseidioms.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Chinese Idioms",
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
          {post.idiom.theme && (
            <div className="flex items-center gap-3 mb-2">
              <Link
                href={`/themes/${post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-')}`}
                className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
              >
                {post.idiom.theme}
              </Link>
            </div>
          )}

          {isArticle ? (
            <>
              {drama && (
                <Link
                  href={`/dramas/${drama.slug}`}
                  className="group mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  <span className="opacity-60">Part of the</span>
                  <span className="font-semibold">{drama.englishName}</span>
                  <span className="opacity-60">guide</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-black mt-2 mb-4">
                {post.title}
              </h1>
              <p className="text-sm text-gray-500 mb-4">{post.date}</p>
              {post.idiom.description && (
                <p className="text-lg text-gray-700 mb-6">{post.idiom.description}</p>
              )}
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold text-black mt-2 mb-4">
                <span className="text-5xl text-black">{post.idiom.characters}</span>
              </h1>

              {/* Definition Box - Above the fold, 40-60 words */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {post.idiom.characters} ({pinyinVariants.withTones}) literally means &ldquo;{post.idiom.meaning.toLowerCase()}&rdquo;
                  and expresses &ldquo;{post.idiom.metaphoric_meaning.toLowerCase()}&rdquo;.
                  This idiom is used when describing situations involving {post.idiom.theme.toLowerCase().replace('&', 'and')}.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Also searched as:</strong> {pinyinVariants.noTones}, {pinyinVariants.withSpaces},
                  {post.idiom.characters} meaning, {post.idiom.characters} in english
                </p>
              </div>

              <p className="text-xl text-black font-medium">{post.idiom.metaphoric_meaning}</p>
            </>
          )}

          <AdUnit type="in-article" priority />
        </header>

        <div className="blog-content">
          {(() => {
            const parts = contentHtml.split(/<hr\s*\/?>/);
            if (parts.length < 3) {
              return <div dangerouslySetInnerHTML={{ __html: contentHtml }} />;
            }
            const mid = Math.floor(parts.length / 2);
            const firstHalf = parts.slice(0, mid).join('<hr/>') + '<hr/>';
            const secondHalf = parts.slice(mid).join('<hr/>');
            return (
              <>
                <div dangerouslySetInnerHTML={{ __html: firstHalf }} />
                <AdUnit type="in-article" />
                <div dangerouslySetInnerHTML={{ __html: secondHalf }} />
              </>
            );
          })()}
        </div>

        <AdUnit type="multiplex" />

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
                <div className="font-medium">{prevPost.idiom.characters || prevPost.title}</div>
                {prevPost.idiom.metaphoric_meaning && (
                  <div className="text-sm text-gray-600 line-clamp-1">{prevPost.idiom.metaphoric_meaning}</div>
                )}
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
                <div className="font-medium">{nextPost.idiom.characters || nextPost.title}</div>
                {nextPost.idiom.metaphoric_meaning && (
                  <div className="text-sm text-gray-600 line-clamp-1">{nextPost.idiom.metaphoric_meaning}</div>
                )}
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
        
        {/* FAQ Section for Featured Snippets - idiom posts only */}
        {!isArticle && (
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
        )}

        {/* Related Listicles */}
        {(() => {
          const relatedListicles = getListiclesForIdiom(post.idiom.id);
          return relatedListicles.length > 0 ? (
            <section className="mt-12 pt-8 border-t">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Curated Lists Featuring {post.idiom.characters}</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {relatedListicles.map(listicle => (
                  <Link
                    key={listicle.slug}
                    href={`/blog/lists/${listicle.slug}`}
                    className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-1">{listicle.title}</h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{listicle.description}</p>
                  </Link>
                ))}
              </div>
            </section>
          ) : null;
        })()}

        {/* Related Chinese Dramas — shown on drama articles */}
        {drama && siblingDramas.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
              More Chinese Dramas
            </p>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Explore other C-drama guides
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              {siblingDramas.map(d => (
                <Link
                  key={d.slug}
                  href={`/dramas/${d.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-red-200 hover:shadow-sm"
                >
                  <p className="text-2xl font-bold leading-tight text-gray-200 transition-colors group-hover:text-red-300">
                    {d.chineseName}
                  </p>
                  <p className="mt-2 text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-red-500">
                    {d.englishName}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    {d.year}
                    {d.status === 'airing' && ' · Now airing'}
                    {d.status === 'upcoming' && ' · Coming soon'}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/dramas"
                className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
              >
                See all Chinese drama guides
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Explore More */}
        <nav className="mt-8 pt-6 border-t flex flex-wrap gap-4 text-sm text-gray-600">
          <Link href="/dictionary" className="hover:text-red-600 transition-colors">Browse Dictionary</Link>
          <span className="text-gray-300">|</span>
          <Link href="/blog/lists" className="hover:text-red-600 transition-colors">Curated Lists</Link>
          <span className="text-gray-300">|</span>
          {drama ? (
            <>
              <Link href="/dramas" className="hover:text-red-600 transition-colors">Chinese Dramas</Link>
              <span className="text-gray-300">|</span>
            </>
          ) : (
            <>
              <Link href={`/themes/${post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-')}`} className="hover:text-red-600 transition-colors">More {post.idiom.theme} Idioms</Link>
              <span className="text-gray-300">|</span>
            </>
          )}
          <Link href="/faq" className="hover:text-red-600 transition-colors">FAQ</Link>
        </nav>
      </article>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} chineseidioms</p>
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