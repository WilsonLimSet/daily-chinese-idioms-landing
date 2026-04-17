import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getAllSbtiTypes, typeCodeToSlug } from '@/src/lib/sbti';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) return { title: 'Not found' };

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  const languageAlternates: Record<string, string> = {
    'x-default': '/sbti',
    en: '/sbti',
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti`;
  }

  return {
    title: `SBTI Personality Test — All 27 Types | ${nativeName}`,
    description: `SBTI (Silly Behavioral Type Indicator) — the viral Chinese personality test with 27 types: CTRL, BOSS, MALO, DRUNK, and more. Full ${nativeName} guide.`,
    keywords: [
      'sbti',
      'sbti test',
      'sbti personality test',
      'sbti types',
      'sbti 27 types',
      'sbti meaning',
      'sbti vs mbti',
      'what is sbti',
    ].join(', '),
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/sbti`,
      languages: languageAlternates,
    },
    openGraph: {
      title: `SBTI Personality Test — All 27 Types`,
      description: 'Every SBTI personality type with traits, recognition signals, and matching Chinese idioms.',
      url: `https://www.chineseidioms.com/${lang}/sbti`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
  };
}

export default async function LocalizedSbtiHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) notFound();

  const types = getAllSbtiTypes(lang);
  const regular = types.filter(t => !t.special);
  const special = types.filter(t => t.special);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SBTI Personality Test — All 27 Types',
      url: `https://www.chineseidioms.com/${lang}/sbti`,
      inLanguage: lang,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: types.length,
        itemListElement: types.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `SBTI ${t.code} — ${t.displayName}`,
          url: `https://www.chineseidioms.com/${lang}/sbti/${typeCodeToSlug(t.code)}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: `https://www.chineseidioms.com/${lang}/sbti` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`sbti-${lang}-hub-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span>SBTI</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            SBTI Personality Test — All 27 Types
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            Silly Behavioral Type Indicator — 27 types, 15 dimensions, 30 questions.
          </p>
        </header>

        <div className="mb-8 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-6 text-white shadow-lg sm:p-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-100">Take the test</p>
              <p className="mt-1 text-xl font-bold sm:text-2xl">SBTI — 30 questions, instant result</p>
            </div>
            <Link
              href={`/${lang}/sbti/test`}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-bold text-indigo-600 shadow-md transition hover:bg-indigo-50"
            >
              Start
              <ChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </div>

        <AdUnit type="display" />

        <section className="mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">25</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regular.map((t) => (
              <Link
                key={t.code}
                href={`/${lang}/sbti/${typeCodeToSlug(t.code)}`}
                className="group h-full bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-xl hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {t.code}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-indigo-600 transition-colors">{t.displayName}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t.tagline || t.coreVibe}</p>
                <div className="mt-4 flex items-center gap-1 text-indigo-600 font-medium text-sm">
                  <span>→</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {special.length > 0 && (
          <section className="mb-14">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">2</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {special.map((t) => (
                <Link
                  key={t.code}
                  href={`/${lang}/sbti/${typeCodeToSlug(t.code)}`}
                  className="group h-full bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm border border-amber-200 p-5 hover:shadow-xl hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-700 bg-white/80 px-2 py-1 rounded inline-block mb-2">
                    {t.code}
                  </span>
                  <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-700 transition-colors">{t.displayName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{t.tagline || t.coreVibe}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 grid md:grid-cols-2 gap-4">
          <Link href={`/${lang}/sbti/vs-mbti`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-indigo-600 transition-colors">SBTI vs MBTI</h3>
            <p className="text-sm text-gray-500 leading-relaxed">→</p>
          </Link>
          <Link href={`/${lang}/sbti/what-is`} className="group bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-indigo-100 transition-all duration-300">
            <h3 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-indigo-600 transition-colors">What is SBTI?</h3>
            <p className="text-sm text-gray-500 leading-relaxed">→</p>
          </Link>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">SBTI + 成语</h2>
          <Link
            href={`/${lang}/blog/lists`}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
          >
            →
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href={`/${lang}`} className="text-gray-600 hover:text-gray-900">Home</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
