import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPost, getLocalizedSlugsForOriginal } from '@/src/lib/blog-intl';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import { getTranslation, getThemeTranslation } from '@/src/lib/translations';
import { LANGUAGES, LANGUAGE_CONFIG } from '@/src/lib/constants';
import { removeToneMarks } from '@/src/lib/utils/pinyin';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';
import { getListiclesForIdiom, getLocalizedSlug as getLocalizedListicleSlug } from '@/src/lib/listicles';
import { getDramaForBlogSlug, getRelatedDramas } from '@/src/lib/dramas';
import '@/app/blog/blog.css';

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
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await params;
  const post = await getBlogPost(slug, lang);

  if (!post) {
    return {
      title: getTranslation(lang, 'idiomNotFound'),
    };
  }

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;

  // Detect article-style posts (no specific idiom)
  const isArticle = !post.idiom.characters;

  // Compute pinyin without tones for search matching
  const pinyinNoTones = removeToneMarks(post.idiom.pinyin).toLowerCase();

  // Get localized "meaning" word for SEO (e.g., "意味" for ja, "Significado" for es)
  const meaningWord = getTranslation(lang, 'meaning');

  const localeMap: { [key: string]: string } = {
    'es': 'es_ES',
    'pt': 'pt_BR',
    'id': 'id_ID',
    'vi': 'vi_VN',
    'ja': 'ja_JP',
    'ko': 'ko_KR',
    'th': 'th_TH',
    'hi': 'hi_IN',
    'ar': 'ar_AR',
    'fr': 'fr_FR',
    'de': 'de_DE',
    'tl': 'tl_PH',
    'ms': 'ms_MY',
    'ru': 'ru_RU'
  };

  const ogLocale = localeMap[lang] || 'en_US';
  const alternateLocales = Object.keys(LANGUAGES)
    .filter(l => l !== lang)
    .map(l => localeMap[l] || 'en_US');

  // SEO title and description differ for article vs idiom posts
  const title = isArticle
    ? `${post.title} | ${nativeName}`
    : `${post.idiom.characters} (${pinyinNoTones}) — "${post.idiom.metaphoric_meaning}" | ${nativeName}`;

  const description = isArticle
    ? (post.idiom.description || post.title)
    : `${post.idiom.characters} (${post.idiom.pinyin}): "${post.idiom.metaphoric_meaning}" — ${getTranslation(lang, 'faqMeaningAnswer1')} "${post.idiom.meaning}". ${getTranslation(lang, 'originUsage')}.`;

  const idiomKeywords = isArticle ? [] : [
    post.idiom.characters,
    post.idiom.pinyin,
    pinyinNoTones,
    pinyinNoTones.replace(/\s+/g, ''),
    `${pinyinNoTones} meaning`,
    `${post.idiom.characters} ${meaningWord}`,
    `${post.idiom.characters} meaning`,
    `${post.idiom.characters} 英文`,
    `${post.idiom.characters} 意味`,
  ];

  return {
    title,
    description,
    keywords: [
      ...idiomKeywords,
      'chinese idioms',
      'chengyu',
      '成语',
      post.idiom.theme,
      nativeName,
    ],
    openGraph: {
      title,
      description: isArticle ? (post.idiom.description || post.title) : post.idiom.metaphoric_meaning,
      url: `https://www.chineseidioms.com/${lang}/blog/${slug}`,
      siteName: 'Chinese Idioms',
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'article',
      publishedTime: post.date,
      images: ['/og-image.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: isArticle ? (post.idiom.description || post.title) : post.idiom.metaphoric_meaning,
      images: ['/og-image.png'],
    },
    alternates: (() => {
      // Resolve the English (original) slug for this post so hreflang alternates
      // can point at the correct localized slug in each language.
      const englishSlug = post.originalSlug || slug;
      const slugMap = getLocalizedSlugsForOriginal(englishSlug);
      return {
        canonical: `https://www.chineseidioms.com/${lang}/blog/${slug}`,
        languages: {
          'x-default': `/blog/${englishSlug}`,
          'en': `/blog/${englishSlug}`,
          ...Object.fromEntries(
            Object.entries(slugMap)
              .filter(([l]) => l !== 'en')
              .map(([l, s]) => [l, `/${l}/blog/${s}`])
          ),
        },
      };
    })(),
  };
}

export default async function InternationalBlogPostPage({
  params
}: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await params;
  const post = await getBlogPost(slug, lang);

  if (!post) {
    notFound();
  }

  // Detect article-style posts (no specific idiom)
  const isArticle = !post.idiom.characters;

  // Detect drama-series article — match against English originalSlug since postPrefix is English
  const originalSlug = post.originalSlug || slug;
  const drama = getDramaForBlogSlug(originalSlug);
  const siblingDramas = drama ? getRelatedDramas(drama.slug, 3) : [];

  // Get all posts for navigation and related content
  const allPosts = await getAllBlogPosts(lang);
  const currentIndex = allPosts.findIndex(p => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  // Find semantically related posts (stronger topical relevance)
  // Require a real idiom on the candidate so drama articles (empty idiom fields) don't render blank cards.
  const relatedPosts = allPosts
    .filter(p => {
      if (p.slug === slug) return false;
      if (!p.idiom.characters) return false;
      if (!post.idiom.characters) {
        return p.idiom.theme === post.idiom.theme;
      }
      const sameTheme = p.idiom.theme === post.idiom.theme;
      const similarMeaning = p.idiom.metaphoric_meaning.toLowerCase().includes(
        post.idiom.metaphoric_meaning.toLowerCase().split(' ')[0]
      );
      return sameTheme || similarMeaning;
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

  // Generate comprehensive structured data with proper inLanguage
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: isArticle ? post.title : `${post.idiom.characters} - ${post.idiom.metaphoric_meaning}`,
      ...(isArticle ? {} : { alternativeHeadline: `${post.idiom.characters} (${post.idiom.pinyin})` }),
      datePublished: post.date,
      dateModified: post.date,
      author: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        url: 'https://www.chineseidioms.com'
      },
      publisher: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        logo: {
          '@type': 'ImageObject',
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com'}/icon.png`
        }
      },
      description: isArticle
        ? (post.idiom.description || post.title)
        : post.idiom.metaphoric_meaning,
      inLanguage: lang,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.chineseidioms.com/${lang}/blog/${slug}`
      }
    },
    // FAQ schema only applies to idiom posts — drama/article posts lack the characters/pinyin/meaning fields.
    ...(isArticle ? [] : [{
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: lang,
      mainEntity: [
        {
          '@type': 'Question',
          name: `${getTranslation(lang, 'faqMeaningQuestion')} ${post.idiom.characters} ${getTranslation(lang, 'meaningInEnglish')}`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${post.idiom.characters} (${post.idiom.pinyin}) ${getTranslation(lang, 'faqMeaningAnswer1')} "${post.idiom.meaning}" ${getTranslation(lang, 'faqMeaningAnswer2')} "${post.idiom.metaphoric_meaning}". ${getTranslation(lang, 'faqMeaningAnswer3')} ${getThemeTranslation(lang, post.idiom.theme)} ${getTranslation(lang, 'faqMeaningAnswer4')}.`
          }
        },
        {
          '@type': 'Question',
          name: `${getTranslation(lang, 'faqUsageQuestion')} ${post.idiom.characters} ${getTranslation(lang, 'faqUsageAnswer1')}`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${getTranslation(lang, 'faqUsagePrefix')} ${post.idiom.example || `${getTranslation(lang, 'faqUsageDefault')} ${post.idiom.metaphoric_meaning.toLowerCase()}.`}`
          }
        },
        {
          '@type': 'Question',
          name: `${getTranslation(lang, 'faqPinyinQuestion')} ${post.idiom.characters}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${getTranslation(lang, 'faqPinyinAnswer')} ${post.idiom.characters} ${getTranslation(lang, 'faqPinyinAnswer2')} "${post.idiom.pinyin}".`
          }
        }
      ]
    }]),
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: getTranslation(lang, 'home'),
          item: `https://www.chineseidioms.com/${lang}`
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: getTranslation(lang, 'footerBlog'),
          item: `https://www.chineseidioms.com/${lang}/blog`
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: post.idiom.characters || post.title,
          item: `https://www.chineseidioms.com/${lang}/blog/${slug}`
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <article className="blog-content max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href={`/${lang}/blog`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {getTranslation(lang, 'backToAll')}
        </Link>

        <header className="mb-8 pb-8 border-b">
          {isArticle ? (
            <div className="mb-4">
              {drama && (
                <Link
                  href="/dramas"
                  className="group mb-4 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                >
                  <span className="font-semibold">{drama.englishName}</span>
                  <span className="opacity-60">·</span>
                  <span className="opacity-70">{drama.chineseName}</span>
                  <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                {post.title}
              </h1>
              <p className="text-sm text-gray-500 mb-4">{post.date}</p>
              {post.idiom.theme && (
                <Link
                  href={`/${lang}/themes/${post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-')}`}
                  className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
                >
                  {getThemeTranslation(lang, post.idiom.theme)}
                </Link>
              )}
              {post.idiom.description && (
                <p className="text-lg text-gray-700 mt-4">{post.idiom.description}</p>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <h1 className="text-5xl font-bold text-gray-900 mb-3">
                {post.idiom.characters}
                {post.idiom.traditionalCharacters && post.idiom.traditionalCharacters !== post.idiom.characters && (
                  <span className="text-3xl text-gray-500 ml-3">({post.idiom.traditionalCharacters})</span>
                )}
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <span className="text-lg font-medium">{post.idiom.pinyin}</span>
                <Link
                  href={`/${lang}/themes/${post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-')}`}
                  className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full border border-red-200 hover:bg-red-100 transition-colors"
                >
                  {getThemeTranslation(lang, post.idiom.theme)}
                </Link>
              </div>

              {/* Definition Box - Above the fold */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {post.idiom.characters} ({pinyinVariants.withTones}) {getTranslation(lang, 'literally')} {getTranslation(lang, 'means')} &ldquo;{post.idiom.meaning.toLowerCase()}&rdquo;
                  {getTranslation(lang, 'andExpresses')} &ldquo;{post.idiom.metaphoric_meaning.toLowerCase()}&rdquo;.
                  {getTranslation(lang, 'usedWhen')} {getThemeTranslation(lang, post.idiom.theme).toLowerCase()}.
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>{getTranslation(lang, 'alsoSearchedAs')}</strong> {pinyinVariants.noTones}, {pinyinVariants.withSpaces},
                  {post.idiom.characters} {getTranslation(lang, 'meaning')}, {post.idiom.characters} {getTranslation(lang, 'inEnglish')}
                </p>
              </div>
            </div>
          )}

          <AdUnit type="in-article" priority />
        </header>

        {(() => {
          const parts = contentHtml.split(/<hr\s*\/?>/);
          if (parts.length < 3) {
            return <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />;
          }
          const mid = Math.floor(parts.length / 2);
          const firstHalf = parts.slice(0, mid).join('<hr/>') + '<hr/>';
          const secondHalf = parts.slice(mid).join('<hr/>');
          return (
            <>
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: firstHalf }} />
              <AdUnit type="in-article" />
              <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: secondHalf }} />
            </>
          );
        })()}

        <AdUnit type="multiplex" />

        {/* Previous/Next Navigation */}
        <nav className="mt-12 flex justify-between items-center border-t pt-8">
          {prevPost ? (
            <Link
              href={`/${lang}/blog/${prevPost.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group max-w-[45%]"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <div className="text-left">
                <div className="text-sm text-gray-500">{getTranslation(lang, 'previous')}</div>
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
              href={`/${lang}/blog/${nextPost.slug}`}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 group max-w-[45%] text-right"
            >
              <div>
                <div className="text-sm text-gray-500">{getTranslation(lang, 'next')}</div>
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{getTranslation(lang, 'relatedIdiomsTitle')}</h2>
            <p className="text-gray-800 mb-6">{getTranslation(lang, 'relatedIdiomsSubtitle')} {getThemeTranslation(lang, post.idiom.theme).toLowerCase()}</p>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.slug}
                  href={`/${lang}/blog/${relatedPost.slug}`}
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
                    {getTranslation(lang, 'learnMoreArrow')}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ Section for Featured Snippets - idiom posts only */}
        {!isArticle && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">{getTranslation(lang, 'faqTitle')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{getTranslation(lang, 'faqMeaningQuestion')} {post.idiom.characters} {getTranslation(lang, 'meaningInEnglish')}</h3>
                <p className="text-gray-800">
                  {post.idiom.characters} ({post.idiom.pinyin}) {getTranslation(lang, 'faqMeaningAnswer1')} &ldquo;{post.idiom.meaning}&rdquo;
                  {getTranslation(lang, 'faqMeaningAnswer2')} &ldquo;{post.idiom.metaphoric_meaning}&rdquo;. {getTranslation(lang, 'faqMeaningAnswer3')}
                  {getThemeTranslation(lang, post.idiom.theme)} {getTranslation(lang, 'faqMeaningAnswer4')}.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{getTranslation(lang, 'faqUsageQuestion')} {post.idiom.characters} {getTranslation(lang, 'faqUsageAnswer1')}</h3>
                <p className="text-gray-800">
                  <strong>{getTranslation(lang, 'faqUsagePrefix')}</strong> {post.idiom.example || `${getTranslation(lang, 'faqUsageDefault')} ${post.idiom.metaphoric_meaning.toLowerCase()}.`}
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{getTranslation(lang, 'faqPinyinQuestion')} {post.idiom.characters}?</h3>
                <p className="text-gray-800">
                  {getTranslation(lang, 'faqPinyinAnswer')} {post.idiom.characters} {getTranslation(lang, 'faqPinyinAnswer2')} &ldquo;{post.idiom.pinyin}&rdquo;.
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
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{getTranslation(lang, 'curatedListsFeaturing')} {post.idiom.characters}</h2>
              <div className="grid gap-3 md:grid-cols-3">
                {relatedListicles.map(listicle => (
                  <Link
                    key={listicle.slug}
                    href={`/${lang}/blog/lists/${getLocalizedListicleSlug(listicle.slug, lang)}`}
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
              {drama.englishName}
            </p>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              {drama.chineseName}
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
                  <p className="mt-1 text-xs text-gray-400">{d.year}</p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                href="/dramas"
                className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
              >
                {getTranslation(lang, 'dramasCardCta')}
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Explore More */}
        <nav className="mt-8 pt-6 border-t flex flex-wrap gap-4 text-sm text-gray-600">
          <Link href={`/${lang}/dictionary`} className="hover:text-red-600 transition-colors">{getTranslation(lang, 'browseDictionary')}</Link>
          <span className="text-gray-300">|</span>
          <Link href={`/${lang}/blog/lists`} className="hover:text-red-600 transition-colors">{getTranslation(lang, 'curatedLists')}</Link>
          <span className="text-gray-300">|</span>
          {drama ? (
            <Link href="/dramas" className="hover:text-red-600 transition-colors">Chinese Dramas</Link>
          ) : (
            <Link href={`/${lang}/themes/${post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-')}`} className="hover:text-red-600 transition-colors">{getTranslation(lang, 'moreThemeIdioms')}</Link>
          )}
        </nav>

      </article>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} {getTranslation(lang, 'footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {getTranslation(lang, 'footerBuiltBy')}
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {getTranslation(lang, 'footerBlog')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href={`/${lang}/privacy`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {getTranslation(lang, 'footerPrivacy')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}