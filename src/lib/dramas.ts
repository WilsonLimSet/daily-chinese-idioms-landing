import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type DramaSeries = {
  slug: string;
  englishName: string;
  chineseName: string;
  pinyin: string;
  year: string;
  synopsis: string;
  /** Prefix that each related blog post's slug starts with. */
  postPrefix: string;
};

export type DramaPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type DramaWithPosts = DramaSeries & {
  posts: DramaPost[];
};

const SERIES: DramaSeries[] = [
  {
    slug: 'first-frost',
    englishName: 'First Frost',
    chineseName: '难哄',
    pinyin: 'Nán Hǒng',
    year: '2026',
    synopsis:
      'Modern romance drama framed as a classical Chinese love story. Childhood friends Wen Yifan and Sang Yan rediscover each other after years apart.',
    postPrefix: 'first-frost-',
  },
  {
    slug: 'pursuit-of-jade',
    englishName: 'Pursuit of Jade',
    chineseName: '玉翡翠',
    pinyin: 'Yù Fěicuì',
    year: '2026',
    synopsis:
      'Historical epic set against the imperial jade trade. Follow Fan Changyu — a butcher who rises to become a general — and the supporting cast that shaped the empire.',
    postPrefix: 'pursuit-of-jade-',
  },
  {
    slug: 'the-heir',
    englishName: 'The Heir',
    chineseName: '祯娘传',
    pinyin: 'Zhēn Niáng Zhuàn',
    year: '2026',
    synopsis:
      'Ming Dynasty drama starring Yang Zi as Li Zhen, the youngest daughter of an ink-making clan who defies every rule of a man\'s world to claim her craft.',
    postPrefix: 'the-heir-',
  },
  {
    slug: 'guardians-of-dafeng',
    englishName: 'Guardians of Dafeng',
    chineseName: '大奉打更人',
    pinyin: 'Dà Fèng Dǎ Gēng Rén',
    year: '2026',
    synopsis:
      'Fantasy-mystery blending Confucian, Daoist, and Buddhist cultivation systems. Xu Qi\'an, a humble night-watchman, unravels a conspiracy threatening the dynasty.',
    postPrefix: 'guardians-of-dafeng-',
  },
  {
    slug: 'love-beyond-the-grave',
    englishName: 'Love Beyond the Grave',
    chineseName: '聊斋之兰若寺',
    pinyin: 'Liáozhāi zhī Lánruòsì',
    year: '2026',
    synopsis:
      'Ghost romance rooted in the Liaozhai classical-horror tradition. He Simu and Duan Xu cross the boundary between the living and the dead.',
    postPrefix: 'love-beyond-the-grave-',
  },
];

export function getAllDramaSeries(): DramaSeries[] {
  return SERIES;
}

export function getDramaSeries(slug: string): DramaSeries | null {
  return SERIES.find(s => s.slug === slug) || null;
}

export function getDramasWithPosts(): DramaWithPosts[] {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const allPosts: (DramaPost & { prefix: string })[] = [];
  if (fs.existsSync(contentDir)) {
    for (const file of fs.readdirSync(contentDir)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const match = SERIES.find(s => slug.startsWith(s.postPrefix));
      if (!match) continue;
      const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));
      allPosts.push({
        slug,
        title: data.title || slug,
        date: data.date || '',
        description: data.description || '',
        prefix: match.postPrefix,
      });
    }
  }
  return SERIES.map(s => ({
    ...s,
    posts: allPosts
      .filter(p => p.prefix === s.postPrefix)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map(({ slug, title, date, description }) => ({ slug, title, date, description })),
  }));
}
