import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllPoems, POEM_THEMES, getUniquePoets } from '@/src/lib/poems';
import { LANGUAGES } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'Famous Chinese Poems — Classical Poetry with Translations & Pinyin',
  description: 'Explore the greatest Chinese poems ever written. Read Li Bai, Du Fu, Wang Wei, and more with original Chinese, pinyin, English translations, and historical context.',
  keywords: ['chinese poems', 'tang dynasty poetry', 'li bai poems', 'du fu poems', 'classical chinese poetry', 'chinese poetry translation', 'famous chinese poems'],
  openGraph: {
    title: 'Famous Chinese Poems — Classical Poetry with Translations & Pinyin',
    description: 'Explore the greatest Chinese poems ever written with original Chinese, pinyin, English translations, and historical context.',
    url: 'https://www.chineseidioms.com/poems',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/poems',
    languages: {
      'x-default': '/poems',
      'en': '/poems',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/poems`])
      ),
    },
  },
};

export default function PoemsIndexPage() {
  const allPoems = getAllPoems();
  const poets = getUniquePoets();

  // Static structured data from hardcoded poem definitions, not user input
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Famous Chinese Poems",
      "description": "A collection of the greatest classical Chinese poems with translations, pinyin, and analysis.",
      "url": "https://www.chineseidioms.com/poems",
      "numberOfItems": allPoems.length,
      "hasPart": allPoems.map(poem => ({
        "@type": "CreativeWork",
        "name": `${poem.titleChinese} — ${poem.title}`,
        "author": { "@type": "Person", "name": poem.poet.name },
        "url": `https://www.chineseidioms.com/poems/${poem.slug}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.chineseidioms.com" },
        { "@type": "ListItem", "position": 2, "name": "Poems", "item": "https://www.chineseidioms.com/poems" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Static JSON-LD from hardcoded poem data, not user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Nav */}
      <nav className="border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-600 text-sm transition-colors duration-75">
            <ArrowLeft className="w-3.5 h-3.5" />
            Home
          </Link>
          <LanguageSelector dropdownPosition="down" currentLang="en" />
        </div>
      </nav>

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <header className="pt-20 pb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 tracking-tight leading-[1.1]">
              Famous Chinese Poems
            </h1>
            <p className="text-lg text-neutral-500 mt-4 max-w-2xl leading-relaxed">
              {allPoems.length} iconic poems from the Tang Dynasty and beyond. Read the original Chinese with pinyin, English translations, and cultural context.
            </p>
          </header>

          {/* Poets overview */}
          <section className="pb-10 border-b border-neutral-200">
            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Featured Poets</h2>
            <div className="flex flex-wrap gap-2">
              {poets.map(poet => {
                const count = allPoems.filter(p => p.poet.name === poet.name).length;
                return (
                  <span
                    key={poet.name}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 rounded-full text-sm"
                  >
                    <span className="font-medium text-neutral-900">{poet.nameChinese}</span>
                    <span className="text-neutral-400">{poet.name}</span>
                    <span className="text-xs text-neutral-300">({count})</span>
                  </span>
                );
              })}
            </div>
          </section>

          <AdUnit type="display" className="my-8" />

          {/* Poems by theme */}
          {POEM_THEMES.map(theme => {
            const themePoems = allPoems.filter(p => p.theme === theme);
            if (themePoems.length === 0) return null;
            return (
              <section key={theme} className="py-10 border-b border-neutral-200">
                <h2 className="text-lg font-semibold text-neutral-900 mb-1">{theme}</h2>
                <p className="text-sm text-neutral-400 mb-6">{themePoems.length} poems</p>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden">
                  {themePoems.map(poem => (
                    <Link
                      key={poem.slug}
                      href={`/poems/${poem.slug}`}
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
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Built by Wilson</a>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/blog" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Blog</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/dictionary" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Dictionary</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <Link href="/privacy" className="text-neutral-400 hover:text-neutral-600 text-sm transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-neutral-300">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
