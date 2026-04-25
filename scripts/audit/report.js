#!/usr/bin/env node
/* eslint-disable no-console */
// Reads pulled GSC data and produces a markdown audit report.
// Run: node scripts/audit/report.js [YYYY-MM-DD]   (defaults to today)

const fs = require('fs');
const path = require('path');
const { ROOT } = require('./_lib');

const dateArg = process.argv[2] || new Date().toISOString().slice(0, 10);
const dataDir = path.join(ROOT, 'audits', 'data', dateArg);
const outFile = path.join(ROOT, 'audits', `${dateArg}.md`);

if (!fs.existsSync(dataDir)) {
  console.error(`Missing ${dataDir}. Run pull-gsc.js first.`);
  process.exit(1);
}

const load = (name) => JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));

// Load datasets
const totals28 = load('totals_last_28d.json').rows;
const totals90 = load('totals_last_90d.json').rows;
const q7 = load('queries_last_7d.json').rows;
const qP7 = load('queries_prior_7d.json').rows;
const q28 = load('queries_last_28d.json').rows;
const qP28 = load('queries_prior_28d.json').rows;
const p7 = load('pages_last_7d.json').rows;
const pP7 = load('pages_prior_7d.json').rows;
const p28 = load('pages_last_28d.json').rows;
const pP28 = load('pages_prior_28d.json').rows;
const pq28 = load('page_query_last_28d.json').rows;
const countries = load('countries_last_28d.json').rows;
const devices = load('devices_last_28d.json').rows;
const sitemaps = load('sitemaps.json');

// Helpers
const sum = (rows, k) => rows.reduce((a, r) => a + (r[k] || 0), 0);
const indexBy = (rows, key) => {
  const m = new Map();
  for (const r of rows) m.set(r.keys[key], r);
  return m;
};
const indexByQuery = (rows) => indexBy(rows, 0);
const indexByPage = (rows) => indexBy(rows, 0);
const fmt = (n) => Number.isInteger(n) ? n.toLocaleString() : n.toFixed(2);
const pct = (n) => `${(n * 100).toFixed(1)}%`;
const delta = (cur, prev) => {
  if (prev === 0) return cur > 0 ? '+∞' : '0';
  const d = ((cur - prev) / prev) * 100;
  return `${d >= 0 ? '+' : ''}${d.toFixed(0)}%`;
};

// URL segment classification
function segment(url) {
  try {
    const u = new URL(url);
    const p = u.pathname;
    const langMatch = p.match(/^\/([a-z]{2})\//);
    const lang = langMatch ? langMatch[1] : 'en';
    const rest = langMatch ? p.slice(3) : p;
    let kind = 'other';
    if (rest === '/' || rest === '') kind = 'home';
    else if (rest.startsWith('/sbti')) kind = 'sbti';
    else if (rest.startsWith('/blog/lists')) kind = 'listicle';
    else if (rest.startsWith('/blog')) kind = 'blog';
    else if (rest.startsWith('/dramas')) kind = 'drama';
    else if (rest.startsWith('/dictionary')) kind = 'dictionary';
    else if (rest.startsWith('/characters')) kind = 'characters';
    else if (rest.startsWith('/phrases')) kind = 'phrases';
    else if (rest.startsWith('/poems')) kind = 'poems';
    else if (rest.startsWith('/poets')) kind = 'poets';
    else if (rest.startsWith('/slang')) kind = 'slang';
    else if (rest.startsWith('/themes')) kind = 'themes';
    else if (rest.startsWith('/festivals')) kind = 'festivals';
    else if (rest.startsWith('/proverbs')) kind = 'proverbs';
    else if (rest.startsWith('/hsk')) kind = 'hsk';
    else if (rest.startsWith('/faq')) kind = 'faq';
    return { lang, kind };
  } catch { return { lang: '?', kind: 'other' }; }
}

// ============= Sections =============

const lines = [];
const push = (s = '') => lines.push(s);

push(`# SEO Audit — ${dateArg}`);
push('');
push(`Site: \`sc-domain:chineseidioms.com\``);
push('');

// --- Topline ---
push('## Topline');
push('');
const tot7 = { c: sum(p7, 'clicks'), i: sum(p7, 'impressions') };
const totP7 = { c: sum(pP7, 'clicks'), i: sum(pP7, 'impressions') };
const tot28 = { c: sum(p28, 'clicks'), i: sum(p28, 'impressions') };
const totP28 = { c: sum(pP28, 'clicks'), i: sum(pP28, 'impressions') };

push('| Metric | Last 7d | vs prior 7d | Last 28d | vs prior 28d |');
push('|---|---:|---:|---:|---:|');
push(`| Clicks      | ${fmt(tot7.c)} | ${delta(tot7.c, totP7.c)} | ${fmt(tot28.c)} | ${delta(tot28.c, totP28.c)} |`);
push(`| Impressions | ${fmt(tot7.i)} | ${delta(tot7.i, totP7.i)} | ${fmt(tot28.i)} | ${delta(tot28.i, totP28.i)} |`);
push(`| CTR         | ${pct(tot7.c / Math.max(tot7.i, 1))} | — | ${pct(tot28.c / Math.max(tot28.i, 1))} | — |`);
push(`| Indexed pages with impressions (28d) | ${fmt(p28.length)} | — | — | — |`);
push('');

// --- Trend (last 14 days of clicks) ---
const last14 = totals28.slice(-14);
const avgClicks14 = last14.reduce((a, r) => a + r.clicks, 0) / last14.length;
const max14 = Math.max(...last14.map(r => r.clicks));
push('### Daily clicks, last 14 days');
push('');
push('```');
for (const d of last14) {
  const bar = '█'.repeat(Math.round((d.clicks / max14) * 40));
  push(`${d.keys[0]}  ${d.clicks.toString().padStart(5)}  ${bar}`);
}
push(`avg: ${avgClicks14.toFixed(0)} clicks/day`);
push('```');
push('');

// --- Top queries ---
// --- Content opportunities (the most actionable section) ---
push('## Content opportunities — write/expand these');
push('');

// 1. Theme clusters: queries sharing a stem with high combined impressions
const STOPWORDS = new Set(['the','a','an','of','in','to','for','and','or','on','is','what','how','why','meaning','chinese','idioms','idiom']);
function stem(q) {
  return q.toLowerCase().replace(/[^\w\s一-鿿]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !STOPWORDS.has(w));
}
const stemImpr = new Map();
for (const r of q28) {
  if (r.impressions < 20) continue;
  for (const s of stem(r.keys[0])) {
    if (!stemImpr.has(s)) stemImpr.set(s, { impr: 0, clicks: 0, count: 0, samples: [] });
    const e = stemImpr.get(s);
    e.impr += r.impressions; e.clicks += r.clicks; e.count++;
    if (e.samples.length < 5) e.samples.push(r.keys[0]);
  }
}
const opportunities = [...stemImpr.entries()]
  .filter(([s, e]) => e.count >= 3 && e.impr >= 200 && (e.clicks / e.impr) < 0.03)
  .sort((a, b) => b[1].impr - a[1].impr)
  .slice(0, 15);

push('### Underserved query clusters (≥3 related queries, ≥200 combined impressions, CTR <3%)');
push('');
push('Stems where many related queries are underperforming. Each row suggests a content gap.');
push('');
push('| Stem | Queries | Impr | Clicks | CTR | Sample queries |');
push('|---|---:|---:|---:|---:|---|');
for (const [s, e] of opportunities) {
  push(`| **${s}** | ${e.count} | ${fmt(e.impr)} | ${e.clicks} | ${pct(e.clicks / e.impr)} | ${e.samples.slice(0, 3).join(' · ')} |`);
}
push('');

// 2. Drama-shaped queries we don't already cover
const DRAMA_PATTERNS = /(chinese drama|c-drama|cdrama|drama chino|drama chinois|drama tiongkok|chinese novel|novel cast|episode|ending explained|cast of|true story|based on)/i;
const dramaQs = q28
  .filter(r => r.impressions >= 5 && DRAMA_PATTERNS.test(r.keys[0]))
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 20);
push('### Drama / novel queries — possible new universes');
push('');
push('Filter: ≥5 impressions, drama/novel-shaped query.');
push('');
push('| Query | Impr | Pos | Clicks |');
push('|---|---:|---:|---:|');
for (const r of dramaQs) push(`| ${r.keys[0]} | ${fmt(r.impressions)} | ${r.position.toFixed(1)} | ${r.clicks} |`);
push('');

// 3. "X in {language}" patterns
const langPatterns = [
  ['Tagalog', / in tagalog|tagalog$/i],
  ['Malay',   / in malay|melayu|马来文/i],
  ['Hindi',   / in hindi|hindi$/i],
  ['Spanish', /significado|en español|en chino/i],
  ['Japanese',/中国語|意味/],
];
push('### Translation queries by target language (signals where to add bilingual content)');
push('');
push('| Language | Queries | Total impr | Total clicks | Top query |');
push('|---|---:|---:|---:|---|');
for (const [lang, re] of langPatterns) {
  const matches = q28.filter(r => re.test(r.keys[0]) && r.impressions >= 10);
  if (matches.length === 0) continue;
  const top = matches.sort((a, b) => b.impressions - a.impressions)[0];
  const totalImpr = matches.reduce((a, r) => a + r.impressions, 0);
  const totalClicks = matches.reduce((a, r) => a + r.clicks, 0);
  push(`| ${lang} | ${matches.length} | ${fmt(totalImpr)} | ${totalClicks} | ${top.keys[0]} (${top.impressions} impr, pos ${top.position.toFixed(1)}) |`);
}
push('');

push('## Top 25 queries by clicks (last 28d)');
push('');
push('| Query | Clicks | Impr | CTR | Pos | Δ clicks vs prior 28d |');
push('|---|---:|---:|---:|---:|---:|');
const qP28Map = indexByQuery(qP28);
const topQ = [...q28].sort((a, b) => b.clicks - a.clicks).slice(0, 25);
for (const r of topQ) {
  const prev = qP28Map.get(r.keys[0]);
  const dc = prev ? delta(r.clicks, prev.clicks) : 'new';
  push(`| ${r.keys[0]} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${pct(r.ctr)} | ${r.position.toFixed(1)} | ${dc} |`);
}
push('');

// --- Rising queries (impressions WoW, position < 30) ---
push('## Rising queries (last 7d vs prior 7d, by impression growth)');
push('');
push('Filtered: ≥50 current impressions, position ≤ 30, ≥50% growth.');
push('');
push('| Query | Impr (7d) | Δ vs prior | CTR | Position |');
push('|---|---:|---:|---:|---:|');
const qP7Map = indexByQuery(qP7);
const rising = [];
for (const r of q7) {
  if (r.impressions < 50 || r.position > 30) continue;
  const prev = qP7Map.get(r.keys[0]);
  const prevI = prev ? prev.impressions : 0;
  if (prevI > 0 && (r.impressions - prevI) / prevI < 0.5) continue;
  rising.push({ ...r, prevI, growth: prevI ? (r.impressions - prevI) / prevI : Infinity });
}
rising.sort((a, b) => b.impressions - a.impressions).slice(0, 25).forEach(r => {
  const g = r.prevI === 0 ? 'new' : `${(r.growth * 100).toFixed(0)}%`;
  push(`| ${r.keys[0]} | ${fmt(r.impressions)} | ${g} | ${pct(r.ctr)} | ${r.position.toFixed(1)} |`);
});
push('');

// --- Striking-distance queries (rank 11-20, high impressions) ---
push('## Striking-distance queries (position 11–20, 28d)');
push('');
push('These rank just below page 1. Small content/link improvements can push them to top 10.');
push('');
push('| Query | Impr | Pos | Clicks | Top page |');
push('|---|---:|---:|---:|---|');
const pq28ByQuery = new Map();
for (const r of pq28) {
  const q = r.keys[1];
  if (!pq28ByQuery.has(q)) pq28ByQuery.set(q, []);
  pq28ByQuery.get(q).push(r);
}
const striking = q28
  .filter(r => r.position >= 11 && r.position <= 20 && r.impressions >= 100)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);
for (const r of striking) {
  const pages = pq28ByQuery.get(r.keys[0]) || [];
  const topPage = pages.sort((a, b) => b.impressions - a.impressions)[0];
  const url = topPage ? topPage.keys[0] : '?';
  push(`| ${r.keys[0]} | ${fmt(r.impressions)} | ${r.position.toFixed(1)} | ${r.clicks} | ${url} |`);
}
push('');

// --- High-impression low-CTR pages ---
push('## CTR opportunities (high impressions, low CTR — last 28d)');
push('');
push('Filtered: ≥1000 impressions, position ≤ 10, CTR < expected for that position.');
push('Expected CTR by position: 1=30% 2=15% 3=10% 4=7% 5=5% 6-10=3%.');
push('');
push('| Page | Impr | Clicks | CTR | Pos | Expected |');
push('|---|---:|---:|---:|---:|---:|');
const expectedCTR = (pos) => {
  if (pos < 1.5) return 0.30;
  if (pos < 2.5) return 0.15;
  if (pos < 3.5) return 0.10;
  if (pos < 4.5) return 0.07;
  if (pos < 5.5) return 0.05;
  return 0.03;
};
const lowCTR = p28
  .filter(r => r.impressions >= 1000 && r.position <= 10 && r.ctr < expectedCTR(r.position) * 0.7)
  .sort((a, b) => b.impressions - a.impressions)
  .slice(0, 25);
for (const r of lowCTR) {
  push(`| ${r.keys[0]} | ${fmt(r.impressions)} | ${fmt(r.clicks)} | ${pct(r.ctr)} | ${r.position.toFixed(1)} | ${pct(expectedCTR(r.position))} |`);
}
push('');

// --- Declining pages WoW ---
push('## Declining pages (last 7d vs prior 7d)');
push('');
push('Pages losing the most clicks. ≥10 prior clicks, dropped ≥30%.');
push('');
push('| Page | Clicks 7d | Prior 7d | Δ |');
push('|---|---:|---:|---:|');
const pP7Map = indexByPage(pP7);
const declining = [];
for (const r of p7) {
  const prev = pP7Map.get(r.keys[0]);
  if (!prev || prev.clicks < 10) continue;
  if (r.clicks >= prev.clicks * 0.7) continue;
  declining.push({ url: r.keys[0], cur: r.clicks, prev: prev.clicks });
}
declining.sort((a, b) => (b.prev - b.cur) - (a.prev - a.cur)).slice(0, 25).forEach(d => {
  push(`| ${d.url} | ${d.cur} | ${d.prev} | ${delta(d.cur, d.prev)} |`);
});
push('');

// --- Segment breakdown ---
push('## Traffic by section (last 28d)');
push('');
push('| Section | Pages | Clicks | Impressions | CTR | Avg pos |');
push('|---|---:|---:|---:|---:|---:|');
const segMap = new Map();
for (const r of p28) {
  const { kind } = segment(r.keys[0]);
  if (!segMap.has(kind)) segMap.set(kind, { pages: 0, clicks: 0, imp: 0, posSum: 0 });
  const s = segMap.get(kind);
  s.pages++; s.clicks += r.clicks; s.imp += r.impressions; s.posSum += r.position * r.impressions;
}
[...segMap.entries()]
  .sort((a, b) => b[1].clicks - a[1].clicks)
  .forEach(([k, s]) => {
    const ctr = s.clicks / Math.max(s.imp, 1);
    const avgPos = s.posSum / Math.max(s.imp, 1);
    push(`| ${k} | ${fmt(s.pages)} | ${fmt(s.clicks)} | ${fmt(s.imp)} | ${pct(ctr)} | ${avgPos.toFixed(1)} |`);
  });
push('');

// --- Language breakdown ---
push('## Traffic by language prefix (last 28d)');
push('');
push('| Lang | Pages | Clicks | Impressions | CTR |');
push('|---|---:|---:|---:|---:|');
const langMap = new Map();
for (const r of p28) {
  const { lang } = segment(r.keys[0]);
  if (!langMap.has(lang)) langMap.set(lang, { pages: 0, clicks: 0, imp: 0 });
  const s = langMap.get(lang);
  s.pages++; s.clicks += r.clicks; s.imp += r.impressions;
}
[...langMap.entries()]
  .sort((a, b) => b[1].clicks - a[1].clicks)
  .forEach(([k, s]) => {
    push(`| ${k} | ${fmt(s.pages)} | ${fmt(s.clicks)} | ${fmt(s.imp)} | ${pct(s.clicks / Math.max(s.imp, 1))} |`);
  });
push('');

// --- Country ---
push('## Top countries (last 28d)');
push('');
push('| Country | Clicks | Impressions | CTR |');
push('|---|---:|---:|---:|');
countries
  .sort((a, b) => b.clicks - a.clicks)
  .slice(0, 15)
  .forEach(r => push(`| ${r.keys[0].toUpperCase()} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${pct(r.ctr)} |`));
push('');

// --- Device ---
push('## Devices (last 28d)');
push('');
push('| Device | Clicks | Impressions | CTR |');
push('|---|---:|---:|---:|');
devices.forEach(r => push(`| ${r.keys[0]} | ${fmt(r.clicks)} | ${fmt(r.impressions)} | ${pct(r.ctr)} |`));
push('');

// --- Sitemaps ---
push('## Sitemap status');
push('');
push('| Sitemap | Last submitted | Status | Discovered URLs | Errors | Warnings |');
push('|---|---|---|---:|---:|---:|');
for (const sm of (sitemaps.sitemap || [])) {
  const last = sm.lastSubmitted ? sm.lastSubmitted.slice(0, 10) : '—';
  const status = sm.isPending ? 'pending' : (sm.errors > 0 ? 'errors' : 'ok');
  const discovered = (sm.contents || []).reduce((a, c) => a + Number(c.submitted || 0), 0);
  push(`| ${sm.path.replace('https://www.chineseidioms.com/', '/')} | ${last} | ${status} | ${fmt(discovered)} | ${sm.errors || 0} | ${sm.warnings || 0} |`);
}
push('');

// --- Top winners (new clicks since last week) ---
push('## New / surging pages (gained clicks vs prior 7d)');
push('');
push('| Page | Clicks 7d | Prior 7d | Δ |');
push('|---|---:|---:|---:|');
const surging = [];
for (const r of p7) {
  if (r.clicks < 5) continue;
  const prev = pP7Map.get(r.keys[0]);
  const prevC = prev ? prev.clicks : 0;
  if (r.clicks <= prevC * 1.5) continue;
  surging.push({ url: r.keys[0], cur: r.clicks, prev: prevC });
}
surging.sort((a, b) => (b.cur - b.prev) - (a.cur - a.prev)).slice(0, 25).forEach(d => {
  const dc = d.prev === 0 ? 'new' : delta(d.cur, d.prev);
  push(`| ${d.url} | ${d.cur} | ${d.prev} | ${dc} |`);
});
push('');

push('---');
push('');
push(`_Generated by \`scripts/audit/report.js\` from data in \`audits/data/${dateArg}/\`._`);
push('');

fs.writeFileSync(outFile, lines.join('\n'));
console.log(`Wrote ${outFile}`);
console.log(`(${(fs.statSync(outFile).size / 1024).toFixed(1)} KB)`);
