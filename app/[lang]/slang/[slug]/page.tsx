import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getAllSlangTerms, loadTranslatedSlang, getTranslatedSlangBySlug } from '@/src/lib/slang';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const params = [];
  const terms = getAllSlangTerms();
  for (const lang of Object.keys(LANGUAGES)) {
    for (const term of terms) {
      params.push({ lang, slug: term.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const term = getTranslatedSlangBySlug(slug, lang);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  if (!term) {
    return { title: 'Slang Not Found' };
  }

  // Avoid redundant pinyin when it matches characters (e.g., PUA)
  const pinyinSuffix = term.pinyin !== term.characters ? ` (${term.pinyin})` : '';
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;

  // Use custom meta from English source if available
  const customTitle = term.metaTitle;
  const title = customTitle
    ? `${customTitle.replace(/\| Chinese.*$/, '')}| ${nativeName}`
    : `${term.characters}${pinyinSuffix} — ${term.meaning.substring(0, 50)} | ${nativeName}`;
  const description = `${term.characters}: ${term.meaning.substring(0, 120)}. ${term.origin.substring(0, 100)}`;

  return {
    title,
    description,
    keywords: [`${term.characters} meaning`, `${term.pinyin} meaning`, 'chinese slang', `${term.characters} chinese`, term.category, langName.toLowerCase()],
    openGraph: {
      title: customTitle || `${term.characters}${pinyinSuffix} — ${term.meaning.substring(0, 60)}`,
      description: `${term.characters}: ${term.meaning.substring(0, 120)}`,
      url: `https://www.chineseidioms.com/${lang}/slang/${slug}`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/slang/${slug}`,
      languages: {
        'x-default': `/slang/${slug}`,
        'en': `/slang/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/slang/${slug}`])
        ),
      },
    },
  };
}

export default async function TranslatedSlangDetailPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const term = getTranslatedSlangBySlug(slug, lang);

  if (!term) {
    notFound();
  }

  const allTerms = loadTranslatedSlang(lang);
  const related = allTerms
    .filter(t => t.slug !== slug && t.category === term.category)
    .slice(0, 4);

  // All structured data values sourced from hardcoded slang definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": term.characters,
      "description": term.meaning,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": getTranslation(lang, 'slangCollectionName'),
        "url": `https://www.chineseidioms.com/${lang}/slang`
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": getTranslation(lang, 'slangFaqQ2Template').replace('{term}', term.characters),
          "acceptedAnswer": { "@type": "Answer", "text": term.meaning }
        },
        {
          "@type": "Question",
          "name": getTranslation(lang, 'slangFaqOriginTemplate').replace('{term}', term.characters),
          "acceptedAnswer": { "@type": "Answer", "text": term.origin }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": getTranslation(lang, 'home'), "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": getTranslation(lang, 'slangTitle'), "item": `https://www.chineseidioms.com/${lang}/slang` },
        { "@type": "ListItem", "position": 3, "name": term.characters, "item": `https://www.chineseidioms.com/${lang}/slang/${slug}` }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Structured data sourced from hardcoded slang definitions, safe to embed */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Nav */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}/slang`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            {getTranslation(lang, 'slangBackToIndex')}
          </Link>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{term.category}</span>
            <span className="text-neutral-200">·</span>
            <span>{term.era}</span>
            <span className="text-neutral-200">·</span>
            <span className="capitalize">{term.formality}</span>
          </div>
        </div>
      </nav>

      <article className="flex-1">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <header className="pt-20 pb-12 border-b border-neutral-200">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              {term.characters}
            </h1>
            <p className="text-neutral-400 mt-2">{term.pinyin}</p>
            <p className="text-xl text-neutral-900 leading-relaxed mt-8 font-medium max-w-xl">
              {term.meaning}
            </p>
          </header>

          <AdUnit type="display" className="my-8" />

          {/* Origin */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'slangOrigin')}</h2>
            <p className="text-neutral-600 leading-[1.8]">{term.origin}</p>
          </section>

          {/* Examples */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'slangExamples')}</h2>
            <div className="space-y-4">
              {term.examples.map((example, i) => (
                <div key={i} className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-700 leading-relaxed text-[15px]">{example}</p>
                </div>
              ))}
            </div>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {/* Read in other languages */}
          <section className="py-8 border-b border-neutral-200">
            <p className="text-sm text-neutral-500">
              {getTranslation(lang, 'readOtherLanguages')}{' '}
              {Object.entries(LANGUAGES)
                .filter(([l]) => l !== lang)
                .map(([l, name], i, arr) => (
                  <span key={l}>
                    <Link href={`/${l}/slang/${slug}`} className="text-neutral-600 hover:text-neutral-900 underline underline-offset-2 decoration-neutral-300">{name}</Link>
                    {i < arr.length - 1 ? ', ' : ''}
                  </span>
                ))}
            </p>
          </section>

          {/* Related */}
          {related.length > 0 && (
            <section className="py-10">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'slangRelated')}</h2>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {related.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/${lang}/slang/${rel.slug}`}
                    className="group flex items-center gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75"
                  >
                    <div className="shrink-0 w-28">
                      <p className="font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors duration-75 truncate">
                        {rel.characters}
                      </p>
                      <p className="text-xs text-neutral-400">{rel.pinyin}</p>
                    </div>
                    <p className="flex-1 text-sm text-neutral-500 line-clamp-1 min-w-0">{rel.meaning}</p>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors duration-75" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <AdUnit type="multiplex" className="mb-8" />
        </div>
      </article>

      <footer className="border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerBuiltBy')}</a>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerBlog')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
