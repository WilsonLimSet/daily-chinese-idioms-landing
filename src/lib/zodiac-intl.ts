import fs from 'fs';
import path from 'path';
import { getAllSigns, getSign, type ZodiacSign } from './zodiac';

/** A sign with translated prose merged onto its language-neutral structure. */
export type LocalizedSign = Omit<ZodiacSign, 'tagline' | 'overview' | 'strengths' | 'weaknesses' | 'element' | 'luckyColors' | 'animal' | 'yinYang'> & {
  animal: string;
  element: string;      // translated label (structural element key still available via slug->getSign if needed)
  tagline: string;
  overview: string;
  strengths: string[];
  weaknesses: string[];
  luckyColors: string[];
  yinYang: string;
};

export type ZodiacUI = Record<string, string> & { months: string[] };

type ZodiacBundle = {
  signs: Record<string, {
    animal: string; tagline: string; overview: string;
    element: string; yinYang: string;
    strengths: string[]; weaknesses: string[]; luckyColors: string[];
  }>;
  ui: ZodiacUI;
};

function loadBundle(lang: string): ZodiacBundle {
  const tryFile = (l: string) => path.join(process.cwd(), 'public/translations', l, 'zodiac.json');
  const file = fs.existsSync(tryFile(lang)) ? tryFile(lang) : tryFile('en');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

/** UI strings for a language (falls back to English). */
export function getZodiacUI(lang: string): ZodiacUI {
  return loadBundle(lang).ui;
}

/** All 12 signs, localized, in canonical order. */
export function getLocalizedSigns(lang: string): LocalizedSign[] {
  const bundle = loadBundle(lang);
  return getAllSigns().map(base => mergeSign(base, bundle));
}

/** One localized sign, or null. */
export function getLocalizedSign(lang: string, slug: string): LocalizedSign | null {
  const base = getSign(slug);
  if (!base) return null;
  return mergeSign(base, loadBundle(lang));
}

function mergeSign(base: ZodiacSign, bundle: ZodiacBundle): LocalizedSign {
  const t = bundle.signs[base.slug];
  return {
    slug: base.slug,
    chineseName: base.chineseName,
    pinyin: base.pinyin,
    order: base.order,
    yinYang: t?.yinYang ?? base.yinYang,
    bestMatches: base.bestMatches,
    clash: base.clash,
    luckyNumbers: base.luckyNumbers,
    postPrefix: base.postPrefix,
    animal: t?.animal ?? base.animal,
    element: t?.element ?? base.element,
    tagline: t?.tagline ?? base.tagline,
    overview: t?.overview ?? base.overview,
    strengths: t?.strengths ?? base.strengths,
    weaknesses: t?.weaknesses ?? base.weaknesses,
    luckyColors: t?.luckyColors ?? base.luckyColors,
  };
}

/** Simple {token} interpolation for UI strings. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}
