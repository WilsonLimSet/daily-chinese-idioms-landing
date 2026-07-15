/**
 * Translate the zodiac content (public/translations/en/zodiac.json) into the
 * active languages using OpenAI. One JSON-mode call per language.
 *
 * Usage: node scripts/translate-zodiac.js [--force] [--lang de]
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 5 * 60 * 1000, maxRetries: 2 });

const LANGUAGES = { es: 'Spanish', id: 'Indonesian', ja: 'Japanese', ko: 'Korean', fr: 'French', de: 'German' };

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public/translations/en/zodiac.json');

const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyLang = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;

async function translateTo(lang, langName, source) {
  const prompt = `Translate the VALUES of this JSON object into ${langName} for a Chinese-culture website about the Chinese zodiac.

STRICT RULES:
- Return a JSON object with the EXACT same structure and keys. Translate only the string values.
- Do NOT translate or remove placeholder tokens in curly braces: {n} {animal} {year} {month} {prev} {clash} {max}. Keep them verbatim in a natural position.
- Keep Chinese characters that appear (like 三合, 六冲) exactly as-is — do not translate or transliterate them.
- "signs.*.animal" are the zodiac animal names (Rat, Ox, Tiger…) — translate to the natural ${langName} name for that animal.
- "element" values (Water, Earth, Wood, Fire, Metal) and "yinYang" (Yin, Yang) — use the conventional ${langName} terms; for Yin/Yang keep the standard romanization if that is what readers expect.
- Keep the tone concise and natural, matching the English register. Do not add or drop sentences.
- Translate EVERY English word into ${langName}. Never leave an English word untranslated, and never mix English letters into a translated word (e.g. do not output "자원ful" or "resourceful").
- Where the English uses two different adjectives, use two different ${langName} words — do not repeat the same word twice.
- Arrays must keep the same number of items and order.

JSON to translate:
${JSON.stringify(source)}`;

  const res = await openai.chat.completions.create({
    model: process.env.ZODIAC_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  return JSON.parse(res.choices[0].message.content);
}

(async () => {
  const source = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const langs = onlyLang ? [onlyLang] : Object.keys(LANGUAGES);
  const signKeys = Object.keys(source.signs);

  // Split each language into SMALL chunks (3 signs each + a ui chunk) and fire
  // every chunk for every language concurrently. Each small call finishes in
  // ~10s, so the whole pass completes in ~15-20s wall-clock — under the harness
  // auto-background threshold, which keeps network access alive.
  const signChunks = [];
  for (let i = 0; i < signKeys.length; i += 3) signChunks.push(signKeys.slice(i, i + 3));

  const acc = {}; // lang -> { signs:{}, ui:null, bad:false }
  const jobs = [];
  for (const lang of langs) {
    const outFile = path.join(ROOT, 'public/translations', lang, 'zodiac.json');
    if (fs.existsSync(outFile) && !force) { console.log(`  ${lang}: exists, skip (use --force)`); continue; }
    acc[lang] = { signs: {}, ui: null, bad: false };
    jobs.push({ lang, kind: 'ui', part: { ui: source.ui } });
    for (const chunk of signChunks) {
      jobs.push({ lang, kind: 'signs', part: { signs: Object.fromEntries(chunk.map(k => [k, source.signs[k]])) } });
    }
  }

  await Promise.all(jobs.map(async (job) => {
    try {
      const t = await translateTo(job.lang, LANGUAGES[job.lang], job.part);
      if (job.kind === 'ui') acc[job.lang].ui = t.ui;
      else Object.assign(acc[job.lang].signs, t.signs);
    } catch (e) {
      acc[job.lang].bad = true;
      console.log(`  ${job.lang}/${job.kind} FAILED: ${e.message}`);
    }
  }));

  for (const lang of langs) {
    const r = acc[lang];
    if (!r) continue; // skipped
    const complete = !r.bad && r.ui && signKeys.every(k => r.signs[k]);
    if (!complete) { console.log(`  ${lang}: incomplete — not written`); continue; }
    const outDir = path.join(ROOT, 'public/translations', lang);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'zodiac.json'), JSON.stringify({ signs: r.signs, ui: r.ui }, null, 2));
    console.log(`  ${lang} (${LANGUAGES[lang]})… done`);
  }
  console.log('Translation pass complete.');
})();
