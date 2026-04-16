import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight, Heart, AlertTriangle } from 'lucide-react';
import { getAllSbtiTypes, getSbtiType, typeCodeToSlug, SbtiType } from '@/src/lib/sbti';
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
  if (!sbti) return { title: 'Not found' };

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  const canonical = `https://www.chineseidioms.com/${lang}/sbti/${type}/compatibility`;
  const languageAlternates: Record<string, string> = {
    'x-default': `/sbti/${type}/compatibility`,
    en: `/sbti/${type}/compatibility`,
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/${type}/compatibility`;
  }

  return {
    title: `SBTI ${sbti.code} Compatibility — All 26 Types | ${nativeName}`,
    description: `SBTI ${sbti.code} (${sbti.displayName}) compatibility with all 26 other types.`,
    keywords: [
      `sbti ${sbti.code.toLowerCase()} compatibility`,
      `sbti ${sbti.code.toLowerCase()} matches`,
      ...sbti.keywords.slice(0, 4),
    ].join(', '),
    alternates: { canonical, languages: languageAlternates },
    openGraph: {
      title: `SBTI ${sbti.code} Compatibility`,
      description: `SBTI ${sbti.code} compatibility with all 26 types.`,
      url: canonical,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
  };
}

function scoreCompatibility(self: SbtiType, other: SbtiType): 'best' | 'good' | 'challenging' | 'neutral' {
  if (self.compatibleTypes.includes(other.code)) return 'best';
  if (self.incompatibleTypes.includes(other.code)) return 'challenging';
  if (other.compatibleTypes.includes(self.code)) return 'good';
  return 'neutral';
}

const SCORE_META = {
  best: { emoji: '💕', color: 'rose' },
  good: { emoji: '✅', color: 'green' },
  challenging: { emoji: '⚠️', color: 'amber' },
  neutral: { emoji: '➖', color: 'slate' },
};

export default async function LocalizedSbtiCompatibilityPage({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang, type } = await params;
  const self = getSbtiType(type, lang);
  if (!self) notFound();

  const allTypes = getAllSbtiTypes(lang);
  const others = allTypes.filter(t => t.code !== self.code);

  const byScore = {
    best: others.filter(o => scoreCompatibility(self, o) === 'best'),
    good: others.filter(o => scoreCompatibility(self, o) === 'good'),
    challenging: others.filter(o => scoreCompatibility(self, o) === 'challenging'),
    neutral: others.filter(o => scoreCompatibility(self, o) === 'neutral'),
  };

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `SBTI ${self.code} Compatibility`,
      description: `Compatibility analysis for SBTI ${self.code}.`,
      inLanguage: lang,
      mainEntityOfPage: `https://www.chineseidioms.com/${lang}/sbti/${type}/compatibility`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: `https://www.chineseidioms.com/${lang}/sbti` },
        { '@type': 'ListItem', position: 3, name: self.code, item: `https://www.chineseidioms.com/${lang}/sbti/${type}` },
        { '@type': 'ListItem', position: 4, name: 'Compatibility', item: `https://www.chineseidioms.com/${lang}/sbti/${type}/compatibility` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`sbti-${lang}-${type}-compat-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/sbti/${type}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI {self.code}
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href={`/${lang}`} className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/sbti`} className="hover:text-gray-900">SBTI</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/sbti/${type}`} className="hover:text-gray-900">{self.code}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Compatibility</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full mb-4">
            <Heart className="w-3 h-3" />
            SBTI {self.code}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            SBTI {self.code} · {self.displayName}
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            {self.inRelationships}
          </p>
        </header>

        <AdUnit type="display" />

        {byScore.best.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> 💕
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {byScore.best.map(other => (
                <Link key={other.code} href={`/${lang}/sbti/${typeCodeToSlug(other.code)}`} className="group block bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-200 hover:shadow-xl hover:border-rose-300 transition-all duration-300">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-white px-2 py-0.5 rounded">{other.code}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-rose-700 transition-colors">{other.displayName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byScore.good.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-green-500" /> ✅
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {byScore.good.map(other => (
                <Link key={other.code} href={`/${lang}/sbti/${typeCodeToSlug(other.code)}`} className="group block bg-white rounded-2xl p-5 border border-green-200 hover:shadow-xl hover:border-green-300 transition-all duration-300">
                  <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded">{other.code}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-green-700 transition-colors">{other.displayName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdUnit type="in-article" />

        {byScore.challenging.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> ⚠️
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {byScore.challenging.map(other => (
                <Link key={other.code} href={`/${lang}/sbti/${typeCodeToSlug(other.code)}`} className="group block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 hover:shadow-xl hover:border-amber-300 transition-all duration-300">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-white px-2 py-0.5 rounded">{other.code}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-amber-700 transition-colors">{other.displayName}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mt-1">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byScore.neutral.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">➖</h2>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {byScore.neutral.map(other => (
                <Link key={other.code} href={`/${lang}/sbti/${typeCodeToSlug(other.code)}`} className="group block bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all">
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded">{other.code}</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-slate-700 transition-colors">{other.displayName}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">SBTI</th>
                  <th className="text-left p-3 font-semibold text-gray-700">{self.displayName}</th>
                  <th className="text-left p-3 font-semibold text-gray-700">·</th>
                </tr>
              </thead>
              <tbody>
                {others.map(other => {
                  const score = scoreCompatibility(self, other);
                  const meta = SCORE_META[score];
                  return (
                    <tr key={other.code} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">
                        <Link href={`/${lang}/sbti/${typeCodeToSlug(other.code)}`} className="hover:text-indigo-600 transition-colors">{other.code}</Link>
                      </td>
                      <td className="p-3 text-gray-700">{other.displayName}</td>
                      <td className="p-3">{meta.emoji}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-center">
          <Link href={`/${lang}/sbti`} className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl">
            SBTI
            <ChevronRight className="w-5 h-5" />
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
