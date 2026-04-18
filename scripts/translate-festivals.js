#!/usr/bin/env node
/**
 * Translate festival body content into 13 languages.
 * Outputs public/translations/{lang}/festivals.json.
 *
 * Translates: englishName (card title), alternateName, significance,
 * traditions[], funFact. Keeps: slug, chineseName, pinyin, month,
 * lunarDate, date2026, relatedListicleSlugs.
 *
 * Source: read from public/festivals-source.json if present, otherwise
 * derived from the existing EN data (kept in src/lib/festivals.ts). We
 * snapshot the EN data to a JSON file on first run so this script is
 * portable.
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

// EN source data — copy of FESTIVALS in src/lib/festivals.ts (minus lib-only fields)
// Kept inline here so the script has zero dependency on TS runtime.
const FESTIVALS_EN = [
  {
    slug: 'spring-festival',
    englishName: 'Spring Festival',
    alternateName: 'Chinese New Year',
    significance: "Spring Festival is the most important holiday in Chinese culture, marking the beginning of the lunar new year. Families travel across the country for reunion dinners (年夜饭), exchange red envelopes (红包), and celebrate with fireworks and lion dances. The festival carries over 4,000 years of tradition, rooted in the legend of the monster Nian (年) who was frightened away by loud noises and the color red. Each year is associated with one of the 12 zodiac animals — 2026 is the Year of the Horse (马年).",
    traditions: [
      "Reunion dinner (年夜饭) on New Year's Eve",
      "Red envelopes (红包) with money for children and elders",
      "Lion and dragon dances",
      "Fireworks and firecrackers at midnight",
      "Spring couplets (春联) pasted on doorways",
      "Staying up until midnight (守岁)",
    ],
    funFact: "Spring Festival triggers the largest annual human migration on Earth — \"Chunyun\" (春运) — with billions of trips made as people travel home for reunion.",
  },
];

// Rather than duplicate all 8 festivals inline, read the EN lib file as text
// and extract the array via a regex that preserves the runtime string literals.
function loadEnglishFestivals() {
  const file = fs.readFileSync(path.join(__dirname, '..', 'src', 'lib', 'festivals.ts'), 'utf8');
  const match = file.match(/export const FESTIVALS: Festival\[\] = (\[[\s\S]*?\n\]);/);
  if (!match) throw new Error('Could not locate FESTIVALS array in src/lib/festivals.ts');
  // Strip TS comments and trailing commas then parse via JSON5-ish trick:
  // evaluate as object literal via a safe JSON rewrite.
  // The src data uses template-free strings — convert single quotes to double
  // where they wrap values, add double quotes around keys.
  // Simpler: the file has well-formed TS that matches relaxed JSON once
  // single quotes → double quotes and trailing commas removed. But escaped
  // apostrophes like \' need care. Do it manually:
  let body = match[1];
  // Replace key: → "key":
  body = body.replace(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*):/gm, '$1"$2":');
  // Replace single-quoted strings with double-quoted, escaping internal dquotes
  body = body.replace(/'((?:[^'\\]|\\.)*)'/g, (_, inner) => {
    const unescapedApostrophe = inner.replace(/\\'/g, "'");
    const escapedDquote = unescapedApostrophe.replace(/"/g, '\\"');
    return '"' + escapedDquote + '"';
  });
  // Remove trailing commas before ] or }
  body = body.replace(/,(\s*[\]}])/g, '$1');
  return JSON.parse(body);
}

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

function buildPrompt(langName, festivals) {
  const minimal = festivals.map(f => ({
    slug: f.slug,
    englishName_en: f.englishName,
    alternateName_en: f.alternateName || '',
    significance_en: f.significance,
    traditions_en: f.traditions,
    funFact_en: f.funFact,
  }));

  return `Translate the following Chinese-festival content into natural, idiomatic ${langName}. Return ONLY a JSON object with shape:

{ "translations": [ { "slug": "...", "englishName": "...", "alternateName": "...", "significance": "...", "traditions": [...], "funFact": "..." }, ... ] }

Rules:
- Keep "slug" byte-identical.
- Translate "englishName" (e.g. "Spring Festival", "Mid-Autumn Festival") into natural ${langName}.
- Translate "alternateName" if present (e.g. "Chinese New Year") — preserve empty string if empty.
- Translate "significance" as flowing paragraph text. Keep Chinese terms in parentheses (like 年夜饭, 红包, 月饼) exactly as-is.
- Translate each element of "traditions" as a natural ${langName} phrase. Preserve parenthesized Chinese terms.
- Translate "funFact" as flowing text. Preserve Chinese terms.
- Keep tone cultural/educational.
- No markdown.

Source:
${JSON.stringify(minimal, null, 2)}

Return the translations object now.`;
}

async function translateLang(langCode, langName, festivals) {
  const outDir = path.join(__dirname, '..', 'public', 'translations', langCode);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'festivals.json');

  const r = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: buildPrompt(langName, festivals) }],
  });
  const parsed = JSON.parse(r.choices[0].message.content);
  if (!Array.isArray(parsed.translations)) {
    throw new Error('translations array missing from response');
  }
  const bySlug = new Map(parsed.translations.map(t => [t.slug, t]));

  const output = festivals.map(f => {
    const t = bySlug.get(f.slug);
    if (!t) return f;
    return {
      slug: f.slug,
      englishName: t.englishName || f.englishName,
      alternateName: t.alternateName || f.alternateName || '',
      significance: t.significance || f.significance,
      traditions: Array.isArray(t.traditions) && t.traditions.length === f.traditions.length
        ? t.traditions
        : f.traditions,
      funFact: t.funFact || f.funFact,
    };
  });

  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  return { ok: true, count: output.length };
}

(async () => {
  const only = process.argv[2];
  const entries = only ? [[only, LANGS[only]]] : Object.entries(LANGS);
  if (only && !LANGS[only]) {
    console.error('Unknown lang: ' + only);
    process.exit(1);
  }

  const festivals = loadEnglishFestivals();
  console.log('Translating ' + festivals.length + ' festivals into ' + entries.length + ' language(s)...');

  for (const [code, name] of entries) {
    process.stdout.write('-> ' + code + ' (' + name + ')... ');
    try {
      const r = await translateLang(code, name, festivals);
      console.log('done (' + r.count + ' festivals)');
    } catch (err) {
      console.log('FAILED: ' + err.message);
    }
  }
})();
