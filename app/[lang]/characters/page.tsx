import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllCharacterPages } from '@/src/lib/characters';
import { LANGUAGES, LANGUAGE_CODES } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';

export async function generateStaticParams() {
  return LANGUAGE_CODES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || lang;

  return {
    title: `Browse Chinese Idioms by Character (${langName}) - Chengyu Dictionary`,
    description: `Explore Chinese idioms organized by individual characters in ${langName}. Find all idioms containing a specific Chinese character.`,
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/characters`,
      languages: {
        'x-default': '/characters',
        'en': '/characters',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/characters`])
        ),
      },
    },
  };
}

export default async function TranslatedCharactersIndexPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const characters = getAllCharacterPages();
  const t = (key: string) => getTranslation(lang, key as keyof typeof import('@/src/lib/translations').translations.en);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('charactersTitle')}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl">
            {t('charactersHeroDesc').replace('{count}', String(characters.length))}
          </p>
        </header>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3">
          {characters.map((char) => (
            <Link
              key={char.character}
              href={`/${lang}/characters/${char.slug}`}
              className="group flex flex-col items-center p-4 bg-white rounded-xl border border-gray-100 hover:border-red-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                {char.character}
              </span>
              <span className="text-xs text-gray-500 mt-1">
                {char.count} idiom{char.count !== 1 ? 's' : ''}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100 mt-12">
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
