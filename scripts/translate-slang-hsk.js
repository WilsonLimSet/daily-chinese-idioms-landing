#!/usr/bin/env node
/**
 * Slang & HSK Translation Script using Gemini 2.0 Flash
 *
 * Translates slang terms and HSK vocabulary to all supported languages.
 * Follows same pattern as translate-new-listicles.js.
 *
 * Usage:
 *   node scripts/translate-slang-hsk.js --dry-run          # Preview what will be translated
 *   node scripts/translate-slang-hsk.js                     # Run all translations
 *   node scripts/translate-slang-hsk.js --lang es           # Only translate Spanish
 *   node scripts/translate-slang-hsk.js --type slang        # Only translate slang
 *   node scripts/translate-slang-hsk.js --type hsk          # Only translate HSK
 *   node scripts/translate-slang-hsk.js --type phrases      # Only translate phrases
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  }
});

const RATE_LIMIT_MS = 4500;
const SLANG_BATCH_SIZE = 5;
const HSK_BATCH_SIZE = 10;
const PHRASES_BATCH_SIZE = 5;
const MAX_RETRIES = 2;

const LANGUAGES = {
  'es': 'Spanish',
  'pt': 'Portuguese',
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'th': 'Thai',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
  'tl': 'Filipino/Tagalog',
  'ms': 'Malay',
  'ru': 'Russian'
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractSlangTerms() {
  const filePath = path.join(__dirname, '../src/lib/slang.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const match = content.match(/export const slangTerms: SlangTerm\[\] = \[([\s\S]*?)\n\];\s*\n/);
  if (!match) throw new Error('Could not find slangTerms array');

  const terms = [];
  const termBlocks = match[1].split(/\},\s*\{/).map((b, i, arr) => {
    if (i === 0) b = b.replace(/^\s*\{/, '');
    if (i === arr.length - 1) b = b.replace(/\}\s*$/, '');
    return b;
  });

  for (const block of termBlocks) {
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
    const characters = block.match(/characters:\s*'([^']+)'/)?.[1];
    const pinyin = block.match(/pinyin:\s*'([^']+)'/)?.[1];
    const meaning = block.match(/meaning:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const origin = block.match(/origin:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const category = block.match(/category:\s*'([^']+)'/)?.[1];
    const era = block.match(/era:\s*'([^']+)'/)?.[1];
    const formality = block.match(/formality:\s*'([^']+)'/)?.[1];
    const examplesMatch = block.match(/examples:\s*\[([\s\S]*?)\]/);
    const examples = examplesMatch?.[1]
      .match(/'((?:[^'\\]|\\.)*)'/g)
      ?.map(s => s.slice(1, -1).replace(/\\'/g, "'")) || [];

    if (slug && characters) {
      terms.push({ slug, characters, pinyin, meaning, origin, examples, category, era, formality });
    }
  }

  return terms;
}

function extractHSKEntries() {
  const filePath = path.join(__dirname, '../src/lib/hsk.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const match = content.match(/export const hskEntries: HSKEntry\[\] = \[([\s\S]*?)\n\];\s*\n/);
  if (!match) throw new Error('Could not find hskEntries array');

  const entries = [];
  const termBlocks = match[1].split(/\},\s*\{/).map((b, i, arr) => {
    if (i === 0) b = b.replace(/^\s*\{/, '');
    if (i === arr.length - 1) b = b.replace(/\}\s*$/, '');
    return b;
  });

  for (const block of termBlocks) {
    const characters = block.match(/characters:\s*'([^']+)'/)?.[1];
    const pinyin = block.match(/pinyin:\s*'([^']+)'/)?.[1];
    const meaning = block.match(/meaning:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const partOfSpeech = block.match(/partOfSpeech:\s*'([^']+)'/)?.[1];
    const hskLevel = parseInt(block.match(/hskLevel:\s*(\d)/)?.[1] || '0');
    const examplesMatch = block.match(/examples:\s*\[([\s\S]*?)\]/);
    const examples = examplesMatch?.[1]
      .match(/'((?:[^'\\]|\\.)*)'/g)
      ?.map(s => s.slice(1, -1).replace(/\\'/g, "'")) || [];
    const notes = block.match(/notes:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");

    if (characters) {
      entries.push({ characters, pinyin, meaning, partOfSpeech, hskLevel, examples, notes });
    }
  }

  return entries;
}

function sanitizeJSON(text) {
  // Fix common Gemini JSON issues: unescaped quotes inside strings
  // Replace smart quotes with regular quotes
  let s = text.replace(/[\u201C\u201D]/g, '"').replace(/[\u2018\u2019]/g, "'");
  // Try to fix unescaped quotes in string values by finding patterns like "key": "value with "quotes" inside"
  // Strategy: parse character by character if JSON.parse fails
  try {
    JSON.parse(s);
    return s;
  } catch {
    // Try removing trailing commas before ] or }
    s = s.replace(/,\s*([\]}])/g, '$1');
    try {
      JSON.parse(s);
      return s;
    } catch {
      return null;
    }
  }
}

async function translateSlangSingle(term, langCode, langName) {
  const prompt = `Translate this Chinese slang term to ${langName}.
Return a JSON object with keys: meaning, origin, examples (array of strings).
Only translate meaning, origin, and examples. Keep translations natural.
IMPORTANT: Escape any quotes inside string values with backslash. Return valid JSON only.

Term: ${term.characters} (${term.pinyin})
meaning: ${JSON.stringify(term.meaning)}
origin: ${JSON.stringify(term.origin)}
examples: ${JSON.stringify(term.examples)}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        return null;
      }
      const sanitized = sanitizeJSON(jsonMatch[0]);
      if (sanitized) return JSON.parse(sanitized);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      return null;
    } catch (error) {
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      return null;
    }
  }
  return null;
}

async function translateSlangBatch(terms, langCode, langName) {
  const items = terms.map((t, i) =>
    `${i + 1}. slug="${t.slug}" characters="${t.characters}"
meaning: ${JSON.stringify(t.meaning)}
origin: ${JSON.stringify(t.origin)}
examples: ${JSON.stringify(t.examples)}`
  ).join('\n\n');

  const prompt = `Translate these Chinese slang term details to ${langName}.
Return a JSON array where each item has: meaning, origin, examples (array of strings).
Keep Chinese characters and pinyin unchanged. Only translate meaning, origin, and examples.
Preserve the same number of examples. Keep translations natural. No explanations.
IMPORTANT: Escape any quotes inside string values with backslash. Return valid JSON only.

${items}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        break; // Fall through to single-item fallback
      }
      const sanitized = sanitizeJSON(jsonMatch[0]);
      if (sanitized) return JSON.parse(sanitized);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      break; // Fall through to single-item fallback
    } catch (error) {
      console.error(` Error: ${error.message}`);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      break; // Fall through to single-item fallback
    }
  }

  // Fallback: translate one at a time
  console.log(` Batch failed, translating ${terms.length} terms individually...`);
  const results = [];
  for (const term of terms) {
    await sleep(RATE_LIMIT_MS);
    const result = await translateSlangSingle(term, langCode, langName);
    if (result) {
      results.push(result);
    } else {
      console.error(`  Failed single: ${term.characters}, using English`);
      results.push({ meaning: term.meaning, origin: term.origin, examples: term.examples });
    }
  }
  return results;
}

async function translateHSKBatch(entries, langCode, langName) {
  const items = entries.map((e, i) =>
    `${i + 1}. ${e.characters} (${e.pinyin}): meaning="${e.meaning}", partOfSpeech="${e.partOfSpeech}", examples=${JSON.stringify(e.examples)}${e.notes ? `, notes="${e.notes}"` : ''}`
  ).join('\n');

  const prompt = `Translate these Chinese vocabulary details to ${langName}.
Return a JSON array where each item has: meaning, partOfSpeech, examples (array of strings), notes (string or null).
Keep Chinese characters and pinyin unchanged. Only translate meaning, partOfSpeech, examples, notes.
Keep same number of examples. No explanations.

${items}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        return null;
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error(` Error: ${error.message}`);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      return null;
    }
  }
  return null;
}

async function translateSlang(targetLang) {
  const allTerms = extractSlangTerms();
  console.log(`Found ${allTerms.length} slang terms\n`);

  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  for (const [langCode, langName] of Object.entries(langs)) {
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/slang.json`);
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      if (existing.length >= allTerms.length) {
        console.log(`${langName} (${langCode}): ${existing.length} slang terms, skipping`);
        continue;
      }
    }

    console.log(`\n${langName} (${langCode}) - translating ${allTerms.length} slang terms`);

    const translated = [];
    for (let i = 0; i < allTerms.length; i += SLANG_BATCH_SIZE) {
      const batch = allTerms.slice(i, i + SLANG_BATCH_SIZE);
      const batchNum = Math.floor(i / SLANG_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allTerms.length / SLANG_BATCH_SIZE);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.map(b => b.characters).join(', ')})...`);

      const translations = await translateSlangBatch(batch, langCode, langName);
      if (translations && translations.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const o = batch[j], t = translations[j];
          translated.push({
            slug: o.slug, originalSlug: o.slug, characters: o.characters, pinyin: o.pinyin,
            meaning: t.meaning || o.meaning, origin: t.origin || o.origin,
            examples: t.examples || o.examples, category: o.category, era: o.era, formality: o.formality,
          });
        }
        console.log(' done');
      } else {
        console.log(' FAILED - English fallback');
        for (const o of batch) {
          translated.push({ slug: o.slug, originalSlug: o.slug, ...o });
        }
      }
      await sleep(RATE_LIMIT_MS);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
    console.log(`  Saved: ${translated.length} slang terms`);
  }
}

async function translateHSK(targetLang) {
  const allEntries = extractHSKEntries();
  console.log(`Found ${allEntries.length} HSK entries\n`);

  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  for (const [langCode, langName] of Object.entries(langs)) {
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/hsk.json`);
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      if (existing.length >= allEntries.length) {
        console.log(`${langName} (${langCode}): ${existing.length} HSK entries, skipping`);
        continue;
      }
    }

    console.log(`\n${langName} (${langCode}) - translating ${allEntries.length} HSK entries`);

    const translated = [];
    for (let i = 0; i < allEntries.length; i += HSK_BATCH_SIZE) {
      const batch = allEntries.slice(i, i + HSK_BATCH_SIZE);
      const batchNum = Math.floor(i / HSK_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allEntries.length / HSK_BATCH_SIZE);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (HSK${batch[0].hskLevel}: ${batch.map(b => b.characters).join(', ')})...`);

      const translations = await translateHSKBatch(batch, langCode, langName);
      if (translations && translations.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const o = batch[j], t = translations[j];
          translated.push({
            characters: o.characters, pinyin: o.pinyin,
            meaning: t.meaning || o.meaning, originalMeaning: o.meaning,
            partOfSpeech: t.partOfSpeech || o.partOfSpeech, hskLevel: o.hskLevel,
            examples: t.examples || o.examples, notes: t.notes || o.notes || undefined,
          });
        }
        console.log(' done');
      } else {
        console.log(' FAILED - English fallback');
        for (const o of batch) {
          translated.push({ ...o, originalMeaning: o.meaning });
        }
      }
      await sleep(RATE_LIMIT_MS);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
    console.log(`  Saved: ${translated.length} HSK entries`);
  }
}

function extractPhrases() {
  const filePath = path.join(__dirname, '../src/lib/phrases.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const match = content.match(/export const phraseTerms: PhraseTerm\[\] = \[([\s\S]*?)\n\];\s*\n/);
  if (!match) throw new Error('Could not find phraseTerms array');

  const terms = [];
  // Split on }, followed by optional whitespace/comments, then {
  const termBlocks = match[1].split(/\},\s*(?:\/\/[^\n]*\n\s*)?\{/).map((b, i, arr) => {
    if (i === 0) b = b.replace(/^[\s\S]*?\{/, '');
    if (i === arr.length - 1) b = b.replace(/\}\s*$/, '');
    return b;
  });

  for (const block of termBlocks) {
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
    const characters = block.match(/characters:\s*'([^']+)'/)?.[1];
    const pinyin = block.match(/pinyin:\s*'([^']+)'/)?.[1];
    const meaning = block.match(/meaning:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const context = block.match(/context:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const category = block.match(/category:\s*'([^']+)'/)?.[1];
    const difficulty = block.match(/difficulty:\s*'([^']+)'/)?.[1];
    const formality = block.match(/formality:\s*'([^']+)'/)?.[1];
    const examplesMatch = block.match(/examples:\s*\[([\s\S]*?)\]/);
    const examples = examplesMatch?.[1]
      .match(/'((?:[^'\\]|\\.)*)'/g)
      ?.map(s => s.slice(1, -1).replace(/\\'/g, "'")) || [];

    if (slug && characters) {
      terms.push({ slug, characters, pinyin, meaning, context, examples, category, difficulty, formality });
    }
  }

  return terms;
}

async function translatePhraseSingle(term, langCode, langName) {
  const prompt = `Translate this Chinese phrase to ${langName}.
Return a JSON object with keys: meaning, context, examples (array of strings).
Only translate meaning, context, and examples. Keep translations natural.
IMPORTANT: Escape any quotes inside string values with backslash. Return valid JSON only.

Phrase: ${term.characters} (${term.pinyin})
meaning: ${JSON.stringify(term.meaning)}
context: ${JSON.stringify(term.context)}
examples: ${JSON.stringify(term.examples)}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        return null;
      }
      const sanitized = sanitizeJSON(jsonMatch[0]);
      if (sanitized) return JSON.parse(sanitized);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      return null;
    } catch (error) {
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      return null;
    }
  }
  return null;
}

async function translatePhrasesBatch(terms, langCode, langName) {
  const items = terms.map((t, i) =>
    `${i + 1}. slug="${t.slug}" characters="${t.characters}"
meaning: ${JSON.stringify(t.meaning)}
context: ${JSON.stringify(t.context)}
examples: ${JSON.stringify(t.examples)}`
  ).join('\n\n');

  const prompt = `Translate these Chinese phrase details to ${langName}.
Return a JSON array where each item has: meaning, context, examples (array of strings).
Keep Chinese characters and pinyin unchanged. Only translate meaning, context, and examples.
Preserve the same number of examples. Keep translations natural. No explanations.
IMPORTANT: Escape any quotes inside string values with backslash. Return valid JSON only.

${items}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        break;
      }
      const sanitized = sanitizeJSON(jsonMatch[0]);
      if (sanitized) return JSON.parse(sanitized);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      break;
    } catch (error) {
      console.error(` Error: ${error.message}`);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      break;
    }
  }

  // Fallback: translate one at a time
  console.log(` Batch failed, translating ${terms.length} phrases individually...`);
  const results = [];
  for (const term of terms) {
    await sleep(RATE_LIMIT_MS);
    const result = await translatePhraseSingle(term, langCode, langName);
    if (result) {
      results.push(result);
    } else {
      console.error(`  Failed single: ${term.characters}, using English`);
      results.push({ meaning: term.meaning, context: term.context, examples: term.examples });
    }
  }
  return results;
}

async function translatePhrases(targetLang) {
  const allTerms = extractPhrases();
  console.log(`Found ${allTerms.length} phrase terms\n`);

  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  for (const [langCode, langName] of Object.entries(langs)) {
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/phrases.json`);
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      if (existing.length >= allTerms.length) {
        console.log(`${langName} (${langCode}): ${existing.length} phrase terms, skipping`);
        continue;
      }
    }

    console.log(`\n${langName} (${langCode}) - translating ${allTerms.length} phrase terms`);

    const translated = [];
    for (let i = 0; i < allTerms.length; i += PHRASES_BATCH_SIZE) {
      const batch = allTerms.slice(i, i + PHRASES_BATCH_SIZE);
      const batchNum = Math.floor(i / PHRASES_BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allTerms.length / PHRASES_BATCH_SIZE);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.map(b => b.characters).join(', ')})...`);

      const translations = await translatePhrasesBatch(batch, langCode, langName);
      if (translations && translations.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const o = batch[j], t = translations[j];
          translated.push({
            slug: o.slug, originalSlug: o.slug, characters: o.characters, pinyin: o.pinyin,
            meaning: t.meaning || o.meaning, context: t.context || o.context,
            examples: t.examples || o.examples, category: o.category, difficulty: o.difficulty, formality: o.formality,
          });
        }
        console.log(' done');
      } else {
        console.log(' FAILED - English fallback');
        for (const o of batch) {
          translated.push({ slug: o.slug, originalSlug: o.slug, ...o });
        }
      }
      await sleep(RATE_LIMIT_MS);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(translated, null, 2));
    console.log(`  Saved: ${translated.length} phrase terms`);
  }
}

async function dryRun(targetLang, targetType) {
  console.log('DRY RUN\n');
  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  if (targetType !== 'hsk') {
    const slangTerms = extractSlangTerms();
    console.log(`Slang: ${slangTerms.length} terms`);
    for (const [langCode, langName] of Object.entries(langs)) {
      const outputPath = path.join(__dirname, `../public/translations/${langCode}/slang.json`);
      const count = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf-8')).length : 0;
      console.log(`  ${langName} (${langCode}): ${count} existing, ${count >= slangTerms.length ? 'up to date' : slangTerms.length + ' to translate'}`);
    }
  }

  if (targetType !== 'slang' && targetType !== 'phrases') {
    const hskEntries = extractHSKEntries();
    console.log(`\nHSK: ${hskEntries.length} entries`);
    for (const [langCode, langName] of Object.entries(langs)) {
      const outputPath = path.join(__dirname, `../public/translations/${langCode}/hsk.json`);
      const count = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf-8')).length : 0;
      console.log(`  ${langName} (${langCode}): ${count} existing, ${count >= hskEntries.length ? 'up to date' : hskEntries.length + ' to translate'}`);
    }
  }

  if (targetType !== 'slang' && targetType !== 'hsk') {
    const phraseTerms = extractPhrases();
    console.log(`\nPhrases: ${phraseTerms.length} terms`);
    for (const [langCode, langName] of Object.entries(langs)) {
      const outputPath = path.join(__dirname, `../public/translations/${langCode}/phrases.json`);
      const count = fs.existsSync(outputPath) ? JSON.parse(fs.readFileSync(outputPath, 'utf-8')).length : 0;
      console.log(`  ${langName} (${langCode}): ${count} existing, ${count >= phraseTerms.length ? 'up to date' : phraseTerms.length + ' to translate'}`);
    }
  }

  console.log('\nRun without --dry-run to start translation.');
}

async function main() {
  const args = process.argv.slice(2);
  const isDryRun = args.includes('--dry-run');
  const langIdx = args.indexOf('--lang');
  const targetLang = langIdx !== -1 ? args[langIdx + 1] : null;
  const typeIdx = args.indexOf('--type');
  const targetType = typeIdx !== -1 ? args[typeIdx + 1] : null;

  if (targetLang && !LANGUAGES[targetLang]) {
    console.error(`Unknown language: ${targetLang}. Available: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }

  console.log('Slang, HSK & Phrases Translation Script\n');

  if (isDryRun) { await dryRun(targetLang, targetType); return; }
  if (!targetType || targetType === 'slang') await translateSlang(targetLang);
  if (!targetType || targetType === 'hsk') await translateHSK(targetLang);
  if (!targetType || targetType === 'phrases') await translatePhrases(targetLang);

  console.log('\nDone! Verify:');
  console.log('  for f in public/translations/*/slang.json; do echo "$f: $(node -e "console.log(require(\\"./$f\\").length)")"; done');
  console.log('  for f in public/translations/*/hsk.json; do echo "$f: $(node -e "console.log(require(\\"./$f\\").length)")"; done');
  console.log('  for f in public/translations/*/phrases.json; do echo "$f: $(node -e "console.log(require(\\"./$f\\").length)")"; done');
}

main().catch(console.error);
