#!/usr/bin/env node
/* eslint-disable no-console */
/**
 * Backfill public/translations/{lang}/slang.json from src/lib/slang.ts via OpenAI.
 *
 * Only translates terms MISSING from a language's file, then appends them in
 * slang.ts order — existing translations are never touched or re-spent on.
 *
 * Usage:
 *   node scripts/translate-slang.js --dry-run     # show what's missing per language
 *   node scripts/translate-slang.js               # backfill all kept languages
 *   node scripts/translate-slang.js --lang ja     # one language
 *   node scripts/translate-slang.js --force       # re-translate everything (expensive)
 *
 * Model: SLANG_MODEL env var (default gpt-4o — slang needs register nuance,
 * mini flattens the jokes).
 *
 * Scope note: kept languages only (see the Jun 2026 language pruning). The 8
 * dropped languages keep whatever they already have; they're noindexed.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 5 * 60 * 1000, maxRetries: 2 });

const LANGUAGES = { es: 'Spanish', id: 'Indonesian', ja: 'Japanese', ko: 'Korean', fr: 'French', de: 'German' };
const ROOT = path.join(__dirname, '..');
const CHUNK = 3;
const CONCURRENCY = 6;

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const force = args.includes('--force');
const onlyLang = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;

/**
 * Pull the slangTerms array out of the TS module by evaluating the array
 * literal itself. Regex-per-field parsing (the old translate-slang-hsk.js
 * approach) silently drops entries that use double-quoted strings, which the
 * newer entries do because their text contains apostrophes.
 */
function loadSlangTerms() {
  const src = fs.readFileSync(path.join(ROOT, 'src/lib/slang.ts'), 'utf8');
  const start = src.indexOf('export const slangTerms');
  if (start === -1) throw new Error('slangTerms not found in slang.ts');
  // Seek past the `=` first — otherwise indexOf('[') lands on the `[]` in the
  // `SlangTerm[]` type annotation and parses an empty array.
  const eq = src.indexOf('=', start);
  const open = src.indexOf('[', eq);
  // Walk to the matching close bracket, ignoring brackets inside strings.
  let depth = 0, quote = null, esc = false, end = -1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (esc) { esc = false; continue; }
    if (c === '\\') { esc = true; continue; }
    if (quote) { if (c === quote) quote = null; continue; }
    if (c === '"' || c === "'" || c === '`') { quote = c; continue; }
    if (c === '[') depth++;
    else if (c === ']') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end === -1) throw new Error('Could not find end of slangTerms array');
  // Evaluate the array literal in a bare sandbox — no require/process/globals
  // reachable, so this stays a data read even if slang.ts is ever malformed.
  const terms = vm.runInNewContext(`(${src.slice(open, end + 1)})`, Object.create(null), { timeout: 5000 });
  return terms.map(({ slug, characters, pinyin, meaning, origin, examples, category, era, formality }) =>
    ({ slug, characters, pinyin, meaning, origin, examples, category, era, formality }));
}

async function translateChunk(langName, chunk) {
  const prompt = `Translate the Chinese-internet-slang entries below into ${langName}, for a site that explains Chinese slang to ${langName} speakers.

Return a JSON object: {"terms": [...]} with the SAME array order and the same keys on every object.

TRANSLATE these fields only: meaning, origin, examples.
COPY VERBATIM, do not translate or alter: slug, pinyin, category, era, formality.
characters: keep the Chinese characters exactly as-is. If the value contains a Latin-script acronym or gloss (e.g. "YYDS (永远的神)"), keep that structure.

Rules:
- Keep every Chinese character exactly as written. Never transliterate, translate, or drop them.
- In examples, a Chinese sentence must stay Chinese — translate only the surrounding English gloss/explanation in parentheses or after the dash.
- Slang is register-sensitive: match the tone, including humor, sarcasm and vulgarity. Do not sanitize a crude term into a polite one, and do not invent slang that doesn't exist in ${langName} — if there's no equivalent, explain it plainly instead.
- Translate EVERY English word. Never leave an English word untranslated, and never mix Latin letters into a translated word (proper nouns, platform names like Douyin/Weibo/Bilibili, and romanized Chinese are fine).
- Keep length close to the English. Do not add or drop sentences.

Entries:
${JSON.stringify(chunk, null, 1)}`;

  const res = await openai.chat.completions.create({
    model: process.env.SLANG_MODEL || 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  const parsed = JSON.parse(res.choices[0].message.content);
  const out = parsed.terms || parsed.entries || (Array.isArray(parsed) ? parsed : null);
  if (!Array.isArray(out) || out.length !== chunk.length) {
    throw new Error(`expected ${chunk.length} terms, got ${Array.isArray(out) ? out.length : typeof out}`);
  }
  // Re-pin the untranslatable fields from source so a chatty model can't drift them.
  return out.map((t, i) => ({
    slug: chunk[i].slug,
    originalSlug: chunk[i].slug,
    characters: t.characters || chunk[i].characters,
    pinyin: chunk[i].pinyin,
    meaning: t.meaning,
    origin: t.origin,
    examples: Array.isArray(t.examples) ? t.examples : chunk[i].examples,
    category: chunk[i].category,
    era: chunk[i].era,
    formality: chunk[i].formality,
  }));
}

async function runPool(tasks) {
  const results = [];
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, tasks.length) }, async () => {
    while (i < tasks.length) {
      const idx = i++;
      try { results[idx] = await tasks[idx](); }
      catch (err) { results[idx] = { __error: err.message }; }
    }
  }));
  return results;
}

(async () => {
  const source = loadSlangTerms();
  console.log(`slang.ts: ${source.length} terms\n`);

  const langs = onlyLang ? [onlyLang] : Object.keys(LANGUAGES);

  for (const lang of langs) {
    const langName = LANGUAGES[lang];
    if (!langName) { console.log(`${lang}: not a kept language, skipping`); continue; }

    const outPath = path.join(ROOT, 'public/translations', lang, 'slang.json');
    const existing = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, 'utf8')) : [];
    const have = new Set(existing.map(t => t.originalSlug || t.slug));
    const missing = force ? source : source.filter(t => !have.has(t.slug));

    if (!missing.length) { console.log(`${lang} (${langName}): ${existing.length}/${source.length} — up to date`); continue; }
    if (dryRun) { console.log(`${lang} (${langName}): ${existing.length}/${source.length} — ${missing.length} missing: ${missing.map(t => t.slug).join(', ')}`); continue; }

    const chunks = [];
    for (let i = 0; i < missing.length; i += CHUNK) chunks.push(missing.slice(i, i + CHUNK));

    process.stdout.write(`${lang} (${langName}): translating ${missing.length} terms in ${chunks.length} chunks... `);
    const results = await runPool(chunks.map(c => () => translateChunk(langName, c)));

    const failed = results.filter(r => r && r.__error);
    const translated = results.filter(r => Array.isArray(r)).flat();
    if (failed.length) console.log(`\n  ⚠ ${failed.length} chunk(s) failed: ${failed.map(f => f.__error).join('; ')}`);

    // Merge, then order to match slang.ts so the dictionary page reads consistently.
    const byslug = new Map([...(force ? [] : existing), ...translated].map(t => [t.originalSlug || t.slug, t]));
    const merged = source.map(t => byslug.get(t.slug)).filter(Boolean);

    fs.writeFileSync(outPath, JSON.stringify(merged, null, 2) + '\n');
    console.log(`✓ ${merged.length}/${source.length} total`);
  }

  if (!dryRun) {
    console.log('\nVerify:');
    console.log('  for f in public/translations/*/slang.json; do echo "$f: $(jq length $f)"; done');
  }
})().catch(err => { console.error(err); process.exit(1); });
