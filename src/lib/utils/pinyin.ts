/**
 * Pinyin utility functions for Chinese character processing
 */

/**
 * Mapping of pinyin characters with tone marks to their base forms
 */
const TONE_MAP: Record<string, string> = {
  'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
  'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
  'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
  'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
  'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
  'ü': 'u', 'ǖ': 'u', 'ǘ': 'u', 'ǚ': 'u', 'ǜ': 'u',
  'ń': 'n', 'ň': 'n', 'ǹ': 'n',
  'ḿ': 'm', 'm̀': 'm'
};

/**
 * Remove tone marks from pinyin text
 * @param pinyin - The pinyin string with tone marks (e.g., "ài wū jí wū")
 * @returns The pinyin string without tone marks (e.g., "ai wu ji wu")
 *
 * @example
 * removeToneMarks('ài wū jí wū') // returns 'ai wu ji wu'
 * removeToneMarks('nǐ hǎo') // returns 'ni hao'
 */
export function removeToneMarks(pinyin: string): string {
  return pinyin.split('').map(char => TONE_MAP[char] || char).join('');
}

/**
 * Convert pinyin to a URL-safe slug
 * @param pinyin - The pinyin string (with or without tone marks)
 * @returns A URL-safe slug with dashes instead of spaces
 *
 * @example
 * pinyinToSlug('ài wū jí wū') // returns 'ai-wu-ji-wu'
 * pinyinToSlug('nǐ hǎo') // returns 'ni-hao'
 */
export function pinyinToSlug(pinyin: string): string {
  return removeToneMarks(pinyin).replace(/\s+/g, '-').toLowerCase();
}

/**
 * Generate all pinyin variants for search and matching purposes
 * @param pinyin - The pinyin string with tone marks
 * @returns Object with different pinyin formats
 *
 * @example
 * generatePinyinVariants('ài wū jí wū')
 * // returns:
 * // {
 * //   original: 'ài wū jí wū',
 * //   withoutTones: 'ai wu ji wu',
 * //   slug: 'ai-wu-ji-wu',
 * //   searchable: 'aiwujiuwu'
 * // }
 */
export function generatePinyinVariants(pinyin: string) {
  const withoutTones = removeToneMarks(pinyin);

  return {
    original: pinyin,
    withoutTones,
    slug: withoutTones.replace(/\s+/g, '-').toLowerCase(),
    searchable: withoutTones.replace(/\s+/g, '').toLowerCase(),
  };
}

/**
 * Check if a string contains pinyin characters with tone marks
 * @param text - The text to check
 * @returns true if the text contains pinyin tone marks
 */
export function hasToneMarks(text: string): boolean {
  return text.split('').some(char => char in TONE_MAP);
}

/**
 * Normalize pinyin for comparison (removes tones and whitespace)
 * Useful for case-insensitive, tone-insensitive matching
 * @param pinyin - The pinyin string to normalize
 * @returns Normalized pinyin string
 */
export function normalizePinyin(pinyin: string): string {
  return removeToneMarks(pinyin).replace(/\s+/g, '').toLowerCase();
}
