#!/usr/bin/env node
/**
 * Translate New Idioms Script
 *
 * Translates idioms missing from each language's idioms.json.
 * Uses OpenAI GPT-4o-mini. Adapted from batch-translate-optimized.js.
 *
 * Usage:
 *   node scripts/translate-new-idioms.js              # Translate all missing
 *   node scripts/translate-new-idioms.js --from ID683  # Only translate from specific ID
 *   node scripts/translate-new-idioms.js --lang es     # Only translate to Spanish
 *   node scripts/translate-new-idioms.js --dry-run     # Estimate without API calls
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BATCH_SIZE = parseInt(process.env.TRANSLATE_BATCH_SIZE || '15');
const RATE_LIMIT_MS = 500;

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

const PROGRESS_FILE = path.join(__dirname, '../.translate-new-progress.json');

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
  const items = idioms.map((idiom, i) =>
    `${i + 1}. meaning: "${idiom.meaning}"
   metaphoric: "${idiom.metaphoric_meaning}"
   desc: "${idiom.description}"
   example: "${idiom.example}"`
  ).join('\n\n');

  const prompt = `Translate the following to ${langName}. Return a JSON object with a "translations" key containing an array of objects, each having: meaning, metaphoric, desc, example. Keep same order. No explanations.

${items}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0].message.content.trim();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : (parsed.translations || parsed.results || parsed.data || Object.values(parsed)[0]);
  } catch (error) {
    console.error(`API error: ${error.message}`);
    return null;
  }
}

async function translateAll(fromId = null, onlyLang = null) {
  console.log('🌍 TRANSLATE NEW IDIOMS (OpenAI GPT-4o-mini)');
  console.log('=============================================\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  let candidateIdioms = masterIdioms;
  if (fromId) {
    const fromNum = parseInt(fromId.replace('ID', ''));
    candidateIdioms = masterIdioms.filter(i => {
      const idNum = parseInt(i.id.replace('ID', ''));
      return idNum >= fromNum;
    });
    console.log(`📋 Translating from ${fromId}: up to ${candidateIdioms.length} idioms per language`);
  } else {
    console.log(`📋 Translating all missing idioms (up to ${masterIdioms.length} per language)`);
  }

  const languages = onlyLang
    ? { [onlyLang]: LANGUAGES[onlyLang] }
    : LANGUAGES;

  console.log(`🌐 Languages: ${Object.keys(languages).join(', ')}\n`);

  const progress = loadProgress();
  let totalTranslated = 0;

  for (const [langCode, langName] of Object.entries(languages)) {
    console.log(`\n🌐 ${langName} (${langCode})`);
    console.log('─'.repeat(40));

    const langPath = path.join(__dirname, `../public/translations/${langCode}/idioms.json`);
    let langIdioms = [];

    try {
      langIdioms = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    } catch {
      console.log(`  ⚠️  Creating new translation file`);
      // Ensure directory exists
      const dir = path.dirname(langPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    }

    const existingIds = new Set(langIdioms.map(i => i.id));
    const idiomsToTranslate = candidateIdioms.filter(i => !existingIds.has(i.id));

    if (idiomsToTranslate.length === 0) {
      console.log(`  ✅ Already complete (${langIdioms.length} idioms)`);
      continue;
    }

    console.log(`  📝 ${idiomsToTranslate.length} idioms to translate`);

    for (let i = 0; i < idiomsToTranslate.length; i += BATCH_SIZE) {
      const batchNum = Math.floor(i / BATCH_SIZE) + 1;
      const batchKey = `${langCode}-batch${batchNum}-${fromId || 'all'}`;

      if (progress.completedBatches[batchKey]) {
        console.log(`  ⏭️  Batch ${batchNum} already done`);
        continue;
      }

      const batch = idiomsToTranslate.slice(i, i + BATCH_SIZE);
      process.stdout.write(`  🔄 Batch ${batchNum}/${Math.ceil(idiomsToTranslate.length / BATCH_SIZE)} (${batch.length} idioms)...`);

      const translations = await translateBatch(batch, langCode, langName);

      if (translations && translations.length === batch.length) {
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

        fs.writeFileSync(langPath, JSON.stringify(langIdioms, null, 2));
        progress.completedBatches[batchKey] = true;
        saveProgress(progress);
        console.log(' ✅');
        totalTranslated += batch.length;
      } else {
        console.log(` ❌ Failed (got ${translations ? translations.length : 0}/${batch.length}), will retry next run`);
      }

      await sleep(RATE_LIMIT_MS);
    }

    console.log(`  ✅ ${langName} complete: ${langIdioms.length} total idioms`);
  }

  // Cleanup progress when done
  const allLanguagesDone = Object.keys(languages).every(lang => {
    const langPath = path.join(__dirname, `../public/translations/${lang}/idioms.json`);
    try {
      const langIdioms = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
      const existingIds = new Set(langIdioms.map(i => i.id));
      return candidateIdioms.every(i => existingIds.has(i.id));
    } catch { return false; }
  });

  if (allLanguagesDone) {
    try { fs.unlinkSync(PROGRESS_FILE); } catch {}
  }

  console.log('\n=============================================');
  console.log('📊 SUMMARY');
  console.log('=============================================');
  console.log(`✅ Total translations: ${totalTranslated}`);
  console.log('\n🎉 Done!');
}

function dryRun(fromId = null) {
  console.log('🔍 DRY RUN - Estimating translation costs\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  let count = masterIdioms.length;
  if (fromId) {
    const fromNum = parseInt(fromId.replace('ID', ''));
    count = masterIdioms.filter(i => parseInt(i.id.replace('ID', '')) >= fromNum).length;
  }

  const totalTranslations = count * Object.keys(LANGUAGES).length;
  const totalBatches = Math.ceil(count / BATCH_SIZE) * Object.keys(LANGUAGES).length;
  // GPT-4o-mini pricing
  const estInputTokens = totalTranslations * 150;
  const estOutputTokens = totalTranslations * 120;
  const cost = (estInputTokens * 0.00000015) + (estOutputTokens * 0.0000006);

  console.log(`📋 Idioms to translate: ${count}`);
  console.log(`🌍 Languages: ${Object.keys(LANGUAGES).length}`);
  console.log(`📊 Total translations: ${totalTranslations}`);
  console.log(`📦 API calls (batched): ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes`);
  console.log(`💰 Estimated cost: ~$${cost.toFixed(3)} (GPT-4o-mini)`);
}

// Main
const args = process.argv.slice(2);
const fromIdx = args.indexOf('--from');
const fromId = fromIdx !== -1 ? args[fromIdx + 1] : null;
const langIdx = args.indexOf('--lang');
const onlyLang = langIdx !== -1 ? args[langIdx + 1] : null;

if (args.includes('--dry-run')) {
  dryRun(fromId);
} else {
  translateAll(fromId, onlyLang).catch(console.error);
}
