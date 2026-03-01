import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { getAllPhrases, PHRASE_CATEGORIES } from '@/src/lib/phrases';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'Common Chinese Phrases — 80 Practical Expressions for Real Situations | Chinese Idioms',
  description: 'Learn 80 essential Chinese phrases for restaurants, shopping, travel, work, and daily life. Practical expressions with pinyin, meanings, and real-world usage.',
  keywords: ['chinese phrases', 'useful chinese phrases', 'chinese phrases for travel', 'how to order food in chinese', 'chinese bargaining phrases', 'mandarin phrases', 'practical chinese'],
  openGraph: {
    title: 'Common Chinese Phrases — 80 Practical Expressions for Real Situations',
    description: 'Learn 80 essential Chinese phrases for restaurants, shopping, travel, work, and daily life with pinyin and examples.',
    url: 'https://www.chineseidioms.com/phrases',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/phrases',
    languages: {
      'x-default': '/phrases',
      'en': '/phrases',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/phrases`])
      ),
    },
  },
};

export default function PhrasesIndexPage() {
  const allTerms = getAllPhrases();

  // Static structured data for SEO - not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Common Chinese Phrases",
      "description": "80 practical Chinese phrases for real situations — restaurants, shopping, travel, work, and daily life.",
      "url": "https://www.chineseidioms.com/phrases",
      "numberOfItems": allTerms.length,
      "hasPart": allTerms.map(term => ({
        "@type": "DefinedTerm",
        "name": term.characters,
        "description": term.meaning,
        "url": `https://www.chineseidioms.com/phrases/${term.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the most useful Chinese phrases for travel?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The most useful Chinese phrases for travel include 怎么走 (how do I get there?), 多少钱 (how much?), 太贵了 (too expensive), 买单 (check please), and 有Wi-Fi吗 (do you have Wi-Fi?). These cover navigation, shopping, dining, and basic communication needs."
          }
        },
        {
          "@type": "Question",
          "name": "How do you order food in Chinese?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Key phrases for ordering food in Chinese: 有什么推荐 (what do you recommend?), 不要辣 (no spice please), 再来一个 (one more please), 买单 (check please), and 打包 (to-go box). You can also say 这个怎么吃 (how do you eat this?) for unfamiliar dishes."
          }
        },
        {
          "@type": "Question",
          "name": "How do you bargain in Chinese?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Essential bargaining phrases: 太贵了 (too expensive!), 便宜点 (cheaper please), 最低多少 (what's your best price?), and 打折 (discount). Start by offering 50-60% of the asking price and negotiate from there. Bargaining is expected at markets but not in malls."
          }
        }
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
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full mb-4">
            <Globe className="w-4 h-4" />
            <span>Practical Phrases</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            Common Chinese Phrases
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            Skip the textbook basics. These {allTerms.length} Chinese phrases cover what you actually need — ordering food, bargaining at markets, getting around, and surviving daily life in China.
          </p>
        </header>

        <AdUnit type="display" />

        {/* Category Filter */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {PHRASE_CATEGORIES.map(category => {
              const count = allTerms.filter(t => t.category === category).length;
              return (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(/[&\s]+/g, '-')}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700 transition-all"
                >
                  {category} ({count})
                </a>
              );
            })}
          </div>
        </section>

        {/* Phrases by Category */}
        {PHRASE_CATEGORIES.map((category, catIdx) => {
          const categoryTerms = allTerms.filter(t => t.category === category);
          if (categoryTerms.length === 0) return null;

          return (
            <section key={category} id={category.toLowerCase().replace(/[&\s]+/g, '-')} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {categoryTerms.map(term => (
                  <Link
                    key={term.slug}
                    href={`/phrases/${term.slug}`}
                    className="group p-5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-teal-200 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-teal-600 transition-colors">
                          {term.characters}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{term.pinyin}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{term.meaning}</p>
                        <span className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${difficultyColor(term.difficulty)}`}>
                          {term.difficulty}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {catIdx > 0 && catIdx % 2 === 0 && <AdUnit type="in-article" />}
            </section>
          );
        })}

        <AdUnit type="multiplex" />

        {/* FAQ Section */}
        <section className="mt-16 bg-white rounded-2xl p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About Common Chinese Phrases</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What are the most useful Chinese phrases for travel?</h3>
              <p>The most useful travel phrases include 怎么走 (how do I get there?), 太贵了 (too expensive), 买单 (check please), and 有Wi-Fi吗 (do you have Wi-Fi?). These cover navigation, shopping, dining, and basic communication.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How are these different from textbook Chinese?</h3>
              <p>Textbooks teach you 你好 (hello) and 谢谢 (thank you) — which you already know. These phrases are what you actually hear and need in real situations: ordering food, bargaining, asking for directions, and navigating daily life in China.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do I need to know Chinese to use these phrases?</h3>
              <p>No! Each phrase includes pinyin pronunciation so you can say them even without reading Chinese characters. Start with beginner-level phrases and work your way up. Even basic attempts at Chinese are warmly appreciated.</p>
            </div>
          </div>
        </section>
      </main>

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
