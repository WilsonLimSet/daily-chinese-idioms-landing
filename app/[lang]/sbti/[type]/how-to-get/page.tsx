import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight, Target, Lightbulb, AlertTriangle } from 'lucide-react';
import { getAllSbtiTypes, getSbtiType, typeCodeToSlug } from '@/src/lib/sbti';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const params = [];
  for (const lang of Object.keys(LANGUAGES)) {
    for (const t of getAllSbtiTypes(lang)) {
      params.push({ lang, type: typeCodeToSlug(t.code) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}): Promise<Metadata> {
  const { lang, type } = await params;
  const sbti = getSbtiType(type, lang);
  if (!sbti) return { title: 'SBTI Cheat Guide Not Found' };

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  const title = `How to Get SBTI ${sbti.code} (${sbti.displayName}) | ${nativeName}`;
  const description = `SBTI ${sbti.code} ${sbti.displayName}: ${sbti.tagline}. ${sbti.howToGetThisType.substring(0, 100)}`;

  const canonical = `https://www.chineseidioms.com/${lang}/sbti/${type}/how-to-get`;
  const languageAlternates: Record<string, string> = {
    'x-default': `/sbti/${type}/how-to-get`,
    en: `/sbti/${type}/how-to-get`,
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/${type}/how-to-get`;
  }

  return {
    title,
    description,
    keywords: [
      `how to get sbti ${sbti.code.toLowerCase()}`,
      `sbti ${sbti.code.toLowerCase()} answers`,
      `sbti ${sbti.code.toLowerCase()} cheat`,
      ...sbti.keywords,
    ].join(', '),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
    alternates: { canonical, languages: languageAlternates },
  };
}

export default async function LocalizedSbtiHowToGetPage({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang, type } = await params;
  const sbti = getSbtiType(type, lang);
  if (!sbti) notFound();

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Get SBTI ${sbti.code}`,
      description: sbti.howToGetThisType,
      inLanguage: lang,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: `https://www.chineseidioms.com/${lang}/sbti` },
        { '@type': 'ListItem', position: 3, name: sbti.code, item: `https://www.chineseidioms.com/${lang}/sbti/${type}` },
        { '@type': 'ListItem', position: 4, name: 'How to Get', item: `https://www.chineseidioms.com/${lang}/sbti/${type}/how-to-get` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`sbti-${lang}-${type}-howto-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/sbti/${type}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI {sbti.code}
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href={`/${lang}`} className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/sbti`} className="hover:text-gray-900">SBTI</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/sbti/${type}`} className="hover:text-gray-900">{sbti.code}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">How to Get</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full mb-4">
            <Target className="w-3 h-3" />
            SBTI {sbti.code}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            SBTI {sbti.code} ({sbti.displayName})
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {sbti.tagline}
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
          <h2 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
            <Target className="w-5 h-5" /> SBTI {sbti.code}
          </h2>
          <p className="text-orange-900/90 leading-relaxed text-base">
            {sbti.howToGetThisType}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{sbti.displayName}</h2>
          <ul className="space-y-3">
            {sbti.traits.map((trait, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-gray-700">{trait}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" /> ✓
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {sbti.recognitionSignals.map((sig, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">
                  <span className="font-bold text-orange-600">✓</span> {sig}
                </p>
              </div>
            ))}
          </div>
        </section>

        <AdUnit type="in-article" />

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-500" /> ⚠
          </h2>
          <div className="bg-red-50 border border-red-100 rounded-xl p-5">
            <ul className="space-y-2">
              {sbti.weaknesses.map((w, i) => (
                <li key={i} className="text-red-900/80 text-sm leading-relaxed">
                  <span className="font-bold text-red-600">✗</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h2 className="text-xl font-bold text-indigo-900 mb-3">SBTI {sbti.code}</h2>
          <p className="text-indigo-900/80 leading-relaxed mb-4">
            {sbti.tagline}
          </p>
          <Link
            href={`/${lang}/sbti/${type}`}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-200 shadow-sm border border-indigo-200"
          >
            SBTI {sbti.code} →
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href={`/${lang}/sbti`} className="text-gray-600 hover:text-gray-900">SBTI</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
