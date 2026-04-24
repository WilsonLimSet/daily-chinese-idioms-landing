import { Metadata } from 'next';
import Link from 'next/link';
import Script from 'next/script';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { getDramasWithPosts } from '@/src/lib/dramas';
import LanguageSelector from '@/app/components/LanguageSelector';
import AdUnit from '@/app/components/AdUnit';

export const metadata: Metadata = {
  title: 'Chinese Dramas & Idioms — Series Guide | Chinese Idioms',
  description:
    'Learn Chinese through the dramas everyone is watching. Deep dives on First Frost, Pursuit of Jade, The Heir, Guardians of Dafeng, and Love Beyond the Grave — with the idioms, poetry, and cultural history behind each series.',
  keywords: [
    'chinese dramas',
    'c-drama',
    'chinese tv shows',
    'first frost drama',
    'pursuit of jade',
    'the heir drama',
    'guardians of dafeng',
    'love beyond the grave',
    'learn chinese through drama',
    'chinese idioms in dramas',
  ],
  openGraph: {
    title: 'Chinese Dramas & Idioms — Series Guide',
    description:
      'Deep dives on the Chinese dramas people are watching — the idioms, poetry, and cultural history behind each series.',
    url: 'https://www.chineseidioms.com/dramas',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/dramas',
    languages: {
      'x-default': '/dramas',
      en: '/dramas',
    },
  },
};

export default function DramasPage() {
  const dramas = getDramasWithPosts();
  const totalPosts = dramas.reduce((acc, d) => acc + d.posts.length, 0);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Chinese Dramas & Idioms',
    description:
      'A guide to the Chinese dramas everyone is watching — the idioms, poetry, and cultural history behind each series.',
    url: 'https://www.chineseidioms.com/dramas',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chinese Idioms',
      url: 'https://www.chineseidioms.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'Dramas', item: 'https://www.chineseidioms.com/dramas' },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: dramas.map((d, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: `${d.englishName} (${d.chineseName})`,
        description: d.synopsis,
      })),
    },
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Script
        id="dramas-hub-ld"
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
            Chinese Dramas
            <br />
            <span className="text-red-400">&amp; Idioms</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/50">
            Learn Chinese through the dramas everyone is watching. {totalPosts} essays on the idioms, poetry, and cultural history behind each series.
          </p>

          {/* Quick nav */}
          <div className="mt-12 flex flex-wrap gap-3">
            {dramas.map(drama => (
              <Link
                key={drama.slug}
                href={`/dramas/${drama.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.05] px-4 py-2.5 transition-all hover:border-white/[0.15] hover:bg-white/[0.1]"
              >
                <span className="text-2xl leading-none opacity-80 transition-opacity group-hover:opacity-100">
                  {drama.chineseName.slice(0, 2)}
                </span>
                <span className="text-sm text-white/60 transition-colors group-hover:text-white/80">
                  {drama.englishName}
                </span>
                {drama.status === 'airing' && (
                  <span className="flex h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
                )}
                {drama.status === 'upcoming' && (
                  <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-yellow-300">
                    New
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Series sections */}
      <div className="flex-1 bg-gray-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <div className="space-y-24">
            {dramas.map((drama, index) => (
              <article key={drama.slug} id={drama.slug} className="scroll-mt-8">
                {/* Header */}
                <div className="mb-8 flex items-start gap-6 sm:gap-8">
                  <div className="hidden w-24 shrink-0 pt-1 sm:block">
                    <p className="text-6xl font-bold leading-none tracking-tight text-gray-200">
                      {drama.chineseName.slice(0, 2)}
                    </p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 text-4xl font-bold tracking-tight text-gray-200 sm:hidden">
                      {drama.chineseName}
                    </div>
                    <h2 className="text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
                      <Link
                        href={`/dramas/${drama.slug}`}
                        className="transition-colors hover:text-red-500"
                      >
                        {drama.englishName}
                      </Link>
                    </h2>
                    <p className="mt-1 text-gray-500">
                      <span className="hidden sm:inline">{drama.chineseName} &middot; </span>
                      {drama.pinyin}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                        {drama.year}
                      </span>
                      <span className="rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                        {drama.posts.length} {drama.posts.length === 1 ? 'essay' : 'essays'}
                      </span>
                      {drama.status === 'airing' && (
                        <span className="inline-flex items-center gap-1 rounded border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                          Now airing
                        </span>
                      )}
                      {drama.status === 'upcoming' && (
                        <span className="rounded border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-medium text-yellow-700">
                          Coming soon
                        </span>
                      )}
                      {drama.platforms && drama.platforms.length > 0 && (
                        <span className="rounded border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                          {drama.platforms.join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="sm:ml-32">
                  <p className="text-[15px] leading-[1.8] text-gray-600">{drama.synopsis}</p>

                  {drama.posts.length > 0 && (
                    <div className="mt-8">
                      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                        Deep dives
                      </h3>
                      <ul className="divide-y divide-gray-200 border-y border-gray-200">
                        {drama.posts.map(post => (
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
                        href={`/dramas/${drama.slug}`}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-red-500 transition-colors hover:text-red-600"
                      >
                        Full guide to {drama.englishName}
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}
                </div>

                {index === 1 && (
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
                href="/sbti"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    SBTI
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">Personality test</p>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-colors group-hover:text-red-400" />
              </Link>
              <Link
                href="/festivals"
                className="group flex items-center justify-between rounded-lg border border-gray-200 bg-white px-5 py-4 transition hover:border-red-200 hover:shadow-sm"
              >
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-red-500">
                    Festivals
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">Holidays &amp; idioms</p>
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
