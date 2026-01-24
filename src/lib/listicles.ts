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
  },
  // AI-native listicles targeting conversational queries
  {
    slug: 'chinese-idioms-for-beginners',
    title: '10 Easy Chinese Idioms for Beginners to Learn First',
    description: 'Start your Chinese idiom journey with these simple, commonly-used chengyu that every beginner should know.',
    metaDescription: 'New to Chinese idioms? Start with these 10 easy chengyu for beginners. Simple to remember, commonly used, and perfect for starting your Mandarin learning journey.',
    keywords: ['easy chinese idioms', 'chinese idioms for beginners', 'simple chengyu', 'first chinese idioms to learn', 'beginner mandarin idioms', 'hsk chinese idioms'],
    intro: 'Learning Chinese idioms can seem daunting, but starting with these common, straightforward expressions will build your confidence. These idioms are frequently used in daily conversation and are easier to remember thanks to their vivid imagery.',
    idiomIds: ['ID004', 'ID008', 'ID009', 'ID010', 'ID001', 'ID002', 'ID006', 'ID014', 'ID017', 'ID020'],
    category: 'Learning',
    publishedDate: '2025-01-28'
  },
  {
    slug: 'chinese-idioms-for-tattoos',
    title: '10 Meaningful Chinese Idioms Perfect for Tattoos',
    description: 'Deep, beautiful Chinese idioms with powerful meanings that make meaningful tattoo choices.',
    metaDescription: 'Looking for Chinese idiom tattoo ideas? These 10 meaningful chengyu have deep philosophical significance and look beautiful as body art. Includes meanings and proper characters.',
    keywords: ['chinese idiom tattoo', 'chinese tattoo ideas', 'chengyu tattoo meaning', 'meaningful chinese characters tattoo', 'chinese phrase tattoo', 'chinese quote tattoo'],
    intro: 'Chinese idioms make powerful tattoos because they pack profound meaning into just four characters. These carefully selected chengyu carry timeless wisdom about life, perseverance, and personal growth - perfect for permanent body art that tells your story.',
    idiomIds: ['ID005', 'ID009', 'ID014', 'ID006', 'ID015', 'ID018', 'ID026', 'ID003', 'ID001', 'ID007'],
    category: 'Inspiration',
    publishedDate: '2025-01-29'
  },
  {
    slug: 'funny-chinese-idioms',
    title: '8 Funny Chinese Idioms with Hilarious Literal Meanings',
    description: 'Discover amusing Chinese idioms whose literal translations are unexpectedly funny or absurd.',
    metaDescription: 'Laugh while you learn with these 8 funny Chinese idioms. Their literal meanings are hilariously absurd, but their actual usage is surprisingly practical and common.',
    keywords: ['funny chinese idioms', 'hilarious chengyu', 'weird chinese sayings', 'amusing chinese phrases', 'chinese idioms literal meaning', 'strange chinese expressions'],
    intro: 'Chinese idioms often have wonderfully absurd literal meanings that make them memorable and fun to learn. These expressions sound bizarre when translated word-for-word but carry practical wisdom that Chinese speakers use every day.',
    idiomIds: ['ID004', 'ID013', 'ID019', 'ID022', 'ID037', 'ID041', 'ID056', 'ID080'],
    category: 'Entertainment',
    publishedDate: '2025-01-30'
  },
  {
    slug: 'chinese-new-year-idioms',
    title: '10 Lucky Chinese Idioms for Chinese New Year Greetings',
    description: 'Auspicious Chinese idioms perfect for Lunar New Year wishes, red envelopes, and celebrations.',
    metaDescription: 'Celebrate Chinese New Year with these 10 auspicious chengyu. Perfect for greetings, red envelope messages, and bringing good luck for the year ahead.',
    keywords: ['chinese new year idioms', 'lunar new year greetings chinese', 'cny chengyu', 'lucky chinese phrases', 'chinese new year wishes', 'auspicious chinese sayings'],
    intro: 'During Chinese New Year, using the right idioms shows cultural knowledge and brings good fortune. These auspicious four-character expressions are perfect for greetings, decorations, and red envelope messages during the Spring Festival.',
    idiomIds: ['ID001', 'ID011', 'ID017', 'ID020', 'ID021', 'ID025', 'ID026', 'ID030', 'ID082', 'ID087'],
    category: 'Celebrations',
    publishedDate: '2025-01-31'
  },
  {
    slug: 'chinese-idioms-for-graduation',
    title: '8 Chinese Idioms Perfect for Graduation Speeches & Cards',
    description: 'Congratulate graduates with these inspiring Chinese idioms about achievement, future success, and new beginnings.',
    metaDescription: 'Find the perfect Chinese idiom for graduation. These 8 chengyu celebrate achievement, encourage future success, and make meaningful graduation card messages.',
    keywords: ['chinese graduation idioms', 'graduation chinese phrases', 'chengyu for graduates', 'chinese congratulations sayings', 'graduation card chinese', 'commencement speech chinese'],
    intro: 'Graduation marks a pivotal moment deserving of profound words. These Chinese idioms capture the essence of achievement, the excitement of new beginnings, and wishes for future success - perfect for speeches, cards, and celebrations.',
    idiomIds: ['ID001', 'ID002', 'ID003', 'ID014', 'ID017', 'ID021', 'ID025', 'ID026'],
    category: 'Celebrations',
    publishedDate: '2025-02-01'
  },
  {
    slug: 'chinese-idioms-about-family',
    title: '10 Heartwarming Chinese Idioms About Family & Home',
    description: 'Beautiful Chinese idioms celebrating family bonds, filial piety, and the warmth of home.',
    metaDescription: 'Discover 10 touching Chinese idioms about family. These chengyu express love for parents, sibling bonds, family harmony, and the importance of home in Chinese culture.',
    keywords: ['chinese family idioms', 'family chinese phrases', 'chengyu about parents', 'chinese filial piety sayings', 'home chinese expressions', 'chinese family values'],
    intro: 'Family is the cornerstone of Chinese culture, and these idioms reflect centuries of wisdom about familial bonds. From filial piety to sibling love, these expressions capture the deep respect and affection that define Chinese family relationships.',
    idiomIds: ['ID008', 'ID027', 'ID031', 'ID035', 'ID040', 'ID043', 'ID056', 'ID080', 'ID102', 'ID118'],
    category: 'Family',
    publishedDate: '2025-02-02'
  },
  {
    slug: 'chinese-idioms-about-time',
    title: '8 Chinese Idioms About Time, Age & Life Passing',
    description: 'Philosophical Chinese idioms reflecting on time, aging, and making the most of life.',
    metaDescription: 'Explore 8 profound Chinese idioms about time and life. These chengyu offer wisdom on aging gracefully, seizing the moment, and the fleeting nature of time.',
    keywords: ['chinese time idioms', 'chinese sayings about age', 'chengyu about life', 'time flies chinese', 'carpe diem chinese', 'chinese philosophy time'],
    intro: 'Chinese culture has long contemplated the nature of time and its passage. These idioms distill centuries of philosophical observation about aging, the value of each moment, and how we should approach our limited time on earth.',
    idiomIds: ['ID007', 'ID015', 'ID018', 'ID023', 'ID024', 'ID029', 'ID033', 'ID036'],
    category: 'Philosophy',
    publishedDate: '2025-02-03'
  },
  {
    slug: 'chinese-idioms-about-nature',
    title: '10 Beautiful Chinese Idioms Inspired by Nature',
    description: 'Poetic Chinese idioms drawing wisdom from mountains, water, plants, and the natural world.',
    metaDescription: 'Discover 10 beautiful Chinese idioms inspired by nature. These chengyu use imagery from mountains, water, bamboo, and seasons to express profound life lessons.',
    keywords: ['chinese nature idioms', 'nature chinese phrases', 'chengyu about water', 'chinese mountain sayings', 'bamboo chinese idiom', 'seasons chinese expressions'],
    intro: 'Nature has always been central to Chinese philosophy and poetry. These idioms draw their wisdom from observations of the natural world - from the persistence of water to the resilience of bamboo - offering timeless lessons through beautiful imagery.',
    idiomIds: ['ID005', 'ID009', 'ID015', 'ID018', 'ID007', 'ID024', 'ID032', 'ID033', 'ID036', 'ID029'],
    category: 'Nature',
    publishedDate: '2025-02-04'
  },
  {
    slug: 'chinese-idioms-for-instagram',
    title: '10 Short Chinese Idioms Perfect for Instagram Captions',
    description: 'Concise, impactful Chinese idioms that make perfect social media captions and bios.',
    metaDescription: 'Level up your Instagram with these 10 Chinese idioms. Short, meaningful, and visually striking - perfect for captions, bios, and showing off your cultural knowledge.',
    keywords: ['chinese instagram captions', 'chinese captions for photos', 'short chinese quotes', 'aesthetic chinese phrases', 'chinese bio ideas', 'chengyu for social media'],
    intro: 'Looking for meaningful captions that stand out? These Chinese idioms are short enough for social media but carry profound meaning. Each four-character phrase packs wisdom about life, success, and self-improvement into a visually striking format.',
    idiomIds: ['ID001', 'ID005', 'ID006', 'ID009', 'ID014', 'ID017', 'ID018', 'ID020', 'ID021', 'ID026'],
    category: 'Social Media',
    publishedDate: '2025-02-05'
  },
  {
    slug: 'chinese-idioms-about-money',
    title: '8 Chinese Idioms About Money, Wealth & Prosperity',
    description: 'Wise Chinese idioms about financial success, wealth attitudes, and the true value of money.',
    metaDescription: 'Learn 8 Chinese idioms about money and wealth. These chengyu offer wisdom on earning, spending, and the role of prosperity in a meaningful life.',
    keywords: ['chinese money idioms', 'wealth chinese phrases', 'chengyu about prosperity', 'chinese financial wisdom', 'rich chinese sayings', 'money chinese culture'],
    intro: 'Chinese culture has nuanced views on wealth - valuing prosperity while warning against greed. These idioms reflect centuries of wisdom about earning, spending, and understanding money\'s proper role in a well-lived life.',
    idiomIds: ['ID011', 'ID013', 'ID017', 'ID020', 'ID025', 'ID030', 'ID057', 'ID087'],
    category: 'Wealth',
    publishedDate: '2025-02-06'
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
