import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, Check, X, Sparkles, Heart } from 'lucide-react';
import { getAllSigns, getSign, getSignForYear } from '@/src/lib/zodiac';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

type PageParams = { params: Promise<{ slug: string }> };

const CURRENT_YEAR = 2026;

/** Gregorian years this sign rules, within a readable range, newest first. */
function rulingYears(slug: string, from = 1936, to = 2032): number[] {
  const out: number[] = [];
  for (let y = to; y >= from; y--) {
    if (getSignForYear(y).slug === slug) out.push(y);
  }
  return out;
}

export async function generateStaticParams() {
  return getAllSigns().map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const sign = getSign(slug);
  if (!sign) return {};

  const years = rulingYears(slug).slice(0, 5).join(', ');
  const title = `${sign.animal} (${sign.chineseName}) Chinese Zodiac: Personality, Years & Compatibility | Chinese Idioms`;
  const description = `The ${sign.animal} (${sign.chineseName}, ${sign.pinyin}) in the Chinese zodiac — personality traits, compatibility, lucky numbers, and ruling years (${years}…). ${sign.tagline}`;

  return {
    title,
    description,
    keywords: [
      `${sign.animal.toLowerCase()} chinese zodiac`,
      `year of the ${sign.animal.toLowerCase()}`,
      `${sign.animal.toLowerCase()} personality`,
      `${sign.animal.toLowerCase()} compatibility`,
      `${sign.animal.toLowerCase()} lucky numbers`,
      `chinese zodiac ${sign.animal.toLowerCase()}`,
      sign.chineseName,
    ],
    openGraph: {
      title: `${sign.animal} (${sign.chineseName}) — Chinese Zodiac Sign`,
      description,
      url: `https://www.chineseidioms.com/zodiac/${sign.slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/zodiac/${sign.slug}`,
      languages: { 'x-default': `/zodiac/${sign.slug}`, en: `/zodiac/${sign.slug}` },
    },
  };
}

export default async function SignPage({ params }: PageParams) {
  const { slug } = await params;
  const sign = getSign(slug);
  if (!sign) return notFound();

  const years = rulingYears(slug);
  const recentYears = years.slice(0, 8);
  const bestMatches = sign.bestMatches.map(getSign).filter((s): s is NonNullable<typeof s> => s !== null);
  const clash = getSign(sign.clash);
  const isCurrentYear = getSignForYear(CURRENT_YEAR).slug === slug;
  const related = getAllSigns().filter(s => s.slug !== slug).slice(0, 4);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${sign.animal} (${sign.chineseName}) — Chinese Zodiac Sign`,
    description: sign.tagline,
    url: `https://www.chineseidioms.com/zodiac/${sign.slug}`,
    inLanguage: 'en',
    about: { '@type': 'Thing', name: `${sign.animal} (Chinese zodiac)`, alternateName: sign.chineseName },
    isPartOf: { '@type': 'WebSite', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
    publisher: { '@type': 'Organization', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
      { '@type': 'ListItem', position: 2, name: 'Chinese Zodiac', item: 'https://www.chineseidioms.com/zodiac' },
      { '@type': 'ListItem', position: 3, name: sign.animal, item: `https://www.chineseidioms.com/zodiac/${sign.slug}` },
    ],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What years are the Year of the ${sign.animal}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Recent Years of the ${sign.animal} include ${recentYears.join(', ')}. The ${sign.animal} rules one year in every 12-year cycle. Because the Chinese year starts at Chinese New Year, people born in January or early February of these years may belong to the previous sign.`,
        },
      },
      {
        '@type': 'Question',
        name: `Who is the ${sign.animal} most compatible with?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The ${sign.animal} is most compatible with the ${bestMatches.map(m => m.animal).join(', ')}. Its most challenging match is the ${clash?.animal} — the direct opposite on the zodiac wheel.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the personality of the ${sign.animal}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${sign.overview} Key strengths: ${sign.strengths.join(', ')}. Watch-outs: ${sign.weaknesses.join(', ')}.`,
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Script id={`sign-${sign.slug}-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>
      <Script id={`sign-${sign.slug}-breadcrumb`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>
      <Script id={`sign-${sign.slug}-faq`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(faq)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-5xl px-6 pt-6 text-sm">
          <Link href="/zodiac" className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white/80">
            <ArrowLeft className="h-4 w-4" />
            All zodiac signs
          </Link>
        </nav>

        <div className="relative mx-auto grid max-w-5xl gap-8 px-6 pt-12 pb-16 md:grid-cols-[1fr_minmax(180px,240px)] md:gap-12">
          <div>
            {isCurrentYear && (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-red-300">
                {CURRENT_YEAR} · Year of the {sign.animal}
              </p>
            )}
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
              Chinese Zodiac · Sign {sign.order} of 12
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              The {sign.animal}
            </h1>
            <p className="mt-4 text-2xl text-white/70">
              {sign.chineseName} · <span className="text-white/50">{sign.pinyin}</span>
            </p>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">{sign.tagline}</p>

            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-white/40">Fixed element</dt>
                <dd className="text-white/80">{sign.element}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-white/40">Polarity</dt>
                <dd className="text-white/80">{sign.yinYang}</dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-28 shrink-0 text-white/40">Recent years</dt>
                <dd className="flex flex-wrap gap-2">
                  {recentYears.slice(0, 6).map(y => (
                    <span key={y} className="rounded border border-white/[0.08] bg-white/[0.05] px-2 py-0.5 text-xs text-white/70">
                      {y}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </div>

          {/* Character card */}
          <div className="order-first md:order-last">
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border border-white/[0.08] bg-gradient-to-br from-red-900/40 via-gray-900 to-black">
              <p className="text-8xl font-bold leading-none text-white/85">{sign.chineseName}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* Overview */}
          <section className="max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">Personality</h2>
            <p className="mt-4 text-[17px] leading-[1.8] text-gray-700">{sign.overview}</p>
          </section>

          {/* Strengths / weaknesses */}
          <section className="mt-12 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Strengths</h3>
              <ul className="mt-4 space-y-2">
                {sign.strengths.map(t => (
                  <li key={t} className="flex items-center gap-2 text-[15px] text-gray-700">
                    <Check className="h-4 w-4 shrink-0 text-green-500" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Watch-outs</h3>
              <ul className="mt-4 space-y-2">
                {sign.weaknesses.map(t => (
                  <li key={t} className="flex items-center gap-2 text-[15px] text-gray-700">
                    <X className="h-4 w-4 shrink-0 text-gray-400" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Lucky attributes */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Lucky numbers</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {sign.luckyNumbers.map(n => (
                  <span key={n} className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-600">
                    {n}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Lucky colors</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {sign.luckyColors.map(c => (
                  <span key={c} className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-700">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <p className="mt-3 text-xs text-gray-400">
            Lucky numbers and colors follow popular Chinese almanac tradition and vary by source — treat them as folklore, not fact.
          </p>

          <AdUnit type="in-article" className="mt-12" />

          {/* Compatibility */}
          <section className="mt-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">Compatibility</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <Heart className="h-4 w-4" />
                  Best matches
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {bestMatches.map(m => (
                    <Link
                      key={m.slug}
                      href={`/zodiac/${m.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:border-green-300 hover:shadow-sm"
                    >
                      <span className="text-base text-gray-300">{m.chineseName}</span>
                      {m.animal}
                    </Link>
                  ))}
                </div>
              </div>
              {clash && (
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-sm font-semibold text-gray-700">Most challenging</h3>
                  <div className="mt-4">
                    <Link
                      href={`/zodiac/${clash.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800 transition hover:border-red-200 hover:shadow-sm"
                    >
                      <span className="text-base text-gray-300">{clash.chineseName}</span>
                      {clash.animal}
                    </Link>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      The {clash.animal} sits opposite the {sign.animal} on the zodiac wheel — the classic &ldquo;six clash&rdquo; (六冲). A pairing that takes extra patience.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/zodiac/compatibility"
                className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
              >
                <Heart className="h-4 w-4" />
                Full compatibility chart
              </Link>
              <Link
                href="/zodiac/what-is-my-sign"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-red-200"
              >
                <Sparkles className="h-4 w-4 text-red-500" />
                What is my sign?
              </Link>
            </div>
          </section>

          {/* Related signs */}
          <section className="mt-20 border-t border-gray-200 pt-12">
            <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Other zodiac signs</p>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {related.map(s => (
                <Link
                  key={s.slug}
                  href={`/zodiac/${s.slug}`}
                  className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-red-200 hover:shadow-sm"
                >
                  <p className="text-2xl font-bold leading-tight text-gray-200 transition-colors group-hover:text-red-300">
                    {s.chineseName}
                  </p>
                  <p className="mt-3 text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-red-500">
                    {s.animal}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">{s.pinyin} · {s.element}</p>
                </Link>
              ))}
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
