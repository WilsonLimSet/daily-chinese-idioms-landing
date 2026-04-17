import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllSbtiTypes, typeCodeToSlug } from '@/src/lib/sbti';
import { getQuiz } from '@/src/lib/sbti-quiz';
import { LANGUAGES, LOCALE_MAP } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export async function generateStaticParams() {
  return Object.keys(LANGUAGES).map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) return { title: 'Not found' };
  const ogLocale = LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US';
  const quiz = getQuiz(lang);

  const languageAlternates: Record<string, string> = {
    'x-default': '/sbti',
    en: '/sbti',
  };
  for (const l of Object.keys(LANGUAGES)) {
    languageAlternates[l] = `/${l}/sbti`;
  }

  return {
    title: quiz.ui.seoHubTitle,
    description: quiz.ui.seoHubDescription,
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/sbti`,
      languages: languageAlternates,
    },
    openGraph: {
      title: quiz.ui.seoHubTitle,
      description: quiz.ui.seoHubDescription,
      url: `https://www.chineseidioms.com/${lang}/sbti`,
      siteName: 'Chinese Idioms',
      locale: ogLocale.replace('-', '_'),
      type: 'website',
    },
  };
}

export default async function LocalizedSbtiHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!(lang in LANGUAGES)) notFound();

  const types = getAllSbtiTypes(lang);
  const regular = types.filter(t => !t.special);
  const special = types.filter(t => t.special);
  const quiz = getQuiz(lang);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'SBTI Personality Test — All 27 Types',
      url: `https://www.chineseidioms.com/${lang}/sbti`,
      inLanguage: lang,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: types.length,
        itemListElement: types.map((t, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `SBTI ${t.code} — ${t.displayName}`,
          url: `https://www.chineseidioms.com/${lang}/sbti/${typeCodeToSlug(t.code)}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
        { '@type': 'ListItem', position: 2, name: 'SBTI', item: `https://www.chineseidioms.com/${lang}/sbti` },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Script id={`sbti-${lang}-hub-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-end pr-4"
        >
          <span className="text-[28vw] font-bold leading-none tracking-tight text-white/[0.035] md:text-[22rem]">
            SBTI
          </span>
        </div>

        <nav className="relative mx-auto max-w-5xl px-6 pt-6">
          <Link
            href={`/${lang}`}
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {quiz.ui.hubHomeLabel}
          </Link>
        </nav>

        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16 md:pt-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
            {quiz.ui.kicker}
          </p>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {quiz.ui.titleLine1}
            <br />
            <span className="text-red-400">{quiz.ui.titleLine2}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/60">
            {quiz.meta.subtitle}
          </p>

          {/* Type quick nav */}
          <div className="mt-12 flex flex-wrap gap-2">
            {regular.slice(0, 10).map(t => (
              <a
                key={t.code}
                href={`#${t.code.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
                className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.05] px-3 py-1.5 text-sm transition-all hover:border-white/[0.15] hover:bg-white/[0.1]"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-red-300">
                  {t.code}
                </span>
                <span className="text-white/60 group-hover:text-white/80">{t.displayName}</span>
              </a>
            ))}
            <span className="inline-flex items-center px-2 text-xs text-white/40">
              +{regular.length - 10 + special.length}
            </span>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                {quiz.ui.hubCtaKicker}
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">
                {quiz.ui.hubCtaTitle}
              </p>
              <p className="mt-1 text-sm text-gray-500">{quiz.ui.hubCtaBullets}</p>
            </div>
            <Link
              href={`/${lang}/sbti/test`}
              className="group inline-flex shrink-0 items-center gap-2 rounded-lg bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              {quiz.ui.begin}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
          {/* Regular types */}
          <article className="mb-20">
            <div className="mb-10 flex items-start gap-6 sm:gap-8">
              <div className="hidden w-24 shrink-0 pt-1 sm:block">
                <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">25</p>
              </div>
              <div className="min-w-0 flex-1">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  {quiz.ui.hubCatalogueKicker}
                </p>
                <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                  {quiz.ui.hubAllTypesHeading}
                </h2>
                <p className="mt-1 text-gray-500">{quiz.ui.hubAllTypesSub}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:ml-32 sm:grid-cols-2 lg:grid-cols-3">
              {regular.map(t => {
                const anchor = t.code.toLowerCase().replace(/[^a-z0-9]/g, '');
                return (
                  <Link
                    key={t.code}
                    href={`/${lang}/sbti/${typeCodeToSlug(t.code)}`}
                    id={anchor}
                    className="group flex h-full flex-col justify-between rounded-lg border border-gray-200/80 bg-white p-5 transition hover:border-red-200 hover:shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-red-400" />
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-red-500">
                          {t.code}
                        </span>
                      </div>
                      <h3 className="mt-2 font-bold leading-snug text-gray-900">
                        {t.displayName}
                      </h3>
                      <p className="mt-1 text-sm leading-[1.5] text-gray-500">
                        {t.tagline || t.coreVibe}
                      </p>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 transition-colors group-hover:text-red-500">
                      <span>{quiz.ui.hubReadMore}</span>
                      <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </article>

          {/* Special types */}
          {special.length > 0 && (
            <article className="mb-20">
              <div className="mb-10 flex items-start gap-6 sm:gap-8">
                <div className="hidden w-24 shrink-0 pt-1 sm:block">
                  <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">02</p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                    {quiz.ui.hubSpecialKicker}
                  </p>
                  <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                    {quiz.ui.hubSpecialTypesHeading}
                  </h2>
                  <p className="mt-1 text-gray-500">{quiz.ui.hubSpecialTypesSub}</p>
                </div>
              </div>
              <div className="grid gap-4 sm:ml-32 md:grid-cols-2">
                {special.map(t => (
                  <Link
                    key={t.code}
                    href={`/${lang}/sbti/${typeCodeToSlug(t.code)}`}
                    className="relative overflow-hidden rounded-xl bg-gray-950 p-6 transition hover:bg-gray-900"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute -top-4 -right-4 select-none font-serif text-[100px] leading-none text-white/[0.05]"
                    >
                      {t.code === 'HHHH' ? '?' : '!'}
                    </div>
                    <div className="relative">
                      <div className="inline-flex items-center gap-1.5 rounded bg-red-500/20 px-2 py-0.5">
                        <span className="h-1 w-1 rounded-full bg-red-400" />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-red-300">
                          {t.code}
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold text-white">{t.displayName}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-white/60">
                        {t.tagline || t.coreVibe}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-red-300">
                        <span>{quiz.ui.hubReadMore}</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          )}

          <AdUnit type="in-article" />

          {/* Explore */}
          <section className="mt-20 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              {quiz.ui.hubExploreKicker}
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {/* Point to EN for what-is / vs-mbti since those pages aren't
                  localized yet. Keep slang localized (it exists per-lang). */}
              <Link
                href="/sbti/what-is"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <p className="font-semibold text-gray-900">{quiz.ui.hubWhatIsLabel}</p>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href="/sbti/vs-mbti"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <p className="font-semibold text-gray-900">{quiz.ui.hubVsMbtiLabel}</p>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href={`/${lang}/sbti/slang`}
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <p className="font-semibold text-gray-900">{quiz.ui.hubSlangLabel}</p>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
            <p className="text-gray-600">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <Link href={`/${lang}`} className="text-gray-600 hover:text-gray-900">Home</Link>
            <span className="hidden sm:inline text-gray-400">&bull;</span>
            <LanguageSelector currentLang={lang} />
          </div>
        </div>
      </footer>
    </div>
  );
}
