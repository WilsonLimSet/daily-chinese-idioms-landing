import { getAllBlogPosts } from '@/src/lib/blog';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const posts = await getAllBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}