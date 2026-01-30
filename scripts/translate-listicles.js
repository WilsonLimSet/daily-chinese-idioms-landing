#!/usr/bin/env node
/**
 * Listicle Translation Script using Gemini 2.0 Flash
 *
 * Translates all listicle content (title, description, metaDescription,
 * keywords, intro, category) to all supported languages.
 *
 * Uses batching and rate limiting to stay within free tier.
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
const BATCH_SIZE = 5; // Listicles are larger, so smaller batches

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

// Extract listicles from the TypeScript file
function extractListicles() {
  const filePath = path.join(__dirname, '../src/lib/listicles.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Find the array content between the brackets
  const match = content.match(/export const listicles: Listicle\[\] = \[([\s\S]*?)\];/);
  if (!match) {
    throw new Error('Could not find listicles array in file');
  }

  // Parse the array - we'll use a simple approach
  const listicles = [];
  const arrayContent = match[1];

  // Split by opening braces of objects (but not nested ones)
  const objectMatches = arrayContent.match(/\{\s*slug:[^}]+idiomIds:[^}]+\}/g);

  if (!objectMatches) {
    throw new Error('Could not parse listicle objects');
  }

  for (const objStr of objectMatches) {
    const listicle = {};

    // Extract each field
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

    // Parse intro (may contain escaped quotes)
    if (introMatch) {
      listicle.intro = introMatch[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
    }

    // Parse keywords array
    if (keywordsMatch) {
      listicle.keywords = keywordsMatch[1]
        .split(',')
        .map(k => k.trim().replace(/['"]/g, ''))
        .filter(k => k);
    }

    // Parse idiomIds array
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
  // For non-Latin scripts, request romanized slugs
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

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Extract JSON from response
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.error('Failed to parse JSON response');
      return null;
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`API error: ${error.message}`);
    return null;
  }
}

async function translateListicles() {
  console.log('🎯 LISTICLE TRANSLATION SCRIPT');
  console.log('================================\n');

  // Extract listicles from source
  const listicles = extractListicles();
  console.log(`📚 Found ${listicles.length} listicles to translate`);
  console.log(`🌍 Languages: ${Object.keys(LANGUAGES).length}`);
  console.log(`📦 Batch size: ${BATCH_SIZE} listicles per API call`);

  const totalBatches = Math.ceil(listicles.length / BATCH_SIZE) * Object.keys(LANGUAGES).length;
  console.log(`📡 Total API calls needed: ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes\n`);

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    console.log(`\n🌐 ${langName} (${langCode})`);
    console.log('─'.repeat(40));

    const outputPath = path.join(__dirname, `../public/translations/${langCode}/listicles.json`);

    // Check if already exists with localized slugs
    if (fs.existsSync(outputPath)) {
      const existing = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      // Check if first item has originalSlug field (new format with localized slugs)
      if (existing.length === listicles.length && existing[0]?.originalSlug) {
        console.log(`  ✅ Already complete with localized slugs (${existing.length} listicles)`);
        continue;
      }
      console.log(`  🔄 Re-translating to add localized slugs...`);
    }

    const translatedListicles = [];

    // Process in batches
    for (let i = 0; i < listicles.length; i += BATCH_SIZE) {
      const batch = listicles.slice(i, i + BATCH_SIZE);
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const totalBatchesForLang = Math.ceil(listicles.length / BATCH_SIZE);

      process.stdout.write(`  🔄 Batch ${batchNum}/${totalBatchesForLang} (${batch.length} listicles)...`);

      const translations = await translateBatch(batch, langCode, langName);

      if (translations && translations.length === batch.length) {
        // Merge translations with original data (keep slug as originalSlug, idiomIds, publishedDate)
        for (let j = 0; j < batch.length; j++) {
          const original = batch[j];
          const translated = translations[j];

          // Ensure localizedSlug is valid (lowercase, hyphens, no special chars)
          let localizedSlug = translated.localizedSlug || original.slug;
          localizedSlug = localizedSlug
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

          translatedListicles.push({
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
        console.log(' ✅');
      } else {
        console.log(' ❌ Failed');
        // Add originals as fallback with originalSlug field
        for (const original of batch) {
          translatedListicles.push({
            ...original,
            originalSlug: original.slug
          });
        }
      }

      // Rate limiting
      await sleep(RATE_LIMIT_MS);
    }

    // Save translations
    fs.writeFileSync(outputPath, JSON.stringify(translatedListicles, null, 2));
    console.log(`  💾 Saved: ${outputPath}`);
  }

  console.log('\n================================');
  console.log('🎉 TRANSLATION COMPLETE!');
  console.log('================================\n');
  console.log('Next steps:');
  console.log('1. Update src/lib/listicles.ts to load translations');
  console.log('2. Or create a getTranslatedListicles() function');
}

// Dry run mode
async function dryRun() {
  console.log('🔍 DRY RUN - Checking content without API calls\n');

  const listicles = extractListicles();

  console.log(`📚 Found ${listicles.length} listicles:\n`);

  let totalChars = 0;
  for (const l of listicles) {
    const chars = (l.title?.length || 0) +
                  (l.description?.length || 0) +
                  (l.metaDescription?.length || 0) +
                  (l.intro?.length || 0) +
                  (l.category?.length || 0) +
                  (l.keywords?.join(' ').length || 0);
    totalChars += chars;
    console.log(`  - ${l.slug} (~${chars} chars)`);
  }

  console.log(`\n📊 Total characters per language: ~${totalChars}`);
  console.log(`📊 Total for all 13 languages: ~${totalChars * 13}`);
  console.log(`\n💰 Estimated cost (Gemini 2.0 Flash): ~$0.02-0.05`);
  console.log(`⏱️  Estimated time: ~${Math.ceil(listicles.length / BATCH_SIZE * 13 * RATE_LIMIT_MS / 60000)} minutes`);
  console.log('\nRun without --dry-run to start translation.');
}

// Main
const args = process.argv.slice(2);
if (args.includes('--dry-run')) {
  dryRun();
} else {
  translateListicles().catch(console.error);
}
