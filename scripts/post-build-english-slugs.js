#!/usr/bin/env node
/**
 * Post-build script: creates English-slug aliases for translated listicle pages.
 * Instead of rendering ~3,500 extra pages through Next.js, this copies the
 * already-rendered translated HTML files with English slug filenames.
 * The canonical tag in each file already points to the translated slug URL.
 *
 * Run after `next build`: node scripts/post-build-english-slugs.js
 */

const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const TRANSLATIONS_DIR = path.join(__dirname, '..', 'public', 'translations');
const LANGUAGES = ['ar', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ms', 'pt', 'ru', 'th', 'tl', 'vi'];

let copied = 0;
let skipped = 0;

for (const lang of LANGUAGES) {
  const listiclesPath = path.join(TRANSLATIONS_DIR, lang, 'listicles.json');
  if (!fs.existsSync(listiclesPath)) continue;

  const listicles = JSON.parse(fs.readFileSync(listiclesPath, 'utf-8'));
  const listsDir = path.join(OUT_DIR, lang, 'blog', 'lists');

  if (!fs.existsSync(listsDir)) continue;

  for (const listicle of listicles) {
    const translatedSlug = listicle.slug;
    const englishSlug = listicle.originalSlug;

    if (!englishSlug || englishSlug === translatedSlug) continue;

    const srcHtml = path.join(listsDir, `${translatedSlug}.html`);
    const destHtml = path.join(listsDir, `${englishSlug}.html`);

    // Don't overwrite if English slug page already exists
    if (fs.existsSync(destHtml)) {
      skipped++;
      continue;
    }

    if (!fs.existsSync(srcHtml)) {
      skipped++;
      continue;
    }

    // Copy HTML file (hardlink for speed + zero extra disk space)
    try {
      fs.linkSync(srcHtml, destHtml);
      copied++;
    } catch {
      // Fallback to copy if hardlink fails
      fs.copyFileSync(srcHtml, destHtml);
      copied++;
    }

    // Also copy the .txt file if it exists (RSC payload)
    const srcTxt = path.join(listsDir, `${translatedSlug}.txt`);
    const destTxt = path.join(listsDir, `${englishSlug}.txt`);
    if (fs.existsSync(srcTxt) && !fs.existsSync(destTxt)) {
      try {
        fs.linkSync(srcTxt, destTxt);
      } catch {
        fs.copyFileSync(srcTxt, destTxt);
      }
    }
  }
}

console.log(`Post-build English slugs: ${copied} created, ${skipped} skipped`);
