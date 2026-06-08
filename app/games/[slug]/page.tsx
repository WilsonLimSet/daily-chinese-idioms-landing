import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { getAllGameSeries, getGamesWithPosts, getGameSeries } from '@/src/lib/games';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

type PageParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllGameSeries().map(g => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params;
  const game = getGameSeries(slug);
  if (!game) return {};

  const title = `${game.englishName} (${game.chineseName}) — Mythology, Idioms & References | Chinese Idioms`;
  const description = game.synopsis;

  return {
    title,
    description,
    keywords: [
      game.englishName,
      game.chineseName,
      `${game.englishName} chinese mythology`,
      `${game.englishName} references explained`,
      `${game.englishName} chengyu`,
      `${game.englishName} explained`,
      'chinese mythology game',
      'learn chinese through games',
    ],
    openGraph: {
      title: `${game.englishName} (${game.chineseName}) — Cultural Guide`,
      description,
      url: `https://www.chineseidioms.com/games/${game.slug}`,
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'website',
      images: game.poster ? [{ url: game.poster, width: 1200, height: 630, alt: game.englishName }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${game.englishName} — ${game.chineseName}`,
      description,
      images: game.poster ? [game.poster] : undefined,
    },
    alternates: {
      canonical: `https://www.chineseidioms.com/games/${game.slug}`,
      languages: {
        'x-default': `/games/${game.slug}`,
        en: `/games/${game.slug}`,
      },
    },
  };
}

export default async function GamePage({ params }: PageParams) {
  const { slug } = await params;
  const game = getGameSeries(slug);
  if (!game) return notFound();

  const all = getGamesWithPosts();
  const current = all.find(g => g.slug === slug);
  if (!current) return notFound();

  const related = all.filter(g => g.slug !== slug).slice(0, 4);

  const statusLabel =
    game.status === 'released' ? 'Out now' :
    game.status === 'upcoming' ? 'Coming soon' : null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: game.englishName,
    alternateName: game.chineseName,
    description: game.synopsis,
    url: `https://www.chineseidioms.com/games/${game.slug}`,
    inLanguage: 'zh-Hans',
    ...(game.poster && { image: `https://www.chineseidioms.com${game.poster}` }),
    ...(game.developer && {
      author: { '@type': 'Organization', name: game.developer },
      publisher: { '@type': 'Organization', name: game.developer },
    }),
    ...(game.platforms && game.platforms.length > 0 && { gamePlatform: game.platforms }),
    ...(game.basedOn && {
      isBasedOn: { '@type': 'CreativeWork', name: game.basedOn },
    }),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
      { '@type': 'ListItem', position: 2, name: 'Games', item: 'https://www.chineseidioms.com/games' },
      {
        '@type': 'ListItem',
        position: 3,
        name: game.englishName,
        item: `https://www.chineseidioms.com/games/${game.slug}`,
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Script id={`game-${game.slug}-ld`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(structuredData)}
      </Script>
      <Script id={`game-${game.slug}-breadcrumb`} type="application/ld+json" strategy="beforeInteractive">
        {JSON.stringify(breadcrumb)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-5xl px-6 pt-6 text-sm">
          <Link
            href="/games"
            className="inline-flex items-center gap-2 text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            All games
          </Link>
        </nav>

        <div className="relative mx-auto grid max-w-5xl gap-8 px-6 pt-12 pb-16 md:grid-cols-[1fr_minmax(200px,260px)] md:gap-12">
          <div>
            {statusLabel && (
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-red-300">
                {statusLabel}
              </p>
            )}
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
              Chinese Mythology Game · {game.year}
            </p>
            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {game.englishName}
            </h1>
            <p className="mt-4 text-2xl text-white/70">
              {game.chineseName} · <span className="text-white/50">{game.pinyin}</span>
            </p>
            <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">{game.synopsis}</p>

            {/* Meta rows */}
            <dl className="mt-8 space-y-3 text-sm">
              {game.developer && (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-white/40">Developer</dt>
                  <dd className="text-white/80">{game.developer}</dd>
                </div>
              )}
              {game.platforms && game.platforms.length > 0 && (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-white/40">Platforms</dt>
                  <dd className="flex flex-wrap gap-2">
                    {game.platforms.map(p => (
                      <span
                        key={p}
                        className="inline-flex items-center gap-1.5 rounded border border-white/[0.08] bg-white/[0.05] px-2.5 py-0.5 text-xs text-white/70"
                      >
                        <Gamepad2 className="h-3 w-3" />
                        {p}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
              {game.basedOn && (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-white/40">Based on</dt>
                  <dd className="text-white/80">{game.basedOn}</dd>
                </div>
              )}
              {game.tags && game.tags.length > 0 && (
                <div className="flex gap-3">
                  <dt className="w-24 shrink-0 text-white/40">Genre</dt>
                  <dd className="flex flex-wrap gap-2">
                    {game.tags.map(t => (
                      <span
                        key={t}
                        className="rounded bg-white/[0.05] px-2 py-0.5 text-xs capitalize text-white/60"
                      >
                        {t.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Key art / title card */}
          <div className="order-first md:order-last">
            <div className="aspect-[3/4] w-full overflow-hidden rounded-lg border border-white/[0.08] bg-gradient-to-br from-red-900/40 via-gray-900 to-black">
              {game.poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={game.poster}
                  alt={game.englishName}
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-6 text-center">
                  <p className="text-5xl font-bold leading-tight text-white/80">
                    {game.chineseName}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Essays */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {current.posts.length > 0 ? (
            <>
              <div className="mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                  Deep dives
                </p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
                  {current.posts.length} {current.posts.length === 1 ? 'essay' : 'essays'} on {game.englishName}
                </h2>
                <p className="mt-2 text-gray-500">
                  The mythology, classical references, boss names, and the Chinese idioms worth knowing.
                </p>
              </div>

              <ul className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
                {current.posts.map((post, idx) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex items-start gap-4 p-5 transition-colors hover:bg-gray-50"
                    >
                      <span className="mt-1 text-xs font-mono text-gray-300">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold leading-snug text-gray-900 transition-colors group-hover:text-red-500">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="mt-1.5 line-clamp-2 text-[15px] leading-[1.6] text-gray-500">
                            {post.description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-red-400" />
                    </Link>
                  </li>
                ))}
              </ul>

              <AdUnit type="in-article" className="mt-12" />
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                Essays coming soon
              </p>
              <p className="mt-3 text-gray-600">
                We&apos;re writing the cultural guide for {game.englishName}. Check back shortly.
              </p>
            </div>
          )}

          {/* Related games */}
          {related.length > 0 && (
            <section className="mt-20 border-t border-gray-200 pt-12">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                More Chinese mythology games
              </p>
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                {related.map(g => (
                  <Link
                    key={g.slug}
                    href={`/games/${g.slug}`}
                    className="group rounded-lg border border-gray-200 bg-white p-5 transition hover:border-red-200 hover:shadow-sm"
                  >
                    <p className="text-2xl font-bold leading-tight text-gray-200 transition-colors group-hover:text-red-300">
                      {g.chineseName}
                    </p>
                    <p className="mt-3 text-[15px] font-semibold text-gray-900 transition-colors group-hover:text-red-500">
                      {g.englishName}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      {g.posts.length} {g.posts.length === 1 ? 'essay' : 'essays'} · {g.year}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      <footer className="w-full border-t border-gray-200 bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-4">
              <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href="/games" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                Games
              </Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                Blog
              </Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <LanguageSelector currentLang="en" forceHome />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
