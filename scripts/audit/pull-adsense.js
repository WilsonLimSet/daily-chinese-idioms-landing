#!/usr/bin/env node
/* eslint-disable no-console */
// Pulls AdSense earnings + performance data into audits/data/YYYY-MM-DD/.
// Run: node scripts/audit/pull-adsense.js

const fs = require('fs');
const path = require('path');
const { getAdSense, ROOT } = require('./_lib');

const METRICS = [
  'ESTIMATED_EARNINGS',
  'PAGE_VIEWS',
  'IMPRESSIONS',
  'CLICKS',
  'PAGE_VIEWS_RPM',
  'PAGE_VIEWS_CTR',
];

function fmt(d) { return d.toISOString().slice(0, 10); }
function daysAgo(n) { const d = new Date(); d.setUTCDate(d.getUTCDate() - n); return d; }
function dateParts(d) { return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() }; }

const RANGES = {
  // AdSense data has ~1 day lag.
  last_7d:  { start: daysAgo(8),  end: daysAgo(1) },
  last_28d: { start: daysAgo(29), end: daysAgo(1) },
  last_90d: { start: daysAgo(91), end: daysAgo(1) },
};

async function report(adsense, account, range, dimensions) {
  const s = dateParts(range.start);
  const e = dateParts(range.end);
  // Date-dimensioned reports must stay chronological; everything else sorts by earnings.
  const orderBy = dimensions.includes('DATE') ? ['+DATE'] : ['-ESTIMATED_EARNINGS'];
  const { data } = await adsense.accounts.reports.generate({
    account,
    'startDate.year': s.year, 'startDate.month': s.month, 'startDate.day': s.day,
    'endDate.year':   e.year, 'endDate.month':   e.month, 'endDate.day':   e.day,
    dimensions,
    metrics: METRICS,
    orderBy,
    limit: 1000,
  });
  return data;
}

function rangeStr(r) { return { start: fmt(r.start), end: fmt(r.end) }; }

(async () => {
  const adsense = getAdSense();

  // Find the publisher account.
  const accounts = await adsense.accounts.list();
  const account = (accounts.data.accounts || [])[0];
  if (!account) {
    console.error('No AdSense account accessible with this token.');
    process.exit(1);
  }

  const today = fmt(new Date());
  const outDir = path.join(ROOT, 'audits', 'data', today);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`Account: ${account.name} (${account.displayName})`);
  console.log(`Output: ${outDir}\n`);

  const tasks = [
    { file: 'adsense_daily_28d.json',     dims: ['DATE'],              range: RANGES.last_28d },
    { file: 'adsense_daily_90d.json',     dims: ['DATE'],              range: RANGES.last_90d },
    { file: 'adsense_pages_28d.json',     dims: ['PAGE_URL'],          range: RANGES.last_28d },
    { file: 'adsense_pages_7d.json',      dims: ['PAGE_URL'],          range: RANGES.last_7d },
    { file: 'adsense_countries_28d.json', dims: ['COUNTRY_CODE'],      range: RANGES.last_28d },
    { file: 'adsense_devices_28d.json',   dims: ['PLATFORM_TYPE_CODE'],range: RANGES.last_28d },
    { file: 'adsense_ad_units_28d.json',  dims: ['AD_UNIT_NAME'],      range: RANGES.last_28d },
  ];

  for (const t of tasks) {
    process.stdout.write(`  ${t.file.padEnd(34)} `);
    try {
      const data = await report(adsense, account.name, t.range, t.dims);
      const rows = data.rows || [];
      fs.writeFileSync(
        path.join(outDir, t.file),
        JSON.stringify({ range: rangeStr(t.range), dimensions: t.dims, headers: data.headers, totals: data.totals, rows }, null, 2),
      );
      console.log(`${rows.length.toString().padStart(6)} rows`);
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
    }
  }

  console.log(`\nDone. Data saved to ${outDir}`);
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
