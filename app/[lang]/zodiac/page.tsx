import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Sparkles, Heart } from 'lucide-react';
import { getSignForYear } from '@/src/lib/zodiac';
import { getLocalizedSigns, getLocalizedSign, getZodiacUI } from '@/src/lib/zodiac-intl';
import { ACTIVE_LANGUAGE_CODES, LOCALE_MAP } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

const CURRENT_YEAR = 2026;

const isActive = (lang: string) => (ACTIVE_LANGUAGE_CODES as readonly string[]).includes(lang);

export async function generateStaticParams() {
  return ACTIVE_LANGUAGE_CODES.map(lang => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isActive(lang)) return { title: 'Not found' };

  const ui = getZodiacUI(lang);
  const current = getLocalizedSign(lang, getSignForYear(CURRENT_YEAR).slug)!;
  const ogLocale = (LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US').replace('-', '_');

  const languageAlternates: Record<string, string> = {
    'x-default': '/zodiac',
    en: '/zodiac',
    ...Object.fromEntries(ACTIVE_LANGUAGE_CODES.map(l => [l, `/${l}/zodiac`])),
  };

  const title = `${ui.theChineseZodiac}: ${ui.theTwelveSigns} | Chinese Idioms`;
  const description = `${ui.heroBlurb} ${CURRENT_YEAR} · ${ui.yearOfThe} ${current.animal} (${current.chineseName}).`;

  return {
    title,
    description,
    keywords: [ui.chineseZodiac, ui.theChineseZodiac, ui.compatibility, ui.whatIsMySign],
    openGraph: {
      title: `${ui.theChineseZodiac}: ${ui.theTwelveSigns}`,
      description,
      url: `https://www.chineseidioms.com/${lang}/zodiac`,
      siteName: 'Chinese Idioms',
      locale: ogLocale,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/zodiac`,
      languages: languageAlternates,
    },
  };
}

export default async function ZodiacPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isActive(lang)) notFound();

  const signs = getLocalizedSigns(lang);
  const ui = getZodiacUI(lang);
  const current = getLocalizedSign(lang, getSignForYear(CURRENT_YEAR).slug)!;

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Chinese Zodiac: All 12 Signs',
      description:
        'A complete guide to the twelve animals of the Chinese zodiac — their personalities, ruling years, lucky numbers, and compatibility.',
      url: `https://www.chineseidioms.com/${lang}/zodiac`,
      inLanguage: lang,
      dateModified: new Date().toISOString().slice(0, 10),
      isPartOf: { '@type': 'WebSite', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
          { '@type': 'ListItem', position: 2, name: 'Chinese Zodiac', item: `https://www.chineseidioms.com/${lang}/zodiac` },
        ],
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: signs.length,
        itemListElement: signs.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${s.animal} (${s.chineseName})`,
          url: `https://www.chineseidioms.com/${lang}/zodiac/${s.slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What are the 12 Chinese zodiac animals in order?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The twelve Chinese zodiac animals, in order, are: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. Each rules one year in a repeating 12-year cycle.',
          },
        },
        {
          '@type': 'Question',
          name: `What is the Chinese zodiac sign for ${CURRENT_YEAR}?`,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `${CURRENT_YEAR} is the Year of the ${current.animal} (${current.chineseName}). The zodiac year begins at Chinese New Year, so the ${current.animal} year technically starts in late January or February, not January 1.`,
          },
        },
        {
          '@type': 'Question',
          name: 'How is your Chinese zodiac sign determined?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Your Chinese zodiac sign is determined by your birth year in the 12-year cycle — but because the Chinese New Year falls in late January or February, people born in January or early February may belong to the previous year\'s animal. Use the "What is my sign?" tool to check.',
          },
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="zodiac-hub-ld" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-5xl px-6 pt-6">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </nav>
        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">{ui.culturalGuide}</p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            {ui.theChineseZodiac}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            {ui.heroBlurb}{' '}
            <span className="text-white/70">{CURRENT_YEAR} · {ui.yearOfThe} {current.animal} ({current.chineseName}).</span>
          </p>

          {/* Tool links */}
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={`/${lang}/zodiac/what-is-my-sign`}
              className="group inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <Sparkles className="h-4 w-4" />
              {ui.whatIsMySign}
            </Link>
            <Link
              href={`/${lang}/zodiac/compatibility`}
              className="group inline-flex items-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.05] px-5 py-2.5 text-sm font-semibold text-white/80 transition-colors hover:border-white/[0.2] hover:bg-white/[0.1]"
            >
              <Heart className="h-4 w-4" />
              {ui.compatibility}
            </Link>
          </div>
        </div>
      </section>

      {/* Sign grid */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
            {ui.theTwelveSigns}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {signs.map(sign => (
              <Link
                key={sign.slug}
                href={`/${lang}/zodiac/${sign.slug}`}
                className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-red-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="text-5xl font-bold leading-none tracking-tight text-gray-200 transition-colors group-hover:text-red-200">
                    {sign.chineseName}
                  </span>
                  <span className="rounded border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-medium text-gray-400">
                    {sign.order}/12
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-gray-900 transition-colors group-hover:text-red-500">
                  {sign.animal}
                  {sign.slug === current.slug && (
                    <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-600 align-middle">
                      {CURRENT_YEAR}
                    </span>
                  )}
                </h3>
                <p className="mt-0.5 text-sm text-gray-400">{sign.pinyin} &middot; {sign.element}</p>
                <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.6] text-gray-500">{sign.tagline}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500">
                  {ui.readMore}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <AdUnit type="display" className="mt-16" />

          {/* Related hubs */}
          <section className="mt-24 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{ui.keepExploring}</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Link href={`/${lang}/dramas`} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">{ui.dramas}</p>
                  <p className="mt-1 font-semibold text-gray-900">{ui.dramasDesc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link href={`/${lang}/games`} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">{ui.games}</p>
                  <p className="mt-1 font-semibold text-gray-900">{ui.gamesDesc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link href={`/${lang}/blog`} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">{ui.idioms}</p>
                  <p className="mt-1 font-semibold text-gray-900">{ui.idiomsDesc}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-sm text-gray-400 transition-colors hover:text-gray-600">{ui.blog}</Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href={`/${lang}/privacy`} className="text-sm text-gray-400 transition-colors hover:text-gray-600">{ui.privacyPolicy}</Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <LanguageSelector currentLang={lang} forceHome />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
