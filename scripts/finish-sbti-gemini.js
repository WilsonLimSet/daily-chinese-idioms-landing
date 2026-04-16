#!/usr/bin/env node
/**
 * Finish the last SBTI-type translations using ONLY Gemini across the 7
 * previously-OpenAI languages. Resume-safe: only translates missing types.
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
});

const MAX_RETRIES = 3;
const DELAY_MS = 4500;

const LANGS = {
  de: 'German',
  fr: 'French',
  ms: 'Malay',
  pt: 'Portuguese',
  ru: 'Russian',
  tl: 'Filipino/Tagalog',
  vi: 'Vietnamese',
};

const sourceData = require('../src/data/sbti-types.en.json');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(sourceType, langName) {
  return `Translate the following SBTI personality-type profile into ${langName}. Preserve the JSON structure EXACTLY. Return ONLY the JSON object with all original keys — no preamble, no markdown code fence.

Translate these fields into natural ${langName}:
- tagline, overview, traits[], strengths[], weaknesses[], recognitionSignals[], inRelationships, careerFit, famousExamples[], howToGetThisType, metaTitle, metaDescription, keywords[], literalMeaning, slangMeaning, slangOriginStory, slangUsageToday, whyItBecameSbtiType, relatedSlang[].meaning, relatedSlang[].relationship

Leave these UNCHANGED (Chinese text or technical fields):
- code, displayName, chineseOrigin, coreVibe, special, compatibleTypes, incompatibleTypes, chineseSlangTerm, pinyin, relatedSlang[].term, relatedSlang[].pinyin

For keywords[]: generate 10 NEW ${langName} long-tail keywords natives would Google about SBTI ${sourceType.code}.

Source:
${JSON.stringify(sourceType, null, 2)}`;
}

async function translateType(sourceType, langName) {
  const prompt = buildPrompt(sourceType, langName);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      const translated = JSON.parse(jsonMatch[0]);
      // Force critical fields from source
      translated.code = sourceType.code;
      translated.displayName = sourceType.displayName;
      translated.chineseOrigin = sourceType.chineseOrigin;
      translated.coreVibe = sourceType.coreVibe;
      translated.compatibleTypes = sourceType.compatibleTypes || [];
      translated.incompatibleTypes = sourceType.incompatibleTypes || [];
      translated.special = sourceType.special || null;
      translated.chineseSlangTerm = sourceType.chineseSlangTerm;
      translated.pinyin = sourceType.pinyin;
      if (Array.isArray(translated.relatedSlang) && Array.isArray(sourceType.relatedSlang)) {
        translated.relatedSlang = translated.relatedSlang.map((rel, i) => ({
          ...rel,
          term: sourceType.relatedSlang[i]?.term ?? rel.term,
          pinyin: sourceType.relatedSlang[i]?.pinyin ?? rel.pinyin,
        }));
      }
      return translated;
    } catch (err) {
      if (attempt === MAX_RETRIES) {
        console.error(`    [${sourceType.code}] FAILED: ${err.message.slice(0, 80)}`);
        return null;
      }
      await sleep(3000 * attempt);
    }
  }
}

async function translateLanguage(langCode, langName) {
  const outPath = path.join(__dirname, '..', 'public', 'translations', langCode, 'sbti-types.json');
  const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : [];
  const completeCodes = new Set(existing.filter(t => t.chineseSlangTerm && t.slangOriginStory).map(t => t.code));
  const todo = sourceData.filter((t) => !completeCodes.has(t.code));

  if (todo.length === 0) {
    console.log(`${langName} (${langCode}): complete`);
    return;
  }

  console.log(`${langName} (${langCode}): ${todo.length} to translate`);

  // Keep existing complete types, overwrite any partial ones
  const results = existing.filter(t => completeCodes.has(t.code));

  for (const sourceType of todo) {
    const translated = await translateType(sourceType, langName);
    results.push(translated || sourceType);
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    await sleep(DELAY_MS);
  }
  console.log(`  ✓ ${langName} (${langCode}) done → ${results.length} types`);
}

async function main() {
  const start = Date.now();
  // Run all 7 in parallel through Gemini; rate limiter does its job
  await Promise.all(Object.entries(LANGS).map(([code, name]) => translateLanguage(code, name)));
  const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);
  console.log(`\nDone in ${elapsed} min.`);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
