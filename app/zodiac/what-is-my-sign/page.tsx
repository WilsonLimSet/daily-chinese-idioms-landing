import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllSigns } from '@/src/lib/zodiac';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';
import SignFinderClient, { SignLite } from './SignFinderClient';

export function generateMetadata(): Metadata {
  const description =
    'Find your Chinese zodiac sign by birth year. Enter your birth year (and month for accuracy near Chinese New Year) to discover your animal, its personality, and compatibility.';
  return {
    title: 'What Is My Chinese Zodiac Sign? Find It by Birth Year | Chinese Idioms',
    description,
    keywords: [
      'what is my chinese zodiac sign',
      'chinese zodiac by birth year',
      'chinese zodiac calculator',
      'find my chinese zodiac',
      'chinese zodiac year finder',
      'what chinese zodiac am i',
    ],
    openGraph: {
      title: 'What Is My Chinese Zodiac Sign?',
      description,
      url: 'https://www.chineseidioms.com/zodiac/what-is-my-sign',
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.chineseidioms.com/zodiac/what-is-my-sign',
      languages: {
        'x-default': '/zodiac/what-is-my-sign',
        en: '/zodiac/what-is-my-sign',
        es: '/es/zodiac/what-is-my-sign',
        id: '/id/zodiac/what-is-my-sign',
        ja: '/ja/zodiac/what-is-my-sign',
        ko: '/ko/zodiac/what-is-my-sign',
        fr: '/fr/zodiac/what-is-my-sign',
        de: '/de/zodiac/what-is-my-sign',
      },
    },
  };
}

export default function WhatIsMySignPage() {
  const signs = getAllSigns();
  const signsLite: SignLite[] = signs.map(s => ({
    slug: s.slug,
    animal: s.animal,
    chineseName: s.chineseName,
    pinyin: s.pinyin,
    element: s.element,
    tagline: s.tagline,
    order: s.order,
  }));

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
      { '@type': 'ListItem', position: 2, name: 'Chinese Zodiac', item: 'https://www.chineseidioms.com/zodiac' },
      { '@type': 'ListItem', position: 3, name: 'What is my sign?', item: 'https://www.chineseidioms.com/zodiac/what-is-my-sign' },
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
      <script id="zodiac-finder-breadcrumb" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script id="zodiac-finder-faq" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-3xl px-6 pt-6 text-sm">
          <Link href="/zodiac" className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white/80">
            <ArrowLeft className="h-4 w-4" />
            All zodiac signs
          </Link>
        </nav>
        <div className="relative mx-auto max-w-3xl px-6 pt-12 pb-14 text-center">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">Chinese Zodiac</p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            What Is My <span className="text-red-400">Chinese Zodiac Sign</span>?
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            Enter your birth year to discover your animal — its personality, lucky numbers, and who it matches best.
          </p>
        </div>
      </section>

      {/* Tool */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-3xl px-6 py-14">
          <SignFinderClient signs={signsLite} />

          <AdUnit type="in-article" className="mt-14" />

          {/* All signs quick links */}
          <section className="mt-14">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Browse all 12 signs</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {signs.map(s => (
                <Link
                  key={s.slug}
                  href={`/zodiac/${s.slug}`}
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
              href="/zodiac/compatibility"
              className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
            >
              See the full compatibility chart
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
              <Link href="/zodiac" className="text-sm text-gray-400 transition-colors hover:text-gray-600">Chinese Zodiac</Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-gray-600">Blog</Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <LanguageSelector currentLang="en" forceHome />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
