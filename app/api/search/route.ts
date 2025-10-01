import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/src/lib/blog';
import { rateLimit, getRateLimitHeaders } from '@/src/lib/utils/rate-limit';
import { removeToneMarks } from '@/src/lib/utils/pinyin';

export async function GET(request: Request) {
  // Apply rate limiting: 30 requests per minute
  const rateLimitResult = rateLimit(request, { maxRequests: 30, windowMs: 60000 });

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      {
        status: 429,
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
  }

  try {
    const posts = await getAllBlogPosts();
    const searchTerm = query.toLowerCase().trim();
    
    // Advanced search with scoring
    const scoredResults = posts.map(post => {
      let score = 0;
      const searchableFields = {
        characters: post.idiom.characters,
        pinyin: post.idiom.pinyin,
        pinyinNoTones: removeToneMarks(post.idiom.pinyin).toLowerCase(),
        meaning: post.idiom.metaphoric_meaning,
        literal: post.idiom.meaning,
        theme: post.idiom.theme
      };

      // Exact matches get highest score
      if (searchableFields.characters.toLowerCase() === searchTerm) score += 100;
      if (searchableFields.pinyin.toLowerCase() === searchTerm) score += 90;
      if (searchableFields.pinyinNoTones === searchTerm) score += 85;
      
      // Partial matches
      if (searchableFields.characters.toLowerCase().includes(searchTerm)) score += 50;
      if (searchableFields.pinyin.toLowerCase().includes(searchTerm)) score += 40;
      if (searchableFields.pinyinNoTones.includes(searchTerm)) score += 35;
      if (searchableFields.meaning.toLowerCase().includes(searchTerm)) score += 30;
      if (searchableFields.literal.toLowerCase().includes(searchTerm)) score += 25;
      if (searchableFields.theme.toLowerCase().includes(searchTerm)) score += 10;

      return { ...post, searchScore: score };
    })
    .filter(result => result.searchScore > 0)
    .sort((a, b) => b.searchScore - a.searchScore)
    .slice(0, 20)
    .map(({ ...post }) => post); // Remove score from final result

    return NextResponse.json(
      {
        query,
        results: scoredResults,
        total: scoredResults.length
      },
      {
        headers: getRateLimitHeaders(rateLimitResult),
      }
    );
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}