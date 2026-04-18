import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { loadTranslatedPoems, POEM_THEMES } from '@/src/lib/poems';
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
    title: `Famous Chinese Poems — Classical Poetry with Translations | ${langName}`,
    description: `Explore the greatest Chinese poems with translations in ${langName}. Read Li Bai, Du Fu, Wang Wei with original Chinese, pinyin, and cultural context.`,
    openGraph: {
      title: `Famous Chinese Poems — ${langName}`,
      description: `Classical Chinese poetry with translations in ${langName}.`,
      url: `https://www.chineseidioms.com/${lang}/poems`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/poems`,
      languages: {
        'x-default': '/poems',
        'en': '/poems',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/poems`])
        ),
      },
    },
  };
}

export default async function TranslatedPoemsIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const translatedPoems = loadTranslatedPoems(lang);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';

  // Static structured data from hardcoded poem definitions, not user input
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `Famous Chinese Poems — ${langName}`,
    "url": `https://www.chineseidioms.com/${lang}/poems`,
    "numberOfItems": translatedPoems.length,
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Static JSON-LD from hardcoded poem data, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

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
        <div className="max-w-4xl mx-auto px-6">
          <header className="pt-20 pb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              {getTranslation(lang, 'poemsTitle')}
            </h1>
            <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
              {getTranslation(lang, 'poemsHubSubtitle').replace('{count}', String(translatedPoems.length)).replace('{lang}', langName)}
            </p>
          </header>

          <AdUnit type="display" className="my-8" />

          {POEM_THEMES.map(theme => {
            const themePoems = translatedPoems.filter(p => p.theme === theme);
            if (themePoems.length === 0) return null;
            const displayTheme = themePoems[0].themeTranslated || theme;
            return (
              <section key={theme} className="py-10 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">{displayTheme}</h2>
                <p className="text-sm text-neutral-400 mb-6">{themePoems.length} {getTranslation(lang, 'poemsCount')}</p>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                  {themePoems.map(poem => (
                    <Link
                      key={poem.slug}
                      href={`/${lang}/poems/${poem.originalSlug || poem.slug}`}
                      className="group flex items-start gap-5 px-5 py-4 bg-white hover:bg-neutral-50 transition-colors duration-75"
                    >
                      <div className="shrink-0 w-24 pt-0.5">
                        <p className="font-bold text-neutral-900 text-lg leading-tight group-hover:text-neutral-600 transition-colors duration-75">
                          {poem.titleChinese}
                        </p>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors duration-75">
                          {poem.title}
                        </p>
                        <p className="text-sm text-neutral-400 mt-0.5">
                          {poem.poet.nameChinese} {poem.poet.name} · {poem.poet.dynasty}
                        </p>
                        <p className="text-sm text-neutral-500 mt-1 line-clamp-1">
                          {poem.lines[0].chinese}{poem.lines[1]?.chinese}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}

          <AdUnit type="multiplex" className="my-8" />
        </div>
      </main>

      <footer className="border-t border-neutral-200 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-neutral-400 text-sm">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerBuiltBy')}</a>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerBlog')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/dictionary`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'dictionaryTitle')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href={`/${lang}/privacy`} className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">{getTranslation(lang, 'footerPrivacy')}</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
