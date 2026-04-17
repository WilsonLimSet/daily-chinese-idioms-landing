#!/usr/bin/env node
/**
 * OpenAI-based translator for sbti-quiz.en.json → public/translations/{lang}/sbti-quiz.json.
 * Uses gpt-4o JSON mode, which handles larger outputs more reliably than Gemini Flash.
 *
 * Usage:
 *   node scripts/translate-sbti-quiz-openai.js          # all 13 langs, re-translates
 *   node scripts/translate-sbti-quiz-openai.js th       # single lang
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  console.error('Missing OPENAI_API_KEY');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const source = require('../src/data/sbti-quiz.en.json');

const LANGS = {
  ar: 'Arabic',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  hi: 'Hindi',
  id: 'Indonesian',
  ja: 'Japanese',
  ko: 'Korean',
  ms: 'Malay',
  pt: 'Portuguese (Brazilian)',
  ru: 'Russian',
  th: 'Thai',
  tl: 'Filipino/Tagalog',
  vi: 'Vietnamese',
};

const sleep = ms => new Promise(r => setTimeout(r, ms));

function buildPrompt(langName) {
  return `Translate this SBTI personality quiz (JSON) into natural, idiomatic ${langName}. Return the same JSON shape exactly — no preamble.

Rules:
- Preserve top-level keys: meta, ui, dimensions, main, special, typePatterns.
- Copy typePatterns verbatim.
- Do NOT modify any "id", "dim", "kind", "value", or numeric fields.
- Do NOT reorder options (some are reverse-scored — order matters).
- Translate every human-readable string: meta.*, every string under ui.* including ui.result.*, dimensions.*.name/model/levels, main[].text, main[].options[].label, special[].text, special[].options[].label.
- Placeholders in curly braces ({cur}, {total}, {answered}, {rarity}, {code}, {remaining}) MUST be preserved verbatim — don't translate or reorder them.
- Brand tokens stay as-is: "SBTI", "MBTI", type codes like "CTRL", "DRUNK", "HHHH".
- Keep the deadpan, Gen-Z cynical, absurdist tone throughout.
- Localize cultural references (baijiu → local strong spirit in a thermos; specific Chinese online games → familiar-to-target-culture games). Preserve the absurdity of Q22 ("no question, just guess") and the length of Q1's monologue.

Source:
${JSON.stringify(source)}`;
}

async function translateForLang(langCode, langName) {
  const outPath = path.join(__dirname, '..', 'public', 'translations', langCode, 'sbti-quiz.json');
  const r = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: buildPrompt(langName) }],
  });
  const parsed = JSON.parse(r.choices[0].message.content);

  // Force structural integrity from source
  parsed.typePatterns = source.typePatterns;

  if (!parsed.main || parsed.main.length !== source.main.length) {
    throw new Error(`Expected ${source.main.length} main questions, got ${parsed.main?.length}`);
  }
  for (let i = 0; i < source.main.length; i++) {
    const src = source.main[i];
    const tr = parsed.main[i];
    tr.id = src.id;
    tr.dim = src.dim;
    if (!tr.options || tr.options.length !== src.options.length) {
      throw new Error(`Bad options at main[${i}] (${src.id})`);
    }
    for (let j = 0; j < src.options.length; j++) {
      tr.options[j].value = src.options[j].value;
    }
  }
  if (!parsed.special || parsed.special.length !== source.special.length) {
    throw new Error(`Expected ${source.special.length} special, got ${parsed.special?.length}`);
  }
  for (let i = 0; i < source.special.length; i++) {
    const src = source.special[i];
    const tr = parsed.special[i];
    tr.id = src.id;
    tr.kind = src.kind;
    for (let j = 0; j < src.options.length; j++) {
      tr.options[j].value = src.options[j].value;
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8');
}

(async () => {
  const only = process.argv[2];
  const entries = only ? [[only, LANGS[only]]] : Object.entries(LANGS);
  if (only && !LANGS[only]) {
    console.error(`Unknown lang: ${only}`);
    process.exit(1);
  }
  console.log(`Translating into ${entries.length} language(s) via OpenAI…`);
  let ok = 0, failed = 0;
  for (const [code, name] of entries) {
    process.stdout.write(`→ ${code} (${name})… `);
    try {
      await translateForLang(code, name);
      console.log('done');
      ok++;
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed++;
    }
    if (entries.length > 1) await sleep(500);
  }
  console.log(`\n${ok} done, ${failed} failed.`);
})();
