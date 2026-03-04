import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllCharacterPages, getCharacterPage, getCharacterIdioms, getRelatedCharacters } from '@/src/lib/characters';
import { LANGUAGES, LANGUAGE_CODES } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const characters = getAllCharacterPages();
  const params = [];
  for (const lang of LANGUAGE_CODES) {
    for (const char of characters) {
      params.push({ lang, slug: char.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }): Promise<Metadata> {
  const { slug, lang } = await params;
  const char = getCharacterPage(slug);
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || lang;

  if (!char) {
    return { title: 'Character Not Found' };
  }

  return {
    title: `Chinese Idioms with "${char.character}" (${langName}) - ${char.count} Chengyu`,
    description: `Find ${char.count} Chinese idioms containing ${char.character} in ${langName}. Meanings, pinyin, and examples.`,
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/characters/${slug}`,
      languages: {
        'x-default': `/characters/${slug}`,
        'en': `/characters/${slug}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/characters/${slug}`])
        ),
      },
    },
  };
}

export default async function TranslatedCharacterPage({ params }: { params: Promise<{ slug: string; lang: string }> }) {
  const { slug, lang } = await params;
  const char = getCharacterPage(slug);

  if (!char) {
    notFound();
  }

  const charIdioms = getCharacterIdioms(slug) || [];
  const relatedCharacters = getRelatedCharacters(slug, 8);
  const t = (key: string) => getTranslation(lang, key as keyof typeof import('@/src/lib/translations').translations.en);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/characters`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {t('backToAll') || 'All Characters'}
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-3xl shadow-lg shadow-red-500/20 mb-6">
            <span className="text-white text-5xl font-bold">{char.character}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Chinese Idioms Containing &ldquo;{char.character}&rdquo;
          </h1>
          <p className="text-lg text-gray-600">
            {char.count} idiom{char.count !== 1 ? 's' : ''} featuring this character
          </p>
        </header>

        <AdUnit type="display" />

        <div className="space-y-4">
          {charIdioms.map((idiom, index) => {
            if (!idiom) return null;
            return (
              <div key={idiom.id}>
                {index > 0 && index % 5 === 0 && <AdUnit type="in-article" />}
                <Link
                  href={`/${lang}/blog/${idiom.blogSlug}`}
                  className="group block bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:border-red-100 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2 mb-2">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                          {idiom.characters}
                        </h2>
                        <span className="text-gray-400 text-sm">{idiom.pinyin}</span>
                      </div>
                      <p className="text-blue-600 font-semibold mb-2">{idiom.metaphoric_meaning}</p>
                      <p className="text-gray-500 text-sm">
                        <span className="font-medium text-gray-600">{t('literalMeaning') || 'Literal'}:</span> {idiom.meaning}
                      </p>
                      <div className="mt-3 flex items-center gap-1 text-red-600 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <span>{t('learnMoreArrow') || 'Read full article'}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {relatedCharacters.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Related Characters</h2>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
              {relatedCharacters.map((related) => (
                <Link
                  key={related.character}
                  href={`/${lang}/characters/${related.slug}`}
                  className="group flex flex-col items-center p-3 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-md transition-all"
                >
                  <span className="text-2xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                    {related.character}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">{related.count}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <AdUnit type="multiplex" />
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} {t('footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">{t('footerBuiltBy')}</a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 transition-colors">{t('footerBlog')}</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href={`/${lang}/privacy`} className="text-gray-600 hover:text-gray-900 transition-colors">{t('footerPrivacy')}</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
