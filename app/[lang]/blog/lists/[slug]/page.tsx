import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, BookOpen, ChevronRight } from 'lucide-react';
import {
  getAllListiclesTranslated,
  getListicleWithIdiomsTranslated,
  getLocalizedSlug,
  TranslatedListicle
} from '@/src/lib/listicles';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const revalidate = 86400;
export const dynamicParams = true;

export async function generateStaticParams() {
  const params = [];

  for (const lang of Object.keys(LANGUAGES)) {
    const listicles = getAllListiclesTranslated(lang);
    // Only pre-render top 20 per language; rest generated on-demand via ISR
    for (const listicle of listicles.slice(0, 20)) {
      params.push({ lang, slug: listicle.slug });
    }
  }

  return params;
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string; lang: string }>
}): Promise<Metadata> {
  const { slug, lang } = await params;
  const listicle = getListicleWithIdiomsTranslated(slug, lang);

  if (!listicle) {
    return {
      title: 'List Not Found',
    };
  }

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  // Get original slug for cross-language linking
  const originalSlug = (listicle as TranslatedListicle).originalSlug || listicle.slug;

  // Build language alternates with localized slugs for each language
  const languageAlternates: Record<string, string> = {
    'x-default': `/blog/lists/${originalSlug}`,
    'en': `/blog/lists/${originalSlug}`,
  };
  for (const l of Object.keys(LANGUAGES)) {
    const localizedSlug = getLocalizedSlug(originalSlug, l);
    languageAlternates[l] = `/${l}/blog/lists/${localizedSlug}`;
  }

  return {
    title: `${listicle.title} | Chinese Idioms Guide (${langName})`,
    description: listicle.metaDescription,
    keywords: listicle.keywords.join(', '),
    openGraph: {
      title: listicle.title,
      description: listicle.metaDescription,
      url: `https://www.chineseidioms.com/${lang}/blog/lists/${slug}`,
      siteName: 'Daily Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
      publishedTime: listicle.publishedDate,
      authors: ['Daily Chinese Idioms'],
      tags: ['Chinese idioms', 'Chengyu', listicle.category, 'Learn Chinese', langName],
    },
    twitter: {
      card: 'summary_large_image',
      title: listicle.title,
      description: listicle.metaDescription,
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/blog/lists/${slug}`,
      languages: languageAlternates,
    },
  };
}

export default async function TranslatedListiclePage({
  params
}: {
  params: Promise<{ slug: string; lang: string }>
}) {
  const { slug, lang } = await params;
  const listicle = getListicleWithIdiomsTranslated(slug, lang);

  if (!listicle) {
    notFound();
  }

  // Redirect English slugs to localized slugs
  const localizedSlug = listicle.slug;
  if (localizedSlug !== slug) {
    redirect(`/${lang}/blog/lists/${localizedSlug}`);
  }

  const allListicles = getAllListiclesTranslated(lang).filter(l => l.slug !== slug).slice(0, 4);
  const t = (key: string) => getTranslation(lang, key as keyof typeof import('@/src/lib/translations').translations.en);

  // Structured data for SEO - this is safe static data from our own database, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": listicle.title,
      "description": listicle.metaDescription,
      "datePublished": listicle.publishedDate,
      "dateModified": listicle.publishedDate,
      "inLanguage": lang,
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
          "url": "https://www.chineseidioms.com/icon.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.chineseidioms.com/${lang}/blog/lists/${slug}`
      },
      "articleSection": listicle.category,
      "keywords": listicle.keywords.join(', ')
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": listicle.title,
      "description": listicle.description,
      "numberOfItems": listicle.idioms.length,
      "itemListElement": listicle.idioms.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.idiom?.characters,
        "description": item.idiom?.metaphoric_meaning,
        "url": item.blogSlug ? `https://www.chineseidioms.com/${lang}/blog/${item.blogSlug}` : undefined
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": `https://www.chineseidioms.com/${lang}`
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `https://www.chineseidioms.com/${lang}/blog`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "Lists",
          "item": `https://www.chineseidioms.com/${lang}/blog/lists`
        },
        {
          "@type": "ListItem",
          "position": 4,
          "name": listicle.title,
          "item": `https://www.chineseidioms.com/${lang}/blog/lists/${slug}`
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

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/blog/lists`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('backToAll')}
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4">
            <BookOpen className="w-4 h-4" />
            <span>{listicle.category}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            {listicle.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            {listicle.description}
          </p>
        </header>

        {/* Introduction */}
        <div className="mb-14">
          <p className="text-gray-600 leading-relaxed text-base sm:text-lg border-l-4 border-red-500 pl-6 py-2 bg-gradient-to-r from-red-50/50 to-transparent rounded-r-lg">
            {listicle.intro}
          </p>
        </div>

        <AdUnit type="display" />

        {/* Idiom List */}
        <div className="space-y-6">
          {listicle.idioms.map((item, index) => {
            if (!item.idiom) return null;

            return (
              <div
                key={item.idiom.id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-xl hover:border-red-100 hover:-translate-y-1 transition-all duration-300 ease-out"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <span className="text-white font-bold text-lg sm:text-xl">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mb-3">
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight group-hover:text-red-600 transition-colors duration-300">
                        {item.idiom.characters}
                      </h2>
                      <span className="text-gray-400 text-base sm:text-lg font-medium">
                        {item.idiom.pinyin}
                      </span>
                    </div>

                    <p className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                      {item.idiom.metaphoric_meaning}
                    </p>

                    <p className="text-gray-500 mb-4 text-sm sm:text-base">
                      <span className="font-medium text-gray-600">{t('literalMeaning')}:</span> {item.idiom.meaning}
                    </p>

                    <p className="text-gray-700 mb-5 leading-relaxed text-sm sm:text-base">
                      {item.idiom.description.substring(0, 300)}
                      {item.idiom.description.length > 300 ? '...' : ''}
                    </p>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 sm:p-5 mb-5 border border-gray-100">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                        {t('example')}
                      </p>
                      <p className="text-gray-800 font-medium mb-1">{item.idiom.example}</p>
                      <p className="text-gray-500 text-sm">{item.idiom.chineseExample}</p>
                    </div>

                    {item.blogSlug && (
                      <Link
                        href={`/${lang}/blog/${item.blogSlug}`}
                        className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold text-sm group/link"
                      >
                        <span className="border-b border-transparent group-hover/link:border-red-600 transition-colors">
                          {t('learnMoreArrow') || `Learn more about ${item.idiom.characters}`}
                        </span>
                        <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <section className="mt-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 rounded-3xl p-8 sm:p-10 border border-blue-100/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{t('quickReference')}</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {listicle.idioms.map((item, index) => {
              if (!item.idiom) return null;
              return (
                <Link
                  href={item.blogSlug ? `/${lang}/blog/${item.blogSlug}` : `/${lang}/blog`}
                  key={item.idiom.id}
                  className="group flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white hover:bg-white hover:shadow-lg hover:border-blue-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{item.idiom.characters}</span>
                    <span className="text-gray-300 mx-2">·</span>
                    <span className="text-gray-600 text-sm">{item.idiom.metaphoric_meaning}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <AdUnit type="multiplex" />

        {/* Related Listicles */}
        {allListicles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-gray-900">{t('moreIdiomLists')}</h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {allListicles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${lang}/blog/lists/${related.slug}`}
                  className="group block p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-red-100 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full mb-3">{related.category}</div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors line-clamp-2">{related.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{related.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-red-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t('viewList')}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mt-16 relative overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-orange-500 rounded-3xl p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2di00aC00djRoNHptMC02di00aC00djRoNHptLTYgNnYtNGgtNHY0aDR6bTAtNnYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
          <div className="relative">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">{t('learnDailyTitle')}</h2>
            <p className="text-red-100 mb-8 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
              {t('appPromoDesc')}
            </p>
            <a
              href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl shadow-red-900/20"
            >
              {t('downloadAppStore')}
            </a>
          </div>
        </section>
      </article>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} {t('footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBuiltBy')}
              </a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBlog')}
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/dictionary`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('dictionary')}
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/privacy`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerPrivacy')}
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
