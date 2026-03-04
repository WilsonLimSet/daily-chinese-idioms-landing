import idioms from '../../public/idioms.json';
import { pinyinToSlug } from './utils/pinyin';

export type CharacterPage = {
  character: string;
  slug: string;
  idiomIds: string[];
  count: number;
};

// Extract unique characters from all idioms, filter to 3+ occurrences
let cachedCharacters: CharacterPage[] | null = null;

export function getAllCharacterPages(): CharacterPage[] {
  if (cachedCharacters) return cachedCharacters;

  const charMap = new Map<string, string[]>();

  for (const idiom of idioms) {
    const chars = [...new Set(idiom.characters.split(''))];
    for (const char of chars) {
      // Skip non-CJK characters (punctuation, spaces, etc.)
      if (!/[\u4e00-\u9fff]/.test(char)) continue;
      if (!charMap.has(char)) charMap.set(char, []);
      charMap.get(char)!.push(idiom.id);
    }
  }

  cachedCharacters = Array.from(charMap.entries())
    .filter(([, ids]) => ids.length >= 3)
    .map(([character, idiomIds]) => ({
      character,
      slug: encodeURIComponent(character),
      idiomIds,
      count: idiomIds.length,
    }))
    .sort((a, b) => b.count - a.count);

  return cachedCharacters;
}

export function getCharacterPage(slug: string): CharacterPage | null {
  const character = decodeURIComponent(slug);
  return getAllCharacterPages().find(c => c.character === character) || null;
}

export function getCharacterIdioms(slug: string) {
  const page = getCharacterPage(slug);
  if (!page) return null;

  return page.idiomIds.map(id => {
    const idiom = idioms.find(i => i.id === id);
    if (!idiom) return null;
    return {
      ...idiom,
      blogSlug: pinyinToSlug(idiom.pinyin),
    };
  }).filter(Boolean);
}

export function getRelatedCharacters(slug: string, limit = 6): CharacterPage[] {
  const current = getCharacterPage(slug);
  if (!current) return getAllCharacterPages().slice(0, limit);

  const all = getAllCharacterPages().filter(c => c.character !== current.character);

  // Score by shared idioms
  const scored = all.map(candidate => {
    const shared = candidate.idiomIds.filter(id => current.idiomIds.includes(id)).length;
    return { page: candidate, score: shared };
  });

  scored.sort((a, b) => b.score - a.score || b.page.count - a.page.count);
  return scored.slice(0, limit).map(s => s.page);
}
