#!/usr/bin/env node
// Quick audit + fix for German translations.
// - Merges missing non-translatable structural fields from source into de JSON files
// - Reports: schema drift vs fr (reference), english left inside values, long meta descriptions, slug collisions

const fs = require('fs');
const path = require('path');

function read(p) { try { return JSON.parse(fs.readFileSync(p, 'utf-8')); } catch { return null; } }
function keys(obj) { return obj && typeof obj === 'object' ? Object.keys(obj) : []; }
function deepKeys(obj, prefix = '') {
  if (!obj || typeof obj !== 'object') return [];
  if (Array.isArray(obj)) return obj.length ? deepKeys(obj[0], prefix) : [];
  return Object.keys(obj).flatMap(k => {
    const v = obj[k];
    const p = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) return [p, ...deepKeys(v, p)];
    if (Array.isArray(v) && v.length && typeof v[0] === 'object') return [p, ...deepKeys(v[0], p + '[0]')];
    return [p];
  });
}

const out = { issues: [], fixes: [] };

// 1. Poems: merge missing poet object + lines + traditionalChinese from source TS
function fixPoems() {
  try {
    const { poems: source } = require('../src/lib/poems.ts');
    const dePath = 'public/translations/de/poems.json';
    const de = read(dePath);
    if (!de) { out.issues.push('de/poems.json not found'); return; }
    const bySlug = new Map(source.map(p => [p.slug, p]));
    let patched = 0;
    for (const p of de) {
      const src = bySlug.get(p.slug) || bySlug.get(p.originalSlug);
      if (!src) continue;
      if (!p.poet) { p.poet = src.poet; patched++; }
      if (!p.lines) { p.lines = src.lines; patched++; }
      if (!p.traditionalChinese) { p.traditionalChinese = src.traditionalChinese; patched++; }
      // Remove the model's bogus poetName field if poet object now exists
      if (p.poet && 'poetName' in p) delete p.poetName;
    }
    if (patched > 0) {
      fs.writeFileSync(dePath, JSON.stringify(de, null, 2));
      out.fixes.push(`poems.json: patched ${patched} missing fields across ${de.length} poems`);
    }
  } catch (e) { out.issues.push('poems fix failed: ' + e.message); }
}

// 2. Poets: compare schema vs fr
function auditSchemaVsFr(name) {
  const fr = read(`public/translations/fr/${name}.json`);
  const de = read(`public/translations/de/${name}.json`);
  if (!fr || !de) { out.issues.push(`${name}: could not load fr or de`); return; }
  const frK = new Set(deepKeys(fr));
  const deK = new Set(deepKeys(de));
  const missing = [...frK].filter(k => !deK.has(k));
  const extra = [...deK].filter(k => !frK.has(k));
  if (missing.length) out.issues.push(`${name}: DE missing fields vs FR: ${missing.join(', ')}`);
  if (extra.length) out.issues.push(`${name}: DE has extra fields vs FR: ${extra.join(', ')}`);
}

// 3. Fix poets.json if schema-drifted — merge from source
function fixPoets() {
  try {
    const { poets: source } = require('../src/lib/poets.ts');
    const dePath = 'public/translations/de/poets.json';
    const de = read(dePath);
    if (!de) return;
    const fr = read('public/translations/fr/poets.json');
    if (!fr) return;
    const frKeys = new Set(Object.keys(fr[0] || {}));
    const deKeys = new Set(Object.keys(de[0] || {}));
    const missing = [...frKeys].filter(k => !deKeys.has(k));
    if (missing.length === 0) return;
    // Map source by slug/id
    const byId = new Map(source.map(p => [p.id || p.slug, p]));
    let patched = 0;
    for (const p of de) {
      const src = byId.get(p.id) || byId.get(p.slug);
      if (!src) continue;
      for (const k of missing) {
        if (p[k] === undefined && src[k] !== undefined) {
          p[k] = src[k]; patched++;
        }
      }
    }
    if (patched > 0) {
      fs.writeFileSync(dePath, JSON.stringify(de, null, 2));
      out.fixes.push(`poets.json: patched ${patched} missing fields`);
    }
  } catch (e) { out.issues.push('poets fix failed: ' + e.message); }
}

// 4. Scan a sample of translation files for leftover English markers
function scanForEnglish(file, sampleCount = 20) {
  const data = read(file);
  if (!Array.isArray(data)) return;
  const sample = data.slice(0, sampleCount);
  const englishHits = [];
  const engWords = /\b(the|and|with|that|from|meaning|translation|ancient|idiom|proverb|Chinese)\b/i;
  for (const item of sample) {
    const str = JSON.stringify(item);
    // Strip known non-translated fields
    const text = str.replace(/"(slug|originalSlug|id|pinyin|characters|example_characters|traditionalChinese|titleChinese|titlePinyin|nameChinese|dynastyChinese|birthYear|deathYear)"\s*:\s*"[^"]*"/g, '');
    const matches = text.match(engWords);
    if (matches) englishHits.push({ slug: item.slug || item.id, hit: matches[0] });
  }
  if (englishHits.length > 3) {
    out.issues.push(`${file}: ${englishHits.length}/${sample.length} sampled items contain English-like words (first: ${englishHits[0].slug})`);
  }
}

// 5. Check slug consistency — DE shouldn't have totally different slugs from EN (we want originalSlug pattern)
function auditSlugs(file) {
  const data = read(file);
  if (!Array.isArray(data)) return;
  let missingOriginalSlug = 0;
  for (const item of data) {
    if (item.slug && !item.originalSlug) missingOriginalSlug++;
  }
  if (missingOriginalSlug > 0) out.issues.push(`${file}: ${missingOriginalSlug} items missing originalSlug`);
}

// 6. Meta description length check
function auditMetaLength(file) {
  const data = read(file);
  if (!Array.isArray(data)) return;
  const longMetas = data.filter(i => i.metaDescription && i.metaDescription.length > 170).slice(0, 5);
  if (longMetas.length) out.issues.push(`${file}: ${longMetas.length}+ metaDescription > 170 chars (first: ${longMetas[0].slug})`);
}

// Run
fixPoems();
fixPoets();
for (const n of ['idioms', 'listicles', 'poems', 'poets', 'phrases', 'slang', 'hsk']) {
  auditSchemaVsFr(n);
  scanForEnglish(`public/translations/de/${n}.json`);
}
auditSlugs('public/translations/de/listicles.json');
auditMetaLength('public/translations/de/listicles.json');

console.log('=== GERMAN AUDIT REPORT ===\n');
console.log('FIXES APPLIED:');
out.fixes.forEach(f => console.log('  ✓ ' + f));
console.log('\nISSUES FOUND:');
if (out.issues.length === 0) console.log('  (none)');
else out.issues.forEach(i => console.log('  ⚠ ' + i));
