import idioms from '../../public/idioms.json';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { pinyinToSlug } from './utils/pinyin';

// All idiom posts share a fixed publish date (not a drip feed)
const PUBLISHED_DATE = '2025-01-01';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  idiom: typeof idioms[0];
  content: string;
};

export function generateBlogPost(idiom: typeof idioms[0]): BlogPost {
  const slug = pinyinToSlug(idiom.pinyin);

  const content = `
**Pronunciation:** *${idiom.pinyin}*
**Literal meaning:** ${idiom.meaning}

## Origin & Usage

${idiom.description}

## Examples

**English:** "${idiom.example}"

**Chinese:** ${idiom.chineseExample}
`;

  return {
    slug,
    title: `${idiom.characters} - ${idiom.metaphoric_meaning}`,
    date: PUBLISHED_DATE,
    idiom,
    content
  };
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  // Check for markdown files first
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const filePath = path.join(contentDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        const slug = file.replace('.md', '');
        posts.push({
          slug,
          title: data.title || '',
          date: data.date || PUBLISHED_DATE,
          idiom: {
            id: '',
            characters: data.characters || '',
            pinyin: data.pinyin || '',
            meaning: data.meaning || '',
            example: '',
            chineseExample: '',
            theme: data.theme || '',
            description: data.description || '',
            metaphoric_meaning: data.metaphoric_meaning || '',
            traditionalCharacters: data.characters || '',
            description_tr: '',
            chineseExample_tr: ''
          },
          content: content
        });
      }
    }
  }

  // Generate from JSON for all idioms
  const existingSlugs = new Set(posts.map(p => p.slug));

  for (const idiom of idioms) {
    const slug = pinyinToSlug(idiom.pinyin);
    if (existingSlugs.has(slug)) continue;

    posts.push(generateBlogPost(idiom));
  }

  return posts;
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}