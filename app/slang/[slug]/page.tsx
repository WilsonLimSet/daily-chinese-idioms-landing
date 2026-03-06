import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getAllSlangTerms, getSlangBySlug, getRelatedSlang } from '@/src/lib/slang';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return getAllSlangTerms().map(term => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = getSlangBySlug(slug);

  if (!term) {
    return { title: 'Slang Not Found' };
  }

  return {
    title: `${term.characters} (${term.pinyin}) — Meaning & Origin | Chinese Internet Slang`,
    description: `What does ${term.characters} mean? ${term.meaning} Learn the origin, usage, and examples of this popular Chinese internet slang term.`,
    keywords: [`${term.characters} meaning`, `${term.pinyin} meaning`, 'chinese internet slang', `what does ${term.characters} mean`, term.category],
    openGraph: {
      title: `${term.characters} — ${term.meaning.substring(0, 60)}`,
      description: `What does ${term.characters} mean? ${term.meaning}`,
      url: `https://www.chineseidioms.com/slang/${slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/slang/${slug}`,
      languages: {
        'x-default': `/slang/${slug}`,
        'en': `/slang/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/slang/${slug}`])
        ),
      },
    },
  };
}

export default async function SlangDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getSlangBySlug(slug);

  if (!term) {
    notFound();
  }

  const related = getRelatedSlang(slug);

  // Static structured data - all values from hardcoded slang definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": term.characters,
      "description": term.meaning,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Chinese Internet Slang",
        "url": "https://www.chineseidioms.com/slang"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What does ${term.characters} mean in Chinese?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": term.meaning
          }
        },
        {
          "@type": "Question",
          "name": `Where does ${term.characters} come from?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": term.origin
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "Slang", "item": "https://www.chineseidioms.com/slang" },
        { "@type": "ListItem", "position": 3, "name": term.characters, "item": `https://www.chineseidioms.com/slang/${slug}` }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Static JSON-LD from hardcoded slang data, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Nav */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/slang" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Slang
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
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Origin</h2>
            <p className="text-neutral-600 leading-[1.8]">{term.origin}</p>
          </section>

          {/* Examples */}
          <section className="py-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Examples</h2>
            <div className="space-y-4">
              {term.examples.map((example, i) => (
                <div key={i} className="p-4 bg-neutral-50 rounded-lg">
                  <p className="text-neutral-700 leading-relaxed text-[15px]">{example}</p>
                </div>
              ))}
            </div>
          </section>

          <AdUnit type="in-article" className="my-8" />

          {/* Related */}
          {related.length > 0 && (
            <section className="py-10">
              <h2 className="text-sm font-semibold text-neutral-900 mb-4">Related terms</h2>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                {related.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/slang/${rel.slug}`}
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
