import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';
import { getTranslation } from './translations';
import { pinyinToSlug } from './utils/pinyin';

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

export function generateBlogPost(idiom: Idiom, date: Date, lang?: string): BlogPost {
  const slug = pinyinToSlug(idiom.pinyin);

  // Use translated content if available
  const meaning = idiom.meaning || idiom.original_meaning;
  const metaphoric = idiom.metaphoric_meaning || idiom.original_metaphoric;

  const content = `
**{{pronunciation}}:** *${idiom.pinyin}*
**{{literalMeaning}}:** ${meaning}

## {{originUsage}}

${idiom.description}

## {{whenToUse}}

**{{situation}}:** ${idiom.example}

---

*{{discoverDaily}}*
`;

  // Process the content template with translations
  const processedContent = processContentTemplate(content, lang || 'en');

  return {
    slug,
    title: `${idiom.characters} - ${metaphoric}`,
    date: format(date, 'yyyy-MM-dd'),
    idiom,
    content: processedContent
  };
}

export async function getAllBlogPosts(lang?: string): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];

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

  // Generate posts from JSON for all idioms
  const startDate = new Date('2025-01-01');

  idioms.forEach((idiom: Idiom, index: number) => {
    const postDate = new Date(startDate);
    postDate.setDate(postDate.getDate() + index);
    posts.push(generateBlogPost(idiom, postDate, lang));
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string, lang?: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts(lang);
  return posts.find(post => post.slug === slug) || null;
}