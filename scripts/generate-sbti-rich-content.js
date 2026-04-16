#!/usr/bin/env node
/**
 * Generate rich per-type SBTI profile content using Gemini.
 * Output: src/data/sbti-types.en.json — consumed by /sbti/[type] route.
 *
 * Fields per type:
 *   code, displayName, chineseOrigin, coreVibe
 *   tagline (1 punchy line)
 *   overview (300-400 word paragraph — what this type IS)
 *   traits (6-8 bulleted trait lines)
 *   strengths (4-6 strengths)
 *   weaknesses (4-6 weaknesses)
 *   recognitionSignals (5-7 "you might be X if..." lines)
 *   inRelationships (2-3 sentence paragraph)
 *   careerFit (2-3 sentence paragraph + 3-5 career examples)
 *   famousExamples (4-6 fictional/public figures — must be accurate)
 *   compatibleTypes (array of SBTI codes)
 *   incompatibleTypes (array of SBTI codes)
 *   howToGetThisType (2-3 sentence summary for cheat guide seed)
 *   metaTitle (60-char SEO title)
 *   metaDescription (155-char meta)
 *   keywords (10 specific long-tail keywords)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4096,
  },
});

const TYPES = [
  { code: 'CTRL', displayName: 'The Controller', chineseOrigin: '掌控者 / Ctrl key metaphor', coreVibe: 'control, execution, structure, mastery, planning' },
  { code: 'ATM-er', displayName: 'The Giver', chineseOrigin: '送钱者 (money-sender)', coreVibe: 'self-sacrifice, generosity, always pays the bill, reliable support' },
  { code: 'Dior-s', displayName: 'The Loser-Sage', chineseOrigin: '屌丝 (diao si — self-deprecating "loser") + 智者 (wise one)', coreVibe: 'low desire, anti-hustle, detachment, realistic acceptance' },
  { code: 'BOSS', displayName: 'The Leader', chineseOrigin: '老板 (lao ban — boss)', coreVibe: 'direction, authority, commanding force, upward pressure' },
  { code: 'THAN-K', displayName: 'The Thankful One', chineseOrigin: 'thank/感恩', coreVibe: 'optimism, warmth, recovery, gratitude, resilience through reframing' },
  { code: 'OH-NO', displayName: 'The Disaster Preventer', chineseOrigin: '哦不 (oh no!) — preemptive worry', coreVibe: 'risk awareness, caution, prevention, foresight, boundary-setting' },
  { code: 'GOGO', displayName: 'The Doer', chineseOrigin: '冲冲冲 (chong chong chong — go go go)', coreVibe: 'action first, decisive movement, bias toward doing over discussing' },
  { code: 'SEXY', displayName: 'The Magnetic One', chineseOrigin: '魅力者 (charismatic one)', coreVibe: 'presence, allure, attention-gravity, charisma, natural appeal' },
  { code: 'LOVE-R', displayName: 'The Romantic Maximalist', chineseOrigin: '恋爱脑 (love-brain) + lover', coreVibe: 'emotional intensity, deep devotion, idealism, all-or-nothing love' },
  { code: 'MUM', displayName: 'The Mother', chineseOrigin: '妈妈 (mom) — caregiver archetype', coreVibe: 'empathy, soothing, nurturing, emotional support, warmth' },
  { code: 'FAKE', displayName: 'The Mask Shifter', chineseOrigin: '戴面具的人 (mask-wearer)', coreVibe: 'adaptive performance, layered identity, context-shifting, strategic self-presentation' },
  { code: 'OJBK', displayName: 'The Whatever Person', chineseOrigin: 'OJBK slang ("OK 就白开" — it\'s fine)', coreVibe: 'low conflict, easygoing, go-with-the-flow, minimal friction' },
  { code: 'MALO', displayName: 'The Monkey Brain Trickster', chineseOrigin: '吗喽 (ma lou — monkey emoji slang)', coreVibe: 'playful chaos, weird ideas, anti-formality, inventive mischief' },
  { code: 'JOKE-R', displayName: 'The Clown', chineseOrigin: '小丑 (xiao chou — clown)', coreVibe: 'humor as coping, atmosphere-maker, hidden emotional depth beneath jokes' },
  { code: 'WOC', displayName: 'The "Whoa" Person', chineseOrigin: '我操 (woc exclamation)', coreVibe: 'loud dramatic reactions, bystander energy, exaggerated surprise masking real judgment' },
  { code: 'THIN-K', displayName: 'The Thinker', chineseOrigin: '思考者 (thinker)', coreVibe: 'logic, analysis, deliberation, cognitive distance, pattern recognition' },
  { code: 'SHIT', displayName: 'The Bitter World-Saver', chineseOrigin: '愤世嫉俗者 (cynic) + 有担当 (with responsibility)', coreVibe: 'cynical surface, responsible core, disillusioned but still trying' },
  { code: 'ZZZZ', displayName: 'The Deadliner', chineseOrigin: '拖延症 (procrastinator) — zzz sleep meme', coreVibe: 'delayed activation, emergency awakening, deadline-driven productivity' },
  { code: 'POOR', displayName: 'The Narrow Beam', chineseOrigin: '能量有限 (limited energy) — "poor" as in scarce', coreVibe: 'intense selective focus, hard prioritization, can only do one thing at a time' },
  { code: 'MONK', displayName: 'The Monk', chineseOrigin: '僧 / 隐士 (hermit)', coreVibe: 'solitude, sacred personal space, detachment from worldly drama' },
  { code: 'IMSB', displayName: 'The Self-Defeating Fool', chineseOrigin: '我是傻逼 (I am an idiot — self-deprecating)', coreVibe: 'impulse fighting insecurity, overcomplicating simple things, backfires' },
  { code: 'SOLO', displayName: 'The Isolated One', chineseOrigin: '孤独 (lonely)', coreVibe: 'defensive distance, hidden sensitivity, goes it alone by default' },
  { code: 'FUCK', displayName: 'The Wild Force', chineseOrigin: '野性 (wild nature)', coreVibe: 'untamed energy, raw vitality, anti-domestication, reckless instinct' },
  { code: 'DEAD', displayName: 'The Exhausted Sage', chineseOrigin: '躺平 (lying flat) — post-burnout', coreVibe: 'exhaustion, low thrill, post-meaning fatigue, wisdom through depletion' },
  { code: 'IMFW', displayName: 'The Fragile Believer', chineseOrigin: 'I\'m Fragile Whaa — emotional thin skin', coreVibe: 'sensitivity, dependence, low emotional armor, easily rattled' },
  { code: 'HHHH', displayName: 'The Fallback Laugher', chineseOrigin: '哈哈哈哈 (hahahaha) — laugh-or-cry', coreVibe: 'contradictions, bewildered absurdity, response to chaos is laughter', special: 'fallback when answers contradict across 15 dimensions' },
  { code: 'DRUNK', displayName: 'The Drunkard', chineseOrigin: '酒鬼 (jiu gui — drunkard)', coreVibe: 'hidden chaos, alcohol-triggered escapism, romantic debauchery', special: 'hidden Easter-egg type; unlocked by selecting drinking-related answers' },
];

const OTHER_TYPE_CODES = TYPES.map(t => t.code);

function buildPrompt(type) {
  return `You are writing an SEO-optimized personality-type profile for the viral Chinese "SBTI" (Silly Behavioral Type Indicator) personality test, a meme-driven alternative to MBTI with 27 types.

**Target type:** ${type.code} — ${type.displayName}
**Chinese cultural origin:** ${type.chineseOrigin}
**Core vibe:** ${type.coreVibe}
${type.special ? `**Special note:** ${type.special}` : ''}

Write a rich, unique profile that someone who just took the SBTI test and got this result would find both accurate and shareable. Audience: 18-34, internet-literate, takes memes seriously. Tone: smart but warm, slightly playful, never clinical.

Return ONLY this exact JSON shape (no preamble, no code fence):

{
  "tagline": "<one punchy line, max 12 words>",
  "overview": "<300-400 word paragraph explaining what this type IS at its core — use concrete behaviors, not vague abstractions. Include a brief nod to the Chinese cultural/slang origin of the name.>",
  "traits": ["<trait 1>", "<trait 2>", "<trait 3>", "<trait 4>", "<trait 5>", "<trait 6>"],
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>", "<strength 4>", "<strength 5>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>", "<weakness 4>", "<weakness 5>"],
  "recognitionSignals": ["<you might be ${type.code} if... 1>", "<... 2>", "<... 3>", "<... 4>", "<... 5>", "<... 6>"],
  "inRelationships": "<2-3 sentence paragraph on how this type shows up in romantic and close relationships>",
  "careerFit": "<2-3 sentence paragraph on work style + 4 specific career fits as a comma-separated list at the end>",
  "famousExamples": ["<fictional character or public figure 1 with 1-line why>", "<example 2>", "<example 3>", "<example 4>"],
  "compatibleTypes": ["<SBTI code>", "<SBTI code>", "<SBTI code>"],
  "incompatibleTypes": ["<SBTI code>", "<SBTI code>"],
  "howToGetThisType": "<2-3 sentence plain-English summary of which answer patterns would produce this type on the SBTI test — useful for a cheat-guide page>",
  "metaTitle": "<60-char SEO title containing 'SBTI ${type.code}' naturally>",
  "metaDescription": "<155-char meta description that would make someone click if they searched 'sbti ${type.code.toLowerCase()} meaning'>",
  "keywords": ["<10 specific long-tail keywords, all lowercase, each a realistic Google search>"]
}

Constraints:
- compatibleTypes and incompatibleTypes: only use codes from this list: ${OTHER_TYPE_CODES.join(', ')}
- famousExamples: use ONLY real, well-known public figures or fictional characters — never invent. If unsure, use fictional archetypes.
- metaTitle and metaDescription: natural English, not keyword-stuffed.
- keywords: must be actual phrases real people would Google (e.g., "sbti ${type.code.toLowerCase()} meaning", "what does sbti ${type.code.toLowerCase()} mean", "sbti ${type.code.toLowerCase()} personality traits").
- Return ONLY the JSON object. No markdown, no explanation.`;
}

async function generateType(type, retries = 3) {
  const prompt = buildPrompt(type);
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON in response');
      const data = JSON.parse(jsonMatch[0]);
      return {
        code: type.code,
        displayName: type.displayName,
        chineseOrigin: type.chineseOrigin,
        coreVibe: type.coreVibe,
        special: type.special || null,
        ...data,
      };
    } catch (err) {
      console.error(`  [${type.code}] attempt ${attempt}/${retries} failed: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 5000));
    }
  }
}

async function main() {
  const outPath = path.join(__dirname, '..', 'src', 'data', 'sbti-types.en.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  // Resume support: if partial file exists, skip already-generated
  let existing = {};
  if (fs.existsSync(outPath)) {
    const arr = JSON.parse(fs.readFileSync(outPath, 'utf8'));
    existing = Object.fromEntries(arr.map(t => [t.code, t]));
    console.log(`Resuming: ${Object.keys(existing).length} types already done.`);
  }

  const results = [];
  for (const type of TYPES) {
    if (existing[type.code]) {
      console.log(`  [${type.code}] skip (already generated)`);
      results.push(existing[type.code]);
      continue;
    }
    process.stdout.write(`  [${type.code}] generating... `);
    const data = await generateType(type);
    results.push(data);
    console.log(`done (${data.overview.length} chars overview)`);
    // Save incrementally so we can resume if interrupted
    fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
    // Rate limit: ~13 RPM
    await new Promise(r => setTimeout(r, 4500));
  }

  fs.writeFileSync(outPath, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} type profiles to ${outPath}`);
}

main().catch(e => {
  console.error('FATAL:', e);
  process.exit(1);
});
