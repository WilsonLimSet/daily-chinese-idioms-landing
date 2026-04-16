import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight, Heart, AlertTriangle, Minus } from 'lucide-react';
import { getAllSbtiTypesEn, getSbtiType, typeCodeToSlug, SbtiType } from '@/src/lib/sbti';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return getAllSbtiTypesEn().map(t => ({ type: typeCodeToSlug(t.code) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string }>;
}): Promise<Metadata> {
  const { type } = await params;
  const sbti = getSbtiType(type);
  if (!sbti) return { title: 'Not found' };

  const canonical = `https://www.chineseidioms.com/sbti/${type}/compatibility`;
  const languageAlternates: Record<string, string> = {
    'x-default': `/sbti/${type}/compatibility`,
    en: `/sbti/${type}/compatibility`,
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/${type}/compatibility`;
  }

  return {
    title: `SBTI ${sbti.code} Compatibility — All 26 Type Matches Ranked`,
    description: `Which SBTI types are compatible with ${sbti.code} (${sbti.displayName})? Complete compatibility chart with all 26 other types — best matches, challenging pairings, and why.`,
    keywords: [
      `sbti ${sbti.code.toLowerCase()} compatibility`,
      `sbti ${sbti.code.toLowerCase()} matches`,
      `sbti ${sbti.code.toLowerCase()} relationships`,
      `sbti ${sbti.code.toLowerCase()} best match`,
      `sbti ${sbti.code.toLowerCase()} worst match`,
      `who should ${sbti.code.toLowerCase()} date`,
      ...sbti.keywords.slice(0, 4),
    ].join(', '),
    alternates: { canonical, languages: languageAlternates },
    openGraph: {
      title: `SBTI ${sbti.code} Compatibility — All 26 Type Matches`,
      description: `Complete SBTI ${sbti.code} compatibility guide.`,
      url: canonical,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'article',
    },
  };
}

function scoreCompatibility(self: SbtiType, other: SbtiType): 'best' | 'good' | 'challenging' | 'neutral' {
  if (self.compatibleTypes.includes(other.code)) return 'best';
  if (self.incompatibleTypes.includes(other.code)) return 'challenging';
  // Bidirectional check — if other type also lists self as compatible
  if (other.compatibleTypes.includes(self.code)) return 'good';
  return 'neutral';
}

const SCORE_META = {
  best: { label: 'Best Match', color: 'rose', emoji: '💕', Icon: Heart },
  good: { label: 'Good Match', color: 'green', emoji: '✅', Icon: Heart },
  challenging: { label: 'Challenging', color: 'amber', emoji: '⚠️', Icon: AlertTriangle },
  neutral: { label: 'Neutral', color: 'slate', emoji: '➖', Icon: Minus },
};

export default async function SbtiCompatibilityPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const self = getSbtiType(type);
  if (!self) notFound();

  const allTypes = getAllSbtiTypesEn();
  const others = allTypes.filter(t => t.code !== self.code);

  const scored = others.map(other => ({
    type: other,
    score: scoreCompatibility(self, other),
  }));

  const byScore = {
    best: scored.filter(x => x.score === 'best').map(x => x.type),
    good: scored.filter(x => x.score === 'good').map(x => x.type),
    challenging: scored.filter(x => x.score === 'challenging').map(x => x.type),
    neutral: scored.filter(x => x.score === 'neutral').map(x => x.type),
  };

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: `SBTI ${self.code} Compatibility with All 26 Types`,
      description: `Complete SBTI ${self.code} compatibility chart.`,
      author: { '@type': 'Organization', name: 'Chinese Idioms' },
      publisher: { '@type': 'Organization', name: 'Chinese Idioms', logo: { '@type': 'ImageObject', url: 'https://www.chineseidioms.com/icon.png' } },
      mainEntityOfPage: `https://www.chineseidioms.com/sbti/${type}/compatibility`,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: 'https://www.chineseidioms.com/sbti' },
        { '@type': 'ListItem', position: 3, name: self.code, item: `https://www.chineseidioms.com/sbti/${type}` },
        { '@type': 'ListItem', position: 4, name: 'Compatibility', item: `https://www.chineseidioms.com/sbti/${type}/compatibility` },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`sbti-${type}-compat-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/sbti/${type}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to SBTI {self.code}
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/sbti" className="hover:text-gray-900">SBTI</Link>
          <span className="mx-2">/</span>
          <Link href={`/sbti/${type}`} className="hover:text-gray-900">{self.code}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Compatibility</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1.5 rounded-full mb-4">
            <Heart className="w-3 h-3" />
            Compatibility Chart
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            SBTI {self.code} Compatibility: All 26 Types Ranked
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            Who matches the {self.displayName}? Here&apos;s how SBTI {self.code} pairs with every other type — in romance, friendship, and work — from best matches to the challenging ones you&apos;ll need to work at.
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-2xl p-6 border border-pink-100">
          <h2 className="text-xl font-bold text-pink-900 mb-3">What makes {self.code} compatible</h2>
          <p className="text-pink-900/80 leading-relaxed">
            {self.displayName} energy is about <strong>{self.coreVibe}</strong>. {self.inRelationships}
          </p>
        </section>

        {byScore.best.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" /> Best Matches
            </h2>
            <p className="text-gray-600 mb-5 text-sm">
              These types complement {self.code}&apos;s energy the most — whether in romance, friendship, or close working relationships.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {byScore.best.map(other => (
                <Link
                  key={other.code}
                  href={`/sbti/${typeCodeToSlug(other.code)}`}
                  className="group block bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-5 border border-rose-200 hover:shadow-xl hover:border-rose-300 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-white px-2 py-0.5 rounded">
                        {other.code}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-rose-700 transition-colors">{other.displayName}</h3>
                    </div>
                    <span className="text-2xl">💕</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byScore.good.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Heart className="w-6 h-6 text-green-500" /> Good Matches
            </h2>
            <p className="text-gray-600 mb-5 text-sm">
              Solid pairings — these types have listed {self.code} as compatible, even if {self.code} didn&apos;t list them in return.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {byScore.good.map(other => (
                <Link
                  key={other.code}
                  href={`/sbti/${typeCodeToSlug(other.code)}`}
                  className="group block bg-white rounded-2xl p-5 border border-green-200 hover:shadow-xl hover:border-green-300 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-green-700 bg-green-50 px-2 py-0.5 rounded">
                        {other.code}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-green-700 transition-colors">{other.displayName}</h3>
                    </div>
                    <span className="text-2xl">✅</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdUnit type="in-article" />

        {byScore.challenging.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-500" /> Challenging Matches
            </h2>
            <p className="text-gray-600 mb-5 text-sm">
              These pairings need real work. Not impossible — just likely to create friction around {self.coreVibe.split(',')[0]}.
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              {byScore.challenging.map(other => (
                <Link
                  key={other.code}
                  href={`/sbti/${typeCodeToSlug(other.code)}`}
                  className="group block bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200 hover:shadow-xl hover:border-amber-300 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-white px-2 py-0.5 rounded">
                        {other.code}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mt-1 group-hover:text-amber-700 transition-colors">{other.displayName}</h3>
                    </div>
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{other.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {byScore.neutral.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Neutral Pairings</h2>
            <p className="text-gray-600 mb-5 text-sm">
              Neither especially natural nor especially friction-prone — these types and {self.code} can work together or apart depending on context.
            </p>
            <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
              {byScore.neutral.map(other => (
                <Link
                  key={other.code}
                  href={`/sbti/${typeCodeToSlug(other.code)}`}
                  className="group block bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all"
                >
                  <span className="text-xs font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded">{other.code}</span>
                  <p className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-slate-700 transition-colors">{other.displayName}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Compatibility Summary Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Type</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Display Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Match Quality</th>
                </tr>
              </thead>
              <tbody>
                {others.map(other => {
                  const score = scoreCompatibility(self, other);
                  const meta = SCORE_META[score];
                  return (
                    <tr key={other.code} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900">
                        <Link href={`/sbti/${typeCodeToSlug(other.code)}`} className="hover:text-indigo-600 transition-colors">
                          {other.code}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-700">{other.displayName}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full bg-${meta.color}-50 text-${meta.color}-700 border border-${meta.color}-200`}>
                          {meta.emoji} {meta.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Explore All 27 SBTI Types</h2>
          <Link
            href="/sbti"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl mt-3"
          >
            SBTI Type Directory
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href="/sbti" className="text-gray-600 hover:text-gray-900">SBTI</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang="en" />
          </div>
        </div>
      </footer>
    </div>
  );
}
