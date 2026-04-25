#!/usr/bin/env node
/* eslint-disable no-console */
// Resubmits all sitemaps to Google Search Console.
// Run: node scripts/audit/resubmit-sitemaps.js

const { getSearchConsole } = require('./_lib');

const SITE = 'sc-domain:chineseidioms.com';
const BASE = 'https://www.chineseidioms.com';

(async () => {
  const sc = getSearchConsole();

  const { data: list } = await sc.sitemaps.list({ siteUrl: SITE });
  const sitemaps = list.sitemap || [];
  console.log(`Found ${sitemaps.length} sitemaps registered.\n`);

  for (const sm of sitemaps) {
    const url = sm.path;
    process.stdout.write(`  ${url.replace(BASE, '')} ... `);
    try {
      await sc.sitemaps.submit({ siteUrl: SITE, feedpath: url });
      console.log('resubmitted');
    } catch (err) {
      console.log(`failed: ${err.message}`);
    }
  }

  console.log('\nDone. Allow Google a few minutes to recrawl. Verify by re-running pull-gsc.js tomorrow and checking lastSubmitted dates in audits/data/<date>/sitemaps.json.');
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
