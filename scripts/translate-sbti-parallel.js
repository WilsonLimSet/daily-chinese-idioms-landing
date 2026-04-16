#!/usr/bin/env node
/**
 * Parallel SBTI translation using BOTH Gemini + OpenAI.
 *
 * Splits 14 languages across 2 providers:
 *   - Gemini (free tier, 15 RPM): 7 languages
 *   - OpenAI (gpt-4o-mini, higher limits): 7 languages
 *
 * Each provider runs its languages concurrently. Per-language, types run
 * sequentially with a short delay to stay within per-key rate limits.
 *
 * Resume-safe: skips types already present in each target file.
 *
 * Usage:
 *   node scripts/translate-sbti-parallel.js
 *   node scripts/translate-sbti-parallel.js --force  # re-translate everything
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

const MAX_RETRIES = 3;
const GEMINI_DELAY_MS = 4500;   // per-worker; 7 Gemini workers × 13 RPM each = risky but manageable
const OPENAI_DELAY_MS = 2500;   // per-worker; OpenAI tier limits are much higher

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { temperature: 0.2, maxOutputTokens: 8192 },
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Split languages — mix high-traffic ones across both providers
const GEMINI_LANGS = {
  es: 'Spanish',
  ja: 'Japanese',
  ko: 'Korean',
  id: 'Indonesian',
  ar: 'Arabic',
  hi: 'Hindi',
  th: 'Thai',
};
const OPENAI_LANGS = {
  pt: 'Portuguese',
  fr: 'French',
  de: 'German',
  vi: 'Vietnamese',
  ms: 'Malay',
  tl: 'Filipino/Tagalog',
  ru: 'Russian',
};

const sourceData = require('../src/data/sbti-types.en.json');
const force = process.argv.includes('--force');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildPrompt(sourceType, langName) {
  return `Translate the following SBTI personality-type profile into ${langName}. Preserve the JSON structure EXACTLY. Return ONLY a JSON object with all original keys — no preamble, no markdown code fence.

Translate these fields into natural ${langName}:
- tagline, overview, traits[], strengths[], weaknesses[], recognitionSignals[], inRelationships, careerFit, famousExamples[], howToGetThisType, metaTitle, metaDescription, keywords[], literalMeaning, slangMeaning, slangOriginStory, slangUsageToday, whyItBecameSbtiType, relatedSlang[].meaning, relatedSlang[].relationship

Leave these UNCHANGED (do NOT translate — they are Chinese text or technical fields):
- code, displayName, chineseOrigin, coreVibe, special, compatibleTypes, incompatibleTypes, chineseSlangTerm, pinyin, relatedSlang[].term, relatedSlang[].pinyin

For keywords[]: generate 10 NEW ${langName} long-tail keywords natives would actually Google about SBTI ${sourceType.code} — do NOT translate word-for-word.

Source:
${JSON.stringify(sourceType, null, 2)}`;
}

async function callGemini(prompt, code) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await geminiModel.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      const msg = err.message.slice(0, 80);
      if (attempt === MAX_RETRIES) {
        console.error(`    [${code}] gemini FAILED: ${msg}`);
        return null;
      }
      await sleep(3000 * attempt);
    }
  }
}

async function callOpenAI(prompt, code) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a translator. Return ONLY valid JSON with no markdown code fence.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      });
      const text = response.choices[0].message.content.trim();
      return JSON.parse(text);
    } catch (err) {
      const msg = err.message.slice(0, 80);
      if (attempt === MAX_RETRIES) {
        console.error(`    [${code}] openai FAILED: ${msg}`);
        return null;
      }
      await sleep(3000 * attempt);
    }
  }
}

async function translateTypeWithProvider(sourceType, langName, provider) {
  const prompt = buildPrompt(sourceType, langName);
  const translated = provider === 'gemini'
    ? await callGemini(prompt, sourceType.code)
    : await callOpenAI(prompt, sourceType.code);
  if (!translated) return null;
  // Force critical fields from source to prevent drift
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
    // Ensure Chinese term/pinyin stay as source
    translated.relatedSlang = translated.relatedSlang.map((rel, i) => ({
      ...rel,
      term: sourceType.relatedSlang[i]?.term ?? rel.term,
      pinyin: sourceType.relatedSlang[i]?.pinyin ?? rel.pinyin,
    }));
  }
  return translated;
}

async function translateLanguage(langCode, langName, provider, delayMs) {
  const outPath = path.join(__dirname, '..', 'public', 'translations', langCode, 'sbti-types.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  let existing = [];
  if (!force && fs.existsSync(outPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      // Only keep entries that already have slang fields (otherwise re-translate)
      existing = parsed.filter((t) => t.chineseSlangTerm && t.slangOriginStory);
    } catch {
      existing = [];
    }
  }
  const doneCodes = new Set(existing.map((t) => t.code));
  const todo = sourceData.filter((t) => !doneCodes.has(t.code));

  if (todo.length === 0) {
    console.log(`${langName} (${langCode}): already complete [${provider}]`);
    return;
  }

  console.log(`${langName} (${langCode}): ${todo.length} to translate via ${provider}`);

  const results = [...existing];
  for (const sourceType of todo) {
    const translated = await translateTypeWithProvider(sourceType, langName, provider);
    if (translated) {
      results.push(translated);
    } else {
      results.push(sourceType); // English fallback
    }
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    await sleep(delayMs);
  }
  console.log(`  ✓ ${langName} (${langCode}) complete [${provider}] → ${results.length} types`);
}

async function main() {
  console.log('Starting parallel SBTI translation across Gemini + OpenAI');
  console.log(`Source: ${sourceData.length} types`);
  console.log(`Gemini pool: ${Object.keys(GEMINI_LANGS).join(', ')}`);
  console.log(`OpenAI pool: ${Object.keys(OPENAI_LANGS).join(', ')}\n`);

  const start = Date.now();

  const geminiPromises = Object.entries(GEMINI_LANGS).map(([code, name]) =>
    translateLanguage(code, name, 'gemini', GEMINI_DELAY_MS)
  );
  const openaiPromises = Object.entries(OPENAI_LANGS).map(([code, name]) =>
    translateLanguage(code, name, 'openai', OPENAI_DELAY_MS)
  );

  await Promise.all([...geminiPromises, ...openaiPromises]);

  const elapsed = ((Date.now() - start) / 1000 / 60).toFixed(1);
  console.log(`\nAll translations complete in ${elapsed} min.`);
}

main().catch((e) => {
  console.error('FATAL:', e);
  process.exit(1);
});
