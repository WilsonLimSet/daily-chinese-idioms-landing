import Image from 'next/image'
import Link from 'next/link'
import { Star, Shield, BookOpen } from 'lucide-react'
import { getTranslation } from '@/src/lib/translations'
import { LANGUAGES } from '@/src/lib/constants'
import LanguageSelector from '../components/LanguageSelector'

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

  return {
    title: `${getTranslation(lang, 'heroTitle')} | Chinese Idioms (${langName})`,
    description: getTranslation(lang, 'heroDescription'),
    keywords: [
      'chinese idioms',
      'chengyu',
      '成语',
      'pinyin',
      langName,
      `chinese idioms ${langName.toLowerCase()}`,
    ],
    alternates: {
      languages: {
        'en': '/',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}`])
        ),
      },
    },
  };
}

export default async function InternationalHomePage({
  params
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params;
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Enhanced Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-red-50 via-white to-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,59,48,0.1),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  {getTranslation(lang, 'heroTitle')}{' '}
                  <span className="text-[#FF3B30] inline-block relative mt-2 lg:mt-3">
                    {getTranslation(lang, 'heroSubtitle')}
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF3B30]/20 rounded-full"></div>
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {getTranslation(lang, 'heroDescription')}
                </p>
                <div className="pt-4">
                  <a
                    href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg"
                    aria-label={getTranslation(lang, 'downloadAppStore')}
                  >
                    <Image
                      src="/app-store-badge.svg"
                      alt={getTranslation(lang, 'downloadAppStore')}
                      width={160}
                      height={53}
                      priority
                      className="w-40"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div
                  className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-300/30 blur-3xl rounded-full animate-pulse"
                  style={{ animationDuration: '4s' }}
                />
                <div className="relative flex justify-center items-center gap-4 perspective-1000">
                  <div className="transform-gpu transition-all duration-300 hover:scale-105 hover:-rotate-2 hover:shadow-2xl">
                    <Image
                      src="/app-screenshot.jpeg"
                      alt="Daily Chinese Idioms app interface showing detailed view of an idiom with its meaning and usage"
                      width={280}
                      height={560}
                      className="rounded-3xl shadow-xl"
                      priority
                    />
                  </div>
                  <div className="transform-gpu transition-all duration-300 hover:scale-105 hover:rotate-2 hover:shadow-2xl">
                    <Image
                      src="/widget-screenshot.jpeg"
                      alt="Home screen widget showcase displaying different sizes of Daily Chinese Idioms widgets"
                      width={280}
                      height={560}
                      className="rounded-3xl shadow-xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Idioms Section - Internal Linking */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {getTranslation(lang, 'mostSearchedTitle')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href={`/${lang}/blog/2025-02-25-ai-wu-ji-wu`} className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900">爱屋及乌</p>
              <p className="text-sm text-gray-600">ai wu ji wu</p>
              <p className="text-xs text-blue-600 mt-1">{getTranslation(lang, 'idiom1')}</p>
            </Link>
            <Link href={`/${lang}/blog/2025-02-10-mo-ming-qi-miao`} className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900">莫名其妙</p>
              <p className="text-sm text-gray-600">mo ming qi miao</p>
              <p className="text-xs text-blue-600 mt-1">{getTranslation(lang, 'idiom2')}</p>
            </Link>
            <Link href={`/${lang}/blog/2025-08-08-qi-shang-ba-xia`} className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900">七上八下</p>
              <p className="text-sm text-gray-600">qi shang ba xia</p>
              <p className="text-xs text-blue-600 mt-1">{getTranslation(lang, 'idiom3')}</p>
            </Link>
            <Link href={`/${lang}/blog`} className="p-3 bg-blue-50 border-2 border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center">
              <p className="text-blue-700 font-semibold">{getTranslation(lang, 'browseAllIdioms')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="bg-white py-16 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            {getTranslation(lang, 'learnDailyTitle')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="mb-4 transform-gpu transition-transform duration-300 group-hover:scale-110">
                <Star className="w-8 h-8 text-[#FF3B30]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900 transition-colors">
                {getTranslation(lang, 'widgetTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {getTranslation(lang, 'widgetDesc')}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="mb-4 transform-gpu transition-transform duration-300 group-hover:scale-110">
                <Shield className="w-8 h-8 text-[#FF3B30]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900 transition-colors">
                {getTranslation(lang, 'offlineTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {getTranslation(lang, 'offlineDesc')}
              </p>
            </div>
            <div className="p-6 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="mb-4 transform-gpu transition-transform duration-300 group-hover:scale-110">
                <BookOpen className="w-8 h-8 text-[#FF3B30]" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900 transition-colors">
                {getTranslation(lang, 'dailyUpdatesTitle')}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {getTranslation(lang, 'dailyUpdatesDesc')}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Enhanced Footer */}
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
              <Link
                href={`/${lang}/blog`}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                {getTranslation(lang, 'footerBlog')}
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
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