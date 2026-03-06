import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllFestivals } from '@/src/lib/festivals';
import { getAllListicles } from '@/src/lib/listicles';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'Chinese Festivals & Holidays — Cultural Guide with Idioms | Chinese Idioms',
  description: 'Complete guide to Chinese festivals and holidays: Spring Festival, Qingming, Dragon Boat, Mid-Autumn, and more. Learn traditions, cultural significance, and the Chinese idioms behind each celebration.',
  keywords: [
    'chinese festivals',
    'chinese holidays',
    'chinese festival calendar',
    'chinese cultural celebrations',
    'spring festival',
    'chinese new year',
    'qingming festival',
    'dragon boat festival',
    'mid-autumn festival',
    'chinese traditions',
    'chinese holiday idioms',
  ],
  openGraph: {
    title: 'Chinese Festivals & Holidays — Cultural Guide with Idioms',
    description: 'Explore Chinese festivals through their traditions, stories, and the idioms that bring them to life. From Spring Festival to Winter Solstice.',
    url: 'https://www.chineseidioms.com/festivals',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/festivals',
    languages: {
      'x-default': '/festivals',
      'en': '/festivals',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/festivals`])
      ),
    },
  },
};

export default function FestivalsPage() {
  const festivals = getAllFestivals();
  const allListicles = getAllListicles();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Chinese Festivals & Holidays",
    "description": "Complete guide to Chinese festivals, traditions, and the idioms behind each celebration.",
    "url": "https://www.chineseidioms.com/festivals",
    "inLanguage": "en",
    "isPartOf": {
      "@type": "WebSite",
      "name": "Chinese Idioms",
      "url": "https://www.chineseidioms.com"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "Festivals", "item": "https://www.chineseidioms.com/festivals" },
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": festivals.map((f, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": `${f.englishName} (${f.chineseName})`,
        "description": f.significance.slice(0, 200),
      })),
    },
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the most important Chinese festivals?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The most important Chinese festivals are Spring Festival (Chinese New Year), Mid-Autumn Festival, Dragon Boat Festival, Qingming Festival, and Lantern Festival.",
        },
      },
      {
        "@type": "Question",
        "name": "How are Chinese festival dates determined?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most Chinese festivals follow the traditional lunisolar calendar, so their dates shift each year on the Western calendar. Exceptions include Qingming Festival (around April 4-5) and Winter Solstice (December 21-22).",
        },
      },
      {
        "@type": "Question",
        "name": "What is the connection between Chinese festivals and idioms?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chinese idioms (chengyu) are deeply woven into festival traditions. Many originated from festival legends — idioms about loyalty connect to Qu Yuan and Dragon Boat Festival, while idioms about family reunion are central to Mid-Autumn and Spring Festival greetings.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Hero */}
      <section className="bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.15),transparent_60%)]" />
        <nav className="relative max-w-5xl mx-auto px-6 pt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </nav>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-16">
          <p className="text-xs font-medium text-white/40 tracking-[0.25em] uppercase mb-6">Cultural Guide</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            Chinese Festivals
            <br />
            <span className="text-red-400">&amp; Holidays</span>
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mt-6 max-w-xl">
            The traditions, stories, and idioms behind China&apos;s most celebrated holidays.
          </p>

          {/* Quick Nav */}
          <div className="mt-12 flex flex-wrap gap-3">
            {festivals.map((festival) => (
              <a
                key={festival.slug}
                href={`#${festival.slug}`}
                className="group flex items-center gap-3 px-4 py-2.5 rounded-lg bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/[0.15] transition-all"
              >
                <span className="text-2xl leading-none opacity-80 group-hover:opacity-100 transition-opacity">
                  {festival.chineseName.slice(0, 2)}
                </span>
                <span className="text-white/60 group-hover:text-white/80 text-sm transition-colors">
                  {festival.englishName}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Festival Sections */}
      <div className="bg-gray-50 flex-1">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="space-y-24">
            {festivals.map((festival, index) => {
              const relatedListicles = festival.relatedListicleSlugs
                .map(slug => allListicles.find(l => l.slug === slug))
                .filter(Boolean);

              return (
                <article
                  key={festival.slug}
                  id={festival.slug}
                  className="scroll-mt-8"
                >
                  {/* Festival Header */}
                  <div className="flex items-start gap-6 sm:gap-8 mb-8">
                    <div className="hidden sm:block shrink-0 w-24 pt-1">
                      <p className="text-6xl font-bold text-gray-200 leading-none tracking-tight">
                        {festival.chineseName.slice(0, 2)}
                      </p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="sm:hidden text-4xl font-bold text-gray-200 mb-3 tracking-tight">
                        {festival.chineseName}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                        {festival.englishName}
                        {festival.alternateName && (
                          <span className="text-gray-400 font-normal"> / {festival.alternateName}</span>
                        )}
                      </h2>
                      <p className="text-gray-500 mt-1">
                        <span className="hidden sm:inline">{festival.chineseName} &middot; </span>
                        {festival.pinyin}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded border border-gray-200">
                          {festival.lunarDate}
                        </span>
                        <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded border border-gray-200">
                          2026: {festival.date2026}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="sm:ml-32">
                    {/* Significance */}
                    <p className="text-gray-600 leading-[1.8] text-[15px]">
                      {festival.significance}
                    </p>

                    {/* Traditions + Fun Fact grid */}
                    <div className="mt-8 grid lg:grid-cols-3 gap-4">
                      {/* Traditions */}
                      <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200/80">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-4">
                          Traditions
                        </h3>
                        <ul className="space-y-3">
                          {festival.traditions.map((tradition, i) => (
                            <li key={i} className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">
                              <span className="mt-2 w-1 h-1 rounded-full bg-red-400 shrink-0" />
                              {tradition}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fun Fact */}
                      <div className="relative bg-gray-950 rounded-xl p-6 overflow-hidden">
                        <div className="absolute top-3 right-3 text-[80px] leading-none text-white/[0.04] font-serif select-none pointer-events-none">
                          ?
                        </div>
                        <div className="relative">
                          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-500/20 mb-4">
                            <span className="w-1 h-1 rounded-full bg-red-400" />
                            <span className="text-[10px] font-semibold text-red-300 uppercase tracking-[0.15em]">Did you know</span>
                          </div>
                          <p className="text-white/80 text-sm leading-[1.7]">
                            {festival.funFact}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Related Listicles */}
                    {relatedListicles.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-3">
                          Explore Related Idioms
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {relatedListicles.map((listicle) => (
                            <Link
                              key={listicle!.slug}
                              href={`/blog/lists/${listicle!.slug}`}
                              className="flex items-center justify-between px-4 py-3 rounded-lg bg-white border border-gray-200/80 hover:border-red-200 hover:shadow-sm transition-all group"
                            >
                              <span className="text-gray-600 group-hover:text-gray-900 text-sm leading-snug">
                                {listicle!.title}
                              </span>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-red-400 shrink-0 ml-2" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {index === 1 && <div className="mt-12 sm:ml-32"><AdUnit type="in-article" /></div>}
                  {index === 4 && <div className="mt-12 sm:ml-32"><AdUnit type="in-article" /></div>}
                </article>
              );
            })}
          </div>

          <AdUnit type="display" className="mt-20" />

          {/* FAQ */}
          <section className="mt-24 pt-12 border-t border-gray-200">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-[0.15em] mb-8">
              Frequently Asked Questions
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What are the most important Chinese festivals?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Spring Festival is the most important, followed by Mid-Autumn Festival.
                  Dragon Boat, Qingming, and Lantern Festival complete the &ldquo;big five.&rdquo;
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How are festival dates determined?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Most follow the lunisolar calendar, shifting yearly. Qingming (~April 4-5) and
                  Winter Solstice (~December 21-22) are solar-term exceptions.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What connects festivals and idioms?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Many idioms originated from festival legends — loyalty idioms tie to Dragon Boat,
                  reunion idioms to Mid-Autumn. Using the right one shows cultural fluency.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do Chinese people celebrate Western holidays?</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Valentine&apos;s Day, Christmas, and Halloween are popular in cities among younger generations,
                  but traditional festivals remain primary for family gatherings.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-300">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Built by Wilson</a>
              <span className="hidden sm:inline text-gray-300">&bull;</span>
              <Link href="/blog" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Blog</Link>
              <span className="hidden sm:inline text-gray-300">&bull;</span>
              <Link href="/privacy" className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-300">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
