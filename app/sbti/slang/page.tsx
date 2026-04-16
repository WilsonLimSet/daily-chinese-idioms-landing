import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Languages, ChevronRight } from 'lucide-react';
import { getAllSbtiTypesEn, typeCodeToSlug } from '@/src/lib/sbti';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'Chinese Internet Slang Behind SBTI — All 27 Terms Decoded',
  description: 'Every SBTI type name decodes a specific Chinese internet slang term: 吗喽, 躺平, 佛系青年, 摆烂人, 蚌埠住了 and more. Full cultural decoder.',
  keywords: [
    'chinese internet slang',
    'sbti slang meaning',
    'chinese slang dictionary',
    'chinese memes explained',
    'bilibili slang',
    'weibo slang',
    'xiaohongshu slang',
    'chinese gen z slang',
    'tiktok chinese slang',
    'chinese social media terms',
  ].join(', '),
  alternates: {
    canonical: 'https://www.chineseidioms.com/sbti/slang',
    languages: {
      'x-default': '/sbti/slang',
      en: '/sbti/slang',
      ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/sbti/slang`])),
    },
  },
  openGraph: {
    title: 'Chinese Internet Slang Behind SBTI',
    description: 'All 27 Chinese slang terms encoded in SBTI personality types — decoded.',
    url: 'https://www.chineseidioms.com/sbti/slang',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'article',
  },
};

export default function SbtiSlangHubPage() {
  const types = getAllSbtiTypesEn().filter(t => t.chineseSlangTerm);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'Chinese Internet Slang Terms — SBTI Decoded',
      description: 'The Chinese internet slang vocabulary behind every SBTI personality type.',
      url: 'https://www.chineseidioms.com/sbti/slang',
      hasDefinedTerm: types.map(t => ({
        '@type': 'DefinedTerm',
        name: t.chineseSlangTerm,
        alternateName: t.pinyin,
        description: t.slangMeaning,
        inDefinedTermSet: 'Chinese Internet Slang',
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: 'https://www.chineseidioms.com/sbti' },
        { '@type': 'ListItem', position: 3, name: 'Slang', item: 'https://www.chineseidioms.com/sbti/slang' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id="sbti-slang-hub-ld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/sbti" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI Guide
          </Link>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1.5 rounded-full mb-4">
            <Languages className="w-3 h-3" />
            Chinese Internet Slang Decoder
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            Chinese Internet Slang Behind Every SBTI Type
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            Every SBTI type name decodes a specific Chinese internet slang term. 吗喽 (MALO), 躺平 (DEAD), 佛系青年 (MONK), 蚌埠住了 (HHHH) — we decode all 27, with pinyin, origin story, and how young Chinese actually use them today.
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-6 border border-red-100">
          <h2 className="text-xl font-bold text-red-900 mb-3">Why SBTI type names matter culturally</h2>
          <p className="text-red-900/80 leading-relaxed">
            Unlike MBTI&apos;s abstract four-letter codes (INTJ, ENFP), every SBTI type name is a phonetic or visual echo of a specific Chinese internet archetype. <strong>吗喽</strong> (ma lóu, MALO) is the monkey-emoji chaos person on Bilibili. <strong>躺平</strong> (tǎng píng, DEAD) is the post-burnout &quot;lying flat&quot; rejection of hustle culture. <strong>蚌埠住了</strong> (bèng bù zhù le, HHHH) is the can&apos;t-hold-it laugh-or-cry reaction meme. These terms are the vocabulary of modern Chinese internet life — and now the vocabulary of SBTI.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">All 27 Chinese Slang Terms, Alphabetical</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[...types].sort((a, b) => (a.pinyin || '').localeCompare(b.pinyin || '')).map(t => (
              <Link
                key={t.code}
                href={`/sbti/${typeCodeToSlug(t.code)}#chinese-slang`}
                className="group block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl sm:text-3xl font-bold text-red-700 group-hover:text-red-800 transition-colors">{t.chineseSlangTerm}</span>
                      <span className="text-sm text-red-600/70 font-medium">{t.pinyin}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">{t.slangMeaning}</p>
                    <p className="text-xs text-gray-500">Literal: {t.literalMeaning}</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
                    {t.code}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-red-600 text-xs font-medium">
                  <span>Full origin story</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <AdUnit type="in-article" />

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Grouped by Cultural Archetype</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Burnout & Rejection of Hustle</h3>
              <div className="flex flex-wrap gap-2">
                {['DEAD', 'MONK', 'Dior-s', 'ZZZZ', 'SHIT', 'OJBK'].map(code => {
                  const t = types.find(x => x.code === code);
                  if (!t) return null;
                  return (
                    <Link key={code} href={`/sbti/${typeCodeToSlug(code)}`} className="inline-flex items-baseline gap-2 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors">
                      <span className="font-bold text-red-700">{t.chineseSlangTerm}</span>
                      <span className="text-xs text-slate-600">{code}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Emotion & Sensitivity</h3>
              <div className="flex flex-wrap gap-2">
                {['LOVE-R', 'IMFW', 'MUM', 'SOLO', 'IMSB', 'THAN-K'].map(code => {
                  const t = types.find(x => x.code === code);
                  if (!t) return null;
                  return (
                    <Link key={code} href={`/sbti/${typeCodeToSlug(code)}`} className="inline-flex items-baseline gap-2 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-lg border border-pink-200 transition-colors">
                      <span className="font-bold text-red-700">{t.chineseSlangTerm}</span>
                      <span className="text-xs text-pink-700">{code}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Chaos & Performance</h3>
              <div className="flex flex-wrap gap-2">
                {['MALO', 'JOKE-R', 'FUCK', 'DRUNK', 'HHHH', 'FAKE', 'WOC'].map(code => {
                  const t = types.find(x => x.code === code);
                  if (!t) return null;
                  return (
                    <Link key={code} href={`/sbti/${typeCodeToSlug(code)}`} className="inline-flex items-baseline gap-2 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg border border-purple-200 transition-colors">
                      <span className="font-bold text-red-700">{t.chineseSlangTerm}</span>
                      <span className="text-xs text-purple-700">{code}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">Power & Competence</h3>
              <div className="flex flex-wrap gap-2">
                {['CTRL', 'BOSS', 'GOGO', 'SEXY', 'THIN-K', 'OH-NO', 'POOR', 'ATM-er'].map(code => {
                  const t = types.find(x => x.code === code);
                  if (!t) return null;
                  return (
                    <Link key={code} href={`/sbti/${typeCodeToSlug(code)}`} className="inline-flex items-baseline gap-2 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition-colors">
                      <span className="font-bold text-red-700">{t.chineseSlangTerm}</span>
                      <span className="text-xs text-indigo-700">{code}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Want more Chinese internet slang?</h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            Our <Link href="/slang" className="text-indigo-600 hover:text-indigo-700 font-semibold">/slang dictionary</Link> covers 60+ more terms young Chinese use online — 内卷 (neijuan), 躺平 (tangping), YYDS, 666, 牛逼, 996, and every other term you&apos;ve seen on Chinese TikTok or Xiaohongshu but didn&apos;t have the decoder for.
          </p>
          <Link
            href="/slang"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Browse Chinese Internet Slang
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Find Your SBTI Type</h2>
          <Link
            href="/sbti"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
          >
            Explore All 27 Types
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
