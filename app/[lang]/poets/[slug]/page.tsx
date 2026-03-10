import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getAllPoets, getPoetPoems, getTranslatedPoetBySlug, loadTranslatedPoets } from '@/src/lib/poets';

import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const params = [];
  const poets = getAllPoets();
  for (const lang of Object.keys(LANGUAGES)) {
    for (const poet of poets) {
      params.push({ lang, slug: poet.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const poet = getTranslatedPoetBySlug(slug, lang);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  if (!poet) return { title: 'Poet Not Found' };

  return {
    title: `${poet.nameChinese} (${poet.name}) — ${poet.title} | ${langName}`,
    description: `${poet.name} (${poet.nameChinese}): ${poet.bio.substring(0, 150)}`,
    keywords: [poet.name, poet.nameChinese, 'chinese poetry', langName.toLowerCase()],
    openGraph: {
      title: `${poet.nameChinese} (${poet.name}) — ${poet.title}`,
      url: `https://www.chineseidioms.com/${lang}/poets/${slug}`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/poets/${slug}`,
      languages: {
        'x-default': `/poets/${slug}`,
        'en': `/poets/${slug}`,
        ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/poets/${slug}`])),
      },
    },
  };
}

export default async function TranslatedPoetDetailPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const poet = getTranslatedPoetBySlug(slug, lang);
  if (!poet) notFound();

  const poems = getPoetPoems(poet.name);
  const allPoets = loadTranslatedPoets(lang);
  const otherPoets = allPoets.filter(p => (p.originalSlug || p.slug) !== slug).slice(0, 4);

  // Static structured data from hardcoded poet definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": poet.name,
      "alternateName": poet.nameChinese,
      "birthDate": poet.birthYear,
      "deathDate": poet.deathYear,
      "description": poet.bio,
      "url": `https://www.chineseidioms.com/${lang}/poets/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": "Poets", "item": `https://www.chineseidioms.com/${lang}/poets` },
        { "@type": "ListItem", "position": 3, "name": poet.nameChinese, "item": `https://www.chineseidioms.com/${lang}/poets/${slug}` },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Static JSON-LD from hardcoded poet data, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}/poets`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Poets
          </Link>
          <div className="text-xs text-neutral-400">{poet.dynasty} · {poet.birthYear}–{poet.deathYear}</div>
        </div>
      </nav>

      <article className="flex-1">
        <div className="max-w-3xl mx-auto px-6">
          <header className="pt-20 pb-12 border-b border-neutral-200">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1]">{poet.nameChinese}</h1>
            <p className="text-xl text-neutral-600 mt-2">{poet.name}</p>
            <p className="text-neutral-400 mt-1 text-sm">{poet.courtesyChinese}</p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-amber-800 font-medium text-sm">{poet.title}</span>
            </div>
            <p className="text-neutral-500 mt-4">{poet.dynasty} ({poet.dynastyChinese}) · {poet.birthYear}–{poet.deathYear}</p>
          </header>

          <AdUnit type="display" className="my-8" />

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Biography</h2>
            <p className="text-neutral-600 leading-[1.8]">{poet.bio}</p>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Poetic Style</h2>
            <p className="text-neutral-600 leading-[1.8]">{poet.style}</p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Most Famous Lines</h2>
            <div className="space-y-4">
              {poet.famousLines.map((line, i) => (
                <div key={i} className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-lg font-bold text-neutral-900">{line.chinese}</p>
                  <p className="text-xs text-neutral-400 mt-1">{line.pinyin}</p>
                  <p className="text-neutral-600 italic mt-2">{line.english}</p>
                  <p className="text-xs text-neutral-400 mt-2">— {line.from}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Legacy & Influence</h2>
            <p className="text-neutral-600 leading-[1.8]">{poet.legacy}</p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {poems.length > 0 && (
            <section className="py-10 border-b border-neutral-200">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">Poems by {poet.name}</h2>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {poems.map(poem => (
                  <Link key={poem.slug} href={`/${lang}/poems/${poem.slug}`} className="group flex items-center gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75">
                    <div className="shrink-0 w-24">
                      <p className="font-bold text-neutral-900 text-lg group-hover:text-neutral-600 transition-colors duration-75">{poem.titleChinese}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700">{poem.title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{poem.theme}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors duration-75" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="py-10">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">More poets</h2>
            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
              {otherPoets.map(p => (
                <Link key={p.slug} href={`/${lang}/poets/${p.originalSlug || p.slug}`} className="group flex items-center gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75">
                  <div className="shrink-0 w-16">
                    <p className="font-bold text-neutral-900 text-lg group-hover:text-neutral-600 transition-colors duration-75">{p.nameChinese}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-neutral-700">{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.title}</p>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors duration-75" />
                </Link>
              ))}
            </div>
          </section>

          <AdUnit type="multiplex" className="mb-8" />
        </div>
      </article>

      <footer className="border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-neutral-300">&bull;</span>
            <Link href={`/${lang}/poems`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Poems</Link>
            <span className="hidden sm:inline text-neutral-300">&bull;</span>
            <Link href={`/${lang}/blog`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Blog</Link>
            <span className="hidden sm:inline text-neutral-300">&bull;</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
