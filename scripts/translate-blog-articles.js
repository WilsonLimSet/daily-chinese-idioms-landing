#!/usr/bin/env node
/**
 * Translate Blog Article Markdown Files using Gemini 2.0 Flash
 *
 * Translates long-form markdown blog posts (like Pursuit of Jade series)
 * into all 13 supported languages. Preserves markdown formatting, Chinese
 * characters, pinyin, and internal links.
 *
 * Usage:
 *   node scripts/translate-blog-articles.js --dry-run         # Preview what will be translated
 *   node scripts/translate-blog-articles.js                   # Translate all articles to all languages
 *   node scripts/translate-blog-articles.js --lang es         # Only translate to Spanish
 *   node scripts/translate-blog-articles.js --file pursuit-of-jade-chinese-idioms-every-fan-should-know.md  # Specific file
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 16384,
  }
});

const RATE_LIMIT_MS = parseInt(process.env.TRANSLATE_RATE_LIMIT || '4500');
const MAX_RETRIES = 3;

const LANGUAGES = {
  'es': 'Spanish',
  'pt': 'Brazilian Portuguese',
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'th': 'Thai',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
  'de': 'German',
  'tl': 'Filipino/Tagalog',
  'ms': 'Malay',
  'ru': 'Russian'
};

const BLOG_DIR = path.join(__dirname, '../content/blog');
const TRANSLATIONS_DIR = path.join(__dirname, '../content/blog/translations');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getArticleFiles(specificFile) {
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
  if (specificFile) {
    return files.filter(f => f === specificFile);
  }
  return files;
}

function getExistingTranslations(lang) {
  const langDir = path.join(TRANSLATIONS_DIR, lang);
  if (!fs.existsSync(langDir)) return new Set();
  return new Set(fs.readdirSync(langDir).filter(f => f.endsWith('.md')));
}

async function translateArticle(filename, content, frontmatter, lang, langName) {
  const prompt = `Translate this blog article from English to ${langName}.

CRITICAL RULES:
1. Translate ALL English text naturally into ${langName}
2. DO NOT translate: Chinese characters (汉字), pinyin (with tone marks like wò xīn cháng dǎn), proper names (Fan Changyu, Xie Zheng, Zhang Linghe, Tian Xiwei), drama titles in Chinese (逐玉)
3. Keep ALL markdown formatting exactly as-is (##, **, *, >, |, ---, links)
4. Keep ALL internal links paths unchanged (e.g., /blog/wo-xin-chang-dan stays the same)
5. Keep Chinese text in quotes/examples unchanged — only translate the English explanations around them
6. For table headers: translate column names but keep Chinese/Pinyin cell values unchanged
7. Translate the drama title "Pursuit of Jade" to ${langName} on first mention, then use both: "${langName} translation (Pursuit of Jade)"
8. Keep HSK references unchanged (HSK 1-3, HSK 4-5, etc.)

FRONTMATTER to translate (return as JSON):
- title: "${frontmatter.title}"
- description: "${frontmatter.description}"

ARTICLE BODY to translate:
${content}

Return your response in this exact format:
---FRONTMATTER_JSON---
{"title": "translated title", "description": "translated description"}
---ARTICLE_BODY---
(translated markdown body here)`;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = result.response.text();

      // Parse the response
      const frontmatterMatch = response.match(/---FRONTMATTER_JSON---\s*\n([\s\S]*?)\n---ARTICLE_BODY---/);
      if (!frontmatterMatch) {
        throw new Error('Could not parse response format');
      }

      const translatedFrontmatter = JSON.parse(frontmatterMatch[1].trim());
      const translatedBody = response.split('---ARTICLE_BODY---')[1].trim();

      return { frontmatter: translatedFrontmatter, body: translatedBody };
    } catch (err) {
      console.error(`  Attempt ${attempt}/${MAX_RETRIES} failed for ${lang}/${filename}: ${err.message}`);
      if (attempt < MAX_RETRIES) {
        await sleep(RATE_LIMIT_MS * 2);
      } else {
        throw err;
      }
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const langFilter = args.includes('--lang') ? args[args.indexOf('--lang') + 1] : null;
  const fileFilter = args.includes('--file') ? args[args.indexOf('--file') + 1] : null;

  const articles = getArticleFiles(fileFilter);
  const languages = langFilter ? { [langFilter]: LANGUAGES[langFilter] } : LANGUAGES;

  if (articles.length === 0) {
    console.log('No article files found in content/blog/');
    return;
  }

  console.log(`\nFound ${articles.length} article(s) to translate`);
  console.log(`Target languages: ${Object.keys(languages).join(', ')}\n`);

  // Calculate what needs translating
  let totalNeeded = 0;
  const work = [];

  for (const file of articles) {
    for (const [lang, langName] of Object.entries(languages)) {
      const existing = getExistingTranslations(lang);
      if (!existing.has(file)) {
        work.push({ file, lang, langName });
        totalNeeded++;
      }
    }
  }

  console.log(`${totalNeeded} translations needed (${articles.length * Object.keys(languages).length - totalNeeded} already exist)\n`);

  if (dryRun) {
    for (const { file, lang, langName } of work) {
      console.log(`  Would translate: ${file} → ${langName} (${lang})`);
    }
    return;
  }

  if (totalNeeded === 0) {
    console.log('All translations are up to date!');
    return;
  }

  // Process translations
  let completed = 0;
  let failed = 0;

  for (const { file, lang, langName } of work) {
    completed++;
    console.log(`[${completed}/${totalNeeded}] Translating ${file} → ${langName} (${lang})...`);

    try {
      // Read the English source
      const filePath = path.join(BLOG_DIR, file);
      const rawContent = fs.readFileSync(filePath, 'utf-8');
      const { data: fm, content } = matter(rawContent);

      // Translate
      const translated = await translateArticle(file, content, fm, lang, langName);

      // Build translated frontmatter
      const translatedFm = {
        ...fm,
        title: translated.frontmatter.title,
        description: translated.frontmatter.description,
      };

      // Write translated file
      const langDir = path.join(TRANSLATIONS_DIR, lang);
      if (!fs.existsSync(langDir)) {
        fs.mkdirSync(langDir, { recursive: true });
      }

      const output = matter.stringify(translated.body, translatedFm);
      fs.writeFileSync(path.join(langDir, file), output);

      console.log(`  ✓ Saved to content/blog/translations/${lang}/${file}`);
    } catch (err) {
      console.error(`  ✗ Failed: ${err.message}`);
      failed++;
    }

    // Rate limiting
    if (completed < totalNeeded) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`\nDone! ${completed - failed} translated, ${failed} failed.`);
}

main().catch(console.error);
