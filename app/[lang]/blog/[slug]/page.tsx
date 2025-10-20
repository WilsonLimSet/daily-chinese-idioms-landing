import { notFound } from 'next/navigation';
import { getAllBlogPosts, getBlogPost } from '@/src/lib/blog-intl';
import Link from 'next/link';
import { Calendar, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { remark } from 'remark';
import html from 'remark-html';
import { getTranslation } from '@/src/lib/translations';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { removeToneMarks } from '@/src/lib/utils/pinyin';
import LanguageSelector from '@/app/components/LanguageSelector';
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
      title: 'Idiom Not Found',
    };
  }

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];

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
        'en': `/blog/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog/${slug}`])
        ),
      },
    },
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

  // Get all posts for navigation and related content
  const allPosts = await getAllBlogPosts(lang);
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
    .slice(0, 4);

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

  // const langName = LANGUAGES[lang as keyof typeof LANGUAGES];

  // Generate FAQ schema for rich snippets
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': `${getTranslation(lang, 'faqMeaningQuestion')} ${post.idiom.characters} ${getTranslation(lang, 'meaningInEnglish')}`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${post.idiom.characters} (${post.idiom.pinyin}) ${getTranslation(lang, 'faqMeaningAnswer1')} "${post.idiom.meaning}" ${getTranslation(lang, 'faqMeaningAnswer2')} "${post.idiom.metaphoric_meaning}". ${getTranslation(lang, 'faqMeaningAnswer3')} ${post.idiom.theme} ${getTranslation(lang, 'faqMeaningAnswer4')}.`
        }
      },
      {
        '@type': 'Question',
        'name': `${getTranslation(lang, 'faqUsageQuestion')} ${post.idiom.characters} ${getTranslation(lang, 'faqUsageAnswer1')}`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${getTranslation(lang, 'faqUsagePrefix')} ${post.idiom.example || `${getTranslation(lang, 'faqUsageDefault')} ${post.idiom.metaphoric_meaning.toLowerCase()}.`}`
        }
      },
      {
        '@type': 'Question',
        'name': `${getTranslation(lang, 'faqPinyinQuestion')} ${post.idiom.characters}?`,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `${getTranslation(lang, 'faqPinyinAnswer')} ${post.idiom.characters} ${getTranslation(lang, 'faqPinyinAnswer2')} "${post.idiom.pinyin}".`
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FAQ Schema for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="blog-content max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Link href={`/${lang}/blog`} className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          {getTranslation(lang, 'backToAll')}
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
                {new Date(post.date).toLocaleDateString(LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Definition Box - Above the fold */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-6">
            <p className="text-lg font-medium text-gray-900 mb-2">
              {post.idiom.characters} ({pinyinVariants.withTones}) {getTranslation(lang, 'literally')} {getTranslation(lang, 'means')} &ldquo;{post.idiom.meaning.toLowerCase()}&rdquo;
              {getTranslation(lang, 'andExpresses')} &ldquo;{post.idiom.metaphoric_meaning.toLowerCase()}&rdquo;.
              {getTranslation(lang, 'usedWhen')} {post.idiom.theme.toLowerCase().replace('&', 'and')}.
              {getTranslation(lang, 'originsFrom')}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              <strong>{getTranslation(lang, 'alsoSearchedAs')}</strong> {pinyinVariants.noTones}, {pinyinVariants.withSpaces},
              {post.idiom.characters} {getTranslation(lang, 'meaning')}, {post.idiom.characters} {getTranslation(lang, 'inEnglish')}
            </p>
          </div>
        </header>

        <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: contentHtml }} />

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
                <div className="font-medium">{prevPost.idiom.characters}</div>
                <div className="text-sm text-gray-600 line-clamp-1">{prevPost.idiom.metaphoric_meaning}</div>
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
            <h2 className="text-2xl font-bold mb-2 text-gray-900">{getTranslation(lang, 'relatedIdiomsTitle')}</h2>
            <p className="text-gray-800 mb-6">{getTranslation(lang, 'relatedIdiomsSubtitle')} {post.idiom.theme.toLowerCase()}</p>
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

        {/* FAQ Section for Featured Snippets */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{getTranslation(lang, 'faqTitle')}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">{getTranslation(lang, 'faqMeaningQuestion')} {post.idiom.characters} {getTranslation(lang, 'meaningInEnglish')}</h3>
              <p className="text-gray-800">
                {post.idiom.characters} ({post.idiom.pinyin}) {getTranslation(lang, 'faqMeaningAnswer1')} &ldquo;{post.idiom.meaning}&rdquo;
                {getTranslation(lang, 'faqMeaningAnswer2')} &ldquo;{post.idiom.metaphoric_meaning}&rdquo;. {getTranslation(lang, 'faqMeaningAnswer3')}
                {post.idiom.theme} {getTranslation(lang, 'faqMeaningAnswer4')}.
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
                href="/privacy"
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