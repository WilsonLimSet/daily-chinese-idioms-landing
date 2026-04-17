/**
 * SBTI scoring engine — pure functions, no DOM.
 *
 * Ported from https://github.com/pingfanfan/SBTI (MIT-licensed fan project
 * of the original test by Bilibili creator @蛆肉儿串儿, April 2026).
 *
 * Note: canonical type codes are OG8K and FU?K; this codebase uses OJBK
 * and FUCK throughout its existing /sbti/{type} routes and 14-language
 * translations, so the quiz data file substitutes those. Nothing in this
 * engine depends on code identity beyond string matching.
 */

export type Level = 'L' | 'M' | 'H';

export type DimensionId =
  | 'S1' | 'S2' | 'S3'
  | 'E1' | 'E2' | 'E3'
  | 'A1' | 'A2' | 'A3'
  | 'Ac1' | 'Ac2' | 'Ac3'
  | 'So1' | 'So2' | 'So3';

export const DIMENSION_ORDER: DimensionId[] = [
  'S1', 'S2', 'S3',
  'E1', 'E2', 'E3',
  'A1', 'A2', 'A3',
  'Ac1', 'Ac2', 'Ac3',
  'So1', 'So2', 'So3',
];

export type QuizQuestion = {
  id: string;
  dim: DimensionId;
  text: string;
  options: { label: string; value: number }[];
};

export type SpecialQuestion = {
  id: string;
  kind: 'drink_gate' | 'drink_trigger';
  text: string;
  options: { label: string; value: number }[];
};

export type TypePattern = {
  code: string;
  pattern: string;
};

export type Answers = Record<string, number>;

export type DimensionScores = Partial<Record<DimensionId, number>>;
export type DimensionLevels = Partial<Record<DimensionId, Level>>;

export type TypeMatch = {
  code: string;
  pattern: string;
  distance: number;
  exact: number;
  similarity: number;
};

export type QuizResult = {
  primary: TypeMatch & { code: string };
  secondary: TypeMatch | null;
  rankings: TypeMatch[];
  mode: 'normal' | 'fallback' | 'drunk';
  userLevels: DimensionLevels;
};

const LEVEL_NUM: Record<Level, number> = { L: 1, M: 2, H: 3 };
const LEVEL_THRESHOLDS = { L: [2, 3], M: [4, 4], H: [5, 6] } as const;
const MAX_DISTANCE = 30;
const FALLBACK_THRESHOLD = 60;

export function calcDimensionScores(answers: Answers, questions: QuizQuestion[]): DimensionScores {
  const scores: DimensionScores = {};
  for (const q of questions) {
    const v = answers[q.id];
    if (v == null) continue;
    scores[q.dim] = (scores[q.dim] ?? 0) + v;
  }
  return scores;
}

export function scoresToLevels(scores: DimensionScores): DimensionLevels {
  const levels: DimensionLevels = {};
  for (const dim of DIMENSION_ORDER) {
    const score = scores[dim];
    if (score == null) continue;
    if (score <= LEVEL_THRESHOLDS.L[1]) levels[dim] = 'L';
    else if (score >= LEVEL_THRESHOLDS.H[0]) levels[dim] = 'H';
    else levels[dim] = 'M';
  }
  return levels;
}

export function parsePattern(pattern: string): Level[] {
  return pattern.replace(/-/g, '').split('') as Level[];
}

export function matchType(userLevels: DimensionLevels, pattern: string): Omit<TypeMatch, 'code' | 'pattern'> {
  const typeLevels = parsePattern(pattern);
  let distance = 0;
  let exact = 0;
  for (let i = 0; i < DIMENSION_ORDER.length; i++) {
    const userVal = LEVEL_NUM[userLevels[DIMENSION_ORDER[i]] ?? 'M'];
    const typeVal = LEVEL_NUM[typeLevels[i] ?? 'M'];
    const diff = Math.abs(userVal - typeVal);
    distance += diff;
    if (diff === 0) exact++;
  }
  const similarity = Math.max(0, Math.round((1 - distance / MAX_DISTANCE) * 100));
  return { distance, exact, similarity };
}

export function determineResult(
  userLevels: DimensionLevels,
  standardTypes: TypePattern[],
  opts: { isDrunk?: boolean } = {}
): QuizResult {
  const rankings: TypeMatch[] = standardTypes.map(t => ({
    code: t.code,
    pattern: t.pattern,
    ...matchType(userLevels, t.pattern),
  }));

  rankings.sort(
    (a, b) =>
      a.distance - b.distance ||
      b.exact - a.exact ||
      b.similarity - a.similarity
  );

  const best = rankings[0];

  if (opts.isDrunk) {
    return {
      primary: { ...best, code: 'DRUNK' },
      secondary: best,
      rankings,
      mode: 'drunk',
      userLevels,
    };
  }

  if (best.similarity < FALLBACK_THRESHOLD) {
    return {
      primary: { ...best, code: 'HHHH' },
      secondary: best,
      rankings,
      mode: 'fallback',
      userLevels,
    };
  }

  return {
    primary: best,
    secondary: rankings[1] ?? null,
    rankings,
    mode: 'normal',
    userLevels,
  };
}

/**
 * Encode the 15-char L/M/H vector for URL transport.
 * "HHHLMMHMHLLHMML" (15 chars).
 */
export function encodeVector(levels: DimensionLevels): string {
  return DIMENSION_ORDER.map(d => levels[d] ?? 'M').join('');
}

export function decodeVector(v: string): DimensionLevels {
  if (v.length !== DIMENSION_ORDER.length) return {};
  const levels: DimensionLevels = {};
  for (let i = 0; i < DIMENSION_ORDER.length; i++) {
    const ch = v[i];
    if (ch === 'L' || ch === 'M' || ch === 'H') {
      levels[DIMENSION_ORDER[i]] = ch;
    }
  }
  return levels;
}

/**
 * Deterministic drink-gate insertion position based on session seed.
 * Keeps it away from the very first and last positions (feels broken).
 */
export function drinkGatePosition(seed: number, totalQuestions: number): number {
  const min = Math.max(5, Math.floor(totalQuestions * 0.2));
  const max = Math.min(totalQuestions - 3, Math.floor(totalQuestions * 0.8));
  const range = max - min + 1;
  return min + (Math.abs(seed) % range);
}
