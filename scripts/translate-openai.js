#!/usr/bin/env node
/**
 * Translation Script using OpenAI GPT-4o-mini
 *
 * Faster alternative to Gemini script. Uses JSON mode for reliable output.
 * Translates slang, HSK vocabulary, and phrases to all supported languages.
 *
 * Usage:
 *   node scripts/translate-openai.js --dry-run              # Preview what needs translating
 *   node scripts/translate-openai.js                         # Run all translations
 *   node scripts/translate-openai.js --lang es               # Only translate Spanish
 *   node scripts/translate-openai.js --type slang            # Only translate slang
 *   node scripts/translate-openai.js --type hsk              # Only translate HSK
 *   node scripts/translate-openai.js --type phrases          # Only translate phrases
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = 'gpt-4o-mini';
const BATCH_SIZE = parseInt(process.env.TRANSLATE_BATCH_SIZE || '10');
const MAX_RETRIES = 2;
const RATE_LIMIT_MS = 500; // OpenAI has much more generous rate limits

const LANGUAGES = {
  'es': 'Spanish', 'pt': 'Portuguese', 'id': 'Indonesian', 'vi': 'Vietnamese',
  'ja': 'Japanese', 'ko': 'Korean', 'th': 'Thai', 'hi': 'Hindi',
  'ar': 'Arabic', 'fr': 'French', 'tl': 'Filipino/Tagalog', 'ms': 'Malay', 'ru': 'Russian'
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ============ EXTRACTORS (same as Gemini script) ============

function extractSlangTerms() {
  const content = fs.readFileSync(path.join(__dirname, '../src/lib/slang.ts'), 'utf-8');
  const match = content.match(/export const slangTerms: SlangTerm\[\] = \[([\s\S]*?)\n\];\s*\n/);
  if (!match) throw new Error('Could not find slangTerms array');
  const terms = [];
  const blocks = match[1].split(/\},\s*\{/).map((b, i, arr) => {
    if (i === 0) b = b.replace(/^\s*\{/, '');
    if (i === arr.length - 1) b = b.replace(/\}\s*$/, '');
    return b;
  });
  for (const block of blocks) {
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
    const characters = block.match(/characters:\s*'([^']+)'/)?.[1];
    const pinyin = block.match(/pinyin:\s*'([^']+)'/)?.[1];
    const meaning = block.match(/meaning:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const origin = block.match(/origin:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const category = block.match(/category:\s*'([^']+)'/)?.[1];
    const era = block.match(/era:\s*'([^']+)'/)?.[1];
    const formality = block.match(/formality:\s*'([^']+)'/)?.[1];
    const examplesMatch = block.match(/examples:\s*\[([\s\S]*?)\]/);
    const examples = examplesMatch?.[1]?.match(/'((?:[^'\\]|\\.)*)'/g)?.map(s => s.slice(1, -1).replace(/\\'/g, "'")) || [];
    if (slug && characters) terms.push({ slug, characters, pinyin, meaning, origin, examples, category, era, formality });
  }
  return terms;
}

function extractHSKEntries() {
  const content = fs.readFileSync(path.join(__dirname, '../src/lib/hsk.ts'), 'utf-8');
  const match = content.match(/export const hskEntries: HSKEntry\[\] = \[([\s\S]*?)\n\];\s*\n/);
  if (!match) throw new Error('Could not find hskEntries array');
  const entries = [];
  const blocks = match[1].split(/\},\s*\{/).map((b, i, arr) => {
    if (i === 0) b = b.replace(/^\s*\{/, '');
    if (i === arr.length - 1) b = b.replace(/\}\s*$/, '');
    return b;
  });
  for (const block of blocks) {
    const characters = block.match(/characters:\s*'([^']+)'/)?.[1];
    const pinyin = block.match(/pinyin:\s*'([^']+)'/)?.[1];
    const meaning = block.match(/meaning:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const partOfSpeech = block.match(/partOfSpeech:\s*'([^']+)'/)?.[1];
    const hskLevel = parseInt(block.match(/hskLevel:\s*(\d)/)?.[1] || '0');
    const examplesMatch = block.match(/examples:\s*\[([\s\S]*?)\]/);
    const examples = examplesMatch?.[1]?.match(/'((?:[^'\\]|\\.)*)'/g)?.map(s => s.slice(1, -1).replace(/\\'/g, "'")) || [];
    const notes = block.match(/notes:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    if (characters) entries.push({ characters, pinyin, meaning, partOfSpeech, hskLevel, examples, notes });
  }
  return entries;
}

function extractPhrases() {
  const content = fs.readFileSync(path.join(__dirname, '../src/lib/phrases.ts'), 'utf-8');
  const match = content.match(/export const phraseTerms: PhraseTerm\[\] = \[([\s\S]*?)\n\];\s*\n/);
  if (!match) throw new Error('Could not find phraseTerms array');
  const terms = [];
  const blocks = match[1].split(/\},\s*(?:\/\/[^\n]*\n\s*)?\{/).map((b, i, arr) => {
    if (i === 0) b = b.replace(/^[\s\S]*?\{/, '');
    if (i === arr.length - 1) b = b.replace(/\}\s*$/, '');
    return b;
  });
  for (const block of blocks) {
    const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
    const characters = block.match(/characters:\s*'([^']+)'/)?.[1];
    const pinyin = block.match(/pinyin:\s*'([^']+)'/)?.[1];
    const meaning = block.match(/meaning:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const context = block.match(/context:\s*'((?:[^'\\]|\\.)*)'/)?.[1]?.replace(/\\'/g, "'");
    const category = block.match(/category:\s*'([^']+)'/)?.[1];
    const difficulty = block.match(/difficulty:\s*'([^']+)'/)?.[1];
    const formality = block.match(/formality:\s*'([^']+)'/)?.[1];
    const examplesMatch = block.match(/examples:\s*\[([\s\S]*?)\]/);
    const examples = examplesMatch?.[1]?.match(/'((?:[^'\\]|\\.)*)'/g)?.map(s => s.slice(1, -1).replace(/\\'/g, "'")) || [];
    if (slug && characters) terms.push({ slug, characters, pinyin, meaning, context, examples, category, difficulty, formality });
  }
  return terms;
}

// ============ OPENAI TRANSLATION ============

async function callOpenAI(systemPrompt, userPrompt) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: MODEL,
        response_format: { type: 'json_object' },
        temperature: 0.1,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      });
      const text = response.choices[0].message.content.trim();
      return JSON.parse(text);
    } catch (error) {
      if (attempt < MAX_RETRIES) {
        console.error(` retry ${attempt + 1}...`);
        await sleep(RATE_LIMIT_MS * 2);
        continue;
      }
      console.error(` Error: ${error.message}`);
      return null;
    }
  }
  return null;
}

// ============ SLANG ============

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

    for (let i = 0; i < allTerms.length; i += BATCH_SIZE) {
      const batch = allTerms.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allTerms.length / BATCH_SIZE);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.map(b => b.characters).join(', ')})...`);

      const items = batch.map((t, idx) => ({
        idx, slug: t.slug, characters: t.characters,
        meaning: t.meaning, origin: t.origin, examples: t.examples,
      }));

      const result = await callOpenAI(
        `You translate Chinese slang terms to ${langName}. Return JSON: {"translations": [{meaning, origin, examples},...]}. Keep Chinese characters/pinyin unchanged. Only translate meaning, origin, and examples. Keep same number of examples. Natural translations.`,
        JSON.stringify(items)
      );

      if (result?.translations?.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const o = batch[j], t = result.translations[j];
          translated.push({
            slug: o.slug, originalSlug: o.slug, characters: o.characters, pinyin: o.pinyin,
            meaning: t.meaning || o.meaning, origin: t.origin || o.origin,
            examples: t.examples || o.examples, category: o.category, era: o.era, formality: o.formality,
          });
        }
        console.log(' done');
      } else {
        console.log(` FAILED (got ${result?.translations?.length || 0}) - English fallback`);
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

// ============ HSK ============

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

    for (let i = 0; i < allEntries.length; i += BATCH_SIZE) {
      const batch = allEntries.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allEntries.length / BATCH_SIZE);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (HSK${batch[0].hskLevel}: ${batch.map(b => b.characters).join(', ')})...`);

      const items = batch.map((e, idx) => ({
        idx, characters: e.characters, meaning: e.meaning,
        partOfSpeech: e.partOfSpeech, examples: e.examples, notes: e.notes || null,
      }));

      const result = await callOpenAI(
        `You translate Chinese vocabulary to ${langName}. Return JSON: {"translations": [{meaning, partOfSpeech, examples, notes},...]}. Keep Chinese characters/pinyin unchanged. Only translate meaning, partOfSpeech, examples, notes. Keep same number of examples. Natural translations.`,
        JSON.stringify(items)
      );

      if (result?.translations?.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const o = batch[j], t = result.translations[j];
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

// ============ PHRASES ============

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

    for (let i = 0; i < allTerms.length; i += BATCH_SIZE) {
      const batch = allTerms.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(allTerms.length / BATCH_SIZE);
      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.map(b => b.characters).join(', ')})...`);

      const items = batch.map((t, idx) => ({
        idx, slug: t.slug, characters: t.characters,
        meaning: t.meaning, context: t.context, examples: t.examples,
      }));

      const result = await callOpenAI(
        `You translate Chinese phrases to ${langName}. Return JSON: {"translations": [{meaning, context, examples},...]}. Keep Chinese characters/pinyin unchanged. Only translate meaning, context, and examples. Keep same number of examples. Natural translations.`,
        JSON.stringify(items)
      );

      if (result?.translations?.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const o = batch[j], t = result.translations[j];
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

// ============ DRY RUN & MAIN ============

async function dryRun(targetLang, targetType) {
  console.log('DRY RUN\n');
  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  if (!targetType || targetType === 'slang') {
    const terms = extractSlangTerms();
    console.log(`Slang: ${terms.length} terms`);
    for (const [langCode, langName] of Object.entries(langs)) {
      const p = path.join(__dirname, `../public/translations/${langCode}/slang.json`);
      const count = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')).length : 0;
      console.log(`  ${langName} (${langCode}): ${count} existing, ${count >= terms.length ? 'up to date' : terms.length + ' to translate'}`);
    }
  }
  if (!targetType || targetType === 'hsk') {
    const entries = extractHSKEntries();
    console.log(`\nHSK: ${entries.length} entries`);
    for (const [langCode, langName] of Object.entries(langs)) {
      const p = path.join(__dirname, `../public/translations/${langCode}/hsk.json`);
      const count = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')).length : 0;
      console.log(`  ${langName} (${langCode}): ${count} existing, ${count >= entries.length ? 'up to date' : entries.length + ' to translate'}`);
    }
  }
  if (!targetType || targetType === 'phrases') {
    const terms = extractPhrases();
    console.log(`\nPhrases: ${terms.length} terms`);
    for (const [langCode, langName] of Object.entries(langs)) {
      const p = path.join(__dirname, `../public/translations/${langCode}/phrases.json`);
      const count = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')).length : 0;
      console.log(`  ${langName} (${langCode}): ${count} existing, ${count >= terms.length ? 'up to date' : terms.length + ' to translate'}`);
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

  console.log(`Translation Script (OpenAI ${MODEL})\n`);

  if (isDryRun) { await dryRun(targetLang, targetType); return; }
  if (!targetType || targetType === 'slang') await translateSlang(targetLang);
  if (!targetType || targetType === 'hsk') await translateHSK(targetLang);
  if (!targetType || targetType === 'phrases') await translatePhrases(targetLang);

  console.log('\nDone!');
}

main().catch(console.error);
