import idioms from '../../public/idioms.json';
import { format, addDays } from 'date-fns';
import { pinyinToSlug } from './utils/pinyin';
import fs from 'fs';
import path from 'path';

export type Listicle = {
  slug: string;
  originalSlug?: string; // For translated listicles, maps to English slug
  title: string;
  description: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  idiomIds: string[];
  category: string;
  publishedDate: string;
};

export type TranslatedListicle = Listicle & {
  originalSlug: string;
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
    title: '10 Lucky Chinese Idioms for Chinese New Year Greetings 2026',
    description: 'What are the best Chinese New Year greetings? These auspicious idioms are perfect for CNY 2026 wishes, red envelopes, and celebrations.',
    metaDescription: 'What are the most popular Chinese New Year greetings? These 10 auspicious chengyu (成语) are the best phrases for CNY 2026 wishes, red envelopes, and bringing good luck.',
    keywords: ['chinese new year greetings 2026', 'what to say chinese new year', 'best cny wishes', 'popular lunar new year phrases', 'gong xi fa cai alternatives', '新年快乐 other greetings', 'auspicious chinese new year sayings', 'spring festival 2026 greetings', 'how to wish happy new year in chinese', 'traditional cny blessings'],
    intro: 'What should you say during Chinese New Year? Using the right idioms (成语, chéng yǔ) shows cultural knowledge and brings good fortune. These auspicious four-character expressions are the most popular greetings for CNY 2026 - perfect for wishes, decorations, and red envelope messages.',
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
  },
  // Chinese New Year 2025 - Year of the Snake
  {
    slug: 'year-of-the-snake-idioms-2025',
    title: '10 Wise Chinese Idioms for Year of the Snake 2025 (蛇年)',
    description: 'Embrace the Year of the Snake with idioms celebrating wisdom, patience, and strategic insight - the serpent\'s greatest gifts.',
    metaDescription: 'What are the best Chinese idioms for Year of the Snake 2025? These 10 wise chengyu (蛇年成语) embody the snake\'s wisdom, patience, and keen insight for CNY greetings.',
    keywords: ['year of the snake idioms 2025', 'snake chinese idioms she nian', 'cny 2025 greetings snake', '蛇年成语 2025', 'chinese new year 2025 snake sayings', 'lunar new year snake zodiac phrases', 'snake wisdom idioms', 'best wishes year of snake chinese', '2025 spring festival snake idioms', 'serpent chinese proverbs'],
    intro: 'The Year of the Snake (蛇年, shé nián) in 2025 brings wisdom, intuition, and transformation. In Chinese culture, the snake represents deep insight, patience, and the ability to see what others miss. These 10 idioms capture the serpent\'s essence - from keen perception (见微知著) to strategic brilliance (运筹帷幄) - perfect for celebrating this thoughtful zodiac year.',
    idiomIds: ['ID079', 'ID044', 'ID077', 'ID089', 'ID111', 'ID154', 'ID174', 'ID001', 'ID009', 'ID010'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-03'
  },
  // Chinese New Year 2026 - Year of the Horse
  {
    slug: 'year-of-the-horse-idioms-2026',
    title: '10 Auspicious Chinese Idioms for Year of the Horse 2026 (马年)',
    description: 'Celebrate the Year of the Horse with these powerful horse-themed Chinese idioms perfect for CNY 2026 greetings, wishes, and red envelopes.',
    metaDescription: 'What are the best Chinese idioms for Year of the Horse 2026? These 10 auspicious horse-themed chengyu (马年成语) are perfect for CNY greetings, red envelopes, and celebrating 马到成功.',
    keywords: ['year of the horse idioms 2026', 'what to say year of the horse', 'horse chinese idioms ma nian', 'cny 2026 greetings horse', '马年成语 2026', 'chinese new year 2026 horse sayings', 'lunar new year horse zodiac phrases', 'ma dao cheng gong meaning', 'best wishes year of horse chinese', '2026 spring festival horse idioms'],
    intro: 'The Year of the Horse (马年, mǎ nián) in 2026 brings energy, success, and vitality. Looking for the perfect horse-themed idiom for Chinese New Year? These 10 auspicious expressions capture the spirit of swift success (马到成功), wisdom, and unstoppable momentum that the horse symbolizes in Chinese culture.',
    idiomIds: ['ID386', 'ID262', 'ID195', 'ID133', 'ID018', 'ID552', 'ID093', 'ID274', 'ID648', 'ID647'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-07'
  },
  {
    slug: 'chinese-new-year-red-envelope-messages',
    title: '10 Lucky Chinese Idioms to Write on Red Envelopes (红包祝福语)',
    description: 'What to write on a red envelope? These short, auspicious Chinese idioms are perfect for hongbao messages during Chinese New Year 2026.',
    metaDescription: 'What should I write on a red envelope for Chinese New Year? These 10 lucky chengyu are perfect hongbao messages (红包祝福语) for wishing wealth, success, and good fortune.',
    keywords: ['what to write on red envelope chinese', 'hongbao message ideas', 'red envelope sayings chinese new year', '红包祝福语 2026', 'what to say on lai see', 'best red packet messages', 'chinese new year envelope wishes', 'short chinese idioms for hongbao', 'lucky phrases for red envelope', 'cny red packet greetings'],
    intro: 'What should you write on a red envelope (红包, hóng bāo) for Chinese New Year? These short, powerful four-character idioms are perfect for hongbao messages, conveying wishes of prosperity, success, and good fortune. Each fits perfectly inside a red envelope and carries deep meaning.',
    idiomIds: ['ID386', 'ID436', 'ID651', 'ID652', 'ID141', 'ID517', 'ID644', 'ID653', 'ID014', 'ID001'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-08'
  },
  {
    slug: 'chinese-new-year-family-reunion-idioms',
    title: '10 Heartwarming Chinese Idioms for Family Reunions (团圆)',
    description: 'What to say at Chinese New Year family gatherings? Beautiful idioms about togetherness for 团圆 reunion dinners.',
    metaDescription: 'Looking for Chinese idioms about family togetherness? These 10 heartwarming chengyu about 团圆 (reunion) are perfect for CNY family gatherings and reunion dinners.',
    keywords: ['chinese family reunion idioms', 'what to say family gathering cny', '团圆成语有哪些', 'chinese new year togetherness phrases', 'family harmony idioms chinese', 'nian ye fan family sayings', 'spring festival reunion quotes', 'chinese phrases about family unity', 'coming home chinese new year', 'family bonds chinese expressions'],
    intro: 'What should you say at Chinese New Year family gatherings? The reunion dinner (年夜饭) is the most important meal of the year, bringing families together for 团圆 (tuán yuán). These idioms capture the warmth of family bonds, the joy of togetherness, and the harmony that Chinese culture treasures.',
    idiomIds: ['ID031', 'ID035', 'ID027', 'ID613', 'ID303', 'ID056', 'ID420', 'ID531', 'ID597', 'ID603'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-09'
  },
  {
    slug: 'chinese-new-year-fresh-start-idioms',
    title: '10 Chinese Idioms for New Beginnings in the New Year',
    description: 'Inspiring Chinese idioms about fresh starts, renewal, and embracing new opportunities in the Lunar New Year.',
    metaDescription: 'Start the Lunar New Year fresh with these 10 Chinese idioms about new beginnings, transformation, and seizing opportunities. Perfect for New Year resolutions.',
    keywords: ['new year new beginnings chinese', 'fresh start idioms', 'chinese renewal sayings', '新年新气象', 'lunar new year resolutions', 'cny fresh start', 'transformation chinese idioms'],
    intro: 'Chinese New Year is the perfect time for fresh starts and new beginnings. These idioms capture the spirit of renewal, transformation, and the optimism that comes with turning over a new leaf as we welcome a new year.',
    idiomIds: ['ID085', 'ID395', 'ID525', 'ID060', 'ID644', 'ID391', 'ID154', 'ID267', 'ID514', 'ID001'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-10'
  },
  {
    slug: 'chinese-new-year-prosperity-blessings',
    title: '10 Chinese Idioms for Prosperity & Wealth - Beyond 恭喜发财',
    description: 'How to wish prosperity in Chinese besides gong xi fa cai? These powerful idioms wish wealth, career success, and fortune for CNY.',
    metaDescription: 'What are other ways to wish prosperity in Chinese besides 恭喜发财? These 10 powerful chengyu convey wishes for wealth, career success, and fortune - perfect alternatives for CNY.',
    keywords: ['prosperity chinese idioms besides gong xi fa cai', 'how to wish wealth in chinese', '恭喜发财 alternatives', 'chinese new year money wishes', 'career success chinese phrases', 'wealth blessing chinese', 'fortune idioms mandarin', 'financial success chinese sayings', 'getting rich chinese expressions', 'business prosperity cny greetings'],
    intro: 'How do you wish prosperity in Chinese besides saying 恭喜发财 (gōng xǐ fā cái)? These powerful idioms convey wishes for wealth, career success, and achievement - perfect alternatives for blessing friends, family, and colleagues with prosperity in the new year.',
    idiomIds: ['ID651', 'ID652', 'ID647', 'ID648', 'ID653', 'ID482', 'ID260', 'ID167', 'ID636', 'ID619'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-11'
  },
  {
    slug: 'chinese-new-year-peace-harmony-idioms',
    title: '10 Chinese Idioms for Peace & Harmony in the New Year',
    description: 'Serene Chinese idioms about peace, harmony, and tranquility perfect for Chinese New Year blessings.',
    metaDescription: 'Wish peace and harmony with these 10 Chinese idioms. Perfect for Chinese New Year blessings about tranquility, national prosperity, and harmonious living.',
    keywords: ['peace chinese idioms', 'harmony new year wishes', 'tranquility cny greetings', '国泰民安', 'chinese peace blessings', 'lunar new year harmony', 'peaceful chinese sayings'],
    intro: 'Beyond wealth and success, Chinese New Year is also a time to wish for peace (平安) and harmony (和谐). These idioms convey blessings for a tranquil, harmonious year ahead - for families, communities, and the world.',
    idiomIds: ['ID616', 'ID617', 'ID618', 'ID027', 'ID303', 'ID304', 'ID173', 'ID148', 'ID566', 'ID040'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-12'
  },
  {
    slug: 'chinese-new-year-first-day-chu-yi-greetings',
    title: '10 Chinese Idioms for Chu Yi 初一 - First Day of Chinese New Year',
    description: 'What to say on Chu Yi (初一)? Special Chinese idioms for the first day of Chinese New Year, the most auspicious day for greetings.',
    metaDescription: 'What should I say on Chu Yi (初一), the first day of Chinese New Year? These 10 auspicious chengyu are the perfect greetings when every word brings extra luck.',
    keywords: ['what to say on chu yi', 'first day chinese new year greetings', '初一说什么吉祥话', 'chu yi auspicious words', 'cny day one what to say', 'spring festival first day phrases', 'lunar new year january 29 2025', 'most lucky chinese new year sayings', 'da nian chu yi greetings', 'what do chinese say on new years day'],
    intro: 'What should you say on Chu Yi (初一, dà nián chū yī), the first day of Chinese New Year? This is the most auspicious day for exchanging greetings - every word spoken carries extra weight and brings maximum good fortune. These expressions are perfect for this special day.',
    idiomIds: ['ID001', 'ID386', 'ID644', 'ID436', 'ID025', 'ID517', 'ID586', 'ID084', 'ID076', 'ID054'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-13'
  },
  {
    slug: 'chinese-new-year-wishes-for-elders',
    title: '10 Respectful Chinese Idioms for Wishing Elders Happy New Year',
    description: 'How to respectfully wish elders Happy New Year in Chinese? Traditional idioms for blessing seniors with longevity and health.',
    metaDescription: 'How do you wish elders Happy New Year in Chinese respectfully? These 10 traditional chengyu convey wishes for longevity (长寿), health, and happiness to seniors during CNY.',
    keywords: ['how to wish elders happy new year chinese', 'respectful cny greetings for seniors', '给长辈拜年怎么说', 'longevity wishes chinese elders', 'chinese phrases for older relatives', 'bai nian to elders', 'traditional respect chinese new year', 'filial piety new year greetings', 'senior blessings mandarin', 'how to address elders cny'],
    intro: 'How do you respectfully wish elders Happy New Year in Chinese? Paying respect to seniors is a cornerstone of Chinese New Year traditions (拜年, bài nián). These idioms convey wishes for longevity (长寿), health, and happiness - perfect for honoring grandparents and elders with the reverence they deserve.',
    idiomIds: ['ID222', 'ID262', 'ID133', 'ID134', 'ID091', 'ID050', 'ID303', 'ID566', 'ID616', 'ID617'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-14'
  },
  {
    slug: 'chinese-new-year-wishes-for-students',
    title: '10 Chinese Idioms for Wishing Students Success in the New Year',
    description: 'Encouraging Chinese idioms for students entering the new year, perfect for academic success and learning wishes.',
    metaDescription: 'Wish students academic success with these 10 Chinese idioms. Perfect for Chinese New Year blessings about learning, exams, and achieving educational dreams.',
    keywords: ['chinese new year student wishes', 'academic success idioms', 'exam blessing chinese', '学业有成', 'student cny greetings', 'school success chinese', 'study motivation new year'],
    intro: 'Chinese New Year is an important time to encourage students in their academic pursuits. These idioms convey wishes for learning success, exam excellence, and intellectual growth - perfect for blessing students of all ages.',
    idiomIds: ['ID002', 'ID003', 'ID021', 'ID010', 'ID016', 'ID154', 'ID167', 'ID025', 'ID674', 'ID585'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-15'
  },
  {
    slug: 'chinese-new-year-idioms-for-in-laws',
    title: '10 Chinese Idioms to Impress Your In-Laws at Chinese New Year',
    description: 'What to say to Chinese in-laws during CNY? These sophisticated idioms help you make a great impression and show cultural respect.',
    metaDescription: 'How do I impress my Chinese in-laws at Chinese New Year? Use these 10 elegant chengyu to show respect, cultural knowledge, and make a great impression during CNY gatherings.',
    keywords: ['how to impress chinese in-laws', 'what to say to in-laws chinese new year', 'meeting chinese in-laws first time cny', '见公婆说什么', 'chinese phrases for in-laws', 'respectful things to say chinese family', 'impress chinese parents in law', 'cny greetings for in-laws', 'polite chinese idioms for elders', 'how to greet boyfriends parents chinese'],
    intro: 'Meeting your in-laws during Chinese New Year and wondering what to say? These carefully selected idioms will help you make an excellent impression. They convey respect, wisdom, and cultural sophistication - showing your in-laws that you value their family and traditions.',
    idiomIds: ['ID027', 'ID091', 'ID134', 'ID033', 'ID141', 'ID050', 'ID129', 'ID137', 'ID173', 'ID566'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-16'
  },
  {
    slug: 'chinese-new-year-idioms-for-grandparents',
    title: '10 Sweet Chinese Idioms to Say to Grandparents at Chinese New Year',
    description: 'What to say to grandparents in Chinese at CNY? These heartfelt idioms wish health, longevity, and happiness to 爷爷奶奶 or 外公外婆.',
    metaDescription: 'What should I say to my Chinese grandparents at New Year? These 10 loving chengyu express filial respect and wish 爷爷奶奶 health, longevity, and happiness during CNY.',
    keywords: ['what to say to grandparents chinese new year', 'chinese new year wishes for grandma grandpa', 'how to wish grandparents in chinese', '给爷爷奶奶拜年说什么', 'longevity blessing chinese grandparents', 'chinese phrases for elderly relatives', 'cny greetings for 外公外婆', 'respectful chinese sayings for grandparents', 'filial piety phrases chinese', 'health wishes grandparents mandarin'],
    intro: 'What should you say to grandparents (爷爷奶奶 or 外公外婆) at Chinese New Year? Grandparents hold a special place in Chinese family culture, and these heartfelt idioms express your love, respect, and wishes for their continued health and happiness - perfect for making their Chinese New Year extra special.',
    idiomIds: ['ID222', 'ID262', 'ID134', 'ID133', 'ID303', 'ID616', 'ID617', 'ID566', 'ID050', 'ID040'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-17'
  },
  {
    slug: 'chinese-new-year-idioms-for-aunties-uncles',
    title: '10 Chinese Idioms for Greeting Aunties and Uncles at CNY (阿姨叔叔)',
    description: 'What to say to aunties and uncles during Chinese New Year? Polite idioms for greeting 阿姨, 叔叔, 舅舅, 姑姑 during family visits.',
    metaDescription: 'What should I say to aunties and uncles at Chinese New Year? These 10 respectful Chinese idioms are perfect for greeting 阿姨叔叔 during CNY family visits.',
    keywords: ['what to say to auntie uncle chinese new year', 'chinese new year greetings for relatives', 'how to greet 阿姨叔叔 cny', '给长辈拜年说什么', 'polite chinese phrases for aunts uncles', 'cny wishes for 舅舅姑姑', 'chinese family visit greetings', 'respectful sayings for older relatives', 'extended family cny phrases', 'how to address relatives chinese new year'],
    intro: 'What should you say when visiting aunties (阿姨) and uncles (叔叔) during Chinese New Year? These idioms help you greet 舅舅, 姑姑, and other relatives with proper respect and warmth, making a great impression while honoring the family bonds that Chinese culture treasures.',
    idiomIds: ['ID027', 'ID303', 'ID617', 'ID436', 'ID651', 'ID517', 'ID134', 'ID033', 'ID141', 'ID050'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-18'
  },
  {
    slug: 'chinese-new-year-idioms-for-children',
    title: '10 Easy Chinese Idioms to Teach Kids at Chinese New Year',
    description: 'What Chinese phrases should kids learn for CNY? Easy-to-remember idioms perfect for teaching children to participate in New Year greetings.',
    metaDescription: 'What Chinese New Year phrases should I teach my kids? These 10 easy, fun chengyu are perfect for children to learn - helping them participate in CNY greetings and traditions.',
    keywords: ['chinese new year phrases for kids', 'easy chinese idioms for children', 'what to teach kids chinese new year', '儿童成语简单', 'simple cny greetings for children', 'kids chinese vocabulary new year', 'teaching children chinese traditions', 'fun chinese phrases for kids', 'child friendly chinese idioms', 'how to teach kids bai nian'],
    intro: 'What Chinese phrases should kids learn for Chinese New Year? These simple, memorable idioms are perfect for children to learn and use - helping them participate in family greetings (拜年) while building their Chinese vocabulary in a fun way.',
    idiomIds: ['ID004', 'ID008', 'ID001', 'ID386', 'ID436', 'ID034', 'ID010', 'ID006', 'ID009', 'ID517'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-19'
  },
  {
    slug: 'chinese-new-year-business-greetings',
    title: '10 Professional Chinese Idioms for CNY Business Greetings',
    description: 'Sophisticated Chinese idioms for professional Chinese New Year greetings to colleagues, bosses, and business partners.',
    metaDescription: 'Send professional CNY greetings with these 10 business-appropriate Chinese idioms. Perfect for wishing colleagues, bosses, and partners success in the new year.',
    keywords: ['business chinese new year', 'professional cny greetings', 'corporate chinese wishes', '商业新年祝福', 'boss new year message', 'colleague cny greeting', 'business partner chinese'],
    intro: 'Chinese New Year is an important time for professional relationship-building in Chinese business culture. These idioms are perfect for sending sophisticated, appropriate greetings to colleagues, supervisors, and business partners.',
    idiomIds: ['ID001', 'ID386', 'ID651', 'ID652', 'ID653', 'ID636', 'ID082', 'ID447', 'ID014', 'ID036'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-20'
  },
  {
    slug: 'chinese-new-year-zodiac-blessings',
    title: '12 Chinese Idioms for Each Zodiac Animal - Universal CNY Blessings',
    description: 'Chinese idioms representing all 12 zodiac animals, perfect for personalized Chinese New Year blessings.',
    metaDescription: 'Find the perfect Chinese idiom for each zodiac sign. These 12 chengyu feature all zodiac animals for personalized CNY greetings based on birth year.',
    keywords: ['zodiac chinese idioms', 'chinese animal idioms', 'zodiac cny greetings', '生肖成语', 'chinese horoscope idioms', 'year of idioms', 'personalized cny wishes'],
    intro: 'Each Chinese zodiac animal has its own symbolic meanings and associated idioms. Use these to give personalized Chinese New Year blessings based on someone\'s zodiac year - a thoughtful way to show you care.',
    idiomIds: ['ID074', 'ID042', 'ID108', 'ID262', 'ID107', 'ID386', 'ID130', 'ID095', 'ID049', 'ID063', 'ID059', 'ID192'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-21'
  },
  {
    slug: 'chinese-new-year-health-wishes',
    title: '10 Chinese Idioms for Wishing Good Health in the New Year',
    description: 'Heartfelt Chinese idioms about health and vitality, perfect for Chinese New Year health wishes.',
    metaDescription: 'Wish good health with these 10 Chinese idioms. Perfect for CNY greetings about wellness, vitality, and wishing loved ones a healthy year ahead.',
    keywords: ['health chinese idioms', 'wellness cny wishes', 'good health chinese', '身体健康成语', 'vitality new year', 'health blessings chinese', 'longevity health idioms'],
    intro: 'Health is wealth (身体是革命的本钱)! These idioms focus on wishing good health, vitality, and wellness - the most sincere blessing you can give during Chinese New Year, especially to elders and loved ones.',
    idiomIds: ['ID222', 'ID262', 'ID185', 'ID304', 'ID303', 'ID586', 'ID113', 'ID148', 'ID040', 'ID566'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-22'
  },
  {
    slug: 'chinese-new-year-reunion-dinner-toasts',
    title: '10 Chinese Idioms for Toasts at the CNY Reunion Dinner (年夜饭)',
    description: 'What to say when toasting at Chinese New Year dinner? Perfect idioms for 年夜饭 toasts when raising a glass with family.',
    metaDescription: 'What should I say when making a toast at Chinese New Year dinner? These 10 chengyu are perfect for 年夜饭 reunion dinner toasts - raising a glass to family, prosperity, and the year ahead.',
    keywords: ['what to say chinese new year dinner toast', 'reunion dinner toast chinese', '年夜饭祝酒词说什么', 'cny family dinner speech', 'how to toast in chinese new year', 'raising glass chinese phrases', 'nian ye fan toast', 'chinese new year eve dinner sayings', 'family gathering toast mandarin', 'spring festival dinner cheers'],
    intro: 'What should you say when making a toast at the reunion dinner (年夜饭, nián yè fàn)? This is the heart of Chinese New Year celebrations. These idioms are perfect for toasting - whether you\'re the host welcoming family or a guest expressing gratitude for togetherness.',
    idiomIds: ['ID031', 'ID035', 'ID027', 'ID082', 'ID617', 'ID303', 'ID533', 'ID436', 'ID517', 'ID586'],
    category: 'Chinese New Year',
    publishedDate: '2025-02-23'
  },
  // NEW LISTICLES - Based on Google Search Console gap analysis (Jan 2026)
  {
    slug: 'chinese-idioms-about-perseverance',
    title: '10 Powerful Chinese Idioms About Perseverance & Never Giving Up',
    description: 'Inspiring Chinese idioms about perseverance, persistence, and the strength to keep going. Learn how to say perseverance in Chinese.',
    metaDescription: 'Looking for Chinese idioms about perseverance? These 10 powerful chengyu about persistence, determination, and never giving up will inspire you to keep going through any challenge.',
    keywords: ['perseverance in chinese', 'chinese idioms about perseverance', 'persistence chinese phrases', 'never give up chinese', 'determination chengyu', 'chinese perseverance sayings', 'resilience chinese idiom', 'keep going chinese phrase'],
    intro: 'How do you express perseverance in Chinese? These powerful idioms capture the spirit of persistence and determination that has inspired generations. From water wearing through stone to slow birds flying first, Chinese culture has profound wisdom about the power of never giving up.',
    idiomIds: ['ID005', 'ID009', 'ID090', 'ID106', 'ID107', 'ID201', 'ID224', 'ID233', 'ID032', 'ID154'],
    category: 'Perseverance',
    publishedDate: '2025-02-24'
  },
  {
    slug: 'chinese-beauty-idioms-four-beauties',
    title: '8 Poetic Chinese Idioms About Beauty (闭月羞花 & The Four Beauties)',
    description: 'Discover the most beautiful Chinese idioms describing beauty, including the famous 闭月羞花 and 沉鱼落雁 from the Four Beauties of ancient China.',
    metaDescription: 'What does 闭月羞花 mean? Learn 8 beautiful Chinese idioms about beauty, including the famous Four Beauties expressions. Perfect for describing elegance and grace in Chinese.',
    keywords: ['chinese beauty idioms', 'bi yue xiu hua meaning', 'chen yu luo yan meaning', 'four beauties chinese idiom', 'beautiful chinese phrases', 'chinese idioms about beauty', 'moon hides flowers shy'],
    intro: 'What does 闭月羞花 (bì yuè xiū huā) mean? This iconic idiom describes beauty so stunning that the moon hides and flowers feel shy. Together with 沉鱼落雁, these phrases honor the legendary Four Beauties of ancient China whose grace became immortalized in language.',
    idiomIds: ['ID114', 'ID341', 'ID056', 'ID040', 'ID118', 'ID196', 'ID084', 'ID248'],
    category: 'Beauty & Nature',
    publishedDate: '2025-02-25'
  },
  {
    slug: 'chinese-idioms-english-translations',
    title: '15 Most Searched Chinese Idioms with English Translations',
    description: 'The most commonly searched Chinese idioms with their English translations. Perfect for learners looking for accurate chengyu meanings.',
    metaDescription: 'Looking for Chinese idiom English translations? This guide covers the 15 most searched chengyu including their meanings, pinyin, and usage examples.',
    keywords: ['chinese idiom english translation', 'chengyu in english', 'chinese idioms translated', 'chinese proverbs english meaning', 'mandarin idioms english'],
    intro: 'Looking for Chinese idiom English translations? Whether you are a student, translator, or language enthusiast, this guide provides accurate English translations for the most commonly searched Chinese idioms, complete with pinyin pronunciation and usage examples.',
    idiomIds: ['ID102', 'ID010', 'ID134', 'ID048', 'ID053', 'ID033', 'ID295', 'ID234', 'ID037', 'ID200', 'ID042', 'ID249', 'ID131', 'ID084', 'ID114'],
    category: 'Learning',
    publishedDate: '2025-02-26'
  },
  {
    slug: 'classic-chinese-fable-idioms',
    title: '10 Chinese Idioms from Famous Fables & Stories You Should Know',
    description: 'Learn Chinese idioms from classic fables including the fox and tiger, the frog in the well, and waiting for rabbits by a tree stump.',
    metaDescription: 'Discover 10 Chinese idioms from famous fables. Stories like the fox borrowing the tiger\'s power and the frog in the well teach timeless lessons through memorable tales.',
    keywords: ['chinese fable idioms', 'shou zhu dai tu meaning', 'hu jia hu wei meaning', 'jing di zhi wa meaning', 'chinese idiom stories', 'ye gong hao long meaning', 'fox tiger chinese idiom', 'frog well chinese idiom'],
    intro: 'The best Chinese idioms come from memorable fables and stories passed down for thousands of years. These tales contain profound wisdom wrapped in entertaining narratives that have captivated generations.',
    idiomIds: ['ID074', 'ID042', 'ID234', 'ID271', 'ID200', 'ID079', 'ID135', 'ID225', 'ID249', 'ID233'],
    category: 'Stories & Fables',
    publishedDate: '2025-02-27'
  },
  {
    slug: 'chinese-idioms-preparation-planning',
    title: '8 Chinese Idioms About Preparation & Planning Ahead (未雨绸缪)',
    description: 'Wise Chinese idioms about being prepared, planning ahead, and the importance of foresight. Learn wei yu chou mou and related planning chengyu.',
    metaDescription: 'What does 未雨绸缪 mean? Learn 8 Chinese idioms about preparation and planning. These chengyu about foresight and being prepared offer timeless wisdom for success.',
    keywords: ['wei yu chou mou meaning', 'chinese idioms about planning', 'preparation chinese phrases', 'be prepared chinese idiom', 'chinese foresight idioms', 'planning ahead chinese'],
    intro: 'What does 未雨绸缪 (wèi yǔ chóu móu) mean? Literally "repair the roof before rain," this idiom captures the Chinese wisdom of preparation and foresight. These idioms about planning ahead offer timeless advice for anyone who wants to be ready for whatever comes.',
    idiomIds: ['ID037', 'ID053', 'ID154', 'ID036', 'ID018', 'ID026', 'ID084', 'ID014'],
    category: 'Strategy',
    publishedDate: '2025-02-28'
  },
  {
    slug: 'most-searched-chinese-idioms',
    title: '12 Most Searched Chinese Idioms - Popular Chengyu Everyone Wants to Know',
    description: 'The most popular and frequently searched Chinese idioms including wu ji bi fan, liu an hua ming, ren shan ren hai, and more.',
    metaDescription: 'What are the most searched Chinese idioms? From extremes lead to reversal to people mountain people sea - learn the 12 most popular chengyu that learners search for worldwide.',
    keywords: ['most popular chinese idioms', 'wu ji bi fan meaning', 'liu an hua ming meaning', 'people mountain people sea meaning', 'ren shan ren hai meaning', 'common chinese idioms', 'popular chengyu', 'famous chinese idioms'],
    intro: 'What are the most searched Chinese idioms in the world? Based on search data, these 12 chengyu capture universal themes that resonate across cultures - from philosophical observations about balance to vivid imagery describing crowds.',
    idiomIds: ['ID015', 'ID084', 'ID255', 'ID009', 'ID102', 'ID134', 'ID042', 'ID234', 'ID033', 'ID200', 'ID074', 'ID114'],
    category: 'Popular',
    publishedDate: '2025-03-01'
  },
  // === PROGRAMMATIC LISTICLES: Animals & Zodiac ===
  {
    slug: 'chinese-idioms-with-dragon',
    title: '8 Powerful Chinese Idioms With Dragon (龙)',
    description: 'Discover Chinese idioms featuring the dragon (龙), a symbol of power, luck, and imperial authority in Chinese culture.',
    metaDescription: 'Learn 8 powerful Chinese idioms with dragon (龙). These chengyu represent strength, success, and good fortune - perfect for Chinese New Year and celebrations.',
    keywords: ['chinese idioms with dragon', 'dragon chengyu', '龙 idioms', 'chinese dragon sayings', 'year of the dragon idioms'],
    intro: 'The dragon (龙, lóng) is the most revered creature in Chinese mythology, symbolizing power, strength, and good fortune. These idioms featuring the dragon are especially popular during Chinese New Year and celebrations.',
    idiomIds: ['ID025', 'ID262', 'ID271', 'ID294', 'ID375', 'ID431'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-01'
  },
  {
    slug: 'chinese-idioms-with-tiger',
    title: '10 Fierce Chinese Idioms With Tiger (虎)',
    description: 'Explore powerful Chinese idioms featuring the tiger (虎), representing courage, power, and authority.',
    metaDescription: 'Discover 10 fierce Chinese idioms with tiger (虎). Learn chengyu about courage, power, and authority - essential for the Year of the Tiger.',
    keywords: ['chinese idioms with tiger', 'tiger chengyu', '虎 idioms', 'chinese tiger sayings', 'year of the tiger idioms'],
    intro: 'The tiger (虎, hǔ) represents courage, power, and authority in Chinese culture. Known as the king of beasts, tiger idioms often describe bravery, danger, or formidable opponents.',
    idiomIds: ['ID042', 'ID130', 'ID131', 'ID253', 'ID278', 'ID284', 'ID375', 'ID377', 'ID550'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-02'
  },
  {
    slug: 'chinese-idioms-with-horse',
    title: '12 Chinese Idioms With Horse (马) for Success',
    description: 'Master Chinese idioms featuring the horse (马), symbolizing speed, success, and perseverance.',
    metaDescription: 'Learn 12 Chinese idioms with horse (马). These chengyu represent success, speed, and determination - great for Year of the Horse celebrations.',
    keywords: ['chinese idioms with horse', 'horse chengyu', '马 idioms', 'chinese horse sayings', 'year of the horse idioms', 'ma dao cheng gong'],
    intro: 'The horse (马, mǎ) symbolizes speed, success, and perseverance in Chinese culture. Horse idioms are particularly popular for wishing success in new ventures.',
    idiomIds: ['ID018', 'ID093', 'ID116', 'ID133', 'ID192', 'ID195', 'ID202', 'ID208', 'ID248', 'ID262', 'ID274', 'ID278'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-03'
  },
  {
    slug: 'chinese-idioms-with-snake',
    title: '6 Clever Chinese Idioms With Snake (蛇)',
    description: 'Learn Chinese idioms featuring the snake (蛇), representing wisdom, caution, and hidden dangers.',
    metaDescription: 'Explore 6 clever Chinese idioms with snake (蛇). These chengyu teach wisdom about caution, hidden dangers, and strategic thinking.',
    keywords: ['chinese idioms with snake', 'snake chengyu', '蛇 idioms', 'chinese snake sayings', 'year of the snake idioms'],
    intro: 'The snake (蛇, shé) represents wisdom, caution, and sometimes hidden danger in Chinese culture. These idioms often teach valuable lessons about awareness and strategy.',
    idiomIds: ['ID079', 'ID135', 'ID377'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-04'
  },
  {
    slug: 'chinese-idioms-with-ox',
    title: '8 Strong Chinese Idioms With Ox (牛)',
    description: 'Discover Chinese idioms featuring the ox (牛), symbolizing hard work, strength, and determination.',
    metaDescription: 'Learn 8 strong Chinese idioms with ox (牛). These chengyu celebrate hard work, perseverance, and quiet strength.',
    keywords: ['chinese idioms with ox', 'ox chengyu', '牛 idioms', 'chinese ox sayings', 'year of the ox idioms'],
    intro: 'The ox (牛, niú) symbolizes hard work, strength, and determination in Chinese culture. Ox idioms celebrate diligence and steady progress.',
    idiomIds: ['ID100', 'ID147', 'ID200', 'ID269', 'ID383'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-05'
  },
  // === PROGRAMMATIC LISTICLES: Body & Mind ===
  {
    slug: 'chinese-idioms-with-heart-xin',
    title: '15 Heartfelt Chinese Idioms With Heart (心)',
    description: 'Explore Chinese idioms featuring the heart (心), expressing emotions, intentions, and inner feelings.',
    metaDescription: 'Discover 15 Chinese idioms with heart (心). Learn chengyu about emotions, sincerity, determination, and the depths of human feeling.',
    keywords: ['chinese idioms with heart', 'heart chengyu', '心 idioms', 'chinese heart expressions', 'xin idioms'],
    intro: 'The heart (心, xīn) in Chinese represents not just emotions but also the mind, intentions, and core of a person. These idioms express the full range of human feeling and determination.',
    idiomIds: ['ID008', 'ID136', 'ID151', 'ID166', 'ID183', 'ID208', 'ID256', 'ID313', 'ID316', 'ID318', 'ID340', 'ID393', 'ID398', 'ID403', 'ID409'],
    category: 'Body & Mind',
    publishedDate: '2025-02-06'
  },
  {
    slug: 'chinese-idioms-with-eye',
    title: '10 Insightful Chinese Idioms With Eye (目/眼)',
    description: 'Learn Chinese idioms featuring the eye (目/眼), about vision, perception, and understanding.',
    metaDescription: 'Master 10 Chinese idioms with eye (目/眼). These chengyu teach about vision, insight, perception, and seeing the truth clearly.',
    keywords: ['chinese idioms with eye', 'eye chengyu', '目 idioms', '眼 idioms', 'chinese eye expressions'],
    intro: 'The eye (目, mù or 眼, yǎn) in Chinese idioms represents vision, insight, and understanding. These expressions teach about perception and seeing truth beyond appearances.',
    idiomIds: ['ID072', 'ID110', 'ID147', 'ID153', 'ID214', 'ID219', 'ID223', 'ID266', 'ID336', 'ID395'],
    category: 'Body & Mind',
    publishedDate: '2025-02-07'
  },
  {
    slug: 'chinese-idioms-with-hand',
    title: '10 Handy Chinese Idioms With Hand (手)',
    description: 'Master Chinese idioms featuring the hand (手), about skill, action, and capability.',
    metaDescription: 'Learn 10 Chinese idioms with hand (手). These chengyu describe skills, taking action, and the power of doing.',
    keywords: ['chinese idioms with hand', 'hand chengyu', '手 idioms', 'chinese hand expressions'],
    intro: 'The hand (手, shǒu) in Chinese idioms represents action, skill, and capability. These expressions describe expertise, taking initiative, and the relationship between intention and action.',
    idiomIds: ['ID170', 'ID185', 'ID207', 'ID219', 'ID299', 'ID317', 'ID334', 'ID405', 'ID482', 'ID515'],
    category: 'Body & Mind',
    publishedDate: '2025-02-08'
  },
  // === PROGRAMMATIC LISTICLES: Numbers ===
  {
    slug: 'chinese-idioms-with-number-one',
    title: '15 Chinese Idioms With Number One (一)',
    description: 'Discover Chinese idioms featuring the number one (一), symbolizing unity, singularity, and completeness.',
    metaDescription: 'Learn 15 Chinese idioms with number one (一). These chengyu express unity, wholeness, consistency, and being the best.',
    keywords: ['chinese idioms with one', 'number one chengyu', '一 idioms', 'chinese number idioms', 'yi idioms'],
    intro: 'The number one (一, yī) in Chinese represents unity, singularity, and completeness. These idioms often express wholeness, consistency, or being singular in purpose.',
    idiomIds: ['ID001', 'ID004', 'ID006', 'ID007', 'ID010', 'ID034', 'ID057', 'ID065', 'ID072', 'ID086', 'ID097', 'ID122', 'ID141', 'ID157', 'ID188'],
    category: 'Numbers',
    publishedDate: '2025-02-09'
  },
  {
    slug: 'chinese-idioms-with-number-three',
    title: '10 Chinese Idioms With Number Three (三)',
    description: 'Learn Chinese idioms featuring the number three (三), a number of completeness and multiplicity.',
    metaDescription: 'Discover 10 Chinese idioms with number three (三). Learn chengyu about repetition, multiplicity, and the power of three.',
    keywords: ['chinese idioms with three', 'number three chengyu', '三 idioms', 'chinese number idioms', 'san idioms'],
    intro: 'The number three (三, sān) represents completeness and multiplicity in Chinese culture. In idioms, three often means "many" or emphasizes repetition and thoroughness.',
    idiomIds: ['ID007', 'ID010', 'ID039', 'ID112', 'ID131', 'ID171', 'ID206', 'ID247', 'ID250', 'ID353'],
    category: 'Numbers',
    publishedDate: '2025-02-10'
  },
  {
    slug: 'chinese-idioms-with-number-eight',
    title: '8 Lucky Chinese Idioms With Number Eight (八)',
    description: 'Explore auspicious Chinese idioms featuring eight (八), the luckiest number in Chinese culture.',
    metaDescription: 'Learn 8 lucky Chinese idioms with number eight (八). Discover why 8 is the luckiest number and how it appears in classic chengyu.',
    keywords: ['chinese idioms with eight', 'number eight chengyu', '八 idioms', 'lucky chinese idioms', 'ba idioms'],
    intro: 'The number eight (八, bā) is considered the luckiest number in Chinese culture because it sounds like "prosperity" (发, fā). These idioms featuring eight carry special significance.',
    idiomIds: ['ID220', 'ID308', 'ID317', 'ID319', 'ID322', 'ID376', 'ID384', 'ID388'],
    category: 'Numbers',
    publishedDate: '2025-02-11'
  },
  // === PROGRAMMATIC LISTICLES: Nature ===
  {
    slug: 'chinese-idioms-about-wind',
    title: '12 Chinese Idioms About Wind (风)',
    description: 'Master Chinese idioms featuring wind (风), symbolizing change, influence, and natural forces.',
    metaDescription: 'Discover 12 Chinese idioms about wind (风). Learn chengyu about change, reputation, speed, and the forces of nature.',
    keywords: ['chinese idioms about wind', 'wind chengyu', '风 idioms', 'chinese wind expressions', 'feng idioms'],
    intro: 'Wind (风, fēng) in Chinese idioms represents change, influence, reputation, and natural forces. These expressions describe everything from swift action to social trends.',
    idiomIds: ['ID035', 'ID040', 'ID046', 'ID054', 'ID064', 'ID127', 'ID187', 'ID203', 'ID264', 'ID265', 'ID327', 'ID342'],
    category: 'Nature',
    publishedDate: '2025-02-12'
  },
  {
    slug: 'chinese-idioms-about-water',
    title: '12 Flowing Chinese Idioms About Water (水)',
    description: 'Learn Chinese idioms featuring water (水), embodying adaptability, purity, and life force.',
    metaDescription: 'Master 12 Chinese idioms about water (水). These chengyu teach wisdom about adaptability, persistence, and the flow of life.',
    keywords: ['chinese idioms about water', 'water chengyu', '水 idioms', 'chinese water expressions', 'shui idioms'],
    intro: 'Water (水, shuǐ) embodies adaptability, persistence, and life itself in Chinese philosophy. Inspired by Taoist teachings, these idioms reveal profound wisdom about going with the flow.',
    idiomIds: ['ID009', 'ID019', 'ID026', 'ID076', 'ID104', 'ID113', 'ID134', 'ID172', 'ID196', 'ID227', 'ID311', 'ID382'],
    category: 'Nature',
    publishedDate: '2025-02-13'
  },
  {
    slug: 'chinese-idioms-about-mountain',
    title: '10 Majestic Chinese Idioms About Mountains (山)',
    description: 'Explore Chinese idioms featuring mountains (山), symbolizing stability, challenges, and grandeur.',
    metaDescription: 'Learn 10 Chinese idioms about mountains (山). These chengyu describe stability, overcoming challenges, and the majesty of nature.',
    keywords: ['chinese idioms about mountain', 'mountain chengyu', '山 idioms', 'chinese mountain expressions', 'shan idioms'],
    intro: 'Mountains (山, shān) represent stability, challenges, and eternal grandeur in Chinese culture. These idioms draw on mountain imagery to express perseverance and perspective.',
    idiomIds: ['ID117', 'ID196', 'ID233', 'ID255', 'ID305', 'ID354', 'ID428', 'ID499', 'ID627', 'ID628'],
    category: 'Nature',
    publishedDate: '2025-02-14'
  },
  {
    slug: 'chinese-idioms-about-fire',
    title: '10 Fiery Chinese Idioms About Fire (火)',
    description: 'Discover Chinese idioms featuring fire (火), representing passion, urgency, and transformation.',
    metaDescription: 'Master 10 Chinese idioms about fire (火). Learn chengyu about passion, anger, urgency, and the transformative power of fire.',
    keywords: ['chinese idioms about fire', 'fire chengyu', '火 idioms', 'chinese fire expressions', 'huo idioms'],
    intro: 'Fire (火, huǒ) represents passion, urgency, anger, and transformation in Chinese culture. These idioms capture the intensity and power of fire in human experience.',
    idiomIds: ['ID070', 'ID105', 'ID159', 'ID174', 'ID198', 'ID357', 'ID380', 'ID460', 'ID544', 'ID671'],
    category: 'Nature',
    publishedDate: '2025-02-15'
  },
  {
    slug: 'chinese-idioms-about-sky-heaven',
    title: '12 Chinese Idioms About Sky & Heaven (天)',
    description: 'Learn Chinese idioms featuring sky/heaven (天), representing the divine, fate, and limitless possibility.',
    metaDescription: 'Discover 12 Chinese idioms about sky and heaven (天). These chengyu explore fate, divine providence, and boundless potential.',
    keywords: ['chinese idioms about sky', 'heaven chengyu', '天 idioms', 'chinese heaven expressions', 'tian idioms'],
    intro: 'The sky/heaven (天, tiān) represents the divine order, fate, and limitless possibility in Chinese thought. These idioms explore the relationship between humans and the cosmos.',
    idiomIds: ['ID014', 'ID094', 'ID175', 'ID197', 'ID211', 'ID251', 'ID352', 'ID385', 'ID400', 'ID485', 'ID510', 'ID607'],
    category: 'Nature',
    publishedDate: '2025-02-16'
  },
  // === PROGRAMMATIC LISTICLES: Occasions ===
  {
    slug: 'chinese-idioms-for-new-year',
    title: '15 Auspicious Chinese Idioms for New Year Wishes',
    description: 'Master the best Chinese idioms for New Year greetings, blessings, and celebrations.',
    metaDescription: 'Learn 15 auspicious Chinese idioms for New Year. Perfect chengyu for CNY greetings, red envelopes, and holiday wishes.',
    keywords: ['chinese new year idioms', 'cny greetings chengyu', 'lunar new year phrases', 'chinese new year wishes', 'spring festival idioms'],
    intro: 'Chinese New Year is the perfect time to use auspicious idioms (吉祥成语). These expressions bring good fortune, prosperity, and happiness - ideal for greetings and red envelope messages.',
    idiomIds: ['ID154', 'ID307', 'ID436'],
    category: 'Occasions',
    publishedDate: '2025-02-17'
  },
  {
    slug: 'chinese-idioms-for-weddings',
    title: '10 Romantic Chinese Idioms for Weddings & Marriage',
    description: 'Beautiful Chinese idioms perfect for wedding wishes, toasts, and celebrating love.',
    metaDescription: 'Discover 10 romantic Chinese idioms for weddings. Perfect chengyu for wedding wishes, invitations, and celebrating eternal love.',
    keywords: ['chinese wedding idioms', 'marriage chengyu', 'wedding wishes chinese', 'romantic chinese sayings', 'love idioms chinese'],
    intro: 'Chinese weddings traditionally incorporate auspicious idioms (成语) to bless the couple. These expressions wish for eternal love, happiness, and harmony.',
    idiomIds: ['ID056', 'ID300', 'ID314', 'ID473', 'ID597', 'ID603', 'ID605'],
    category: 'Occasions',
    publishedDate: '2025-02-18'
  },
  {
    slug: 'chinese-idioms-for-graduation',
    title: '10 Inspiring Chinese Idioms for Graduation',
    description: 'Motivational Chinese idioms perfect for graduation wishes and academic achievements.',
    metaDescription: 'Learn 10 inspiring Chinese idioms for graduation. Perfect chengyu for wishing success, bright futures, and celebrating academic achievement.',
    keywords: ['chinese graduation idioms', 'academic success chengyu', 'graduation wishes chinese', 'student idioms', 'achievement chinese sayings'],
    intro: 'Graduation marks a major milestone in Chinese culture. These idioms celebrate academic achievement and wish graduates success in their future endeavors.',
    idiomIds: ['ID036', 'ID051', 'ID052', 'ID076', 'ID106', 'ID109', 'ID119', 'ID122', 'ID221', 'ID260'],
    category: 'Occasions',
    publishedDate: '2025-02-19'
  },
  // === BATCH 2: More Animals ===
  {
    slug: 'chinese-idioms-with-rooster',
    title: '8 Bold Chinese Idioms With Rooster (鸡)',
    description: 'Explore Chinese idioms featuring the rooster (鸡), representing punctuality, courage, and vigilance.',
    metaDescription: 'Learn 8 bold Chinese idioms with rooster (鸡). These chengyu celebrate alertness, courage, and the dawn of new beginnings.',
    keywords: ['chinese idioms with rooster', 'rooster chengyu', '鸡 idioms', 'year of the rooster idioms', 'chinese rooster sayings'],
    intro: 'The rooster (鸡, jī) represents punctuality, courage, and vigilance in Chinese culture. Crowing at dawn, the rooster symbolizes new beginnings and reliability.',
    idiomIds: ['ID063', 'ID108', 'ID312', 'ID347', 'ID402'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-21'
  },
  {
    slug: 'chinese-idioms-with-bird',
    title: '10 Soaring Chinese Idioms With Bird (鸟)',
    description: 'Explore Chinese idioms featuring birds (鸟), representing freedom, aspiration, and natural beauty.',
    metaDescription: 'Learn 10 soaring Chinese idioms with bird (鸟). These chengyu celebrate freedom, high aspirations, and the beauty of nature.',
    keywords: ['chinese idioms with bird', 'bird chengyu', '鸟 idioms', 'chinese bird sayings', 'phoenix idioms'],
    intro: 'Birds (鸟, niǎo) in Chinese idioms represent freedom, aspiration, and natural beauty. From the phoenix to the crane, bird imagery carries profound cultural meaning.',
    idiomIds: ['ID032', 'ID034', 'ID046', 'ID108', 'ID126', 'ID222', 'ID427', 'ID527'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-27'
  },
  {
    slug: 'chinese-idioms-with-fish',
    title: '8 Abundant Chinese Idioms With Fish (鱼)',
    description: 'Discover Chinese idioms featuring fish (鱼), symbolizing abundance, prosperity, and good fortune.',
    metaDescription: 'Learn 8 abundant Chinese idioms with fish (鱼). These chengyu bring luck and prosperity - essential for Chinese New Year celebrations.',
    keywords: ['chinese idioms with fish', 'fish chengyu', '鱼 idioms', 'chinese fish sayings', 'nian nian you yu'],
    intro: 'Fish (鱼, yú) symbolizes abundance and prosperity in Chinese culture because it sounds like "surplus" (余). Fish idioms are especially popular during New Year.',
    idiomIds: ['ID113', 'ID223', 'ID286', 'ID341'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-02-28'
  },
  // === BATCH 2: More Occasions ===
  {
    slug: 'chinese-idioms-for-birthday',
    title: '10 Auspicious Chinese Idioms for Birthday Wishes',
    description: 'Perfect Chinese idioms for birthday greetings, wishing longevity, happiness, and success.',
    metaDescription: 'Learn 10 auspicious Chinese idioms for birthday wishes. These chengyu express hopes for longevity, health, and endless blessings.',
    keywords: ['chinese birthday idioms', 'birthday wishes chinese', 'longevity chengyu', 'chinese birthday greetings', 'shou bi nan shan'],
    intro: 'Birthdays in Chinese culture are celebrated with special idioms (成语) wishing longevity, health, and prosperity. These expressions are perfect for cards and toasts.',
    idiomIds: ['ID158', 'ID173', 'ID190', 'ID230', 'ID295', 'ID303', 'ID315', 'ID338', 'ID385', 'ID415'],
    category: 'Occasions',
    publishedDate: '2025-03-01'
  },
  {
    slug: 'chinese-idioms-for-condolences',
    title: '8 Respectful Chinese Idioms for Condolences & Sympathy',
    description: 'Appropriate Chinese idioms for expressing condolences, sympathy, and respect during difficult times.',
    metaDescription: 'Learn 8 respectful Chinese idioms for condolences. These chengyu express sympathy, honor the departed, and offer comfort.',
    keywords: ['chinese condolence idioms', 'sympathy chinese phrases', 'funeral chengyu', 'chinese mourning expressions', 'rest in peace chinese'],
    intro: 'Chinese culture has profound idioms (成语) for expressing condolences and sympathy. These respectful expressions offer comfort while honoring the departed.',
    idiomIds: ['ID016', 'ID039', 'ID045', 'ID091', 'ID118', 'ID134', 'ID137', 'ID180'],
    category: 'Occasions',
    publishedDate: '2025-03-02'
  },
  {
    slug: 'chinese-idioms-for-mid-autumn-festival',
    title: '10 Lunar Chinese Idioms for Mid-Autumn Festival',
    description: 'Beautiful Chinese idioms for the Mid-Autumn Festival, celebrating the moon, reunion, and harvest.',
    metaDescription: 'Learn 10 beautiful Chinese idioms for Mid-Autumn Festival. These chengyu celebrate the full moon, family reunion, and autumn harvest.',
    keywords: ['mid-autumn festival idioms', 'moon festival chengyu', 'chinese moon idioms', 'zhong qiu jie sayings', 'mooncake festival expressions'],
    intro: 'The Mid-Autumn Festival (中秋节) celebrates the full moon and family reunion. These idioms capture the beauty of the moon and the joy of gathering together.',
    idiomIds: ['ID023', 'ID055', 'ID084', 'ID088', 'ID089', 'ID097', 'ID104', 'ID114', 'ID120', 'ID177'],
    category: 'Occasions',
    publishedDate: '2025-03-03'
  },
  {
    slug: 'chinese-idioms-for-dragon-boat-festival',
    title: '8 Spirited Chinese Idioms for Dragon Boat Festival',
    description: 'Energetic Chinese idioms for the Dragon Boat Festival, celebrating competition, tradition, and remembrance.',
    metaDescription: 'Learn 8 spirited Chinese idioms for Dragon Boat Festival. These chengyu capture the spirit of racing, tradition, and honoring Qu Yuan.',
    keywords: ['dragon boat festival idioms', 'duan wu jie chengyu', 'chinese festival idioms', 'qu yuan sayings', 'zongzi festival expressions'],
    intro: 'The Dragon Boat Festival (端午节) honors the poet Qu Yuan with boat races and zongzi. These idioms capture the competitive spirit and cultural traditions.',
    idiomIds: ['ID017', 'ID025', 'ID026', 'ID031', 'ID035', 'ID225', 'ID262', 'ID271'],
    category: 'Occasions',
    publishedDate: '2025-03-04'
  },
  // === MORE OCCASION LISTICLES ===
  {
    slug: 'chinese-idioms-for-spring-festival',
    title: '10 Festive Chinese Idioms for Spring Festival (春节)',
    description: 'Essential Chinese idioms for celebrating Spring Festival with wishes of prosperity, luck, and family reunion.',
    metaDescription: 'Learn 10 festive Chinese idioms for Spring Festival. These chengyu bring prosperity, luck, and joy to Chinese New Year celebrations.',
    keywords: ['spring festival idioms', 'chun jie chengyu', 'chinese new year phrases', 'cny greetings', 'lunar new year wishes'],
    intro: 'Spring Festival (春节, Chūn Jié) is the most important Chinese holiday. These festive idioms capture the spirit of renewal, prosperity, and family togetherness.',
    idiomIds: ['ID016', 'ID040', 'ID085', 'ID095', 'ID185', 'ID395', 'ID414', 'ID469', 'ID496', 'ID525'],
    category: 'Occasions',
    publishedDate: '2025-03-05'
  },
  {
    slug: 'chinese-idioms-for-lantern-festival',
    title: '8 Luminous Chinese Idioms for Lantern Festival (元宵节)',
    description: 'Beautiful Chinese idioms for the Lantern Festival, celebrating lights, reunion, and the first full moon.',
    metaDescription: 'Discover 8 luminous Chinese idioms for Lantern Festival. These chengyu celebrate brightness, reunion, and new beginnings.',
    keywords: ['lantern festival idioms', 'yuan xiao jie chengyu', 'chinese lantern sayings', 'first full moon idioms'],
    intro: 'The Lantern Festival (元宵节) marks the end of Spring Festival celebrations with lanterns and reunion. These idioms capture its luminous spirit.',
    idiomIds: ['ID023', 'ID055', 'ID084', 'ID089', 'ID104', 'ID169', 'ID177', 'ID298'],
    category: 'Occasions',
    publishedDate: '2025-03-06'
  },
  {
    slug: 'chinese-idioms-for-qingming-festival',
    title: '8 Reflective Chinese Idioms for Qingming Festival',
    description: 'Thoughtful Chinese idioms for Qingming (Tomb Sweeping Day), honoring ancestors and reflecting on life.',
    metaDescription: 'Learn 8 reflective Chinese idioms for Qingming Festival. These chengyu express respect for ancestors and contemplation of life.',
    keywords: ['qingming festival idioms', 'tomb sweeping day chengyu', 'ancestor worship phrases', 'qing ming jie sayings'],
    intro: 'Qingming Festival (清明节) is a time for honoring ancestors and reflecting on life\'s continuity. These idioms express remembrance and respect.',
    idiomIds: ['ID016', 'ID032', 'ID039', 'ID045', 'ID055', 'ID084', 'ID089', 'ID091'],
    category: 'Occasions',
    publishedDate: '2025-03-07'
  },
  {
    slug: 'chinese-idioms-for-chinese-valentines-day',
    title: '10 Romantic Chinese Idioms for Qixi Festival (七夕)',
    description: 'Romantic Chinese idioms for Qixi Festival (Chinese Valentine\'s Day), celebrating love and devotion.',
    metaDescription: 'Discover 10 romantic Chinese idioms for Qixi Festival. Perfect chengyu for expressing love on Chinese Valentine\'s Day.',
    keywords: ['qixi festival idioms', 'chinese valentines day phrases', 'qi xi jie chengyu', 'romantic chinese expressions', 'love idioms chinese'],
    intro: 'Qixi Festival (七夕) celebrates the legendary love of the Cowherd and Weaver Girl. These romantic idioms express eternal devotion and love.',
    idiomIds: ['ID008', 'ID056', 'ID136', 'ID151', 'ID166', 'ID183', 'ID208', 'ID256', 'ID286', 'ID299'],
    category: 'Occasions',
    publishedDate: '2025-03-08'
  },
  {
    slug: 'chinese-idioms-for-double-ninth-festival',
    title: '8 Longevity Chinese Idioms for Double Ninth Festival (重阳节)',
    description: 'Auspicious Chinese idioms for the Double Ninth Festival, celebrating longevity and honoring elders.',
    metaDescription: 'Learn 8 longevity Chinese idioms for Double Ninth Festival. These chengyu honor elders and wish for long, healthy lives.',
    keywords: ['double ninth festival idioms', 'chongyang jie chengyu', 'elderly day phrases', 'longevity chinese expressions'],
    intro: 'The Double Ninth Festival (重阳节) honors elders and celebrates longevity. These idioms express wishes for long life and respect for seniors.',
    idiomIds: ['ID051', 'ID057', 'ID066', 'ID071', 'ID115', 'ID133', 'ID167', 'ID196'],
    category: 'Occasions',
    publishedDate: '2025-03-09'
  },
  {
    slug: 'chinese-idioms-for-housewarming',
    title: '10 Auspicious Chinese Idioms for Housewarming',
    description: 'Lucky Chinese idioms for housewarming celebrations, wishing prosperity and peace in a new home.',
    metaDescription: 'Discover 10 auspicious Chinese idioms for housewarming. Perfect chengyu for blessing a new home with prosperity and harmony.',
    keywords: ['housewarming idioms chinese', 'new home wishes chinese', 'moving house chengyu', 'chinese home blessing phrases'],
    intro: 'Moving into a new home is a significant milestone in Chinese culture. These auspicious idioms bring blessings of prosperity, harmony, and good fortune.',
    idiomIds: ['ID011', 'ID117', 'ID121', 'ID142', 'ID160', 'ID198', 'ID231', 'ID249', 'ID301', 'ID303'],
    category: 'Occasions',
    publishedDate: '2025-03-10'
  },
  {
    slug: 'chinese-idioms-for-career-success',
    title: '12 Ambitious Chinese Idioms for Career Success',
    description: 'Motivational Chinese idioms for career advancement, professional success, and achieving your goals.',
    metaDescription: 'Learn 12 ambitious Chinese idioms for career success. These chengyu inspire professional growth and achievement.',
    keywords: ['career success idioms chinese', 'job promotion chengyu', 'professional chinese phrases', 'work success expressions'],
    intro: 'Career success is highly valued in Chinese culture. These ambitious idioms inspire professional excellence and the achievement of your goals.',
    idiomIds: ['ID036', 'ID052', 'ID053', 'ID076', 'ID082', 'ID106', 'ID109', 'ID119', 'ID122', 'ID129', 'ID131', 'ID156'],
    category: 'Occasions',
    publishedDate: '2025-03-11'
  },
  {
    slug: 'chinese-idioms-for-new-baby',
    title: '8 Joyful Chinese Idioms for New Baby Congratulations',
    description: 'Heartwarming Chinese idioms to congratulate new parents and bless newborn babies.',
    metaDescription: 'Learn 8 joyful Chinese idioms for new baby congratulations. Perfect chengyu for blessing newborns and celebrating new parents.',
    keywords: ['new baby idioms chinese', 'baby congratulations chengyu', 'newborn wishes chinese', 'birth celebration phrases'],
    intro: 'The birth of a child is one of life\'s greatest blessings in Chinese culture. These joyful idioms celebrate new life and wish the baby health and happiness.',
    idiomIds: ['ID079', 'ID242', 'ID415', 'ID489', 'ID550', 'ID568', 'ID569', 'ID571'],
    category: 'Occasions',
    publishedDate: '2025-03-12'
  },
  {
    slug: 'chinese-idioms-for-retirement',
    title: '8 Peaceful Chinese Idioms for Retirement Wishes',
    description: 'Thoughtful Chinese idioms for retirement, wishing happiness, leisure, and well-deserved rest.',
    metaDescription: 'Discover 8 peaceful Chinese idioms for retirement wishes. These chengyu celebrate a life well-lived and years of leisure ahead.',
    keywords: ['retirement idioms chinese', 'retirement wishes chengyu', 'golden years phrases', 'senior blessing chinese'],
    intro: 'Retirement marks the beginning of a well-deserved period of rest and enjoyment. These peaceful idioms wish retirees happiness and fulfillment.',
    idiomIds: ['ID173', 'ID221', 'ID295', 'ID301', 'ID303', 'ID304', 'ID305', 'ID315'],
    category: 'Occasions',
    publishedDate: '2025-03-13'
  },
  {
    slug: 'chinese-idioms-for-get-well-soon',
    title: '8 Healing Chinese Idioms for Get Well Soon Wishes',
    description: 'Caring Chinese idioms to wish someone a speedy recovery and good health.',
    metaDescription: 'Learn 8 healing Chinese idioms for get well soon wishes. These chengyu express care and hope for a quick recovery.',
    keywords: ['get well soon idioms chinese', 'recovery wishes chengyu', 'health blessing chinese', 'speedy recovery phrases'],
    intro: 'When someone is ill, the right words can bring comfort and hope. These caring idioms express wishes for speedy recovery and good health.',
    idiomIds: ['ID242', 'ID301', 'ID303', 'ID304', 'ID305', 'ID418', 'ID524', 'ID536'],
    category: 'Occasions',
    publishedDate: '2025-03-14'
  },
  {
    slug: 'chinese-idioms-for-encouragement',
    title: '10 Motivational Chinese Idioms for Encouragement',
    description: 'Inspiring Chinese idioms to encourage and motivate someone facing challenges.',
    metaDescription: 'Discover 10 motivational Chinese idioms for encouragement. These chengyu inspire courage, perseverance, and the will to succeed.',
    keywords: ['encouragement idioms chinese', 'motivational chengyu', 'jia you phrases', 'chinese inspiration sayings'],
    intro: 'When someone faces challenges, the right words can make all the difference. These motivational idioms inspire courage and perseverance.',
    idiomIds: ['ID082', 'ID168', 'ID241', 'ID282', 'ID439', 'ID483', 'ID490', 'ID596', 'ID636', 'ID637'],
    category: 'Occasions',
    publishedDate: '2025-03-15'
  },
  // === NEW LISTICLES: Emotions ===
  {
    slug: 'chinese-idioms-about-anger',
    title: '10 Chinese Idioms About Anger & Losing Your Temper',
    description: 'Expressive Chinese idioms about anger, rage, and losing one\'s temper - learn how Chinese culture describes fury.',
    metaDescription: 'Learn 10 Chinese idioms about anger and rage. These chengyu vividly describe fury, losing temper, and emotional outbursts in Mandarin.',
    keywords: ['chinese idioms about anger', 'angry chinese phrases', 'chengyu for rage', 'chinese temper expressions', 'mandarin anger idioms'],
    intro: 'Chinese idioms offer vivid and poetic ways to describe anger and emotional outbursts. From flames shooting from one\'s head to thunder and lightning, these expressions capture the intensity of human fury.',
    idiomIds: ['ID070', 'ID105', 'ID159', 'ID174', 'ID198', 'ID357', 'ID380', 'ID460', 'ID544', 'ID569'],
    category: 'Emotions',
    publishedDate: '2025-03-16'
  },
  {
    slug: 'chinese-idioms-about-happiness',
    title: '10 Joyful Chinese Idioms About Happiness & Delight',
    description: 'Beautiful Chinese idioms expressing happiness, joy, and contentment - discover how Chinese culture celebrates positive emotions.',
    metaDescription: 'Discover 10 joyful Chinese idioms about happiness and delight. These chengyu express joy, contentment, and positive emotions in Mandarin.',
    keywords: ['chinese idioms about happiness', 'happy chinese phrases', 'chengyu for joy', 'chinese delight expressions', 'mandarin happiness idioms'],
    intro: 'Happiness and contentment are celebrated in Chinese culture through beautiful idiomatic expressions. These idioms capture different shades of joy, from quiet satisfaction to overwhelming delight.',
    idiomIds: ['ID173', 'ID295', 'ID303', 'ID315', 'ID407', 'ID415', 'ID462', 'ID489', 'ID517', 'ID568'],
    category: 'Emotions',
    publishedDate: '2025-03-17'
  },
  {
    slug: 'chinese-idioms-about-fear',
    title: '10 Chinese Idioms About Fear & Anxiety',
    description: 'Vivid Chinese idioms describing fear, anxiety, and nervousness - learn how Chinese language expresses worry and dread.',
    metaDescription: 'Learn 10 Chinese idioms about fear and anxiety. These chengyu vividly describe nervousness, worry, and dread in Mandarin.',
    keywords: ['chinese idioms about fear', 'anxiety chinese phrases', 'chengyu for worry', 'chinese nervous expressions', 'mandarin fear idioms'],
    intro: 'Fear and anxiety are universal human experiences, and Chinese idioms capture these emotions with vivid imagery. From seeing soldiers in every blade of grass to hearts hanging by a thread, these expressions paint powerful pictures of worry and dread.',
    idiomIds: ['ID046', 'ID135', 'ID155', 'ID211', 'ID272', 'ID293', 'ID316', 'ID363', 'ID374', 'ID449'],
    category: 'Emotions',
    publishedDate: '2025-03-18'
  },
  {
    slug: 'chinese-idioms-about-sadness',
    title: '8 Chinese Idioms About Sadness & Sorrow',
    description: 'Poignant Chinese idioms expressing sadness, grief, and sorrow - understand how Chinese culture articulates melancholy.',
    metaDescription: 'Discover 8 poignant Chinese idioms about sadness and sorrow. These chengyu express grief, melancholy, and heartache in Mandarin.',
    keywords: ['chinese idioms about sadness', 'sad chinese phrases', 'chengyu for grief', 'chinese sorrow expressions', 'mandarin melancholy idioms'],
    intro: 'Chinese literature and poetry have long explored the depths of human sorrow. These idioms capture different aspects of sadness, from quiet melancholy to profound grief.',
    idiomIds: ['ID029', 'ID183', 'ID227', 'ID382', 'ID385', 'ID574', 'ID160', 'ID188'],
    category: 'Emotions',
    publishedDate: '2025-03-19'
  },
  // === NEW LISTICLES: Seasons ===
  {
    slug: 'chinese-idioms-about-spring',
    title: '10 Refreshing Chinese Idioms About Spring',
    description: 'Beautiful Chinese idioms celebrating spring, renewal, and new beginnings - poetic expressions of the season of rebirth.',
    metaDescription: 'Learn 10 refreshing Chinese idioms about spring. These chengyu celebrate renewal, growth, and new beginnings in Mandarin.',
    keywords: ['chinese idioms about spring', 'spring chinese phrases', 'chengyu for renewal', 'chinese new beginnings expressions', 'mandarin spring idioms'],
    intro: 'Spring holds special significance in Chinese culture as a time of renewal and hope. These idioms capture the essence of the season - from gentle spring rains nurturing growth to bamboo shoots emerging after the thaw.',
    idiomIds: ['ID040', 'ID095', 'ID185', 'ID395', 'ID414', 'ID517', 'ID586', 'ID037', 'ID179', 'ID265'],
    category: 'Nature',
    publishedDate: '2025-03-20'
  },
  {
    slug: 'chinese-idioms-about-autumn',
    title: '8 Poetic Chinese Idioms About Autumn',
    description: 'Evocative Chinese idioms about autumn, harvest, and reflection - discover the poetry of the fall season.',
    metaDescription: 'Discover 8 poetic Chinese idioms about autumn. These chengyu capture harvest, reflection, and the beauty of fall in Mandarin.',
    keywords: ['chinese idioms about autumn', 'fall chinese phrases', 'chengyu for autumn', 'chinese harvest expressions', 'mandarin fall idioms'],
    intro: 'Autumn in Chinese culture symbolizes harvest, maturity, and contemplation. These idioms draw from the season\'s imagery of clear skies, falling leaves, and the subtle signs of change.',
    idiomIds: ['ID089', 'ID097', 'ID382', 'ID587', 'ID075', 'ID088', 'ID154', 'ID109'],
    category: 'Nature',
    publishedDate: '2025-03-21'
  },
  {
    slug: 'chinese-idioms-about-winter',
    title: '8 Chinese Idioms About Winter & Cold',
    description: 'Striking Chinese idioms about winter, snow, and enduring the cold - expressions of resilience in harsh times.',
    metaDescription: 'Learn 8 striking Chinese idioms about winter and cold. These chengyu capture resilience, purity, and endurance in Mandarin.',
    keywords: ['chinese idioms about winter', 'cold chinese phrases', 'chengyu for snow', 'chinese ice expressions', 'mandarin winter idioms'],
    intro: 'Winter imagery in Chinese idioms often represents purity, resilience, and the strength to endure hardship. These expressions draw from snow, ice, and the stark beauty of the cold season.',
    idiomIds: ['ID058', 'ID101', 'ID102', 'ID145', 'ID240', 'ID275', 'ID343', 'ID490'],
    category: 'Nature',
    publishedDate: '2025-03-22'
  },
  // === NEW LISTICLES: Numbers ===
  {
    slug: 'chinese-idioms-with-number-two',
    title: '8 Chinese Idioms With the Number Two (二/两)',
    description: 'Chinese idioms featuring the number two - expressions about pairs, duality, and achieving two goals at once.',
    metaDescription: 'Learn 8 Chinese idioms with the number two. These chengyu explore duality, pairs, and double achievements in Mandarin.',
    keywords: ['chinese idioms number two', 'number 2 chinese phrases', 'chengyu with two', 'chinese duality expressions', 'mandarin pair idioms'],
    intro: 'The number two in Chinese culture represents pairs, balance, and duality. These idioms often express the idea of achieving multiple goals or the relationship between two entities.',
    idiomIds: ['ID034', 'ID130', 'ID308', 'ID470', 'ID541', 'ID182', 'ID399', 'ID236'],
    category: 'Numbers',
    publishedDate: '2025-03-23'
  },
  {
    slug: 'chinese-idioms-with-number-four',
    title: '8 Chinese Idioms With the Number Four (四)',
    description: 'Chinese idioms featuring the number four - expressions about all directions and comprehensive coverage.',
    metaDescription: 'Discover 8 Chinese idioms with the number four. These chengyu express completeness and all directions in Mandarin.',
    keywords: ['chinese idioms number four', 'number 4 chinese phrases', 'chengyu with four', 'chinese directions expressions', 'mandarin four idioms'],
    intro: 'Despite four being considered unlucky in some contexts, it appears in many powerful idioms representing completeness and universality - the four directions, four seas, and comprehensive scope.',
    idiomIds: ['ID029', 'ID121', 'ID353', 'ID384', 'ID616', 'ID220', 'ID317', 'ID319'],
    category: 'Numbers',
    publishedDate: '2025-03-24'
  },
  {
    slug: 'chinese-idioms-with-number-seven',
    title: '8 Chinese Idioms With the Number Seven (七)',
    description: 'Chinese idioms featuring the number seven - expressions often paired with eight to describe chaos or activity.',
    metaDescription: 'Learn 8 Chinese idioms with the number seven. These chengyu often describe disorder or bustling activity in Mandarin.',
    keywords: ['chinese idioms number seven', 'number 7 chinese phrases', 'chengyu with seven', 'chinese chaos expressions', 'mandarin seven idioms'],
    intro: 'Seven often appears alongside eight in Chinese idioms, creating vivid expressions of disorder, busy activity, or emotional turmoil. These pairings create memorable images of chaos and complexity.',
    idiomIds: ['ID220', 'ID317', 'ID319', 'ID410', 'ID322', 'ID353', 'ID308', 'ID384'],
    category: 'Numbers',
    publishedDate: '2025-03-25'
  },
  {
    slug: 'chinese-idioms-with-number-nine',
    title: '8 Chinese Idioms With the Number Nine (九)',
    description: 'Chinese idioms featuring the auspicious number nine - expressions of longevity, abundance, and imperial power.',
    metaDescription: 'Discover 8 Chinese idioms with the lucky number nine. These chengyu express abundance and significance in Mandarin.',
    keywords: ['chinese idioms number nine', 'number 9 chinese phrases', 'chengyu with nine', 'chinese lucky expressions', 'mandarin nine idioms'],
    intro: 'Nine is one of the most auspicious numbers in Chinese culture, associated with the emperor, longevity, and eternity. These idioms harness its powerful symbolism of abundance and permanence.',
    idiomIds: ['ID057', 'ID322', 'ID383', 'ID141', 'ID186', 'ID451', 'ID496', 'ID625'],
    category: 'Numbers',
    publishedDate: '2025-03-26'
  },
  {
    slug: 'chinese-idioms-with-number-hundred',
    title: '10 Chinese Idioms With Hundred (百)',
    description: 'Powerful Chinese idioms featuring hundred - expressions of perseverance, completeness, and large quantities.',
    metaDescription: 'Learn 10 powerful Chinese idioms with hundred. These chengyu express perseverance and completeness in Mandarin.',
    keywords: ['chinese idioms hundred', 'bai chinese phrases', 'chengyu with hundred', 'chinese perseverance expressions', 'mandarin hundred idioms'],
    intro: 'Hundred (百) in Chinese idioms represents completeness, numerous attempts, or vast quantities. These expressions often emphasize perseverance through many trials or achieving perfection.',
    idiomIds: ['ID005', 'ID022', 'ID038', 'ID186', 'ID307', 'ID438', 'ID496', 'ID543', 'ID308', 'ID032'],
    category: 'Numbers',
    publishedDate: '2025-03-27'
  },
  {
    slug: 'chinese-idioms-with-number-thousand',
    title: '10 Chinese Idioms With Thousand (千) & Ten Thousand (万)',
    description: 'Grand Chinese idioms featuring thousand and ten thousand - expressions of vast scale and immense value.',
    metaDescription: 'Discover 10 grand Chinese idioms with thousand and ten thousand. These chengyu express immense scale in Mandarin.',
    keywords: ['chinese idioms thousand', 'qian chinese phrases', 'chengyu with thousand', 'chinese scale expressions', 'mandarin ten thousand idioms'],
    intro: 'Thousand (千) and ten thousand (万) appear in idioms expressing vast quantities, immense value, or endless variety. These powerful expressions capture the grandeur of scale in Chinese thought.',
    idiomIds: ['ID141', 'ID186', 'ID451', 'ID625', 'ID629', 'ID383', 'ID496', 'ID385', 'ID510', 'ID307'],
    category: 'Numbers',
    publishedDate: '2025-03-28'
  },
  // === NEW LISTICLES: High-Value Themes ===
  {
    slug: 'chinese-idioms-about-wisdom',
    title: '10 Chinese Idioms About Wisdom & Intelligence',
    description: 'Profound Chinese idioms about wisdom, cleverness, and intellectual insight - ancient Chinese perspectives on intelligence.',
    metaDescription: 'Learn 10 profound Chinese idioms about wisdom and intelligence. These chengyu express cleverness and insight in Mandarin.',
    keywords: ['chinese idioms about wisdom', 'smart chinese phrases', 'chengyu for intelligence', 'chinese clever expressions', 'mandarin wisdom idioms'],
    intro: 'Chinese culture has long valued wisdom and intellectual insight. These idioms capture different aspects of intelligence - from keen perception to strategic thinking and the humility of true wisdom.',
    idiomIds: ['ID010', 'ID045', 'ID055', 'ID073', 'ID084', 'ID089', 'ID091', 'ID104', 'ID177', 'ID298'],
    category: 'Wisdom',
    publishedDate: '2025-03-29'
  },
  {
    slug: 'chinese-idioms-about-honesty',
    title: '10 Chinese Idioms About Honesty & Integrity',
    description: 'Noble Chinese idioms about honesty, truthfulness, and moral integrity - expressions celebrating upright character.',
    metaDescription: 'Discover 10 noble Chinese idioms about honesty and integrity. These chengyu celebrate truthfulness and moral character in Mandarin.',
    keywords: ['chinese idioms about honesty', 'integrity chinese phrases', 'chengyu for truth', 'chinese moral expressions', 'mandarin honesty idioms'],
    intro: 'Honesty and integrity are foundational virtues in Chinese ethics. These idioms celebrate truthfulness, keeping promises, and maintaining moral character even in difficult circumstances.',
    idiomIds: ['ID087', 'ID123', 'ID141', 'ID180', 'ID207', 'ID209', 'ID389', 'ID421', 'ID501', 'ID593'],
    category: 'Character',
    publishedDate: '2025-03-30'
  },
  {
    slug: 'chinese-idioms-about-karma',
    title: '8 Chinese Idioms About Karma & Consequences',
    description: 'Thought-provoking Chinese idioms about karma, cause and effect, and reaping what you sow.',
    metaDescription: 'Learn 8 thought-provoking Chinese idioms about karma and consequences. These chengyu express cause and effect in Mandarin.',
    keywords: ['chinese idioms about karma', 'karma chinese phrases', 'chengyu for consequences', 'chinese cause effect expressions', 'mandarin karma idioms'],
    intro: 'The concept of karma - that actions have consequences - runs deep in Chinese philosophy. These idioms express the idea that good and bad deeds eventually return to their source.',
    idiomIds: ['ID024', 'ID227', 'ID242', 'ID356', 'ID362', 'ID504', 'ID015', 'ID105'],
    category: 'Life Philosophy',
    publishedDate: '2025-03-31'
  },
  {
    slug: 'chinese-idioms-about-health',
    title: '8 Chinese Idioms About Health & Wellness',
    description: 'Beneficial Chinese idioms about health, healing, and physical wellbeing - ancient wisdom for modern wellness.',
    metaDescription: 'Discover 8 beneficial Chinese idioms about health and wellness. These chengyu express healing and wellbeing in Mandarin.',
    keywords: ['chinese idioms about health', 'wellness chinese phrases', 'chengyu for healing', 'chinese wellbeing expressions', 'mandarin health idioms'],
    intro: 'Health and longevity have always been prized in Chinese culture. These idioms offer wisdom about maintaining wellness, remarkable healing, and the connection between mind and body.',
    idiomIds: ['ID161', 'ID185', 'ID222', 'ID238', 'ID301', 'ID303', 'ID536', 'ID589'],
    category: 'Health',
    publishedDate: '2025-04-01'
  },
  {
    slug: 'chinese-idioms-for-teachers',
    title: '10 Chinese Idioms for Teachers & Educators',
    description: 'Inspiring Chinese idioms for teachers about education, mentorship, and the noble profession of teaching.',
    metaDescription: 'Learn 10 inspiring Chinese idioms for teachers and educators. These chengyu celebrate teaching and mentorship in Mandarin.',
    keywords: ['chinese idioms for teachers', 'education chinese phrases', 'chengyu for educators', 'chinese teaching expressions', 'mandarin teacher idioms'],
    intro: 'Teaching is one of the most respected professions in Chinese culture. These idioms celebrate educators, the art of teaching, and the profound impact mentors have on their students.',
    idiomIds: ['ID021', 'ID040', 'ID095', 'ID129', 'ID137', 'ID143', 'ID173', 'ID300', 'ID010', 'ID016'],
    category: 'Education',
    publishedDate: '2025-04-02'
  },
  {
    slug: 'chinese-idioms-for-couples',
    title: '10 Romantic Chinese Idioms for Couples',
    description: 'Beautiful Chinese idioms for couples about love, marriage, and lifelong partnership - perfect for weddings and anniversaries.',
    metaDescription: 'Discover 10 romantic Chinese idioms for couples. These chengyu express love and partnership in Mandarin.',
    keywords: ['chinese idioms for couples', 'romantic chinese phrases', 'chengyu for marriage', 'chinese wedding expressions', 'mandarin love idioms'],
    intro: 'Chinese culture has beautiful expressions for romantic love and lifelong partnership. These idioms celebrate the bond between couples, from mutual respect to growing old together.',
    idiomIds: ['ID056', 'ID248', 'ID323', 'ID385', 'ID420', 'ID600', 'ID601', 'ID602', 'ID603', 'ID118'],
    category: 'Love & Relationships',
    publishedDate: '2025-04-03'
  },
  {
    slug: 'chinese-idioms-for-parents',
    title: '10 Chinese Idioms for Parents & Parenting',
    description: 'Wise Chinese idioms about parenting, raising children, and the parent-child relationship.',
    metaDescription: 'Learn 10 wise Chinese idioms for parents about raising children. These chengyu offer parenting wisdom in Mandarin.',
    keywords: ['chinese idioms for parents', 'parenting chinese phrases', 'chengyu for family', 'chinese child-raising expressions', 'mandarin parent idioms'],
    intro: 'Parenting wisdom runs deep in Chinese culture. These idioms offer insights about raising children, the balance between nurturing and discipline, and the enduring bond between parents and children.',
    idiomIds: ['ID021', 'ID038', 'ID040', 'ID075', 'ID119', 'ID137', 'ID190', 'ID248', 'ID300', 'ID315'],
    category: 'Family',
    publishedDate: '2025-04-04'
  },
  {
    slug: 'chinese-idioms-about-aging',
    title: '8 Chinese Idioms About Aging & Growing Old',
    description: 'Respectful Chinese idioms about aging, elderly wisdom, and the journey through life\'s later years.',
    metaDescription: 'Discover 8 respectful Chinese idioms about aging and growing old. These chengyu honor elderly wisdom in Mandarin.',
    keywords: ['chinese idioms about aging', 'elderly chinese phrases', 'chengyu for old age', 'chinese wisdom expressions', 'mandarin aging idioms'],
    intro: 'Chinese culture deeply respects the elderly and values the wisdom that comes with age. These idioms honor the journey of aging, from maintaining vitality to the dignity of experience.',
    idiomIds: ['ID018', 'ID133', 'ID154', 'ID222', 'ID295', 'ID301', 'ID603', 'ID088'],
    category: 'Life Philosophy',
    publishedDate: '2025-04-05'
  },
  // === NEW LISTICLES: AI-Query Targeted ===
  {
    slug: 'chinese-proverbs-english-equivalents',
    title: '12 Chinese Idioms With English Proverb Equivalents',
    description: 'Chinese idioms that have similar meanings to famous English proverbs - bridge two languages through shared wisdom.',
    metaDescription: 'Learn 12 Chinese idioms with English proverb equivalents. These chengyu match familiar Western sayings in Mandarin.',
    keywords: ['chinese idioms english equivalent', 'chinese proverbs like english', 'chengyu translation', 'chinese sayings english meaning', 'similar proverbs chinese english'],
    intro: 'Many Chinese idioms express wisdom similar to English proverbs, showing how different cultures arrived at the same insights. These parallels help learners connect new concepts to familiar ideas.',
    idiomIds: ['ID009', 'ID014', 'ID015', 'ID018', 'ID034', 'ID074', 'ID075', 'ID076', 'ID088', 'ID091', 'ID097', 'ID141'],
    category: 'Learning',
    publishedDate: '2025-04-06'
  },
  {
    slug: 'chinese-idioms-blessing-in-disguise',
    title: '8 Chinese Idioms About Blessings in Disguise',
    description: 'Hopeful Chinese idioms about finding good in bad situations, silver linings, and unexpected fortune.',
    metaDescription: 'Discover 8 hopeful Chinese idioms about blessings in disguise. These chengyu express hope in adversity in Mandarin.',
    keywords: ['blessing in disguise chinese', 'silver lining chinese idiom', 'chengyu for hope', 'chinese optimism expressions', 'sai weng shi ma similar'],
    intro: 'The famous story of Sai Weng losing his horse teaches that misfortune can become blessing. These idioms share this optimistic wisdom about finding unexpected good in difficult situations.',
    idiomIds: ['ID018', 'ID060', 'ID084', 'ID127', 'ID156', 'ID168', 'ID260', 'ID236'],
    category: 'Life Philosophy',
    publishedDate: '2025-04-07'
  },
  {
    slug: 'famous-chinese-idioms-everyone-knows',
    title: '15 Famous Chinese Idioms Everyone Should Know',
    description: 'The most well-known Chinese idioms that every learner should master - essential chengyu for cultural fluency.',
    metaDescription: 'Master 15 famous Chinese idioms everyone knows. These essential chengyu are must-know expressions for Mandarin learners.',
    keywords: ['famous chinese idioms', 'most popular chengyu', 'essential chinese idioms', 'must know chinese expressions', 'common mandarin idioms'],
    intro: 'These are the Chinese idioms that native speakers use most frequently and expect others to know. Mastering these expressions is essential for anyone serious about Chinese language and culture.',
    idiomIds: ['ID001', 'ID005', 'ID009', 'ID010', 'ID014', 'ID017', 'ID018', 'ID021', 'ID025', 'ID042', 'ID053', 'ID074', 'ID076', 'ID084', 'ID141'],
    category: 'Learning',
    publishedDate: '2025-04-08'
  },
  {
    slug: 'chinese-idioms-with-interesting-stories',
    title: '12 Chinese Idioms With Fascinating Origin Stories',
    description: 'Chinese idioms with the most interesting historical stories behind them - learn the tales that created these expressions.',
    metaDescription: 'Discover 12 Chinese idioms with fascinating origin stories. These chengyu come with memorable historical tales.',
    keywords: ['chinese idiom stories', 'chengyu origins', 'chinese idiom history', 'interesting chinese expressions', 'mandarin idiom tales'],
    intro: 'Every Chinese idiom has a story, but some are particularly captivating. These idioms come with memorable tales from Chinese history, literature, and folklore that make them unforgettable.',
    idiomIds: ['ID017', 'ID018', 'ID023', 'ID025', 'ID042', 'ID049', 'ID059', 'ID074', 'ID123', 'ID131', 'ID138', 'ID271'],
    category: 'Learning',
    publishedDate: '2025-04-09'
  },
  // === NEW LISTICLES: More Animals ===
  {
    slug: 'chinese-idioms-with-rabbit',
    title: '8 Chinese Idioms With Rabbit (兔)',
    description: 'Chinese idioms featuring the rabbit - expressions about cleverness, caution, and unexpected outcomes.',
    metaDescription: 'Learn 8 Chinese idioms featuring the rabbit. These chengyu use rabbit imagery to express cleverness in Mandarin.',
    keywords: ['chinese idioms rabbit', 'rabbit chinese phrases', 'chengyu with rabbit', 'chinese hare expressions', 'year of rabbit idioms'],
    intro: 'The rabbit in Chinese idioms often represents cleverness, caution, and the unexpected. These expressions draw from the rabbit\'s reputation for being quick-witted and always having an escape plan.',
    idiomIds: ['ID074', 'ID247', 'ID031', 'ID035', 'ID082', 'ID182', 'ID236', 'ID399'],
    category: 'Animals',
    publishedDate: '2025-04-10'
  },
  {
    slug: 'chinese-idioms-with-sheep',
    title: '8 Chinese Idioms With Sheep & Goat (羊)',
    description: 'Chinese idioms featuring sheep and goats - expressions about gentleness, herding, and learning from mistakes.',
    metaDescription: 'Discover 8 Chinese idioms with sheep and goat. These chengyu express gentleness and wisdom in Mandarin.',
    keywords: ['chinese idioms sheep', 'goat chinese phrases', 'chengyu with sheep', 'chinese lamb expressions', 'year of sheep idioms'],
    intro: 'Sheep and goats appear in Chinese idioms representing gentleness, following the group, and importantly, learning from mistakes. The famous "mending the pen after losing sheep" teaches timeless wisdom.',
    idiomIds: ['ID138', 'ID082', 'ID043', 'ID091', 'ID161', 'ID075', 'ID088', 'ID109'],
    category: 'Animals',
    publishedDate: '2025-04-11'
  },
  // === NEW LISTICLES: More High-Value ===
  {
    slug: 'chinese-idioms-about-humility',
    title: '10 Chinese Idioms About Humility & Modesty',
    description: 'Virtuous Chinese idioms about staying humble, avoiding arrogance, and the wisdom of modesty.',
    metaDescription: 'Learn 10 virtuous Chinese idioms about humility and modesty. These chengyu teach the value of staying humble in Mandarin.',
    keywords: ['chinese idioms humility', 'modest chinese phrases', 'chengyu for humble', 'chinese modesty expressions', 'mandarin humble idioms'],
    intro: 'Humility is highly valued in Chinese culture as a sign of true wisdom and good character. These idioms teach the importance of staying modest, learning from others, and avoiding the pitfalls of arrogance.',
    idiomIds: ['ID030', 'ID091', 'ID129', 'ID184', 'ID209', 'ID300', 'ID301', 'ID459', 'ID032', 'ID045'],
    category: 'Character',
    publishedDate: '2025-04-12'
  },
  {
    slug: 'chinese-idioms-about-opportunity',
    title: '10 Chinese Idioms About Opportunity & Timing',
    description: 'Strategic Chinese idioms about seizing opportunities, perfect timing, and being prepared when chances arise.',
    metaDescription: 'Discover 10 strategic Chinese idioms about opportunity and timing. These chengyu teach readiness and timing in Mandarin.',
    keywords: ['chinese idioms opportunity', 'timing chinese phrases', 'chengyu for chance', 'chinese seize moment expressions', 'mandarin opportunity idioms'],
    intro: 'Chinese philosophy emphasizes the importance of timing and being prepared for opportunities. These idioms teach the art of recognizing the right moment and being ready to act when it arrives.',
    idiomIds: ['ID019', 'ID037', 'ID053', 'ID060', 'ID075', 'ID076', 'ID127', 'ID154', 'ID156', 'ID168'],
    category: 'Strategy',
    publishedDate: '2025-04-13'
  },
  {
    slug: 'chinese-idioms-about-unity',
    title: '10 Chinese Idioms About Unity & Solidarity',
    description: 'Powerful Chinese idioms about unity, working together, and strength in numbers - collective wisdom for groups.',
    metaDescription: 'Learn 10 powerful Chinese idioms about unity and solidarity. These chengyu emphasize collective strength in Mandarin.',
    keywords: ['chinese idioms unity', 'solidarity chinese phrases', 'chengyu for together', 'chinese teamwork expressions', 'mandarin unity idioms'],
    intro: 'Unity and collective strength are central themes in Chinese culture. These idioms express the power of working together, supporting each other, and achieving through solidarity what individuals cannot.',
    idiomIds: ['ID022', 'ID027', 'ID031', 'ID035', 'ID043', 'ID045', 'ID082', 'ID102', 'ID236', 'ID317'],
    category: 'Relationships',
    publishedDate: '2025-04-14'
  },
  {
    slug: 'chinese-idioms-about-revenge',
    title: '8 Chinese Idioms About Revenge & Retribution',
    description: 'Intense Chinese idioms about revenge, payback, and settling scores - expressions of determined vengeance.',
    metaDescription: 'Discover 8 intense Chinese idioms about revenge and retribution. These chengyu express vengeance in Mandarin.',
    keywords: ['chinese idioms revenge', 'vengeance chinese phrases', 'chengyu for payback', 'chinese retribution expressions', 'mandarin revenge idioms'],
    intro: 'While Chinese philosophy often counsels forgiveness, these idioms capture the human desire for justice and retribution. They express determined patience and the eventual settling of accounts.',
    idiomIds: ['ID024', 'ID154', 'ID224', 'ID227', 'ID356', 'ID362', 'ID504', 'ID570'],
    category: 'Life Philosophy',
    publishedDate: '2025-04-15'
  },
  {
    slug: 'chinese-idioms-about-loyalty',
    title: '10 Chinese Idioms About Loyalty & Devotion',
    description: 'Noble Chinese idioms about loyalty, faithfulness, and unwavering devotion to people and principles.',
    metaDescription: 'Learn 10 noble Chinese idioms about loyalty and devotion. These chengyu express faithfulness in Mandarin.',
    keywords: ['chinese idioms loyalty', 'devotion chinese phrases', 'chengyu for faithful', 'chinese commitment expressions', 'mandarin loyalty idioms'],
    intro: 'Loyalty is one of the most celebrated virtues in Chinese culture, essential to relationships, family, and society. These idioms honor unwavering faithfulness and steadfast devotion.',
    idiomIds: ['ID031', 'ID035', 'ID043', 'ID087', 'ID095', 'ID102', 'ID141', 'ID180', 'ID600', 'ID601'],
    category: 'Character',
    publishedDate: '2025-04-16'
  },
  {
    slug: 'chinese-idioms-about-deception',
    title: '10 Chinese Idioms About Deception & Trickery',
    description: 'Cunning Chinese idioms about deception, tricks, and seeing through falsehoods - lessons in wariness.',
    metaDescription: 'Discover 10 cunning Chinese idioms about deception and trickery. These chengyu warn about falsehoods in Mandarin.',
    keywords: ['chinese idioms deception', 'trickery chinese phrases', 'chengyu for lies', 'chinese cunning expressions', 'mandarin deception idioms'],
    intro: 'Chinese idioms about deception serve as warnings and lessons in discernment. These expressions teach us to recognize tricks, see through false appearances, and protect ourselves from manipulation.',
    idiomIds: ['ID042', 'ID055', 'ID062', 'ID072', 'ID083', 'ID131', 'ID135', 'ID271', 'ID438', 'ID516'],
    category: 'Strategy',
    publishedDate: '2025-04-17'
  },
  {
    slug: 'chinese-idioms-about-determination',
    title: '12 Chinese Idioms About Determination & Willpower',
    description: 'Inspiring Chinese idioms about iron will, determination, and the resolve to achieve your goals no matter what.',
    metaDescription: 'Learn 12 inspiring Chinese idioms about determination and willpower. These chengyu express iron resolve in Mandarin.',
    keywords: ['chinese idioms determination', 'willpower chinese phrases', 'chengyu for resolve', 'chinese persistence expressions', 'mandarin determination idioms'],
    intro: 'Determination and unwavering willpower are celebrated throughout Chinese history. These idioms capture the spirit of those who refuse to give up, who persist against all odds, and who achieve through sheer force of will.',
    idiomIds: ['ID005', 'ID009', 'ID014', 'ID017', 'ID026', 'ID032', 'ID063', 'ID082', 'ID096', 'ID119', 'ID156', 'ID168'],
    category: 'Success & Perseverance',
    publishedDate: '2025-04-18'
  },
  // === NICHE LISTICLES: Job & Career ===
  {
    slug: 'chinese-idioms-for-job-interviews',
    title: '10 Chinese Idioms to Impress in Job Interviews',
    description: 'Powerful Chinese idioms that demonstrate your skills, work ethic, and cultural knowledge in professional interviews.',
    metaDescription: 'Ace your job interview with 10 impressive Chinese idioms. These chengyu showcase professionalism and cultural fluency in Mandarin.',
    keywords: ['chinese idioms job interview', 'professional chinese phrases', 'chengyu for career', 'impress chinese employer', 'mandarin interview tips'],
    intro: 'Using the right Chinese idiom in a job interview can demonstrate cultural fluency and leave a lasting impression. These expressions showcase professionalism, capability, and the right attitude for success.',
    idiomIds: ['ID044', 'ID068', 'ID078', 'ID098', 'ID128', 'ID140', 'ID144', 'ID178', 'ID199', 'ID288'],
    category: 'Career',
    publishedDate: '2025-04-19'
  },
  {
    slug: 'chinese-idioms-about-leadership',
    title: '10 Chinese Idioms About Leadership & Management',
    description: 'Ancient Chinese wisdom on leadership, guiding others, and the qualities of effective leaders and managers.',
    metaDescription: 'Master 10 Chinese idioms about leadership and management. These chengyu teach timeless wisdom for guiding others.',
    keywords: ['chinese idioms leadership', 'management chinese phrases', 'chengyu for leaders', 'chinese boss expressions', 'mandarin management idioms'],
    intro: 'Chinese philosophy offers profound insights on leadership that remain relevant today. These idioms capture the essence of effective leadership - from strategic thinking to inspiring others.',
    idiomIds: ['ID077', 'ID150', 'ID165', 'ID176', 'ID189', 'ID191', 'ID204', 'ID218', 'ID228', 'ID229'],
    category: 'Leadership',
    publishedDate: '2025-04-20'
  },
  {
    slug: 'chinese-idioms-about-bad-bosses',
    title: '8 Chinese Idioms About Bad Bosses & Toxic Leadership',
    description: 'Colorful Chinese idioms describing terrible bosses, incompetent managers, and toxic workplace behavior.',
    metaDescription: 'Discover 8 Chinese idioms about bad bosses and toxic leadership. These chengyu describe workplace villains in Mandarin.',
    keywords: ['chinese idioms bad boss', 'toxic boss chinese', 'chengyu terrible manager', 'chinese workplace complaints', 'mandarin boss idioms'],
    intro: 'Chinese has wonderfully expressive idioms for describing bad bosses - from those who abuse power to those who take credit for others\' work. These colorful expressions have described workplace villains for centuries.',
    idiomIds: ['ID261', 'ID281', 'ID328', 'ID330', 'ID344', 'ID423', 'ID539', 'ID560'],
    category: 'Workplace',
    publishedDate: '2025-04-21'
  },
  {
    slug: 'chinese-idioms-for-workplace',
    title: '10 Essential Chinese Idioms for the Workplace',
    description: 'Must-know Chinese idioms for professional settings - from teamwork to handling office politics.',
    metaDescription: 'Learn 10 essential Chinese idioms for the workplace. These chengyu help navigate professional environments in Mandarin.',
    keywords: ['chinese idioms workplace', 'office chinese phrases', 'chengyu for work', 'professional mandarin expressions', 'chinese corporate idioms'],
    intro: 'Navigating the Chinese workplace requires understanding the right expressions. These idioms cover everything from demonstrating diligence to handling office dynamics with grace.',
    idiomIds: ['ID067', 'ID111', 'ID178', 'ID194', 'ID205', 'ID239', 'ID254', 'ID276', 'ID277', 'ID288'],
    category: 'Workplace',
    publishedDate: '2025-04-22'
  },
  // === NICHE LISTICLES: HSK Exam Prep ===
  {
    slug: 'chinese-idioms-hsk-4',
    title: '12 Essential Chinese Idioms for HSK 4 Learners',
    description: 'Key Chinese idioms every HSK 4 student should know - commonly tested chengyu for intermediate learners.',
    metaDescription: 'Master 12 essential Chinese idioms for HSK 4. These commonly tested chengyu are must-know for intermediate Mandarin learners.',
    keywords: ['hsk 4 idioms', 'chinese idioms hsk4', 'chengyu for hsk', 'intermediate chinese idioms', 'hsk exam chengyu'],
    intro: 'Preparing for HSK 4? These idioms frequently appear in intermediate-level Chinese exams and conversations. Mastering them will boost both your test scores and real-world communication.',
    idiomIds: ['ID044', 'ID047', 'ID061', 'ID067', 'ID068', 'ID069', 'ID077', 'ID078', 'ID081', 'ID092', 'ID098', 'ID099'],
    category: 'Learning',
    publishedDate: '2025-04-23'
  },
  {
    slug: 'chinese-idioms-hsk-5',
    title: '12 Advanced Chinese Idioms for HSK 5 Learners',
    description: 'Challenging Chinese idioms for HSK 5 preparation - expand your vocabulary for upper-intermediate Mandarin.',
    metaDescription: 'Challenge yourself with 12 advanced Chinese idioms for HSK 5. These chengyu expand upper-intermediate Mandarin vocabulary.',
    keywords: ['hsk 5 idioms', 'chinese idioms hsk5', 'advanced chengyu', 'upper intermediate chinese', 'hsk 5 vocabulary'],
    intro: 'HSK 5 requires a broader range of idiomatic expressions. These chengyu represent the sophistication expected at upper-intermediate level, appearing in reading passages and listening comprehension.',
    idiomIds: ['ID204', 'ID205', 'ID210', 'ID212', 'ID213', 'ID215', 'ID216', 'ID217', 'ID218', 'ID226', 'ID228', 'ID229'],
    category: 'Learning',
    publishedDate: '2025-04-24'
  },
  {
    slug: 'chinese-idioms-hsk-6',
    title: '12 Sophisticated Chinese Idioms for HSK 6 Mastery',
    description: 'High-level Chinese idioms for HSK 6 candidates - demonstrate native-like fluency with these chengyu.',
    metaDescription: 'Achieve HSK 6 mastery with 12 sophisticated Chinese idioms. These advanced chengyu demonstrate native-like Mandarin fluency.',
    keywords: ['hsk 6 idioms', 'chinese idioms hsk6', 'advanced mandarin chengyu', 'native chinese expressions', 'hsk 6 preparation'],
    intro: 'HSK 6 represents near-native proficiency in Mandarin. These sophisticated idioms demonstrate the depth of cultural and linguistic knowledge expected at the highest level of Chinese language certification.',
    idiomIds: ['ID401', 'ID404', 'ID406', 'ID408', 'ID411', 'ID412', 'ID413', 'ID416', 'ID417', 'ID419', 'ID422', 'ID424'],
    category: 'Learning',
    publishedDate: '2025-04-25'
  },
  // === NICHE LISTICLES: Strategy ===
  {
    slug: 'chinese-idioms-from-art-of-war',
    title: '10 Chinese Idioms From The Art of War & Military Strategy',
    description: 'Strategic Chinese idioms inspired by Sun Tzu and ancient military wisdom - timeless tactics for modern challenges.',
    metaDescription: 'Learn 10 strategic Chinese idioms from The Art of War. These Sun Tzu-inspired chengyu teach timeless tactical wisdom.',
    keywords: ['art of war idioms', 'sun tzu chinese phrases', 'military strategy chengyu', 'chinese war expressions', 'strategic mandarin idioms'],
    intro: 'Sun Tzu\'s Art of War has influenced strategy for over 2,500 years. These idioms capture military wisdom that applies equally to business, competition, and life\'s challenges.',
    idiomIds: ['ID077', 'ID111', 'ID165', 'ID189', 'ID191', 'ID270', 'ID291', 'ID292', 'ID306', 'ID329'],
    category: 'Strategy',
    publishedDate: '2025-04-26'
  },
  {
    slug: 'chinese-idioms-about-competition',
    title: '10 Chinese Idioms About Competition & Rivalry',
    description: 'Fierce Chinese idioms about competition, beating rivals, and coming out on top in any contest.',
    metaDescription: 'Discover 10 fierce Chinese idioms about competition and rivalry. These chengyu capture the spirit of winning in Mandarin.',
    keywords: ['chinese idioms competition', 'rivalry chinese phrases', 'chengyu for winning', 'chinese contest expressions', 'mandarin competitive idioms'],
    intro: 'Competition has driven human achievement throughout history. These Chinese idioms capture the intensity of rivalry, the thrill of victory, and the strategies for coming out ahead.',
    idiomIds: ['ID047', 'ID081', 'ID124', 'ID140', 'ID164', 'ID181', 'ID193', 'ID204', 'ID229', 'ID232'],
    category: 'Competition',
    publishedDate: '2025-04-27'
  },
  {
    slug: 'chinese-idioms-about-strategic-planning',
    title: '10 Chinese Idioms About Strategic Planning & Foresight',
    description: 'Wise Chinese idioms about planning ahead, strategic thinking, and anticipating future challenges.',
    metaDescription: 'Master 10 Chinese idioms about strategic planning and foresight. These chengyu teach the art of thinking ahead in Mandarin.',
    keywords: ['chinese idioms planning', 'strategy chinese phrases', 'chengyu for foresight', 'chinese preparation expressions', 'mandarin planning idioms'],
    intro: 'The ability to plan strategically and anticipate challenges has always been valued in Chinese culture. These idioms teach the art of thinking several moves ahead.',
    idiomIds: ['ID044', 'ID077', 'ID092', 'ID111', 'ID204', 'ID245', 'ID261', 'ID292', 'ID306', 'ID329'],
    category: 'Strategy',
    publishedDate: '2025-04-28'
  },
  // === NICHE LISTICLES: Self-Improvement ===
  {
    slug: 'chinese-idioms-about-learning-from-mistakes',
    title: '10 Chinese Idioms About Learning From Mistakes',
    description: 'Wise Chinese idioms about failure, learning from errors, and turning setbacks into growth opportunities.',
    metaDescription: 'Learn 10 wise Chinese idioms about learning from mistakes. These chengyu teach how to grow from failure in Mandarin.',
    keywords: ['chinese idioms mistakes', 'learning from failure chinese', 'chengyu for errors', 'chinese growth mindset expressions', 'mandarin mistake idioms'],
    intro: 'Chinese wisdom recognizes that mistakes are essential teachers. These idioms offer perspectives on failure that transform setbacks into stepping stones for success.',
    idiomIds: ['ID098', 'ID124', 'ID125', 'ID132', 'ID193', 'ID218', 'ID229', 'ID259', 'ID273', 'ID306'],
    category: 'Self-Improvement',
    publishedDate: '2025-04-29'
  },
  {
    slug: 'chinese-idioms-about-self-improvement',
    title: '10 Chinese Idioms About Self-Improvement & Growth',
    description: 'Inspiring Chinese idioms about personal development, continuous improvement, and becoming your best self.',
    metaDescription: 'Discover 10 inspiring Chinese idioms about self-improvement. These chengyu motivate personal growth in Mandarin.',
    keywords: ['chinese idioms self improvement', 'personal growth chinese', 'chengyu for development', 'chinese betterment expressions', 'mandarin growth idioms'],
    intro: 'The pursuit of self-improvement is a cornerstone of Chinese philosophy. These idioms inspire continuous growth, learning, and the journey toward becoming your best self.',
    idiomIds: ['ID044', 'ID047', 'ID068', 'ID098', 'ID128', 'ID140', 'ID165', 'ID263', 'ID277', 'ID280'],
    category: 'Self-Improvement',
    publishedDate: '2025-04-30'
  },
  {
    slug: 'chinese-idioms-about-overcoming-adversity',
    title: '10 Chinese Idioms About Overcoming Adversity',
    description: 'Powerful Chinese idioms about facing hardship, enduring struggles, and emerging stronger from challenges.',
    metaDescription: 'Find strength in 10 Chinese idioms about overcoming adversity. These chengyu teach resilience through hardship in Mandarin.',
    keywords: ['chinese idioms adversity', 'overcoming hardship chinese', 'chengyu for struggles', 'chinese resilience expressions', 'mandarin adversity idioms'],
    intro: 'Life\'s greatest lessons often come through adversity. These powerful idioms capture the Chinese spirit of resilience - facing hardship with courage and emerging stronger.',
    idiomIds: ['ID061', 'ID092', 'ID164', 'ID205', 'ID235', 'ID246', 'ID252', 'ID277', 'ID292', 'ID297'],
    category: 'Resilience',
    publishedDate: '2025-05-01'
  },
  // === NICHE LISTICLES: Relationships ===
  {
    slug: 'chinese-idioms-about-betrayal',
    title: '10 Chinese Idioms About Betrayal & Broken Trust',
    description: 'Intense Chinese idioms about betrayal, backstabbing, and those who abandon others in times of need.',
    metaDescription: 'Explore 10 intense Chinese idioms about betrayal and broken trust. These chengyu describe treachery in Mandarin.',
    keywords: ['chinese idioms betrayal', 'backstab chinese phrases', 'chengyu for traitors', 'chinese trust expressions', 'mandarin betrayal idioms'],
    intro: 'Betrayal cuts deep in any culture. These Chinese idioms vividly describe those who break trust, abandon allies, and reveal their true treacherous nature.',
    idiomIds: ['ID069', 'ID081', 'ID235', 'ID243', 'ID252', 'ID309', 'ID321', 'ID355', 'ID408', 'ID591'],
    category: 'Relationships',
    publishedDate: '2025-05-02'
  },
  {
    slug: 'chinese-idioms-about-gratitude',
    title: '10 Chinese Idioms About Gratitude & Appreciation',
    description: 'Heartfelt Chinese idioms about thankfulness, repaying kindness, and appreciating those who help us.',
    metaDescription: 'Express appreciation with 10 Chinese idioms about gratitude. These chengyu teach thankfulness in Mandarin.',
    keywords: ['chinese idioms gratitude', 'thankful chinese phrases', 'chengyu for appreciation', 'chinese kindness expressions', 'mandarin gratitude idioms'],
    intro: 'Gratitude is deeply valued in Chinese culture, with strong traditions of remembering and repaying kindness. These idioms express the many dimensions of thankfulness and appreciation.',
    idiomIds: ['ID134', 'ID149', 'ID277', 'ID300', 'ID315', 'ID422', 'ID432', 'ID467', 'ID577', 'ID646'],
    category: 'Relationships',
    publishedDate: '2025-05-03'
  },
  {
    slug: 'chinese-idioms-about-forgiveness',
    title: '8 Chinese Idioms About Forgiveness & Letting Go',
    description: 'Compassionate Chinese idioms about forgiveness, mercy, and the wisdom of letting go of grudges.',
    metaDescription: 'Find peace with 8 Chinese idioms about forgiveness. These chengyu teach the wisdom of letting go in Mandarin.',
    keywords: ['chinese idioms forgiveness', 'letting go chinese', 'chengyu for mercy', 'chinese compassion expressions', 'mandarin forgiveness idioms'],
    intro: 'While revenge features in many idioms, Chinese wisdom also teaches the value of forgiveness and moving forward. These expressions capture the peace that comes from letting go.',
    idiomIds: ['ID091', 'ID209', 'ID242', 'ID362', 'ID546', 'ID556', 'ID589', 'ID600'],
    category: 'Relationships',
    publishedDate: '2025-05-04'
  },
  // === NICHE LISTICLES: Finance ===
  {
    slug: 'chinese-idioms-about-wealth-prosperity',
    title: '10 Chinese Idioms About Wealth & Prosperity',
    description: 'Auspicious Chinese idioms about wealth, fortune, and achieving prosperity through wisdom and effort.',
    metaDescription: 'Attract fortune with 10 Chinese idioms about wealth and prosperity. These auspicious chengyu celebrate success in Mandarin.',
    keywords: ['chinese idioms wealth', 'prosperity chinese phrases', 'chengyu for fortune', 'chinese rich expressions', 'mandarin wealth idioms'],
    intro: 'Wealth and prosperity have always been celebrated in Chinese culture, but with an emphasis on earning fortune through virtue and wisdom. These idioms reflect both aspirations and warnings about riches.',
    idiomIds: ['ID067', 'ID068', 'ID103', 'ID162', 'ID181', 'ID199', 'ID257', 'ID277', 'ID523', 'ID583'],
    category: 'Finance',
    publishedDate: '2025-05-05'
  },
  {
    slug: 'chinese-idioms-about-frugality-saving',
    title: '8 Chinese Idioms About Frugality & Saving Money',
    description: 'Practical Chinese idioms about being thrifty, avoiding waste, and the wisdom of saving for the future.',
    metaDescription: 'Save wisely with 8 Chinese idioms about frugality. These practical chengyu teach financial wisdom in Mandarin.',
    keywords: ['chinese idioms frugal', 'saving money chinese', 'chengyu for thrift', 'chinese financial wisdom expressions', 'mandarin saving idioms'],
    intro: 'Chinese culture has long valued frugality and careful management of resources. These idioms teach the wisdom of saving, avoiding waste, and planning for the future.',
    idiomIds: ['ID088', 'ID109', 'ID154', 'ID215', 'ID235', 'ID328', 'ID532', 'ID537'],
    category: 'Finance',
    publishedDate: '2025-05-06'
  },
  // === NICHE LISTICLES: Cultural Interest ===
  {
    slug: 'chinese-idioms-with-hidden-meanings',
    title: '10 Chinese Idioms With Surprising Hidden Meanings',
    description: 'Fascinating Chinese idioms where the surface meaning differs dramatically from the true meaning - linguistic surprises.',
    metaDescription: 'Discover 10 Chinese idioms with surprising hidden meanings. These fascinating chengyu reveal unexpected wisdom in Mandarin.',
    keywords: ['chinese idioms hidden meaning', 'surprising chinese phrases', 'chengyu double meaning', 'chinese linguistic surprises', 'mandarin hidden idioms'],
    intro: 'Some Chinese idioms say one thing but mean something entirely different. These fascinating expressions reveal how context and history transform literal meanings into profound wisdom.',
    idiomIds: ['ID044', 'ID047', 'ID069', 'ID081', 'ID125', 'ID146', 'ID152', 'ID162', 'ID252', 'ID271'],
    category: 'Culture',
    publishedDate: '2025-05-07'
  },
  {
    slug: 'chinese-idioms-about-speaking-words',
    title: '10 Chinese Idioms About Speaking & The Power of Words',
    description: 'Eloquent Chinese idioms about speech, communication, and the immense power words hold in shaping reality.',
    metaDescription: 'Master communication with 10 Chinese idioms about speaking and words. These chengyu reveal the power of language in Mandarin.',
    keywords: ['chinese idioms speaking', 'words chinese phrases', 'chengyu for communication', 'chinese eloquence expressions', 'mandarin speech idioms'],
    intro: 'Words have immense power in Chinese culture - to build or destroy, to heal or harm. These idioms explore the art of speaking well, knowing when to stay silent, and the lasting impact of what we say.',
    idiomIds: ['ID061', 'ID069', 'ID078', 'ID132', 'ID146', 'ID149', 'ID178', 'ID213', 'ID226', 'ID280'],
    category: 'Communication',
    publishedDate: '2025-05-08'
  },
  // === NEW BATCH: 100 Additional Listicles (Feb 2026) ===
  {
    slug: 'chinese-idioms-in-movies-cdrama',
    title: '12 Chinese Idioms You Hear in Every C-Drama & Movie',
    description: 'Recognize these commonly heard Chinese idioms from popular C-dramas, movies, and TV shows.',
    metaDescription: 'What Chinese idioms appear in C-dramas? These 12 chengyu are heard constantly in Chinese movies and TV shows. Perfect for drama fans learning Mandarin.',
    keywords: ['chinese idioms in movies', 'cdrama chinese phrases', 'chengyu in tv shows', 'chinese drama idioms', 'mandarin movie expressions', 'learn chinese from dramas'],
    intro: 'Love watching C-dramas? You\'ve probably heard these idioms dozens of times without realizing it. These 12 chengyu appear constantly in Chinese films and TV shows, from historical epics to modern romances.',
    idiomIds: ['ID001', 'ID005', 'ID014', 'ID018', 'ID042', 'ID056', 'ID074', 'ID102', 'ID131', 'ID134', 'ID141', 'ID271'],
    category: 'Pop Culture',
    publishedDate: '2025-05-09'
  },
  {
    slug: 'chinese-idioms-for-tiktok-captions',
    title: '10 Trendy Chinese Idioms for TikTok & Douyin Captions',
    description: 'Short, punchy Chinese idioms perfect for TikTok, Douyin, and short-form video captions.',
    metaDescription: 'Level up your TikTok with 10 trendy Chinese idioms. These short, catchy chengyu are perfect for Douyin captions and viral video descriptions.',
    keywords: ['chinese idioms tiktok', 'douyin captions chinese', 'short chinese quotes tiktok', 'viral chinese phrases', 'chinese caption ideas', 'aesthetic chinese tiktok'],
    intro: 'Looking for the perfect Chinese caption for your TikTok or Douyin video? These short, powerful idioms pack maximum meaning into four characters - perfect for short-form content that stands out.',
    idiomIds: ['ID001', 'ID006', 'ID009', 'ID014', 'ID017', 'ID020', 'ID021', 'ID026', 'ID082', 'ID141'],
    category: 'Social Media',
    publishedDate: '2025-05-10'
  },
  {
    slug: 'chinese-idioms-for-linkedin-profile',
    title: '10 Professional Chinese Idioms for LinkedIn & Resumes',
    description: 'Impressive Chinese idioms for your LinkedIn profile, resume, or professional bio that showcase cultural fluency.',
    metaDescription: 'Upgrade your LinkedIn profile with 10 professional Chinese idioms. These chengyu demonstrate cultural fluency and professional sophistication on your resume.',
    keywords: ['chinese idioms linkedin', 'resume chinese phrases', 'professional chinese bio', 'chengyu for cv', 'chinese professional expressions', 'mandarin linkedin profile'],
    intro: 'Want to stand out on LinkedIn or impress with your resume? These professional Chinese idioms demonstrate cultural fluency and convey your work ethic, leadership qualities, and professional values.',
    idiomIds: ['ID001', 'ID006', 'ID009', 'ID014', 'ID044', 'ID077', 'ID082', 'ID111', 'ID141', 'ID154'],
    category: 'Career',
    publishedDate: '2025-05-11'
  },
  {
    slug: 'chinese-idioms-for-email-signatures',
    title: '8 Elegant Chinese Idioms for Email Signatures & Bios',
    description: 'Sophisticated Chinese idioms that make memorable email signatures, bios, and personal mottos.',
    metaDescription: 'Find the perfect Chinese idiom for your email signature or bio. These 8 elegant chengyu make sophisticated personal mottos and professional sign-offs.',
    keywords: ['chinese idiom email signature', 'chinese motto ideas', 'chengyu for bio', 'personal motto chinese', 'chinese quote signature', 'elegant chinese phrases'],
    intro: 'A well-chosen Chinese idiom in your email signature or bio can leave a lasting impression. These elegant expressions serve as powerful personal mottos that convey your values and philosophy.',
    idiomIds: ['ID006', 'ID009', 'ID014', 'ID018', 'ID026', 'ID082', 'ID141', 'ID154'],
    category: 'Professional',
    publishedDate: '2025-05-12'
  },
  {
    slug: 'chinese-idioms-about-technology-innovation',
    title: '10 Chinese Idioms About Innovation & Technology',
    description: 'Ancient Chinese idioms surprisingly relevant to modern technology, startups, and innovation culture.',
    metaDescription: 'Discover 10 Chinese idioms about innovation and technology. These ancient chengyu are surprisingly relevant to startups, tech, and modern disruption.',
    keywords: ['chinese idioms innovation', 'technology chinese phrases', 'startup chengyu', 'chinese disruption expressions', 'mandarin innovation idioms', 'chinese tech sayings'],
    intro: 'Ancient Chinese wisdom meets modern innovation. These idioms about creating new things, breaking boundaries, and transforming the world are surprisingly relevant to today\'s tech and startup culture.',
    idiomIds: ['ID001', 'ID012', 'ID015', 'ID029', 'ID036', 'ID060', 'ID085', 'ID154', 'ID267', 'ID525'],
    category: 'Modern',
    publishedDate: '2025-05-13'
  },
  {
    slug: 'chinese-idioms-for-new-year-resolutions',
    title: '10 Chinese Idioms Perfect for New Year Resolutions',
    description: 'Motivational Chinese idioms to inspire your New Year resolutions about self-improvement, goals, and fresh starts.',
    metaDescription: 'Set powerful New Year resolutions with these 10 Chinese idioms. These motivational chengyu inspire self-improvement and goal-setting for the year ahead.',
    keywords: ['chinese idioms new year resolutions', 'goal setting chinese', 'new year goals chengyu', 'self improvement chinese phrases', 'resolution chinese expressions'],
    intro: 'Need inspiration for your New Year resolutions? These Chinese idioms capture the spirit of self-improvement, goal-setting, and making meaningful changes - the perfect companions for your fresh start.',
    idiomIds: ['ID005', 'ID006', 'ID009', 'ID014', 'ID026', 'ID044', 'ID060', 'ID085', 'ID154', 'ID267'],
    category: 'Self-Improvement',
    publishedDate: '2025-05-14'
  },
  {
    slug: 'chinese-idioms-for-daily-conversation',
    title: '15 Chinese Idioms Used in Everyday Conversation',
    description: 'The most practical Chinese idioms native speakers actually use in daily conversation - master these for fluent Mandarin.',
    metaDescription: 'Sound like a native with these 15 Chinese idioms for daily conversation. These are the chengyu Chinese speakers actually use every day in real life.',
    keywords: ['chinese idioms daily conversation', 'everyday chinese phrases', 'common chengyu spoken', 'practical chinese idioms', 'native speaker chengyu', 'real life chinese expressions'],
    intro: 'Forget rare literary idioms - these are the chengyu Chinese speakers actually use in everyday conversation. Master these 15 expressions and you\'ll sound noticeably more natural in daily Mandarin.',
    idiomIds: ['ID001', 'ID004', 'ID008', 'ID009', 'ID010', 'ID014', 'ID017', 'ID018', 'ID020', 'ID034', 'ID042', 'ID053', 'ID074', 'ID076', 'ID141'],
    category: 'Learning',
    publishedDate: '2025-05-15'
  },
  {
    slug: 'chinese-idioms-about-creativity',
    title: '10 Chinese Idioms About Creativity & Imagination',
    description: 'Inspiring Chinese idioms about creative thinking, imagination, and artistic expression.',
    metaDescription: 'Unlock creativity with 10 Chinese idioms about imagination and artistic expression. These chengyu celebrate innovative thinking in Mandarin.',
    keywords: ['chinese idioms creativity', 'imagination chinese phrases', 'chengyu for artists', 'chinese creative expressions', 'mandarin imagination idioms'],
    intro: 'Chinese culture celebrates creativity in unique ways - from painting that brings dragons to life to writing that makes flowers bloom. These idioms honor the power of imagination and creative expression.',
    idiomIds: ['ID012', 'ID029', 'ID036', 'ID084', 'ID114', 'ID196', 'ID248', 'ID341', 'ID395', 'ID525'],
    category: 'Creativity',
    publishedDate: '2025-05-16'
  },
  {
    slug: 'chinese-idioms-about-freedom',
    title: '8 Chinese Idioms About Freedom & Liberation',
    description: 'Liberating Chinese idioms about freedom, independence, and breaking free from constraints.',
    metaDescription: 'Explore 8 Chinese idioms about freedom and liberation. These chengyu express independence and breaking free in Mandarin.',
    keywords: ['chinese idioms freedom', 'liberation chinese phrases', 'chengyu for independence', 'chinese free spirit expressions', 'mandarin freedom idioms'],
    intro: 'Freedom takes many forms in Chinese idioms - from birds soaring above clouds to fish leaping in vast oceans. These expressions celebrate the human spirit\'s desire for liberation.',
    idiomIds: ['ID032', 'ID034', 'ID046', 'ID126', 'ID175', 'ID197', 'ID400', 'ID485'],
    category: 'Philosophy',
    publishedDate: '2025-05-17'
  },
  {
    slug: 'chinese-idioms-about-discipline',
    title: '10 Chinese Idioms About Discipline & Self-Control',
    description: 'Powerful Chinese idioms about discipline, self-mastery, and the strength of self-control.',
    metaDescription: 'Build discipline with 10 Chinese idioms about self-control. These chengyu teach the value of restraint and self-mastery in Mandarin.',
    keywords: ['chinese idioms discipline', 'self control chinese phrases', 'chengyu for restraint', 'chinese discipline expressions', 'mandarin self-mastery idioms'],
    intro: 'Discipline and self-control are foundational virtues in Chinese philosophy. These idioms teach that true strength comes not from dominating others, but from mastering oneself.',
    idiomIds: ['ID006', 'ID009', 'ID014', 'ID026', 'ID030', 'ID032', 'ID091', 'ID129', 'ID184', 'ID209'],
    category: 'Character',
    publishedDate: '2025-05-18'
  },
  {
    slug: 'chinese-idioms-for-apology',
    title: '8 Chinese Idioms for Apologizing & Making Amends',
    description: 'Appropriate Chinese idioms for saying sorry, admitting mistakes, and making amends with sincerity.',
    metaDescription: 'How to apologize in Chinese with idioms? These 8 chengyu help express sincere apologies and make amends in Mandarin.',
    keywords: ['chinese idioms apology', 'how to say sorry chinese', 'chengyu for apologizing', 'chinese making amends expressions', 'mandarin sorry idioms', 'apologize in chinese'],
    intro: 'Apologizing in Chinese culture requires more than just saying sorry. These idioms demonstrate genuine remorse, the humility to admit mistakes, and the commitment to make things right.',
    idiomIds: ['ID030', 'ID091', 'ID098', 'ID125', 'ID132', 'ID138', 'ID209', 'ID259'],
    category: 'Communication',
    publishedDate: '2025-05-19'
  },
  {
    slug: 'chinese-idioms-for-congratulations',
    title: '12 Chinese Idioms for Congratulations & Celebrations',
    description: 'Auspicious Chinese idioms perfect for congratulating someone on achievements, milestones, and happy occasions.',
    metaDescription: 'How to congratulate someone in Chinese? These 12 auspicious chengyu are perfect for celebrating achievements and happy occasions in Mandarin.',
    keywords: ['chinese idioms congratulations', 'congratulate chinese phrases', 'chengyu for celebration', 'chinese happy occasion expressions', 'mandarin congratulations idioms', 'gong xi chinese'],
    intro: 'Know how to celebrate in Chinese! These congratulatory idioms cover every happy occasion - from career achievements to personal milestones, weddings to new babies.',
    idiomIds: ['ID001', 'ID011', 'ID017', 'ID020', 'ID021', 'ID025', 'ID082', 'ID087', 'ID154', 'ID303', 'ID436', 'ID517'],
    category: 'Occasions',
    publishedDate: '2025-05-20'
  },
  {
    slug: 'chinese-idioms-for-toasts-drinking',
    title: '10 Chinese Idioms for Toasts, Cheers & Drinking',
    description: 'Essential Chinese idioms for making toasts, saying cheers, and navigating Chinese drinking culture.',
    metaDescription: 'What to say when toasting in Chinese? These 10 chengyu are essential for making toasts, saying cheers, and Chinese banquet drinking culture.',
    keywords: ['chinese toasting idioms', 'cheers in chinese idiom', 'chinese drinking culture phrases', 'banquet toast chinese', 'gan bei alternatives chinese', 'chinese dinner toast expressions'],
    intro: 'Chinese banquet culture involves elaborate toasting rituals. These idioms are perfect for making impressive toasts, whether at a business dinner, wedding reception, or family celebration.',
    idiomIds: ['ID001', 'ID011', 'ID027', 'ID031', 'ID035', 'ID082', 'ID087', 'ID303', 'ID517', 'ID586'],
    category: 'Culture',
    publishedDate: '2025-05-21'
  },
  {
    slug: 'chinese-idioms-for-mothers-day',
    title: '10 Loving Chinese Idioms for Mother\'s Day',
    description: 'Heartfelt Chinese idioms to honor mothers on Mother\'s Day, expressing love, sacrifice, and maternal devotion.',
    metaDescription: 'How to wish Happy Mother\'s Day in Chinese? These 10 heartfelt chengyu express love and gratitude for mothers in Mandarin.',
    keywords: ['chinese idioms mothers day', 'mother chinese phrases', 'chengyu for mom', 'chinese maternal love expressions', 'mandarin mothers day wishes', 'happy mothers day chinese'],
    intro: 'A mother\'s love is celebrated with special reverence in Chinese culture. These idioms capture the depth of maternal sacrifice, unconditional love, and the gratitude children feel for their mothers.',
    idiomIds: ['ID008', 'ID021', 'ID027', 'ID040', 'ID075', 'ID095', 'ID134', 'ID137', 'ID190', 'ID300'],
    category: 'Occasions',
    publishedDate: '2025-05-22'
  },
  {
    slug: 'chinese-idioms-for-fathers-day',
    title: '10 Respectful Chinese Idioms for Father\'s Day',
    description: 'Honoring Chinese idioms for Father\'s Day about paternal strength, guidance, and a father\'s enduring love.',
    metaDescription: 'Celebrate Father\'s Day with 10 Chinese idioms about paternal love. These chengyu honor fathers\' guidance and strength in Mandarin.',
    keywords: ['chinese idioms fathers day', 'father chinese phrases', 'chengyu for dad', 'chinese paternal love expressions', 'mandarin fathers day wishes', 'happy fathers day chinese'],
    intro: 'Chinese culture deeply respects the role of fathers as pillars of strength and guidance. These idioms honor paternal sacrifice, the quiet strength of a father\'s love, and the lasting impact of fatherly wisdom.',
    idiomIds: ['ID005', 'ID018', 'ID021', 'ID026', 'ID038', 'ID082', 'ID119', 'ID133', 'ID154', 'ID190'],
    category: 'Occasions',
    publishedDate: '2025-05-23'
  },
  {
    slug: 'chinese-idioms-for-teachers-day',
    title: '10 Respectful Chinese Idioms for Teachers\' Day (教师节)',
    description: 'Honor your teachers on Teachers\' Day with these respectful Chinese idioms about education, mentorship, and gratitude.',
    metaDescription: 'What to say on Teachers\' Day in Chinese? These 10 respectful chengyu honor educators with gratitude and appreciation in Mandarin.',
    keywords: ['chinese idioms teachers day', 'teachers day chinese phrases', 'jiao shi jie greetings', 'thank teacher chinese idiom', 'chinese education respect', 'mandarin teachers day wishes'],
    intro: 'Teachers\' Day (教师节, September 10) is an important holiday in China honoring educators. These idioms express the deep gratitude and respect Chinese culture holds for teachers and mentors.',
    idiomIds: ['ID002', 'ID003', 'ID010', 'ID016', 'ID021', 'ID040', 'ID095', 'ID129', 'ID137', 'ID143'],
    category: 'Occasions',
    publishedDate: '2025-05-24'
  },
  {
    slug: 'chinese-idioms-for-farewell-goodbye',
    title: '10 Chinese Idioms for Farewell & Saying Goodbye',
    description: 'Moving Chinese idioms for farewell parties, going-away events, and saying meaningful goodbyes.',
    metaDescription: 'How to say a meaningful goodbye in Chinese? These 10 farewell chengyu express heartfelt partings and wishes for safe travels.',
    keywords: ['chinese idioms farewell', 'goodbye chinese phrases', 'chengyu for leaving', 'chinese going away expressions', 'mandarin farewell idioms', 'chinese goodbye wishes'],
    intro: 'Saying goodbye is never easy, and Chinese idioms offer poetic ways to express the bittersweet emotions of parting. These expressions wish travelers well and honor the bonds that distance cannot break.',
    idiomIds: ['ID023', 'ID029', 'ID031', 'ID035', 'ID043', 'ID082', 'ID102', 'ID118', 'ID134', 'ID180'],
    category: 'Occasions',
    publishedDate: '2025-05-25'
  },
  {
    slug: 'chinese-idioms-for-work-promotion',
    title: '10 Chinese Idioms for Celebrating a Work Promotion',
    description: 'Congratulatory Chinese idioms for work promotions, career advancement, and professional achievement.',
    metaDescription: 'Congratulate a promotion with 10 Chinese idioms. These chengyu celebrate career advancement and professional success in Mandarin.',
    keywords: ['chinese idioms promotion', 'career advancement chinese', 'chengyu for success at work', 'chinese congratulations promotion', 'mandarin promotion wishes'],
    intro: 'Career advancement deserves celebration! These idioms are perfect for congratulating someone on a promotion, expressing wishes for continued success, and acknowledging their hard work.',
    idiomIds: ['ID001', 'ID011', 'ID017', 'ID020', 'ID036', 'ID052', 'ID076', 'ID082', 'ID106', 'ID119'],
    category: 'Career',
    publishedDate: '2025-05-26'
  },
  {
    slug: 'chinese-idioms-for-thank-you',
    title: '8 Chinese Idioms for Saying Thank You Meaningfully',
    description: 'Go beyond "xie xie" with these thoughtful Chinese idioms for expressing deep gratitude and appreciation.',
    metaDescription: 'How to say thank you in Chinese beyond 谢谢? These 8 chengyu express deep gratitude and meaningful appreciation in Mandarin.',
    keywords: ['chinese idioms thank you', 'grateful chinese phrases', 'chengyu beyond xie xie', 'chinese appreciation expressions', 'mandarin thank you idioms', 'express gratitude chinese'],
    intro: 'Saying 谢谢 (xiè xie) is just the beginning. These Chinese idioms express gratitude on a deeper level - from acknowledging life-changing kindness to honoring those who helped you succeed.',
    idiomIds: ['ID031', 'ID087', 'ID134', 'ID149', 'ID277', 'ID300', 'ID422', 'ID577'],
    category: 'Communication',
    publishedDate: '2025-05-27'
  },
  {
    slug: 'chinese-idioms-for-valentines-day',
    title: '10 Romantic Chinese Idioms for Valentine\'s Day',
    description: 'Sweet Chinese idioms for Valentine\'s Day cards, messages, and romantic gestures on February 14th.',
    metaDescription: 'Say I love you differently this Valentine\'s Day with 10 romantic Chinese idioms. These chengyu express love and devotion for February 14th.',
    keywords: ['chinese idioms valentines day', 'romantic chinese phrases february 14', 'chengyu for valentine', 'chinese love expressions valentines', 'mandarin valentines wishes', 'i love you chinese idiom'],
    intro: 'Make Valentine\'s Day special with Chinese idioms that express love more poetically than any English phrase. These romantic chengyu describe eternal devotion, perfect love, and soulmates.',
    idiomIds: ['ID008', 'ID056', 'ID118', 'ID136', 'ID151', 'ID166', 'ID183', 'ID256', 'ID286', 'ID420'],
    category: 'Love',
    publishedDate: '2025-05-28'
  },
  {
    slug: 'chinese-idioms-for-wedding-anniversary',
    title: '8 Chinese Idioms for Wedding Anniversary Wishes',
    description: 'Romantic Chinese idioms for celebrating wedding anniversaries, honoring enduring love and partnership.',
    metaDescription: 'Celebrate your wedding anniversary with 8 Chinese idioms about lasting love. These chengyu honor enduring partnerships in Mandarin.',
    keywords: ['chinese idioms wedding anniversary', 'anniversary chinese phrases', 'chengyu for marriage celebration', 'chinese lasting love expressions', 'mandarin anniversary wishes'],
    intro: 'Wedding anniversaries celebrate the beauty of enduring love. These Chinese idioms honor the journey of growing together, weathering storms, and the deepening bond between life partners.',
    idiomIds: ['ID056', 'ID102', 'ID118', 'ID248', 'ID420', 'ID600', 'ID601', 'ID603'],
    category: 'Love',
    publishedDate: '2025-05-29'
  },
  {
    slug: 'chinese-idioms-for-doctors',
    title: '10 Chinese Idioms for Doctors & Medical Professionals',
    description: 'Meaningful Chinese idioms about healing, medicine, and the noble art of saving lives.',
    metaDescription: 'Discover 10 Chinese idioms for doctors and medical professionals. These chengyu honor the healing profession and medical wisdom in Mandarin.',
    keywords: ['chinese idioms for doctors', 'medical chinese phrases', 'chengyu for healing', 'chinese medicine expressions', 'mandarin doctor idioms', 'chinese medical proverbs'],
    intro: 'Traditional Chinese medicine and philosophy have always revered the healing arts. These idioms honor doctors, celebrate healing, and express the deep respect Chinese culture holds for medical professionals.',
    idiomIds: ['ID045', 'ID073', 'ID091', 'ID161', 'ID185', 'ID222', 'ID238', 'ID301', 'ID536', 'ID589'],
    category: 'Profession',
    publishedDate: '2025-05-30'
  },
  {
    slug: 'chinese-idioms-for-entrepreneurs',
    title: '10 Chinese Idioms Every Entrepreneur Should Know',
    description: 'Essential Chinese idioms for startup founders, entrepreneurs, and business owners about risk, vision, and building from nothing.',
    metaDescription: 'Start your business journey with 10 Chinese idioms for entrepreneurs. These chengyu inspire startup founders with wisdom about risk and vision.',
    keywords: ['chinese idioms entrepreneur', 'startup chinese phrases', 'chengyu for business owner', 'chinese founder expressions', 'mandarin entrepreneur idioms', 'chinese startup wisdom'],
    intro: 'Building a business from scratch requires the same qualities celebrated in ancient Chinese wisdom - vision, persistence, calculated risk, and the courage to do what others won\'t.',
    idiomIds: ['ID001', 'ID005', 'ID009', 'ID012', 'ID017', 'ID029', 'ID036', 'ID060', 'ID077', 'ID154'],
    category: 'Career',
    publishedDate: '2025-05-31'
  },
  {
    slug: 'chinese-idioms-for-lawyers',
    title: '10 Chinese Idioms About Justice & The Law',
    description: 'Powerful Chinese idioms about justice, fairness, and the rule of law for legal professionals.',
    metaDescription: 'Learn 10 Chinese idioms about justice and law. These powerful chengyu express fairness, righteousness, and legal wisdom in Mandarin.',
    keywords: ['chinese idioms justice', 'law chinese phrases', 'chengyu for lawyers', 'chinese legal expressions', 'mandarin justice idioms', 'chinese fairness sayings'],
    intro: 'Justice and fairness have been central to Chinese governance philosophy since ancient times. These idioms capture the ideals of righteous judgment, impartial law, and the pursuit of truth.',
    idiomIds: ['ID087', 'ID091', 'ID123', 'ID141', 'ID180', 'ID207', 'ID209', 'ID389', 'ID501', 'ID593'],
    category: 'Profession',
    publishedDate: '2025-06-01'
  },
  {
    slug: 'chinese-idioms-for-athletes',
    title: '10 Chinese Idioms for Athletes & Sports',
    description: 'Competitive Chinese idioms about athletic achievement, sportsmanship, and pushing physical limits.',
    metaDescription: 'Fuel your athletic spirit with 10 Chinese idioms for sports. These chengyu inspire competition, endurance, and victory in Mandarin.',
    keywords: ['chinese idioms athletes', 'sports chinese phrases', 'chengyu for competition', 'chinese athletic expressions', 'mandarin sports idioms', 'chinese fitness sayings'],
    intro: 'Whether you\'re training for the Olympics or running your first 5K, these Chinese idioms capture the spirit of athletic excellence - from pushing beyond limits to the glory of victory.',
    idiomIds: ['ID005', 'ID009', 'ID017', 'ID026', 'ID032', 'ID063', 'ID082', 'ID096', 'ID119', 'ID168'],
    category: 'Profession',
    publishedDate: '2025-06-02'
  },
  {
    slug: 'chinese-idioms-for-writers',
    title: '10 Chinese Idioms for Writers & Authors',
    description: 'Literary Chinese idioms about writing, storytelling, and the craft of creating with words.',
    metaDescription: 'Inspire your writing with 10 Chinese idioms for authors. These literary chengyu celebrate the craft of words and storytelling in Mandarin.',
    keywords: ['chinese idioms writers', 'writing chinese phrases', 'chengyu for authors', 'chinese literary expressions', 'mandarin writing idioms', 'chinese storytelling sayings'],
    intro: 'Writing is deeply honored in Chinese culture - the brush is mightier than the sword. These idioms celebrate the art of writing, from effortless literary brilliance to the power of a single well-chosen word.',
    idiomIds: ['ID012', 'ID036', 'ID061', 'ID078', 'ID084', 'ID114', 'ID146', 'ID178', 'ID213', 'ID280'],
    category: 'Profession',
    publishedDate: '2025-06-03'
  },
  {
    slug: 'chinese-idioms-about-food-eating',
    title: '12 Delicious Chinese Idioms About Food & Eating',
    description: 'Appetizing Chinese idioms about food, eating, and Chinese culinary culture - where language meets gastronomy.',
    metaDescription: 'Feast on 12 Chinese idioms about food and eating. These tasty chengyu blend culinary culture with wisdom in Mandarin.',
    keywords: ['chinese idioms about food', 'eating chinese phrases', 'chengyu for cooking', 'chinese culinary expressions', 'mandarin food idioms', 'chinese food sayings'],
    intro: 'Food is life in Chinese culture, so it\'s no surprise that many idioms use food imagery. From describing situations as "adding flowers to brocade" to warning about "drinking poison to quench thirst," food idioms are everywhere.',
    idiomIds: ['ID013', 'ID019', 'ID037', 'ID041', 'ID053', 'ID070', 'ID088', 'ID105', 'ID109', 'ID159', 'ID198', 'ID357'],
    category: 'Culture',
    publishedDate: '2025-06-04'
  },
  {
    slug: 'chinese-idioms-about-tea-culture',
    title: '8 Chinese Idioms About Tea & Tea Culture',
    description: 'Elegant Chinese idioms about tea, tea ceremony, and the philosophical traditions of Chinese tea culture.',
    metaDescription: 'Explore 8 Chinese idioms about tea and tea culture. These elegant chengyu connect tea traditions with wisdom in Mandarin.',
    keywords: ['chinese idioms tea', 'tea culture chinese phrases', 'chengyu about tea', 'chinese tea ceremony expressions', 'mandarin tea idioms', 'chinese tea wisdom'],
    intro: 'Tea is more than a drink in Chinese culture - it\'s a philosophy. These idioms connect the ancient art of tea with deeper truths about life, friendship, and mindfulness.',
    idiomIds: ['ID007', 'ID015', 'ID018', 'ID023', 'ID024', 'ID040', 'ID091', 'ID173'],
    category: 'Culture',
    publishedDate: '2025-06-05'
  },
  {
    slug: 'chinese-idioms-about-drinking-wine',
    title: '10 Chinese Idioms About Drinking & Wine (酒)',
    description: 'Spirited Chinese idioms about drinking, wine culture, and the role of alcohol in Chinese social traditions.',
    metaDescription: 'Raise a glass with 10 Chinese idioms about drinking and wine. These spirited chengyu explore Chinese alcohol culture in Mandarin.',
    keywords: ['chinese idioms drinking', 'wine chinese phrases', 'chengyu about alcohol', 'chinese drinking culture expressions', 'mandarin wine idioms', 'jiu chinese sayings'],
    intro: 'Wine and alcohol have played an important role in Chinese social culture for millennia. These idioms explore the joys of drinking, the art of toasting, and the wisdom of knowing your limits.',
    idiomIds: ['ID019', 'ID023', 'ID027', 'ID031', 'ID035', 'ID070', 'ID159', 'ID174', 'ID198', 'ID460'],
    category: 'Culture',
    publishedDate: '2025-06-06'
  },
  {
    slug: 'chinese-idioms-about-music',
    title: '8 Melodious Chinese Idioms About Music & Sound',
    description: 'Harmonious Chinese idioms about music, sound, and the deep connection between melody and human emotion.',
    metaDescription: 'Listen to 8 Chinese idioms about music and sound. These harmonious chengyu connect melody with emotion in Mandarin.',
    keywords: ['chinese idioms music', 'sound chinese phrases', 'chengyu about melody', 'chinese musical expressions', 'mandarin music idioms', 'chinese harmony sayings'],
    intro: 'Music has been central to Chinese culture since ancient times - Confucius himself was an accomplished musician. These idioms use musical imagery to express harmony, discord, and the power of sound.',
    idiomIds: ['ID001', 'ID027', 'ID031', 'ID033', 'ID034', 'ID040', 'ID200', 'ID303'],
    category: 'Culture',
    publishedDate: '2025-06-07'
  },
  {
    slug: 'chinese-idioms-about-dreams',
    title: '10 Chinese Idioms About Dreams & Aspirations',
    description: 'Dreamy Chinese idioms about dreams, both literal night dreams and metaphorical life aspirations.',
    metaDescription: 'Chase your dreams with 10 Chinese idioms about dreams and aspirations. These chengyu inspire both night visions and life goals in Mandarin.',
    keywords: ['chinese idioms dreams', 'aspirations chinese phrases', 'chengyu about dreams', 'chinese dream expressions', 'mandarin dream idioms', 'chinese ambition sayings'],
    intro: 'Dreams in Chinese idioms represent both literal visions and life aspirations. These expressions capture the magic of dreaming - from fleeting fantasies to the burning ambitions that drive us forward.',
    idiomIds: ['ID001', 'ID007', 'ID012', 'ID017', 'ID023', 'ID029', 'ID036', 'ID060', 'ID175', 'ID197'],
    category: 'Philosophy',
    publishedDate: '2025-06-08'
  },
  {
    slug: 'chinese-idioms-about-chess-strategy',
    title: '10 Chinese Idioms About Chess, Go & Strategy Games',
    description: 'Strategic Chinese idioms from chess (象棋) and Go (围棋) about thinking ahead, outmaneuvering opponents, and game theory.',
    metaDescription: 'Think strategically with 10 Chinese idioms from chess and Go. These game-inspired chengyu teach tactical thinking in Mandarin.',
    keywords: ['chinese idioms chess', 'go weiqi chinese phrases', 'chengyu strategy games', 'chinese tactical expressions', 'mandarin chess idioms', 'chinese game theory sayings'],
    intro: 'Chess (象棋) and Go (围棋) have shaped Chinese strategic thinking for millennia. These idioms from the game board apply equally to business, relationships, and life decisions.',
    idiomIds: ['ID044', 'ID053', 'ID077', 'ID092', 'ID111', 'ID165', 'ID189', 'ID204', 'ID229', 'ID329'],
    category: 'Strategy',
    publishedDate: '2025-06-09'
  },
  {
    slug: 'chinese-idioms-from-three-kingdoms',
    title: '12 Chinese Idioms From Romance of the Three Kingdoms',
    description: 'Epic Chinese idioms from the Three Kingdoms era - tales of brotherhood, strategy, and legendary heroes.',
    metaDescription: 'Discover 12 Chinese idioms from Romance of the Three Kingdoms. These epic chengyu feature Zhuge Liang, Guan Yu, and legendary heroes.',
    keywords: ['three kingdoms idioms', 'romance three kingdoms chengyu', 'zhuge liang idioms', 'guan yu chinese phrases', 'chinese war strategy idioms', 'sanguo yanyi chengyu'],
    intro: 'Romance of the Three Kingdoms is one of the greatest sources of Chinese idioms. These expressions from the era of Zhuge Liang, Guan Yu, and Cao Cao have shaped Chinese culture for centuries.',
    idiomIds: ['ID005', 'ID017', 'ID042', 'ID077', 'ID111', 'ID131', 'ID165', 'ID189', 'ID191', 'ID270', 'ID291', 'ID329'],
    category: 'Historical',
    publishedDate: '2025-06-10'
  },
  {
    slug: 'chinese-idioms-from-confucius',
    title: '10 Chinese Idioms From Confucius & The Analects',
    description: 'Timeless Chinese idioms from Confucius (孔子) and the Analects about virtue, learning, and social harmony.',
    metaDescription: 'Learn wisdom from Confucius with 10 Chinese idioms from the Analects. These chengyu teach virtue and harmony in Mandarin.',
    keywords: ['confucius idioms', 'analects chengyu', 'kong zi chinese phrases', 'chinese virtue expressions', 'mandarin confucian idioms', 'chinese philosophy sayings'],
    intro: 'Confucius (孔子, Kǒng Zǐ) shaped Chinese civilization like no other figure. These idioms from the Analects (论语) carry his teachings about virtue, learning, and harmonious living.',
    idiomIds: ['ID002', 'ID003', 'ID006', 'ID010', 'ID016', 'ID021', 'ID030', 'ID091', 'ID129', 'ID141'],
    category: 'Historical',
    publishedDate: '2025-06-11'
  },
  {
    slug: 'chinese-idioms-from-taoism',
    title: '10 Chinese Idioms From Taoism & Laozi',
    description: 'Philosophical Chinese idioms from Taoist philosophy and Laozi\'s Tao Te Ching about nature, balance, and effortless action.',
    metaDescription: 'Find balance with 10 Taoist Chinese idioms from Laozi. These chengyu teach the Way (道), balance, and effortless action in Mandarin.',
    keywords: ['taoist idioms', 'laozi chengyu', 'tao te ching phrases', 'chinese philosophy taoism', 'mandarin taoist expressions', 'wu wei chinese idioms'],
    intro: 'Taoism teaches us to flow with nature, embrace paradox, and find strength in softness. These idioms from Laozi (老子) and Taoist philosophy capture the essence of the Way (道).',
    idiomIds: ['ID007', 'ID009', 'ID015', 'ID018', 'ID019', 'ID024', 'ID026', 'ID032', 'ID040', 'ID076'],
    category: 'Historical',
    publishedDate: '2025-06-12'
  },
  {
    slug: 'chinese-idioms-from-tang-dynasty-poetry',
    title: '10 Chinese Idioms From Tang Dynasty Poetry',
    description: 'Poetic Chinese idioms born from Tang Dynasty masterpieces by Li Bai, Du Fu, and other legendary poets.',
    metaDescription: 'Experience Tang Dynasty poetry through 10 Chinese idioms. These poetic chengyu come from Li Bai, Du Fu, and legendary Chinese poets.',
    keywords: ['tang dynasty idioms', 'li bai chengyu', 'du fu chinese phrases', 'chinese poetry idioms', 'mandarin tang poetry expressions', 'ancient chinese poem idioms'],
    intro: 'The Tang Dynasty (618-907 CE) was China\'s golden age of poetry. These idioms originated from the masterworks of Li Bai (李白), Du Fu (杜甫), and other legendary poets whose words still resonate today.',
    idiomIds: ['ID007', 'ID023', 'ID029', 'ID036', 'ID055', 'ID084', 'ID089', 'ID114', 'ID196', 'ID341'],
    category: 'Historical',
    publishedDate: '2025-06-13'
  },
  {
    slug: 'chinese-idioms-from-journey-to-the-west',
    title: '10 Chinese Idioms From Journey to the West (西游记)',
    description: 'Magical Chinese idioms from Journey to the West featuring Sun Wukong, the Monkey King, and epic adventures.',
    metaDescription: 'Discover 10 Chinese idioms from Journey to the West. These magical chengyu feature Sun Wukong and legendary adventures in Mandarin.',
    keywords: ['journey to the west idioms', 'sun wukong chengyu', 'monkey king chinese phrases', 'xi you ji idioms', 'chinese mythology expressions', 'chinese classic novel idioms'],
    intro: 'Journey to the West (西游记) gave us the legendary Monkey King and some of China\'s most colorful idioms. These expressions from the epic adventure novel blend mythology with timeless wisdom.',
    idiomIds: ['ID012', 'ID025', 'ID042', 'ID049', 'ID074', 'ID108', 'ID135', 'ID175', 'ID271', 'ID375'],
    category: 'Historical',
    publishedDate: '2025-06-14'
  },
  {
    slug: 'chinese-idioms-from-warring-states',
    title: '12 Chinese Idioms From the Warring States Period',
    description: 'Ancient Chinese idioms from the Warring States era - an age of brilliant strategy, fierce rivalry, and philosophical revolution.',
    metaDescription: 'Travel back to the Warring States with 12 ancient Chinese idioms. These chengyu capture an era of strategy and philosophy in Mandarin.',
    keywords: ['warring states idioms', 'ancient chinese chengyu', 'chinese history idioms', 'zhanguo strategy phrases', 'mandarin ancient expressions', 'chinese historical sayings'],
    intro: 'The Warring States period (475-221 BCE) was an era of brilliant strategists, fierce competition, and revolutionary philosophy. Many of China\'s most famous idioms were born during this transformative age.',
    idiomIds: ['ID005', 'ID017', 'ID018', 'ID025', 'ID042', 'ID049', 'ID059', 'ID074', 'ID077', 'ID111', 'ID131', 'ID271'],
    category: 'Historical',
    publishedDate: '2025-06-15'
  },
  {
    slug: 'chinese-idioms-with-dog',
    title: '10 Chinese Idioms With Dog (犬/狗)',
    description: 'Chinese idioms featuring dogs - expressions about loyalty, vigilance, and surprisingly, some negative connotations.',
    metaDescription: 'Learn 10 Chinese idioms with dog (犬/狗). These chengyu range from loyal companions to cautionary tales in Mandarin.',
    keywords: ['chinese idioms with dog', 'dog chengyu', '狗 idioms', 'chinese dog sayings', 'year of the dog idioms', 'quan chinese expressions'],
    intro: 'Dogs in Chinese idioms have a complex reputation - representing both loyalty and, in some expressions, negative qualities. These idioms show the full range of canine imagery in Chinese culture.',
    idiomIds: ['ID042', 'ID049', 'ID059', 'ID074', 'ID131', 'ID135', 'ID278', 'ID377', 'ID402', 'ID550'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-06-16'
  },
  {
    slug: 'chinese-idioms-with-pig',
    title: '8 Chinese Idioms With Pig (猪)',
    description: 'Chinese idioms featuring pigs - from lazy pigs to prosperous piggies, discover the pig in Chinese language.',
    metaDescription: 'Discover 8 Chinese idioms with pig (猪). These chengyu show how pigs represent both fortune and folly in Mandarin.',
    keywords: ['chinese idioms with pig', 'pig chengyu', '猪 idioms', 'chinese pig sayings', 'year of the pig idioms'],
    intro: 'Pigs in Chinese culture symbolize wealth and good fortune (the pig is a zodiac animal!), but in idioms, they often represent laziness or foolishness. These expressions show both sides of the porcine coin.',
    idiomIds: ['ID042', 'ID074', 'ID131', 'ID200', 'ID271', 'ID347', 'ID402', 'ID550'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-06-17'
  },
  {
    slug: 'chinese-idioms-with-monkey',
    title: '8 Clever Chinese Idioms With Monkey (猴)',
    description: 'Playful Chinese idioms featuring monkeys - expressing cleverness, mischief, and quick thinking.',
    metaDescription: 'Learn 8 clever Chinese idioms with monkey (猴). These playful chengyu express mischief and quick wits in Mandarin.',
    keywords: ['chinese idioms with monkey', 'monkey chengyu', '猴 idioms', 'chinese monkey sayings', 'year of the monkey idioms', 'sun wukong idioms'],
    intro: 'Monkeys in Chinese idioms represent cleverness, agility, and sometimes mischief - much like the legendary Monkey King. These expressions celebrate quick thinking and resourcefulness.',
    idiomIds: ['ID042', 'ID049', 'ID074', 'ID108', 'ID131', 'ID175', 'ID271', 'ID375'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-06-18'
  },
  {
    slug: 'chinese-idioms-with-rat-mouse',
    title: '8 Chinese Idioms With Rat & Mouse (鼠)',
    description: 'Cunning Chinese idioms featuring rats and mice - about resourcefulness, caution, and survival instincts.',
    metaDescription: 'Explore 8 Chinese idioms with rat and mouse (鼠). These cunning chengyu express resourcefulness and caution in Mandarin.',
    keywords: ['chinese idioms with rat', 'mouse chengyu', '鼠 idioms', 'chinese rat sayings', 'year of the rat idioms'],
    intro: 'As the first animal in the Chinese zodiac, the rat/mouse represents resourcefulness and survival. In idioms, rats often symbolize cunning behavior, small-mindedness, or the ability to thrive anywhere.',
    idiomIds: ['ID042', 'ID074', 'ID079', 'ID131', 'ID135', 'ID271', 'ID377', 'ID550'],
    category: 'Animals & Zodiac',
    publishedDate: '2025-06-19'
  },
  {
    slug: 'chinese-idioms-about-moon',
    title: '10 Luminous Chinese Idioms About the Moon (月)',
    description: 'Poetic Chinese idioms about the moon - symbolizing reunion, beauty, and the passage of time.',
    metaDescription: 'Gaze at 10 Chinese idioms about the moon. These luminous chengyu connect moonlight with reunion and beauty in Mandarin.',
    keywords: ['chinese idioms moon', 'moon chinese phrases', 'yue chengyu', 'chinese moonlight expressions', 'mandarin moon idioms', 'mid autumn moon idioms'],
    intro: 'The moon holds special significance in Chinese culture - it symbolizes reunion, completeness, and the beauty of nature. These idioms use moonlight to illuminate timeless truths about life.',
    idiomIds: ['ID023', 'ID055', 'ID084', 'ID088', 'ID089', 'ID097', 'ID104', 'ID114', 'ID120', 'ID177'],
    category: 'Nature',
    publishedDate: '2025-06-20'
  },
  {
    slug: 'chinese-idioms-about-rain',
    title: '10 Chinese Idioms About Rain (雨)',
    description: 'Atmospheric Chinese idioms about rain - from gentle spring showers to storms that test our resolve.',
    metaDescription: 'Weather 10 Chinese idioms about rain. These atmospheric chengyu explore how rain symbolizes change and growth in Mandarin.',
    keywords: ['chinese idioms rain', 'rain chinese phrases', 'yu chengyu', 'chinese weather expressions', 'mandarin rain idioms', 'chinese storm sayings'],
    intro: 'Rain in Chinese idioms represents everything from nourishing growth to testing one\'s character. These atmospheric expressions use weather imagery to describe life\'s challenges and blessings.',
    idiomIds: ['ID035', 'ID037', 'ID040', 'ID046', 'ID054', 'ID095', 'ID127', 'ID179', 'ID265', 'ID414'],
    category: 'Nature',
    publishedDate: '2025-06-21'
  },
  {
    slug: 'chinese-idioms-about-flowers',
    title: '12 Beautiful Chinese Idioms About Flowers (花)',
    description: 'Blooming Chinese idioms about flowers - celebrating beauty, impermanence, and the cycles of nature.',
    metaDescription: 'Bloom with 12 beautiful Chinese idioms about flowers. These floral chengyu celebrate beauty and nature\'s cycles in Mandarin.',
    keywords: ['chinese idioms flowers', 'flower chinese phrases', 'hua chengyu', 'chinese floral expressions', 'mandarin flower idioms', 'chinese blossom sayings'],
    intro: 'Flowers have inspired Chinese poetry and idioms for millennia. From plum blossoms symbolizing resilience to peonies representing prosperity, floral imagery permeates Chinese language beautifully.',
    idiomIds: ['ID040', 'ID084', 'ID095', 'ID114', 'ID185', 'ID196', 'ID248', 'ID265', 'ID341', 'ID395', 'ID414', 'ID517'],
    category: 'Nature',
    publishedDate: '2025-06-22'
  },
  {
    slug: 'chinese-idioms-about-trees-bamboo',
    title: '10 Chinese Idioms About Trees & Bamboo (竹)',
    description: 'Rooted Chinese idioms about trees and bamboo - symbolizing strength, flexibility, and deep foundations.',
    metaDescription: 'Stand tall with 10 Chinese idioms about trees and bamboo. These rooted chengyu teach strength and flexibility in Mandarin.',
    keywords: ['chinese idioms bamboo', 'tree chinese phrases', 'zhu chengyu', 'chinese bamboo expressions', 'mandarin tree idioms', 'chinese wood sayings'],
    intro: 'Bamboo is one of the most powerful symbols in Chinese culture - flexible yet unbreakable, hollow yet strong. These idioms draw from trees and bamboo to teach about resilience and growth.',
    idiomIds: ['ID005', 'ID009', 'ID015', 'ID032', 'ID033', 'ID036', 'ID095', 'ID185', 'ID233', 'ID305'],
    category: 'Nature',
    publishedDate: '2025-06-23'
  },
  {
    slug: 'chinese-idioms-about-sun-light',
    title: '10 Bright Chinese Idioms About Sun & Light (光/日)',
    description: 'Radiant Chinese idioms about sunshine, light, and brightness - illuminating truth and hope.',
    metaDescription: 'Shine with 10 Chinese idioms about sun and light. These radiant chengyu illuminate truth and hope in Mandarin.',
    keywords: ['chinese idioms sun', 'light chinese phrases', 'guang chengyu', 'chinese sunshine expressions', 'mandarin light idioms', 'chinese brightness sayings'],
    intro: 'Light and sunshine in Chinese idioms represent truth, hope, and clarity. These expressions use the imagery of brightness to describe understanding, optimism, and the triumph of good.',
    idiomIds: ['ID007', 'ID012', 'ID015', 'ID023', 'ID036', 'ID060', 'ID084', 'ID154', 'ID169', 'ID298'],
    category: 'Nature',
    publishedDate: '2025-06-24'
  },
  {
    slug: 'chinese-idioms-about-summer',
    title: '8 Sizzling Chinese Idioms About Summer & Heat',
    description: 'Hot Chinese idioms about summer, scorching heat, and surviving the season - seasonal wisdom for the warmest months.',
    metaDescription: 'Beat the heat with 8 Chinese idioms about summer. These sizzling chengyu describe the hottest season in Mandarin.',
    keywords: ['chinese idioms summer', 'heat chinese phrases', 'chengyu about summer', 'chinese hot weather expressions', 'mandarin summer idioms', 'chinese season sayings'],
    intro: 'Summer in Chinese idioms evokes scorching heat, thriving life, and the intensity of the season. These expressions capture both the challenges and the vibrant energy of the warmest months.',
    idiomIds: ['ID070', 'ID105', 'ID159', 'ID174', 'ID198', 'ID380', 'ID460', 'ID544'],
    category: 'Nature',
    publishedDate: '2025-06-25'
  },
  {
    slug: 'chinese-idioms-about-jealousy',
    title: '8 Chinese Idioms About Jealousy & Envy',
    description: 'Green-eyed Chinese idioms about jealousy, envy, and the destructive power of covetousness.',
    metaDescription: 'Understand jealousy through 8 Chinese idioms about envy. These chengyu describe the green-eyed monster in Mandarin.',
    keywords: ['chinese idioms jealousy', 'envy chinese phrases', 'chengyu for jealous', 'chinese covet expressions', 'mandarin jealousy idioms'],
    intro: 'Jealousy and envy are universal human emotions, and Chinese idioms capture their many shades - from mild admiration to destructive obsession. These expressions warn about the dangers of comparison.',
    idiomIds: ['ID070', 'ID105', 'ID159', 'ID174', 'ID227', 'ID356', 'ID504', 'ID570'],
    category: 'Emotions',
    publishedDate: '2025-06-26'
  },
  {
    slug: 'chinese-idioms-about-loneliness',
    title: '8 Chinese Idioms About Loneliness & Solitude',
    description: 'Contemplative Chinese idioms about loneliness, solitude, and the beauty of being alone with your thoughts.',
    metaDescription: 'Reflect on 8 Chinese idioms about loneliness and solitude. These contemplative chengyu explore isolation in Mandarin.',
    keywords: ['chinese idioms loneliness', 'solitude chinese phrases', 'chengyu for alone', 'chinese isolation expressions', 'mandarin loneliness idioms'],
    intro: 'Loneliness in Chinese idioms isn\'t always negative - some expressions celebrate the wisdom found in solitude. These idioms explore both the pain of isolation and the depth of introspection.',
    idiomIds: ['ID023', 'ID029', 'ID055', 'ID160', 'ID183', 'ID188', 'ID227', 'ID382'],
    category: 'Emotions',
    publishedDate: '2025-06-27'
  },
  {
    slug: 'chinese-idioms-about-hope-optimism',
    title: '10 Chinese Idioms About Hope & Optimism',
    description: 'Uplifting Chinese idioms about hope, looking forward, and maintaining optimism through difficult times.',
    metaDescription: 'Find hope with 10 uplifting Chinese idioms about optimism. These chengyu inspire positive thinking through adversity in Mandarin.',
    keywords: ['chinese idioms hope', 'optimism chinese phrases', 'chengyu for positive', 'chinese hopeful expressions', 'mandarin hope idioms', 'chinese positive thinking'],
    intro: 'Even in the darkest times, Chinese wisdom offers beacons of hope. These idioms teach that after every storm comes sunshine, and every challenge contains the seeds of opportunity.',
    idiomIds: ['ID012', 'ID015', 'ID018', 'ID060', 'ID084', 'ID085', 'ID127', 'ID154', 'ID168', 'ID260'],
    category: 'Emotions',
    publishedDate: '2025-06-28'
  },
  {
    slug: 'chinese-idioms-about-regret',
    title: '8 Chinese Idioms About Regret & Missed Opportunities',
    description: 'Wistful Chinese idioms about regret, missed chances, and the ache of looking back at what could have been.',
    metaDescription: 'Reflect on 8 Chinese idioms about regret and missed opportunities. These wistful chengyu express the ache of hindsight in Mandarin.',
    keywords: ['chinese idioms regret', 'missed opportunity chinese', 'chengyu for regret', 'chinese hindsight expressions', 'mandarin regret idioms'],
    intro: 'Regret is a powerful teacher. These Chinese idioms capture the wisdom born from missed opportunities, delayed action, and the universal experience of wishing we had done things differently.',
    idiomIds: ['ID018', 'ID029', 'ID037', 'ID053', 'ID098', 'ID125', 'ID138', 'ID259'],
    category: 'Emotions',
    publishedDate: '2025-06-29'
  },
  {
    slug: 'chinese-idioms-about-pride-arrogance',
    title: '10 Chinese Idioms About Pride & Arrogance',
    description: 'Cautionary Chinese idioms about excessive pride, arrogance, and the dangers of overconfidence.',
    metaDescription: 'Stay humble with 10 Chinese idioms about pride and arrogance. These cautionary chengyu warn about overconfidence in Mandarin.',
    keywords: ['chinese idioms pride', 'arrogance chinese phrases', 'chengyu for overconfident', 'chinese hubris expressions', 'mandarin pride idioms'],
    intro: 'Chinese philosophy strongly warns against arrogance. These idioms describe the many faces of excessive pride and its inevitable consequences - a timeless reminder that humility is strength.',
    idiomIds: ['ID030', 'ID062', 'ID072', 'ID083', 'ID152', 'ID261', 'ID281', 'ID330', 'ID516', 'ID560'],
    category: 'Character',
    publishedDate: '2025-06-30'
  },
  {
    slug: 'chinese-idioms-about-nostalgia-homesickness',
    title: '10 Chinese Idioms About Nostalgia & Homesickness',
    description: 'Bittersweet Chinese idioms about missing home, nostalgia for the past, and longing for what was.',
    metaDescription: 'Miss home with 10 Chinese idioms about nostalgia and homesickness. These bittersweet chengyu express longing in Mandarin.',
    keywords: ['chinese idioms nostalgia', 'homesickness chinese phrases', 'chengyu for missing home', 'chinese longing expressions', 'mandarin nostalgia idioms', 'chinese homesick sayings'],
    intro: 'Chinese culture places deep value on home and family, making homesickness a frequently expressed emotion. These idioms capture the bittersweet ache of missing home, familiar places, and beloved people.',
    idiomIds: ['ID023', 'ID027', 'ID029', 'ID031', 'ID055', 'ID088', 'ID089', 'ID134', 'ID160', 'ID188'],
    category: 'Emotions',
    publishedDate: '2025-07-01'
  },
  {
    slug: 'chinese-idioms-about-surprise-shock',
    title: '10 Chinese Idioms About Surprise & Shock',
    description: 'Expressive Chinese idioms about being surprised, shocked, and caught completely off guard.',
    metaDescription: 'Be amazed by 10 Chinese idioms about surprise and shock. These expressive chengyu describe unexpected moments in Mandarin.',
    keywords: ['chinese idioms surprise', 'shock chinese phrases', 'chengyu for amazed', 'chinese astonishment expressions', 'mandarin surprise idioms'],
    intro: 'Chinese idioms have wonderfully vivid ways of describing surprise - from souls leaving the body to eyes popping out. These dramatic expressions capture the full spectrum of unexpected moments.',
    idiomIds: ['ID001', 'ID046', 'ID135', 'ID155', 'ID211', 'ID272', 'ID293', 'ID316', 'ID363', 'ID449'],
    category: 'Emotions',
    publishedDate: '2025-07-02'
  },
  {
    slug: 'chinese-idioms-about-heartbreak',
    title: '10 Chinese Idioms About Heartbreak & Lost Love',
    description: 'Poignant Chinese idioms about heartbreak, breakups, and the pain of love lost.',
    metaDescription: 'Heal your heart with 10 Chinese idioms about heartbreak and lost love. These poignant chengyu express romantic pain in Mandarin.',
    keywords: ['chinese idioms heartbreak', 'breakup chinese phrases', 'chengyu for broken heart', 'chinese lost love expressions', 'mandarin heartbreak idioms', 'chinese breakup sayings'],
    intro: 'Heartbreak has inspired some of the most poignant Chinese poetry and idioms. These expressions capture the agony of lost love, the pain of separation, and the slow process of healing.',
    idiomIds: ['ID029', 'ID055', 'ID160', 'ID183', 'ID188', 'ID227', 'ID382', 'ID385', 'ID574', 'ID600'],
    category: 'Emotions',
    publishedDate: '2025-07-03'
  },
  {
    slug: 'chinese-idioms-about-embarrassment',
    title: '8 Chinese Idioms About Embarrassment & Losing Face',
    description: 'Awkward Chinese idioms about embarrassment, losing face, and those cringe-worthy moments we all experience.',
    metaDescription: 'Don\'t lose face! 8 Chinese idioms about embarrassment explain why "face" matters so much in Chinese culture.',
    keywords: ['chinese idioms embarrassment', 'losing face chinese', 'chengyu for awkward', 'chinese face culture expressions', 'mandarin embarrassment idioms', 'mianzi chinese idioms'],
    intro: 'Face (面子, miàn zi) is central to Chinese social culture. These idioms describe embarrassment, awkwardness, and the culturally significant concept of losing face - relevant for anyone navigating Chinese social situations.',
    idiomIds: ['ID030', 'ID062', 'ID072', 'ID098', 'ID125', 'ID152', 'ID261', 'ID539'],
    category: 'Culture',
    publishedDate: '2025-07-04'
  },
  {
    slug: 'chinese-idioms-about-love-at-first-sight',
    title: '8 Chinese Idioms About Love at First Sight',
    description: 'Romantic Chinese idioms about instant attraction, falling in love at first glance, and fateful first meetings.',
    metaDescription: 'Fall in love instantly with 8 Chinese idioms about love at first sight. These romantic chengyu describe fateful first meetings in Mandarin.',
    keywords: ['chinese idioms love at first sight', 'yi jian zhong qing meaning', 'instant love chinese', 'chengyu first meeting love', 'chinese attraction idioms', 'chinese love expressions first sight'],
    intro: 'Love at first sight is a universal experience, and Chinese has beautiful ways to describe that magical moment when two souls connect instantly. These romantic idioms capture the lightning bolt of first love.',
    idiomIds: ['ID008', 'ID056', 'ID118', 'ID136', 'ID151', 'ID166', 'ID256', 'ID286'],
    category: 'Love',
    publishedDate: '2025-07-05'
  },
  {
    slug: 'chinese-idioms-about-fate-destiny',
    title: '10 Chinese Idioms About Fate & Destiny',
    description: 'Philosophical Chinese idioms about fate, destiny, and the eternal question of whether our lives are predetermined.',
    metaDescription: 'Explore fate with 10 Chinese idioms about destiny. These philosophical chengyu question whether our paths are written in Mandarin.',
    keywords: ['chinese idioms fate', 'destiny chinese phrases', 'chengyu for karma', 'chinese destiny expressions', 'mandarin fate idioms', 'chinese predetermined sayings'],
    intro: 'Is our destiny written in the stars? Chinese philosophy explores this question through idioms that examine fate, chance, and the interplay between human will and cosmic design.',
    idiomIds: ['ID007', 'ID015', 'ID018', 'ID024', 'ID029', 'ID060', 'ID127', 'ID175', 'ID197', 'ID400'],
    category: 'Philosophy',
    publishedDate: '2025-07-06'
  },
  {
    slug: 'chinese-idioms-about-appearance-vs-reality',
    title: '10 Chinese Idioms About Appearance vs. Reality',
    description: 'Revealing Chinese idioms about things not being what they seem, deceptive appearances, and hidden truths.',
    metaDescription: 'See through illusions with 10 Chinese idioms about appearance vs. reality. These revealing chengyu teach discernment in Mandarin.',
    keywords: ['chinese idioms appearance reality', 'deceptive looks chinese', 'chengyu for things not what they seem', 'chinese illusion expressions', 'mandarin truth appearance idioms'],
    intro: 'Chinese wisdom teaches us to look beyond the surface. These idioms warn about deceptive appearances, hidden intentions, and the importance of seeing things as they truly are.',
    idiomIds: ['ID042', 'ID055', 'ID062', 'ID072', 'ID079', 'ID083', 'ID131', 'ID135', 'ID152', 'ID271'],
    category: 'Philosophy',
    publishedDate: '2025-07-07'
  },
  {
    slug: 'chinese-idioms-about-balance-harmony',
    title: '10 Chinese Idioms About Balance & Harmony (和)',
    description: 'Harmonious Chinese idioms about balance, yin and yang, and achieving equilibrium in life.',
    metaDescription: 'Find balance with 10 Chinese idioms about harmony. These chengyu teach yin-yang equilibrium and peaceful living in Mandarin.',
    keywords: ['chinese idioms balance', 'harmony chinese phrases', 'chengyu for yin yang', 'chinese equilibrium expressions', 'mandarin harmony idioms', 'chinese peace sayings'],
    intro: 'Harmony (和, hé) is perhaps the most important concept in Chinese philosophy. These idioms teach the art of balance - between work and rest, giving and receiving, action and patience.',
    idiomIds: ['ID007', 'ID015', 'ID019', 'ID024', 'ID027', 'ID033', 'ID040', 'ID076', 'ID303', 'ID304'],
    category: 'Philosophy',
    publishedDate: '2025-07-08'
  },
  {
    slug: 'chinese-idioms-about-truth',
    title: '10 Chinese Idioms About Truth & Reality',
    description: 'Honest Chinese idioms about truth, seeing clearly, and the courage to face reality as it is.',
    metaDescription: 'Seek truth with 10 Chinese idioms about reality. These honest chengyu teach clear-eyed wisdom in Mandarin.',
    keywords: ['chinese idioms truth', 'reality chinese phrases', 'chengyu for honest', 'chinese wisdom expressions', 'mandarin truth idioms'],
    intro: 'Finding truth requires both courage and wisdom. These Chinese idioms celebrate those who seek reality, see through deception, and have the integrity to speak and live truthfully.',
    idiomIds: ['ID006', 'ID045', 'ID055', 'ID072', 'ID084', 'ID087', 'ID091', 'ID123', 'ID207', 'ID209'],
    category: 'Philosophy',
    publishedDate: '2025-07-09'
  },
  {
    slug: 'chinese-idioms-about-silence',
    title: '8 Chinese Idioms About Silence & Quietness',
    description: 'Contemplative Chinese idioms about the power of silence, knowing when not to speak, and quiet strength.',
    metaDescription: 'Discover the power of quiet with 8 Chinese idioms about silence. These contemplative chengyu teach when words aren\'t needed in Mandarin.',
    keywords: ['chinese idioms silence', 'quiet chinese phrases', 'chengyu for silence', 'chinese still expressions', 'mandarin silence idioms'],
    intro: 'In a world of constant noise, Chinese wisdom reminds us of silence\'s power. These idioms teach that sometimes the strongest response is no response at all.',
    idiomIds: ['ID007', 'ID015', 'ID018', 'ID030', 'ID032', 'ID091', 'ID129', 'ID184'],
    category: 'Philosophy',
    publishedDate: '2025-07-10'
  },
  {
    slug: 'chinese-idioms-about-reading-books',
    title: '10 Chinese Idioms About Reading & Books',
    description: 'Scholarly Chinese idioms about books, reading, and the transformative power of literature.',
    metaDescription: 'Feed your mind with 10 Chinese idioms about reading and books. These scholarly chengyu celebrate literature in Mandarin.',
    keywords: ['chinese idioms reading', 'books chinese phrases', 'chengyu about studying', 'chinese literature expressions', 'mandarin reading idioms', 'chinese book wisdom'],
    intro: 'Books have been revered in Chinese culture for millennia. These idioms celebrate the joy of reading, the power of knowledge, and the transformative effect that great literature has on the mind.',
    idiomIds: ['ID002', 'ID003', 'ID006', 'ID010', 'ID016', 'ID021', 'ID025', 'ID028', 'ID036', 'ID073'],
    category: 'Learning',
    publishedDate: '2025-07-11'
  },
  {
    slug: 'chinese-idioms-about-mindfulness-meditation',
    title: '8 Chinese Idioms About Mindfulness & Inner Peace',
    description: 'Serene Chinese idioms about mindfulness, meditation, and finding inner peace in a chaotic world.',
    metaDescription: 'Find inner peace with 8 Chinese idioms about mindfulness. These serene chengyu teach meditation and calm in Mandarin.',
    keywords: ['chinese idioms mindfulness', 'meditation chinese phrases', 'chengyu for inner peace', 'chinese calm expressions', 'mandarin mindfulness idioms', 'chinese zen sayings'],
    intro: 'Long before mindfulness became trendy, Chinese and Buddhist philosophy taught the art of present-moment awareness. These idioms capture the wisdom of stillness and inner peace.',
    idiomIds: ['ID006', 'ID007', 'ID015', 'ID018', 'ID024', 'ID030', 'ID040', 'ID091'],
    category: 'Wellness',
    publishedDate: '2025-07-12'
  },
  {
    slug: 'chinese-idioms-about-power-authority',
    title: '10 Chinese Idioms About Power & Authority',
    description: 'Commanding Chinese idioms about power, authority, and the responsibilities that come with leadership.',
    metaDescription: 'Understand power with 10 Chinese idioms about authority. These commanding chengyu explore leadership responsibility in Mandarin.',
    keywords: ['chinese idioms power', 'authority chinese phrases', 'chengyu for leadership', 'chinese rule expressions', 'mandarin power idioms'],
    intro: 'Power and authority have fascinated Chinese thinkers for millennia. These idioms examine the nature of leadership, the responsibilities of those in power, and the inevitable cycles of rise and fall.',
    idiomIds: ['ID025', 'ID042', 'ID077', 'ID111', 'ID150', 'ID165', 'ID189', 'ID204', 'ID271', 'ID329'],
    category: 'Leadership',
    publishedDate: '2025-07-13'
  },
  {
    slug: 'chinese-idioms-with-mouth',
    title: '10 Chinese Idioms With Mouth (口/嘴)',
    description: 'Talkative Chinese idioms featuring the mouth - about speaking, eating, and the power of words.',
    metaDescription: 'Speak up with 10 Chinese idioms with mouth (口). These talkative chengyu explore the power of words in Mandarin.',
    keywords: ['chinese idioms mouth', 'mouth chengyu', '口 idioms', 'chinese speaking expressions', 'mandarin mouth idioms'],
    intro: 'The mouth (口, kǒu) in Chinese idioms represents speech, appetite, and the gateway between inner thoughts and the outside world. These expressions explore the power - and danger - of what comes out of our mouths.',
    idiomIds: ['ID061', 'ID069', 'ID078', 'ID132', 'ID146', 'ID149', 'ID178', 'ID213', 'ID226', 'ID280'],
    category: 'Body & Mind',
    publishedDate: '2025-07-14'
  },
  {
    slug: 'chinese-idioms-with-face',
    title: '10 Chinese Idioms About Face (面/脸)',
    description: 'Chinese idioms about face culture, reputation, and why "saving face" is so important in Chinese society.',
    metaDescription: 'Understand face culture with 10 Chinese idioms about 面子. These chengyu explain why reputation matters in Chinese society.',
    keywords: ['chinese idioms face', 'face culture chengyu', '面 idioms', 'mianzi chinese expressions', 'saving face mandarin', 'chinese reputation idioms'],
    intro: 'Face (面子, miàn zi) is one of the most important concepts in Chinese social culture. These idioms reveal why reputation, dignity, and social standing matter so deeply in Chinese society.',
    idiomIds: ['ID030', 'ID062', 'ID072', 'ID083', 'ID098', 'ID125', 'ID152', 'ID261', 'ID281', 'ID539'],
    category: 'Culture',
    publishedDate: '2025-07-15'
  },
  {
    slug: 'chinese-idioms-with-number-five',
    title: '8 Chinese Idioms With the Number Five (五)',
    description: 'Chinese idioms featuring the number five - representing the five elements, five senses, and natural completeness.',
    metaDescription: 'Discover 8 Chinese idioms with the number five. These chengyu connect to the five elements and natural harmony in Mandarin.',
    keywords: ['chinese idioms five', 'number 5 chinese phrases', 'chengyu with five', 'chinese five elements', 'wu xing idioms'],
    intro: 'The number five (五, wǔ) connects to the five elements (木金水火土), five senses, and five directions. These idioms harness the symbolic completeness of five in Chinese philosophy.',
    idiomIds: ['ID220', 'ID308', 'ID319', 'ID353', 'ID384', 'ID410', 'ID376', 'ID388'],
    category: 'Numbers',
    publishedDate: '2025-07-16'
  },
  {
    slug: 'chinese-idioms-with-number-six',
    title: '8 Lucky Chinese Idioms With the Number Six (六)',
    description: 'Smooth Chinese idioms featuring the number six - associated with smoothness and good fortune in Chinese culture.',
    metaDescription: 'Go smoothly with 8 Chinese idioms featuring the number six. These lucky chengyu celebrate fortune and ease in Mandarin.',
    keywords: ['chinese idioms six', 'number 6 chinese phrases', 'chengyu with six', 'chinese lucky number six', 'liu liu da shun meaning'],
    intro: 'Six (六, liù) is considered lucky in Chinese culture because it sounds like "flow" (流), suggesting everything going smoothly (六六大顺). These idioms feature this auspicious number.',
    idiomIds: ['ID220', 'ID308', 'ID317', 'ID319', 'ID322', 'ID353', 'ID376', 'ID384'],
    category: 'Numbers',
    publishedDate: '2025-07-17'
  },
  {
    slug: 'chinese-idioms-with-number-ten',
    title: '10 Complete Chinese Idioms With the Number Ten (十)',
    description: 'Chinese idioms featuring the number ten - representing perfection, completeness, and absolute certainty.',
    metaDescription: 'Achieve perfection with 10 Chinese idioms featuring the number ten. These complete chengyu express certainty in Mandarin.',
    keywords: ['chinese idioms ten', 'number 10 chinese phrases', 'chengyu with ten', 'chinese perfection expressions', 'shi quan shi mei meaning'],
    intro: 'Ten (十, shí) represents completeness and perfection in Chinese culture - the most "complete" single number. These idioms use ten to express absolute certainty, total coverage, or complete mastery.',
    idiomIds: ['ID057', 'ID186', 'ID308', 'ID317', 'ID319', 'ID322', 'ID376', 'ID384', 'ID388', 'ID451'],
    category: 'Numbers',
    publishedDate: '2025-07-18'
  },
  {
    slug: 'chinese-idioms-vs-japanese-kotowaza',
    title: '10 Chinese Idioms & Their Japanese Kotowaza Equivalents',
    description: 'Fascinating parallels between Chinese chengyu and Japanese kotowaza - shared wisdom across East Asian cultures.',
    metaDescription: 'Compare 10 Chinese idioms with Japanese kotowaza equivalents. Discover shared wisdom between Chinese and Japanese proverbs.',
    keywords: ['chinese idioms vs japanese', 'chengyu kotowaza comparison', 'chinese japanese proverbs', 'east asian idiom parallels', 'mandarin japanese similar sayings'],
    intro: 'Many Japanese proverbs (ことわざ, kotowaza) share roots with Chinese idioms, since Japan historically adopted Chinese characters and philosophy. These fascinating parallels reveal shared East Asian wisdom.',
    idiomIds: ['ID005', 'ID009', 'ID014', 'ID015', 'ID018', 'ID042', 'ID074', 'ID076', 'ID088', 'ID141'],
    category: 'Cross-Cultural',
    publishedDate: '2025-07-19'
  },
  {
    slug: 'chinese-idioms-vs-korean-proverbs',
    title: '10 Chinese Idioms & Their Korean Proverb Equivalents',
    description: 'Discover the connections between Chinese chengyu and Korean sajaseong-eo - shared East Asian proverbial wisdom.',
    metaDescription: 'Compare 10 Chinese idioms with Korean equivalents. These chengyu and sajaseong-eo reveal shared cultural wisdom.',
    keywords: ['chinese idioms vs korean', 'chengyu korean comparison', 'chinese korean proverbs', 'sajaseongeo chinese', 'mandarin korean similar sayings'],
    intro: 'Korean four-character idioms (사자성어, sajaseong-eo) share deep roots with Chinese chengyu. These cross-cultural parallels show how Chinese wisdom traveled across East Asia.',
    idiomIds: ['ID001', 'ID005', 'ID006', 'ID009', 'ID010', 'ID014', 'ID018', 'ID021', 'ID042', 'ID076'],
    category: 'Cross-Cultural',
    publishedDate: '2025-07-20'
  },
  {
    slug: 'chinese-idioms-for-anime-manga-fans',
    title: '10 Chinese Idioms Every Anime & Manga Fan Should Know',
    description: 'Chinese idioms commonly used in anime, manga, and donghua - perfect for fans learning East Asian languages.',
    metaDescription: 'Level up your anime knowledge with 10 Chinese idioms for manga fans. These chengyu appear frequently in donghua and anime.',
    keywords: ['chinese idioms anime', 'manga chinese phrases', 'donghua chengyu', 'chinese otaku expressions', 'mandarin anime idioms', 'chinese idioms in anime'],
    intro: 'Love anime and manga? Many Chinese idioms appear in donghua (Chinese animation) and are shared across Japanese and Chinese media. These chengyu will level up your understanding of East Asian pop culture.',
    idiomIds: ['ID001', 'ID005', 'ID014', 'ID017', 'ID025', 'ID042', 'ID049', 'ID074', 'ID131', 'ID271'],
    category: 'Pop Culture',
    publishedDate: '2025-07-21'
  },
  {
    slug: 'chinese-idioms-about-speed',
    title: '10 Chinese Idioms About Speed & Quickness',
    description: 'Fast-paced Chinese idioms about speed, swiftness, and doing things with lightning efficiency.',
    metaDescription: 'Move fast with 10 Chinese idioms about speed. These swift chengyu describe lightning-quick action in Mandarin.',
    keywords: ['chinese idioms speed', 'fast chinese phrases', 'chengyu for quick', 'chinese swift expressions', 'mandarin speed idioms'],
    intro: 'Speed is celebrated in Chinese idioms through vivid imagery - from galloping horses to lightning strikes. These expressions describe swift action, quick thinking, and impressive efficiency.',
    idiomIds: ['ID017', 'ID018', 'ID026', 'ID046', 'ID054', 'ID063', 'ID096', 'ID119', 'ID133', 'ID195'],
    category: 'Descriptive',
    publishedDate: '2025-07-22'
  },
  {
    slug: 'chinese-idioms-about-danger-risk',
    title: '10 Chinese Idioms About Danger & Risk',
    description: 'Thrilling Chinese idioms about danger, risk-taking, and navigating perilous situations with wisdom.',
    metaDescription: 'Navigate danger with 10 Chinese idioms about risk. These thrilling chengyu teach wisdom in perilous situations in Mandarin.',
    keywords: ['chinese idioms danger', 'risk chinese phrases', 'chengyu for peril', 'chinese dangerous expressions', 'mandarin danger idioms'],
    intro: 'Life is full of risks, and Chinese idioms offer wisdom for navigating dangerous situations. These expressions teach when to be cautious, when to be bold, and how to survive against the odds.',
    idiomIds: ['ID042', 'ID046', 'ID053', 'ID079', 'ID131', 'ID135', 'ID155', 'ID211', 'ID272', 'ID293'],
    category: 'Strategy',
    publishedDate: '2025-07-23'
  },
  {
    slug: 'chinese-idioms-about-poverty-hardship',
    title: '10 Chinese Idioms About Poverty & Hardship',
    description: 'Resilient Chinese idioms about poverty, economic hardship, and maintaining dignity through difficult financial times.',
    metaDescription: 'Rise above poverty with 10 Chinese idioms about hardship. These resilient chengyu teach dignity through difficulty in Mandarin.',
    keywords: ['chinese idioms poverty', 'hardship chinese phrases', 'chengyu for struggle', 'chinese poor expressions', 'mandarin poverty idioms'],
    intro: 'Chinese history is filled with stories of people rising from poverty to greatness. These idioms acknowledge the reality of hardship while celebrating the resilience and dignity of those who endure.',
    idiomIds: ['ID005', 'ID009', 'ID014', 'ID026', 'ID061', 'ID092', 'ID164', 'ID235', 'ID246', 'ID252'],
    category: 'Life Philosophy',
    publishedDate: '2025-07-24'
  },
  {
    slug: 'chinese-idioms-about-travel-journey',
    title: '12 Chinese Idioms About Travel & Journey',
    description: 'Adventurous Chinese idioms about traveling, journeys, and the wisdom gained from exploring the world.',
    metaDescription: 'Embark on adventure with 12 Chinese idioms about travel and journey. These chengyu celebrate exploration and discovery in Mandarin.',
    keywords: ['chinese idioms travel', 'journey chinese phrases', 'chengyu for adventure', 'chinese exploration expressions', 'mandarin travel idioms', 'chinese road trip sayings'],
    intro: 'Chinese culture has always valued travel as a form of education - "reading ten thousand books is not as good as traveling ten thousand miles." These idioms celebrate the wisdom of the open road.',
    idiomIds: ['ID003', 'ID007', 'ID012', 'ID017', 'ID023', 'ID029', 'ID036', 'ID060', 'ID127', 'ID175', 'ID197', 'ID233'],
    category: 'Life Philosophy',
    publishedDate: '2025-07-25'
  },
  {
    slug: 'chinese-idioms-about-war-battle',
    title: '12 Chinese Idioms About War & Battle',
    description: 'Fierce Chinese idioms from ancient battlefields about military strategy, warfare, and the art of winning.',
    metaDescription: 'Conquer with 12 Chinese idioms about war and battle. These fierce chengyu teach military strategy and tactics in Mandarin.',
    keywords: ['chinese idioms war', 'battle chinese phrases', 'chengyu for military', 'chinese warfare expressions', 'mandarin war idioms', 'chinese battle strategy'],
    intro: 'China\'s long military history produced brilliant strategic thinking that remains relevant today. These battle-tested idioms teach tactics, leadership, and the art of winning.',
    idiomIds: ['ID005', 'ID017', 'ID026', 'ID042', 'ID077', 'ID111', 'ID131', 'ID165', 'ID189', 'ID270', 'ID291', 'ID306'],
    category: 'Strategy',
    publishedDate: '2025-07-26'
  },
  {
    slug: 'chinese-idioms-about-color-red',
    title: '8 Auspicious Chinese Idioms About the Color Red (红)',
    description: 'Lucky Chinese idioms featuring the color red - the most auspicious color in Chinese culture.',
    metaDescription: 'Discover 8 lucky Chinese idioms about the color red. These auspicious chengyu celebrate China\'s luckiest color in Mandarin.',
    keywords: ['chinese idioms red', 'red color chinese phrases', 'hong chengyu', 'chinese lucky color expressions', 'mandarin red idioms', 'chinese auspicious color'],
    intro: 'Red (红, hóng) is the most auspicious color in Chinese culture, symbolizing luck, happiness, and prosperity. These idioms featuring red carry extra significance during celebrations.',
    idiomIds: ['ID011', 'ID020', 'ID025', 'ID082', 'ID087', 'ID303', 'ID436', 'ID517'],
    category: 'Culture',
    publishedDate: '2025-07-27'
  },
  {
    slug: 'chinese-idioms-about-gold-treasure',
    title: '10 Chinese Idioms About Gold & Treasure (金)',
    description: 'Precious Chinese idioms featuring gold - about value, worth, and what truly constitutes treasure in life.',
    metaDescription: 'Strike gold with 10 Chinese idioms about treasure. These precious chengyu explore true value and worth in Mandarin.',
    keywords: ['chinese idioms gold', 'treasure chinese phrases', 'jin chengyu', 'chinese value expressions', 'mandarin gold idioms', 'chinese precious sayings'],
    intro: 'Gold (金, jīn) in Chinese idioms represents not just material wealth but also moral value, reliability, and preciousness. These expressions explore what truly constitutes treasure.',
    idiomIds: ['ID011', 'ID057', 'ID082', 'ID087', 'ID141', 'ID162', 'ID199', 'ID257', 'ID523', 'ID583'],
    category: 'Culture',
    publishedDate: '2025-07-28'
  },
  {
    slug: 'chinese-idioms-hsk-3',
    title: '10 Simple Chinese Idioms for HSK 3 Learners',
    description: 'Easy Chinese idioms that HSK 3 students should learn first - commonly used, simple to understand chengyu for pre-intermediate learners.',
    metaDescription: 'Preparing for HSK 3? Learn 10 simple Chinese idioms perfect for pre-intermediate learners. These easy chengyu appear in HSK 3 materials.',
    keywords: ['hsk 3 idioms', 'chinese idioms hsk3', 'simple chengyu', 'pre-intermediate chinese idioms', 'hsk 3 vocabulary', 'beginner chengyu list'],
    intro: 'HSK 3 is where you start encountering Chinese idioms in everyday contexts. These 10 simple, commonly-used chengyu are perfect for pre-intermediate learners - easy to understand and frequently used.',
    idiomIds: ['ID001', 'ID004', 'ID008', 'ID009', 'ID010', 'ID014', 'ID017', 'ID020', 'ID034', 'ID042'],
    category: 'Learning',
    publishedDate: '2025-07-29'
  },
  {
    slug: 'chinese-idioms-about-greed',
    title: '8 Chinese Idioms About Greed & Excess',
    description: 'Cautionary Chinese idioms about greed, excess, and the dangers of always wanting more.',
    metaDescription: 'Beware greed with 8 Chinese idioms about excess. These cautionary chengyu warn about always wanting more in Mandarin.',
    keywords: ['chinese idioms greed', 'excess chinese phrases', 'chengyu for greedy', 'chinese desire expressions', 'mandarin greed idioms'],
    intro: 'Chinese wisdom strongly warns against greed and excess. These idioms describe the many faces of avarice and its inevitable consequences - from never being satisfied to losing everything.',
    idiomIds: ['ID013', 'ID019', 'ID062', 'ID072', 'ID083', 'ID152', 'ID261', 'ID330'],
    category: 'Character',
    publishedDate: '2025-07-30'
  },
  {
    slug: 'chinese-idioms-about-confusion',
    title: '8 Chinese Idioms About Confusion & Being Lost',
    description: 'Bewildering Chinese idioms about confusion, feeling lost, and navigating uncertainty.',
    metaDescription: 'Navigate confusion with 8 Chinese idioms about being lost. These bewildering chengyu describe uncertainty in Mandarin.',
    keywords: ['chinese idioms confusion', 'lost chinese phrases', 'chengyu for bewildered', 'chinese uncertain expressions', 'mandarin confusion idioms'],
    intro: 'Feeling lost? You\'re not alone. Chinese idioms vividly describe confusion, bewilderment, and the disorientation we all experience. Some also offer wisdom on finding clarity amid chaos.',
    idiomIds: ['ID046', 'ID083', 'ID135', 'ID155', 'ID272', 'ID293', 'ID363', 'ID374'],
    category: 'Emotions',
    publishedDate: '2025-07-31'
  },
  {
    slug: 'chinese-idioms-about-knowledge-learning',
    title: '12 Chinese Idioms About Knowledge & Lifelong Learning',
    description: 'Scholarly Chinese idioms celebrating knowledge, intellectual curiosity, and the never-ending pursuit of learning.',
    metaDescription: 'Never stop learning with 12 Chinese idioms about knowledge. These scholarly chengyu celebrate intellectual growth in Mandarin.',
    keywords: ['chinese idioms knowledge', 'learning chinese phrases', 'chengyu for education', 'chinese wisdom expressions', 'mandarin knowledge idioms', 'chinese study sayings'],
    intro: 'Knowledge is a boundless ocean in Chinese philosophy. These idioms celebrate the joy of learning, the humility of the truly wise, and the transformative power of education.',
    idiomIds: ['ID002', 'ID003', 'ID006', 'ID010', 'ID016', 'ID021', 'ID025', 'ID028', 'ID036', 'ID045', 'ID073', 'ID084'],
    category: 'Learning',
    publishedDate: '2025-08-01'
  },
  {
    slug: 'chinese-idioms-about-simplicity',
    title: '8 Chinese Idioms About Simplicity & Minimalism',
    description: 'Elegant Chinese idioms about simplicity, minimalism, and the beauty of a less-is-more approach to life.',
    metaDescription: 'Embrace simplicity with 8 Chinese idioms about minimalism. These elegant chengyu celebrate the less-is-more philosophy in Mandarin.',
    keywords: ['chinese idioms simplicity', 'minimalism chinese phrases', 'chengyu for simple living', 'chinese less is more expressions', 'mandarin simplicity idioms'],
    intro: 'In a world of excess, Chinese philosophy offers elegant simplicity. These idioms celebrate the beauty of restraint, the wisdom of doing less, and the power of keeping things pure and uncluttered.',
    idiomIds: ['ID006', 'ID007', 'ID015', 'ID018', 'ID024', 'ID030', 'ID040', 'ID076'],
    category: 'Philosophy',
    publishedDate: '2025-08-02'
  },
  {
    slug: 'chinese-idioms-with-ear',
    title: '8 Chinese Idioms With Ear (耳)',
    description: 'Listen carefully to Chinese idioms featuring the ear - about hearing, listening, and the wisdom of paying attention.',
    metaDescription: 'Listen up with 8 Chinese idioms with ear (耳). These chengyu teach the art of listening and awareness in Mandarin.',
    keywords: ['chinese idioms ear', 'ear chengyu', '耳 idioms', 'chinese listening expressions', 'mandarin ear idioms'],
    intro: 'The ear (耳, ěr) in Chinese idioms represents listening, awareness, and the wisdom gained through paying attention. These expressions teach that hearing is different from truly listening.',
    idiomIds: ['ID061', 'ID069', 'ID078', 'ID132', 'ID146', 'ID213', 'ID226', 'ID280'],
    category: 'Body & Mind',
    publishedDate: '2025-08-03'
  },
  {
    slug: 'chinese-idioms-with-foot',
    title: '8 Chinese Idioms With Foot (足)',
    description: 'Grounded Chinese idioms featuring the foot - about standing firm, traveling, and taking the first step.',
    metaDescription: 'Stand firm with 8 Chinese idioms with foot (足). These grounded chengyu teach about journeys and foundations in Mandarin.',
    keywords: ['chinese idioms foot', 'foot chengyu', '足 idioms', 'chinese walking expressions', 'mandarin foot idioms'],
    intro: 'The foot (足, zú) in Chinese idioms represents journeys, foundations, and the importance of taking action. These expressions teach about standing firm and taking that crucial first step.',
    idiomIds: ['ID013', 'ID017', 'ID026', 'ID036', 'ID096', 'ID119', 'ID133', 'ID195'],
    category: 'Body & Mind',
    publishedDate: '2025-08-04'
  },
  {
    slug: 'chinese-idioms-for-opening-ceremony',
    title: '10 Chinese Idioms for Grand Openings & New Beginnings',
    description: 'Auspicious Chinese idioms for business openings, store launches, and grand beginnings.',
    metaDescription: 'Launch with luck! 10 Chinese idioms for grand openings and new beginnings. Perfect chengyu for business launches in Mandarin.',
    keywords: ['chinese idioms opening ceremony', 'new business chinese phrases', 'chengyu for launch', 'chinese grand opening expressions', 'mandarin new beginning idioms'],
    intro: 'Opening a new business or starting a new venture? These auspicious idioms bring good fortune and positive energy to grand openings, ribbon cuttings, and launch celebrations.',
    idiomIds: ['ID001', 'ID011', 'ID017', 'ID020', 'ID025', 'ID060', 'ID082', 'ID087', 'ID154', 'ID436'],
    category: 'Occasions',
    publishedDate: '2025-08-05'
  },
  {
    slug: 'chinese-idioms-about-laziness',
    title: '8 Chinese Idioms About Laziness & Procrastination',
    description: 'Colorful Chinese idioms about laziness, procrastination, and what happens when you don\'t put in the work.',
    metaDescription: 'Stop procrastinating! 8 Chinese idioms about laziness describe the consequences of not putting in the work in Mandarin.',
    keywords: ['chinese idioms laziness', 'procrastination chinese phrases', 'chengyu for lazy', 'chinese slacker expressions', 'mandarin laziness idioms'],
    intro: 'Chinese culture values diligence, so its idioms have plenty to say about laziness and procrastination. These colorful expressions warn about the consequences of not putting in the effort.',
    idiomIds: ['ID037', 'ID053', 'ID074', 'ID088', 'ID109', 'ID200', 'ID247', 'ID269'],
    category: 'Character',
    publishedDate: '2025-08-06'
  },
  {
    slug: 'chinese-idioms-most-difficult-to-translate',
    title: '10 Untranslatable Chinese Idioms - Concepts That Don\'t Exist in English',
    description: 'Chinese idioms with no English equivalent - unique cultural concepts that reveal how Chinese sees the world differently.',
    metaDescription: 'Discover 10 untranslatable Chinese idioms with no English equivalent. These unique chengyu reveal cultural concepts that defy translation.',
    keywords: ['untranslatable chinese idioms', 'chinese concepts no english word', 'unique chengyu', 'chinese cultural expressions', 'mandarin untranslatable', 'chinese idioms hard to translate'],
    intro: 'Some Chinese idioms express concepts so unique that no English equivalent exists. These untranslatable expressions reveal how Chinese culture sees the world differently - and expand how you think about language itself.',
    idiomIds: ['ID007', 'ID012', 'ID015', 'ID018', 'ID019', 'ID023', 'ID024', 'ID040', 'ID076', 'ID134'],
    category: 'Culture',
    publishedDate: '2025-08-07'
  },
  {
    slug: 'chinese-idioms-about-friendship-loyalty',
    title: '10 Chinese Idioms About True Friendship & Loyalty',
    description: 'Heartfelt Chinese idioms about true friendship, loyal companions, and the bonds that last a lifetime.',
    metaDescription: 'Celebrate friendship with 10 Chinese idioms about true loyalty. These heartfelt chengyu honor lasting bonds in Mandarin.',
    keywords: ['chinese idioms true friendship', 'loyalty friends chinese', 'chengyu for best friend', 'chinese companion expressions', 'mandarin friendship loyalty idioms', 'chinese best friend sayings'],
    intro: 'True friendship is one of life\'s greatest treasures. These Chinese idioms celebrate the friends who stand by you through thick and thin - the loyal companions who make life worth living.',
    idiomIds: ['ID022', 'ID027', 'ID031', 'ID035', 'ID043', 'ID082', 'ID087', 'ID095', 'ID102', 'ID180'],
    category: 'Relationships',
    publishedDate: '2025-08-08'
  },
  {
    slug: 'chinese-idioms-for-study-abroad',
    title: '10 Chinese Idioms for Study Abroad & International Students',
    description: 'Essential Chinese idioms for international students and anyone studying abroad in China.',
    metaDescription: 'Studying in China? Learn 10 essential Chinese idioms for international students. These chengyu help you fit in abroad.',
    keywords: ['chinese idioms study abroad', 'international student chinese', 'chengyu for foreigners in china', 'studying in china expressions', 'mandarin study abroad idioms'],
    intro: 'Heading to China to study? These idioms will help you connect with classmates, impress professors, and show your commitment to truly understanding Chinese culture beyond textbooks.',
    idiomIds: ['ID002', 'ID003', 'ID006', 'ID010', 'ID014', 'ID021', 'ID025', 'ID028', 'ID044', 'ID082'],
    category: 'Learning',
    publishedDate: '2025-08-09'
  },
  {
    slug: 'chinese-idioms-about-old-age-wisdom',
    title: '10 Chinese Idioms About Old Age & Elder Wisdom',
    description: 'Respectful Chinese idioms about aging, elder wisdom, and the treasure of experience that comes with years.',
    metaDescription: 'Honor elders with 10 Chinese idioms about old age wisdom. These respectful chengyu celebrate the value of experience in Mandarin.',
    keywords: ['chinese idioms old age', 'elder wisdom chinese', 'chengyu for elderly', 'chinese aging expressions', 'mandarin old age idioms', 'chinese respect elders sayings'],
    intro: 'Chinese culture deeply reveres the wisdom that comes with age. These idioms honor the elderly, celebrate the value of experience, and remind younger generations to respect and learn from their elders.',
    idiomIds: ['ID018', 'ID091', 'ID133', 'ID134', 'ID154', 'ID222', 'ID262', 'ID295', 'ID301', 'ID603'],
    category: 'Life Philosophy',
    publishedDate: '2025-08-10'
  },
  {
    slug: 'chinese-idioms-about-persistence-water',
    title: '8 Chinese Idioms About Persistence - Water Wears Through Stone',
    description: 'Inspiring water-themed Chinese idioms about persistence, gradual progress, and how small efforts create big results.',
    metaDescription: 'Water wears through stone! 8 Chinese idioms about persistence teach how small efforts create massive results in Mandarin.',
    keywords: ['chinese idioms persistence', 'water stone chinese', 'shui di shi chuan meaning', 'gradual progress chengyu', 'chinese persistent effort', 'mandarin persistence water idioms'],
    intro: 'Water drops can pierce stone (水滴石穿) - this famous Chinese concept teaches that consistent small efforts overcome even the greatest obstacles. These water-themed idioms celebrate patient persistence.',
    idiomIds: ['ID005', 'ID009', 'ID015', 'ID019', 'ID026', 'ID032', 'ID076', 'ID154'],
    category: 'Perseverance',
    publishedDate: '2025-08-11'
  },
  {
    slug: 'chinese-idioms-about-eating-humble-pie',
    title: '10 Chinese Idioms About Enduring Hardship (吃苦)',
    description: 'Tough Chinese idioms about eating bitterness, enduring hardship, and the Chinese concept of 吃苦 (chī kǔ).',
    metaDescription: 'Understand 吃苦 with 10 Chinese idioms about enduring hardship. These tough chengyu teach resilience through suffering in Mandarin.',
    keywords: ['chi ku chinese idiom', 'eating bitterness chinese', 'endure hardship chengyu', 'chinese suffering expressions', 'mandarin chi ku meaning', 'chinese tough it out idioms'],
    intro: 'The Chinese concept of 吃苦 (chī kǔ, "eating bitterness") is central to Chinese values. These idioms celebrate the ability to endure hardship, a quality deeply admired in Chinese culture.',
    idiomIds: ['ID005', 'ID009', 'ID014', 'ID026', 'ID032', 'ID061', 'ID092', 'ID164', 'ID235', 'ID246'],
    category: 'Culture',
    publishedDate: '2025-08-12'
  },
  {
    slug: 'chinese-idioms-for-wishing-good-luck',
    title: '12 Chinese Idioms for Wishing Someone Good Luck',
    description: 'Lucky Chinese idioms for wishing someone good fortune before exams, job interviews, competitions, and new ventures.',
    metaDescription: 'Wish good luck with 12 Chinese idioms! These lucky chengyu are perfect for exams, interviews, and new ventures in Mandarin.',
    keywords: ['chinese idioms good luck', 'wish luck chinese phrases', 'chengyu for blessing', 'chinese fortune expressions', 'mandarin good luck idioms', 'chinese exam wishes'],
    intro: 'Need to wish someone good luck in Chinese? Whether they\'re facing an exam, job interview, or starting a new venture, these lucky idioms convey your best wishes powerfully.',
    idiomIds: ['ID001', 'ID011', 'ID017', 'ID020', 'ID021', 'ID025', 'ID082', 'ID087', 'ID154', 'ID303', 'ID436', 'ID517'],
    category: 'Occasions',
    publishedDate: '2025-08-13'
  },
  {
    slug: 'chinese-idioms-positive-affirmations',
    title: '10 Chinese Idioms as Daily Positive Affirmations',
    description: 'Transform Chinese idioms into daily affirmations for confidence, growth mindset, and self-belief.',
    metaDescription: 'Boost confidence with 10 Chinese idioms as daily affirmations. These empowering chengyu build a growth mindset in Mandarin.',
    keywords: ['chinese idioms affirmations', 'positive chinese phrases', 'chengyu for confidence', 'chinese self belief expressions', 'mandarin affirmation idioms', 'chinese motivational quotes daily'],
    intro: 'Start each day with ancient Chinese wisdom. These idioms work perfectly as daily affirmations - short, powerful reminders of your potential, resilience, and the growth mindset that leads to success.',
    idiomIds: ['ID001', 'ID005', 'ID006', 'ID009', 'ID014', 'ID017', 'ID021', 'ID026', 'ID044', 'ID082'],
    category: 'Self-Improvement',
    publishedDate: '2025-08-14'
  },
  {
    slug: 'chinese-idioms-about-marriage',
    title: '10 Chinese Idioms About Marriage & Married Life',
    description: 'Realistic Chinese idioms about marriage, married life, and the joys and challenges of sharing your life with someone.',
    metaDescription: 'Navigate marriage with 10 Chinese idioms about married life. These realistic chengyu cover love\'s joys and challenges in Mandarin.',
    keywords: ['chinese idioms marriage', 'married life chinese phrases', 'chengyu for husband wife', 'chinese marriage expressions', 'mandarin marriage idioms', 'chinese spouse sayings'],
    intro: 'Marriage in Chinese culture is both a personal journey and a family affair. These idioms capture the full spectrum of married life - from blissful harmony to the realistic challenges every couple faces.',
    idiomIds: ['ID008', 'ID027', 'ID031', 'ID056', 'ID118', 'ID248', 'ID420', 'ID597', 'ID603', 'ID605'],
    category: 'Relationships',
    publishedDate: '2025-08-15'
  },
  {
    slug: 'chinese-idioms-about-reputation',
    title: '10 Chinese Idioms About Reputation & Legacy',
    description: 'Chinese idioms about building reputation, leaving a legacy, and the lasting impact of how you live your life.',
    metaDescription: 'Build your legacy with 10 Chinese idioms about reputation. These chengyu teach the importance of a good name in Mandarin.',
    keywords: ['chinese idioms reputation', 'legacy chinese phrases', 'chengyu for name', 'chinese honor expressions', 'mandarin reputation idioms', 'chinese legacy sayings'],
    intro: 'Your reputation follows you forever in Chinese culture. These idioms explore how reputations are built, damaged, and preserved - and why the legacy you leave matters more than temporary gains.',
    idiomIds: ['ID001', 'ID030', 'ID062', 'ID082', 'ID087', 'ID091', 'ID123', 'ID141', 'ID207', 'ID209'],
    category: 'Character',
    publishedDate: '2025-08-16'
  },
];

export function getListiclesForIdiom(idiomId: string, limit = 3): Listicle[] {
  return listicles.filter(l => l.idiomIds.includes(idiomId)).slice(0, limit);
}

export function getListiclesForTheme(theme: string, limit = 3): Listicle[] {
  const themeKeyword = theme.toLowerCase().replace(' & ', ' ').replace(/\s+/g, '-');
  return listicles.filter(l =>
    l.category.toLowerCase().includes(themeKeyword) ||
    l.keywords.some(k => k.toLowerCase().includes(themeKeyword))
  ).slice(0, limit);
}

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

// Translation-aware functions
function loadTranslatedListicles(lang: string): TranslatedListicle[] {
  const translatedPath = path.join(process.cwd(), `public/translations/${lang}/listicles.json`);
  if (fs.existsSync(translatedPath)) {
    return JSON.parse(fs.readFileSync(translatedPath, 'utf-8'));
  }
  // Fallback to English if translation doesn't exist - add originalSlug for compatibility
  return listicles.map(l => ({ ...l, originalSlug: l.slug }));
}

function loadTranslatedIdioms(lang: string) {
  const translatedPath = path.join(process.cwd(), `public/translations/${lang}/idioms.json`);
  if (fs.existsSync(translatedPath)) {
    return JSON.parse(fs.readFileSync(translatedPath, 'utf-8'));
  }
  return idioms;
}

export function getAllListiclesTranslated(lang?: string): (Listicle | TranslatedListicle)[] {
  if (!lang || lang === 'en') {
    return listicles;
  }
  return loadTranslatedListicles(lang);
}

// Get listicle by localized slug (for URL routing)
export function getListicleBySlug(slug: string, lang?: string): (Listicle | TranslatedListicle) | null {
  const allListicles = getAllListiclesTranslated(lang);
  return allListicles.find(l => l.slug === slug) || null;
}

// Get listicle by original English slug (for cross-language linking)
export function getListicleByOriginalSlug(originalSlug: string, lang?: string): (Listicle | TranslatedListicle) | null {
  if (!lang || lang === 'en') {
    return listicles.find(l => l.slug === originalSlug) || null;
  }
  const allListicles = loadTranslatedListicles(lang);
  return allListicles.find(l => l.originalSlug === originalSlug) || null;
}

// Get the localized slug for an original English slug
export function getLocalizedSlug(originalSlug: string, lang?: string): string {
  if (!lang || lang === 'en') {
    return originalSlug;
  }
  const listicle = getListicleByOriginalSlug(originalSlug, lang);
  return listicle?.slug || originalSlug;
}

// Get the original English slug from a localized slug
export function getOriginalSlug(localizedSlug: string, lang?: string): string {
  if (!lang || lang === 'en') {
    return localizedSlug;
  }
  const listicle = getListicleBySlug(localizedSlug, lang) as TranslatedListicle | null;
  return listicle?.originalSlug || localizedSlug;
}

// Legacy function - kept for backward compatibility
export function getListicleTranslated(slug: string, lang?: string): (Listicle | TranslatedListicle) | null {
  return getListicleBySlug(slug, lang);
}

export function getListicleWithIdiomsTranslated(slug: string, lang?: string) {
  const listicle = getListicleBySlug(slug, lang);
  if (!listicle) return null;

  // Load translated idioms if available
  const translatedIdioms = lang && lang !== 'en' ? loadTranslatedIdioms(lang) : idioms;

  const idiomsWithSlugs = listicle.idiomIds.map(id => {
    const idiom = translatedIdioms.find((i: { id: string }) => i.id === id);
    const blogSlug = getIdiomBlogSlug(id);
    return { idiom, blogSlug };
  }).filter(item => item.idiom !== undefined);

  return {
    ...listicle,
    idioms: idiomsWithSlugs
  };
}
