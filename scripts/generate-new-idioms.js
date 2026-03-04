#!/usr/bin/env node
/**
 * Generate New Idiom Entries
 *
 * Takes a hardcoded seed list of ~120 verified chengyu (characters + pinyin)
 * not in idioms.json. Uses OpenAI GPT-4o-mini to fill in remaining fields.
 * IDs start at ID683.
 *
 * Usage:
 *   node scripts/generate-new-idioms.js              # Generate all
 *   node scripts/generate-new-idioms.js --dry-run     # Estimate without API calls
 *   node scripts/generate-new-idioms.js --batch 1     # Run specific batch only
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BATCH_SIZE = 5; // Smaller batches since output per idiom is large
const RATE_LIMIT_MS = 1500;
const PROGRESS_FILE = path.join(__dirname, '../.generate-progress.json');

// Load seed list from JSON file
const SEED_IDIOMS = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/new-seeds-230.json'), 'utf-8'));

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

async function generateBatch(seedIdioms, startId) {
  const items = seedIdioms.map((idiom, i) =>
    `${i + 1}. Characters: ${idiom.characters}
   Pinyin: ${idiom.pinyin}
   Theme: ${idiom.theme}`
  ).join('\n\n');

  const prompt = `You are a Chinese language expert. For each chengyu below, generate accurate, detailed entry data matching EXACTLY this style:

EXAMPLE ENTRY (for 一鸣惊人):
{
  "meaning": "Bird cry that startles all",
  "example": "After years of quiet preparation, his novel became an overnight sensation",
  "chineseExample": "经过多年默默准备，他的小说一夜成名",
  "chineseExample_tr": "經過多年默默準備，他的小說一夜成名",
  "description": "This idiom emerged during the Han Dynasty in scholarly discourse about late-blooming talent. The image of a seemingly ordinary bird (鸣, cry) suddenly producing an extraordinary song that startles (惊) everyone (人) was inspired by the story of a rural scholar who, after years of obscurity, stunned the imperial court with his brilliance. The metaphor draws from ancient Chinese ornithology, where certain birds were known to remain silent for long periods before producing remarkably beautiful songs. In imperial examination culture, it became associated with candidates who achieved unexpected success. Modern usage extends to any dramatic debut or breakthrough - from artists releasing career-defining works to researchers making groundbreaking discoveries. It captures the universal experience of hidden potential suddenly revealed.",
  "description_tr": "This idiom emerged during the Han Dynasty in scholarly discourse about late-blooming talent. The image of a seemingly ordinary bird (鳴, cry) suddenly producing an extraordinary song that startles (驚) everyone (人) was inspired by the story of a rural scholar who, after years of obscurity, stunned the imperial court with his brilliance. The metaphor draws from ancient Chinese ornithology, where certain birds were known to remain silent for long periods before producing remarkably beautiful songs. In imperial examination culture, it became associated with candidates who achieved unexpected success. Modern usage extends to any dramatic debut or breakthrough - from artists releasing career-defining works to researchers making groundbreaking discoveries. It captures the universal experience of hidden potential suddenly revealed.",
  "metaphoric_meaning": "Sudden, remarkable success",
  "traditionalCharacters": "一鳴驚人"
}

STYLE RULES:
- "meaning": Short poetic LITERAL translation, 5-8 words (e.g. "Water drops pierce stone", NOT "Persistence pays off")
- "example": Natural English sentence WITHOUT quotes, showing the metaphoric meaning in a real-world context
- "chineseExample": Natural Chinese sentence (simplified) that uses the idiom
- "description": ~130 words, English prose. Include Chinese characters in parentheses with English gloss like (鸣, cry). Cover: origin (cite real source text/dynasty) → character breakdown → cultural significance → modern usage. Do NOT fabricate origins.
- "description_tr": SAME text as description but swap simplified chars in parentheses for traditional chars, e.g. (鳴, cry) instead of (鸣, cry)
- "metaphoric_meaning": 2-4 word English metaphoric meaning
- "traditionalCharacters": The idiom in traditional Chinese

IMPORTANT: Be factually accurate. Only cite real historical sources, correct dynasties, and verified origins.

Return a JSON object with a "results" key containing an array.

${items}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0].message.content.trim();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : (parsed.results || parsed.data || Object.values(parsed)[0]);
  } catch (error) {
    console.error(`API error: ${error.message}`);
    return null;
  }
}

async function runGeneration(specificBatch = null) {
  console.log('🔨 NEW IDIOM GENERATOR');
  console.log('======================\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
  const existingChars = new Set(masterIdioms.map(i => i.characters));

  // Dedup: filter out any seed idioms already in the database
  const newSeeds = SEED_IDIOMS.filter(s => !existingChars.has(s.characters));
  const dupes = SEED_IDIOMS.length - newSeeds.length;

  if (dupes > 0) {
    console.log(`⚠️  Filtered out ${dupes} duplicate idioms already in idioms.json`);
  }
  console.log(`📋 ${newSeeds.length} new idioms to generate`);

  // Find max existing ID number (IDs may have gaps)
  const maxIdNum = Math.max(...masterIdioms.map(i => parseInt(i.id.replace('ID', ''))));
  const nextId = maxIdNum + 1;
  console.log(`🆔 Starting ID: ID${String(nextId).padStart(3, '0')}`);

  const totalBatches = Math.ceil(newSeeds.length / BATCH_SIZE);
  console.log(`📦 Batch size: ${BATCH_SIZE} idioms per API call`);
  console.log(`📡 Total API calls: ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes\n`);

  const progress = loadProgress();
  const newIdioms = [];
  let generated = 0;

  for (let i = 0; i < newSeeds.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    if (specificBatch && batchNum !== specificBatch) continue;

    const batchKey = `gen-batch-${batchNum}`;

    if (progress.completedBatches[batchKey]) {
      console.log(`⏭️  Batch ${batchNum}/${totalBatches} already done`);
      continue;
    }

    const batch = newSeeds.slice(i, i + BATCH_SIZE);
    const startId = nextId + i;
    process.stdout.write(`🔄 Batch ${batchNum}/${totalBatches} (${batch.map(b => b.characters).join(', ')})...`);

    const results = await generateBatch(batch, startId);

    if (results && results.length === batch.length) {
      for (let j = 0; j < batch.length; j++) {
        const seed = batch[j];
        const gen = results[j];
        const idNum = startId + j;
        const id = `ID${String(idNum).padStart(3, '0')}`;

        newIdioms.push({
          id,
          characters: seed.characters,
          pinyin: seed.pinyin,
          meaning: gen.meaning || '',
          example: gen.example || '',
          chineseExample: gen.chineseExample || '',
          theme: seed.theme,
          description: gen.description || '',
          metaphoric_meaning: gen.metaphoric_meaning || '',
          traditionalCharacters: gen.traditionalCharacters || seed.characters,
          description_tr: gen.description_tr || gen.description || '',
          chineseExample_tr: gen.chineseExample_tr || gen.chineseExample || ''
        });
        generated++;
      }

      progress.completedBatches[batchKey] = true;
      saveProgress(progress);
      console.log(' ✅');
    } else {
      console.log(` ❌ Failed (got ${results ? results.length : 0}/${batch.length}), will retry next run`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  if (newIdioms.length > 0) {
    // Append to idioms.json
    const allIdioms = [...masterIdioms, ...newIdioms];
    fs.writeFileSync(masterPath, JSON.stringify(allIdioms, null, 2));
    console.log(`\n✅ Appended ${newIdioms.length} new idioms to idioms.json`);
    console.log(`📊 Total idioms now: ${allIdioms.length}`);
  }

  // Cleanup progress when all batches complete
  const allDone = Object.keys(progress.completedBatches).length >= totalBatches;
  if (allDone) {
    try { fs.unlinkSync(PROGRESS_FILE); } catch {}
  }

  console.log('\n======================');
  console.log('📊 SUMMARY');
  console.log('======================');
  console.log(`✅ Generated: ${generated} idioms`);
  console.log(`📁 Saved to: public/idioms.json`);
  console.log('\n💡 Next steps:');
  console.log('  1. Run fact-checker: node scripts/fact-check-idioms.js --from ID683');
  console.log('  2. Review any FAILs and fix');
  console.log('  3. Translate: node scripts/translate-new-idioms.js');
}

function dryRun() {
  console.log('🔍 DRY RUN - Estimating generation costs\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));
  const existingChars = new Set(masterIdioms.map(i => i.characters));
  const newSeeds = SEED_IDIOMS.filter(s => !existingChars.has(s.characters));

  console.log(`📋 Seed idioms: ${SEED_IDIOMS.length}`);
  console.log(`⚠️  Already exist: ${SEED_IDIOMS.length - newSeeds.length}`);
  console.log(`📋 New to generate: ${newSeeds.length}`);

  const totalBatches = Math.ceil(newSeeds.length / BATCH_SIZE);
  console.log(`📦 Batches: ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes`);
  // GPT-4o-mini: $0.15/1M input, $0.60/1M output
  const estInputTokens = newSeeds.length * 200;
  const estOutputTokens = newSeeds.length * 500;
  const cost = (estInputTokens * 0.00000015) + (estOutputTokens * 0.0000006);
  console.log(`💰 Estimated cost: ~$${cost.toFixed(3)} (GPT-4o-mini)`);

  console.log('\nNew idioms by theme:');
  const themeCounts = {};
  for (const s of newSeeds) {
    themeCounts[s.theme] = (themeCounts[s.theme] || 0) + 1;
  }
  for (const [theme, count] of Object.entries(themeCounts)) {
    console.log(`  ${theme}: ${count}`);
  }
}

// Main
const args = process.argv.slice(2);
if (args.includes('--dry-run')) {
  dryRun();
} else {
  const batchIdx = args.indexOf('--batch');
  const specificBatch = batchIdx !== -1 ? parseInt(args[batchIdx + 1]) : null;
  runGeneration(specificBatch).catch(console.error);
}
