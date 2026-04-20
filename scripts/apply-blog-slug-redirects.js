#!/usr/bin/env node
/**
 * Reads content/blog/slug-redirects.json (produced by
 * migrate-blog-slugs-to-localized.js) and inserts permanent 301 redirects
 * into vercel.json for every old English-slug URL -> new localized URL.
 *
 * Idempotent: skips pairs that already exist in vercel.json redirects.
 *
 * Usage:
 *   node scripts/apply-blog-slug-redirects.js           # writes vercel.json
 *   node scripts/apply-blog-slug-redirects.js --dry-run # print count only
 */

const fs = require('fs');
const path = require('path');

const REDIRECTS_JSON = path.join(__dirname, '../content/blog/slug-redirects.json');
const VERCEL_JSON = path.join(__dirname, '../vercel.json');

function main() {
  const dryRun = process.argv.includes('--dry-run');

  const { articles } = JSON.parse(fs.readFileSync(REDIRECTS_JSON, 'utf-8'));
  const vercel = JSON.parse(fs.readFileSync(VERCEL_JSON, 'utf-8'));
  vercel.redirects = vercel.redirects || [];

  // Index existing redirect sources so we never double-add
  const existingSources = new Set(vercel.redirects.map(r => r.source));

  const toAdd = [];
  for (const [originalSlug, bylang] of Object.entries(articles)) {
    for (const [lang, localizedSlug] of Object.entries(bylang)) {
      if (!localizedSlug || localizedSlug === originalSlug) continue;
      const source = `/${lang}/blog/${originalSlug}`;
      const destination = `/${lang}/blog/${localizedSlug}`;
      if (existingSources.has(source)) continue;
      toAdd.push({ source, destination, permanent: true });
    }
  }

  console.log(`${toAdd.length} redirect pair(s) to add (${existingSources.size} already in vercel.json)`);
  if (dryRun) {
    console.log('Sample:');
    toAdd.slice(0, 5).forEach(r => console.log(`  ${r.source}  →  ${r.destination}`));
    return;
  }

  if (toAdd.length === 0) { console.log('Nothing to do.'); return; }

  vercel.redirects.push(...toAdd);
  fs.writeFileSync(VERCEL_JSON, JSON.stringify(vercel, null, 2));
  console.log(`✅ Added ${toAdd.length} redirects. Total now: ${vercel.redirects.length}.`);
}

main();
