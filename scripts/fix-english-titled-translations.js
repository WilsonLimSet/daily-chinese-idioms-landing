#!/usr/bin/env node
/**
 * Find translation files whose title is still in English (translation regression)
 * and rewrite the title + description in the target language using GPT-4o.
 *
 * Usage:
 *   node scripts/fix-english-titled-translations.js --dry-run
 *   node scripts/fix-english-titled-translations.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const TRANS_DIR = path.join(__dirname, '..', 'content/blog/translations');

const LANG_NAMES = {
  es: 'Spanish', pt: 'Brazilian Portuguese', id: 'Indonesian', vi: 'Vietnamese',
  ja: 'Japanese', ko: 'Korean', th: 'Thai', hi: 'Hindi', ar: 'Arabic',
  fr: 'French', de: 'German', tl: 'Filipino/Tagalog', ms: 'Malay', ru: 'Russian',
};

// Common English stop words + filler
const ENGLISH_INDICATORS = new Set([
  'the','a','an','of','in','for','with','to','on','at','is','it','how','why',
  'what','when','from','this','that','real','famous','quotes','chinese',
  'explained','history','behind','drama','character','study','learn','every',
  'fan','should','know','ghost','culture','symbolism','meaning','matters',
  'between','supporting','actors','stars','became','story','based','true',
  'made','into','essential','vocabulary','idioms','phrases','watching',
  'ink','making','ming','dynasty','terms','tradition','night','watchmen',
  'spies','daoist','emperor',
]);
const BRAND_ANCHORS = new Set([
  'pursuit','jade','love','beyond','grave','guardians','dafeng','first',
  'frost','unveil','jadewind','rebirth','generation','heir','princess',
  'agents','chu','qiao','xie','zheng','fan','changyu','simu','duan','xu',
  'he','li','peiyi','judge','dee','wen','yifan','sang','yan','nan','hong',
]);

function isEnglishTitle(title) {
  if (!title) return false;
  const cleaned = title.replace(/[^\w\s]/g, ' ').toLowerCase();
  const words = cleaned.split(/\s+/).filter(Boolean);
  // Drop brand-anchor words (not indicative of language)
  const testable = words.filter(w => !BRAND_ANCHORS.has(w) && !/^[0-9]+$/.test(w));
  if (testable.length < 3) return false;
  const englishCount = testable.filter(w => ENGLISH_INDICATORS.has(w)).length;
  return englishCount / testable.length >= 0.5;
}

async function translateMeta({ lang, langName, title, description, bodySnippet }) {
  const prompt = `Translate the following blog-article title and description from English into ${langName}. Keep proper names (drama titles, character names, pinyin) and Chinese characters intact. Keep "Pursuit of Jade (逐玉)" and similar brand anchors as-is.

ORIGINAL TITLE (English): ${title}
ORIGINAL DESCRIPTION (English): ${description}

Article body excerpt (for context, already in ${langName}):
"""
${bodySnippet}
"""

Return ONLY JSON:
{"title": "<${langName} title, 55-75 chars>", "description": "<${langName} description, 140-160 chars>"}`;

  const res = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 400,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });
  return JSON.parse(res.choices[0].message.content);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const affected = [];
  for (const lang of fs.readdirSync(TRANS_DIR)) {
    const langDir = path.join(TRANS_DIR, lang);
    if (!fs.statSync(langDir).isDirectory()) continue;
    if (!LANG_NAMES[lang]) continue;

    for (const f of fs.readdirSync(langDir)) {
      if (!f.endsWith('.md')) continue;
      try {
        const raw = fs.readFileSync(path.join(langDir, f), 'utf-8');
        const { data, content } = matter(raw);
        if (isEnglishTitle(data.title)) affected.push({ lang, file: f, data, content });
      } catch {}
    }
  }

  console.log(`${dryRun ? '[DRY RUN] ' : ''}Found ${affected.length} file(s) with English titles\n`);

  for (const { lang, file, data, content } of affected) {
    console.log(`  ${lang}/${file}`);
    console.log(`    old title: ${data.title}`);
    try {
      const bodySnippet = content.slice(0, 500).replace(/\s+/g, ' ').trim();
      const { title, description } = await translateMeta({
        lang,
        langName: LANG_NAMES[lang],
        title: data.title || '',
        description: data.description || '',
        bodySnippet,
      });
      console.log(`    new title: ${title}`);
      console.log(`    new desc:  ${description}`);
      if (!dryRun) {
        data.title = title;
        data.description = description;
        fs.writeFileSync(path.join(TRANS_DIR, lang, file), matter.stringify(content, data));
      }
    } catch (err) {
      console.log(`    ✗ failed: ${err.message}`);
    }
    console.log('');
  }
  console.log(dryRun ? 'Dry run complete.' : 'Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
