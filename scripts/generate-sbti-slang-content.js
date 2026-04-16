#!/usr/bin/env node
/**
 * Generate deep "Chinese slang decoder" content for each SBTI type — the
 * unique angle chineseidioms.com can actually own. This is NOT about the
 * personality profile; it's about the Chinese internet culture baked into
 * the type name itself.
 *
 * Input:  src/data/sbti-types.en.json (existing rich profiles)
 * Output: mutates each type in-place to add:
 *   - chineseSlangTerm (string, e.g. "吗喽")
 *   - pinyin (string, e.g. "ma lou")
 *   - slangOriginStory (300-400 word paragraph — when/where it emerged, why it stuck)
 *   - slangUsageToday (200-300 word paragraph — how young Chinese actually use it)
 *   - relatedSlang (3-5 related internet-slang terms with brief glosses)
 *   - literalVsSlangMeaning (short contrast, literal meaning vs slang meaning)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.5,
    maxOutputTokens: 4096,
  },
});

const RATE_LIMIT_MS = 4500;
const MAX_RETRIES = 3;

const srcPath = path.join(__dirname, '..', 'src', 'data', 'sbti-types.en.json');
const types = JSON.parse(fs.readFileSync(srcPath, 'utf8'));

function buildPrompt(type) {
  return `You are writing authoritative content for chineseidioms.com about the Chinese internet slang term that became the SBTI type "${type.code}" (${type.displayName}). You have deep knowledge of Chinese internet culture, Bilibili, Weibo, Xiaohongshu, and the slang Gen-Z Chinese use online.

**Type:** ${type.code} — ${type.displayName}
**Chinese origin reference:** ${type.chineseOrigin}
**Core vibe:** ${type.coreVibe}

The SBTI test encodes Chinese internet archetypes in its type names. This page will rank #1 for people who want to understand what "${type.code}" actually means culturally — not their personality result, but the Chinese slang itself.

Return ONLY this JSON shape — no preamble, no code fence:

{
  "chineseSlangTerm": "<the actual Chinese term, e.g. 吗喽 or 送钱者 or 酒鬼. Use the MOST ACCURATE Chinese term this SBTI type code references — use your knowledge of Chinese internet culture.>",
  "pinyin": "<pinyin with tone marks, e.g. 'mǎ lóu' or 'sòng qián zhě'>",
  "literalMeaning": "<1-sentence literal character-by-character meaning>",
  "slangMeaning": "<1-sentence what it actually means in internet slang usage today>",
  "slangOriginStory": "<300-400 words. Where did this slang term emerge? Bilibili meme? Douyin trend? Weibo joke? What year/era? What cultural moment made it stick? Include specific examples of the meme or viral post if known. Write in confident, culturally-fluent English — this is a cultural decoder piece for a Western audience trying to understand modern Chinese internet.>",
  "slangUsageToday": "<200-300 words. How do young Chinese actually use this term in 2025-2026? In what contexts? What does it signal about the speaker? Is it self-deprecating, ironic, affectionate, accusatory? Give realistic usage examples.>",
  "relatedSlang": [
    {"term": "<another Chinese slang term>", "pinyin": "<pinyin>", "meaning": "<brief English gloss>", "relationship": "<how it relates to this SBTI type's vibe>"},
    {"term": "...", "pinyin": "...", "meaning": "...", "relationship": "..."},
    {"term": "...", "pinyin": "...", "meaning": "...", "relationship": "..."}
  ],
  "whyItBecameSbtiType": "<1-2 sentence explanation of why the SBTI creators picked this specific slang term to name the ${type.code} archetype. What about it captures the ${type.displayName}?>"
}

Constraints:
- Be culturally accurate. If you're unsure about a term's origin year or specific meme, say so generically ("emerged on Chinese social media in the early 2020s") rather than inventing a specific date/meme.
- Use real Chinese terms that actually exist. If the SBTI type name doesn't have a clear single Chinese slang equivalent, pick the closest cultural archetype term that young Chinese would recognize.
- Use the full Chinese characters in chineseSlangTerm and relatedSlang.term fields.
- relatedSlang must have exactly 3-5 entries.
- Do NOT explain the SBTI test itself — focus purely on the Chinese slang/cultural context.
- Return ONLY the JSON. No markdown, no explanation outside the JSON object.`;
}

async function generateSlang(type, retries = MAX_RETRIES) {
  const prompt = buildPrompt(type);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      return JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error(`    [${type.code}] attempt ${attempt}: ${err.message}`);
      if (attempt === retries) return null;
      await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
    }
  }
}

async function main() {
  console.log(`Generating slang decoder content for ${types.length} types...`);

  for (const type of types) {
    if (type.chineseSlangTerm) {
      console.log(`  [${type.code}] skip (already has slang content)`);
      continue;
    }
    process.stdout.write(`  [${type.code}] `);
    const slang = await generateSlang(type);
    if (slang) {
      Object.assign(type, slang);
      process.stdout.write(`done (${slang.chineseSlangTerm})\n`);
    } else {
      process.stdout.write('FAILED\n');
    }
    // Save incrementally
    fs.writeFileSync(srcPath, JSON.stringify(types, null, 2));
    await new Promise(r => setTimeout(r, RATE_LIMIT_MS));
  }

  console.log(`\nDone. Wrote ${srcPath}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
