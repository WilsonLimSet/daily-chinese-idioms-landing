import fs from 'fs';
import path from 'path';
import quizEn from '../data/sbti-quiz.en.json';
import type { QuizQuestion, SpecialQuestion, TypePattern } from './sbti-engine';

export type DimensionMeta = {
  name: string;
  model: string;
  levels: { L: string; M: string; H: string };
};

export type QuizBundle = {
  meta: {
    title: string;
    subtitle: string;
    attribution: string;
    disclaimer: string;
    creatorUrl: string;
    sourceLicense: string;
  };
  dimensions: Record<string, DimensionMeta>;
  main: QuizQuestion[];
  special: SpecialQuestion[];
  typePatterns: TypePattern[];
};

export function getQuizEn(): QuizBundle {
  return quizEn as QuizBundle;
}

export function getQuiz(lang?: string): QuizBundle {
  if (!lang || lang === 'en') return getQuizEn();
  try {
    const p = path.join(
      process.cwd(),
      'public',
      'translations',
      lang,
      'sbti-quiz.json'
    );
    if (fs.existsSync(p)) {
      const translated = JSON.parse(fs.readFileSync(p, 'utf8')) as QuizBundle;
      // Patterns and dim codes are identical across languages — use EN source
      // in case translation file has drifted.
      return {
        ...translated,
        typePatterns: quizEn.typePatterns as TypePattern[],
      };
    }
  } catch {
    // fall through
  }
  return getQuizEn();
}
