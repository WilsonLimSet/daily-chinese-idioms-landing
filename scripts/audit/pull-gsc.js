#!/usr/bin/env node
/* eslint-disable no-console */
// Pulls Search Console data into audits/data/YYYY-MM-DD/.
// Run: node scripts/audit/pull-gsc.js

const fs = require('fs');
const path = require('path');
const { getSearchConsole, ROOT } = require('./_lib');

const SITE = 'sc-domain:chineseidioms.com';

function fmt(d) { return d.toISOString().slice(0, 10); }
function daysAgo(n) { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d; }

const RANGES = {
  // GSC data has a 2-3 day lag, so we shift end-date back by 3 days.
  last_7d:  { start: fmt(daysAgo(10)), end: fmt(daysAgo(3)) },
  prior_7d: { start: fmt(daysAgo(17)), end: fmt(daysAgo(10)) },
  last_28d: { start: fmt(daysAgo(31)), end: fmt(daysAgo(3)) },
  prior_28d:{ start: fmt(daysAgo(59)), end: fmt(daysAgo(31)) },
  last_90d: { start: fmt(daysAgo(93)), end: fmt(daysAgo(3)) },
};

async function query(sc, dimensions, range, opts = {}) {
  const all = [];
  let startRow = 0;
  const rowLimit = 25000;
  while (true) {
    const { data } = await sc.searchanalytics.query({
      siteUrl: SITE,
      requestBody: {
        startDate: range.start,
        endDate: range.end,
        dimensions,
        rowLimit,
        startRow,
        dataState: 'final',
        ...opts,
      },
    });
    if (!data.rows || data.rows.length === 0) break;
    all.push(...data.rows);
    if (data.rows.length < rowLimit) break;
    startRow += rowLimit;
    if (startRow > 100000) break; // safety cap
  }
  return all;
}

(async () => {
  const sc = getSearchConsole();
  const today = fmt(new Date());
  const outDir = path.join(ROOT, 'audits', 'data', today);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Site: ${SITE}`);
  console.log(`Output: ${outDir}\n`);

  const tasks = [
    // Time-series totals
    { file: 'totals_last_28d.json',   dim: ['date'],     range: RANGES.last_28d },
    { file: 'totals_last_90d.json',   dim: ['date'],     range: RANGES.last_90d },

    // Queries (search terms)
    { file: 'queries_last_7d.json',   dim: ['query'],    range: RANGES.last_7d },
    { file: 'queries_prior_7d.json',  dim: ['query'],    range: RANGES.prior_7d },
    { file: 'queries_last_28d.json',  dim: ['query'],    range: RANGES.last_28d },
    { file: 'queries_prior_28d.json', dim: ['query'],    range: RANGES.prior_28d },

    // Pages
    { file: 'pages_last_7d.json',     dim: ['page'],     range: RANGES.last_7d },
    { file: 'pages_prior_7d.json',    dim: ['page'],     range: RANGES.prior_7d },
    { file: 'pages_last_28d.json',    dim: ['page'],     range: RANGES.last_28d },
    { file: 'pages_prior_28d.json',   dim: ['page'],     range: RANGES.prior_28d },

    // Combinations for cross-analysis
    { file: 'page_query_last_28d.json', dim: ['page','query'], range: RANGES.last_28d },

    // Country / device
    { file: 'countries_last_28d.json', dim: ['country'], range: RANGES.last_28d },
    { file: 'devices_last_28d.json',   dim: ['device'],  range: RANGES.last_28d },
  ];

  for (const t of tasks) {
    process.stdout.write(`  ${t.file.padEnd(32)} `);
    try {
      const rows = await query(sc, t.dim, t.range);
      fs.writeFileSync(path.join(outDir, t.file), JSON.stringify({ range: t.range, dimensions: t.dim, rows }, null, 2));
      console.log(`${rows.length.toString().padStart(6)} rows`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  // Sitemaps
  process.stdout.write(`  sitemaps.json                    `);
  try {
    const { data } = await sc.sitemaps.list({ siteUrl: SITE });
    fs.writeFileSync(path.join(outDir, 'sitemaps.json'), JSON.stringify(data, null, 2));
    console.log(`${(data.sitemap || []).length.toString().padStart(6)} sitemaps`);
  } catch (err) {
    console.log(`FAILED: ${err.message}`);
  }

  console.log(`\nDone. Data saved to ${outDir}`);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
