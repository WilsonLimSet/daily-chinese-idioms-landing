import { MetadataRoute } from 'next';
import { LANGUAGE_CODES, isNoindexLanguage } from '@/src/lib/constants';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';

  // Generate individual sitemap URLs to work around Next.js 15 bug
  // where generateSitemaps() doesn't create a sitemap index at /sitemap.xml
  // See: https://github.com/vercel/next.js/issues/77304
  // Must stay in sync with generateSitemaps() in app/sitemap.ts: noindexed
  // languages produce no sitemap, so advertising them would 404.
  const sitemapIds = [0, 1];
  LANGUAGE_CODES.forEach((lang, i) => {
    if (!isNoindexLanguage(lang)) sitemapIds.push(i + 2);
  });
  const sitemaps = sitemapIds.map((i) => `${baseUrl}/sitemap/${i}.xml`);

  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/static/media/', '/fonts/'],
      },
      // Explicitly allow AI bots for AEO (Answer Engine Optimization)
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'Claude-Web',
        allow: '/',
      },
      {
        userAgent: 'Amazonbot',
        allow: '/',
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
      },
      {
        userAgent: 'Bytespider',
        allow: '/',
      },
      {
        userAgent: 'CCBot',
        allow: '/',
      },
      {
        userAgent: 'cohere-ai',
        allow: '/',
      },
    ],
    sitemap: sitemaps,
  };
}