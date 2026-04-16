import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Briefcase,
  Star,
  Users,
  BookOpen,
  Languages,
} from 'lucide-react';
import {
  getAllSbtiTypes,
  getSbtiType,
  typeCodeToSlug,
  getRelatedSbtiTypes,
} from '@/src/lib/sbti';
import { getListicleWithIdiomsTranslated } from '@/src/lib/listicles';
import { LANGUAGES, LOCALE_MAP, LANGUAGE_CONFIG } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  const params = [];
  for (const lang of Object.keys(LANGUAGES)) {
    for (const t of getAllSbtiTypes(lang)) {
      params.push({ lang, type: typeCodeToSlug(t.code) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}): Promise<Metadata> {
  const { lang, type } = await params;
  const sbti = getSbtiType(type, lang);
  if (!sbti) return { title: 'SBTI Type Not Found' };

  const langName = LANGUAGES[lang as keyof typeof LANGUAGES];
  const nativeName = LANGUAGE_CONFIG[lang as keyof typeof LANGUAGE_CONFIG]?.nativeName || langName;
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';

  const canonical = `https://www.chineseidioms.com/${lang}/sbti/${type}`;
  const languageAlternates: Record<string, string> = {
    'x-default': `/sbti/${type}`,
    en: `/sbti/${type}`,
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti/${type}`;
  }

  return {
    title: `${sbti.metaTitle} | ${nativeName}`,
    description: sbti.metaDescription,
    keywords: sbti.keywords.join(', '),
    openGraph: {
      title: sbti.metaTitle,
      description: sbti.metaDescription,
      url: canonical,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: sbti.metaTitle,
      description: sbti.metaDescription,
    },
    alternates: { canonical, languages: languageAlternates },
  };
}

export default async function LocalizedSbtiTypePage({
  params,
}: {
  params: Promise<{ lang: string; type: string }>;
}) {
  const { lang, type } = await params;
  const sbti = getSbtiType(type, lang);
  if (!sbti) notFound();

  const related = getRelatedSbtiTypes(sbti.code, lang);

  // Localized idiom listicle for this type (slug lookup is by original English slug)
  const englishListicleSlug = `sbti-${type}-personality-chinese-idioms`;
  const listicle = getListicleWithIdiomsTranslated(englishListicleSlug, lang);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: sbti.metaTitle,
      description: sbti.metaDescription,
      author: { '@type': 'Organization', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
      publisher: {
        '@type': 'Organization',
        name: 'Chinese Idioms',
        logo: { '@type': 'ImageObject', url: 'https://www.chineseidioms.com/icon.png' },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://www.chineseidioms.com/${lang}/sbti/${type}`,
      },
      inLanguage: lang,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: `SBTI ${sbti.code}?`,
          acceptedAnswer: { '@type': 'Answer', text: sbti.overview },
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: `https://www.chineseidioms.com/${lang}/sbti` },
        {
          '@type': 'ListItem',
          position: 3,
          name: `SBTI ${sbti.code}`,
          item: `https://www.chineseidioms.com/${lang}/sbti/${type}`,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Script id={`sbti-${lang}-${type}-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href={`/${lang}/sbti`} className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            SBTI
          </Link>
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-500">
          <Link href={`/${lang}`} className="hover:text-gray-900">Home</Link>
          <span className="mx-2">/</span>
          <Link href={`/${lang}/sbti`} className="hover:text-gray-900">SBTI</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{sbti.code}</span>
        </nav>

        <header className="mb-10">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3 h-3" />
            <span>SBTI {sbti.code}</span>
            {sbti.special && <span className="ml-1 text-orange-600">★</span>}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">
            SBTI {sbti.code}: {sbti.displayName}
          </h1>
          <p className="text-xl text-gray-700 font-medium mb-4">{sbti.tagline}</p>
          <p className="text-sm text-gray-500">
            {sbti.chineseOrigin}
            <span className="mx-2">·</span>
            {sbti.coreVibe}
          </p>
        </header>

        <AdUnit type="display" />

        <section id="overview" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">SBTI {sbti.code}</h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line">
            {sbti.overview}
          </p>
        </section>

        {sbti.chineseSlangTerm && (
          <section id="chinese-slang" className="mb-12 bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-red-100">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-700 bg-white/80 px-3 py-1.5 rounded-full mb-4">
              <Languages className="w-3 h-3" />
              中文
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              {sbti.code} · <span className="text-red-700">{sbti.chineseSlangTerm}</span>
            </h2>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-5 sm:p-6 mb-6 border border-red-100/50">
              <div className="flex flex-wrap items-baseline gap-3 mb-3">
                <span className="text-4xl sm:text-5xl font-bold text-red-700">{sbti.chineseSlangTerm}</span>
                {sbti.pinyin && <span className="text-xl text-red-600/70 font-medium">{sbti.pinyin}</span>}
              </div>
              {sbti.literalMeaning && (
                <p className="text-sm text-gray-600 mb-2">{sbti.literalMeaning}</p>
              )}
              {sbti.slangMeaning && (
                <p className="text-sm text-gray-600">{sbti.slangMeaning}</p>
              )}
            </div>

            {sbti.slangOriginStory && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{sbti.chineseSlangTerm}</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{sbti.slangOriginStory}</p>
              </>
            )}

            {sbti.slangUsageToday && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{sbti.chineseSlangTerm} · 2026</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{sbti.slangUsageToday}</p>
              </>
            )}

            {sbti.whyItBecameSbtiType && (
              <div className="bg-white/60 rounded-xl p-4 border border-red-100/50 mb-6">
                <p className="text-sm text-gray-700 leading-relaxed">{sbti.whyItBecameSbtiType}</p>
              </div>
            )}

            {sbti.relatedSlang && sbti.relatedSlang.length > 0 && (
              <>
                <h3 className="text-xl font-bold text-gray-900 mb-3">·</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {sbti.relatedSlang.map((rel, i) => (
                    <div key={i} className="bg-white/70 rounded-xl p-4 border border-red-100/50">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-xl font-bold text-red-700">{rel.term}</span>
                        <span className="text-sm text-red-600/70">{rel.pinyin}</span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium mb-1">{rel.meaning}</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{rel.relationship}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <section id="traits" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{sbti.displayName}</h2>
          <ul className="space-y-3">
            {sbti.traits.map((trait, i) => (
              <li key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <Star className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{trait}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="strengths-weaknesses" className="mb-12 grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> ✓
            </h3>
            <ul className="space-y-2">
              {sbti.strengths.map((s, i) => (
                <li key={i} className="text-green-900/80 text-sm leading-relaxed">
                  <span className="font-bold text-green-700">+</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100">
            <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> ⚠
            </h3>
            <ul className="space-y-2">
              {sbti.weaknesses.map((w, i) => (
                <li key={i} className="text-amber-900/80 text-sm leading-relaxed">
                  <span className="font-bold text-amber-700">−</span> {w}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <AdUnit type="in-article" />

        <section id="recognition" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">SBTI {sbti.code}?</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {sbti.recognitionSignals.map((sig, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </div>
                <span className="text-gray-700 text-sm leading-relaxed">{sig}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="relationships" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" /> SBTI {sbti.code}
          </h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{sbti.inRelationships}</p>
        </section>

        <section id="career" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-blue-500" /> SBTI {sbti.code}
          </h2>
          <p className="text-gray-700 leading-relaxed text-base sm:text-lg">{sbti.careerFit}</p>
        </section>

        <section id="famous" className="mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-500" /> SBTI {sbti.code}
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {sbti.famousExamples.map((ex, i) => (
              <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">{ex}</p>
              </div>
            ))}
          </div>
        </section>

        {(sbti.compatibleTypes.length > 0 || sbti.incompatibleTypes.length > 0) && (
          <section id="compatibility" className="mb-12 grid md:grid-cols-2 gap-6">
            {sbti.compatibleTypes.length > 0 && (
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                <h3 className="text-xl font-bold text-rose-900 mb-3">✓</h3>
                <div className="flex flex-wrap gap-2">
                  {sbti.compatibleTypes.map(code => (
                    <Link key={code} href={`/${lang}/sbti/${typeCodeToSlug(code)}`} className="text-sm font-bold text-rose-700 bg-white px-3 py-1.5 rounded-full border border-rose-200 hover:bg-rose-100 transition-colors">
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {sbti.incompatibleTypes.length > 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-3">⚠</h3>
                <div className="flex flex-wrap gap-2">
                  {sbti.incompatibleTypes.map(code => (
                    <Link key={code} href={`/${lang}/sbti/${typeCodeToSlug(code)}`} className="text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                      {code}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section id="how-to-get" className="mb-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-900 mb-3">SBTI {sbti.code}</h2>
          <p className="text-indigo-900/80 leading-relaxed">{sbti.howToGetThisType}</p>
          <Link
            href={`/${lang}/sbti/${type}/how-to-get`}
            className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-indigo-700 hover:text-indigo-900 transition-colors"
          >
            {sbti.code} →
          </Link>
        </section>

        <AdUnit type="in-article" />

        {listicle && listicle.idioms && listicle.idioms.length > 0 && (
          <section id="chinese-idioms" className="mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-red-500" /> {sbti.code} · 成语
            </h2>
            <div className="space-y-4">
              {listicle.idioms.slice(0, 5).map((item) => {
                if (!item.idiom) return null;
                return (
                  <div key={item.idiom.id} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-900">{item.idiom.characters}</span>
                      <span className="text-gray-500">{item.idiom.pinyin}</span>
                    </div>
                    <p className="text-indigo-600 font-semibold mb-2">{item.idiom.metaphoric_meaning}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.idiom.description.substring(0, 240)}...</p>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mb-16 pt-10 border-t border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">SBTI</h2>
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {related.map(t => (
                <Link
                  key={t.code}
                  href={`/${lang}/sbti/${typeCodeToSlug(t.code)}`}
                  className="group block bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-xl hover:border-indigo-100 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                      {t.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">{t.displayName}</h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.coreVibe}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">SBTI</h2>
          <Link
            href={`/${lang}/sbti`}
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 hover:scale-105 transition-all duration-200 shadow-xl"
          >
            →
            <ChevronRight className="w-5 h-5" />
          </Link>
        </section>
      </article>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link href={`/${lang}/sbti`} className="text-gray-600 hover:text-gray-900">SBTI</Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang={lang} />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
