import { getAllBlogPosts } from '@/src/lib/blog';
import { NextResponse } from 'next/server';
import { rateLimit, getRateLimitHeaders } from '@/src/lib/utils/rate-limit';

export async function GET(request: Request) {
  // Apply rate limiting: 20 requests per minute for RSS
  const rateLimitResult = rateLimit(request, { maxRequests: 20, windowMs: 60000 });

  if (!rateLimitResult.success) {
    return new NextResponse('Too many requests. Please try again later.', {
      status: 429,
      headers: {
        ...getRateLimitHeaders(rateLimitResult),
        'Content-Type': 'text/plain',
      },
    });
  }

  const posts = await getAllBlogPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.chineseidioms.com';
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Chinese Idioms Blog</title>
    <link>${siteUrl}/blog</link>
    <description>Learn a new Chinese idiom every day with historical context and practical examples.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss" rel="self" type="application/rss+xml" />
    ${posts.map(post => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.idiom.description)}</description>
      <category>${escapeXml(post.idiom.theme)}</category>
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      ...getRateLimitHeaders(rateLimitResult),
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}