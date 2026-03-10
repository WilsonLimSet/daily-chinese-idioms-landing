import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getAllPoems, getPoemBySlug, getRelatedPoems, getPoemsByPoet } from '@/src/lib/poems';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return getAllPoems().map(poem => ({ slug: poem.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const poem = getPoemBySlug(slug);

  if (!poem) {
    return { title: 'Poem Not Found' };
  }

  return {
    title: `${poem.titleChinese} (${poem.titlePinyin}) — ${poem.title} by ${poem.poet.name} | Chinese Poetry`,
    description: `Read "${poem.titleChinese}" (${poem.title}) by ${poem.poet.name} (${poem.poet.nameChinese}). Original Chinese with pinyin, English translation, historical background, and literary analysis.`,
    keywords: [`${poem.titleChinese}`, `${poem.title}`, `${poem.poet.name} poems`, `${poem.poet.nameChinese}`, 'chinese poetry translation', poem.theme],
    openGraph: {
      title: `${poem.titleChinese} — ${poem.title} by ${poem.poet.name}`,
      description: `${poem.translation.substring(0, 150)}...`,
      url: `https://www.chineseidioms.com/poems/${slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/poems/${slug}`,
      languages: {
        'x-default': `/poems/${slug}`,
        'en': `/poems/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/poems/${slug}`])
        ),
      },
    },
  };
}

export default async function PoemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const poem = getPoemBySlug(slug);

  if (!poem) {
    notFound();
  }

  const related = getRelatedPoems(slug);
  const poetPoemCount = getPoemsByPoet(poem.poet.name).length;

  // Static structured data from hardcoded poem definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": `${poem.titleChinese} — ${poem.title}`,
      "author": { "@type": "Person", "name": poem.poet.name },
      "description": poem.translation,
      "url": `https://www.chineseidioms.com/poems/${slug}`,
      "publisher": {
        "@type": "Organization",
        "name": "Chinese Idioms",
        "url": "https://www.chineseidioms.com"
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What does ${poem.titleChinese} (${poem.title}) mean?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": poem.translation,
          },
        },
        {
          "@type": "Question",
          "name": `Who wrote ${poem.titleChinese}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `${poem.titleChinese} was written by ${poem.poet.name} (${poem.poet.nameChinese}) during the ${poem.poet.dynasty}.`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "Poems", "item": "https://www.chineseidioms.com/poems" },
        { "@type": "ListItem", "position": 3, "name": poem.titleChinese, "item": `https://www.chineseidioms.com/poems/${slug}` },
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

      {/* Nav */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/poems" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Poems
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
          {/* Header */}
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

          {/* Original poem with pinyin */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-6">Original Text</h2>
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

          {/* English translation */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">English Translation</h2>
            <p className="text-neutral-700 leading-[1.9] text-lg italic">
              {poem.translation}
            </p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {/* Historical Background */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Historical Background</h2>
            <p className="text-neutral-600 leading-[1.8]">{poem.background}</p>
          </section>

          {/* Literary Analysis */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Literary Analysis</h2>
            <p className="text-neutral-600 leading-[1.8]">{poem.analysis}</p>
          </section>

          {/* Poem details */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">Form</p>
                <p className="text-sm text-neutral-700">{poem.form}</p>
              </div>
              <div className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-xs text-neutral-400 mb-1">Theme</p>
                <p className="text-sm text-neutral-700">{poem.theme}</p>
              </div>
            </div>
          </section>

          {/* About the poet */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">About {poem.poet.name} ({poem.poet.nameChinese})</h2>
            <p className="text-neutral-600 leading-[1.8]">{poem.poet.bio}</p>
            {poetPoemCount > 1 && (
              <p className="text-sm text-neutral-400 mt-4">
                {poetPoemCount} poems by {poem.poet.name} in our collection
              </p>
            )}
          </section>

          {/* Traditional Chinese */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Traditional Chinese</h2>
            <p className="text-neutral-600 text-lg leading-[2]">{poem.traditionalChinese}</p>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {/* Related poems */}
          {related.length > 0 && (
            <section className="py-10">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">More poems to explore</h2>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {related.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/poems/${rel.slug}`}
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
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Built by Wilson</a>
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
