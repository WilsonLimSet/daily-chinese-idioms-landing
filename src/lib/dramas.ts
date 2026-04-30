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
  /** Path to poster image in /public, e.g. '/dramas/pursuit-of-jade.jpg'. */
  poster?: string;
  /** Streaming platforms where English viewers can watch. */
  platforms?: string[];
  /** Lead cast members for SEO/rich snippet use. */
  cast?: string[];
  /** Source novel (if adapted). */
  novel?: string;
  /** Genre tags: 'historical' | 'romance' | 'mystery' | 'fantasy' | 'wuxia' | 'modern'. */
  tags?: string[];
  /** Status for timeliness signaling. */
  status?: 'airing' | 'upcoming' | 'completed';
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
    slug: 'pursuit-of-jade',
    englishName: 'Pursuit of Jade',
    chineseName: '逐玉',
    pinyin: 'Zhú Yù',
    year: '2026',
    synopsis:
      'The #1 Chinese drama of all time on Netflix (7M+ views). Butcher\'s daughter Fan Changyu and fallen Marquis Xie Zheng enter a matrilocal marriage that reshapes their empire. 2.7 billion domestic views, #6 on Netflix Global Top 10 Non-English TV.',
    postPrefix: 'pursuit-of-jade-',
    poster: '/dramas/pursuit-of-jade.jpg',
    platforms: ['Netflix', 'iQIYI'],
    cast: ['Tian Xiwei', 'Wang Xingyue'],
    novel: '《逐玉》by Tuan Zi Lai Xi',
    tags: ['historical', 'romance'],
    status: 'airing',
  },
  {
    slug: 'first-frost',
    englishName: 'The First Frost',
    chineseName: '难哄',
    pinyin: 'Nán Hǒng',
    year: '2025',
    synopsis:
      'The contemporary-romance phenomenon that held the Netflix C-drama crown until Pursuit of Jade surpassed it. Bai Jingting and Zhang Ruonan play former high school classmates who accidentally share an apartment years later. From the author of Hidden Love.',
    postPrefix: 'first-frost-',
    poster: '/dramas/first-frost.webp',
    platforms: ['Netflix', 'Youku'],
    cast: ['Bai Jingting', 'Zhang Ruonan'],
    novel: '《难哄》by Zhu Yi (竹已)',
    tags: ['modern', 'romance'],
    status: 'completed',
  },
  {
    slug: 'hidden-love',
    englishName: 'Hidden Love',
    chineseName: '偷偷藏不住',
    pinyin: 'Tōu Tōu Cáng Bù Zhù',
    year: '2023',
    synopsis:
      'The campus-romance evergreen that launched the Zhu Yi (竹已) literary universe. Zhao Lusi plays Sang Zhi, who spends years hiding her crush on her older brother\'s best friend Duan Jiaxu. First Frost shares this fictional family.',
    postPrefix: 'hidden-love-',
    poster: '/dramas/hidden-love.jpg',
    platforms: ['Netflix', 'Viki', 'Youku'],
    cast: ['Zhao Lusi', 'Chen Zheyuan'],
    novel: '《偷偷藏不住》by Zhu Yi (竹已)',
    tags: ['modern', 'romance'],
    status: 'completed',
  },
  {
    slug: 'joy-of-life-2',
    englishName: 'Joy of Life 2',
    chineseName: '庆余年第二季',
    pinyin: 'Qìng Yú Nián Dì Èr Jì',
    year: '2024',
    synopsis:
      'The first C-drama to simultaneously release on Disney+ day-and-date with China. Zhang Ruoyun returns as Fan Xian, a man with modern sensibilities navigating imperial court politics, philosophical debates, and the 200-poem recital scene that went viral worldwide.',
    postPrefix: 'joy-of-life-2-',
    poster: '/dramas/joy-of-life-2.jpg',
    platforms: ['Disney+', 'Tencent Video'],
    cast: ['Zhang Ruoyun', 'Chen Daoming', 'Li Qin'],
    novel: '《庆余年》by Mao Ni (猫腻)',
    tags: ['historical', 'fantasy'],
    status: 'completed',
  },
  {
    slug: 'light-to-the-night',
    englishName: 'Light to the Night',
    chineseName: '黑夜告白',
    pinyin: 'Hēi Yè Gào Bái',
    year: '2026',
    synopsis:
      'Netflix-acquired global first-run C-drama. Dylan Wang and Pan Yueming investigate the 1997 Yuanlongli elevator disappearance — an 18-year cold case that shaped both their lives. Part of the new wave of realistic Chinese crime dramas in the 迷雾剧场 (Mist Theater) tradition.',
    postPrefix: 'light-to-the-night-',
    poster: '/dramas/light-to-the-night.jpg',
    platforms: ['Netflix', 'Youku'],
    cast: ['Dylan Wang', 'Pan Yueming', 'Ren Min'],
    tags: ['mystery', 'modern'],
    status: 'upcoming',
  },
  {
    slug: 'flourished-peony',
    englishName: 'Flourished Peony',
    chineseName: '国色芳华',
    pinyin: 'Guó Sè Fāng Huá',
    year: '2025',
    synopsis:
      'One of 2025\'s biggest C-drama hits, driving 29.6 billion related hashtag views on Douyin. Yang Zi plays He Weifang, a late-Tang woman who uses the dynasty\'s 和离 (mutual divorce) law to escape a forced marriage and build her own peony-growing empire in Luoyang — the cultural capital of imperial China.',
    postPrefix: 'flourished-peony-',
    poster: '/dramas/flourished-peony.jpg',
    platforms: ['Mango TV', 'Netflix', 'Viki', 'WeTV'],
    cast: ['Yang Zi', 'Li Xian'],
    novel: '《国色芳华》by Yi Qianchong (意千重)',
    tags: ['historical', 'romance'],
    status: 'completed',
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
    poster: '/dramas/the-heir.jpg',
    platforms: ['Tencent Video', 'WeTV'],
    cast: ['Yang Zi'],
    tags: ['historical', 'romance'],
    status: 'airing',
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
    poster: '/dramas/guardians-of-dafeng.jpg',
    platforms: ['WeTV', 'Tencent Video'],
    cast: ['Li Xian', 'Tian Xiwei'],
    tags: ['fantasy', 'mystery'],
    status: 'completed',
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
    poster: '/dramas/love-beyond-the-grave.jpg',
    platforms: ['iQIYI', 'WeTV'],
    cast: ['Dilraba Dilmurat', 'Arthur Chen Feiyu'],
    tags: ['fantasy', 'romance'],
    status: 'airing',
  },
  {
    slug: 'legend-of-zang-hai',
    englishName: 'Legend of Zang Hai',
    chineseName: '藏海传',
    pinyin: 'Cáng Hǎi Zhuàn',
    year: '2025',
    synopsis:
      'Xiao Zhan stars as the son of an Imperial Astronomer who survives the massacre of his family and spends ten years training in feng shui, architecture, and statecraft to destroy his enemy from within. Set in the fictional Yong Dynasty, drawing on real Ming-era institutions. Directed by Zheng Xiaolong (Empresses in the Palace).',
    postPrefix: 'legend-of-zang-hai-',
    platforms: ['Apple TV', 'Viki'],
    cast: ['Xiao Zhan', 'Zhang Jingyi', 'Huang Jue'],
    novel: '《藏海传》by Nan Pai San Shu (南派三叔)',
    tags: ['historical', 'mystery'],
    status: 'completed',
  },
  {
    slug: 'road-to-success',
    englishName: 'Road to Success',
    chineseName: '狭路',
    pinyin: 'Xiá Lù',
    year: '2026',
    synopsis:
      'Yu Shuxin (Esther Yu) plays a PhD student who returns to her hometown and ends up reviving a failing high school football team alongside Chen Jingke as a mysterious former British football coach. Adapted from Chang Er\'s novel Narrow Road. A modern sports romance with a 32-episode arc culminating at the gaokao.',
    postPrefix: 'road-to-success-',
    platforms: ['iQIYI'],
    cast: ['Yu Shuxin', 'Chen Jingke'],
    novel: '《狭路》by Chang Er',
    tags: ['modern', 'romance'],
    status: 'upcoming',
  },
  {
    slug: 'fated-hearts',
    englishName: 'Fated Hearts',
    chineseName: '婉心记',
    pinyin: 'Wǎn Xīn Jì',
    year: '2025',
    synopsis:
      'Li Qin and Chen Zheyuan star in a 40-episode historical romance about a red-clad battlefield archer who shoots an enemy prince, then loses her memory after falling from a cliff — and falls in love with him in turbulent Yujing City. Built on the deep Chinese tradition of memory-loss romance and karmic recognition.',
    postPrefix: 'fated-hearts-',
    platforms: ['iQIYI', 'Viki'],
    cast: ['Li Qin', 'Chen Zheyuan'],
    tags: ['historical', 'romance'],
    status: 'completed',
  },
  {
    slug: 'the-demon-hunters-romance',
    englishName: "The Demon Hunter's Romance",
    chineseName: '无忧渡',
    pinyin: 'Wú Yōu Dù',
    year: '2025',
    synopsis:
      'Ren Jialun and Song Zu\'er star in a 36-episode supernatural romance set in the city of Guangping, where demons hide among humans. The drama follows four arcs — mirror demon, puppet demon, painting demon, and the existential "who am I" — drawn from Pu Songling\'s Liaozhai folkloric tradition.',
    postPrefix: 'the-demon-hunters-romance-',
    platforms: ['iQIYI', 'Viki'],
    cast: ['Ren Jialun', 'Song Zu\'er'],
    tags: ['fantasy', 'romance', 'mystery'],
    status: 'completed',
  },
];

export function getAllDramaSeries(): DramaSeries[] {
  return SERIES;
}

export function getDramaSeries(slug: string): DramaSeries | null {
  return SERIES.find(s => s.slug === slug) || null;
}

/** Given a blog post slug, return the drama it belongs to (or null). */
export function getDramaForBlogSlug(blogSlug: string): DramaSeries | null {
  return SERIES.find(s => blogSlug.startsWith(s.postPrefix)) || null;
}

/** Return N other dramas (excluding the given slug), prioritizing airing > upcoming > completed. */
export function getRelatedDramas(excludeSlug: string, limit = 3): DramaSeries[] {
  const rank = (s: DramaSeries) =>
    s.status === 'airing' ? 0 : s.status === 'upcoming' ? 1 : 2;
  return SERIES
    .filter(s => s.slug !== excludeSlug)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, limit);
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
