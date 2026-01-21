#!/usr/bin/env node
/**
 * SUPER OPTIMIZED Batch Translation Script
 *
 * Optimizations:
 * 1. Batches 25 idioms per API call (300 idioms = 12 calls per language)
 * 2. Uses Gemini 2.0 Flash (cheapest model)
 * 3. Minimal prompt tokens
 * 4. JSON structured output for reliable parsing
 * 5. Resume capability - saves progress after each batch
 * 6. Rate limiting to stay in free tier (15 RPM)
 * 7. Processes one language at a time to maximize batching
 *
 * Cost estimate: ~$0.10-0.15 for all 300 idioms × 13 languages
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-exp',
  generationConfig: {
    temperature: 0.1, // Low for consistent translations
    maxOutputTokens: 8192,
  }
});

const BATCH_SIZE = 25; // Sweet spot: good batching without hitting token limits
const RATE_LIMIT_MS = 4500; // ~13 RPM to stay safe under 15 RPM free tier

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

const PROGRESS_FILE = path.join(__dirname, '../.translation-progress.json');

function loadProgress() {
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
  } catch {
    return { completedBatches: {} };
  }
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateBatch(idioms, langCode, langName) {
  // Build minimal prompt - only translate the 4 text fields
  const items = idioms.map((idiom, i) =>
    `${i + 1}. meaning: "${idiom.meaning}"
   metaphoric: "${idiom.metaphoric_meaning}"
   desc: "${idiom.description}"
   example: "${idiom.example}"`
  ).join('\n\n');

  const prompt = `Translate to ${langName}. Return JSON array with objects having: meaning, metaphoric, desc, example. Keep same order. No explanations.

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

async function syncAndTranslate() {
  console.log('🚀 OPTIMIZED BATCH TRANSLATION');
  console.log('================================\n');

  // Load master idioms
  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  // Find new idioms (ID382+)
  const newIdioms = masterIdioms.filter(i => {
    const idNum = parseInt(i.id.replace('ID', ''));
    return idNum > 381;
  });

  console.log(`📊 Found ${newIdioms.length} new idioms to translate (ID382-ID${381 + newIdioms.length})`);
  console.log(`📦 Batch size: ${BATCH_SIZE} idioms per API call`);
  console.log(`🌍 Languages: ${Object.keys(LANGUAGES).length}`);

  const totalBatches = Math.ceil(newIdioms.length / BATCH_SIZE) * Object.keys(LANGUAGES).length;
  console.log(`📡 Total API calls needed: ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes\n`);

  const progress = loadProgress();
  let completedBatches = 0;
  let totalTokensEstimate = 0;

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    console.log(`\n🌐 ${langName} (${langCode})`);
    console.log('─'.repeat(40));

    const langPath = path.join(__dirname, `../public/translations/${langCode}/idioms.json`);
    let langIdioms = [];

    try {
      langIdioms = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    } catch {
      console.log(`  ⚠️  Creating new translation file`);
    }

    // Create lookup for existing idioms
    const existingIds = new Set(langIdioms.map(i => i.id));

    // Find idioms that need to be added/translated
    const idiomsToTranslate = newIdioms.filter(i => !existingIds.has(i.id));

    if (idiomsToTranslate.length === 0) {
      console.log(`  ✅ Already complete (${langIdioms.length} idioms)`);
      continue;
    }

    console.log(`  📝 ${idiomsToTranslate.length} idioms to translate`);

    // Process in batches
    for (let i = 0; i < idiomsToTranslate.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const batchKey = `${langCode}-batch${batchNum}`;

      // Skip if already done
      if (progress.completedBatches[batchKey]) {
        console.log(`  ⏭️  Batch ${batchNum} already done`);
        completedBatches++;
        continue;
      }

      const batch = idiomsToTranslate.slice(i, i + BATCH_SIZE);
      process.stdout.write(`  🔄 Batch ${batchNum}/${Math.ceil(idiomsToTranslate.length / BATCH_SIZE)} (${batch.length} idioms)...`);

      const translations = await translateBatch(batch, langCode, langName);

      if (translations && translations.length === batch.length) {
        // Merge translations with original idiom data
        for (let j = 0; j < batch.length; j++) {
          const original = batch[j];
          const translated = translations[j];

          langIdioms.push({
            id: original.id,
            characters: original.characters,
            pinyin: original.pinyin,
            meaning: translated.meaning || original.meaning,
            metaphoric_meaning: translated.metaphoric || original.metaphoric_meaning,
            description: translated.desc || original.description,
            example: translated.example || original.example,
            chineseExample: original.chineseExample,
            theme: original.theme
          });
        }

        // Save after each batch
        fs.writeFileSync(langPath, JSON.stringify(langIdioms, null, 2));

        progress.completedBatches[batchKey] = true;
        saveProgress(progress);

        console.log(' ✅');
        completedBatches++;
        totalTokensEstimate += batch.length * 200; // Rough estimate
      } else {
        console.log(' ❌ Failed, will retry next run');
      }

      // Rate limiting
      await sleep(RATE_LIMIT_MS);
    }

    console.log(`  ✅ ${langName} complete: ${langIdioms.length} total idioms`);
  }

  // Cleanup progress file when done
  if (completedBatches === totalBatches) {
    fs.unlinkSync(PROGRESS_FILE);
  }

  console.log('\n================================');
  console.log('📊 SUMMARY');
  console.log('================================');
  console.log(`✅ Completed batches: ${completedBatches}/${totalBatches}`);
  console.log(`💰 Estimated tokens used: ~${(totalTokensEstimate / 1000).toFixed(0)}K`);
  console.log(`💵 Estimated cost: ~$${(totalTokensEstimate * 0.0000004).toFixed(3)}`);
  console.log('\n🎉 Done! Run "node scripts/check-translation-status.js" to verify.');
}

// Dry run mode to estimate without spending
async function dryRun() {
  console.log('🔍 DRY RUN - Estimating costs without API calls\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
  const newIdioms = masterIdioms.filter(i => parseInt(i.id.replace('ID', '')) > 381);

  const totalBatches = Math.ceil(newIdioms.length / BATCH_SIZE) * Object.keys(LANGUAGES).length;
  const estimatedInputTokens = newIdioms.length * 13 * 150; // ~150 tokens per idiom input
  const estimatedOutputTokens = newIdioms.length * 13 * 120; // ~120 tokens per idiom output

  console.log('📊 Translation Estimate:');
  console.log(`   Idioms: ${newIdioms.length}`);
  console.log(`   Languages: ${Object.keys(LANGUAGES).length}`);
  console.log(`   Total translations: ${newIdioms.length * 13}`);
  console.log(`   API calls (batched): ${totalBatches}`);
  console.log('');
  console.log('💰 Cost Estimate (Gemini 2.0 Flash):');
  console.log(`   Input tokens: ~${(estimatedInputTokens / 1000).toFixed(0)}K`);
  console.log(`   Output tokens: ~${(estimatedOutputTokens / 1000).toFixed(0)}K`);
  console.log(`   Input cost: $${(estimatedInputTokens * 0.0000001).toFixed(4)}`);
  console.log(`   Output cost: $${(estimatedOutputTokens * 0.0000004).toFixed(4)}`);
  console.log(`   TOTAL: ~$${((estimatedInputTokens * 0.0000001) + (estimatedOutputTokens * 0.0000004)).toFixed(3)}`);
  console.log('');
  console.log('⏱️  Time Estimate:');
  console.log(`   At 13 RPM: ~${Math.ceil(totalBatches / 13)} minutes`);
  console.log('');
  console.log('Run without --dry-run to start translation.');
}

// Main
const args = process.argv.slice(2);
if (args.includes('--dry-run')) {
  dryRun();
} else {
  syncAndTranslate().catch(console.error);
}
