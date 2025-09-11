import idioms from '../../public/idioms.json';
import { format } from 'date-fns';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  idiom: typeof idioms[0];
  content: string;
};

export function getIdiomForDate(date: Date): typeof idioms[0] | null {
  const startDate = new Date('2025-01-01');
  const dayOfYear = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  if (dayOfYear < 1 || dayOfYear > idioms.length) {
    return null;
  }
  
  const idiomId = `ID${dayOfYear.toString().padStart(3, '0')}`;
  return idioms.find(idiom => idiom.id === idiomId) || null;
}

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

export function generateBlogPost(idiom: typeof idioms[0], date: Date): BlogPost {
  const cleanPinyin = removeToneMarks(idiom.pinyin).replace(/\s+/g, '-');
  const slug = format(date, 'yyyy-MM-dd') + '-' + cleanPinyin;
  
  const content = `
**Pronunciation:** *${idiom.pinyin}*  
**Literal meaning:** ${idiom.meaning}

## Origin & Usage

${idiom.description}

## When to Use

**Situation:** ${idiom.example}


---

*Discover a new Chinese idiom every day with our [iOS app](https://apps.apple.com/us/app/daily-chinese-idioms/id6740611324).*
`;

  return {
    slug,
    title: `${idiom.characters} - ${idiom.metaphoric_meaning}`,
    date: format(date, 'yyyy-MM-dd'),
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
          date: data.date || '',
          idiom: {
            id: '',
            characters: data.characters || '',
            pinyin: data.pinyin || '',
            meaning: data.meaning || '',
            example: '',
            chineseExample: '',
            theme: data.theme || '',
            description: '',
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
  
  // Then generate from JSON for dates without markdown files
  const startDate = new Date('2025-01-01');
  const today = new Date();
  
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dateStr = format(new Date(d), 'yyyy-MM-dd');
    // Skip if we already have a markdown file for this date
    if (posts.some(p => p.date === dateStr)) continue;
    
    const idiom = getIdiomForDate(new Date(d));
    if (idiom) {
      posts.push(generateBlogPost(idiom, new Date(d)));
    }
  }
  
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const posts = await getAllBlogPosts();
  return posts.find(post => post.slug === slug) || null;
}