import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type ZodiacSign = {
  slug: string;
  /** English animal name, capitalized, e.g. 'Rat'. */
  animal: string;
  chineseName: string;
  pinyin: string;
  /** Rank in the 12-year cycle, 1 = Rat … 12 = Pig. */
  order: number;
  /** Fixed element traditionally associated with the sign. */
  element: 'Water' | 'Earth' | 'Wood' | 'Fire' | 'Metal';
  /** yin or yang polarity. */
  yinYang: 'Yin' | 'Yang';
  /** One-line hook used on cards and meta descriptions. */
  tagline: string;
  /** Longer overview paragraph for the sign page. */
  overview: string;
  /** Core positive traits. */
  strengths: string[];
  /** Common weaknesses. */
  weaknesses: string[];
  /** Animal slugs in the same compatibility trine (best long-term matches). */
  bestMatches: string[];
  /** Animal slug of the direct clash (opposite sign, 6 apart). */
  clash: string;
  /** Numbers traditionally associated with the sign (per popular almanac tradition). */
  luckyNumbers: number[];
  /** Colors traditionally associated with the sign. */
  luckyColors: string[];
  /** Prefix for any long-form blog essays tied to this sign. */
  postPrefix: string;
};

export type ZodiacPost = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type SignWithPosts = ZodiacSign & { posts: ZodiacPost[] };

// The four compatibility trines (each set of 3 harmonizes):
//   (Rat, Dragon, Monkey) (Ox, Snake, Rooster) (Tiger, Horse, Dog) (Rabbit, Goat, Pig)
// The six clashes (opposite / 6 apart):
//   Rat↔Horse  Ox↔Goat  Tiger↔Monkey  Rabbit↔Rooster  Dragon↔Dog  Snake↔Pig
const SIGNS: ZodiacSign[] = [
  {
    slug: 'rat', animal: 'Rat', chineseName: '鼠', pinyin: 'shǔ', order: 1,
    element: 'Water', yinYang: 'Yang',
    tagline: 'Quick-witted and resourceful — the clever survivor who wins by outsmarting, not overpowering.',
    overview:
      'The Rat won the Jade Emperor\'s Great Race by riding on the Ox\'s back and leaping off at the finish line — cunning over brute strength, which is the Rat all over. Rats read a room fast, spot an opening before anyone else does, and prize security: they build savings and alliances quietly rather than chase the spotlight. The trade-off is a tendency to overthink and to hoard, financially and emotionally.',
    strengths: ['Intelligent', 'Adaptable', 'Charming', 'Thrifty', 'Alert'],
    weaknesses: ['Opportunistic', 'Anxious', 'Stubborn', 'Overly cautious with money'],
    bestMatches: ['dragon', 'monkey', 'ox'], clash: 'horse',
    luckyNumbers: [2, 3], luckyColors: ['Blue', 'Gold', 'Green'],
    postPrefix: 'zodiac-rat-',
  },
  {
    slug: 'ox', animal: 'Ox', chineseName: '牛', pinyin: 'niú', order: 2,
    element: 'Earth', yinYang: 'Yin',
    tagline: 'Diligent and dependable — the one who finishes what everyone else only starts.',
    overview:
      'Ask an Ox to do something and it gets done — no shortcuts, no drama, no excuses. Reliability is the Ox\'s whole reputation, earned through work rather than words, which is why people lean on it in a crisis. The flip side of that resolve is a legendary stubbornness: an Ox rarely reverses a decision once it\'s made, dislikes being rushed, and forgives slowly.',
    strengths: ['Diligent', 'Reliable', 'Patient', 'Honest', 'Determined'],
    weaknesses: ['Stubborn', 'Inflexible', 'Reserved', 'Slow to forgive'],
    bestMatches: ['snake', 'rooster', 'rat'], clash: 'goat',
    luckyNumbers: [1, 4], luckyColors: ['White', 'Yellow', 'Green'],
    postPrefix: 'zodiac-ox-',
  },
  {
    slug: 'tiger', animal: 'Tiger', chineseName: '虎', pinyin: 'hǔ', order: 3,
    element: 'Wood', yinYang: 'Yang',
    tagline: 'Brave and magnetic — the one who charges in while everyone else is still deciding.',
    overview:
      'Tigers tend to walk into a room like they own it. Bold and quick to challenge authority, a Tiger would rather act and adjust than wait for permission, and that confidence pulls people along with it — sometimes into fights it didn\'t need to pick. Underneath the swagger is genuine warmth: Tigers are generous and fiercely protective of the people they claim as their own.',
    strengths: ['Brave', 'Confident', 'Charismatic', 'Generous', 'Ambitious'],
    weaknesses: ['Impulsive', 'Rebellious', 'Short-tempered', 'Overconfident'],
    bestMatches: ['horse', 'dog', 'pig'], clash: 'monkey',
    luckyNumbers: [1, 3, 4], luckyColors: ['Blue', 'Grey', 'Orange'],
    postPrefix: 'zodiac-tiger-',
  },
  {
    slug: 'rabbit', animal: 'Rabbit', chineseName: '兔', pinyin: 'tù', order: 4,
    element: 'Wood', yinYang: 'Yin',
    tagline: 'Tactful and perceptive — the diplomat who gets what they want without a fight.',
    overview:
      'The Rabbit is the negotiator who leaves everyone in the room feeling heard. Socially deft and quick to read people, it defuses tension before it builds and steers toward compromise rather than confrontation. Rabbits love comfort, good taste, and long friendships. Cornered into an open argument, though, a Rabbit is more likely to withdraw than to fight back.',
    strengths: ['Tactful', 'Diplomatic', 'Perceptive', 'Elegant', 'Prudent'],
    weaknesses: ['Conflict-avoidant', 'Timid', 'Overly sensitive', 'Aloof'],
    bestMatches: ['goat', 'pig', 'dog'], clash: 'rooster',
    luckyNumbers: [3, 4, 6], luckyColors: ['Red', 'Pink', 'Purple', 'Blue'],
    postPrefix: 'zodiac-rabbit-',
  },
  {
    slug: 'dragon', animal: 'Dragon', chineseName: '龙', pinyin: 'lóng', order: 5,
    element: 'Earth', yinYang: 'Yang',
    tagline: 'Charismatic, ambitious, and lucky — the only mythical sign, born to stand out.',
    overview:
      'No sign carries the prestige of the Dragon — the only mythical animal of the twelve, and the old emblem of the emperor himself. Dragons are charismatic and driven, drawing people in and holding everyone (themselves first) to high standards. That intensity comes with a short fuse for incompetence and a reluctance to admit fault, but few signs are more energizing to be around or more generous once they are on your side.',
    strengths: ['Charismatic', 'Ambitious', 'Confident', 'Energetic', 'Generous'],
    weaknesses: ['Arrogant', 'Impatient', 'Domineering', 'Unwilling to compromise'],
    bestMatches: ['rat', 'monkey', 'rooster'], clash: 'dog',
    luckyNumbers: [1, 6, 7], luckyColors: ['Gold', 'Silver', 'Grey'],
    postPrefix: 'zodiac-dragon-',
  },
  {
    slug: 'snake', animal: 'Snake', chineseName: '蛇', pinyin: 'shé', order: 6,
    element: 'Fire', yinYang: 'Yin',
    tagline: 'Wise and enigmatic — the quiet mind that is always three moves ahead.',
    overview:
      'Snakes say little and notice everything. Behind the calm, private surface is a sharp, calculating mind that thinks several moves ahead and is rarely fooled. Snakes prize elegance, act on judgment rather than impulse, and open up only to a chosen few. That reserve can register as secretive or possessive — but as strategists and confidants they are hard to beat.',
    strengths: ['Wise', 'Intuitive', 'Elegant', 'Composed', 'Determined'],
    weaknesses: ['Secretive', 'Suspicious', 'Possessive', 'Aloof'],
    bestMatches: ['ox', 'rooster', 'monkey'], clash: 'pig',
    luckyNumbers: [2, 8, 9], luckyColors: ['Red', 'Yellow', 'Black'],
    postPrefix: 'zodiac-snake-',
  },
  {
    slug: 'horse', animal: 'Horse', chineseName: '马', pinyin: 'mǎ', order: 7,
    element: 'Fire', yinYang: 'Yang',
    tagline: 'Free-spirited and warm — the adventurer who is happiest on the open road.',
    overview:
      'The Horse needs room to run. Independent and a little restless, it dives into new places, people, and plans with infectious energy — and loses interest the moment things turn stale. Horses are warm and quick with a joke, so they win people over easily, but the same craving for freedom makes them hard to pin down and quick to move on once they feel boxed in.',
    strengths: ['Energetic', 'Independent', 'Warm', 'Adventurous', 'Persuasive'],
    weaknesses: ['Restless', 'Impatient', 'Inconsistent', 'Blunt'],
    bestMatches: ['tiger', 'dog', 'goat'], clash: 'rat',
    luckyNumbers: [2, 3, 7], luckyColors: ['Yellow', 'Green'],
    postPrefix: 'zodiac-horse-',
  },
  {
    slug: 'goat', animal: 'Goat', chineseName: '羊', pinyin: 'yáng', order: 8,
    element: 'Earth', yinYang: 'Yin',
    tagline: 'Artistic and tender-hearted — the gentle soul with a rich inner world. (Also called Sheep or Ram.)',
    overview:
      'The Goat (also translated Sheep or Ram, 羊) tends to feel things a shade more deeply than everyone around it. Creative and soft-hearted, it lives in a vivid inner world and gives freely to the people it loves, craving beauty, calm, and a sense of security. Where a Rabbit smooths conflict through tact, the Goat simply avoids it — and under real pressure it worries and leans on others rather than pushing back.',
    strengths: ['Artistic', 'Empathetic', 'Gentle', 'Calm', 'Generous'],
    weaknesses: ['Indecisive', 'Anxious', 'Pessimistic', 'Dependent'],
    bestMatches: ['rabbit', 'pig', 'horse'], clash: 'ox',
    luckyNumbers: [2, 7], luckyColors: ['Green', 'Red', 'Purple'],
    postPrefix: 'zodiac-goat-',
  },
  {
    slug: 'monkey', animal: 'Monkey', chineseName: '猴', pinyin: 'hóu', order: 9,
    element: 'Metal', yinYang: 'Yang',
    tagline: 'Clever and inventive — the quick wit who solves what stumps everyone else.',
    overview:
      'Give a Monkey a problem and it will find three ways around it. Inventive and endlessly curious, the Monkey learns fast, improvises brilliantly, and can talk its way out of almost anything — the same mischief the legends give Sun Wukong. That restlessness sometimes slides into trickery or boredom, but few signs are more fun to have around or quicker to turn a situation to their advantage.',
    strengths: ['Clever', 'Curious', 'Versatile', 'Witty', 'Sociable'],
    weaknesses: ['Restless', 'Mischievous', 'Opportunistic', 'Impatient'],
    bestMatches: ['rat', 'dragon', 'snake'], clash: 'tiger',
    luckyNumbers: [4, 9], luckyColors: ['White', 'Gold', 'Blue'],
    postPrefix: 'zodiac-monkey-',
  },
  {
    slug: 'rooster', animal: 'Rooster', chineseName: '鸡', pinyin: 'jī', order: 10,
    element: 'Metal', yinYang: 'Yin',
    tagline: 'Observant and candid — the sharp eye who says what others won\'t.',
    overview:
      'A Rooster notices the detail everyone else missed — and will usually mention it. Meticulous and hardworking, it takes real pride in a job done right and keeps its word down to the minute. Roosters are honest to a fault, which can land as blunt or vain, but that same exacting standard is exactly why people trust them with the things that matter.',
    strengths: ['Observant', 'Hardworking', 'Confident', 'Honest', 'Punctual'],
    weaknesses: ['Critical', 'Vain', 'Blunt', 'Perfectionist'],
    bestMatches: ['ox', 'snake', 'dragon'], clash: 'rabbit',
    luckyNumbers: [5, 7, 8], luckyColors: ['Gold', 'Brown', 'Yellow'],
    postPrefix: 'zodiac-rooster-',
  },
  {
    slug: 'dog', animal: 'Dog', chineseName: '狗', pinyin: 'gǒu', order: 11,
    element: 'Earth', yinYang: 'Yang',
    tagline: 'Loyal, honest, and protective — the friend who always has your back.',
    overview:
      'When a Dog is on your side, it is on your side for good. Fair-minded and principled, it has a keen sense of right and wrong and defends the people and causes it believes in without hesitation. That vigilance can curdle into worry or suspicion, and Dogs can be quick to judge — but the loyalty underneath it, once given, is close to unconditional.',
    strengths: ['Loyal', 'Honest', 'Just', 'Protective', 'Responsible'],
    weaknesses: ['Anxious', 'Cynical', 'Stubborn', 'Overcritical'],
    bestMatches: ['tiger', 'horse', 'rabbit'], clash: 'dragon',
    luckyNumbers: [3, 4, 9], luckyColors: ['Green', 'Red', 'Purple'],
    postPrefix: 'zodiac-dog-',
  },
  {
    slug: 'pig', animal: 'Pig', chineseName: '猪', pinyin: 'zhū', order: 12,
    element: 'Water', yinYang: 'Yin',
    tagline: 'Generous, sincere, and easygoing — the warm heart who enjoys life\'s pleasures.',
    overview:
      'The Pig closes the cycle as the sign almost everyone likes. Sincere and good-natured, it takes people at face value and looks for the best in them, works hard when it counts, and never turns down good food or good company. That trusting warmth can shade into naivety — Pigs are easy to take advantage of — but they remain among the most genuinely well-liked of all twelve signs.',
    strengths: ['Generous', 'Sincere', 'Easygoing', 'Diligent', 'Optimistic'],
    weaknesses: ['Naive', 'Indulgent', 'Gullible', 'Non-confrontational'],
    bestMatches: ['rabbit', 'goat', 'tiger'], clash: 'snake',
    luckyNumbers: [2, 5, 8], luckyColors: ['Yellow', 'Grey', 'Brown', 'Gold'],
    postPrefix: 'zodiac-pig-',
  },
];

export function getAllSigns(): ZodiacSign[] {
  return SIGNS;
}

export function getSign(slug: string): ZodiacSign | null {
  return SIGNS.find(s => s.slug === slug) || null;
}

/**
 * Return the sign for a given Gregorian year. NOTE: this is a year-level
 * approximation. The Chinese zodiac year begins at Chinese New Year (late
 * Jan–mid Feb), so anyone born in January or early February may belong to the
 * previous animal year. The "what is my sign" tool warns about this edge case.
 */
export function getSignForYear(year: number): ZodiacSign {
  // 2020 was the Year of the Rat (order 1). Cycle every 12 years.
  const idx = ((year - 2020) % 12 + 12) % 12;
  return SIGNS[idx];
}

/** Relationship verdict between two signs, derived from trine/clash rules. */
export function getCompatibility(aSlug: string, bSlug: string): {
  level: 'Best match' | 'Good' | 'Neutral' | 'Challenging' | 'Clash';
  summary: string;
} {
  const a = getSign(aSlug);
  const b = getSign(bSlug);
  if (!a || !b) return { level: 'Neutral', summary: '' };
  if (a.slug === b.slug) {
    return { level: 'Good', summary: `Two ${a.animal}s share the same instincts and values, which builds easy understanding — though they may amplify each other's weaknesses too.` };
  }
  if (a.clash === b.slug) {
    return { level: 'Clash', summary: `${a.animal} and ${b.animal} sit directly opposite on the zodiac wheel — the classic "six clash" (六冲). Values and temperaments pull in opposite directions, so this pairing takes real work and compromise.` };
  }
  if (a.bestMatches.slice(0, 2).includes(b.slug)) {
    return { level: 'Best match', summary: `${a.animal} and ${b.animal} belong to the same compatibility trine (三合) — one of the strongest matches in the zodiac. They naturally understand and support each other.` };
  }
  if (a.bestMatches.includes(b.slug) || b.bestMatches.includes(a.slug)) {
    return { level: 'Good', summary: `${a.animal} and ${b.animal} complement each other well, balancing strengths and softening each other's rougher edges.` };
  }
  return { level: 'Neutral', summary: `${a.animal} and ${b.animal} have no strong traditional harmony or conflict. With mutual effort and communication, this pairing can work comfortably.` };
}

/** Given a blog post slug, return the sign it belongs to (or null). */
export function getSignForBlogSlug(blogSlug: string): ZodiacSign | null {
  return SIGNS.find(s => blogSlug.startsWith(s.postPrefix)) || null;
}

/** Return all long-form essays tied to a sign (newest first). Optional layer. */
export function getPostsForSign(signSlug: string, excludeSlug?: string): ZodiacPost[] {
  const sign = getSign(signSlug);
  if (!sign) return [];
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) return [];
  const posts: ZodiacPost[] = [];
  for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    if (!slug.startsWith(sign.postPrefix) || slug === excludeSlug) continue;
    const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));
    posts.push({ slug, title: data.title || slug, date: data.date || '', description: data.description || '' });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
