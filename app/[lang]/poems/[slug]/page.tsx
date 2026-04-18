import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getAllPoems, loadTranslatedPoems, getTranslatedPoemBySlug } from '@/src/lib/poems';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const params = [];
  const allPoems = getAllPoems();
  for (const lang of Object.keys(LANGUAGES)) {
    for (const poem of allPoems) {
      params.push({ lang, slug: poem.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const poem = getTranslatedPoemBySlug(slug, lang);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  if (!poem) {
    return { title: 'Poem Not Found' };
  }

  return {
    title: `${poem.titleChinese} (${poem.titlePinyin}) — ${poem.title} | ${langName}`,
    description: `${poem.titleChinese} by ${poem.poet.name}: ${poem.translation.substring(0, 150)}`,
    keywords: [`${poem.titleChinese}`, `${poem.title}`, `${poem.poet.name}`, 'chinese poetry', langName.toLowerCase()],
    openGraph: {
      title: `${poem.titleChinese} — ${poem.title} by ${poem.poet.name}`,
      description: poem.translation.substring(0, 150),
      url: `https://www.chineseidioms.com/${lang}/poems/${slug}`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/poems/${slug}`,
      languages: {
        'x-default': `/poems/${slug}`,
        'en': `/poems/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/poems/${slug}`])
        ),
      },
    },
  };
}

export default async function TranslatedPoemDetailPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const poem = getTranslatedPoemBySlug(slug, lang);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';

  if (!poem) {
    notFound();
  }

  const translatedPoems = loadTranslatedPoems(lang);
  const related = translatedPoems
    .filter(p => (p.originalSlug || p.slug) !== slug)
    .filter(p => p.poet.name === poem.poet.name || p.theme === poem.theme)
    .slice(0, 4);

  // Static structured data from hardcoded poem definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${poem.titleChinese} — ${poem.title}`,
      "author": { "@type": "Person", "name": poem.poet.name },
      "description": poem.translation,
      "url": `https://www.chineseidioms.com/${lang}/poems/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": getTranslation(lang, 'home'), "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": getTranslation(lang, 'poemsTitle'), "item": `https://www.chineseidioms.com/${lang}/poems` },
        { "@type": "ListItem", "position": 3, "name": poem.titleChinese, "item": `https://www.chineseidioms.com/${lang}/poems/${slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Static JSON-LD from hardcoded poem data, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}/poems`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            {getTranslation(lang, 'allPoems')}
          </Link>
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span>{poem.poet.dynasty}</span>
            <span className="text-neutral-200">·</span>
            <span>{poem.theme}</span>
          </div>
        </div>
      </nav>

      <article className="flex-1">
        <div className="max-w-3xl mx-auto px-6">
          <header className="pt-20 pb-12 border-b border-neutral-200">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              {poem.titleChinese}
            </h1>
            <p className="text-neutral-400 mt-2">{poem.titlePinyin}</p>
            <p className="text-xl text-neutral-700 mt-2 font-medium">{poem.title}</p>
            <p className="text-neutral-500 mt-4">
              {poem.poet.nameChinese} ({poem.poet.name}) · {poem.poet.dynasty}
              {poem.poet.birthYear && poem.poet.deathYear && (
                <span className="text-neutral-400"> · {poem.poet.birthYear}–{poem.poet.deathYear}</span>
              )}
            </p>
          </header>

          <AdUnit type="display" className="my-8" />

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-6">{getTranslation(lang, 'poemOriginalText')}</h2>
            <div className="space-y-4">
              {poem.lines.map((line, i) => (
                <div key={i} className="flex flex-col">
                  <p className="text-2xl sm:text-3xl font-bold text-neutral-900 leading-relaxed tracking-wide">
                    {line.chinese}
                  </p>
                  <p className="text-sm text-neutral-400 mt-1">{line.pinyin}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'poemTranslationLabel')} ({langName})</h2>
            <p className="text-neutral-700 leading-[1.9] text-lg italic">
              {poem.translation}
            </p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'poemBackground')}</h2>
            <p className="text-neutral-600 leading-[1.8]">{poem.background}</p>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'poemAnalysis')}</h2>
            <p className="text-neutral-600 leading-[1.8]">{poem.analysis}</p>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">{getTranslation(lang, 'poemForm')}</p>
                <p className="text-sm text-neutral-700">{poem.form}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">{getTranslation(lang, 'poemTheme')}</p>
                <p className="text-sm text-neutral-700">{poem.theme}</p>
              </div>
            </div>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'poemAboutPoet')} {poem.poet.name} ({poem.poet.nameChinese})</h2>
            <p className="text-neutral-600 leading-[1.8]">{poem.poet.bio}</p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {related.length > 0 && (
            <section className="py-10">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">{getTranslation(lang, 'poemMoreToExplore')}</h2>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {related.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/${lang}/poems/${rel.originalSlug || rel.slug}`}
                    className="group flex items-center gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75"
                  >
                    <div className="shrink-0 w-20">
                      <p className="font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors duration-75">
                        {rel.titleChinese}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700">{rel.title}</p>
                      <p className="text-xs text-neutral-400">{rel.poet.nameChinese} {rel.poet.name}</p>
                    </div>
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
              <Link href={`/${lang}/dictionary`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'dictionaryTitle')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/privacy`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerPrivacy')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
