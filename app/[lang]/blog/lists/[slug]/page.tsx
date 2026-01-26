import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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

export async function generateStaticParams() {
  const params = [];

  for (const lang of Object.keys(LANGUAGES)) {
    const listicles = getAllListiclesTranslated(lang);
    for (const listicle of listicles) {
      // Use the localized slug for the URL
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

      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/blog/lists`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {t('backToAll') || 'Back to Lists'}
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
            <BookOpen className="w-4 h-4" />
            <span>{listicle.category}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {listicle.title}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            {listicle.description}
          </p>
        </header>

        {/* Introduction */}
        <div className="prose prose-lg max-w-none mb-12">
          <p className="text-gray-700 leading-relaxed">
            {listicle.intro}
          </p>
        </div>

        {/* Idiom List */}
        <div className="space-y-8">
          {listicle.idioms.map((item, index) => {
            if (!item.idiom) return null;

            return (
              <div
                key={item.idiom.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="text-red-600 font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-baseline gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {item.idiom.characters}
                      </h2>
                      <span className="text-gray-500 text-lg">
                        {item.idiom.pinyin}
                      </span>
                    </div>

                    <p className="text-lg font-medium text-blue-600 mb-3">
                      {item.idiom.metaphoric_meaning}
                    </p>

                    <p className="text-gray-600 mb-3">
                      <strong>{t('literalMeaning') || 'Literal meaning'}:</strong> {item.idiom.meaning}
                    </p>

                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {item.idiom.description.substring(0, 300)}
                      {item.idiom.description.length > 300 ? '...' : ''}
                    </p>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>{t('example') || 'Example'}:</strong>
                      </p>
                      <p className="text-gray-800">{item.idiom.example}</p>
                      <p className="text-gray-600 text-sm mt-1">{item.idiom.chineseExample}</p>
                    </div>

                    {item.blogSlug && (
                      <Link
                        href={`/${lang}/blog/${item.blogSlug}`}
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {t('learnMoreArrow') || `Learn more about ${item.idiom.characters}`}
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Section */}
        <section className="mt-12 bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Reference</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {listicle.idioms.map((item) => {
              if (!item.idiom) return null;
              return (
                <div key={item.idiom.id} className="flex items-center gap-3 bg-white rounded-lg p-3">
                  <span className="font-bold text-gray-900">{item.idiom.characters}</span>
                  <span className="text-gray-500">-</span>
                  <span className="text-gray-600 text-sm">{item.idiom.metaphoric_meaning}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Related Listicles */}
        {allListicles.length > 0 && (
          <section className="mt-12 pt-8 border-t">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">More Chinese Idiom Lists</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {allListicles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/${lang}/blog/lists/${related.slug}`}
                  className="block p-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
                >
                  <div className="text-xs text-blue-600 mb-1">{related.category}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{related.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{related.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('learnDailyTitle') || 'Learn Chinese Idioms Daily'}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get a new Chinese idiom delivered to your home screen every day with our free iOS app.
            Features pinyin pronunciation, meanings, and cultural context.
          </p>
          <a
            href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            {t('downloadAppStore') || 'Download Free App'}
          </a>
        </section>
      </article>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} {t('footerCopyright') || 'Daily Chinese Idioms'}</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBuiltBy') || 'Built by Wilson'}
              </a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerBlog') || 'Blog'}
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/dictionary`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dictionary
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href={`/${lang}/privacy`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {t('footerPrivacy') || 'Privacy Policy'}
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
