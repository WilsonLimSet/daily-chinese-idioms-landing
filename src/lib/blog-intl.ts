import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  idiom: any;
  content: string;
};

function removeToneMarks(pinyin: string): string {
  const toneMap: { [key: string]: string } = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v',
    'ń': 'n', 'ň': 'n', 'ǹ': 'n',
    'ḿ': 'm', 'm̀': 'm'
  };

  return pinyin.split('').map(char => toneMap[char] || char).join('');
}

export function generateBlogPost(idiom: any, date: Date, lang?: string): BlogPost {
  const cleanPinyin = removeToneMarks(idiom.pinyin).replace(/\s+/g, '-');
  const slug = format(date, 'yyyy-MM-dd') + '-' + cleanPinyin;

  // Use translated content if available
  const meaning = idiom.meaning || idiom.original_meaning;
  const metaphoric = idiom.metaphoric_meaning || idiom.original_metaphoric;

  const content = `
**发音 Pronunciation:** *${idiom.pinyin}*
**字面意思 Literal meaning:** ${meaning}

## 起源与用法 Origin & Usage

${idiom.description}

## 使用场景 When to Use

**Situation:** ${idiom.example}

---

*Discover a new Chinese idiom every day with our [iOS app](https://apps.apple.com/us/app/daily-chinese-idioms/id6740611324).*
`;

  return {
    slug,
    title: `${idiom.characters} - ${metaphoric}`,
    date: format(date, 'yyyy-MM-dd'),
    idiom,
    content
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

  // Generate posts from JSON for dates
  const startDate = new Date('2025-01-01');
  const today = new Date();

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfYear = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const idiomId = `ID${dayOfYear.toString().padStart(3, '0')}`;
    const idiom = idioms.find((i: any) => i.id === idiomId);

    if (idiom) {
      posts.push(generateBlogPost(idiom, new Date(d), lang));
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string, lang?: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts(lang);
  return posts.find(post => post.slug === slug) || null;
}