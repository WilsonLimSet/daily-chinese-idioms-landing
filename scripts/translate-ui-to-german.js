#!/usr/bin/env node
/**
 * Translate the `en: { ... }` UI strings block in src/lib/translations.ts to German,
 * then inject a new `de: { ... }` block in alphabetical-ish position (after `fr:`).
 *
 * Usage: GEMINI_API_KEY=... node scripts/translate-ui-to-german.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: { temperature: 0.1, maxOutputTokens: 32000 },
});

const FILE = path.join(__dirname, '../src/lib/translations.ts');
const src = fs.readFileSync(FILE, 'utf8');

// Extract the en: { ... }, block
const enStart = src.indexOf('  en: {');
const esStart = src.indexOf('  es: {');
if (enStart === -1 || esStart === -1) throw new Error('could not find en/es blocks');
const enBlock = src.slice(enStart, esStart);

// Extract the key-value pairs inside en: { ... },
// We send the entire block to Gemini and ask for a faithful German translation,
// preserving keys, quotes, Chinese characters, pinyin, and markdown.

const prompt = `You will receive a TypeScript object literal fragment representing UI strings for a Chinese-idioms website in English. Translate EVERY string value to natural, native-sounding German (Hochdeutsch / Standard German).

CRITICAL RULES:
1. Preserve every key name EXACTLY — do not change any key.
2. Preserve Chinese characters (成语, 谚语, 霜降, etc.) untranslated inside the German text. Keep pinyin (with tone marks) as-is.
3. Preserve all punctuation, markdown, HTML, template placeholders like {title} or {count}, escape sequences like \\" and \\n, and inline single-quotes.
4. Do NOT translate proper nouns like "Confucius", brand names like "Chinese Idioms", "Pinyin", "HSK", "Gemini", or file/URL tokens.
5. Translate naturally — these are UI strings seen by users. Friendly, clear German. Avoid robotic word-for-word translation.
6. The output must be VALID TypeScript. Change only the label (en: to de:), and translate only the string values. Trailing comma after } must remain.
7. Return ONLY the TypeScript object literal block starting with "  de: {" and ending with the closing "  }," — no markdown code fence, no explanation.

Input block to translate (replace 'en:' with 'de:' and translate string values):
\`\`\`
${enBlock}\`\`\`

Return the de: block now.`;

async function run() {
  console.log(`Translating ${enBlock.length} chars of UI strings to German via Gemini...`);
  const result = await model.generateContent(prompt);
  let text = result.response.text().trim();

  // Strip markdown fences if the model added any
  text = text.replace(/^```(?:typescript|ts|javascript|js)?\s*\n?/, '').replace(/\n?```$/, '').trim();
  // Normalize indent: find `de: {` (with any leading whitespace) and re-anchor to 2-space indent
  const deMatch = text.match(/(\s*)de:\s*\{/);
  if (!deMatch) {
    console.error('Could not find de: block in output:\n', text.slice(0, 300));
    process.exit(1);
  }
  const deStart = deMatch.index + deMatch[0].indexOf('de:');
  text = text.slice(deStart);
  // Re-prepend the canonical 2-space indent
  text = '  ' + text;
  // Ensure it ends with `,\n` or `},`
  if (!/},?\s*$/.test(text)) {
    console.error('Unexpected output end:\n', text.slice(-200));
    process.exit(1);
  }
  if (!text.endsWith(',')) text = text.replace(/}\s*$/, '},');

  // Inject after the fr: block. Find fr: and locate its matching closing }, then insert de: after it.
  const frStart = src.indexOf('  fr: {');
  if (frStart === -1) throw new Error('fr: block not found');
  // Find matching close. We know the next top-level key after fr is one of: ko, th, hi, ar, tl, ms, ru.
  // Use simple heuristic: find `\n  }, \n\n  ` followed by a key like 'ko:'
  const afterFr = src.indexOf('\n  },\n\n', frStart);
  if (afterFr === -1) throw new Error('could not find end of fr: block');
  const insertAt = afterFr + '\n  },\n'.length; // position right after the `\n  },\n` that closes fr
  const before = src.slice(0, insertAt);
  const after = src.slice(insertAt);
  const newSrc = before + '\n' + text + '\n' + after;
  fs.writeFileSync(FILE, newSrc);
  console.log('Injected de: block after fr: block.');
}

run().catch(e => { console.error(e); process.exit(1); });
