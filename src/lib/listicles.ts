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
