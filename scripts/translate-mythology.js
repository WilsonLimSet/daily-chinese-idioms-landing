/**
 * Translate public/translations/en/mythology.json into the active languages
 * via OpenAI. Chunked + concurrent so the whole pass finishes in ~15-20s.
 *
 * Usage: node scripts/translate-mythology.js [--force] [--lang de]
 * Model: set MYTH_MODEL=gpt-4o for higher quality (default gpt-4o-mini).
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 5 * 60 * 1000, maxRetries: 2 });
const LANGUAGES = { es: 'Spanish', id: 'Indonesian', ja: 'Japanese', ko: 'Korean', fr: 'French', de: 'German' };

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'public/translations/en/mythology.json');
const args = process.argv.slice(2);
const force = args.includes('--force');
const onlyLang = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;

async function translatePart(langName, part) {
  const prompt = `Translate the VALUES of this JSON object into ${langName} for a website about Chinese mythology.

STRICT RULES:
- Return JSON with the EXACT same structure and keys. Translate only string values.
- Keep proper names of Chinese mythological figures recognizable: translate the descriptive parts but keep the established English/romanized name where one exists (e.g. "Sun Wukong", "Nezha", "Guanyin", "Pixiu", "fenghuang", "qilin", "jiangshi" stay as their standard names; you may add the ${langName} gloss but keep the recognized name).
- Keep any Chinese characters that appear exactly as-is.
- Translate EVERY English word otherwise. Never leave an English word untranslated and never mix English letters into a translated word.
- Where the English uses two different adjectives, use two different ${langName} words.
- Keep the tone concise and factual, matching the English. Do not add or drop sentences.

JSON to translate:
${JSON.stringify(part)}`;
  const res = await openai.chat.completions.create({
    model: process.env.MYTH_MODEL || 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    temperature: 0.3,
  });
  return JSON.parse(res.choices[0].message.content);
}

(async () => {
  const source = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  const langs = onlyLang ? [onlyLang] : Object.keys(LANGUAGES);
  const figKeys = Object.keys(source.figures);
  const figChunks = [];
  for (let i = 0; i < figKeys.length; i += 3) figChunks.push(figKeys.slice(i, i + 3));

  const acc = {};
  const jobs = [];
  for (const lang of langs) {
    const outFile = path.join(ROOT, 'public/translations', lang, 'mythology.json');
    if (fs.existsSync(outFile) && !force) { console.log(`  ${lang}: exists, skip (use --force)`); continue; }
    acc[lang] = { figures: {}, ui: null, bad: false };
    jobs.push({ lang, kind: 'ui', part: { ui: source.ui } });
    for (const chunk of figChunks) {
      jobs.push({ lang, kind: 'figures', part: { figures: Object.fromEntries(chunk.map(k => [k, source.figures[k]])) } });
    }
  }

  await Promise.all(jobs.map(async (job) => {
    try {
      const t = await translatePart(LANGUAGES[job.lang], job.part);
      if (job.kind === 'ui') acc[job.lang].ui = t.ui;
      else Object.assign(acc[job.lang].figures, t.figures);
    } catch (e) {
      acc[job.lang].bad = true;
      console.log(`  ${job.lang}/${job.kind} FAILED: ${e.message}`);
    }
  }));

  for (const lang of langs) {
    const r = acc[lang];
    if (!r) continue;
    const complete = !r.bad && r.ui && figKeys.every(k => r.figures[k]);
    if (!complete) { console.log(`  ${lang}: incomplete — not written`); continue; }
    const outDir = path.join(ROOT, 'public/translations', lang);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join(outDir, 'mythology.json'), JSON.stringify({ figures: r.figures, ui: r.ui }, null, 2));
    console.log(`  ${lang} (${LANGUAGES[lang]})… done`);
  }
  console.log('Translation pass complete.');
})();
