import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getLocalizedSigns, getZodiacUI } from '@/src/lib/zodiac-intl';
import { ACTIVE_LANGUAGE_CODES, LOCALE_MAP } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';
import SignFinderClient, { SignLite, FinderLabels } from '@/app/zodiac/what-is-my-sign/SignFinderClient';

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
  const ogLocale = (LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US').replace('-', '_');
  const title = `${ui.whatIsMySignTitle} | Chinese Idioms`;
  const description = ui.toolBlurb;

  const languageAlternates: Record<string, string> = {
    'x-default': '/zodiac/what-is-my-sign',
    en: '/zodiac/what-is-my-sign',
    ...Object.fromEntries(ACTIVE_LANGUAGE_CODES.map(l => [l, `/${l}/zodiac/what-is-my-sign`])),
  };

  return {
    title,
    description,
    keywords: [ui.whatIsMySign, ui.whatIsMySignTitle, ui.chineseZodiac],
    openGraph: {
      title: ui.whatIsMySignTitle,
      description,
      url: `https://www.chineseidioms.com/${lang}/zodiac/what-is-my-sign`,
      siteName: 'Chinese Idioms',
      locale: ogLocale,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/zodiac/what-is-my-sign`,
      languages: languageAlternates,
    },
  };
}

export default async function WhatIsMySignPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isActive(lang)) notFound();

  const ui = getZodiacUI(lang);
  const signs = getLocalizedSigns(lang);
  const signsLite: SignLite[] = signs.map(s => ({
    slug: s.slug,
    animal: s.animal,
    chineseName: s.chineseName,
    pinyin: s.pinyin,
    element: s.element,
    tagline: s.tagline,
    order: s.order,
  }));

  const finderLabels: FinderLabels = {
    yourBirthYear: ui.yourBirthYear,
    birthMonthOptional: ui.birthMonthOptional,
    monthHint: ui.monthHint,
    bornInYearOf: ui.bornInYearOf,
    boundaryWarn: ui.boundaryWarn,
    readFullProfile: ui.readFullProfile,
    enterValidYear: ui.enterValidYear,
    months: ui.months,
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
      { '@type': 'ListItem', position: 2, name: 'Chinese Zodiac', item: `https://www.chineseidioms.com/${lang}/zodiac` },
      { '@type': 'ListItem', position: 3, name: 'What is my sign?', item: `https://www.chineseidioms.com/${lang}/zodiac/what-is-my-sign` },
    ],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How do I find my Chinese zodiac sign?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Your Chinese zodiac sign is set by your birth year in a repeating 12-year cycle of animals: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, and Pig. Enter your birth year above to find your animal.',
        },
      },
      {
        '@type': 'Question',
        name: 'What if I was born in January or February?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The Chinese zodiac year begins at Chinese New Year, which falls between late January and mid-February. If you were born before Chinese New Year in your birth year, your sign is the previous year\'s animal. Check the exact Chinese New Year date for your birth year to be certain.',
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="zodiac-finder-breadcrumb" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>
      <Script id="zodiac-finder-faq" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(faq)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-3xl px-6 pt-6 text-sm">
          <Link href={`/${lang}/zodiac`} className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white/80">
            <ArrowLeft className="h-4 w-4" />
            {ui.allZodiacSigns}
          </Link>
        </nav>
        <div className="relative mx-auto max-w-3xl px-6 pt-12 pb-14 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">{ui.chineseZodiac}</p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            {ui.whatIsMySignTitle}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            {ui.toolBlurb}
          </p>
        </div>
      </section>

      {/* Tool */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <SignFinderClient signs={signsLite} labels={finderLabels} langPrefix={`/${lang}`} />

          <AdUnit type="in-article" className="mt-14" />

          {/* All signs quick links */}
          <section className="mt-14">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{ui.browseAll12}</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {signs.map(s => (
                <Link
                  key={s.slug}
                  href={`/${lang}/zodiac/${s.slug}`}
                  className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition hover:border-red-200 hover:shadow-sm"
                >
                  <span className="text-2xl text-gray-300 transition-colors group-hover:text-red-300">{s.chineseName}</span>
                  <span className="text-sm font-medium text-gray-800 transition-colors group-hover:text-red-500">{s.animal}</span>
                </Link>
              ))}
            </div>
          </section>

          <div className="mt-10">
            <Link
              href={`/${lang}/zodiac/compatibility`}
              className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
            >
              {ui.seeCompatChart}
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href={`/${lang}/zodiac`} className="text-sm text-gray-400 transition-colors hover:text-gray-600">{ui.chineseZodiac}</Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href={`/${lang}/blog`} className="text-sm text-gray-400 transition-colors hover:text-gray-600">{ui.blog}</Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <LanguageSelector currentLang={lang} forceHome />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
