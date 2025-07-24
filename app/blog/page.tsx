import { getAllBlogPosts } from '@/src/lib/blog';
import BlogClient from './BlogClient';

export const metadata = {
  title: 'Blog - Daily Chinese Idioms',
  description: 'Learn a new Chinese idiom every day with historical context and practical examples.',
  alternates: {
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