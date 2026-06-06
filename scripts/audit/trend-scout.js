#!/usr/bin/env node
/* eslint-disable no-console */
// Chinese Trend Scout — the complement to report.js's Vertical Radar.
//
// The Vertical Radar mines your OWN GSC data (demand you already rank for).
// This scout uses OpenAI web search to find Chinese-culture topics trending on
// the OPEN web RIGHT NOW — across ALL your verticals: C-dramas, films, actors,
// internet slang/buzzwords, viral phrases/memes, novels/IP — then cross-checks
// each against your existing content and flags the GAPS to build before they peak.
//
// Run: node scripts/audit/trend-scout.js [YYYY-MM-DD]
// Output: audits/trend-scout-YYYY-MM-DD.md

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');
const { ROOT } = require('./_lib');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY, timeout: 180000 });
const SEARCH_MODEL = 'gpt-5-search-api'; // web-grounded, returns citations
const STRUCT_MODEL = 'gpt-5.2';          // structures the research into JSON

const date = process.argv[2] || new Date().toISOString().slice(0, 10);
const outFile = path.join(ROOT, 'audits', `trend-scout-${date}.md`);

// Stream + retry: long/search calls can exceed the ~60s idle connection cutoff.
async function chat(opts, retries = 3) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const stream = await openai.chat.completions.create({ ...opts, stream: true });
      let content = '';
      for await (const chunk of stream) content += chunk.choices[0]?.delta?.content || '';
      return content.trim();
    } catch (err) {
      lastErr = err;
      if (attempt < retries) {
        console.log(`  retry ${attempt + 1}/${retries} (${(err.message || '').slice(0, 50)})`);
        await new Promise(r => setTimeout(r, 3000 * (attempt + 1)));
      }
    }
  }
  throw lastErr;
}

// ---- Build a corpus of slugs/terms we already cover, for gap detection ----
function loadCoverage() {
  const slugs = new Set();
  const zh = new Set();
  const addSlug = (s) => { if (s && s.length > 2) slugs.add(s.toLowerCase()); };
  // blog articles (drama clusters, slang explainers, etc.)
  try { fs.readdirSync(path.join(ROOT, 'content/blog')).forEach(f => f.endsWith('.md') && addSlug(f.slice(0, -3))); } catch {}
  // queued series briefs
  try { fs.readdirSync(path.join(ROOT, 'content/series-briefs')).forEach(f => f.endsWith('.json') && addSlug(f.slice(0, -5))); } catch {}
  // slang + phrases libraries (slugs are pinyin, e.g. 'jue-jue-zi')
  for (const lib of ['slang.ts', 'phrases.ts']) {
    try {
      const txt = fs.readFileSync(path.join(ROOT, 'src/lib', lib), 'utf8');
      (txt.match(/slug:\s*'([^']+)'/g) || []).forEach(m => addSlug(m.replace(/slug:\s*'|'/g, '')));
      (txt.match(/[一-鿿]+/g) || []).forEach(c => zh.add(c));
    } catch {}
  }
  // idiom characters (so trending idioms register as covered)
  try {
    JSON.parse(fs.readFileSync(path.join(ROOT, 'public/idioms.json'), 'utf8'))
      .forEach(i => i.characters && zh.add(i.characters));
  } catch {}
  return { slugs: [...slugs], zh };
}

const slugify = (s) => (s || '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function coverageFor(c, cov) {
  const candidates = [slugify(c.name_en), slugify(c.pinyin)].filter(s => s && s.length > 2);
  let hits = 0;
  for (const cand of candidates) hits += cov.slugs.filter(s => s.includes(cand)).length;
  if (!hits && c.name_zh) {
    const zh = (c.name_zh.match(/[一-鿿]+/g) || []).join('');
    if (zh && cov.zh.has(zh)) hits = 1;
  }
  return hits;
}

(async () => {
  console.log(`Chinese Trend Scout — ${date}`);

  // 1) Web-grounded search across every vertical.
  console.log('  searching the open web...');
  const searchPrompt = `You are a trend scout for an English-language website that explains Chinese language and culture to a global audience (US/UK/Southeast Asia/Japan). The site covers: C-dramas & films, actors, Chinese internet slang & buzzwords, viral phrases/memes, idioms, and novels.

Today is ${date}. Using web search, find what is TRENDING NOW or about to trend within ~6 weeks that international/English-speaking audiences are searching about. Cover ALL of these:
1. C-dramas & films airing now or premiering within ~6 weeks (especially with big-name stars or strong overseas buzz)
2. Rising actors/actresses with a major new role
3. Chinese internet slang & buzzwords (网络流行语) gaining traction
4. Viral phrases, memes, or cultural moments
5. Popular novels / source IP being adapted
6. Songs, games, or seasonal/festival topics if notably trending

Give ~3-5 items PER category. For each: English name, Chinese name (characters + pinyin), the category, ONE sentence on why it's trending + rough timeframe, and the phrase people search. Prefer items with rising international/English search interest. Cite sources.`;

  const research = await chat({ model: SEARCH_MODEL, messages: [{ role: 'user', content: searchPrompt }] });

  // 2) Structure into JSON.
  console.log('  structuring candidates...');
  const structPrompt = `From the trend research below, extract a JSON array of specific, real, named entities (drop vague/generic items).

RESEARCH:
"""
${research}
"""

Return JSON exactly: {"candidates":[{"name_en":"","name_zh":"","pinyin":"","category":"drama|film|actor|slang|phrase|novel|other","why":"","timeframe":"","search_angle":""}]}`;
  const structRaw = await chat({ model: STRUCT_MODEL, messages: [{ role: 'user', content: structPrompt }], response_format: { type: 'json_object' } });
  let candidates = [];
  try { candidates = JSON.parse(structRaw).candidates || []; }
  catch { const m = structRaw.match(/\[[\s\S]*\]/); if (m) { try { candidates = JSON.parse(m[0]); } catch {} } }

  // 3) Cross-reference existing content.
  const cov = loadCoverage();
  candidates.forEach(c => { c.coverage = coverageFor(c, cov); });

  const gaps = candidates.filter(c => c.coverage === 0);
  const covered = candidates.filter(c => c.coverage > 0);
  const catOrder = ['drama', 'film', 'actor', 'novel', 'slang', 'phrase', 'other'];
  const byCat = (a, b) => catOrder.indexOf(a.category) - catOrder.indexOf(b.category);

  // 4) Write the report.
  const L = [];
  const p = (s = '') => L.push(s);
  p(`# Chinese Trend Scout — ${date}`);
  p('');
  p('Open-web trends across **all verticals** (dramas, films, actors, slang, phrases, novels), cross-checked against existing content. Complement to the GSC-based Vertical Radar in the SEO audit. Source: OpenAI web search (`gpt-5-search-api`).');
  p('');
  p(`**${gaps.length} gaps to build · ${covered.length} already covered (monitor).**`);
  p('');
  p('## 🔥 Gaps — trending, but you have no cluster yet');
  p('');
  p('| Build? | Entity | 中文 | Category | Why it\'s trending | Timeframe | Search angle |');
  p('|---|---|---|---|---|---|---|');
  for (const c of gaps.sort(byCat)) {
    p(`| **build** | ${c.name_en || ''} | ${c.name_zh || ''} ${c.pinyin ? '(' + c.pinyin + ')' : ''} | ${c.category || ''} | ${c.why || ''} | ${c.timeframe || ''} | ${c.search_angle || ''} |`);
  }
  p('');
  p('## ✅ Already covered — monitor / expand');
  p('');
  p('| Entity | 中文 | Category | Cluster files | Why it\'s trending |');
  p('|---|---|---|---:|---|');
  for (const c of covered.sort(byCat)) {
    p(`| ${c.name_en || ''} | ${c.name_zh || ''} | ${c.category || ''} | ${c.coverage} | ${c.why || ''} |`);
  }
  p('');
  p('## Raw research (with citations)');
  p('');
  p(research);
  p('');
  p('---');
  p(`_Generated by \`scripts/audit/trend-scout.js\`. GSC-based demand lives in the SEO audit's Vertical Radar; this scout covers what GSC can't see yet._`);

  fs.writeFileSync(outFile, L.join('\n'));
  console.log(`\nWrote ${outFile}`);
  console.log(`  ${gaps.length} gaps, ${covered.length} covered`);
})().catch(e => { console.error('Trend scout failed:', e.message); process.exit(1); });
