import { MetadataRoute } from 'next';
import { LANGUAGE_CODES } from '@/src/lib/constants';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';

  // Generate individual sitemap URLs to work around Next.js 15 bug
  // where generateSitemaps() doesn't create a sitemap index at /sitemap.xml
  // See: https://github.com/vercel/next.js/issues/77304
  const sitemapCount = 2 + LANGUAGE_CODES.length; // 0=static+blog, 1=listicles, 2..14=languages
  const sitemaps = Array.from({ length: sitemapCount }, (_, i) => `${baseUrl}/sitemap/${i}.xml`);

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