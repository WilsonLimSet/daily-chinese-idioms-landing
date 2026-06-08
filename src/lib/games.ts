import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type GameSeries = {
  slug: string;
  englishName: string;
  chineseName: string;
  pinyin: string;
  /** Release year, or an expected window for unreleased titles. */
  year: string;
  synopsis: string;
  /** Prefix that each related blog post's slug starts with. */
  postPrefix: string;
  /** Path to key art in /public, e.g. '/games/black-myth-wukong.jpg'. */
  poster?: string;
  /** Platforms players can buy/play on. */
  platforms?: string[];
  /** Studio that develops the game. */
  developer?: string;
  /** Source material the game draws on (novel, folklore, mythology). */
  basedOn?: string;
  /** Genre tags: 'action-rpg' | 'soulslike' | 'mythology' | 'adventure'. */
  tags?: string[];
  /** Status for timeliness signaling. */
  status?: 'released' | 'upcoming' | 'rumored';
};

export type GamePost = {
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type GameWithPosts = GameSeries & {
  posts: GamePost[];
};

const GAMES: GameSeries[] = [
  {
    slug: 'black-myth-wukong',
    englishName: 'Black Myth: Wukong',
    chineseName: '黑神话：悟空',
    pinyin: 'Hēi Shénhuà: Wùkōng',
    year: '2024',
    synopsis:
      "Game Science's record-breaking action RPG — the game that put Chinese AAA development on the map. Released in August 2024, it sold 10 million copies in three days and more than 25 million lifetime, won Game of the Year at the Steam Awards and Best Action Game at The Game Awards 2024, and holds a Guinness World Record as the fastest-selling videogame based on a classic novel. You play \"the Destined One\" (天命人), a monkey warrior retracing the legend of Sun Wukong through a world steeped in Journey to the West (西游记) — its Buddhist and Daoist lore, its yaoguai, and the chengyu and poetry of the 16th-century novel.",
    postPrefix: 'black-myth-wukong-',
    platforms: ['PS5', 'PC (Steam)', 'Xbox Series X/S'],
    developer: 'Game Science (游戏科学)',
    basedOn: 'Journey to the West (西游记) by Wu Cheng\'en',
    tags: ['action-rpg', 'soulslike', 'mythology'],
    status: 'released',
  },
  {
    slug: 'black-myth-zhong-kui',
    englishName: 'Black Myth: Zhong Kui',
    chineseName: '黑神话：钟馗',
    pinyin: 'Hēi Shénhuà: Zhōng Kuí',
    year: '2027 (expected)',
    synopsis:
      "The second installment in Game Science's Black Myth series, revealed at Gamescom Opening Night Live in August 2025 as the studio's follow-up to Wukong. The single-player action RPG is built around Zhong Kui (钟馗) — the fearsome bearded demon-queller and ghost-catcher of Chinese folklore, the underworld's judge of spirits whose portrait is traditionally hung on doorways to ward off evil. The game is in early development with no confirmed release date (a realistic launch is 2027 at the earliest); a Chinese New Year 2026 in-engine trailer gave fans their first real look at its world.",
    postPrefix: 'black-myth-zhong-kui-',
    platforms: ['PS5', 'PC', 'Xbox Series X/S'],
    developer: 'Game Science (游戏科学)',
    basedOn: 'The Zhong Kui (钟馗) demon-queller folklore tradition',
    tags: ['action-rpg', 'mythology'],
    status: 'upcoming',
  },
];

export function getAllGameSeries(): GameSeries[] {
  return GAMES;
}

export function getGameSeries(slug: string): GameSeries | null {
  return GAMES.find(g => g.slug === slug) || null;
}

/** Given a blog post slug, return the game it belongs to (or null). */
export function getGameForBlogSlug(blogSlug: string): GameSeries | null {
  return GAMES.find(g => blogSlug.startsWith(g.postPrefix)) || null;
}

/** Return all blog posts that belong to a game, optionally excluding one (the current post). Newest first. */
export function getPostsForGame(gameSlug: string, excludeSlug?: string): GamePost[] {
  const game = GAMES.find(g => g.slug === gameSlug);
  if (!game) return [];
  const contentDir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(contentDir)) return [];
  const posts: GamePost[] = [];
  for (const file of fs.readdirSync(contentDir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    if (!slug.startsWith(game.postPrefix)) continue;
    if (slug === excludeSlug) continue;
    const { data } = matter(fs.readFileSync(path.join(contentDir, file), 'utf8'));
    posts.push({
      slug,
      title: data.title || slug,
      date: data.date || '',
      description: data.description || '',
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

/** Return N other games (excluding the given slug), prioritizing upcoming > released. */
export function getRelatedGames(excludeSlug: string, limit = 3): GameSeries[] {
  const rank = (g: GameSeries) =>
    g.status === 'upcoming' ? 0 : g.status === 'released' ? 1 : 2;
  return GAMES
    .filter(g => g.slug !== excludeSlug)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, limit);
}

export function getGamesWithPosts(): GameWithPosts[] {
  const contentDir = path.join(process.cwd(), 'content/blog');
  const allPosts: (GamePost & { prefix: string })[] = [];
  if (fs.existsSync(contentDir)) {
    for (const file of fs.readdirSync(contentDir)) {
      if (!file.endsWith('.md')) continue;
      const slug = file.replace(/\.md$/, '');
      const match = GAMES.find(g => slug.startsWith(g.postPrefix));
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
  return GAMES.map(g => ({
    ...g,
    posts: allPosts
      .filter(p => p.prefix === g.postPrefix)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .map(({ slug, title, date, description }) => ({ slug, title, date, description })),
  }));
}
