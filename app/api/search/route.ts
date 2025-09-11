import { NextResponse } from 'next/server';
import { getAllBlogPosts } from '@/src/lib/blog';

export async function GET(request: Request) {
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
        pinyinNoTones: post.idiom.pinyin.toLowerCase().replace(/[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/g, (match) => {
          const toneMap: { [key: string]: string } = {
            'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
            'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
            'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
            'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
            'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
            'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v'
          };
          return toneMap[match] || match;
        }),
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

    return NextResponse.json({
      query,
      results: scoredResults,
      total: scoredResults.length
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}