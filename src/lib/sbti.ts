import sbtiEn from '../data/sbti-types.en.json';
import fs from 'fs';
import path from 'path';

export type RelatedSlang = {
  term: string;
  pinyin: string;
  meaning: string;
  relationship: string;
};

export type SbtiType = {
  code: string;
  displayName: string;
  chineseOrigin: string;
  coreVibe: string;
  special: string | null;
  tagline: string;
  overview: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  recognitionSignals: string[];
  inRelationships: string;
  careerFit: string;
  famousExamples: string[];
  compatibleTypes: string[];
  incompatibleTypes: string[];
  howToGetThisType: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  // Chinese slang decoder (the unique cultural-authority angle)
  chineseSlangTerm?: string;
  pinyin?: string;
  literalMeaning?: string;
  slangMeaning?: string;
  slangOriginStory?: string;
  slangUsageToday?: string;
  relatedSlang?: RelatedSlang[];
  whyItBecameSbtiType?: string;
};

/** SBTI type code → slug (URL path segment) — lowercase, no punctuation. */
export function typeCodeToSlug(code: string): string {
  return code.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/** Slug (URL path segment) → uppercase SBTI type code. */
export function slugToTypeCode(slug: string, all: SbtiType[]): string | null {
  const match = all.find(t => typeCodeToSlug(t.code) === slug.toLowerCase());
  return match ? match.code : null;
}

/** Load the English SBTI dataset. */
export function getAllSbtiTypesEn(): SbtiType[] {
  return sbtiEn as SbtiType[];
}

/**
 * Load the SBTI dataset for a given language. Falls back to English if no
 * translation exists yet.
 */
export function getAllSbtiTypes(lang?: string): SbtiType[] {
  if (!lang || lang === 'en') return getAllSbtiTypesEn();
  try {
    const translatedPath = path.join(
      process.cwd(),
      'public',
      'translations',
      lang,
      'sbti-types.json'
    );
    if (fs.existsSync(translatedPath)) {
      const translated = JSON.parse(fs.readFileSync(translatedPath, 'utf8'));
      return translated as SbtiType[];
    }
  } catch {
    // Fall through to English fallback
  }
  return getAllSbtiTypesEn();
}

/** Look up a single type by slug, with optional language. */
export function getSbtiType(slug: string, lang?: string): SbtiType | null {
  const all = getAllSbtiTypes(lang);
  const code = slugToTypeCode(slug, all);
  if (!code) return null;
  return all.find(t => t.code === code) || null;
}

/** Get related types (compatible + incompatible) for cross-linking. */
export function getRelatedSbtiTypes(code: string, lang?: string): SbtiType[] {
  const all = getAllSbtiTypes(lang);
  const target = all.find(t => t.code === code);
  if (!target) return [];
  const relatedCodes = [
    ...(target.compatibleTypes || []),
    ...(target.incompatibleTypes || []),
  ];
  return all.filter(t => relatedCodes.includes(t.code));
}
