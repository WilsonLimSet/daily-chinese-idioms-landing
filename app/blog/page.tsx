import { getAllBlogPosts } from '@/src/lib/blog';
import BlogClient from './BlogClient';

export const metadata = {
  title: '280+ Chinese Idioms (Chengyu) - Complete Dictionary with Meanings & Examples',
  description: 'Comprehensive Chinese idioms dictionary with 280+ chengyu. Learn meanings, pinyin pronunciation, origins, and usage examples. Updated daily with cultural context.',
  keywords: ['chinese idioms dictionary', 'chengyu list', 'chinese proverbs', 'learn chengyu', 'chinese idioms with meanings', 'mandarin idioms'],
  openGraph: {
    title: '280+ Chinese Idioms Dictionary - Meanings, Origins & Examples',
    description: 'Complete guide to Chinese idioms (chengyu) with English meanings, pinyin, and cultural context. Updated daily.',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/blog',
    types: {
      'application/rss+xml': '/api/rss',
    },
  },
};

export default async function BlogPage() {
  // Fetch all posts at build time
  const posts = await getAllBlogPosts();
  
  // Extract unique themes server-side
  const themes = Array.from(new Set(posts.map(post => post.idiom.theme))).sort();
  
  return <BlogClient posts={posts} themes={themes} />;
}