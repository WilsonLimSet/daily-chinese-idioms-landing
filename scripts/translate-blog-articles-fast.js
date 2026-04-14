#!/usr/bin/env node
/**
 * Fast Blog Article Translation using OpenAI (parallel batches)
 * Runs 5 translations concurrently for ~5x speedup over sequential Gemini.
 *
 * Usage:
 *   node scripts/translate-blog-articles-fast.js
 *   node scripts/translate-blog-articles-fast.js --lang es
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CONCURRENCY = parseInt(process.env.CONCURRENCY) || 10;

const LANGUAGES = {
  'es': 'Spanish', 'pt': 'Brazilian Portuguese', 'id': 'Indonesian',
  'vi': 'Vietnamese', 'ja': 'Japanese', 'ko': 'Korean', 'th': 'Thai',
  'hi': 'Hindi', 'ar': 'Arabic', 'fr': 'French', 'de': 'German', 'tl': 'Filipino/Tagalog',
  'ms': 'Malay', 'ru': 'Russian'
};

const BLOG_DIR = path.join(__dirname, '../content/blog');
const TRANSLATIONS_DIR = path.join(__dirname, '../content/blog/translations');

function getExistingTranslations(lang) {
  const langDir = path.join(TRANSLATIONS_DIR, lang);
  if (!fs.existsSync(langDir)) return new Set();
  return new Set(fs.readdirSync(langDir).filter(f => f.endsWith('.md')));
}

async function translateArticle(filename, content, frontmatter, lang, langName) {
  const prompt = `Translate this blog article from English to ${langName}.

RULES:
1. Translate ALL English text naturally into ${langName}
2. DO NOT translate: Chinese characters (汉字), pinyin (tone marks like wò xīn cháng dǎn), proper names (Fan Changyu, Xie Zheng, Zhang Linghe, Tian Xiwei), drama title 逐玉
3. Keep ALL markdown formatting (##, **, *, >, |, ---, links) exactly as-is
4. Keep ALL internal link paths unchanged (e.g. /blog/wo-xin-chang-dan)
5. Keep Chinese text in quotes/examples — only translate English explanations
6. For tables: translate column names but keep Chinese/Pinyin values
7. Translate "Pursuit of Jade" on first mention, then use both forms
8. Keep HSK references unchanged

FRONTMATTER (return as JSON on first line):
- title: "${frontmatter.title}"
- description: "${frontmatter.description}"

ARTICLE:
${content}

Format your response EXACTLY as:
FRONTMATTER_JSON: {"title": "...", "description": "..."}
---BODY---
(translated markdown)`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 16384,
        temperature: 0.1,
      });

      const response = result.choices[0].message.content;
      const fmMatch = response.match(/FRONTMATTER_JSON:\s*(\{[^\n]+\})/);
      if (!fmMatch) throw new Error('No frontmatter JSON found');

      const translatedFm = JSON.parse(fmMatch[1]);
      const body = response.split('---BODY---')[1]?.trim();
      if (!body) throw new Error('No body found');

      return { frontmatter: translatedFm, body };
    } catch (err) {
      console.error(`  Attempt ${attempt}/3 failed: ${err.message}`);
      if (attempt === 3) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

async function processOne({ file, lang, langName }) {
  const rawContent = fs.readFileSync(path.join(BLOG_DIR, file), 'utf-8');
  const { data: fm, content } = matter(rawContent);

  const translated = await translateArticle(file, content, fm, lang, langName);

  const translatedFm = { ...fm, title: translated.frontmatter.title, description: translated.frontmatter.description };
  const langDir = path.join(TRANSLATIONS_DIR, lang);
  if (!fs.existsSync(langDir)) fs.mkdirSync(langDir, { recursive: true });

  const output = matter.stringify(translated.body, translatedFm);
  fs.writeFileSync(path.join(langDir, file), output);
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  const langFilter = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;

  const articles = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  const languages = langFilter ? { [langFilter]: LANGUAGES[langFilter] } : LANGUAGES;

  // Build work queue (skip already translated)
  const work = [];
  for (const file of articles) {
    for (const [lang, langName] of Object.entries(languages)) {
      if (!getExistingTranslations(lang).has(file)) {
        work.push({ file, lang, langName });
      }
    }
  }

  console.log(`${work.length} translations remaining (${articles.length * Object.keys(languages).length - work.length} already done)\n`);
  if (work.length === 0) { console.log('All done!'); return; }

  let done = 0, failed = 0;

  // Process in parallel batches
  for (let i = 0; i < work.length; i += CONCURRENCY) {
    const batch = work.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(async (item) => {
        process.stdout.write(`[${done + 1}/${work.length}] ${item.file} → ${item.lang}...`);
        await processOne(item);
        done++;
        console.log(` ✓`);
      })
    );
    results.forEach((r, idx) => {
      if (r.status === 'rejected') {
        failed++;
        done++;
        console.log(` ✗ ${batch[idx].lang}/${batch[idx].file}: ${r.reason.message}`);
      }
    });
  }

  console.log(`\nDone! ${done - failed} translated, ${failed} failed.`);
}

main().catch(console.error);
