#!/usr/bin/env node
/**
 * Translate newly-added keys in src/lib/translations.ts into 13 languages
 * and inject them into each language block.
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

const KEYS = {
  festivalsFaqTitle: "Frequently Asked Questions",
  festivalsFaqQ1: "What are the most important Chinese festivals?",
  festivalsFaqA1: "Spring Festival is the most important, followed by Mid-Autumn Festival. Dragon Boat, Qingming, and Lantern Festival complete the \"big five.\"",
  festivalsFaqQ2: "How are festival dates determined?",
  festivalsFaqA2: "Most follow the lunisolar calendar, shifting yearly. Qingming (~April 4-5) and Winter Solstice (~December 21-22) are solar-term exceptions.",
  festivalsFaqQ3: "What connects festivals and idioms?",
  festivalsFaqA3: "Many idioms originated from festival legends — loyalty idioms tie to Dragon Boat, reunion idioms to Mid-Autumn. Using the right one shows cultural fluency.",
  festivalsFaqQ4: "Do Chinese people celebrate Western holidays?",
  festivalsFaqA4: "Valentine's Day, Christmas, and Halloween are popular in cities among younger generations, but traditional festivals remain primary for family gatherings.",
  charactersHeroDesc: "Explore {count}+ Chinese characters that appear in our collection of 1000+ idioms (chengyu).",
  charactersDetailTitle: "Chinese Idioms Containing \"{char}\"",
  charactersDetailCount: "{count} idioms featuring this character",
  charactersDetailCountSingular: "{count} idiom featuring this character",
  poetsDynastyMasters: "Tang Dynasty Masters",
  hskFaqQ1: "What is the HSK test?",
  hskFaqA1: "HSK (Hanyu Shuiping Kaoshi) is China's standardized test of Chinese language proficiency for non-native speakers. It has 6 levels, from HSK 1 (beginner, ~150 words) to HSK 6 (advanced, ~5000 words).",
  hskFaqQ2: "How many HSK levels are there?",
  hskFaqA2: "There are 6 HSK levels. HSK 1-2 are beginner (CEFR A1-A2), HSK 3-4 are intermediate (B1-B2), and HSK 5-6 are advanced (C1-C2).",
  hskSchemaItemListName: "HSK {level} Vocabulary",
  slangCollectionName: "Chinese Internet Slang",
  phrasesCollectionName: "Common Chinese Phrases",
};

function buildPrompt(langName) {
  return `Translate the following English UI strings into natural, idiomatic ${langName} for a Chinese-learning website. Return ONLY a JSON object with exactly the same keys, mapping to translated values.

Rules:
- Preserve placeholders {count} and {lang} verbatim.
- Category labels should read as natural section headings in ${langName}.
- "poems" is a short plural noun following a number; translate naturally.
- No markdown.

Source (JSON):
${JSON.stringify(KEYS, null, 2)}

Return the translated JSON now.`;
}

async function translateFor(langName) {
  const r = await openai.chat.completions.create({
    model: 'gpt-4o',
    response_format: { type: 'json_object' },
    messages: [{ role: 'user', content: buildPrompt(langName) }],
  });
  const parsed = JSON.parse(r.choices[0].message.content);
  for (const k of Object.keys(KEYS)) {
    if (typeof parsed[k] !== 'string') {
      throw new Error(`Missing or invalid key: ${k}`);
    }
  }
  return parsed;
}

function formatBlock(translations) {
  const lines = Object.entries(KEYS).map(([k]) => {
    const v = translations[k].replace(/"/g, '\\"');
    return `    ${k}: "${v}",`;
  });
  return lines.join('\n');
}

async function main() {
  const tsPath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');
  let source = fs.readFileSync(tsPath, 'utf8');

  console.log(`Translating ${Object.keys(KEYS).length} keys into ${Object.keys(LANGS).length} languages...`);

  for (const [code, name] of Object.entries(LANGS)) {
    process.stdout.write(`-> ${code} (${name})... `);
    try {
      const translations = await translateFor(name);
      const block = formatBlock(translations);

      const langMarker = '\n  ' + code + ': {\n';
      const startIdx = source.indexOf(langMarker);
      if (startIdx < 0) throw new Error('language block not found: ' + code);
      const afterStart = startIdx + langMarker.length;

      const closeRel = source.slice(afterStart).indexOf('\n  },');
      if (closeRel < 0) throw new Error('closing brace not found: ' + code);
      const closeIdx = afterStart + closeRel;

      const before = source.slice(0, closeIdx);
      const after = source.slice(closeIdx);

      // Idempotency: skip if this run's first key is already present in the
      // language block.
      const sentinelKey = Object.keys(KEYS)[0];
      if (before.includes(sentinelKey) && before.lastIndexOf(sentinelKey) > afterStart) {
        console.log('already present, skipping');
        continue;
      }

      source = before + '\n' + block + after;
      console.log('done');
    } catch (err) {
      console.log('FAILED: ' + err.message);
    }
  }

  fs.writeFileSync(tsPath, source, 'utf8');
  console.log('\ntranslations.ts written.');
}

main();
