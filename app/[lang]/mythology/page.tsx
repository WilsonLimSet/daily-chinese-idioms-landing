import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getLocalizedFigures, getLocalizedFiguresByCategory, getMythUI, type LocalizedFigure } from '@/src/lib/mythology-intl';
import { ACTIVE_LANGUAGE_CODES, LOCALE_MAP } from '@/src/lib/constants';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

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

  const ui = getMythUI(lang);
  const ogLocale = (LOCALE_MAP[lang as keyof typeof LOCALE_MAP] || 'en-US').replace('-', '_');

  const languageAlternates: Record<string, string> = {
    'x-default': '/mythology',
    en: '/mythology',
    ...Object.fromEntries(ACTIVE_LANGUAGE_CODES.map(l => [l, `/${l}/mythology`])),
  };

  const title = `${ui.chineseMythology} | Chinese Idioms`;
  const description = ui.heroBlurb;

  return {
    title,
    description,
    keywords: [ui.chineseMythology, ui.godsSectionTitle, ui.creaturesSectionTitle],
    openGraph: {
      title: ui.chineseMythology,
      description,
      url: `https://www.chineseidioms.com/${lang}/mythology`,
      siteName: 'Chinese Idioms',
      locale: ogLocale,
      type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/${lang}/mythology`,
      languages: languageAlternates,
    },
  };
}

export default async function MythologyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isActive(lang)) notFound();

  const deities = getLocalizedFiguresByCategory(lang, 'deity');
  const creatures = getLocalizedFiguresByCategory(lang, 'creature');
  const all = getLocalizedFigures(lang);
  const ui = getMythUI(lang);

  const structuredData = [
    {
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Chinese Mythology: Gods, Creatures & Legends',
      description: 'A guide to the gods, heroes, and mythical creatures of Chinese mythology.',
      url: `https://www.chineseidioms.com/${lang}/mythology`, inLanguage: lang,
      dateModified: new Date().toISOString().slice(0, 10),
      isPartOf: { '@type': 'WebSite', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `https://www.chineseidioms.com/${lang}` },
          { '@type': 'ListItem', position: 2, name: 'Chinese Mythology', item: `https://www.chineseidioms.com/${lang}/mythology` },
        ],
      },
      mainEntity: {
        '@type': 'ItemList', numberOfItems: all.length,
        itemListElement: all.map((f, i) => ({
          '@type': 'ListItem', position: i + 1, name: `${f.name} (${f.chineseName})`,
          url: `https://www.chineseidioms.com/${lang}/mythology/${f.slug}`,
        })),
      },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question', name: 'Is the Chinese dragon the same as the Western dragon?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. The Chinese dragon (龙, lóng) is a benevolent, wingless, serpentine water-god associated with rain, luck, and imperial authority — the opposite of the evil, fire-breathing, hoarding Western dragon that heroes slay.' },
        },
        {
          '@type': 'Question', name: 'Who is the most famous figure in Chinese mythology?',
          acceptedAnswer: { '@type': 'Answer', text: 'Sun Wukong, the Monkey King from the novel Journey to the West, is the most famous — a stone-born immortal who stormed Heaven and now appears everywhere from the 1986 CCTV series to the game Black Myth: Wukong.' },
        },
        {
          '@type': 'Question', name: 'Is the fenghuang a phoenix that rises from ash?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. The fenghuang (凤凰), often called the "Chinese phoenix," is a symbol of peace, virtue, and harmony that appears when a just ruler reigns. Classical Chinese sources give it no fire-death-and-rebirth cycle — that idea is borrowed from the Western/Egyptian phoenix.' },
        },
      ],
    },
  ];

  const section = (title: string, subtitle: string, figures: LocalizedFigure[]) => (
    <section className="mt-14 first:mt-0">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h2>
        <p className="mt-1 text-gray-500">{subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {figures.map(f => (
          <Link key={f.slug} href={`/${lang}/mythology/${f.slug}`}
            className="group flex flex-col rounded-xl border border-gray-200 bg-white p-6 transition-all hover:border-red-200 hover:shadow-md">
            <div className="flex items-start justify-between">
              <span className="text-4xl font-bold leading-none tracking-tight text-gray-200 transition-colors group-hover:text-red-200">{f.chineseName}</span>
            </div>
            <h3 className="mt-4 text-lg font-bold text-gray-900 transition-colors group-hover:text-red-500">{f.name}</h3>
            <p className="mt-0.5 text-sm text-gray-400">{f.pinyin} · {f.role}</p>
            <p className="mt-3 line-clamp-3 text-[13.5px] leading-[1.6] text-gray-500">{f.tagline}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500">
              {ui.readMore} <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="flex min-h-screen flex-col">
      <Script id="myth-hub-ld" type="application/ld+json" strategy="beforeInteractive">{JSON.stringify(structuredData)}</Script>

      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-5xl px-6 pt-6">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80">
            <ArrowLeft className="h-4 w-4" /> Home
          </Link>
        </nav>
        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">{ui.culturalGuide}</p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">{ui.chineseMythology}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            {ui.heroBlurb}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href="#deities" className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.1]">{deities.length} {ui.godsCount}</a>
            <a href="#creatures" className="rounded-lg border border-white/[0.12] bg-white/[0.05] px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/[0.1]">{creatures.length} {ui.creaturesCount}</a>
          </div>
        </div>
      </section>

      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div id="deities">{section(ui.godsSectionTitle, ui.godsSectionSub, deities)}</div>
          <AdUnit type="display" className="mt-16" />
          <div id="creatures">{section(ui.creaturesSectionTitle, ui.creaturesSectionSub, creatures)}</div>

          <section className="mt-24 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{ui.keepExploring}</h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Link href={`/${lang}/games`} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm">
                <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">{ui.games}</p><p className="mt-1 font-semibold text-gray-900">{ui.gamesDesc}</p></div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link href={`/${lang}/zodiac`} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm">
                <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">{ui.zodiac}</p><p className="mt-1 font-semibold text-gray-900">{ui.zodiacDesc}</p></div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link href={`/${lang}/dramas`} className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm">
                <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">{ui.dramas}</p><p className="mt-1 font-semibold text-gray-900">{ui.dramasDesc}</p></div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
            </div>
          </section>
        </div>
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4"><div className="text-center">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden text-gray-300 sm:inline">&bull;</span>
            <Link href={`/${lang}/blog`} className="text-sm text-gray-400 transition-colors hover:text-gray-600">{ui.blog}</Link>
            <span className="hidden text-gray-300 sm:inline">&bull;</span>
            <Link href={`/${lang}/privacy`} className="text-sm text-gray-400 transition-colors hover:text-gray-600">{ui.privacyPolicy}</Link>
            <span className="hidden text-gray-300 sm:inline">&bull;</span>
            <LanguageSelector currentLang={lang} forceHome />
          </div>
        </div></div>
      </footer>
    </div>
  );
}
