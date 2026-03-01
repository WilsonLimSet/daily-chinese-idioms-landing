import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { getAllSlangTerms, SLANG_CATEGORIES } from '@/src/lib/slang';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'Chinese Internet Slang — 50 Popular Terms Decoded | Chinese Idioms',
  description: 'Decode trending Chinese internet slang, social media expressions, and youth culture phrases. From YYDS to 内卷, learn what they mean with origins and examples.',
  keywords: ['chinese internet slang', 'chinese slang', 'chinese social media slang', 'YYDS meaning', '内卷 meaning', '躺平 meaning', 'chinese memes', 'mandarin slang'],
  openGraph: {
    title: 'Chinese Internet Slang — 50 Popular Terms Decoded',
    description: 'Decode trending Chinese internet slang, social media expressions, and youth culture phrases with meanings, origins, and examples.',
    url: 'https://www.chineseidioms.com/slang',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/slang',
    languages: {
      'x-default': '/slang',
      'en': '/slang',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/slang`])
      ),
    },
  },
};

export default function SlangIndexPage() {
  const allTerms = getAllSlangTerms();

  // Static structured data for SEO - not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Chinese Internet Slang",
      "description": "50 popular Chinese internet slang terms decoded with meanings, origins, and examples.",
      "url": "https://www.chineseidioms.com/slang",
      "numberOfItems": allTerms.length,
      "hasPart": allTerms.map(term => ({
        "@type": "DefinedTerm",
        "name": term.characters,
        "description": term.meaning,
        "url": `https://www.chineseidioms.com/slang/${term.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is Chinese internet slang?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Chinese internet slang (网络用语) refers to informal expressions, abbreviations, and phrases that originate from Chinese social media platforms like Weibo, Douyin, and WeChat. These terms often reflect current social trends, youth culture, and viral memes."
          }
        },
        {
          "@type": "Question",
          "name": "What does YYDS mean in Chinese?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "YYDS (永远的神, yǒng yuǎn de shén) means 'Greatest of All Time' or 'GOAT' in Chinese internet slang. It's used to praise someone or something as the absolute best. The term originated from gaming culture in 2020."
          }
        },
        {
          "@type": "Question",
          "name": "What does 内卷 (nei juan) mean?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "内卷 (nèi juǎn, involution) describes excessive, often pointless competition where everyone works harder but nobody gains more. It went viral in 2020 to describe the intense rat-race culture in Chinese workplaces and education."
          }
        }
      ]
    }
  ];

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
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full mb-4">
            <MessageCircle className="w-4 h-4" />
            <span>Internet Slang</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            Chinese Internet Slang
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            From YYDS to 内卷, Chinese internet slang evolves rapidly. This guide covers {allTerms.length} of the most popular and widely-used Chinese internet slang terms, memes, and social media expressions.
          </p>
        </header>

        <AdUnit type="display" />

        {/* Category Filter */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Browse by Category</h2>
          <div className="flex flex-wrap gap-2">
            {SLANG_CATEGORIES.map(category => {
              const count = allTerms.filter(t => t.category === category).length;
              return (
                <a
                  key={category}
                  href={`#${category.toLowerCase().replace(/[&\s]+/g, '-')}`}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-all"
                >
                  {category} ({count})
                </a>
              );
            })}
          </div>
        </section>

        {/* Slang by Category */}
        {SLANG_CATEGORIES.map((category, catIdx) => {
          const categoryTerms = allTerms.filter(t => t.category === category);
          if (categoryTerms.length === 0) return null;

          return (
            <section key={category} id={category.toLowerCase().replace(/[&\s]+/g, '-')} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {categoryTerms.map(term => (
                  <Link
                    key={term.slug}
                    href={`/slang/${term.slug}`}
                    className="group p-5 bg-white rounded-xl border border-gray-100 hover:shadow-lg hover:border-purple-200 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-purple-600 transition-colors">
                          {term.characters}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">{term.pinyin}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{term.meaning}</p>
                        <span className="inline-block mt-2 text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                          {term.era}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">About Chinese Internet Slang</h2>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What is Chinese internet slang (网络用语)?</h3>
              <p>Chinese internet slang refers to informal expressions, abbreviations, and phrases that originate from Chinese social media platforms like Weibo, Douyin (TikTok), and WeChat. These terms often reflect current social trends, youth culture, and viral memes.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How is internet slang different from traditional Chinese idioms?</h3>
              <p>Traditional Chinese idioms (成语) are four-character expressions with thousands of years of history, rooted in classical literature. Internet slang is modern, informal, and constantly evolving — some terms go viral and fade within months.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Should I learn Chinese internet slang?</h3>
              <p>Understanding internet slang is valuable for comprehending modern Chinese media, chatting with native speakers online, and following social media trends. However, these terms are very informal and should not be used in formal or professional settings.</p>
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
