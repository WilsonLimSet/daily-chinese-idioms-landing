import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllFestivalsTranslated } from '@/src/lib/festivals';
import { getAllListiclesTranslated } from '@/src/lib/listicles';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map(lang => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  return {
    title: `Chinese Festivals & Holidays — Cultural Guide | Chinese Idioms (${langName})`,
    description: 'Complete guide to Chinese festivals and holidays: Spring Festival, Qingming, Dragon Boat, Mid-Autumn, and more. Learn traditions, cultural significance, and related Chinese idioms.',
    keywords: ['chinese festivals', 'chinese holidays', 'chinese traditions', langName.toLowerCase()],
    openGraph: {
      title: 'Chinese Festivals & Holidays — Cultural Guide',
      description: 'Explore Chinese festivals through their traditions, stories, and the idioms that bring them to life.',
      url: `https://www.chineseidioms.com/${lang}/festivals`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/festivals`,
      languages: {
        'x-default': '/festivals',
        'en': '/festivals',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/festivals`])
        ),
      },
    },
  };
}

export default async function TranslatedFestivalsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const festivals = getAllFestivalsTranslated(lang);

  let translatedListicles: { slug: string; title: string; publishedDate: string }[] = [];
  try {
    translatedListicles = getAllListiclesTranslated(lang);
  } catch {
    // Fall back to empty if translations not available
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": getTranslation(lang, 'festivalsTitle'),
    "description": getTranslation(lang, 'festivalsSubtitle'),
    "url": `https://www.chineseidioms.com/${lang}/festivals`,
    "inLanguage": lang,
    "isPartOf": {
      "@type": "WebSite",
      "name": "Chinese Idioms",
      "url": "https://www.chineseidioms.com"
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": getTranslation(lang, 'home'), "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": getTranslation(lang, 'festivalsTitle'), "item": `https://www.chineseidioms.com/${lang}/festivals` },
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

  const faqEntries = [
    { q: getTranslation(lang, 'festivalsFaqQ1'), a: getTranslation(lang, 'festivalsFaqA1') },
    { q: getTranslation(lang, 'festivalsFaqQ2'), a: getTranslation(lang, 'festivalsFaqA2') },
    { q: getTranslation(lang, 'festivalsFaqQ3'), a: getTranslation(lang, 'festivalsFaqA3') },
    { q: getTranslation(lang, 'festivalsFaqQ4'), a: getTranslation(lang, 'festivalsFaqA4') },
  ];

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqEntries.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
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
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {getTranslation(lang, 'home')}
          </Link>
        </nav>
        <div className="relative max-w-5xl mx-auto px-6 pt-12 pb-16">
          <p className="text-xs font-medium text-white/40 tracking-[0.25em] uppercase mb-6">{getTranslation(lang, 'festivalsCulturalGuide')}</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
            {getTranslation(lang, 'festivalsTitle')}
          </h1>
          <p className="text-white/50 text-lg leading-relaxed mt-6 max-w-xl">
            {getTranslation(lang, 'festivalsSubtitle')}
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
                .map(slug => translatedListicles.find(l => l.slug === slug || (l as { originalSlug?: string }).originalSlug === slug))
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
                          {getTranslation(lang, 'festivalsTraditions')}
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
                            <span className="text-[10px] font-semibold text-red-300 uppercase tracking-[0.15em]">{getTranslation(lang, 'festivalsDidYouKnow')}</span>
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
                          {getTranslation(lang, 'festivalsExploreIdioms')}
                        </h3>
                        <div className="grid sm:grid-cols-2 gap-2">
                          {relatedListicles.map((listicle) => (
                            <Link
                              key={listicle!.slug}
                              href={`/${lang}/blog/lists/${listicle!.slug}`}
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
              {getTranslation(lang, 'festivalsFAQ')}
            </h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
              {faqEntries.map(({ q, a }, i) => (
                <div key={i}>
                  <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
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
              <Link href={`/${lang}/blog`} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Blog</Link>
              <span className="hidden sm:inline text-gray-300">&bull;</span>
              <Link href={`/${lang}/privacy`} className="text-gray-400 hover:text-gray-600 text-sm transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-300">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
