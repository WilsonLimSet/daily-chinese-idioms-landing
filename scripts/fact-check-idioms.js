#!/usr/bin/env node
/**
 * Fact-Check Idioms Script
 *
 * Uses OpenAI GPT-4o-mini to verify idiom description accuracy.
 * Checks for wrong dynasty, wrong source text, wrong attribution.
 * Batches 10 idioms per API call.
 * Outputs data/fact-check-results.json with PASS/FAIL + corrections.
 *
 * Usage:
 *   node scripts/fact-check-idioms.js              # Check all idioms
 *   node scripts/fact-check-idioms.js --from ID683  # Check from specific ID
 *   node scripts/fact-check-idioms.js --dry-run     # Estimate without API calls
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BATCH_SIZE = 10;
const RATE_LIMIT_MS = 1000; // OpenAI has generous rate limits
const DATA_DIR = path.join(__dirname, '../data');
const RESULTS_FILE = path.join(DATA_DIR, 'fact-check-results.json');
const PROGRESS_FILE = path.join(__dirname, '../.fact-check-progress.json');

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

function loadResults() {
  try {
    return JSON.parse(fs.readFileSync(RESULTS_FILE, 'utf-8'));
  } catch {
    return {};
  }
}

function saveResults(results) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(RESULTS_FILE, JSON.stringify(results, null, 2));
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function factCheckBatch(idioms) {
  const items = idioms.map((idiom, i) =>
    `${i + 1}. Characters: ${idiom.characters} (${idiom.pinyin})
   Meaning: "${idiom.meaning}"
   Description: "${idiom.description}"`
  ).join('\n\n');

  const prompt = `You are a Chinese language and history expert. For each chengyu (Chinese idiom) below, verify if the description is factually accurate.

Check for:
- Wrong dynasty or time period attribution
- Wrong source text (e.g., attributing to wrong classical work)
- Wrong historical figure attribution
- Fabricated origin stories that don't match any known sources
- Incorrect character-by-character breakdowns

For each idiom, respond with a JSON array where each element has:
- "index": the number (1-based)
- "result": "PASS" or "FAIL"
- "issue": (only if FAIL) brief description of what's wrong
- "correction": (only if FAIL) the corrected fact

Be strict but fair. Minor embellishments for narrative flow are OK. Only flag clear factual errors.

${items}

Respond ONLY with a valid JSON array.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const text = response.choices[0].message.content.trim();
    const parsed = JSON.parse(text);
    // Handle both {results: [...]} and [...] formats
    return Array.isArray(parsed) ? parsed : (parsed.results || parsed.data || Object.values(parsed)[0]);
  } catch (error) {
    console.error(`API error: ${error.message}`);
    return null;
  }
}

async function runFactCheck(fromId = null) {
  console.log('🔍 IDIOM FACT-CHECKER (OpenAI GPT-4o-mini)');
  console.log('==========================================\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  let idiomsToCheck = masterIdioms;
  if (fromId) {
    const fromNum = parseInt(fromId.replace('ID', ''));
    idiomsToCheck = masterIdioms.filter(i => {
      const idNum = parseInt(i.id.replace('ID', ''));
      return idNum >= fromNum;
    });
    console.log(`📋 Checking from ${fromId}: ${idiomsToCheck.length} idioms`);
  } else {
    console.log(`📋 Checking all ${idiomsToCheck.length} idioms`);
  }

  const totalBatches = Math.ceil(idiomsToCheck.length / BATCH_SIZE);
  console.log(`📦 Batch size: ${BATCH_SIZE} idioms per API call`);
  console.log(`📡 Total API calls: ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes\n`);

  const progress = loadProgress();
  const results = loadResults();
  let passCount = 0;
  let failCount = 0;

  for (let i = 0; i < idiomsToCheck.length; i += BATCH_SIZE) {
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const batchKey = `batch-${batchNum}-${fromId || 'all'}`;

    if (progress.completedBatches[batchKey]) {
      console.log(`⏭️  Batch ${batchNum}/${totalBatches} already done`);
      continue;
    }

    const batch = idiomsToCheck.slice(i, i + BATCH_SIZE);
    process.stdout.write(`🔄 Batch ${batchNum}/${totalBatches} (${batch.map(b => b.id).join(', ')})...`);

    const checks = await factCheckBatch(batch);

    if (checks && checks.length === batch.length) {
      for (let j = 0; j < batch.length; j++) {
        const idiom = batch[j];
        const check = checks[j];
        results[idiom.id] = {
          characters: idiom.characters,
          result: check.result,
          ...(check.result === 'FAIL' ? {
            issue: check.issue,
            correction: check.correction
          } : {})
        };
        if (check.result === 'PASS') passCount++;
        else failCount++;
      }

      saveResults(results);
      progress.completedBatches[batchKey] = true;
      saveProgress(progress);
      console.log(` ✅ (${checks.filter(c => c.result === 'FAIL').length} fails)`);
    } else {
      console.log(` ❌ Failed (got ${checks ? checks.length : 0}/${batch.length}), will retry next run`);
    }

    await sleep(RATE_LIMIT_MS);
  }

  // Summary
  const allResults = Object.values(results);
  const totalPass = allResults.filter(r => r.result === 'PASS').length;
  const totalFail = allResults.filter(r => r.result === 'FAIL').length;

  console.log('\n==========================================');
  console.log('📊 RESULTS');
  console.log('==========================================');
  console.log(`✅ PASS: ${totalPass}`);
  console.log(`❌ FAIL: ${totalFail}`);

  if (totalFail > 0) {
    console.log('\n❌ FAILURES:');
    for (const [id, r] of Object.entries(results)) {
      if (r.result === 'FAIL') {
        console.log(`  ${id} (${r.characters}): ${r.issue}`);
        console.log(`    Correction: ${r.correction}`);
      }
    }
  }

  // Cleanup progress when complete
  try { fs.unlinkSync(PROGRESS_FILE); } catch {}

  console.log(`\n📁 Full results saved to: ${RESULTS_FILE}`);
}

function dryRun(fromId = null) {
  console.log('🔍 DRY RUN - Estimating fact-check costs\n');

  const masterPath = path.join(__dirname, '../public/idioms.json');
  const masterIdioms = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  let count = masterIdioms.length;
  if (fromId) {
    const fromNum = parseInt(fromId.replace('ID', ''));
    count = masterIdioms.filter(i => parseInt(i.id.replace('ID', '')) >= fromNum).length;
  }

  const totalBatches = Math.ceil(count / BATCH_SIZE);
  // GPT-4o-mini: $0.15/1M input, $0.60/1M output
  const estInputTokens = count * 300;
  const estOutputTokens = count * 50;
  const cost = (estInputTokens * 0.00000015) + (estOutputTokens * 0.0000006);

  console.log(`📋 Idioms to check: ${count}`);
  console.log(`📦 Batches: ${totalBatches}`);
  console.log(`⏱️  Estimated time: ${Math.ceil(totalBatches * RATE_LIMIT_MS / 60000)} minutes`);
  console.log(`💰 Estimated cost: ~$${cost.toFixed(3)} (GPT-4o-mini)`);
}

// Main
const args = process.argv.slice(2);
const fromIdx = args.indexOf('--from');
const fromId = fromIdx !== -1 ? args[fromIdx + 1] : null;

if (args.includes('--dry-run')) {
  dryRun(fromId);
} else {
  runFactCheck(fromId).catch(console.error);
}
