import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getTranslation } from './translations';
import { pinyinToSlug } from './utils/pinyin';

const PUBLISHED_DATE = '2025-01-01';

interface Idiom {
  id: string;
  characters: string;
  pinyin: string;
  meaning: string;
  example: string;
  chineseExample: string;
  theme: string;
  description: string;
  metaphoric_meaning: string;
  traditionalCharacters: string;
  description_tr: string;
  chineseExample_tr: string;
  original_meaning?: string;
  original_metaphoric?: string;
}

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  idiom: Idiom;
  content: string;
};

function processContentTemplate(content: string, lang: string = 'en'): string {
  return content.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return getTranslation(lang, key as keyof typeof import('@/src/lib/translations').translations.en) || match;
  });
}

export function generateBlogPost(idiom: Idiom, lang?: string): BlogPost {
  const slug = pinyinToSlug(idiom.pinyin);

  // Use translated content if available
  const meaning = idiom.meaning || idiom.original_meaning;
  const metaphoric = idiom.metaphoric_meaning || idiom.original_metaphoric;

  const content = `
**{{pronunciation}}:** *${idiom.pinyin}*
**{{literalMeaning}}:** ${meaning}

## {{originUsage}}

${idiom.description}

## {{examples}}

**{{englishExample}}:** "${idiom.example}"

**{{chineseExample}}:** ${idiom.chineseExample}
`;

  // Process the content template with translations
  const processedContent = processContentTemplate(content, lang || 'en');

  return {
    slug,
    title: `${idiom.characters} - ${metaphoric}`,
    date: PUBLISHED_DATE,
    idiom,
    content: processedContent
  };
}

export async function getAllBlogPosts(lang?: string): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

  // Load translated markdown articles if available
  if (lang) {
    const translatedBlogDir = path.join(process.cwd(), `content/blog/translations/${lang}`);
    if (fs.existsSync(translatedBlogDir)) {
      const files = fs.readdirSync(translatedBlogDir);
      for (const file of files) {
        if (file.endsWith('.md')) {
          try {
            const filePath = path.join(translatedBlogDir, file);
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
          } catch {
            // Skip malformed files
          }
        }
      }
    }
  }

  const existingSlugs = new Set(posts.map(p => p.slug));

  // Load appropriate idioms file based on language
  let idioms;
  if (lang) {
    const translatedPath = path.join(process.cwd(), `public/translations/${lang}/idioms.json`);
    if (fs.existsSync(translatedPath)) {
      idioms = JSON.parse(fs.readFileSync(translatedPath, 'utf-8'));
    } else {
      // Fallback to English if translation doesn't exist yet
      idioms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/idioms.json'), 'utf-8'));
    }
  } else {
    idioms = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/idioms.json'), 'utf-8'));
  }

  // Generate posts from JSON for all idioms (skip if slug already exists from markdown)
  for (const idiom of idioms) {
    const slug = pinyinToSlug(idiom.pinyin);
    if (existingSlugs.has(slug)) continue;
    posts.push(generateBlogPost(idiom, lang));
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string, lang?: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts(lang);
  return posts.find(post => post.slug === slug) || null;
}