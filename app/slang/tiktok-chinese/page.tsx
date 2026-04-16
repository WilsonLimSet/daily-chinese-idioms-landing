import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Languages, ChevronRight } from 'lucide-react';
import { TIKTOK_CHINESE_SLANG } from '@/src/data/tiktok-chinese-slang';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'TikTok Slang in Chinese — 13 English Gen-Z Words Translated',
  description: 'LMAO → 笑死我了 (XSWL), GOAT → YYDS, Delulu → 恋爱脑, Rizz → 魅力值. Every viral English TikTok slang with the Chinese equivalent young people actually use.',
  keywords: [
    'tiktok slang in chinese',
    'chinese tiktok slang',
    'lmao in chinese',
    'lol in chinese',
    'goat in chinese',
    'delulu in chinese',
    'rizz in chinese',
    'slay in chinese',
    'gg in chinese',
    'chinese gen z slang',
    'xswl meaning',
    'yyds meaning',
    'woc meaning chinese',
    'ojbk meaning',
  ].join(', '),
  alternates: {
    canonical: 'https://www.chineseidioms.com/slang/tiktok-chinese',
    languages: {
      'x-default': '/slang/tiktok-chinese',
      en: '/slang/tiktok-chinese',
      ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/slang/tiktok-chinese`])),
    },
  },
  openGraph: {
    title: 'TikTok Slang in Chinese — English Gen-Z Words Translated',
    description: 'Every viral TikTok slang (LMAO, GOAT, Delulu, Rizz, Slay) with its Chinese equivalent. Full pronunciation, origin, examples.',
    url: 'https://www.chineseidioms.com/slang/tiktok-chinese',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'article',
  },
};

export default function TikTokChineseSlangPage() {
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'TikTok Slang in Chinese — English Gen-Z Words Translated',
      description: 'Every major English TikTok slang term with its Chinese equivalent.',
      author: { '@type': 'Organization', name: 'Chinese Idioms' },
      publisher: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        logo: { '@type': 'ImageObject', url: 'https://www.chineseidioms.com/icon.png' },
      },
      mainEntityOfPage: 'https://www.chineseidioms.com/slang/tiktok-chinese',
      datePublished: '2026-04-16',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: TIKTOK_CHINESE_SLANG.map(s => ({
        '@type': 'Question',
        name: `How do you say "${s.english}" in Chinese?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `"${s.english}" translates to ${s.chinese} (${s.pinyin}) in Chinese internet slang. ${s.whenToUse}`,
        },
      })),
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'Slang', item: 'https://www.chineseidioms.com/slang' },
        { '@type': 'ListItem', position: 3, name: 'TikTok Chinese', item: 'https://www.chineseidioms.com/slang/tiktok-chinese' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id="tiktok-chinese-ld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/slang" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            All Slang
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1.5 rounded-full mb-4">
            <Languages className="w-3 h-3" />
            TikTok 🇺🇸 ↔ Chinese 🇨🇳
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            TikTok Slang in Chinese — 13 Gen-Z Words Translated
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            The internet&apos;s gone multilingual. Here&apos;s the direct Chinese equivalent of every English TikTok slang you&apos;ve been saying without knowing — LMAO, GOAT, Delulu, Rizz, Slay, and more. Each entry has pinyin, pronunciation, origin, and real-use examples.
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Reference Table</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">English</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Chinese</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Pinyin</th>
                </tr>
              </thead>
              <tbody>
                {TIKTOK_CHINESE_SLANG.map(s => (
                  <tr key={s.english} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{s.english}{s.englishAka ? ` / ${s.englishAka}` : ''}</td>
                    <td className="p-3 text-red-700 font-bold text-base">{s.chinese}</td>
                    <td className="p-3 text-gray-600">{s.pinyin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-8">
          {TIKTOK_CHINESE_SLANG.map((s, i) => (
            <div key={s.english} id={s.english.toLowerCase().replace(/[^a-z]/g, '')} className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              {i > 0 && i % 4 === 0 && (
                <div className="mb-6 -mt-2">
                  <AdUnit type="in-article" />
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
                <div>
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900">{s.english}</span>
                  {s.englishAka && <span className="ml-2 text-lg text-gray-500">/ {s.englishAka}</span>}
                </div>
                <div className="text-right">
                  <div className="text-3xl sm:text-4xl font-bold text-red-700">{s.chinese}</div>
                  <div className="text-sm text-red-600/70 mt-1">{s.pinyin}{s.pronunciation ? ` · "${s.pronunciation}"` : ''}</div>
                </div>
              </div>

              <div className="mb-5 pb-5 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">When to use it</h3>
                <p className="text-gray-700 leading-relaxed">{s.whenToUse}</p>
              </div>

              <div className="mb-5 grid md:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">English</p>
                  <p className="text-gray-800 font-medium">&ldquo;{s.example.english}&rdquo;</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Chinese</p>
                  <p className="text-gray-800 font-medium">&ldquo;{s.example.chinese}&rdquo;</p>
                </div>
              </div>

              <div className="mb-5">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Origin</h3>
                <p className="text-gray-700 leading-relaxed text-sm">{s.origin}</p>
              </div>

              {s.altChinese && s.altChinese.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Alternative Chinese expressions</h3>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {s.altChinese.map((alt, idx) => (
                      <div key={idx} className="bg-red-50 rounded-lg p-3 border border-red-100">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-red-700 text-lg">{alt.term}</span>
                          <span className="text-xs text-red-600/70">{alt.pinyin}</span>
                        </div>
                        <p className="text-xs text-gray-600">{alt.note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="mt-16 bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50 rounded-3xl p-6 sm:p-8 border border-pink-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Want more Chinese internet slang?</h2>
          <p className="text-gray-700 leading-relaxed mb-5">
            We cover 60+ more terms in our main Chinese slang dictionary — including 内卷 (nèi juǎn, involution), 躺平 (tǎng píng, lying flat), 996, 摸鱼 (mō yú, slacking off), and every phrase you&apos;ve seen on Xiaohongshu but didn&apos;t have a decoder for.
          </p>
          <Link
            href="/slang"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Full Chinese Slang Dictionary
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="mt-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
          <h3 className="text-xl font-bold text-indigo-900 mb-3">Bonus: Find Your Chinese-Slang Personality</h3>
          <p className="text-indigo-900/80 leading-relaxed mb-4">
            Your personality translates to Chinese internet slang too. Take the viral SBTI (Silly Behavioral Type Indicator) test — 27 types, each named after a specific Chinese slang archetype like 吗喽 (MALO), 躺平 (DEAD), or 佛系青年 (MONK).
          </p>
          <Link
            href="/sbti"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-200 shadow-sm border border-indigo-200"
          >
            SBTI Personality Test Guide
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href="/slang" className="text-gray-600 hover:text-gray-900">Slang</Link>
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
