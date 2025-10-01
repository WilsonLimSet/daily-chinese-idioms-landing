import { getAllBlogPosts } from '@/src/lib/blog';
import { NextResponse } from 'next/server';
import { rateLimit, getRateLimitHeaders } from '@/src/lib/utils/rate-limit';

export async function GET(request: Request) {
  // Apply rate limiting: 50 requests per minute
  const rateLimitResult = rateLimit(request, { maxRequests: 50, windowMs: 60000 });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts, {
      headers: getRateLimitHeaders(rateLimitResult),
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}