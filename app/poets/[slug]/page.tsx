import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getAllPoets, getPoetBySlug, getPoetPoems } from '@/src/lib/poets';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return getAllPoets().map(poet => ({ slug: poet.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const poet = getPoetBySlug(slug);

  if (!poet) {
    return { title: 'Poet Not Found' };
  }

  return {
    title: `${poet.nameChinese} (${poet.name}) — ${poet.title} | Biography, Poems & Famous Lines`,
    description: `${poet.name} (${poet.nameChinese}, ${poet.birthYear}–${poet.deathYear}) was a ${poet.dynasty} poet known as ${poet.title}. Read his biography, famous poems with translations, and most celebrated lines.`,
    keywords: [`${poet.name}`, `${poet.nameChinese}`, `${poet.name} poems`, `${poet.name} biography`, `${poet.dynasty} poet`, 'chinese poetry'],
    openGraph: {
      title: `${poet.nameChinese} (${poet.name}) — ${poet.title}`,
      description: `Biography, famous poems, and celebrated lines by ${poet.name}.`,
      url: `https://www.chineseidioms.com/poets/${slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/poets/${slug}`,
      languages: {
        'x-default': `/poets/${slug}`,
        'en': `/poets/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/poets/${slug}`])
        ),
      },
    },
  };
}

export default async function PoetDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poet = getPoetBySlug(slug);

  if (!poet) {
    notFound();
  }

  const poems = getPoetPoems(poet.name);
  const allPoets = getAllPoets();
  const otherPoets = allPoets.filter(p => p.slug !== slug).slice(0, 4);

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
      "url": `https://www.chineseidioms.com/poets/${slug}`,
      "knowsAbout": "Chinese Poetry",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `Who was ${poet.name} (${poet.nameChinese})?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": poet.bio,
          },
        },
        {
          "@type": "Question",
          "name": `What is ${poet.name} known for?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${poet.name} is known as ${poet.title}. ${poet.legacy.substring(0, 200)}`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "Poets", "item": "https://www.chineseidioms.com/poets" },
        { "@type": "ListItem", "position": 3, "name": poet.nameChinese, "item": `https://www.chineseidioms.com/poets/${slug}` },
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
          <Link href="/poets" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Poets
          </Link>
          <div className="text-xs text-neutral-400">
            {poet.dynasty} · {poet.birthYear}–{poet.deathYear}
          </div>
        </div>
      </nav>

      <article className="flex-1">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <header className="pt-20 pb-12 border-b border-neutral-200">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              {poet.nameChinese}
            </h1>
            <p className="text-xl text-neutral-600 mt-2">{poet.name}</p>
            <p className="text-neutral-400 mt-1 text-sm">{poet.courtesyChinese}</p>
            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-amber-800 font-medium text-sm">{poet.title}</span>
            </div>
            <p className="text-neutral-500 mt-4">
              {poet.dynasty} ({poet.dynastyChinese}) · {poet.birthYear}–{poet.deathYear}
            </p>
          </header>

          <AdUnit type="display" className="my-8" />

          {/* Biography */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Biography</h2>
            <p className="text-neutral-600 leading-[1.8]">{poet.bio}</p>
          </section>

          {/* Poetic Style */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Poetic Style</h2>
            <p className="text-neutral-600 leading-[1.8]">{poet.style}</p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {/* Famous Lines */}
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

          {/* Legacy */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Legacy & Influence</h2>
            <p className="text-neutral-600 leading-[1.8]">{poet.legacy}</p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {/* Poems in collection */}
          {poems.length > 0 && (
            <section className="py-10 border-b border-neutral-200">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">Poems by {poet.name} in Our Collection</h2>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {poems.map(poem => (
                  <Link
                    key={poem.slug}
                    href={`/poems/${poem.slug}`}
                    className="group flex items-center gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75"
                  >
                    <div className="shrink-0 w-24">
                      <p className="font-bold text-neutral-900 text-lg group-hover:text-neutral-600 transition-colors duration-75">
                        {poem.titleChinese}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-neutral-700">{poem.title}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{poem.theme} · {poem.form}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors duration-75" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Other poets */}
          <section className="py-10">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">More poets to explore</h2>
            <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
              {otherPoets.map(p => (
                <Link
                  key={p.slug}
                  href={`/poets/${p.slug}`}
                  className="group flex items-center gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75"
                >
                  <div className="shrink-0 w-16">
                    <p className="font-bold text-neutral-900 text-lg group-hover:text-neutral-600 transition-colors duration-75">
                      {p.nameChinese}
                    </p>
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
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Built by Wilson</a>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/poems" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Poems</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/blog" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Blog</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/dictionary" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Dictionary</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/privacy" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
