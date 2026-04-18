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
  poemsHubSubtitle: "{count} iconic poems with translations in {lang}.",
  poemsCount: "poems",
  phraseCategoryRestaurantFood: "Restaurant & Food",
  phraseCategoryShoppingBargaining: "Shopping & Bargaining",
  phraseCategoryGettingAround: "Getting Around",
  phraseCategoryMakingPlansSocializing: "Making Plans & Socializing",
  phraseCategoryReactionsOpinions: "Reactions & Opinions",
  phraseCategoryWorkProfessional: "Work & Professional",
  phraseCategoryEmergenciesHelp: "Emergencies & Help",
  phraseCategoryDailyLifeFeelings: "Daily Life & Feelings",
  slangCategoryWorkHustle: "Work & Hustle",
  slangCategoryAttitudeLifestyle: "Attitude & Lifestyle",
  slangCategorySocialRelationships: "Social & Relationships",
  slangCategoryInternetCulture: "Internet Culture",
  slangCategoryEmotionsReactions: "Emotions & Reactions",
  slangCategoryYouthCulture: "Youth Culture",
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

      if (before.includes('poemsHubSubtitle') && before.lastIndexOf('poemsHubSubtitle') > afterStart) {
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
