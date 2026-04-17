import fs from 'fs';
import path from 'path';
import quizEn from '../data/sbti-quiz.en.json';
import type { QuizQuestion, SpecialQuestion, TypePattern } from './sbti-engine';

export type DimensionMeta = {
  name: string;
  model: string;
  levels: { L: string; M: string; H: string };
};

export type QuizUIResult = {
  yourResult: string;
  hiddenType: string;
  fallbackType: string;
  retakeTest: string;
  takeTheTest: string;
  matchStrong: string;
  matchGood: string;
  matchPartial: string;
  rarityTemplate: string;
  hiddenTypeBadge: string;
  hiddenTypeDesc: string;
  brokeModelBadge: string;
  brokeModelDesc: string;
  closestTemplate: string;
  normalBestTemplate: string;
  noResultDesc: string;
  definingTraits: string;
  showAll: string;
  hideAll: string;
  profileKicker: string;
  profileHeading: string;
  profileSub: string;
  shareKicker: string;
  shareHeading: string;
  goDeeperKicker: string;
  goDeeperHeading: string;
  fullProfile: string;
  compatibility: string;
  howToGet: string;
};

export type QuizUI = {
  seoTestTitle: string;
  seoTestDescription: string;
  seoHubTitle: string;
  seoHubDescription: string;
  homeCardSubtitle: string;
  homeCardLink: string;
  hubCatalogueKicker: string;
  hubAllTypesHeading: string;
  hubAllTypesSub: string;
  hubSpecialKicker: string;
  hubSpecialTypesHeading: string;
  hubSpecialTypesSub: string;
  hubCtaKicker: string;
  hubCtaTitle: string;
  hubCtaBullets: string;
  hubExploreKicker: string;
  hubReadMore: string;
  hubWhatIsLabel: string;
  hubVsMbtiLabel: string;
  hubSlangLabel: string;
  hubHomeLabel: string;
  kicker: string;
  titleLine1: string;
  titleLine2: string;
  questionsLabel: string;
  typesLabel: string;
  minutesLabel: string;
  instantResult: string;
  hiddenInside: string;
  hiddenInsideDesc: string;
  beforeBegin: string;
  socialProof: string;
  begin: string;
  resumeFormat: string;
  startOver: string;
  progressFormat: string;
  answeredFormat: string;
  readAndReact: string;
  bonusLabel: string;
  submit: string;
  submitIncomplete: string;
  computing: string;
  restart: string;
  errorState: string;
  result: QuizUIResult;
};

export type QuizBundle = {
  meta: {
    title: string;
    subtitle: string;
    disclaimer: string;
  };
  ui: QuizUI;
  dimensions: Record<string, DimensionMeta>;
  main: QuizQuestion[];
  special: SpecialQuestion[];
  typePatterns: TypePattern[];
};

export function getQuizEn(): QuizBundle {
  return quizEn as QuizBundle;
}

export function getQuiz(lang?: string): QuizBundle {
  const en = getQuizEn();
  if (!lang || lang === 'en') return en;
  try {
    const p = path.join(
      process.cwd(),
      'public',
      'translations',
      lang,
      'sbti-quiz.json'
    );
    if (fs.existsSync(p)) {
      const translated = JSON.parse(fs.readFileSync(p, 'utf8')) as Partial<QuizBundle>;
      // Merge ui field-by-field so that strings added to the EN source after
      // the last translation still get rendered (falling back to EN for those
      // missing fields) while keeping the translated ones.
      const mergedUi: QuizUI = {
        ...en.ui,
        ...(translated.ui ?? {}),
        result: {
          ...en.ui.result,
          ...(translated.ui?.result ?? {}),
        },
      };
      return {
        meta: translated.meta ?? en.meta,
        ui: mergedUi,
        dimensions: translated.dimensions ?? en.dimensions,
        main: translated.main ?? en.main,
        special: translated.special ?? en.special,
        // Patterns are language-agnostic — always use EN to avoid drift.
        typePatterns: en.typePatterns,
      };
    }
  } catch {
    // fall through
  }
  return en;
}
