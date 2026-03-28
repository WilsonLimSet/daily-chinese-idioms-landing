#!/usr/bin/env node
/**
 * Re-translate meta fields (title, description, metaDescription) for specific listicles
 * that have been updated in English.
 *
 * Usage:
 *   node scripts/retranslate-listicle-metas.js --dry-run
 *   node scripts/retranslate-listicle-metas.js
 *   node scripts/retranslate-listicle-metas.js --lang ja
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  }
});

const RATE_LIMIT_MS = 4500;
const MAX_RETRIES = 2;

const LANGUAGES = {
  'es': 'Spanish', 'pt': 'Portuguese', 'id': 'Indonesian',
  'vi': 'Vietnamese', 'ja': 'Japanese', 'ko': 'Korean',
  'th': 'Thai', 'hi': 'Hindi', 'ar': 'Arabic',
  'fr': 'French', 'tl': 'Filipino/Tagalog', 'ms': 'Malay', 'ru': 'Russian'
};

// Slugs whose title/description/metaDescription were updated in English
const UPDATED_SLUGS = [
  'chinese-idioms-about-love',
  'chinese-idioms-about-hard-work',
  'year-of-the-horse-idioms-2026',
  'chinese-beauty-idioms-four-beauties',
  'chinese-idioms-with-horse',
  'chinese-idioms-for-new-baby',
  'chinese-idioms-about-happiness',
  'chinese-idioms-about-honesty',
  'chinese-idioms-about-health',
  'chinese-idioms-about-aging',
  'chinese-idioms-about-war-battle',
  'ancient-chinese-proverbs-about-life',
  'best-chinese-proverbs-with-meanings',
  'chinese-proverbs-about-strength',
  'chinese-sayings-about-patience',
  'chinese-quotes-for-motivation',
  'chinese-quotes-about-happiness',
];

function extractListicles() {
  const filePath = path.join(__dirname, '../src/lib/listicles.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const match = content.match(/export const listicles: Listicle\[\] = \[([\s\S]*?)\];/);
  if (!match) throw new Error('Could not find listicles array');

  const listicles = [];
  const arrayContent = match[1];
  const objectMatches = arrayContent.match(/\{\s*slug:[^}]+idiomIds:[^}]+\}/g);
  if (!objectMatches) throw new Error('Could not parse listicle objects');

  for (const objStr of objectMatches) {
    const slugMatch = objStr.match(/slug:\s*['"]([^'"]+)['"]/);
    const titleMatch = objStr.match(/title:\s*['"]([^'"]+)['"]/);
    const descMatch = objStr.match(/description:\s*['"]([^'"]+)['"]/);
    const metaDescMatch = objStr.match(/metaDescription:\s*['"]([^'"]+)['"]/);

    if (slugMatch) {
      listicles.push({
        slug: slugMatch[1],
        title: titleMatch ? titleMatch[1] : '',
        description: descMatch ? descMatch[1] : '',
        metaDescription: metaDescMatch ? metaDescMatch[1].replace(/\\'/g, "'") : '',
      });
    }
  }
  return listicles;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateMetas(items, langCode, langName) {
  const entries = items.map((l, i) =>
    `${i + 1}. originalSlug: "${l.slug}"
   title: "${l.title}"
   description: "${l.description}"
   metaDescription: "${l.metaDescription}"`
  ).join('\n\n');

  const prompt = `Translate only the title, description, and metaDescription fields to ${langName}.
Return a JSON array with objects: { "originalSlug": "...", "title": "...", "description": "...", "metaDescription": "..." }

Keep the originalSlug unchanged (English). Preserve SEO intent and emotional hooks. Keep Chinese characters (like 马到成功, 闭月羞花) as-is in the translations. No explanations, just JSON.

${entries}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error('  Failed to parse JSON response');
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        return null;
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error(`  API error: ${error.message}`);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
      return null;
    }
  }
  return null;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const langIdx = args.indexOf('--lang');
  const targetLang = langIdx !== -1 ? args[langIdx + 1] : null;

  console.log('Re-translate Listicle Metas');
  console.log('==========================\n');

  const allListicles = extractListicles();
  const updatedListicles = allListicles.filter(l => UPDATED_SLUGS.includes(l.slug));

  console.log(`Found ${updatedListicles.length} listicles to re-translate metas for:\n`);
  for (const l of updatedListicles) {
    console.log(`  - ${l.slug}`);
    console.log(`    title: ${l.title}`);
    console.log(`    meta:  ${l.metaDescription.substring(0, 80)}...`);
  }

  if (updatedListicles.length === 0) {
    console.log('No matching listicles found!');
    return;
  }

  const langs = targetLang ? { [targetLang]: LANGUAGES[targetLang] } : LANGUAGES;

  if (targetLang && !LANGUAGES[targetLang]) {
    console.error(`Unknown language: ${targetLang}. Available: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }

  const batchesPerLang = Math.ceil(updatedListicles.length / 5);
  console.log(`\nLanguages: ${Object.keys(langs).length}`);
  console.log(`API calls: ~${Object.keys(langs).length * batchesPerLang}`);
  console.log(`Estimated time: ~${Math.ceil(Object.keys(langs).length * batchesPerLang * RATE_LIMIT_MS / 60000)} minutes\n`);

  if (dryRun) {
    console.log('DRY RUN — no changes made.');
    return;
  }

  for (const [langCode, langName] of Object.entries(langs)) {
    const filePath = path.join(__dirname, `../public/translations/${langCode}/listicles.json`);

    if (!fs.existsSync(filePath)) {
      console.log(`${langName} (${langCode}): No translation file found, skipping`);
      continue;
    }

    const existing = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`\n${langName} (${langCode}) — updating ${updatedListicles.length} metas (${existing.length} total entries)`);

    // Translate in batches of 5
    const allTranslated = [];
    for (let i = 0; i < updatedListicles.length; i += 5) {
      const batch = updatedListicles.slice(i, i + 5);
      const batchNum = Math.floor(i / 5) + 1;
      const totalBatches = Math.ceil(updatedListicles.length / 5);

      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.map(l => l.slug.substring(0, 25)).join(', ')})...`);

      const translated = await translateMetas(batch, langCode, langName);
      if (translated) {
        allTranslated.push(...translated);
        console.log(` ✓ ${translated.length} translated`);
      } else {
        console.log(' ✗ FAILED');
      }

      if (i + 5 < updatedListicles.length) {
        await sleep(RATE_LIMIT_MS);
      }
    }

    // Merge: update only title, description, metaDescription for matching originalSlugs
    let updatedCount = 0;
    for (const translated of allTranslated) {
      const idx = existing.findIndex(e => e.originalSlug === translated.originalSlug);
      if (idx !== -1) {
        existing[idx].title = translated.title;
        existing[idx].description = translated.description;
        existing[idx].metaDescription = translated.metaDescription;
        updatedCount++;
      } else {
        console.log(`  Warning: No existing entry for originalSlug "${translated.originalSlug}"`);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n', 'utf-8');
    console.log(`  Saved: ${updatedCount} entries updated in ${filePath}`);
  }

  console.log('\nDone!');
}

main().catch(console.error);
