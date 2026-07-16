import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getAllGameSeries, getGamesWithPosts } from '@/src/lib/games';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export function generateMetadata(): Metadata {
  const games = getAllGameSeries();
  const gameNames = games.map(g => g.englishName).join(', ');
  const description = `The Chinese mythology behind the games everyone is playing. Deep dives on ${gameNames} — the chengyu, folklore, boss names, and Journey to the West references explained.`;
  const keywords = [
    'chinese mythology games',
    'black myth wukong',
    'black myth zhong kui',
    'journey to the west game',
    'chinese idioms in games',
    'black myth wukong references explained',
    ...games.flatMap(g => [g.englishName.toLowerCase(), g.chineseName]),
  ];

  return {
    title: 'Chinese Mythology in Games — Black Myth & Beyond | Chinese Idioms',
    description,
    keywords,
    openGraph: {
      title: 'Chinese Mythology in Games — Black Myth & Beyond',
      description: `Deep dives on the Chinese mythology behind games like ${games.slice(0, 2).map(g => g.englishName).join(' and ')} — folklore, chengyu, and references explained.`,
      url: 'https://www.chineseidioms.com/games',
      siteName: 'Chinese Idioms',
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: 'https://www.chineseidioms.com/games',
      languages: {
        'x-default': '/games',
        en: '/games',
      },
    },
  };
}

export default function GamesPage() {
  const games = getGamesWithPosts();
  const totalPosts = games.reduce((acc, g) => acc + g.posts.length, 0);

  const releasedGames = games.filter(g => g.status === 'released').map(g => g.englishName);
  const upcomingGames = games.filter(g => g.status === 'upcoming').map(g => g.englishName);

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Chinese Mythology in Games',
      description:
        'A guide to the Chinese mythology behind the games people are playing — the folklore, chengyu, and cultural references behind each title.',
      url: 'https://www.chineseidioms.com/games',
      inLanguage: 'en',
      dateModified: new Date().toISOString().slice(0, 10),
      isPartOf: {
        '@type': 'WebSite',
        name: 'Chinese Idioms',
        url: 'https://www.chineseidioms.com',
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
          { '@type': 'ListItem', position: 2, name: 'Games', item: 'https://www.chineseidioms.com/games' },
        ],
      },
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: games.length,
        itemListElement: games.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'VideoGame',
            name: g.englishName,
            alternateName: g.chineseName,
            url: `https://www.chineseidioms.com/games/${g.slug}`,
            description: g.synopsis,
            inLanguage: 'zh',
            ...(g.developer ? { author: { '@type': 'Organization', name: g.developer } } : {}),
            ...(g.platforms && g.platforms.length > 0 ? { gamePlatform: g.platforms } : {}),
          },
        })),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What Chinese mythology is Black Myth: Wukong based on?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Black Myth: Wukong is based on Journey to the West (西游记), the 16th-century Chinese novel by Wu Cheng\'en. You play "the Destined One," a monkey warrior retracing the legend of Sun Wukong, encountering yaoguai (demons), Buddhist and Daoist figures, and the chengyu and poetry woven through the original novel.',
          },
        },
        ...(upcomingGames.length > 0 ? [{
          '@type': 'Question',
          name: 'What is Black Myth: Zhong Kui about?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Black Myth: Zhong Kui is Game Science's next title after Wukong, announced at Gamescom 2025. It is built around Zhong Kui (钟馗), the demon-queller and ghost-catcher of Chinese folklore. The game is in early development with no confirmed release date.`,
          },
        }] : []),
        ...(releasedGames.length > 0 ? [{
          '@type': 'Question',
          name: 'Which of these games can I play right now?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Available now: ${releasedGames.join(', ')}.`,
          },
        }] : []),
        {
          '@type': 'Question',
          name: 'How can I learn Chinese through these games?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Games steeped in Chinese mythology are full of chengyu (idioms), classical poetry, and folklore references — from boss names to item descriptions. Each game on Chinese Idioms is paired with deep dives explaining the idioms, names, and cultural references it uses, turning play into language and culture learning.',
          },
        },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Script
        id="games-hub-ld"
        type="application/ld+json"
        strategy="beforeInteractive"
      >
        {JSON.stringify(structuredData)}
      </Script>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(185,28,28,0.18),transparent_60%)]" />
        <nav className="relative mx-auto max-w-5xl px-6 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white/80"
          >
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </nav>
        <div className="relative mx-auto max-w-5xl px-6 pt-12 pb-16">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.25em] text-white/40">
            Cultural Guide
          </p>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Chinese Mythology
            <br />
            <span className="text-red-400">in Games</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            The folklore behind the games everyone is playing. {totalPosts} {totalPosts === 1 ? 'essay' : 'essays'} on the chengyu, mythology, and cultural references inside each title.
          </p>

          {/* Quick nav */}
          <div className="mt-12 flex flex-wrap gap-3">
            {games.map(game => (
              <Link
                key={game.slug}
                href={`/games/${game.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 transition-all hover:border-white/[0.15] hover:bg-white/[0.1]"
              >
                <span className="text-2xl leading-none opacity-80 transition-opacity group-hover:opacity-100">
                  {game.chineseName.slice(-2)}
                </span>
                <span className="text-sm text-white/60 transition-colors group-hover:text-white/80">
                  {game.englishName}
                </span>
                {game.status === 'released' && (
                  <span className="flex h-1.5 w-1.5 rounded-full bg-green-400" />
                )}
                {game.status === 'upcoming' && (
                  <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-300">
                    Soon
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Game sections */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="space-y-24">
            {games.map((game, index) => (
              <article key={game.slug} id={game.slug} className="scroll-mt-8">
                {/* Header */}
                <div className="mb-8 flex items-start gap-6 sm:gap-8">
                  <div className="hidden w-24 shrink-0 pt-1 sm:block">
                    <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">
                      {game.chineseName.slice(-2)}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 text-4xl font-bold tracking-tight text-gray-200 sm:hidden">
                      {game.chineseName}
                    </div>
                    <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                      <Link
                        href={`/games/${game.slug}`}
                        className="transition-colors hover:text-red-500"
                      >
                        {game.englishName}
                      </Link>
                    </h2>
                    <p className="mt-1 text-gray-500">
                      <span className="hidden sm:inline">{game.chineseName} &middot; </span>
                      {game.pinyin}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                        {game.year}
                      </span>
                      <span className="rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                        {game.posts.length} {game.posts.length === 1 ? 'essay' : 'essays'}
                      </span>
                      {game.status === 'released' && (
                        <span className="inline-flex items-center gap-1 rounded border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Out now
                        </span>
                      )}
                      {game.status === 'upcoming' && (
                        <span className="rounded border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                          Coming soon
                        </span>
                      )}
                      {game.developer && (
                        <span className="rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                          {game.developer}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="sm:ml-32">
                  <p className="text-[15px] leading-[1.8] text-gray-600">{game.synopsis}</p>

                  {game.posts.length > 0 && (
                    <div className="mt-8">
                      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                        Deep dives
                      </h3>
                      <ul className="divide-y divide-gray-200 border-y border-gray-200">
                        {game.posts.map(post => (
                          <li key={post.slug}>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="group flex items-start gap-4 py-4 transition-colors hover:bg-white"
                            >
                              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-[15px] font-semibold leading-snug text-gray-900 transition-colors group-hover:text-red-500">
                                  {post.title}
                                </h4>
                                {post.description && (
                                  <p className="mt-1 line-clamp-2 text-sm leading-[1.6] text-gray-500">
                                    {post.description}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="mt-1.5 h-4 w-4 shrink-0 text-gray-300 transition-colors group-hover:text-red-400" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={`/games/${game.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                      >
                        Full guide to {game.englishName}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {index === 0 && (
                  <div className="mt-12 sm:ml-32">
                    <AdUnit type="in-article" />
                  </div>
                )}
              </article>
            ))}
          </div>

          <AdUnit type="display" className="mt-20" />

          {/* Related hubs */}
          <section className="mt-24 border-t border-gray-200 pt-12">
            <h2 className="mb-8 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Keep exploring
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              <Link
                href="/dramas"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Dramas
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">C-dramas &amp; idioms</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href="/slang"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Slang
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">Internet slang</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href="/blog"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Idioms
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">1,001 chengyu</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href="/mythology"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Mythology
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">Gods &amp; creatures</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href="/zodiac"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Zodiac
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">The 12 signs</p>
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
              <Link href="/blog" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                Blog
              </Link>
              <span className="hidden text-gray-300 sm:inline">&bull;</span>
              <Link href="/privacy" className="text-sm text-gray-400 transition-colors hover:text-gray-600">
                Privacy Policy
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
