import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Heart, Trophy, Shield, GraduationCap, Scale } from 'lucide-react';
import { getProverbListiclesGrouped, type ProverbGroupKey, type TranslatedListicle, type Listicle } from '@/src/lib/listicles';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import { getTranslation, translations } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';

type TKey = keyof typeof translations.en;

const GROUP_ICON: Record<ProverbGroupKey, typeof BookOpen> = {
  'life-wisdom': BookOpen,
  'love-relationships': Heart,
  'success-motivation': Trophy,
  'strength-character': Shield,
  'study-learning': GraduationCap,
  'reference': Scale,
};

const GROUP_TITLE_KEY: Record<ProverbGroupKey, TKey> = {
  'life-wisdom': 'proverbGroupLifeWisdom',
  'love-relationships': 'proverbGroupLoveRelationships',
  'success-motivation': 'proverbGroupSuccessMotivation',
  'strength-character': 'proverbGroupStrengthCharacter',
  'study-learning': 'proverbGroupStudyLearning',
  'reference': 'proverbGroupReference',
};

const GROUP_DESC_KEY: Record<ProverbGroupKey, TKey> = {
  'life-wisdom': 'proverbGroupLifeWisdomDesc',
  'love-relationships': 'proverbGroupLoveRelationshipsDesc',
  'success-motivation': 'proverbGroupSuccessMotivationDesc',
  'strength-character': 'proverbGroupStrengthCharacterDesc',
  'study-learning': 'proverbGroupStudyLearningDesc',
  'reference': 'proverbGroupReferenceDesc',
};

const FAQ_KEYS: Array<{ q: TKey; a: TKey }> = [
  { q: 'proverbsFaq1Q', a: 'proverbsFaq1A' },
  { q: 'proverbsFaq2Q', a: 'proverbsFaq2A' },
  { q: 'proverbsFaq3Q', a: 'proverbsFaq3A' },
  { q: 'proverbsFaq4Q', a: 'proverbsFaq4A' },
  { q: 'proverbsFaq5Q', a: 'proverbsFaq5A' },
  { q: 'proverbsFaq6Q', a: 'proverbsFaq6A' },
];

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';
  const t = (key: TKey) => getTranslation(lang, key);

  return {
    title: `${t('proverbsTitle')} | ${nativeName}`,
    description: t('proverbsSubtitle'),
    keywords: [
      'chinese proverbs',
      'chinese sayings',
      'chinese wisdom',
      '谚语',
      nativeName.toLowerCase(),
    ],
    openGraph: {
      title: t('proverbsTitle'),
      description: t('proverbsSubtitle'),
      url: `https://www.chineseidioms.com/${lang}/proverbs`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/proverbs`,
      languages: {
        'x-default': 'https://www.chineseidioms.com/proverbs',
        'en': 'https://www.chineseidioms.com/proverbs',
        ...Object.fromEntries(Object.keys(LANGUAGES).map(l => [l, `https://www.chineseidioms.com/${l}/proverbs`])),
      },
    },
  };
}

export default async function TranslatedProverbsHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const t = (key: TKey) => getTranslation(lang, key);
  const groups = getProverbListiclesGrouped(lang);
  const totalListicles = groups.reduce((sum, g) => sum + g.listicles.length, 0);

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: t('proverbsTitle'),
    description: t('proverbsSubtitle'),
    url: `https://www.chineseidioms.com/${lang}/proverbs`,
    inLanguage: lang,
    isPartOf: { '@type': 'WebSite', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: t('proverbsBreadcrumb'), item: `https://www.chineseidioms.com/${lang}/proverbs` },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalListicles,
      itemListElement: groups.flatMap((g, gi) =>
        g.listicles.map((l, li) => ({
          '@type': 'ListItem',
          position: gi * 100 + li + 1,
          name: l.title,
          url: `https://www.chineseidioms.com/${lang}/blog/lists/${l.slug}`,
        })),
      ),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map(({ q, a }) => ({
      '@type': 'Question',
      name: t(q),
      acceptedAnswer: { '@type': 'Answer', text: t(a) },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}`} className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            {t('backToHome')}
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{t('proverbsTitle')}</h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">{t('proverbsSubtitle')}</p>
          <p className="text-lg text-gray-600 max-w-3xl mt-4 leading-relaxed">{t('proverbsHeroDesc')}</p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('proverbsExplainerTitle')}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{t('proverbsExplainerBody')}</p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('proverbsDirectoryTitle')}</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">{t('proverbsDirectoryDesc')}</p>

          <div className="space-y-12">
            {groups.map(({ key, listicles }) => {
              if (listicles.length === 0) return null;
              const Icon = GROUP_ICON[key];
              return (
                <div key={key}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{t(GROUP_TITLE_KEY[key])}</h3>
                      <p className="text-gray-600 mt-1 max-w-2xl">{t(GROUP_DESC_KEY[key])}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {listicles.map((l: Listicle | TranslatedListicle) => (
                      <Link
                        key={l.slug}
                        href={`/${lang}/blog/lists/${l.slug}`}
                        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:border-red-200"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">{l.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{l.description}</p>
                        <p className="text-red-600 text-sm mt-4 font-medium">
                          {l.idiomIds.length} idioms →
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 pt-8 border-t">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('proverbsFaqTitle')}</h2>
          <div className="space-y-6 max-w-3xl">
            {FAQ_KEYS.map(({ q, a }) => (
              <div key={q}>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{t(q)}</h3>
                <p className="text-gray-700 leading-relaxed">{t(a)}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} {t('footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                {t('footerBuiltBy')}
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 transition-colors">{t('footerBlog')}</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href={`/${lang}/blog/lists`} className="text-gray-600 hover:text-gray-900 transition-colors">{t('curatedLists')}</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
