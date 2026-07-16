import fs from 'fs';
import path from 'path';
import { getAllFigures, getFigure, type MythFigure } from './mythology';

/** A figure with translated prose merged onto its language-neutral structure. */
export type LocalizedFigure = Omit<MythFigure, 'name' | 'role' | 'tagline' | 'overview' | 'keyFact' | 'significance' | 'misconception'> & {
  name: string;
  role: string;
  tagline: string;
  overview: string;
  keyFact: string;
  significance: string;
  misconception?: string;
};

export type MythUI = Record<string, string>;

type Bundle = {
  figures: Record<string, {
    name: string; role: string; tagline: string; overview: string;
    keyFact: string; significance: string; misconception?: string;
  }>;
  ui: MythUI;
};

function loadBundle(lang: string): Bundle {
  const tryFile = (l: string) => path.join(process.cwd(), 'public/translations', l, 'mythology.json');
  const file = fs.existsSync(tryFile(lang)) ? tryFile(lang) : tryFile('en');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function getMythUI(lang: string): MythUI {
  return loadBundle(lang).ui;
}

export function getLocalizedFigures(lang: string): LocalizedFigure[] {
  const b = loadBundle(lang);
  return getAllFigures().map(base => merge(base, b));
}

export function getLocalizedFiguresByCategory(lang: string, category: 'deity' | 'creature'): LocalizedFigure[] {
  return getLocalizedFigures(lang).filter(f => f.category === category);
}

export function getLocalizedFigure(lang: string, slug: string): LocalizedFigure | null {
  const base = getFigure(slug);
  if (!base) return null;
  return merge(base, loadBundle(lang));
}

export function getLocalizedRelated(lang: string, slug: string, limit = 4): LocalizedFigure[] {
  const base = getFigure(slug);
  if (!base) return [];
  return base.related
    .map(s => getLocalizedFigure(lang, s))
    .filter((x): x is LocalizedFigure => !!x && x.slug !== slug)
    .slice(0, limit);
}

/** Simple {token} interpolation for UI strings. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

function merge(base: MythFigure, b: Bundle): LocalizedFigure {
  const t = b.figures[base.slug];
  return {
    slug: base.slug,
    chineseName: base.chineseName,
    pinyin: base.pinyin,
    category: base.category,
    related: base.related,
    tags: base.tags,
    postPrefix: base.postPrefix,
    name: t?.name ?? base.name,
    role: t?.role ?? base.role,
    tagline: t?.tagline ?? base.tagline,
    overview: t?.overview ?? base.overview,
    keyFact: t?.keyFact ?? base.keyFact,
    significance: t?.significance ?? base.significance,
    misconception: t?.misconception ?? base.misconception,
  };
}
