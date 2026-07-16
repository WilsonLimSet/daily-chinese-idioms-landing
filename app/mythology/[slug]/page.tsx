import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Sparkles, AlertCircle, Gamepad2 } from 'lucide-react';
import { getAllFigures, getFigure, getRelatedFigures } from '@/src/lib/mythology';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllFigures().map(f => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const f = getFigure(slug);
  if (!f) return {};
  const kind = f.category === 'deity' ? 'God' : 'Creature';
  const title = `${f.name} (${f.chineseName}): Chinese Mythology ${kind} Explained | Chinese Idioms`;
  const description = `${f.name} (${f.chineseName}, ${f.pinyin}) in Chinese mythology — ${f.tagline} Story, symbolism, and where you'll meet ${f.name} today.`;
  return {
    title, description,
    keywords: [
      f.name.toLowerCase(), f.chineseName, `${f.name.toLowerCase()} chinese mythology`,
      `who is ${f.name.toLowerCase()}`, `${f.name.toLowerCase()} meaning`, `${f.name.toLowerCase()} story`,
    ],
    openGraph: {
      title: `${f.name} (${f.chineseName}) — Chinese Mythology`, description,
      url: `https://www.chineseidioms.com/mythology/${f.slug}`, siteName: 'Chinese Idioms', locale: 'en_US', type: 'website',
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/mythology/${f.slug}`,
      languages: {
        'x-default': `/mythology/${f.slug}`,
        en: `/mythology/${f.slug}`,
        es: `/es/mythology/${f.slug}`,
        id: `/id/mythology/${f.slug}`,
        ja: `/ja/mythology/${f.slug}`,
        ko: `/ko/mythology/${f.slug}`,
        fr: `/fr/mythology/${f.slug}`,
        de: `/de/mythology/${f.slug}`,
      },
    },
  };
}

export default async function FigurePage({ params }: PageParams) {
  const { slug } = await params;
  const f = getFigure(slug);
  if (!f) return notFound();

  const related = getRelatedFigures(slug, 4);
  const showGamesLink = f.tags.includes('black-myth');
  const kind = f.category === 'deity' ? 'God / Legendary Figure' : 'Mythical Creature';

  const article = {
    '@context': 'https://schema.org', '@type': 'Article',
    headline: `${f.name} (${f.chineseName}) — Chinese Mythology`,
    description: f.tagline, url: `https://www.chineseidioms.com/mythology/${f.slug}`, inLanguage: 'en',
    about: { '@type': 'Thing', name: `${f.name} (Chinese mythology)`, alternateName: f.chineseName },
    isPartOf: { '@type': 'WebSite', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
    publisher: { '@type': 'Organization', name: 'Chinese Idioms', url: 'https://www.chineseidioms.com' },
  };
  const breadcrumb = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
      { '@type': 'ListItem', position: 2, name: 'Chinese Mythology', item: 'https://www.chineseidioms.com/mythology' },
      { '@type': 'ListItem', position: 3, name: f.name, item: `https://www.chineseidioms.com/mythology/${f.slug}` },
    ],
  };
  const faq = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: `Who is ${f.name} in Chinese mythology?`, acceptedAnswer: { '@type': 'Answer', text: f.overview } },
      { '@type': 'Question', name: `What is ${f.name} known for?`, acceptedAnswer: { '@type': 'Answer', text: f.keyFact } },
      ...(f.misconception ? [{ '@type': 'Question', name: `What do people get wrong about ${f.name}?`, acceptedAnswer: { '@type': 'Answer', text: f.misconception } }] : []),
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <script id={`myth-${f.slug}-ld`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(article) }} />
      <script id={`myth-${f.slug}-bc`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <script id={`myth-${f.slug}-faq`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />

      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-5xl px-6 pt-6 text-sm">
          <Link href="/mythology" className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white/80">
            <ArrowLeft className="h-4 w-4" /> All Chinese mythology
          </Link>
        </nav>
        <div className="relative mx-auto grid max-w-5xl gap-8 px-6 pt-12 pb-16 md:grid-cols-[1fr_minmax(180px,240px)] md:gap-12">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/40">Chinese Mythology · {kind}</p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">{f.name}</h1>
            <p className="mt-4 text-2xl text-white/70">{f.chineseName} · <span className="text-white/50">{f.pinyin}</span></p>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">{f.tagline}</p>
            <dl className="mt-8 space-y-3 text-sm">
              <div className="flex gap-3"><dt className="w-24 shrink-0 text-white/40">Role</dt><dd className="text-white/80">{f.role}</dd></div>
            </dl>
          </div>
          <div className="order-first md:order-last">
            <div className="flex aspect-[3/4] w-full items-center justify-center rounded-lg border border-white/[0.08] bg-gradient-to-br from-red-900/40 via-gray-900 to-black">
              <p className="text-8xl font-bold leading-none text-white/85">{f.chineseName}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <section className="max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">Who {f.name} is</h2>
            <p className="mt-4 text-[17px] leading-[1.8] text-gray-700">{f.overview}</p>
          </section>

          <section className="mt-10 max-w-2xl rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{f.category === 'deity' ? 'The defining myth' : 'What it symbolizes'}</h3>
            <p className="mt-3 text-[15px] leading-[1.8] text-gray-700">{f.keyFact}</p>
          </section>

          {f.misconception && (
            <section className="mt-4 max-w-2xl">
              <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-5">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                <div>
                  <h3 className="text-sm font-semibold text-amber-900">Common misconception</h3>
                  <p className="mt-1 text-sm leading-relaxed text-amber-800">{f.misconception}</p>
                </div>
              </div>
            </section>
          )}

          <section className="mt-10 max-w-2xl">
            <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">Where you&apos;ll meet {f.name}</h2>
            <p className="mt-4 text-[15px] leading-[1.8] text-gray-700">{f.significance}</p>
          </section>

          {showGamesLink && (
            <Link href="/games" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800">
              <Gamepad2 className="h-4 w-4" /> {f.name} in Chinese mythology games
            </Link>
          )}

          <AdUnit type="in-article" className="mt-12" />

          {related.length > 0 && (
            <section className="mt-14 border-t border-gray-200 pt-12">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">Related figures</p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {related.map(r => (
                  <Link key={r.slug} href={`/mythology/${r.slug}`} className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-red-200 hover:shadow-sm">
                    <p className="text-2xl font-bold leading-tight text-gray-200 transition-colors group-hover:text-red-300">{r.chineseName}</p>
                    <p className="mt-3 text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-red-500">{r.name}</p>
                    <p className="mt-1 text-xs text-gray-400">{r.role}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/mythology" className="inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600">
              All Chinese mythology <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/zodiac" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-red-500">
              <Sparkles className="h-4 w-4" /> The Chinese zodiac
            </Link>
          </div>
        </div>
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4"><div className="text-center">
          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} chineseidioms</p>
            <span className="hidden text-gray-300 sm:inline">&bull;</span>
            <Link href="/mythology" className="text-sm text-gray-400 transition-colors hover:text-gray-600">Chinese Mythology</Link>
            <span className="hidden text-gray-300 sm:inline">&bull;</span>
            <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-gray-600">Blog</Link>
            <span className="hidden text-gray-300 sm:inline">&bull;</span>
            <LanguageSelector currentLang="en" forceHome />
          </div>
        </div></div>
      </footer>
    </div>
  );
}
