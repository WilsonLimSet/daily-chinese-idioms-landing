#!/usr/bin/env node
/**
 * Regenerate ALL new idiom descriptions to match quality of existing entries.
 * Uses GPT-4o with a storytelling-focused prompt.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const BATCH_SIZE = 3;
const RATE_LIMIT_MS = 2000;
const PROGRESS_FILE = path.join(__dirname, '../.regen-progress.json');

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); }
  catch { return { done: [] }; }
}
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function regenBatch(idioms) {
  const items = idioms.map((idiom, i) =>
    `${i + 1}. ${idiom.characters} (${idiom.pinyin}) — Theme: ${idiom.theme}`
  ).join('\n');

  const prompt = `You are writing for a Chinese idiom education website. For each chengyu below, write a rich, engaging description of ~120-150 words.

HERE IS THE QUALITY BAR — study these real examples from the site:

EXAMPLE 1 (塞翁失马): "This profound idiom originates from the story of a wise old man (塞翁) living near the northern border who lost his prized horse (失马). When neighbors came to console him, he asked, 'How do you know this isn't good fortune?' Indeed, the horse later returned with a magnificent wild horse. When neighbors congratulated him, he remained cautious. Later, his son broke his leg while riding the wild horse, but this injury ultimately saved him from being conscripted into a war where many soldiers perished. The idiom teaches the Taoist principle that fortune and misfortune are interconnected and often transform into each other, encouraging us to maintain equilibrium in the face of life's ups and downs."

EXAMPLE 2 (画龙点睛): "This famous idiom traces back to the legendary painter Zhang Sengyao of the Liang Dynasty (梁朝). According to the tale, Zhang painted four magnificent dragons on the walls of Anle Temple in Nanjing but deliberately left their eyes (睛) unpainted. When onlookers pressed him to complete the work, he warned that adding the eyes would bring the dragons to life. Upon painting the eyes of two dragons, thunder and lightning shattered the wall and the dragons flew away into the clouds, while the two unfinished dragons remained on the wall. The idiom captures the concept of adding (点) the crucial finishing touch (睛) that transforms something from good to extraordinary. Modern usage extends to any key detail that elevates a piece of work."

RULES:
- Tell the ORIGIN STORY. Who said it? What happened? Be vivid and specific.
- Include Chinese characters in parentheses with English gloss: (塞翁, old border man)
- If the idiom comes from a specific text (e.g., 孙子兵法, 三十六计, 论语, 史记), name it
- If it's from the 36 Stratagems, briefly describe the military tactic
- Cover: origin story → character meaning → cultural significance → modern usage
- Do NOT write generic "this idiom emphasizes..." text. Tell stories.
- If you truly don't know the specific origin story, describe the imagery the characters paint and how they're used, but do NOT fabricate a fake story

Also provide:
- description_tr: Same text but with traditional Chinese characters in parentheses
- meaning: Short literal translation, 4-8 words (e.g., "Old man loses horse")
- metaphoric_meaning: 2-5 word metaphoric meaning (e.g., "Misfortune might be a blessing")

Return JSON: {"results": [{"description": "...", "description_tr": "...", "meaning": "...", "metaphoric_meaning": "..."}]}

${items}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.4,
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
  const newEntries = idioms.filter(i => parseInt(i.id.replace('ID', '')) >= 683);

  console.log(`🔄 Regenerating ${newEntries.length} descriptions with GPT-4o\n`);

  const progress = loadProgress();
  let updated = 0;
  const totalBatches = Math.ceil(newEntries.length / BATCH_SIZE);

  for (let i = 0; i < newEntries.length; i += BATCH_SIZE) {
    const batch = newEntries.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;

    // Skip if already done
    if (batch.every(b => progress.done.includes(b.id))) {
      console.log(`⏭️  Batch ${batchNum}/${totalBatches} already done`);
      continue;
    }

    process.stdout.write(`🔄 Batch ${batchNum}/${totalBatches} (${batch.map(b => b.characters).join(', ')})...`);

    const results = await regenBatch(batch);
    if (results && results.length === batch.length) {
      for (let j = 0; j < batch.length; j++) {
        const idx = idioms.findIndex(i => i.id === batch[j].id);
        if (idx !== -1 && results[j].description) {
          idioms[idx].description = results[j].description;
          idioms[idx].description_tr = results[j].description_tr || results[j].description;
          if (results[j].meaning) idioms[idx].meaning = results[j].meaning;
          if (results[j].metaphoric_meaning) idioms[idx].metaphoric_meaning = results[j].metaphoric_meaning;
          progress.done.push(batch[j].id);
          updated++;
        }
      }
      fs.writeFileSync(idiomsPath, JSON.stringify(idioms, null, 2));
      saveProgress(progress);
      console.log(' ✅');
    } else {
      console.log(` ❌ (got ${results?.length || 0}/${batch.length})`);
    }
    await sleep(RATE_LIMIT_MS);
  }

  // Cleanup
  try { fs.unlinkSync(PROGRESS_FILE); } catch {}

  console.log(`\n✅ Regenerated ${updated}/${newEntries.length} descriptions`);
}

main().catch(console.error);
