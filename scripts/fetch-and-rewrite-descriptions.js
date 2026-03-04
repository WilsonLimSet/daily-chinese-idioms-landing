#!/usr/bin/env node
/**
 * Fetch real origins from Baidu Baike and rewrite descriptions.
 *
 * For each idiom, fetches the Baidu Baike page to get the real 典故/出处,
 * then uses GPT-4o to rewrite in our English style grounded in real sources.
 *
 * Usage:
 *   node scripts/fetch-and-rewrite-descriptions.js              # All new idioms (ID683+)
 *   node scripts/fetch-and-rewrite-descriptions.js --from ID683  # From specific ID
 *   node scripts/fetch-and-rewrite-descriptions.js --id ID751    # Single idiom
 *   node scripts/fetch-and-rewrite-descriptions.js --dry-run     # Just test fetching
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const RATE_LIMIT_MS = 200;
const FETCH_DELAY_MS = 200;
const PROGRESS_FILE = path.join(__dirname, '../.baike-rewrite-progress.json');

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8')); }
  catch { return { done: [], failed: [] }; }
}
function saveProgress(p) { fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p)); }
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchOriginInfo(characters) {
  // Use GPT-4o's own knowledge but with a very specific, constrained prompt
  // that asks it to ONLY state what it's confident about, marking uncertainty
  //
  // We also fetch Baidu Baike summary (server-rendered) for cross-reference
  const baikeSummary = await fetchBaikeSummary(characters);

  return baikeSummary;
}

async function fetchBaikeSummary(characters) {
  const encoded = encodeURIComponent(characters);
  const url = `https://baike.baidu.com/item/${encoded}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      },
      redirect: 'follow',
    });

    if (!response.ok) return null;

    const html = await response.text();

    const stripHtml = (text) => text
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<sup[^>]*>[\s\S]*?<\/sup>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&[a-z]+;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Extract full page text, strip HTML, get first ~3000 chars
    // Baidu Baike renders content server-side so this works
    const fullText = stripHtml(html);

    // Find the relevant section - usually starts after the idiom name header
    const startIdx = fullText.indexOf('成语出处');
    const altStartIdx = fullText.indexOf('成语故事');
    const storyStartIdx = fullText.indexOf('成语典故');
    const bestStart = Math.min(
      ...[startIdx, altStartIdx, storyStartIdx].filter(i => i > 0)
    );

    if (bestStart > 0 && bestStart < Infinity) {
      // Get from story section onwards, up to 3000 chars
      return fullText.substring(bestStart, bestStart + 3000).trim();
    }

    // Fallback: find the summary and nearby content
    const summaryIdx = fullText.indexOf(characters);
    if (summaryIdx > 0) {
      return fullText.substring(summaryIdx, summaryIdx + 3000).trim();
    }

    return fullText.substring(0, 3000).trim() || null;
  } catch (error) {
    return null;
  }
}

async function rewriteDescription(idiom, baikeContent) {
  const baikeContext = baikeContent
    ? `\nBAIDU BAIKE REFERENCE (use this to cross-check your knowledge):\n${baikeContent}\n`
    : '';

  const prompt = `You are a scholar of classical Chinese literature writing for an idiom education website.

TASK: Write an accurate, engaging description for this chengyu.

IDIOM: ${idiom.characters} (${idiom.pinyin}) — Theme: ${idiom.theme}
${baikeContext}
STEP 1 — VERIFY FACTS: Before writing, identify:
- The earliest known source text (e.g., 左传, 史记, 孙子兵法, 论语, 三十六计)
- The specific historical story or context (who, when, what happened)
- If you are NOT confident about the source, say "commonly used in classical Chinese" — do NOT guess

STEP 2 — WRITE DESCRIPTION following these examples:

EXAMPLE (塞翁失马): "This profound idiom originates from the story of a wise old man (塞翁) living near the northern border who lost his prized horse (失马). When neighbors came to console him, he asked, 'How do you know this isn't good fortune?' Indeed, the horse later returned with a magnificent wild horse. When neighbors congratulated him, he remained cautious. Later, his son broke his leg while riding the wild horse, but this injury ultimately saved him from being conscripted into a war where many soldiers perished. The idiom teaches the Taoist principle that fortune and misfortune are interconnected and often transform into each other, encouraging us to maintain equilibrium in the face of life's ups and downs."

EXAMPLE (破釜沉舟): "Originating from a famous historical event in 207 BCE, this idiom recounts how general Xiang Yu ordered his troops to break (破) their cooking pots (釜) and sink (沉) their boats (舟) before battling the Qin army. By eliminating the possibility of retreat, he created absolute commitment to victory. The four characters create a powerful image of burning bridges to ensure total dedication. In modern contexts, it describes situations where success requires eliminating backup plans. It teaches that certain achievements become possible only when retreat is no longer an option."

RULES:
- Tell the REAL origin story with specific names, dynasties, and source texts
- Include Chinese character breakdowns in parentheses: (破, break), (釜, cooking pot)
- ~120-150 words
- Structure: origin story → character breakdown → modern usage
- CRITICAL: Do NOT fabricate stories. If unsure of the specific origin, describe the vivid imagery the characters paint and how the idiom is used. Being vague is better than being wrong.
- For 三十六计 stratagems, name the stratagem number and describe the tactic

Return JSON: {
  "description": "English description with simplified Chinese in parentheses",
  "description_tr": "Same text but with traditional Chinese characters in parentheses",
  "meaning": "Short 4-8 word literal translation (e.g., 'Break pots sink boats')",
  "metaphoric_meaning": "2-5 word metaphoric meaning (e.g., 'Commit with no retreat')"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      max_tokens: 2048,
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content.trim());
  } catch (error) {
    console.error(`  GPT-4o error: ${error.message}`);
    return null;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const singleIdIdx = args.indexOf('--id');
  const singleId = singleIdIdx !== -1 ? args[singleIdIdx + 1] : null;
  const fromIdx = args.indexOf('--from');
  const fromId = fromIdx !== -1 ? args[fromIdx + 1] : 'ID683';
  const toIdx = args.indexOf('--to');
  const toId = toIdx !== -1 ? args[toIdx + 1] : null;

  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

  let targets;
  if (singleId) {
    targets = idioms.filter(i => i.id === singleId);
  } else {
    const fromNum = parseInt(fromId.replace('ID', ''));
    const toNum = toId ? parseInt(toId.replace('ID', '')) : Infinity;
    targets = idioms.filter(i => {
      const n = parseInt(i.id.replace('ID', ''));
      return n >= fromNum && n <= toNum;
    });
  }

  console.log(`📖 BAIKE-SOURCED DESCRIPTION REWRITER`);
  console.log(`=====================================`);
  console.log(`📋 ${targets.length} idioms to process\n`);

  if (dryRun) {
    // Just test fetching a few
    for (const idiom of targets.slice(0, 3)) {
      console.log(`Fetching ${idiom.characters}...`);
      const content = await fetchBaikeContent(idiom.characters);
      console.log(content ? `  ✅ Got ${content.length} chars` : '  ❌ Failed');
      if (content) console.log(`  Preview: ${content.substring(0, 200)}...`);
      await sleep(FETCH_DELAY_MS);
    }
    return;
  }

  const progress = loadProgress();
  let updated = 0;
  let fetchFails = 0;

  for (let i = 0; i < targets.length; i++) {
    const idiom = targets[i];

    if (progress.done.includes(idiom.id)) {
      continue;
    }

    process.stdout.write(`[${i+1}/${targets.length}] ${idiom.id} ${idiom.characters}...`);

    // Step 1: Fetch from Baidu Baike for cross-reference
    const baikeContent = await fetchOriginInfo(idiom.characters);
    if (baikeContent) {
      process.stdout.write(` baike:${baikeContent.length}chars...`);
    } else {
      process.stdout.write(` no-baike...`);
    }
    await sleep(FETCH_DELAY_MS);

    // Step 2: Rewrite with GPT-4o using Baike as cross-reference
    const result = await rewriteDescription(idiom, baikeContent);
    if (result && result.description) {
      const idx = idioms.findIndex(i => i.id === idiom.id);
      if (idx !== -1) {
        idioms[idx].description = result.description;
        idioms[idx].description_tr = result.description_tr || result.description;
        if (result.meaning) idioms[idx].meaning = result.meaning;
        if (result.metaphoric_meaning) idioms[idx].metaphoric_meaning = result.metaphoric_meaning;
        updated++;
      }
      progress.done.push(idiom.id);
      saveProgress(progress);

      // Save idioms after every 5 updates
      if (updated % 5 === 0) {
        fs.writeFileSync(idiomsPath, JSON.stringify(idioms, null, 2));
      }

      console.log(' ✅');
    } else {
      console.log(' ❌ GPT-4o failed');
      progress.failed.push(idiom.id);
      saveProgress(progress);
    }

    await sleep(RATE_LIMIT_MS);
  }

  // Final save
  fs.writeFileSync(idiomsPath, JSON.stringify(idioms, null, 2));

  // Cleanup
  if (progress.failed.length === 0) {
    try { fs.unlinkSync(PROGRESS_FILE); } catch {}
  }

  console.log(`\n=====================================`);
  console.log(`✅ Updated: ${updated}/${targets.length}`);
  console.log(`⚠️  Fetch failures: ${fetchFails}`);
  if (progress.failed.length > 0) {
    console.log(`❌ Failed IDs: ${progress.failed.join(', ')}`);
  }
}

main().catch(console.error);
