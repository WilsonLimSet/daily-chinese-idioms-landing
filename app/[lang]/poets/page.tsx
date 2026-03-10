import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { getPoetPoems, loadTranslatedPoets } from '@/src/lib/poets';
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
    title: `Famous Chinese Poets — Biographies & Poems | ${langName}`,
    description: `Discover the greatest Chinese poets with biographies and poems translated in ${langName}.`,
    openGraph: {
      title: `Famous Chinese Poets — ${langName}`,
      url: `https://www.chineseidioms.com/${lang}/poets`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/poets`,
      languages: {
        'x-default': '/poets',
        'en': '/poets',
        ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `/${l}/poets`])),
      },
    },
  };
}

export default async function TranslatedPoetsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const poets = loadTranslatedPoets(lang);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <nav className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            {getTranslation(lang, 'home') || 'Home'}
          </Link>
          <LanguageSelector dropdownPosition="down" currentLang={lang} />
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-6">
          <header className="pt-20 pb-16 text-center">
            <p className="text-sm font-medium text-amber-600 tracking-widest uppercase mb-4">Tang Dynasty Masters</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              Famous Chinese Poets
            </h1>
            <p className="text-lg text-neutral-500 mt-5 max-w-xl mx-auto leading-relaxed">
              The golden age of Chinese poetry. Biographies and poems in {langName}.
            </p>
          </header>

          {/* Social proof grid — prominent Chinese names */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-16">
            {poets.map(poet => (
              <Link
                key={poet.slug}
                href={`/${lang}/poets/${poet.originalSlug || poet.slug}`}
                className="group relative text-center py-6 px-3 rounded-xl border border-neutral-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all duration-150"
              >
                <p className="text-3xl sm:text-4xl font-bold text-neutral-900 group-hover:text-amber-700 transition-colors duration-150">
                  {poet.nameChinese}
                </p>
                <p className="text-sm text-neutral-600 mt-2 font-medium">{poet.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{poet.birthYear}–{poet.deathYear}</p>
              </Link>
            ))}
          </div>

          <AdUnit type="display" className="my-8" />

          {/* Detailed poet cards */}
          <div className="space-y-5 pb-12">
            {poets.map(poet => {
              const poemCount = getPoetPoems(poet.name).length;
              return (
                <Link
                  key={poet.slug}
                  href={`/${lang}/poets/${poet.originalSlug || poet.slug}`}
                  className="group block rounded-xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all duration-75 overflow-hidden"
                >
                  <div className="flex">
                    <div className="hidden sm:flex items-center justify-center w-28 shrink-0 bg-neutral-50 group-hover:bg-amber-50 border-r border-neutral-200 transition-colors duration-150">
                      <span className="text-4xl font-bold text-neutral-800 group-hover:text-amber-700 transition-colors duration-150">{poet.nameChinese}</span>
                    </div>
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h2 className="text-lg font-bold text-neutral-900 group-hover:text-neutral-600 transition-colors duration-75">
                              {poet.name}
                            </h2>
                            <span className="sm:hidden text-lg text-neutral-400">{poet.nameChinese}</span>
                            <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">{poet.title}</span>
                          </div>
                          <p className="text-xs text-neutral-400 mt-1">{poet.dynasty} · {poet.birthYear}–{poet.deathYear} · {poemCount} poem{poemCount !== 1 ? 's' : ''}</p>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 mt-0.5 transition-colors duration-75" />
                      </div>
                      {poet.famousLines[0] && (
                        <div className="mt-3 flex gap-3 items-start">
                          <div className="w-0.5 shrink-0 self-stretch bg-amber-200 rounded-full" />
                          <div>
                            <p className="text-neutral-800 font-medium text-sm">{poet.famousLines[0].chinese}</p>
                            <p className="text-neutral-500 italic text-xs mt-1">{poet.famousLines[0].english}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <AdUnit type="multiplex" className="mb-8" />
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-neutral-300">&bull;</span>
            <Link href={`/${lang}/poems`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Poems</Link>
            <span className="hidden sm:inline text-neutral-300">&bull;</span>
            <Link href={`/${lang}/blog`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Blog</Link>
            <span className="hidden sm:inline text-neutral-300">&bull;</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
