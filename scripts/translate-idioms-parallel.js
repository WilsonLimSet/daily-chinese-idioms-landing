#!/usr/bin/env node
/**
 * Parallel OpenAI idiom translator.
 * Reads missing idioms for a target language, fires N concurrent batches.
 *
 * Usage: node scripts/translate-idioms-parallel.js --lang de [--concurrency 6] [--batch-size 20]
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const LANGUAGES = {
  es: 'Spanish', pt: 'Brazilian Portuguese', id: 'Indonesian', vi: 'Vietnamese',
  ja: 'Japanese', ko: 'Korean', th: 'Thai', hi: 'Hindi', ar: 'Arabic',
  fr: 'French', de: 'German', tl: 'Filipino/Tagalog', ms: 'Malay', ru: 'Russian'
};

const args = process.argv.slice(2);
const lang = args[args.indexOf('--lang') + 1];
const concurrency = parseInt(args.includes('--concurrency') ? args[args.indexOf('--concurrency') + 1] : '6');
const batchSize = parseInt(args.includes('--batch-size') ? args[args.indexOf('--batch-size') + 1] : '20');
if (!lang || !LANGUAGES[lang]) { console.error('usage: --lang <code>'); process.exit(1); }
const langName = LANGUAGES[lang];

const masterPath = path.join(__dirname, '../public/idioms.json');
const langPath = path.join(__dirname, `../public/translations/${lang}/idioms.json`);

const master = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
let existing = [];
try { existing = JSON.parse(fs.readFileSync(langPath, 'utf-8')); } catch { }
const existingIds = new Set(existing.map(i => i.id));
const missing = master.filter(i => !existingIds.has(i.id));

console.log(`Target: ${langName} (${lang})`);
console.log(`Existing: ${existing.length} | Missing: ${missing.length} | Concurrency: ${concurrency} | Batch: ${batchSize}`);
if (missing.length === 0) { console.log('✅ Already complete'); process.exit(0); }

function chunk(arr, n) { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }
const batches = chunk(missing, batchSize);
console.log(`Total batches: ${batches.length}`);

function buildPrompt(idioms, langName) {
  return `Translate the following ${idioms.length} Chinese idioms into ${langName}.

For each idiom, translate: meaning (literal), metaphoric_meaning, description, example, and theme.
Preserve: id, characters, pinyin, example_characters (if present).
Return ONLY valid JSON array in the same order. Each element must have id, characters, pinyin, meaning, metaphoric_meaning, description, example, example_characters, theme.

Use natural, native ${langName}. Keep Chinese characters and pinyin as-is. Do not include markdown code fences.

Input:
${JSON.stringify(idioms.map(i => ({ id: i.id, characters: i.characters, pinyin: i.pinyin, meaning: i.meaning, metaphoric_meaning: i.metaphoric_meaning, description: i.description, example: i.example, example_characters: i.example_characters, theme: i.theme })), null, 2)}`;
}

async function translateBatch(batch, idx) {
  const prompt = buildPrompt(batch, langName);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });
      const raw = resp.choices[0].message.content;
      const parsed = JSON.parse(raw);
      // Model may return { idioms: [...] } or an array at top level. Normalize.
      const arr = Array.isArray(parsed) ? parsed : (parsed.idioms || parsed.translations || Object.values(parsed).find(v => Array.isArray(v)));
      if (!Array.isArray(arr) || arr.length !== batch.length) {
        throw new Error(`expected ${batch.length} items, got ${arr?.length}`);
      }
      return arr;
    } catch (e) {
      if (attempt === 3) throw e;
      console.warn(`  [batch ${idx}] attempt ${attempt} failed: ${e.message}`);
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
}

// Run up to `concurrency` batches in parallel; after each completes, append to file atomically.
async function runAllParallel() {
  const results = new Array(batches.length);
  let nextIdx = 0;
  let completed = 0;
  const startTime = Date.now();

  async function worker(workerId) {
    while (true) {
      const myIdx = nextIdx++;
      if (myIdx >= batches.length) return;
      try {
        const translated = await translateBatch(batches[myIdx], myIdx);
        results[myIdx] = translated;
        completed++;
        // Append incrementally and persist to file for crash resilience
        existing = existing.concat(translated);
        fs.writeFileSync(langPath, JSON.stringify(existing, null, 2));
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`  [w${workerId}] batch ${myIdx + 1}/${batches.length} ✓ (${completed} done, ${elapsed}s)`);
      } catch (e) {
        console.error(`  [w${workerId}] batch ${myIdx + 1} FAILED: ${e.message}`);
        results[myIdx] = null;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, (_, i) => worker(i + 1));
  await Promise.all(workers);

  const failed = results.filter(r => !r).length;
  console.log(`\nDone. ${batches.length - failed} batches succeeded, ${failed} failed.`);
  console.log(`Total ${lang} idioms in file: ${existing.length}`);
}

runAllParallel().catch(e => { console.error(e); process.exit(1); });
