#!/usr/bin/env node
/**
 * Fix Failed Descriptions
 * Re-generates descriptions for idioms that failed fact-checking.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const BATCH_SIZE = 3;
const RATE_LIMIT_MS = 1500;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fixBatch(idioms) {
  const items = idioms.map((idiom, i) =>
    `${i + 1}. Characters: ${idiom.characters} (${idiom.pinyin})
   Current description issue: ${idiom._issue}
   Correction hint: ${idiom._correction}`
  ).join('\n\n');

  const prompt = `You are a Chinese classical literature expert. Rewrite the description for each chengyu below. The previous descriptions had factual errors noted in the correction hints.

STYLE: Write ~120 words of English prose. Include Chinese character breakdowns in parentheses like (持, hold). Cover: verified origin → character breakdown → cultural significance → modern usage.

CRITICAL RULES:
- If you are not 100% certain of the specific source text or dynasty, say "commonly attributed to" or "found in various classical texts" instead of citing a specific wrong source
- Do NOT invent specific attributions. It is better to be vague than wrong.
- For 36 Stratagems idioms, cite 三十六计 as the source
- For Sun Tzu idioms, cite 孙子兵法

Also provide description_tr (same text but with traditional Chinese characters in the parenthetical breakdowns).

Return a JSON object with "results" array where each has: description, description_tr

${items}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.2,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    const parsed = JSON.parse(response.choices[0].message.content.trim());
    return Array.isArray(parsed) ? parsed : (parsed.results || parsed.data || Object.values(parsed)[0]);
  } catch (error) {
    console.error(`API error: ${error.message}`);
    return null;
  }
}

async function main() {
  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));
  const results = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/fact-check-results.json'), 'utf-8'));

  const failedIds = Object.entries(results).filter(([id, r]) => r.result === 'FAIL').map(([id, r]) => ({
    id, issue: r.issue, correction: r.correction
  }));

  console.log(`🔧 Fixing ${failedIds.length} failed descriptions\n`);

  const toFix = failedIds.map(f => {
    const idiom = idioms.find(i => i.id === f.id);
    return { ...idiom, _issue: f.issue, _correction: f.correction };
  });

  let fixed = 0;
  for (let i = 0; i < toFix.length; i += BATCH_SIZE) {
    const batch = toFix.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toFix.length / BATCH_SIZE);
    process.stdout.write(`🔄 Batch ${batchNum}/${totalBatches} (${batch.map(b=>b.characters).join(', ')})...`);

    const fixes = await fixBatch(batch);
    if (fixes && fixes.length === batch.length) {
      for (let j = 0; j < batch.length; j++) {
        const idx = idioms.findIndex(i => i.id === batch[j].id);
        if (idx !== -1 && fixes[j].description) {
          idioms[idx].description = fixes[j].description;
          idioms[idx].description_tr = fixes[j].description_tr || fixes[j].description;
          fixed++;
        }
      }
      console.log(' ✅');
    } else {
      console.log(' ❌');
    }
    await sleep(RATE_LIMIT_MS);
  }

  fs.writeFileSync(idiomsPath, JSON.stringify(idioms, null, 2));
  console.log(`\n✅ Fixed ${fixed}/${failedIds.length} descriptions`);
}

main().catch(console.error);
