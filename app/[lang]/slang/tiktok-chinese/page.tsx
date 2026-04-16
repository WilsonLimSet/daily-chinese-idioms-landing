import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Languages, ChevronRight } from 'lucide-react';
import { TIKTOK_CHINESE_SLANG } from '@/src/data/tiktok-chinese-slang';
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
    'x-default': '/slang/tiktok-chinese',
    en: '/slang/tiktok-chinese',
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/slang/tiktok-chinese`;
  }

  return {
    title: `TikTok Slang in Chinese — Gen-Z Translated | ${nativeName}`,
    description: `LMAO → 笑死我了, GOAT → YYDS, Delulu → 恋爱脑, Rizz → 魅力值. TikTok slang translated to Chinese with pinyin and examples.`,
    keywords: ['tiktok slang chinese', 'chinese internet slang', 'lmao chinese', 'yyds meaning', 'xswl'].join(', '),
    alternates: { canonical: `https://www.chineseidioms.com/${lang}/slang/tiktok-chinese`, languages: languageAlternates },
    openGraph: {
      title: 'TikTok Slang in Chinese',
      description: 'English TikTok slang with Chinese equivalents.',
      url: `https://www.chineseidioms.com/${lang}/slang/tiktok-chinese`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
  };
}

export default async function LocalizedTikTokChinesePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) notFound();

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'TikTok Slang in Chinese',
      description: 'English TikTok slang with Chinese equivalents.',
      inLanguage: lang,
      mainEntityOfPage: `https://www.chineseidioms.com/${lang}/slang/tiktok-chinese`,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`tiktok-${lang}-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/slang`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Slang
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pink-700 bg-pink-50 px-3 py-1.5 rounded-full mb-4">
            <Languages className="w-3 h-3" />
            TikTok ↔ 中文
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            TikTok 🇺🇸 ↔ 中文 🇨🇳
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
            LMAO, GOAT, Delulu, Rizz, Slay — · 中文 · TikTok
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-10 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">English</th>
                  <th className="text-left p-3 font-semibold text-gray-700">中文</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Pinyin</th>
                </tr>
              </thead>
              <tbody>
                {TIKTOK_CHINESE_SLANG.map(s => (
                  <tr key={s.english} className="border-b border-gray-100 hover:bg-gray-50/50">
                    <td className="p-3 font-bold text-gray-900">{s.english}</td>
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
                  <div className="text-sm text-red-600/70 mt-1">{s.pinyin}</div>
                </div>
              </div>

              <div className="mb-5 grid md:grid-cols-2 gap-3 bg-gray-50 rounded-xl p-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">EN</p>
                  <p className="text-gray-800 font-medium">&ldquo;{s.example.english}&rdquo;</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">中文</p>
                  <p className="text-gray-800 font-medium">&ldquo;{s.example.chinese}&rdquo;</p>
                </div>
              </div>

              {s.altChinese && s.altChinese.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-2">
                  {s.altChinese.map((alt, idx) => (
                    <div key={idx} className="bg-red-50 rounded-lg p-3 border border-red-100">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-red-700 text-lg">{alt.term}</span>
                        <span className="text-xs text-red-600/70">{alt.pinyin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="mt-16 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100">
          <Link
            href={`/${lang}/sbti`}
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-200 shadow-sm border border-indigo-200"
          >
            SBTI →
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href={`/${lang}/slang`} className="text-gray-600 hover:text-gray-900">Slang</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
