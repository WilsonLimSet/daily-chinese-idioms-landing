#!/usr/bin/env node
/**
 * Poem & Poet Translation Script using OpenAI GPT-4o-mini
 * Runs in parallel with the Gemini version for speed.
 *
 * Usage:
 *   node scripts/translate-poems-poets-openai.js                        # All remaining languages
 *   node scripts/translate-poems-poets-openai.js --lang ja              # One language
 *   node scripts/translate-poems-poets-openai.js --type poems           # Only poems
 *   node scripts/translate-poems-poets-openai.js --fix                  # Re-translate English fallbacks
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const POEM_BATCH_SIZE = parseInt(process.env.TRANSLATE_BATCH_SIZE || '5');
const POET_BATCH_SIZE = parseInt(process.env.TRANSLATE_BATCH_SIZE || '3');
const MAX_RETRIES = 3;
const CONCURRENCY = 3; // parallel API calls

const LANGUAGES = {
  'es': 'Spanish', 'pt': 'Portuguese', 'id': 'Indonesian', 'vi': 'Vietnamese',
  'ja': 'Japanese', 'ko': 'Korean', 'th': 'Thai', 'hi': 'Hindi',
  'ar': 'Arabic', 'fr': 'French', 'tl': 'Filipino/Tagalog', 'ms': 'Malay', 'ru': 'Russian'
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ─── Extract poems from TypeScript source ───
function extractPoems() {
  const poemsPath = path.join(__dirname, '../src/lib/poems.ts');
  const content = fs.readFileSync(poemsPath, 'utf-8');
  const poems = [];
  const idMatches = [...content.matchAll(/id: '(P\d+)'/g)];

  for (const idMatch of idMatches) {
    const id = idMatch[1];
    const startIdx = content.lastIndexOf('{', idMatch.index);
    let depth = 0, endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
    const objStr = content.substring(startIdx, endIdx);

    const get = (key) => {
      const m = objStr.match(new RegExp(`${key}:\\s*'([^']*)'`));
      return m ? m[1].replace(/\\'/g, "'") : '';
    };
    const getMultiline = (key) => {
      const m = objStr.match(new RegExp(`${key}:\\s*'([\\s\\S]*?)(?<!\\\\)'\\s*,`));
      if (m) return m[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
      return '';
    };

    // Extract lines array
    const linesSection = objStr.match(/lines:\s*\[([\s\S]*?)\]\s*,\s*traditionalChinese/);
    const lines = [];
    if (linesSection) {
      const lineObjs = linesSection[1].match(/\{[^}]+\}/g) || [];
      for (const lo of lineObjs) {
        const chinese = lo.match(/chinese:\s*'([^']*)'/)?.[1] || '';
        const pinyin = lo.match(/pinyin:\s*'([^']*)'/)?.[1] || '';
        lines.push({ chinese, pinyin });
      }
    }

    // Extract poet sub-object
    const poetSection = objStr.match(/poet:\s*\{([\s\S]*?)\}\s*,\s*lines/);
    const poet = {};
    if (poetSection) {
      const ps = poetSection[1];
      poet.name = ps.match(/name:\s*'([^']*)'/)?.[1] || '';
      poet.nameChinese = ps.match(/nameChinese:\s*'([^']*)'/)?.[1] || '';
      poet.dynasty = ps.match(/dynasty:\s*'([^']*)'/)?.[1] || '';
      poet.dynastyChinese = ps.match(/dynastyChinese:\s*'([^']*)'/)?.[1] || '';
      poet.birthYear = ps.match(/birthYear:\s*'([^']*)'/)?.[1] || '';
      poet.deathYear = ps.match(/deathYear:\s*'([^']*)'/)?.[1] || '';
      poet.bio = (ps.match(/bio:\s*'([\\s\\S]*?)(?<!\\\\)'/) || [])[1]?.replace(/\\'/g, "'") || '';
    }

    const poem = {
      id, slug: get('slug'), title: get('title'),
      titleChinese: get('titleChinese'), titlePinyin: get('titlePinyin'),
      poet, lines,
      traditionalChinese: get('traditionalChinese'),
      translation: getMultiline('translation'),
      background: getMultiline('background'),
      analysis: getMultiline('analysis'),
      form: get('form'), theme: get('theme'),
    };
    if (poem.slug) poems.push(poem);
  }
  return poems;
}

// ─── Extract poets from TypeScript source ───
function extractPoets() {
  const poetsPath = path.join(__dirname, '../src/lib/poets.ts');
  const content = fs.readFileSync(poetsPath, 'utf-8');
  const poets = [];
  const slugMatches = [...content.matchAll(/slug: '([^']+)',\s*\n\s*name: '([^']+)'/g)];

  for (const slugMatch of slugMatches) {
    const slug = slugMatch[1];
    const startIdx = content.lastIndexOf('{', slugMatch.index);
    let depth = 0, endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }
    const objStr = content.substring(startIdx, endIdx);

    const get = (key) => {
      const m = objStr.match(new RegExp(`(?<![a-zA-Z])${key}:\\s*'([^']*)'`));
      return m ? m[1].replace(/\\'/g, "'") : '';
    };
    const getMultiline = (key) => {
      const m = objStr.match(new RegExp(`(?<![a-zA-Z])${key}:\\s*'([\\s\\S]*?)(?<!\\\\)'\\s*,`));
      return m ? m[1].replace(/\\'/g, "'") : '';
    };

    const linesMatch = objStr.match(/famousLines:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
    const famousLines = [];
    if (linesMatch) {
      const lineObjects = linesMatch[1].match(/\{[^}]+\}/g) || [];
      for (const lo of lineObjects) {
        famousLines.push({
          chinese: lo.match(/chinese:\s*'([^']*)'/)?.[1] || '',
          pinyin: lo.match(/pinyin:\s*'([^']*)'/)?.[1] || '',
          english: (lo.match(/english:\s*'([^']*)'/)?.[1] || '').replace(/\\'/g, "'"),
          from: (lo.match(/from:\s*'([^']*)'/)?.[1] || '').replace(/\\'/g, "'"),
        });
      }
    }

    poets.push({
      slug, name: get('name'), nameChinese: get('nameChinese'),
      nameTraditional: get('nameTraditional'), courtesy: get('courtesy'),
      courtesyChinese: get('courtesyChinese'), dynasty: get('dynasty'),
      dynastyChinese: get('dynastyChinese'), birthYear: get('birthYear'),
      deathYear: get('deathYear'), title: get('title'),
      bio: getMultiline('bio'), style: getMultiline('style'),
      legacy: getMultiline('legacy'), famousLines,
    });
  }
  return poets.filter(p => p.slug && p.name);
}

// ─── OpenAI API call with retry ───
async function callOpenAI(prompt) {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a professional translator. Always respond with valid JSON only, no markdown fences.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 8192,
        response_format: { type: 'json_object' },
      });
      const text = response.choices[0].message.content.trim();
      const parsed = JSON.parse(text);
      return parsed.items || parsed.results || parsed.data || (Array.isArray(parsed) ? parsed : null) || [parsed];
    } catch (error) {
      console.error(`    API error (attempt ${attempt + 1}): ${error.message}`);
      if (attempt < MAX_RETRIES) await sleep(2000);
      else return null;
    }
  }
}

// ─── Translate poems batch ───
async function translatePoemBatch(poems, langName) {
  const items = poems.map(p => ({
    slug: p.slug,
    title: p.title,
    translation: p.translation,
    background: p.background,
    analysis: p.analysis,
  }));

  const prompt = `Translate these Chinese poem descriptions to ${langName}.
DO NOT translate Chinese characters or pinyin. Only translate the English text fields.
Keep "slug" unchanged.

Input: ${JSON.stringify(items)}

Return JSON: {"items": [{"slug": "...", "title": "...", "translation": "...", "background": "...", "analysis": "..."}]}`;

  return callOpenAI(prompt);
}

// ─── Translate poets batch ───
async function translatePoetBatch(poets, langName) {
  const items = poets.map(p => ({
    slug: p.slug,
    title: p.title,
    bio: p.bio,
    style: p.style,
    legacy: p.legacy,
    famousLines: p.famousLines.map(l => ({ english: l.english, from: l.from })),
  }));

  const prompt = `Translate these Chinese poet profiles to ${langName}.
DO NOT translate Chinese names, characters, or pinyin. Only translate the English text.
Keep "slug" unchanged.

Input: ${JSON.stringify(items)}

Return JSON: {"items": [{"slug": "...", "title": "...", "bio": "...", "style": "...", "legacy": "...", "famousLines": [{"english": "...", "from": "..."}]}]}`;

  return callOpenAI(prompt);
}

// ─── Process one language ───
async function processLanguage(langCode, langName, allPoems, allPoets, doPoems, doPoets, fixMode) {
  console.log(`\n=== ${langName} (${langCode}) ===`);
  const transDir = path.join(__dirname, `../public/translations/${langCode}`);
  if (!fs.existsSync(transDir)) fs.mkdirSync(transDir, { recursive: true });

  // ─── Poems ───
  if (doPoems) {
    const poemsFile = path.join(transDir, 'poems.json');
    let existing = fs.existsSync(poemsFile) ? JSON.parse(fs.readFileSync(poemsFile, 'utf-8')) : [];

    let toTranslate;
    if (fixMode) {
      // Find poems where translation matches English (failed/fallback)
      const sourceMap = new Map(allPoems.map(p => [p.slug, p]));
      const needsFix = existing.filter(p => {
        const src = sourceMap.get(p.originalSlug || p.slug);
        return src && p.translation === src.translation;
      });
      toTranslate = needsFix.map(p => sourceMap.get(p.originalSlug || p.slug));
      // Remove the broken ones from existing
      const fixSlugs = new Set(toTranslate.map(p => p.slug));
      existing = existing.filter(p => !fixSlugs.has(p.originalSlug || p.slug));
    } else {
      const existingSlugs = new Set(existing.map(p => p.originalSlug || p.slug));
      toTranslate = allPoems.filter(p => !existingSlugs.has(p.slug));
    }

    if (toTranslate.length === 0) {
      console.log(`  Poems: ${fixMode ? 'no fixes needed' : 'all translated'}`);
    } else {
      console.log(`  Poems: translating ${toTranslate.length}...`);
      for (let i = 0; i < toTranslate.length; i += POEM_BATCH_SIZE) {
        const batch = toTranslate.slice(i, i + POEM_BATCH_SIZE);
        console.log(`    Batch: ${batch.map(p => p.slug).join(', ')}`);
        const results = await translatePoemBatch(batch, langName);
        if (results) {
          for (let j = 0; j < batch.length; j++) {
            const r = results[j] || results.find(r => r.slug === batch[j].slug);
            if (r) {
              existing.push({
                ...batch[j], originalSlug: batch[j].slug,
                title: r.title || batch[j].title,
                translation: r.translation || batch[j].translation,
                background: r.background || batch[j].background,
                analysis: r.analysis || batch[j].analysis,
              });
            } else {
              existing.push({ ...batch[j], originalSlug: batch[j].slug });
            }
          }
        } else {
          batch.forEach(p => existing.push({ ...p, originalSlug: p.slug }));
        }
      }
      fs.writeFileSync(poemsFile, JSON.stringify(existing, null, 2));
      console.log(`    Saved ${existing.length} poems`);
    }
  }

  // ─── Poets ───
  if (doPoets) {
    const poetsFile = path.join(transDir, 'poets.json');
    let existing = fs.existsSync(poetsFile) ? JSON.parse(fs.readFileSync(poetsFile, 'utf-8')) : [];

    let toTranslate;
    if (fixMode) {
      const sourceMap = new Map(allPoets.map(p => [p.slug, p]));
      const needsFix = existing.filter(p => {
        const src = sourceMap.get(p.originalSlug || p.slug);
        return src && p.bio === src.bio;
      });
      toTranslate = needsFix.map(p => sourceMap.get(p.originalSlug || p.slug));
      const fixSlugs = new Set(toTranslate.map(p => p.slug));
      existing = existing.filter(p => !fixSlugs.has(p.originalSlug || p.slug));
    } else {
      const existingSlugs = new Set(existing.map(p => p.originalSlug || p.slug));
      toTranslate = allPoets.filter(p => !existingSlugs.has(p.slug));
    }

    if (toTranslate.length === 0) {
      console.log(`  Poets: ${fixMode ? 'no fixes needed' : 'all translated'}`);
    } else {
      console.log(`  Poets: translating ${toTranslate.length}...`);
      for (let i = 0; i < toTranslate.length; i += POET_BATCH_SIZE) {
        const batch = toTranslate.slice(i, i + POET_BATCH_SIZE);
        console.log(`    Batch: ${batch.map(p => p.slug).join(', ')}`);
        const results = await translatePoetBatch(batch, langName);
        if (results) {
          for (let j = 0; j < batch.length; j++) {
            const r = results[j] || results.find(r => r.slug === batch[j].slug);
            if (r) {
              const merged = {
                ...batch[j], originalSlug: batch[j].slug,
                title: r.title || batch[j].title,
                bio: r.bio || batch[j].bio,
                style: r.style || batch[j].style,
                legacy: r.legacy || batch[j].legacy,
              };
              if (r.famousLines) {
                merged.famousLines = batch[j].famousLines.map((l, k) => ({
                  ...l,
                  english: r.famousLines[k]?.english || l.english,
                  from: r.famousLines[k]?.from || l.from,
                }));
              }
              existing.push(merged);
            } else {
              existing.push({ ...batch[j], originalSlug: batch[j].slug });
            }
          }
        } else {
          batch.forEach(p => existing.push({ ...p, originalSlug: p.slug }));
        }
      }
      fs.writeFileSync(poetsFile, JSON.stringify(existing, null, 2));
      console.log(`    Saved ${existing.length} poets`);
    }
  }
}

// ─── Main with concurrency ───
async function main() {
  const args = process.argv.slice(2);
  const langArg = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;
  const typeArg = args.includes('--type') ? args[args.indexOf('--type') + 1] : null;
  const fixMode = args.includes('--fix');

  const doPoems = !typeArg || typeArg === 'poems';
  const doPoets = !typeArg || typeArg === 'poets';

  const allPoems = doPoems ? extractPoems() : [];
  const allPoets = doPoets ? extractPoets() : [];

  console.log('Poem & Poet Translation (OpenAI)');
  console.log('================================');
  if (doPoems) console.log(`Found ${allPoems.length} poems`);
  if (doPoets) console.log(`Found ${allPoets.length} poets`);
  if (fixMode) console.log('FIX MODE: re-translating English fallbacks');

  const langs = langArg ? [[langArg, LANGUAGES[langArg]]] : Object.entries(LANGUAGES);
  if (langArg && !LANGUAGES[langArg]) {
    console.error(`Unknown language: ${langArg}`);
    process.exit(1);
  }

  // Process languages with concurrency
  const queue = [...langs];
  const active = [];

  while (queue.length > 0 || active.length > 0) {
    while (active.length < CONCURRENCY && queue.length > 0) {
      const [code, name] = queue.shift();
      const promise = processLanguage(code, name, allPoems, allPoets, doPoems, doPoets, fixMode)
        .then(() => { active.splice(active.indexOf(promise), 1); });
      active.push(promise);
    }
    if (active.length > 0) await Promise.race(active);
  }

  console.log('\nDone!');
}

main().catch(console.error);
