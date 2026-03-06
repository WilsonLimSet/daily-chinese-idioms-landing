import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllSlangTerms, SLANG_CATEGORIES, getSlangEras } from '@/src/lib/slang';
import SlangEraFilter from '@/app/components/SlangEraFilter';
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

  // Static structured data - all values from hardcoded slang definitions, not user input
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

  // Pick 3 featured terms for the hero
  const featured = allTerms.filter(t => ['nei-juan', 'tang-ping', 'yyds'].includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Static JSON-LD from hardcoded slang data, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Nav */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-16">
          <p className="text-sm font-medium text-neutral-400 mb-4">网络用语 · {allTerms.length} terms</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1] max-w-2xl">
            Chinese Internet Slang, Decoded
          </h1>
          <p className="text-neutral-500 text-lg leading-relaxed mt-5 max-w-xl">
            The words that define how China talks online — from workplace frustration to viral memes to relationship drama.
          </p>

          {/* Featured terms */}
          <div className="mt-12 grid sm:grid-cols-3 gap-4">
            {featured.map(term => (
              <Link
                key={term.slug}
                href={`/slang/${term.slug}`}
                className="group p-5 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-150"
              >
                <p className="text-2xl font-bold text-neutral-900 group-hover:text-neutral-700 transition-colors duration-75">
                  {term.characters}
                </p>
                <p className="text-xs text-neutral-400 mt-1">{term.pinyin}</p>
                <p className="text-sm text-neutral-500 mt-3 leading-relaxed line-clamp-2">{term.meaning}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filter + Content */}
      <SlangEraFilter
        terms={allTerms.map(t => ({ slug: t.slug, characters: t.characters, pinyin: t.pinyin, meaning: t.meaning, category: t.category, era: t.era }))}
        eras={getSlangEras()}
        categories={[...SLANG_CATEGORIES]}
      />

      {/* Content bottom */}
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6 pb-16 space-y-16">
          <AdUnit type="display" />

          {/* FAQ */}
          <section className="pt-12 border-t border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-8">Frequently asked questions</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div>
                <h3 className="font-medium text-neutral-900 mb-2 text-sm">What is Chinese internet slang?</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Informal expressions from Weibo, Douyin, Bilibili, and WeChat that reflect
                  social trends, youth culture, and viral moments.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-2 text-sm">How is it different from chengyu?</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Chengyu are four-character idioms with thousands of years of history.
                  Internet slang is modern, informal, and evolves fast — some terms die in months.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-2 text-sm">Should I learn this?</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Yes, for understanding modern Chinese media and chatting with native speakers online.
                  But don&apos;t use these in formal or professional settings.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-neutral-900 mb-2 text-sm">Where does it come from?</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Gaming culture, workplace frustration, and viral moments.
                  Most terms originate from Douyin, Weibo, or Bilibili.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

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
