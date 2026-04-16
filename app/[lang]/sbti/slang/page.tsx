import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Languages, ChevronRight } from 'lucide-react';
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
    'x-default': '/sbti/slang',
    en: '/sbti/slang',
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/slang`;
  }

  return {
    title: `Chinese Internet Slang — SBTI 27 Terms Decoded | ${nativeName}`,
    description: `All 27 Chinese internet slang terms behind SBTI: 吗喽, 躺平, 佛系青年, 蚌埠住了 and more. Full cultural decoder in ${nativeName}.`,
    keywords: ['chinese internet slang', 'sbti slang', 'chinese memes', 'bilibili slang', 'chinese tiktok slang'].join(', '),
    alternates: { canonical: `https://www.chineseidioms.com/${lang}/sbti/slang`, languages: languageAlternates },
    openGraph: {
      title: 'Chinese Internet Slang — SBTI Decoded',
      description: 'Every SBTI type\'s Chinese slang origin explained.',
      url: `https://www.chineseidioms.com/${lang}/sbti/slang`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
  };
}

export default async function LocalizedSbtiSlangHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) notFound();

  const types = getAllSbtiTypes(lang).filter(t => t.chineseSlangTerm);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: 'Chinese Internet Slang — SBTI',
      url: `https://www.chineseidioms.com/${lang}/sbti/slang`,
      inLanguage: lang,
      hasDefinedTerm: types.map(t => ({
        '@type': 'DefinedTerm',
        name: t.chineseSlangTerm,
        alternateName: t.pinyin,
        description: t.slangMeaning,
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`sbti-slang-${lang}-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/sbti`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI
          </Link>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 px-3 py-1.5 rounded-full mb-4">
            <Languages className="w-3 h-3" />
            中文
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">
            SBTI · 中文 · 27
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            吗喽, 躺平, 佛系青年, 蚌埠住了 — SBTI 27
          </p>
        </header>

        <AdUnit type="display" />

        <section className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">27 · 中文 ·</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[...types].sort((a, b) => (a.pinyin || '').localeCompare(b.pinyin || '')).map(t => (
              <Link
                key={t.code}
                href={`/${lang}/sbti/${typeCodeToSlug(t.code)}#chinese-slang`}
                className="group block bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-red-100 transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl sm:text-3xl font-bold text-red-700 group-hover:text-red-800 transition-colors">{t.chineseSlangTerm}</span>
                      <span className="text-sm text-red-600/70 font-medium">{t.pinyin}</span>
                    </div>
                    <p className="text-sm text-gray-700 font-medium mb-1">{t.slangMeaning}</p>
                    <p className="text-xs text-gray-500">{t.literalMeaning}</p>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded flex-shrink-0">
                    {t.code}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-red-600 text-xs font-medium">
                  <span>→</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <Link
            href={`/${lang}/slang`}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-sm"
          >
            /slang
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-center">
          <Link
            href={`/${lang}/sbti`}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
          >
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
