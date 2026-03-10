#!/usr/bin/env node
/**
 * Poem & Poet Translation Script using Gemini 2.0 Flash
 *
 * Translates poems.ts and poets.ts content into all 13 languages.
 * Creates public/translations/{lang}/poems.json and poets.json
 *
 * Usage:
 *   node scripts/translate-poems-poets.js --dry-run        # Preview
 *   node scripts/translate-poems-poets.js                   # Run all
 *   node scripts/translate-poems-poets.js --lang es         # One language
 *   node scripts/translate-poems-poets.js --type poems      # Only poems
 *   node scripts/translate-poems-poets.js --type poets      # Only poets
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 8192,
  }
});

const RATE_LIMIT_MS = parseInt(process.env.TRANSLATE_RATE_LIMIT || '4500');
const POEM_BATCH_SIZE = parseInt(process.env.TRANSLATE_BATCH_SIZE || '3');
const POET_BATCH_SIZE = parseInt(process.env.TRANSLATE_BATCH_SIZE || '2');
const MAX_RETRIES = 3;

const LANGUAGES = {
  'es': 'Spanish', 'pt': 'Portuguese', 'id': 'Indonesian', 'vi': 'Vietnamese',
  'ja': 'Japanese', 'ko': 'Korean', 'th': 'Thai', 'hi': 'Hindi',
  'ar': 'Arabic', 'fr': 'French', 'tl': 'Filipino/Tagalog', 'ms': 'Malay', 'ru': 'Russian'
};

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

// ─── Extract poems from TypeScript source ───
function extractPoems() {
  // Use require to load the compiled module
  const poemsPath = path.join(__dirname, '../src/lib/poems.ts');
  const content = fs.readFileSync(poemsPath, 'utf-8');

  const poems = [];
  // Match each poem object by its id field
  const idMatches = [...content.matchAll(/id: '(P\d+)'/g)];

  for (const idMatch of idMatches) {
    const id = idMatch[1];
    const startIdx = content.lastIndexOf('{', idMatch.index);

    // Find the matching closing brace by counting braces
    let depth = 0;
    let endIdx = startIdx;
    for (let i = startIdx; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') depth--;
      if (depth === 0) { endIdx = i + 1; break; }
    }

    const objStr = content.substring(startIdx, endIdx);

    const poem = { id };
    const get = (key) => {
      const m = objStr.match(new RegExp(`${key}:\\s*'([^']*)'`));
      return m ? m[1].replace(/\\'/g, "'") : '';
    };
    const getMultiline = (key) => {
      // Match both single-quoted and template literals
      const m = objStr.match(new RegExp(`${key}:\\s*['"]([\\s\\S]*?)(?<!\\\\)['"]\\s*,`));
      if (m) return m[1].replace(/\\'/g, "'").replace(/\\"/g, '"');
      // Try backtick template
      const m2 = objStr.match(new RegExp(`${key}:\\s*\`([\\s\\S]*?)\``));
      return m2 ? m2[1] : '';
    };

    poem.slug = get('slug');
    poem.title = get('title');
    poem.titleChinese = get('titleChinese');
    poem.titlePinyin = get('titlePinyin');
    poem.translation = getMultiline('translation');
    poem.background = getMultiline('background');
    poem.analysis = getMultiline('analysis');
    poem.form = get('form');
    poem.theme = get('theme');

    // Extract poet name
    const poetNameMatch = objStr.match(/poet:\s*\{[^}]*name:\s*'([^']+)'/);
    poem.poetName = poetNameMatch ? poetNameMatch[1] : '';

    if (poem.slug && poem.title) {
      poems.push(poem);
    }
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

    let depth = 0;
    let endIdx = startIdx;
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

    const poet = {
      slug,
      name: get('name'),
      nameChinese: get('nameChinese'),
      nameTraditional: get('nameTraditional'),
      courtesy: get('courtesy'),
      courtesyChinese: get('courtesyChinese'),
      dynasty: get('dynasty'),
      dynastyChinese: get('dynastyChinese'),
      birthYear: get('birthYear'),
      deathYear: get('deathYear'),
      title: get('title'),
      bio: getMultiline('bio'),
      style: getMultiline('style'),
      legacy: getMultiline('legacy'),
    };

    // Extract famous lines
    const linesMatch = objStr.match(/famousLines:\s*\[([\s\S]*?)\]\s*,?\s*\}/);
    poet.famousLines = [];
    if (linesMatch) {
      const lineObjects = linesMatch[1].match(/\{[^}]+\}/g) || [];
      for (const lineObj of lineObjects) {
        const chinese = lineObj.match(/chinese:\s*'([^']*)'/)?.[1] || '';
        const pinyin = lineObj.match(/pinyin:\s*'([^']*)'/)?.[1] || '';
        const english = lineObj.match(/english:\s*'([^']*)'/)?.[1]?.replace(/\\'/g, "'") || '';
        const from = lineObj.match(/from:\s*'([^']*)'/)?.[1]?.replace(/\\'/g, "'") || '';
        poet.famousLines.push({ chinese, pinyin, english, from });
      }
    }

    if (poet.slug && poet.name) {
      poets.push(poet);
    }
  }
  return poets;
}

// ─── Translate poems ───
async function translatePoemBatch(poems, langCode, langName) {
  const items = poems.map((p, i) => `${i + 1}.
slug: "${p.slug}"
title: "${p.title}"
translation: "${p.translation.substring(0, 500)}"
background: "${p.background.substring(0, 400)}"
analysis: "${p.analysis.substring(0, 400)}"
form: "${p.form}"
theme: "${p.theme}"`).join('\n\n');

  const prompt = `Translate these Chinese poem descriptions to ${langName}. Return a JSON array. For each poem, translate: title, translation, background, analysis. Keep slug, form, and theme in English.

IMPORTANT: Do NOT translate the Chinese poem text itself or pinyin. Only translate the English descriptions/analysis to ${langName}.

Return format: [{ "slug": "...", "title": "...", "translation": "...", "background": "...", "analysis": "...", "form": "...", "theme": "..." }]

${items}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        return null;
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error(`  API error: ${error.message}`);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS * 2); continue; }
      return null;
    }
  }
  return null;
}

// ─── Translate poets ───
async function translatePoetBatch(poets, langCode, langName) {
  const items = poets.map((p, i) => {
    const famousLinesStr = p.famousLines.map(l => `english: "${l.english}", from: "${l.from}"`).join(' | ');
    return `${i + 1}.
slug: "${p.slug}"
name: "${p.name}"
title: "${p.title}"
bio: "${p.bio.substring(0, 400)}"
style: "${p.style.substring(0, 400)}"
legacy: "${p.legacy.substring(0, 400)}"
famousLines: [${famousLinesStr}]`;
  }).join('\n\n');

  const prompt = `Translate these Chinese poet profiles to ${langName}. Return a JSON array. For each poet translate: title, bio, style, legacy, and each famousLine's "english" and "from" fields.

IMPORTANT: Do NOT translate Chinese characters, pinyin, names, or dates. Only translate the English text to ${langName}.

Return format: [{ "slug": "...", "title": "...", "bio": "...", "style": "...", "legacy": "...", "famousLines": [{ "english": "...", "from": "..." }] }]

${items}

JSON:`;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text().trim();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS); continue; }
        return null;
      }
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error(`  API error: ${error.message}`);
      if (attempt < MAX_RETRIES) { await sleep(RATE_LIMIT_MS * 2); continue; }
      return null;
    }
  }
  return null;
}

// ─── Build full poem object for translation file ───
function buildTranslatedPoem(sourcePoem, translated) {
  return {
    ...sourcePoem,
    originalSlug: sourcePoem.slug,
    title: translated.title || sourcePoem.title,
    translation: translated.translation || sourcePoem.translation,
    background: translated.background || sourcePoem.background,
    analysis: translated.analysis || sourcePoem.analysis,
    form: translated.form || sourcePoem.form,
    theme: translated.theme || sourcePoem.theme,
  };
}

// ─── Build full poet object for translation file ───
function buildTranslatedPoet(sourcePoet, translated) {
  const result = {
    ...sourcePoet,
    originalSlug: sourcePoet.slug,
    title: translated.title || sourcePoet.title,
    bio: translated.bio || sourcePoet.bio,
    style: translated.style || sourcePoet.style,
    legacy: translated.legacy || sourcePoet.legacy,
  };

  // Merge famous lines translations
  if (translated.famousLines && Array.isArray(translated.famousLines)) {
    result.famousLines = sourcePoet.famousLines.map((line, i) => ({
      ...line,
      english: translated.famousLines[i]?.english || line.english,
      from: translated.famousLines[i]?.from || line.from,
    }));
  }

  return result;
}

// ─── Main ───
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const langArg = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;
  const typeArg = args.includes('--type') ? args[args.indexOf('--type') + 1] : null;

  const langs = langArg ? { [langArg]: LANGUAGES[langArg] } : LANGUAGES;
  if (langArg && !LANGUAGES[langArg]) {
    console.error(`Unknown language: ${langArg}. Available: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }

  const doPoems = !typeArg || typeArg === 'poems';
  const doPoets = !typeArg || typeArg === 'poets';

  const allPoems = doPoems ? extractPoems() : [];
  const allPoets = doPoets ? extractPoets() : [];

  console.log('Poem & Poet Translation Script');
  console.log('==============================');
  if (doPoems) console.log(`Found ${allPoems.length} poems`);
  if (doPoets) console.log(`Found ${allPoets.length} poets`);
  console.log(`Languages: ${Object.keys(langs).join(', ')}\n`);

  if (dryRun) {
    for (const [langCode, langName] of Object.entries(langs)) {
      const poemsFile = path.join(__dirname, `../public/translations/${langCode}/poems.json`);
      const poetsFile = path.join(__dirname, `../public/translations/${langCode}/poets.json`);
      const existingPoems = fs.existsSync(poemsFile) ? JSON.parse(fs.readFileSync(poemsFile, 'utf-8')) : [];
      const existingPoets = fs.existsSync(poetsFile) ? JSON.parse(fs.readFileSync(poetsFile, 'utf-8')) : [];
      const existingPoemSlugs = new Set(existingPoems.map(p => p.originalSlug || p.slug));
      const existingPoetSlugs = new Set(existingPoets.map(p => p.originalSlug || p.slug));
      const newPoems = allPoems.filter(p => !existingPoemSlugs.has(p.slug));
      const newPoets = allPoets.filter(p => !existingPoetSlugs.has(p.slug));
      console.log(`[${langCode}] ${langName}: ${newPoems.length} new poems, ${newPoets.length} new poets`);
    }
    return;
  }

  let totalApiCalls = 0;

  for (const [langCode, langName] of Object.entries(langs)) {
    console.log(`\n=== ${langName} (${langCode}) ===`);
    const transDir = path.join(__dirname, `../public/translations/${langCode}`);
    if (!fs.existsSync(transDir)) fs.mkdirSync(transDir, { recursive: true });

    // ─── Poems ───
    if (doPoems) {
      const poemsFile = path.join(transDir, 'poems.json');
      const existingPoems = fs.existsSync(poemsFile) ? JSON.parse(fs.readFileSync(poemsFile, 'utf-8')) : [];
      const existingPoemSlugs = new Set(existingPoems.map(p => p.originalSlug || p.slug));
      const newPoems = allPoems.filter(p => !existingPoemSlugs.has(p.slug));

      if (newPoems.length === 0) {
        console.log(`  Poems: all ${allPoems.length} already translated`);
      } else {
        console.log(`  Poems: translating ${newPoems.length} new poems...`);
        const translated = [...existingPoems];

        for (let i = 0; i < newPoems.length; i += POEM_BATCH_SIZE) {
          const batch = newPoems.slice(i, i + POEM_BATCH_SIZE);
          console.log(`    Batch ${Math.floor(i / POEM_BATCH_SIZE) + 1}: ${batch.map(p => p.slug).join(', ')}`);

          const results = await translatePoemBatch(batch, langCode, langName);
          totalApiCalls++;

          if (results) {
            for (let j = 0; j < batch.length; j++) {
              const r = results[j] || results.find(r => r.slug === batch[j].slug);
              if (r) {
                translated.push(buildTranslatedPoem(batch[j], r));
              } else {
                console.log(`      Warning: no result for ${batch[j].slug}, using English fallback`);
                translated.push({ ...batch[j], originalSlug: batch[j].slug });
              }
            }
          } else {
            console.log(`      Failed batch, using English fallback`);
            for (const p of batch) {
              translated.push({ ...p, originalSlug: p.slug });
            }
          }

          if (i + POEM_BATCH_SIZE < newPoems.length) await sleep(RATE_LIMIT_MS);
        }

        fs.writeFileSync(poemsFile, JSON.stringify(translated, null, 2));
        console.log(`    Saved ${translated.length} poems to ${poemsFile}`);
      }
    }

    // ─── Poets ───
    if (doPoets) {
      const poetsFile = path.join(transDir, 'poets.json');
      const existingPoets = fs.existsSync(poetsFile) ? JSON.parse(fs.readFileSync(poetsFile, 'utf-8')) : [];
      const existingPoetSlugs = new Set(existingPoets.map(p => p.originalSlug || p.slug));
      const newPoets = allPoets.filter(p => !existingPoetSlugs.has(p.slug));

      if (newPoets.length === 0) {
        console.log(`  Poets: all ${allPoets.length} already translated`);
      } else {
        console.log(`  Poets: translating ${newPoets.length} new poets...`);
        const translated = [...existingPoets];

        for (let i = 0; i < newPoets.length; i += POET_BATCH_SIZE) {
          const batch = newPoets.slice(i, i + POET_BATCH_SIZE);
          console.log(`    Batch ${Math.floor(i / POET_BATCH_SIZE) + 1}: ${batch.map(p => p.slug).join(', ')}`);

          const results = await translatePoetBatch(batch, langCode, langName);
          totalApiCalls++;

          if (results) {
            for (let j = 0; j < batch.length; j++) {
              const r = results[j] || results.find(r => r.slug === batch[j].slug);
              if (r) {
                translated.push(buildTranslatedPoet(batch[j], r));
              } else {
                console.log(`      Warning: no result for ${batch[j].slug}, using English fallback`);
                translated.push({ ...batch[j], originalSlug: batch[j].slug });
              }
            }
          } else {
            console.log(`      Failed batch, using English fallback`);
            for (const p of batch) {
              translated.push({ ...p, originalSlug: p.slug });
            }
          }

          if (i + POET_BATCH_SIZE < newPoets.length) await sleep(RATE_LIMIT_MS);
        }

        fs.writeFileSync(poetsFile, JSON.stringify(translated, null, 2));
        console.log(`    Saved ${translated.length} poets to ${poetsFile}`);
      }
    }

    // Rate limit between languages
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`\nDone! Total API calls: ${totalApiCalls}`);
}

main().catch(console.error);
