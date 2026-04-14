#!/usr/bin/env node
/**
 * Post-build: rewrite <html lang="en"> to <html lang="{code}"> for every page
 * under out/{code}/** where code is a supported non-English locale.
 *
 * Static export forces a single root layout, so we can't set lang per route
 * at build time. This is the standard workaround — a byte-level rewrite of
 * the generated HTML files. Idempotent: skips files that already have the
 * correct lang attribute.
 */
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');
const LOCALES = ['ar', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ms', 'pt', 'ru', 'th', 'tl', 'vi'];

// Match the very first <html ...> tag's lang attribute only. Anchored to the
// document's opening so we don't rewrite any embedded literal `<html>` strings
// that may appear in structured data or JS payloads.
const LANG_RE = /(<!DOCTYPE html>[^<]*<!--[^-]*(?:-(?!->)[^-]*)*-->)?\s*<html\s+lang="en"/i;

function walk(dir, fileList = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, fileList);
    else if (entry.isFile() && entry.name.endsWith('.html')) fileList.push(full);
  }
  return fileList;
}

let patched = 0;
let skipped = 0;

for (const lang of LOCALES) {
  const langDir = path.join(OUT_DIR, lang);
  if (!fs.existsSync(langDir)) continue;
  const files = walk(langDir);
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    // Check the FIRST <html> tag specifically (not anywhere in the file).
    // Match the doctype + optional Next.js comment + first <html ...> tag.
    const firstHtmlMatch = html.match(/<!DOCTYPE html>[^<]*(?:<!--[^>]*-->)?\s*<html[^>]*>/i);
    if (!firstHtmlMatch) { skipped++; continue; }
    if (firstHtmlMatch[0].includes(`lang="${lang}"`)) { skipped++; continue; }
    // Replace lang="en" only within that first <html> tag
    const newFirstHtml = firstHtmlMatch[0].replace(/lang="en"/, `lang="${lang}"`);
    if (newFirstHtml === firstHtmlMatch[0]) { skipped++; continue; }
    const replaced = html.replace(firstHtmlMatch[0], newFirstHtml);
    fs.writeFileSync(file, replaced);
    patched++;
  }
}

console.log(`Post-build html lang rewrite: ${patched} files patched, ${skipped} already correct`);
