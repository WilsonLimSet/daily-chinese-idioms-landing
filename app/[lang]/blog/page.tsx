import { getAllBlogPosts } from '@/src/lib/blog-intl';
import BlogClient from '@/app/blog/BlogClient';

const LANGUAGES = {
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
};

export function generateStaticParams() {
  return Object.keys(LANGUAGES).map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({ params }: { params: { lang: string } }) {
  const langName = LANGUAGES[params.lang as keyof typeof LANGUAGES] || 'International';

  return {
    title: `Chinese Idioms Blog - ${langName} | 成语 Chengyu`,
    description: `Learn Chinese idioms (成语) with translations in ${langName}. Daily updates with meanings, examples, and cultural context.`,
    alternates: {
      languages: {
        'en': '/blog',
        ...Object.fromEntries(
          Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/blog`])
        ),
      },
    },
  };
}

export default async function InternationalBlogPage({ params }: { params: { lang: string } }) {
  // Fetch translated posts
  const posts = await getAllBlogPosts(params.lang);

  // Extract unique themes
  const themes = Array.from(new Set(posts.map(post => post.idiom.theme))).sort();

  return <BlogClient posts={posts} themes={themes} />;
}