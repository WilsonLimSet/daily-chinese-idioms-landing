#!/usr/bin/env node
/**
 * Incremental Listicle Translation Script using Gemini 2.0 Flash
 *
 * Only translates NEW listicles that don't exist in translation files yet.
 * Compares by originalSlug to identify what's missing.
 *
 * Usage:
 *   node scripts/translate-new-listicles.js --dry-run   # Preview what will be translated
 *   node scripts/translate-new-listicles.js              # Run translations
 *   node scripts/translate-new-listicles.js --lang es    # Only translate one language
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

const RATE_LIMIT_MS = 4500; // ~13 RPM to stay safe under 15 RPM free tier
const BATCH_SIZE = 5;
const MAX_RETRIES = 2;

const LANGUAGES = {
  'es': 'Spanish',
  'pt': 'Portuguese',
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'th': 'Thai',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
  'tl': 'Filipino/Tagalog',
  'ms': 'Malay',
  'ru': 'Russian'
};

// Extract listicles from the TypeScript file (reused from translate-listicles.js)
function extractListicles() {
  const filePath = path.join(__dirname, '../src/lib/listicles.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const match = content.match(/export const listicles: Listicle\[\] = \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Could not find listicles array in file');
  }

  const listicles = [];
  const arrayContent = match[1];
  const objectMatches = arrayContent.match(/\{\s*slug:[^}]+idiomIds:[^}]+\}/g);

  if (!objectMatches) {
    throw new Error('Could not parse listicle objects');
  }

  for (const objStr of objectMatches) {
    const listicle = {};

    const slugMatch = objStr.match(/slug:\s*['"]([^'"]+)['"]/);
    const titleMatch = objStr.match(/title:\s*['"]([^'"]+)['"]/);
    const descMatch = objStr.match(/description:\s*['"]([^'"]+)['"]/);
    const metaDescMatch = objStr.match(/metaDescription:\s*['"]([^'"]+)['"]/);
    const introMatch = objStr.match(/intro:\s*['"](.+?)['"]\s*,\s*idiomIds/s);
    const categoryMatch = objStr.match(/category:\s*['"]([^'"]+)['"]/);
    const keywordsMatch = objStr.match(/keywords:\s*\[([^\]]+)\]/);
    const idiomIdsMatch = objStr.match(/idiomIds:\s*\[([^\]]+)\]/);
    const dateMatch = objStr.match(/publishedDate:\s*['"]([^'"]+)['"]/);

    if (slugMatch) listicle.slug = slugMatch[1];
    if (titleMatch) listicle.title = titleMatch[1];
    if (descMatch) listicle.description = descMatch[1];
    if (metaDescMatch) listicle.metaDescription = metaDescMatch[1];
    if (categoryMatch) listicle.category = categoryMatch[1];
    if (dateMatch) listicle.publishedDate = dateMatch[1];

    if (introMatch) {
      listicle.intro = introMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
    }

    if (keywordsMatch) {
      listicle.keywords = keywordsMatch[1]
        .split(',')
        .map(k => k.trim().replace(/['"]/g, ''))
        .filter(k => k);
    }

    if (idiomIdsMatch) {
      listicle.idiomIds = idiomIdsMatch[1]
        .split(',')
        .map(id => id.trim().replace(/['"]/g, ''))
        .filter(id => id);
    }

    if (listicle.slug) {
      listicles.push(listicle);
    }
  }

  return listicles;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(listicles, langCode, langName) {
  const needsRomanization = ['ja', 'ko', 'th', 'hi', 'ar', 'ru'].includes(langCode);
  const slugInstruction = needsRomanization
    ? `Also create "localizedSlug" - a romanized, SEO-friendly URL slug in ${langName} (use Latin characters only, lowercase, hyphens between words, no special characters). Example for Japanese: "bijinesu-chuugokugo-kotowaza"`
    : `Also create "localizedSlug" - an SEO-friendly URL slug translated to ${langName} (lowercase, hyphens between words, no special characters). Example for Spanish: "modismos-chinos-para-negocios"`;

  const items = listicles.map((l, i) =>
    `${i + 1}.
originalSlug: "${l.slug}"
title: "${l.title}"
description: "${l.description}"
metaDescription: "${l.metaDescription}"
intro: "${l.intro}"
category: "${l.category}"
keywords: ${JSON.stringify(l.keywords)}`
  ).join('\n\n');

  const prompt = `Translate to ${langName}. Return JSON array with objects having: localizedSlug, title, description, metaDescription, intro, category, keywords (array).

${slugInstruction}

Keep same order. Preserve meaning and SEO intent. No explanations.

${items}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();

      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        console.error(' Failed to parse JSON response');
        if (attempt < MAX_RETRIES) {
          console.log(`  Retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await sleep(RATE_LIMIT_MS);
          continue;
        }
        return null;
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error(` API error: ${error.message}`);
      if (attempt < MAX_RETRIES) {
        console.log(`  Retrying (${attempt + 1}/${MAX_RETRIES})...`);
        await sleep(RATE_LIMIT_MS);
        continue;
      }
      return null;
    }
  }
  return null;
}

function getNewListicles(allListicles, existingTranslations) {
  const translatedSlugs = new Set(existingTranslations.map(t => t.originalSlug));
  return allListicles.filter(l => !translatedSlugs.has(l.slug));
}

async function translateNewListicles(targetLang) {
  console.log('Incremental Listicle Translation Script');
  console.log('=======================================\n');

  const allListicles = extractListicles();
  console.log(`Found ${allListicles.length} total listicles in source\n`);

  // Filter languages if --lang specified
  const langs = targetLang
    ? { [targetLang]: LANGUAGES[targetLang] }
    : LANGUAGES;

  if (targetLang && !LANGUAGES[targetLang]) {
    console.error(`Unknown language: ${targetLang}`);
    console.error(`Available: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }

  let totalNewCount = 0;
  let totalApiCalls = 0;

  // First pass: report what needs translating
  for (const [langCode, langName] of Object.entries(langs)) {
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/listicles.json`);

    let existing = [];
    if (fs.existsSync(outputPath)) {
      existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }

    const newListicles = getNewListicles(allListicles, existing);
    const batchCount = Math.ceil(newListicles.length / BATCH_SIZE);
    totalNewCount += newListicles.length;
    totalApiCalls += batchCount;

    console.log(`  ${langName} (${langCode}): ${existing.length} existing, ${newListicles.length} new`);
  }

  if (totalNewCount === 0) {
    console.log('\nAll languages are up to date! Nothing to translate.');
    return;
  }

  console.log(`\nTotal new translations needed: ${totalNewCount}`);
  console.log(`API calls: ${totalApiCalls}`);
  console.log(`Estimated time: ~${Math.ceil(totalApiCalls * RATE_LIMIT_MS / 60000)} minutes\n`);

  // Second pass: translate
  for (const [langCode, langName] of Object.entries(langs)) {
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/listicles.json`);

    let existing = [];
    if (fs.existsSync(outputPath)) {
      existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }

    const newListicles = getNewListicles(allListicles, existing);

    if (newListicles.length === 0) {
      console.log(`${langName} (${langCode}): Already up to date (${existing.length})`);
      continue;
    }

    console.log(`\n${langName} (${langCode}) - translating ${newListicles.length} new listicles`);
    console.log('-'.repeat(50));

    const translatedNew = [];

    for (let i = 0; i < newListicles.length; i += BATCH_SIZE) {
      const batch = newListicles.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(newListicles.length / BATCH_SIZE);

      process.stdout.write(`  Batch ${batchNum}/${totalBatches} (${batch.map(b => b.slug.slice(0, 30)).join(', ')})...`);

      const translations = await translateBatch(batch, langCode, langName);

      if (translations && translations.length === batch.length) {
        for (let j = 0; j < batch.length; j++) {
          const original = batch[j];
          const translated = translations[j];

          let localizedSlug = translated.localizedSlug || original.slug;
          localizedSlug = localizedSlug
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

          translatedNew.push({
            slug: localizedSlug,
            originalSlug: original.slug,
            title: translated.title || original.title,
            description: translated.description || original.description,
            metaDescription: translated.metaDescription || original.metaDescription,
            keywords: translated.keywords || original.keywords,
            intro: translated.intro || original.intro,
            idiomIds: original.idiomIds,
            category: translated.category || original.category,
            publishedDate: original.publishedDate
          });
        }
        console.log(' done');
      } else {
        console.log(' FAILED - using English fallback');
        for (const original of batch) {
          translatedNew.push({
            slug: original.slug,
            originalSlug: original.slug,
            title: original.title,
            description: original.description,
            metaDescription: original.metaDescription,
            keywords: original.keywords,
            intro: original.intro,
            idiomIds: original.idiomIds,
            category: original.category,
            publishedDate: original.publishedDate
          });
        }
      }

      await sleep(RATE_LIMIT_MS);
    }

    // Append new translations to existing
    const combined = [...existing, ...translatedNew];
    fs.writeFileSync(outputPath, JSON.stringify(combined, null, 2));
    console.log(`  Saved: ${combined.length} total (${existing.length} existing + ${translatedNew.length} new)`);
  }

  console.log('\n=======================================');
  console.log('Translation complete!');
  console.log('=======================================\n');
  console.log('Verify with:');
  console.log('  for f in public/translations/*/listicles.json; do echo "$f: $(node -e "console.log(require(\\"./$f\\").length)")"; done');
}

async function dryRun(targetLang) {
  console.log('DRY RUN - Preview of what will be translated\n');

  const allListicles = extractListicles();
  console.log(`Found ${allListicles.length} total listicles in source\n`);

  const langs = targetLang
    ? { [targetLang]: LANGUAGES[targetLang] }
    : LANGUAGES;

  if (targetLang && !LANGUAGES[targetLang]) {
    console.error(`Unknown language: ${targetLang}`);
    process.exit(1);
  }

  let totalNew = 0;
  let totalCalls = 0;

  for (const [langCode, langName] of Object.entries(langs)) {
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/listicles.json`);

    let existing = [];
    if (fs.existsSync(outputPath)) {
      existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
    }

    const newListicles = getNewListicles(allListicles, existing);
    const batchCount = Math.ceil(newListicles.length / BATCH_SIZE);
    totalNew += newListicles.length;
    totalCalls += batchCount;

    console.log(`${langName} (${langCode}): ${existing.length} existing, ${newListicles.length} new`);
    if (newListicles.length > 0) {
      for (const l of newListicles) {
        console.log(`    + ${l.slug}`);
      }
    }
  }

  console.log(`\nSummary:`);
  console.log(`  Total new translations: ${totalNew}`);
  console.log(`  API calls needed: ${totalCalls}`);
  console.log(`  Estimated time: ~${Math.ceil(totalCalls * RATE_LIMIT_MS / 60000)} minutes`);
  console.log(`  Estimated cost: ~$0.01-0.03 (Gemini 2.0 Flash)`);
  console.log('\nRun without --dry-run to start translation.');
}

// Parse CLI args
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const langIdx = args.indexOf('--lang');
const targetLang = langIdx !== -1 ? args[langIdx + 1] : null;

if (isDryRun) {
  dryRun(targetLang);
} else {
  translateNewListicles(targetLang).catch(console.error);
}
