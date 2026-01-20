import { getAllBlogPosts } from '@/src/lib/blog';
import { LANGUAGES } from '@/src/lib/constants';
import BlogClient from './BlogClient';

export const metadata = {
  title: '365+ Chinese Idioms (Chengyu) - Complete Dictionary with Meanings & Examples',
  description: 'Comprehensive Chinese idioms dictionary with 365+ chengyu. Learn meanings, pinyin pronunciation, origins, and usage examples. Updated daily with cultural context.',
  keywords: ['chinese idioms dictionary', 'chengyu list', 'chinese proverbs', 'learn chengyu', 'chinese idioms with meanings', 'mandarin idioms'],
  openGraph: {
    title: '365+ Chinese Idioms Dictionary - Meanings, Origins & Examples',
    description: 'Complete guide to Chinese idioms (chengyu) with English meanings, pinyin, and cultural context. Updated daily.',
    url: 'https://www.chineseidioms.com/blog',
    siteName: 'Daily Chinese Idioms',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/blog',
    languages: {
      'en': '/blog',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog`])
      ),
    },
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