import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Search, Layers, ArrowRight } from 'lucide-react'
import { getTranslation, getThemeTranslation } from '@/src/lib/translations'
import { LANGUAGES } from '@/src/lib/constants'
import LanguageSelector from '../components/LanguageSelector'
import { getAllBlogPosts } from '@/src/lib/blog'
import { getAllListicles, getAllListiclesTranslated } from '@/src/lib/listicles'

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({ lang }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';

  const localeMap: { [key: string]: string } = {
    'es': 'es_ES', 'pt': 'pt_BR', 'id': 'id_ID', 'vi': 'vi_VN',
    'ja': 'ja_JP', 'ko': 'ko_KR', 'th': 'th_TH', 'hi': 'hi_IN',
    'ar': 'ar_AR', 'fr': 'fr_FR', 'tl': 'tl_PH', 'ms': 'ms_MY', 'ru': 'ru_RU'
  };

  const ogLocale = localeMap[lang] || 'en_US';
  const alternateLocales = Object.keys(LANGUAGES)
    .filter(l => l !== lang)
    .map(l => localeMap[l] || 'en_US');

  return {
    title: `${getTranslation(lang, 'heroTitle')} | Chinese Idioms (${langName})`,
    description: getTranslation(lang, 'heroDescription'),
    keywords: [
      'chinese idioms', 'chengyu', '成语', 'pinyin', langName,
      `chinese idioms ${langName.toLowerCase()}`,
    ],
    openGraph: {
      title: `${getTranslation(lang, 'heroTitle')} | Chinese Idioms`,
      description: getTranslation(lang, 'heroDescription'),
      url: `https://www.chineseidioms.com/${lang}`,
      siteName: 'Chinese Idioms',
      locale: ogLocale,
      alternateLocale: alternateLocales,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${getTranslation(lang, 'heroTitle')} | Chinese Idioms (${langName})`,
      description: getTranslation(lang, 'heroDescription'),
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}`,
      languages: {
        'x-default': '/',
        'en': '/',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}`])
        ),
      },
    },
  };
}

const THEME_SLUGS = [
  'success-perseverance',
  'life-philosophy',
  'wisdom-learning',
  'relationships-character',
  'strategy-action',
];

const THEME_DISPLAY_NAMES: { [key: string]: string } = {
  'success-perseverance': 'Success & Perseverance',
  'life-philosophy': 'Life Philosophy',
  'wisdom-learning': 'Wisdom & Learning',
  'relationships-character': 'Relationships & Character',
  'strategy-action': 'Strategy & Action',
};

const POPULAR_IDIOMS = [
  { characters: '爱屋及乌', pinyin: 'ai wu ji wu', slug: 'ai-wu-ji-wu' },
  { characters: '莫名其妙', pinyin: 'mo ming qi miao', slug: 'mo-ming-qi-miao' },
  { characters: '七上八下', pinyin: 'qi shang ba xia', slug: 'qi-shang-ba-xia' },
  { characters: '一鸣惊人', pinyin: 'yi ming jing ren', slug: 'yi-ming-jing-ren' },
  { characters: '百折不挠', pinyin: 'bai zhe bu nao', slug: 'bai-zhe-bu-nao' },
  { characters: '知行合一', pinyin: 'zhi xing he yi', slug: 'zhi-xing-he-yi' },
  { characters: '一模一样', pinyin: 'yi mu yi yang', slug: 'yi-mu-yi-yang' },
  { characters: '学海无涯', pinyin: 'xue hai wu ya', slug: 'xue-hai-wu-ya' },
];

const FEATURED_LISTICLE_SLUGS = [
  'chinese-idioms-for-business',
  'chinese-idioms-about-love',
  'chinese-idioms-for-tattoos',
  'chinese-idioms-for-students',
  'chinese-idioms-about-success',
  'funny-chinese-idioms',
];

export default async function InternationalHomePage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  const allPosts = await getAllBlogPosts();
  const allListicles = getAllListicles();

  const translatedListicles = getAllListiclesTranslated(lang);
  const featuredListicles = FEATURED_LISTICLE_SLUGS
    .map(slug => {
      const translated = translatedListicles.find(l => l.originalSlug === slug);
      return translated || allListicles.find(l => l.slug === slug);
    })
    .filter(Boolean);

  const themeCounts = THEME_SLUGS.reduce((acc, theme) => {
    acc[theme] = allPosts.filter(post =>
      post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-') === theme
    ).length;
    return acc;
  }, {} as { [key: string]: number });

  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 via-white to-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,59,48,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              {getTranslation(lang, 'heroTitle')}{' '}
              <span className="text-[#FF3B30] inline-block relative mt-2 lg:mt-3">
                {getTranslation(lang, 'heroSubtitle')}
                <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF3B30]/20 rounded-full"></div>
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mt-6 max-w-2xl mx-auto">
              {getTranslation(lang, 'heroDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href={`/${lang}/dictionary`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D32F2F] text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
              >
                <Search className="w-5 h-5" />
                {getTranslation(lang, 'browseDictionary')}
              </Link>
              <Link
                href={`/${lang}/themes/success-perseverance`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Layers className="w-5 h-5" />
                {getTranslation(lang, 'exploreByTheme')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Theme */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{getTranslation(lang, 'browseByTheme')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {THEME_SLUGS.map((slug) => (
              <Link
                key={slug}
                href={`/${lang}/themes/${slug}`}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all group"
              >
                <p className="font-semibold text-gray-900 group-hover:text-red-700 text-sm">
                  {getThemeTranslation(lang, THEME_DISPLAY_NAMES[slug])}
                </p>
                <p className="text-xs text-red-600 font-medium mt-2">{themeCounts[slug] || 0} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">{getTranslation(lang, 'curatedCollections')}</h2>
            <Link href={`/${lang}/blog/lists`} className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
              {getTranslation(lang, 'viewAllLists')} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredListicles.map((listicle) => (
              <Link
                key={listicle!.slug}
                href={`/${lang}/blog/lists/${listicle!.slug}`}
                className="p-5 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{listicle!.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{listicle!.description}</p>
                <p className="text-xs text-red-600 font-medium mt-3">{listicle!.idiomIds.length} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Searched Idioms */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">{getTranslation(lang, 'mostSearchedTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_IDIOMS.map((idiom) => (
              <Link key={idiom.slug} href={`/${lang}/blog/${idiom.slug}`} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all border border-gray-100 hover:border-red-200">
                <p className="font-bold text-gray-900 text-lg">{idiom.characters}</p>
                <p className="text-sm text-gray-500">{idiom.pinyin}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href={`/${lang}/dictionary`} className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center gap-1">
              {getTranslation(lang, 'browseDictionary')} ({allPosts.length}+) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* App Promo - Compact */}
      <section className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            <div className="text-center sm:text-left">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2 justify-center sm:justify-start">
                <BookOpen className="w-5 h-5 text-[#FF3B30]" />
                {getTranslation(lang, 'learnOnTheGo')}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {getTranslation(lang, 'appPromoDesc')}
              </p>
            </div>
            <a
              href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity shrink-0"
              aria-label={getTranslation(lang, 'downloadAppStore')}
            >
              <Image
                src="/app-store-badge.svg"
                alt={getTranslation(lang, 'downloadAppStore')}
                width={140}
                height={47}
                className="w-36"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} {getTranslation(lang, 'footerCopyright')}</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {getTranslation(lang, 'footerBuiltBy')}
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 transition-colors">
                {getTranslation(lang, 'footerBlog')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href={`/${lang}/privacy`} className="text-gray-600 hover:text-gray-900 transition-colors">
                {getTranslation(lang, 'footerPrivacy')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
