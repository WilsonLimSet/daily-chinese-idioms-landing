#!/usr/bin/env node
/**
 * Translate src/data/sbti-quiz.en.json into public/translations/{lang}/sbti-quiz.json
 * for all 13 non-English languages. Resume-safe: only re-translates missing files.
 *
 * Usage:
 *   node scripts/translate-sbti-quiz.js           # all 13 languages
 *   node scripts/translate-sbti-quiz.js th        # a single language
 *   FORCE=1 node scripts/translate-sbti-quiz.js   # re-translate even if file exists
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

if (!process.env.GEMINI_API_KEY) {
  console.error('Missing GEMINI_API_KEY in environment');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { temperature: 0.3, maxOutputTokens: 16384 },
});

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
  tl: 'Tagalog',
  vi: 'Vietnamese',
};

const DELAY_MS = 4500;
const MAX_RETRIES = 3;

const sourcePath = path.join(__dirname, '..', 'src', 'data', 'sbti-quiz.en.json');
const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

const sleep = ms => new Promise(r => setTimeout(r, ms));

function buildPrompt(source, langName) {
  return `Translate the SBTI personality quiz below into ${langName}. Return ONLY a single JSON object matching the source schema exactly — no preamble, no markdown fence, no commentary.

## Rules (critical)

1. Preserve the top-level shape: keys "meta", "ui", "dimensions", "main", "special", "typePatterns".
2. DO NOT translate or modify "typePatterns" at all — copy that array verbatim.
3. DO NOT change any "id", "dim", "kind", "value", or "position" fields. Keep them byte-identical.
4. DO NOT reorder options within a question. Some questions have reversed scoring (value 3 appears first, value 1 last). Preserve option order exactly as given.
5. Translate ALL human-readable string fields into natural, culturally appropriate ${langName}:
   - meta.title, meta.subtitle, meta.disclaimer
   - Every string under ui.* (including ui.result.*) — buttons, labels, kickers, descriptions
   - dimensions.*.name, dimensions.*.model, dimensions.*.levels.L/M/H
   - main[].text, main[].options[].label
   - special[].text, special[].options[].label
6. Placeholder tokens in curly braces ({cur}, {total}, {answered}, {rarity}, {code}, {remaining}) MUST be preserved verbatim. Do not translate or reorder them. Example: "Q{cur} / {total}" → translated equivalent keeping {cur} and {total}.
7. Keep the original's deadpan, Gen-Z cynical, absurdist tone. The creator is known for dry humor.
8. Localize culturally-loaded references rather than translating literally:
   - "baijiu" (Chinese liquor) → use the local strong spirit but keep the "in a thermos, drinking it like water" image. In languages where baijiu is unfamiliar, say "hard liquor" or the local equivalent.
   - References to specific online games → replace with a well-known competitive game familiar in the target culture.
   - Q1's long self-pitying monologue → preserve the length, the bleak humor, and the sudden plea at the end.
   - Q22 ("this question has no question, please guess blindly") → preserve the absurdity.
   - Q7 "diarrhea" should be translated directly; the absurdity is the point.
9. "SBTI", "MBTI", type codes like "CTRL", "DRUNK", "HHHH" stay unchanged — they're brand tokens.

## Source (JSON)

${JSON.stringify(source, null, 2)}

Return the translated JSON now.`;
}

async function translateForLang(langCode, langName) {
  const outPath = path.join(
    __dirname,
    '..',
    'public',
    'translations',
    langCode,
    'sbti-quiz.json'
  );
  if (!process.env.FORCE && fs.existsSync(outPath)) {
    console.log(`  [${langCode}] already exists — skipping (FORCE=1 to override)`);
    return { skipped: true };
  }
  const prompt = buildPrompt(source, langName);
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON found in response');
      const parsed = JSON.parse(match[0]);

      parsed.typePatterns = source.typePatterns;
      parsed.meta = parsed.meta || {};

      for (let i = 0; i < source.main.length; i++) {
        const src = source.main[i];
        const tr = parsed.main[i];
        if (!tr) throw new Error(`Missing main[${i}] for ${src.id}`);
        tr.id = src.id;
        tr.dim = src.dim;
        if (!tr.options || tr.options.length !== src.options.length) {
          throw new Error(`Bad options length at main[${i}] (${src.id})`);
        }
        for (let j = 0; j < src.options.length; j++) {
          tr.options[j].value = src.options[j].value;
        }
      }
      for (let i = 0; i < source.special.length; i++) {
        const src = source.special[i];
        const tr = parsed.special[i];
        if (!tr) throw new Error(`Missing special[${i}] for ${src.id}`);
        tr.id = src.id;
        tr.kind = src.kind;
        for (let j = 0; j < src.options.length; j++) {
          tr.options[j].value = src.options[j].value;
        }
      }

      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(parsed, null, 2), 'utf8');
      return { ok: true };
    } catch (err) {
      console.log(`  [${langCode}] attempt ${attempt} failed: ${err.message}`);
      if (attempt === MAX_RETRIES) throw err;
      await sleep(DELAY_MS * attempt);
    }
  }
  throw new Error('unreachable');
}

(async () => {
  const only = process.argv[2];
  const entries = only ? [[only, LANGS[only]]] : Object.entries(LANGS);
  if (only && !LANGS[only]) {
    console.error(`Unknown language code: ${only}. Valid: ${Object.keys(LANGS).join(', ')}`);
    process.exit(1);
  }

  console.log(`Translating SBTI quiz into ${entries.length} language(s)…`);
  let ok = 0;
  let skipped = 0;
  for (const [code, name] of entries) {
    process.stdout.write(`→ ${code} (${name})… `);
    try {
      const result = await translateForLang(code, name);
      if (result.skipped) {
        skipped++;
        console.log('skipped');
      } else {
        ok++;
        console.log('done');
      }
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
    if (entries.length > 1) await sleep(DELAY_MS);
  }
  console.log(`\nDone. ${ok} translated, ${skipped} skipped.`);
})();
