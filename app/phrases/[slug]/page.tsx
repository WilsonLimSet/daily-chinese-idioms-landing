import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe, ChevronRight } from 'lucide-react';
import { getAllPhrases, getPhraseBySlug, getRelatedPhrases } from '@/src/lib/phrases';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return getAllPhrases().map(term => ({ slug: term.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const term = getPhraseBySlug(slug);

  if (!term) {
    return { title: 'Phrase Not Found' };
  }

  return {
    title: `${term.characters} (${term.pinyin}) — Meaning & Usage | Chinese Phrases`,
    description: `What does ${term.characters} mean? ${term.meaning} Learn when and how to use this common Chinese phrase with examples.`,
    keywords: [`${term.characters} meaning`, `${term.pinyin} meaning`, 'chinese phrases', `how to say ${term.meaning.toLowerCase()} in chinese`, term.category],
    openGraph: {
      title: `${term.characters} — ${term.meaning.substring(0, 60)}`,
      description: `What does ${term.characters} mean? ${term.meaning}`,
      url: `https://www.chineseidioms.com/phrases/${slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/phrases/${slug}`,
      languages: {
        'x-default': `/phrases/${slug}`,
        'en': `/phrases/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/phrases/${slug}`])
        ),
      },
    },
  };
}

export default async function PhraseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const term = getPhraseBySlug(slug);

  if (!term) {
    notFound();
  }

  const related = getRelatedPhrases(slug);

  // Static structured data for SEO - safe, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
      "name": term.characters,
      "description": term.meaning,
      "inDefinedTermSet": {
        "@type": "DefinedTermSet",
        "name": "Common Chinese Phrases",
        "url": "https://www.chineseidioms.com/phrases"
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
          "name": `When do you use ${term.characters}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": term.context
          }
        }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "Phrases", "item": "https://www.chineseidioms.com/phrases" },
        { "@type": "ListItem", "position": 3, "name": term.characters, "item": `https://www.chineseidioms.com/phrases/${slug}` }
      ]
    }
  ];

  const difficultyColor = (d: string) => {
    switch (d) {
      case 'beginner': return 'text-green-600 bg-green-50';
      case 'intermediate': return 'text-amber-600 bg-amber-50';
      case 'advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Static JSON-LD structured data for SEO, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/phrases" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to All Phrases
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full">
              <Globe className="w-4 h-4" />
              {term.category}
            </span>
            <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${difficultyColor(term.difficulty)}`}>
              {term.difficulty}
            </span>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full capitalize">
              {term.formality}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight">
            {term.characters}
          </h1>
          <p className="text-xl text-gray-500 mb-4">{term.pinyin}</p>
          <p className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
            {term.meaning}
          </p>
        </header>

        <AdUnit type="display" />

        {/* When to Use */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use</h2>
          <div className="bg-white rounded-xl p-6 border border-gray-100">
            <p className="text-gray-700 leading-relaxed">{term.context}</p>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples</h2>
          <div className="space-y-3">
            {term.examples.map((example, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                <p className="text-gray-800">{example}</p>
              </div>
            ))}
          </div>
        </section>

        <AdUnit type="in-article" />

        {/* Related Phrases */}
        {related.length > 0 && (
          <section className="mt-12 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Phrases</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map(rel => (
                <Link
                  key={rel.slug}
                  href={`/phrases/${rel.slug}`}
                  className="group p-5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <h3 className="font-bold text-gray-900 group-hover:text-teal-600 transition-colors">{rel.characters}</h3>
                  <p className="text-sm text-gray-500 mb-1">{rel.pinyin}</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{rel.meaning}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-teal-600">
                    Learn more <ChevronRight className="w-3 h-3" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdUnit type="multiplex" />
      </article>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">Built by Wilson</a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/dictionary" className="text-gray-600 hover:text-gray-900 transition-colors">Dictionary</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
