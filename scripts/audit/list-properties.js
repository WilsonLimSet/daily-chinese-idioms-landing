#!/usr/bin/env node
/* eslint-disable no-console */
// Sanity check: list all GSC properties this account has access to.
// Run: node scripts/audit/list-properties.js

const { getSearchConsole } = require('./_lib');

(async () => {
  const sc = getSearchConsole();
  const { data } = await sc.sites.list({});
  if (!data.siteEntry || data.siteEntry.length === 0) {
    console.log('No GSC properties found.');
    return;
  }
  console.log(`Found ${data.siteEntry.length} property/properties:\n`);
  for (const s of data.siteEntry) {
    console.log(`  ${s.permissionLevel.padEnd(20)} ${s.siteUrl}`);
  }
})().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
