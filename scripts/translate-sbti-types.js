#!/usr/bin/env node
/**
 * Translate src/data/sbti-types.en.json into public/translations/{lang}/sbti-types.json
 * for all 14 non-English languages, using Gemini.
 *
 * Translates user-facing prose only — keeps code, special, compatibleTypes, etc. untouched.
 * Resume-safe: re-running skips languages that already have a complete translation.
 *
 * Usage:
 *   node scripts/translate-sbti-types.js              # all languages
 *   node scripts/translate-sbti-types.js --lang es    # single language
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.2,
    maxOutputTokens: 8192,
  },
});

const RATE_LIMIT_MS = 4500;
const MAX_RETRIES = 3;

const LANGUAGES = {
  es: 'Spanish',
  pt: 'Portuguese',
  id: 'Indonesian',
  vi: 'Vietnamese',
  ja: 'Japanese',
  ko: 'Korean',
  th: 'Thai',
  hi: 'Hindi',
  ar: 'Arabic',
  fr: 'French',
  de: 'German',
  tl: 'Filipino/Tagalog',
  ms: 'Malay',
  ru: 'Russian',
};

const sourceData = require('../src/data/sbti-types.en.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(sourceType, langName) {
  return `Translate the following SBTI personality-type profile into ${langName}. Preserve the JSON structure exactly. Keep the SBTI type code (${sourceType.code}) and any SBTI type codes in compatibleTypes/incompatibleTypes UNCHANGED (they are brand/technical terms).

Translate these fields into natural ${langName}:
- tagline, overview, traits (array), strengths (array), weaknesses (array), recognitionSignals (array), inRelationships, careerFit, famousExamples (array), howToGetThisType, metaTitle, metaDescription, keywords (array)

Leave these UNCHANGED (do not translate):
- code, displayName (keep English), chineseOrigin (keep as-is), coreVibe (keep English), special, compatibleTypes, incompatibleTypes

For keywords: generate 10 NEW ${langName} long-tail keywords that locals would actually Google about SBTI ${sourceType.code} — do NOT just translate the English ones word-for-word. Think like a native ${langName} speaker searching.

Return ONLY a JSON object with all original keys preserved. No preamble, no markdown code fence.

Source:
${JSON.stringify(sourceType, null, 2)}
`;
}

async function translateType(sourceType, langName) {
  const prompt = buildPrompt(sourceType, langName);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      const parsed = JSON.parse(jsonMatch[0]);
      // Force critical fields to match source to prevent drift
      parsed.code = sourceType.code;
      parsed.displayName = sourceType.displayName;
      parsed.compatibleTypes = sourceType.compatibleTypes || [];
      parsed.incompatibleTypes = sourceType.incompatibleTypes || [];
      parsed.special = sourceType.special || null;
      return parsed;
    } catch (err) {
      console.error(`    [${sourceType.code}] attempt ${attempt}: ${err.message}`);
      if (attempt === MAX_RETRIES) return null;
      await sleep(RATE_LIMIT_MS);
    }
  }
}

async function translateLanguage(langCode, langName) {
  const outPath = path.join(__dirname, '..', 'public', 'translations', langCode, 'sbti-types.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  let existing = [];
  if (fs.existsSync(outPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    } catch {
      existing = [];
    }
  }
  const doneCodes = new Set(existing.map((t) => t.code));

  const todo = sourceData.filter((t) => !doneCodes.has(t.code));
  if (todo.length === 0) {
    console.log(`${langName} (${langCode}): already complete (${existing.length} types)`);
    return;
  }

  console.log(`\n${langName} (${langCode}): ${existing.length} existing, ${todo.length} to translate`);

  const results = [...existing];
  let saveCount = existing.length;

  for (const sourceType of todo) {
    process.stdout.write(`  [${sourceType.code}] `);
    const translated = await translateType(sourceType, langName);
    if (translated) {
      results.push(translated);
      saveCount++;
      process.stdout.write(`done (${saveCount}/${sourceData.length})\n`);
    } else {
      // fallback: keep English content
      results.push(sourceType);
      saveCount++;
      process.stdout.write(`FAILED (English fallback)\n`);
    }
    // Save incrementally for resume safety
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    await sleep(RATE_LIMIT_MS);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const langArgIdx = args.indexOf('--lang');
  const targetLang = langArgIdx !== -1 ? args[langArgIdx + 1] : null;

  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  if (targetLang && !LANGUAGES[targetLang]) {
    console.error(`Unknown language: ${targetLang}`);
    console.error(`Available: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }

  console.log(`Translating ${sourceData.length} SBTI types into ${Object.keys(langs).length} language(s)`);
  console.log(`Estimated time: ~${Math.ceil(sourceData.length * Object.keys(langs).length * RATE_LIMIT_MS / 60000)} minutes\n`);

  for (const [code, name] of Object.entries(langs)) {
    await translateLanguage(code, name);
  }

  console.log('\nAll translations complete.');
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
