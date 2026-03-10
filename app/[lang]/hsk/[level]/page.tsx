import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, GraduationCap } from 'lucide-react';
import { HSK_LEVEL_DESCRIPTIONS, HSK_EXAM_INFO, HSK_LISTICLES, getTranslatedHSKByLevel } from '@/src/lib/hsk';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import { getTranslation } from '@/src/lib/translations';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

const VALID_LEVELS = ['1', '2', '3', '4', '5', '6'];

export async function generateStaticParams() {
  const params = [];
  for (const lang of Object.keys(LANGUAGES)) {
    for (const level of VALID_LEVELS) {
      params.push({ lang, level });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ level: string; lang: string }> }): Promise<Metadata> {
  const { level, lang } = await params;
  const levelNum = parseInt(level);
  const info = HSK_LEVEL_DESCRIPTIONS[levelNum];
  const langName = LANGUAGES[lang as keyof typeof LANGUAGES] || 'English';
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  if (!info) {
    return { title: 'Level Not Found' };
  }

  return {
    title: `HSK ${level} Vocabulary List — ${info.wordCount} (${info.cefrLevel}) | ${langName}`,
    description: `HSK ${level} (${info.cefrLevel}) complete vocabulary list: ${info.wordCount}. ${info.description} Study guide in ${langName}.`,
    keywords: [`HSK ${level}`, `HSK ${level} vocabulary`, `HSK level ${level}`, `HSK ${level} word list`, info.cefrLevel, langName.toLowerCase()],
    openGraph: {
      title: `${getTranslation(lang, 'hskLevel')} ${level}`,
      description: info.description,
      url: `https://www.chineseidioms.com/${lang}/hsk/${level}`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/hsk/${level}`,
      languages: {
        'x-default': `/hsk/${level}`,
        'en': `/hsk/${level}`,
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(l => [l, `/${l}/hsk/${level}`])
        ),
      },
    },
  };
}

export default async function TranslatedHSKLevelPage({ params }: { params: Promise<{ level: string; lang: string }> }) {
  const { level, lang } = await params;
  const levelNum = parseInt(level);
  const info = HSK_LEVEL_DESCRIPTIONS[levelNum];

  if (!info || !VALID_LEVELS.includes(level)) {
    notFound();
  }

  const words = getTranslatedHSKByLevel(levelNum, lang);
  const examInfo = HSK_EXAM_INFO[levelNum];
  const listicles = HSK_LISTICLES[levelNum] || [];

  const colors = [
    'from-green-500 to-emerald-600',
    'from-blue-500 to-indigo-600',
    'from-yellow-500 to-orange-600',
    'from-orange-500 to-red-600',
    'from-red-500 to-pink-600',
    'from-purple-500 to-violet-600',
  ];

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `HSK ${level} Vocabulary`,
      "description": info.description,
      "url": `https://www.chineseidioms.com/${lang}/hsk/${level}`,
      "numberOfItems": words.length,
      "itemListElement": words.map((word, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": `${word.characters} (${word.pinyin})`,
        "description": word.meaning
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": `https://www.chineseidioms.com/${lang}` },
        { "@type": "ListItem", "position": 2, "name": "HSK", "item": `https://www.chineseidioms.com/${lang}/hsk` },
        { "@type": "ListItem", "position": 3, "name": `HSK ${level}`, "item": `https://www.chineseidioms.com/${lang}/hsk/${level}` }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(structuredData)}
      </script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/hsk`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            {getTranslation(lang, 'hskBackToIndex')}
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-12">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              <GraduationCap className="w-4 h-4" />
              {getTranslation(lang, 'hskLevel')} {level}
            </span>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
              {getTranslation(lang, 'hskCEFR')} {info.cefrLevel}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-5 tracking-tight leading-tight">
            {info.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-3xl">
            {info.description} {words.length} {getTranslation(lang, 'hskWords')}.
          </p>
        </header>

        <AdUnit type="display" />

        {/* Word List */}
        <div className="space-y-4">
          {words.map((word, index) => (
            <div key={`${word.characters}-${index}`}>
              {index > 0 && index % 5 === 0 && <AdUnit type="in-article" />}
              <div className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 hover:shadow-md hover:border-emerald-100 transition-all">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 bg-gradient-to-br ${colors[levelNum - 1]} rounded-xl flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-2 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{word.characters}</h2>
                      <span className="text-gray-400 text-base">{word.pinyin}</span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {word.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-emerald-600 mb-3">{word.meaning}</p>
                    {word.examples.map((ex, i) => (
                      <div key={i} className="bg-gray-50 rounded-lg p-3 mb-2">
                        <p className="text-sm text-gray-700">{ex}</p>
                      </div>
                    ))}
                    {word.notes && (
                      <p className="text-xs text-gray-500 italic mt-2">{word.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Reference */}
        <section className="mt-16 bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50 rounded-3xl p-8 sm:p-10 border border-emerald-100/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">{getTranslation(lang, 'quickReference')}</h2>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
            {words.map((word, index) => (
              <div
                key={`ref-${word.characters}-${index}`}
                className="flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-xl p-3 border border-white"
              >
                <span className={`flex-shrink-0 w-7 h-7 bg-gradient-to-br ${colors[levelNum - 1]} rounded-lg flex items-center justify-center text-white font-bold text-xs`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold text-gray-900">{word.characters}</span>
                  <span className="text-gray-300 mx-1.5">·</span>
                  <span className="text-gray-600 text-sm">{word.meaning}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <AdUnit type="multiplex" />

        {/* Exam Prep */}
        {examInfo && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">HSK {level} Exam Format</h2>
            <p className="text-gray-500 mb-8">
              {examInfo.totalQuestions} questions · {examInfo.duration} · Pass: {examInfo.passingScore} · Vocabulary: {examInfo.vocabRequired}
            </p>

            <div className="space-y-4 mb-10">
              {examInfo.sections.map((section) => (
                <div key={section.name} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{section.name}</h3>
                    <span className="text-sm text-gray-400">{section.questions} questions · {section.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{section.tips}</p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 mb-4">Study tips for HSK {level}</h3>
            <ul className="space-y-3">
              {examInfo.studyTips.map((tip, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-600 leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related Listicles */}
        {listicles.length > 0 && (
          <section className="mt-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">HSK {level} Idiom Practice</h2>
            <p className="text-gray-500 mb-6">Chengyu commonly tested at HSK {level} level.</p>
            <div className="space-y-3">
              {listicles.map((listicle) => (
                <Link
                  key={listicle.slug}
                  href={`/${lang}/listicles/${listicle.slug}`}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <span className="font-medium text-gray-900 group-hover:text-emerald-600 transition-colors text-sm">{listicle.title}</span>
                  <ArrowLeft className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 rotate-180 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Other Levels */}
        <section className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{getTranslation(lang, 'hskTitle')}</h2>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {VALID_LEVELS.filter(l => l !== level).map(l => {
              const lNum = parseInt(l);
              const lInfo = HSK_LEVEL_DESCRIPTIONS[lNum];
              return (
                <Link
                  key={l}
                  href={`/${lang}/hsk/${l}`}
                  className="group p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${colors[lNum - 1]} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold">{l}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-sm">{lInfo.title}</p>
                      <p className="text-xs text-gray-500">{lInfo.cefrLevel}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">{getTranslation(lang, 'footerBuiltBy')}</a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-gray-600 hover:text-gray-900 transition-colors">{getTranslation(lang, 'footerBlog')}</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
