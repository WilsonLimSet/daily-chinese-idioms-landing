import idioms from '../../public/idioms.json';
import { format, addDays } from 'date-fns';
import { pinyinToSlug } from './utils/pinyin';

export type Listicle = {
  slug: string;
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  idiomIds: string[];
  category: string;
  publishedDate: string;
};

// Helper to get blog slug for an idiom
export function getIdiomBlogSlug(idiomId: string): string | null {
  const idiom = idioms.find(i => i.id === idiomId);
  if (!idiom) return null;

  // Calculate date from ID (ID001 = 2025-01-01, ID002 = 2025-01-02, etc.)
  const idNum = parseInt(idiomId.replace('ID', ''), 10);
  const startDate = new Date('2025-01-01');
  const date = addDays(startDate, idNum - 1);

  return format(date, 'yyyy-MM-dd') + '-' + pinyinToSlug(idiom.pinyin);
}

// Helper to get full idiom data
export function getIdiomById(idiomId: string) {
  return idioms.find(i => i.id === idiomId);
}

export const listicles: Listicle[] = [
  {
    slug: 'chinese-idioms-for-business',
    title: '10 Powerful Chinese Idioms for Business Success',
    description: 'Master these essential Chinese idioms (chengyu) to impress in business meetings, negotiations, and professional settings.',
    metaDescription: 'Learn 10 powerful Chinese idioms for business. These chengyu cover success, perseverance, strategy, and leadership - perfect for professional Mandarin communication.',
    keywords: ['chinese idioms for business', 'business chinese phrases', 'chengyu for work', 'professional chinese idioms', 'mandarin business expressions'],
    intro: 'In Chinese business culture, using the right idiom (成语, chéng yǔ) can demonstrate cultural understanding and linguistic sophistication. These 10 idioms are particularly valued in professional contexts, from boardroom presentations to client negotiations.',
    idiomIds: ['ID001', 'ID005', 'ID009', 'ID014', 'ID017', 'ID020', 'ID026', 'ID057', 'ID082', 'ID087'],
    category: 'Business',
    publishedDate: '2025-01-15'
  },
  {
    slug: 'chinese-idioms-about-love',
    title: '8 Beautiful Chinese Idioms About Love & Romance',
    description: 'Discover romantic Chinese idioms that express love, devotion, and relationships in poetic ways.',
    metaDescription: 'Explore 8 beautiful Chinese idioms about love and romance. Learn how to express affection, devotion, and relationship sentiments in Mandarin with these poetic chengyu.',
    keywords: ['chinese idioms about love', 'romantic chinese phrases', 'chengyu for love', 'chinese love expressions', 'mandarin romance idioms'],
    intro: 'Chinese idioms about love are among the most poetic in the language. These expressions have been used for centuries to describe the depths of human affection, from first meetings to lifelong devotion.',
    idiomIds: ['ID056', 'ID008', 'ID035', 'ID031', 'ID118', 'ID102', 'ID027', 'ID040'],
    category: 'Love & Relationships',
    publishedDate: '2025-01-16'
  },
  {
    slug: 'chinese-idioms-for-students',
    title: '10 Chinese Idioms Every Student Should Know',
    description: 'Essential Chinese idioms about learning, education, and academic success that will inspire your studies.',
    metaDescription: 'Master 10 Chinese idioms for students about learning and education. These chengyu inspire academic success, perseverance in studies, and lifelong learning.',
    keywords: ['chinese idioms for students', 'learning chinese phrases', 'chengyu for education', 'academic chinese idioms', 'study motivation chinese'],
    intro: 'Education has always been highly valued in Chinese culture. These idioms about learning and knowledge have motivated students for centuries and remain relevant for anyone pursuing academic or personal growth.',
    idiomIds: ['ID002', 'ID003', 'ID006', 'ID010', 'ID016', 'ID021', 'ID025', 'ID028', 'ID009', 'ID014'],
    category: 'Education',
    publishedDate: '2025-01-17'
  },
  {
    slug: 'chinese-idioms-about-friendship',
    title: '8 Meaningful Chinese Idioms About Friendship',
    description: 'Celebrate the bonds of friendship with these heartfelt Chinese idioms about loyalty, trust, and companionship.',
    metaDescription: 'Learn 8 meaningful Chinese idioms about friendship. These chengyu express loyalty, trust, mutual support, and the value of true companions in Chinese culture.',
    keywords: ['chinese idioms about friendship', 'friendship chinese phrases', 'chengyu for friends', 'chinese loyalty idioms', 'mandarin friendship expressions'],
    intro: 'Friendship is a cornerstone of Chinese social values. These idioms capture the essence of true companionship - from sharing hardships to celebrating successes together.',
    idiomIds: ['ID031', 'ID035', 'ID043', 'ID082', 'ID102', 'ID118', 'ID080', 'ID022'],
    category: 'Friendship',
    publishedDate: '2025-01-18'
  },
  {
    slug: 'chinese-idioms-about-success',
    title: '10 Inspiring Chinese Idioms About Success',
    description: 'Motivational Chinese idioms about achieving success, overcoming obstacles, and reaching your goals.',
    metaDescription: 'Discover 10 inspiring Chinese idioms about success and achievement. Learn chengyu that motivate perseverance, hard work, and the journey to accomplishing your goals.',
    keywords: ['chinese idioms about success', 'success chinese phrases', 'chengyu for achievement', 'motivational chinese idioms', 'mandarin success expressions'],
    intro: 'Chinese culture has a rich tradition of idioms that celebrate success and the qualities needed to achieve it. These expressions offer timeless wisdom about perseverance, strategy, and the nature of achievement.',
    idiomIds: ['ID001', 'ID005', 'ID009', 'ID011', 'ID014', 'ID017', 'ID021', 'ID026', 'ID020', 'ID082'],
    category: 'Success',
    publishedDate: '2025-01-19'
  },
  {
    slug: 'chinese-idioms-about-hard-work',
    title: '8 Chinese Idioms About Hard Work & Perseverance',
    description: 'Powerful Chinese idioms that celebrate diligence, persistence, and the value of hard work.',
    metaDescription: 'Learn 8 powerful Chinese idioms about hard work and perseverance. These chengyu inspire dedication, persistence, and the rewards of diligent effort.',
    keywords: ['chinese idioms about hard work', 'perseverance chinese phrases', 'chengyu for diligence', 'chinese work ethic idioms', 'mandarin persistence expressions'],
    intro: 'The Chinese work ethic is legendary, and these idioms reflect centuries of wisdom about the value of diligence and persistence. Whether you\'re facing challenges at work or pursuing personal goals, these expressions offer encouragement.',
    idiomIds: ['ID009', 'ID014', 'ID005', 'ID026', 'ID017', 'ID020', 'ID006', 'ID003'],
    category: 'Hard Work',
    publishedDate: '2025-01-20'
  },
  {
    slug: 'chinese-idioms-about-life',
    title: '10 Profound Chinese Idioms About Life & Philosophy',
    description: 'Deep philosophical Chinese idioms that offer wisdom about life, change, and the human experience.',
    metaDescription: 'Explore 10 profound Chinese idioms about life and philosophy. These chengyu offer timeless wisdom about change, balance, perspective, and the human experience.',
    keywords: ['chinese idioms about life', 'philosophy chinese phrases', 'chengyu for wisdom', 'chinese life lessons', 'mandarin philosophical idioms'],
    intro: 'Chinese philosophy has produced some of the most profound observations about life and human nature. These idioms distill centuries of wisdom into memorable four-character expressions that remain relevant today.',
    idiomIds: ['ID007', 'ID012', 'ID015', 'ID018', 'ID019', 'ID023', 'ID024', 'ID027', 'ID022', 'ID040'],
    category: 'Life Philosophy',
    publishedDate: '2025-01-21'
  },
  {
    slug: 'chinese-idioms-for-motivation',
    title: '10 Motivational Chinese Idioms to Inspire You',
    description: 'Get inspired with these powerful Chinese idioms about motivation, determination, and pushing through challenges.',
    metaDescription: 'Find inspiration with 10 motivational Chinese idioms. These powerful chengyu encourage determination, resilience, and the strength to overcome any challenge.',
    keywords: ['motivational chinese idioms', 'inspiring chinese phrases', 'chengyu for motivation', 'chinese determination idioms', 'mandarin inspiration expressions'],
    intro: 'Need a boost of motivation? These Chinese idioms have inspired generations to push through difficulties and pursue their dreams. Each carries centuries of wisdom about human potential and perseverance.',
    idiomIds: ['ID001', 'ID005', 'ID009', 'ID014', 'ID017', 'ID021', 'ID026', 'ID018', 'ID006', 'ID082'],
    category: 'Motivation',
    publishedDate: '2025-01-22'
  },
  {
    slug: 'chinese-idioms-about-patience',
    title: '8 Chinese Idioms About Patience & Perseverance',
    description: 'Ancient Chinese wisdom on patience, persistence, and the power of waiting for the right moment.',
    metaDescription: 'Learn 8 Chinese idioms about patience and perseverance. These chengyu teach the value of waiting, persistence, and trusting the process of gradual progress.',
    keywords: ['chinese idioms about patience', 'patience chinese phrases', 'chengyu for patience', 'chinese perseverance idioms', 'mandarin waiting expressions'],
    intro: 'Chinese culture deeply values patience as a virtue. These idioms capture centuries of wisdom about the power of persistence, the importance of timing, and why gradual progress often leads to lasting success.',
    idiomIds: ['ID009', 'ID005', 'ID032', 'ID018', 'ID026', 'ID015', 'ID007', 'ID014'],
    category: 'Patience',
    publishedDate: '2025-01-23'
  },
  {
    slug: 'chinese-idioms-about-teamwork',
    title: '8 Chinese Idioms About Teamwork & Cooperation',
    description: 'Powerful Chinese idioms that celebrate collaboration, unity, and working together to achieve common goals.',
    metaDescription: 'Discover 8 Chinese idioms about teamwork and cooperation. These chengyu emphasize unity, collaboration, and the power of working together through challenges.',
    keywords: ['chinese idioms about teamwork', 'teamwork chinese phrases', 'chengyu for cooperation', 'chinese collaboration idioms', 'mandarin unity expressions'],
    intro: 'From navigating treacherous rivers to building great empires, Chinese history is filled with stories of successful collaboration. These idioms capture the essence of working together and the strength found in unity.',
    idiomIds: ['ID031', 'ID035', 'ID022', 'ID027', 'ID008', 'ID030', 'ID033', 'ID034'],
    category: 'Teamwork',
    publishedDate: '2025-01-24'
  },
  {
    slug: 'chinese-idioms-about-change',
    title: '8 Profound Chinese Idioms About Change & Transformation',
    description: 'Philosophical Chinese idioms about embracing change, adapting to circumstances, and personal transformation.',
    metaDescription: 'Explore 8 profound Chinese idioms about change and transformation. These chengyu offer wisdom on adapting to circumstances, embracing change, and personal growth.',
    keywords: ['chinese idioms about change', 'change chinese phrases', 'chengyu for transformation', 'chinese adaptation idioms', 'mandarin personal growth expressions'],
    intro: 'Change is the only constant in life, and Chinese philosophy has long embraced this truth. These idioms offer profound insights into how we can navigate life\'s transitions and transform challenges into opportunities.',
    idiomIds: ['ID015', 'ID018', 'ID012', 'ID007', 'ID024', 'ID029', 'ID036', 'ID033'],
    category: 'Change & Growth',
    publishedDate: '2025-01-25'
  },
  {
    slug: 'chinese-idioms-for-speeches',
    title: '10 Powerful Chinese Idioms for Speeches & Presentations',
    description: 'Impress your audience with these eloquent Chinese idioms perfect for speeches, toasts, and professional presentations.',
    metaDescription: 'Master 10 powerful Chinese idioms for speeches and presentations. These chengyu add elegance and wisdom to toasts, business presentations, and formal occasions.',
    keywords: ['chinese idioms for speeches', 'speech chinese phrases', 'chengyu for presentations', 'chinese toasts idioms', 'mandarin formal expressions'],
    intro: 'Whether you\'re giving a wedding toast, business presentation, or graduation speech, incorporating the right Chinese idiom can elevate your message and demonstrate cultural sophistication. These idioms are particularly effective for inspiring and motivating audiences.',
    idiomIds: ['ID001', 'ID025', 'ID030', 'ID017', 'ID021', 'ID011', 'ID026', 'ID082', 'ID014', 'ID036'],
    category: 'Communication',
    publishedDate: '2025-01-26'
  },
  {
    slug: 'chinese-idioms-about-courage',
    title: '8 Chinese Idioms About Courage & Bravery',
    description: 'Inspiring Chinese idioms about courage, facing fears, and having the bravery to pursue your dreams.',
    metaDescription: 'Find inspiration in 8 Chinese idioms about courage and bravery. These chengyu celebrate fearlessness, determination, and the strength to face challenges head-on.',
    keywords: ['chinese idioms about courage', 'courage chinese phrases', 'chengyu for bravery', 'chinese fearlessness idioms', 'mandarin brave expressions'],
    intro: 'Throughout Chinese history, courage has been celebrated as a fundamental virtue. These idioms capture different aspects of bravery - from the courage to commit fully to a cause, to the strength needed to persist against overwhelming odds.',
    idiomIds: ['ID005', 'ID017', 'ID029', 'ID026', 'ID032', 'ID001', 'ID009', 'ID014'],
    category: 'Courage',
    publishedDate: '2025-01-27'
  }
];

export function getAllListicles(): Listicle[] {
  return listicles;
}

export function getListicle(slug: string): Listicle | null {
  return listicles.find(l => l.slug === slug) || null;
}

export function getListicleWithIdioms(slug: string) {
  const listicle = getListicle(slug);
  if (!listicle) return null;

  const idiomsWithSlugs = listicle.idiomIds.map(id => {
    const idiom = getIdiomById(id);
    const blogSlug = getIdiomBlogSlug(id);
    return { idiom, blogSlug };
  }).filter(item => item.idiom !== undefined);

  return {
    ...listicle,
    idioms: idiomsWithSlugs
  };
}
