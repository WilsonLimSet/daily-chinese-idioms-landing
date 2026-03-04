#!/usr/bin/env node
/**
 * Generate a seed list of ~250 real chengyu not in our database.
 * Uses GPT-4o to produce verified idioms with correct pinyin.
 * Outputs to data/new-seeds.json
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSeeds(existing, batch, theme) {
  // Split existing into chunks to avoid token limits - only send relevant ones
  const existingList = [...existing].join('、');

  const prompt = `You are a Chinese language expert. I need ${batch} REAL Chinese idioms (成语/chengyu) related to "${theme}" that are NOT in my existing database.

HERE ARE ALL MY EXISTING IDIOMS (do NOT repeat any of these):
${existingList}

REQUIREMENTS:
- Each must be a REAL four-character idiom (成语) found in standard Chinese dictionaries like 《现代汉语词典》
- Provide correct pinyin with tone marks
- Include less common but still real chengyu — I already have the most common ones
- Do NOT include phrases that are not standard 成语 (no 俗语, 谚语, or made-up phrases)
- Generate exactly ${batch} idioms

Return JSON: {"idioms": [{"characters": "...", "pinyin": "...", "theme": "${theme}"}]}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.5,
      max_tokens: 8192,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    const parsed = JSON.parse(response.choices[0].message.content.trim());
    return parsed.idioms || [];
  } catch (error) {
    console.error(`API error: ${error.message}`);
    return [];
  }
}

async function main() {
  const idioms = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/idioms.json'), 'utf-8'));
  const existing = new Set(idioms.map(i => i.characters));
  console.log(`📋 Existing idioms: ${existing.size}`);

  const themes = [
    { name: 'Success & Perseverance', count: 50 },
    { name: 'Life Philosophy', count: 50 },
    { name: 'Wisdom & Learning', count: 50 },
    { name: 'Relationships & Character', count: 50 },
    { name: 'Strategy & Action', count: 50 },
  ];

  let allSeeds = [];

  for (const theme of themes) {
    console.log(`\n🔄 Generating ${theme.count} for "${theme.name}"...`);
    const seeds = await generateSeeds(existing, theme.count, theme.name);

    // Dedup against existing AND already collected
    const newSeeds = seeds.filter(s =>
      !existing.has(s.characters) &&
      !allSeeds.some(a => a.characters === s.characters)
    );

    console.log(`  Got ${seeds.length}, ${newSeeds.length} new after dedup`);
    allSeeds.push(...newSeeds);

    // Add to existing set for next batch dedup
    for (const s of newSeeds) existing.add(s.characters);
  }

  // Save
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const outPath = path.join(dataDir, 'new-seeds.json');
  fs.writeFileSync(outPath, JSON.stringify(allSeeds, null, 2));

  console.log(`\n✅ Generated ${allSeeds.length} new seed idioms`);
  console.log(`📁 Saved to: ${outPath}`);

  // Theme breakdown
  const counts = {};
  for (const s of allSeeds) counts[s.theme] = (counts[s.theme] || 0) + 1;
  for (const [t, c] of Object.entries(counts)) console.log(`  ${t}: ${c}`);
}

main().catch(console.error);
