import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { getAllSigns, getCompatibility } from '@/src/lib/zodiac';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export function generateMetadata(): Metadata {
  const description =
    'The complete Chinese zodiac compatibility chart — see how all 12 animals match in love and friendship, based on the traditional trines (三合) and clashes (六冲). Find your best and most challenging matches.';
  return {
    title: 'Chinese Zodiac Compatibility Chart: All 12 Signs | Chinese Idioms',
    description,
    keywords: [
      'chinese zodiac compatibility',
      'chinese zodiac compatibility chart',
      'chinese zodiac love match',
      'chinese zodiac best match',
      'chinese zodiac trine',
      'chinese zodiac clash',
      'zodiac compatibility chinese',
    ],
    openGraph: {
      title: 'Chinese Zodiac Compatibility Chart: All 12 Signs',
      description,
      url: 'https://www.chineseidioms.com/zodiac/compatibility',
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.chineseidioms.com/zodiac/compatibility',
      languages: { 'x-default': '/zodiac/compatibility', en: '/zodiac/compatibility' },
    },
  };
}

const CELL: Record<string, { bg: string; label: string }> = {
  'Best match': { bg: 'bg-green-500 text-white', label: 'Best' },
  Good: { bg: 'bg-green-100 text-green-800', label: 'Good' },
  Neutral: { bg: 'bg-gray-100 text-gray-500', label: '—' },
  Challenging: { bg: 'bg-orange-100 text-orange-700', label: 'Hard' },
  Clash: { bg: 'bg-red-500 text-white', label: 'Clash' },
};

export default function CompatibilityPage() {
  const signs = getAllSigns();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
      { '@type': 'ListItem', position: 2, name: 'Chinese Zodiac', item: 'https://www.chineseidioms.com/zodiac' },
      { '@type': 'ListItem', position: 3, name: 'Compatibility', item: 'https://www.chineseidioms.com/zodiac/compatibility' },
    ],
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does Chinese zodiac compatibility work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chinese zodiac compatibility is based on two traditional relationships. The four trines (三合) group three signs that harmonize: (Rat, Dragon, Monkey), (Ox, Snake, Rooster), (Tiger, Horse, Dog), and (Rabbit, Goat, Pig). The six clashes (六冲) pair each sign with its direct opposite six positions away — such as Rat and Horse — which are the most challenging matches.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the best Chinese zodiac matches?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The strongest matches come from within the same trine. For example, a Rat pairs best with a Dragon or Monkey; an Ox with a Snake or Rooster; a Tiger with a Horse or Dog; and a Rabbit with a Goat or Pig.',
        },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="zodiac-compat-breadcrumb" type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>
      <Script id="zodiac-compat-faq" type="application/ld+json" strategy="beforeInteractive">
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
        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">Chinese Zodiac</p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Compatibility <span className="text-red-400">Chart</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            How all twelve animals match — read the row for your sign, then the column for theirs. Based on the traditional trines (三合) and clashes (六冲).
          </p>
        </div>
      </section>

      {/* Matrix */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {/* Legend */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs">
            {Object.entries(CELL).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5">
                <span className={`inline-flex h-5 w-9 items-center justify-center rounded text-[10px] font-semibold ${v.bg}`}>{v.label}</span>
                <span className="text-gray-500">{k}</span>
              </span>
            ))}
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-center text-sm">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 bg-white p-2 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Sign
                  </th>
                  {signs.map(col => (
                    <th key={col.slug} className="p-2">
                      <Link href={`/zodiac/${col.slug}`} className="block text-gray-500 transition-colors hover:text-red-500">
                        <span className="block text-lg text-gray-300">{col.chineseName}</span>
                        <span className="text-[10px]">{col.animal}</span>
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {signs.map(row => (
                  <tr key={row.slug} className="border-t border-gray-100">
                    <th className="sticky left-0 z-10 bg-white p-2 text-left">
                      <Link href={`/zodiac/${row.slug}`} className="flex items-center gap-2 transition-colors hover:text-red-500">
                        <span className="text-lg text-gray-300">{row.chineseName}</span>
                        <span className="text-xs font-medium text-gray-700">{row.animal}</span>
                      </Link>
                    </th>
                    {signs.map(col => {
                      const { level } = getCompatibility(row.slug, col.slug);
                      const style = CELL[level] || CELL.Neutral;
                      return (
                        <td key={col.slug} className="p-1.5">
                          <span
                            className={`flex h-8 items-center justify-center rounded text-[10px] font-semibold ${style.bg}`}
                            title={`${row.animal} + ${col.animal}: ${level}`}
                          >
                            {style.label}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Tip: click any animal to read its full personality and compatibility profile.
          </p>

          <AdUnit type="in-article" className="mt-12" />

          {/* Explanation */}
          <section className="mt-14 max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">How it works</h2>
            <h3 className="mt-3 text-lg font-bold text-gray-900">The four trines (三合)</h3>
            <p className="mt-2 text-[15px] leading-[1.8] text-gray-600">
              Signs four positions apart form a harmonious triangle. The four trines are <strong>Rat–Dragon–Monkey</strong>,{' '}
              <strong>Ox–Snake–Rooster</strong>, <strong>Tiger–Horse–Dog</strong>, and <strong>Rabbit–Goat–Pig</strong>. Members of the same
              trine share values and instincts, making them the most natural long-term matches.
            </p>
            <h3 className="mt-6 text-lg font-bold text-gray-900">The six clashes (六冲)</h3>
            <p className="mt-2 text-[15px] leading-[1.8] text-gray-600">
              Each sign sits opposite one other, six positions away — Rat↔Horse, Ox↔Goat, Tiger↔Monkey, Rabbit↔Rooster, Dragon↔Dog, and
              Snake↔Pig. These pairings pull in opposite directions and take the most compromise, though plenty of clashing couples thrive with
              awareness and effort.
            </p>
            <p className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-500">
              Compatibility is a tradition and a lens for reflection, not a verdict. Real relationships depend on the people in them — treat this
              as a fun starting point for understanding each other.
            </p>
          </section>

          <div className="mt-10">
            <Link
              href="/zodiac/what-is-my-sign"
              className="inline-flex items-center gap-2 rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600"
            >
              <Sparkles className="h-4 w-4" />
              Not sure of your sign? Find it here
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
