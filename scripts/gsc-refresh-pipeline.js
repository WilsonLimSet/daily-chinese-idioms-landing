#!/usr/bin/env node

/**
 * GSC AI Refresh Pipeline
 *
 * Pulls Google Search Console data, identifies declining/underperforming pages,
 * and uses AI to suggest content refreshes.
 *
 * Usage:
 *   node scripts/gsc-refresh-pipeline.js [--dry-run] [--days=90]
 *
 * Environment variables:
 *   GOOGLE_SERVICE_ACCOUNT_KEY - Base64-encoded service account JSON key
 *   GOOGLE_SERVICE_ACCOUNT_EMAIL - Service account email (alternative to key file)
 *   GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY - Private key (alternative to key file)
 *   GSC_SITE_URL - Site URL in GSC (default: https://www.chineseidioms.com)
 *   OPENAI_API_KEY - Google Gemini API key for AI suggestions
 */

// Parse CLI arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const daysArg = args.find(a => a.startsWith('--days='));
const DAYS = daysArg ? parseInt(daysArg.split('=')[1]) : 90;
const SITE_URL = process.env.GSC_SITE_URL || 'https://www.chineseidioms.com';

// Date helpers
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// Lazy-load googleapis (only needed for real runs, not dry-run)
let google;
function loadGoogleApis() {
  if (!google) {
    google = require('googleapis').google;
  }
  return google;
}

// Authenticate with Google APIs
async function getAuthClient() {
  loadGoogleApis();
  // Option 1: Base64-encoded service account key
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    const keyJson = JSON.parse(
      Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString()
    );
    return new google.auth.GoogleAuth({
      credentials: keyJson,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  // Option 2: Individual env vars
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });
  }

  // Option 3: Application Default Credentials
  return new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
}

// Pull GSC performance data for a date range
async function fetchGSCData(searchconsole, startDate, endDate, dimensions = ['page']) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dimensions,
      rowLimit: 5000,
      dataState: 'final',
    },
  });
  return response.data.rows || [];
}

// Fetch query-level data for content gap analysis
async function fetchQueryData(searchconsole, startDate, endDate) {
  const response = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      dimensions: ['query'],
      rowLimit: 5000,
      dataState: 'final',
    },
  });
  return response.data.rows || [];
}

// Identify declining pages (compare recent 30d vs prior 30d)
function findDecliningPages(recentData, priorData) {
  const priorMap = new Map();
  for (const row of priorData) {
    priorMap.set(row.keys[0], row);
  }

  const declining = [];
  for (const row of recentData) {
    const page = row.keys[0];
    const prior = priorMap.get(page);
    if (!prior) continue;

    const impressionChange = ((row.impressions - prior.impressions) / prior.impressions) * 100;
    const positionChange = row.position - prior.position;

    if (impressionChange < -20 || positionChange > 2) {
      declining.push({
        page: page.replace(SITE_URL, ''),
        recentImpressions: row.impressions,
        priorImpressions: prior.impressions,
        impressionChange: impressionChange.toFixed(1),
        recentPosition: row.position.toFixed(1),
        priorPosition: prior.position.toFixed(1),
        positionChange: positionChange.toFixed(1),
        recentClicks: row.clicks,
        recentCtr: (row.ctr * 100).toFixed(1),
      });
    }
  }

  return declining.sort((a, b) => parseFloat(a.impressionChange) - parseFloat(b.impressionChange));
}

// Find pages with high impressions but low CTR
function findLowCTRPages(data, minImpressions = 100) {
  return data
    .filter(row => row.impressions >= minImpressions && row.ctr < 0.03)
    .map(row => ({
      page: row.keys[0].replace(SITE_URL, ''),
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: (row.ctr * 100).toFixed(1),
      position: row.position.toFixed(1),
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);
}

// Find pages ranking in striking distance (positions 5-20)
function findStrikingDistancePages(data, minImpressions = 50) {
  return data
    .filter(row => row.position >= 5 && row.position <= 20 && row.impressions >= minImpressions)
    .map(row => ({
      page: row.keys[0].replace(SITE_URL, ''),
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: (row.ctr * 100).toFixed(1),
      position: row.position.toFixed(1),
    }))
    .sort((a, b) => a.position - b.position)
    .slice(0, 20);
}

// Find content gaps (queries with impressions but no dedicated page)
function findContentGaps(queryData, pageData) {
  const existingPages = new Set(pageData.map(row => row.keys[0]));

  // Keywords that suggest potential listicle/page opportunities
  const gapKeywords = ['chinese idioms', 'chengyu', 'chinese proverbs', 'chinese sayings', 'chinese quotes'];

  return queryData
    .filter(row => {
      const query = row.keys[0].toLowerCase();
      return (
        row.impressions >= 50 &&
        gapKeywords.some(kw => query.includes(kw)) &&
        !Array.from(existingPages).some(page =>
          page.toLowerCase().includes(query.replace(/\s+/g, '-').substring(0, 30))
        )
      );
    })
    .map(row => ({
      query: row.keys[0],
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: (row.ctr * 100).toFixed(1),
      position: row.position.toFixed(1),
    }))
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15);
}

// Generate AI suggestions using OpenAI
async function generateAISuggestions(decliningPages, lowCTRPages, contentGaps) {
  if (!process.env.OPENAI_API_KEY) {
    console.log('  No OPENAI_API_KEY set, skipping AI suggestions.');
    return null;
  }

  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an SEO expert for a Chinese idioms education website (chineseidioms.com).
Analyze this Google Search Console data and provide specific, actionable recommendations.

DECLINING PAGES (top 5):
${decliningPages.slice(0, 5).map(p => `  ${p.page} — ${p.impressionChange}% impressions, position ${p.priorPosition} → ${p.recentPosition}`).join('\n')}

LOW CTR PAGES (top 5):
${lowCTRPages.slice(0, 5).map(p => `  ${p.page} — CTR ${p.ctr}% at position ${p.position}, ${p.impressions} impressions`).join('\n')}

CONTENT GAPS (top 5):
${contentGaps.slice(0, 5).map(g => `  "${g.query}" — ${g.impressions} impressions, position ${g.position}`).join('\n')}

For each section, provide:
1. DECLINING: Specific content updates to recover rankings (add year, trending queries, expand content)
2. LOW CTR: New title/meta description suggestions that would improve click-through rates
3. GAPS: Specific new listicle or page ideas to capture this search demand

Keep suggestions specific and actionable. Format as plain text.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error('AI suggestion generation failed:', error.message);
    return null;
  }
}

// Format and print the report
function printReport(declining, lowCTR, strikingDistance, contentGaps, aiSuggestions) {
  const date = formatDate(new Date());
  const separator = '='.repeat(60);

  console.log(`\n${separator}`);
  console.log(`  GSC Content Refresh Report (${date})`);
  console.log(`  Site: ${SITE_URL}`);
  console.log(`  Period: Last ${DAYS} days`);
  if (isDryRun) console.log('  Mode: DRY RUN');
  console.log(separator);

  // Declining pages
  console.log(`\n📉 DECLINING PAGES (${declining.length} found):`);
  if (declining.length === 0) {
    console.log('  No significantly declining pages found. Great!');
  } else {
    for (const p of declining.slice(0, 10)) {
      console.log(`  ${p.page}`);
      console.log(`    Impressions: ${p.impressionChange}% (${p.priorImpressions} → ${p.recentImpressions})`);
      console.log(`    Position: ${p.priorPosition} → ${p.recentPosition} (${p.positionChange > 0 ? '+' : ''}${p.positionChange})`);
      console.log(`    CTR: ${p.recentCtr}%, Clicks: ${p.recentClicks}`);
      console.log('');
    }
  }

  // Low CTR pages
  console.log(`\n🎯 LOW CTR PAGES (${lowCTR.length} found, need title/meta refresh):`);
  if (lowCTR.length === 0) {
    console.log('  No pages with low CTR and high impressions found.');
  } else {
    for (const p of lowCTR.slice(0, 10)) {
      console.log(`  ${p.page}`);
      console.log(`    CTR: ${p.ctr}% at position ${p.position} (${p.impressions} impressions, ${p.clicks} clicks)`);
      console.log('');
    }
  }

  // Striking distance
  console.log(`\n🎪 STRIKING DISTANCE PAGES (${strikingDistance.length} found, positions 5-20):`);
  if (strikingDistance.length === 0) {
    console.log('  No pages in striking distance range.');
  } else {
    for (const p of strikingDistance.slice(0, 10)) {
      console.log(`  ${p.page}`);
      console.log(`    Position: ${p.position} (${p.impressions} impressions, ${p.clicks} clicks, CTR ${p.ctr}%)`);
      console.log('');
    }
  }

  // Content gaps
  console.log(`\n🔍 CONTENT GAPS (${contentGaps.length} new page opportunities):`);
  if (contentGaps.length === 0) {
    console.log('  No significant content gaps found.');
  } else {
    for (const g of contentGaps.slice(0, 10)) {
      console.log(`  "${g.query}"`);
      console.log(`    ${g.impressions} impressions, position ${g.position}, CTR ${g.ctr}%`);
      console.log('');
    }
  }

  // AI suggestions
  if (aiSuggestions) {
    console.log(`\n🤖 AI RECOMMENDATIONS:`);
    console.log(aiSuggestions);
  }

  console.log(`\n${separator}`);
  console.log(`  Report complete. ${declining.length} declining, ${lowCTR.length} low CTR, ${contentGaps.length} gaps.`);
  console.log(separator);
}

// Main pipeline
async function main() {
  console.log('Starting GSC Content Refresh Pipeline...');
  console.log(`Period: ${DAYS} days, Site: ${SITE_URL}`);

  if (isDryRun) {
    console.log('\n--- DRY RUN MODE ---');
    console.log('This will show what the pipeline would analyze.');
    console.log('To run with real data, ensure GSC credentials are configured.\n');

    // Generate sample report for dry run
    printReport(
      [
        { page: '/blog/ma-dao-cheng-gong', impressionChange: '-35.2', priorImpressions: 1200, recentImpressions: 778, priorPosition: '4.2', recentPosition: '6.8', positionChange: '2.6', recentClicks: 45, recentCtr: '5.8' },
        { page: '/blog/yi-ming-jing-ren', impressionChange: '-28.4', priorImpressions: 890, recentImpressions: 637, priorPosition: '7.1', recentPosition: '9.3', positionChange: '2.2', recentClicks: 22, recentCtr: '3.5' },
      ],
      [
        { page: '/blog/lists/chinese-idioms-about-love', impressions: 2400, clicks: 29, ctr: '1.2', position: '3.1' },
        { page: '/blog/lists/chinese-idioms-for-business', impressions: 1800, clicks: 36, ctr: '2.0', position: '4.5' },
      ],
      [
        { page: '/blog/po-fu-chen-zhou', impressions: 500, clicks: 15, ctr: '3.0', position: '8.2' },
        { page: '/blog/lists/chinese-idioms-about-success', impressions: 450, clicks: 18, ctr: '4.0', position: '6.5' },
      ],
      [
        { query: 'chinese idioms about dogs', impressions: 820, clicks: 0, ctr: '0.0', position: '42.1' },
        { query: 'confucius sayings in chinese', impressions: 540, clicks: 3, ctr: '0.6', position: '18.5' },
        { query: 'chinese idioms about water', impressions: 380, clicks: 2, ctr: '0.5', position: '22.3' },
      ],
      isDryRun ? 'AI suggestions would appear here with a valid OPENAI_API_KEY.' : null
    );
    return;
  }

  try {
    // Authenticate
    const auth = await getAuthClient();
    const searchconsole = google.searchconsole({ version: 'v1', auth });

    console.log('Authenticated with Google APIs.');

    // Define date ranges
    const now = new Date();
    const recent30Start = daysAgo(30);
    const prior30Start = daysAgo(60);
    const prior30End = daysAgo(30);
    const fullRangeStart = daysAgo(DAYS);

    // Fetch data
    console.log('Fetching page performance data (recent 30 days)...');
    const recentPageData = await fetchGSCData(searchconsole, recent30Start, now);

    console.log('Fetching page performance data (prior 30 days)...');
    const priorPageData = await fetchGSCData(searchconsole, prior30Start, prior30End);

    console.log('Fetching full range page data...');
    const fullPageData = await fetchGSCData(searchconsole, fullRangeStart, now);

    console.log('Fetching query data...');
    const queryData = await fetchQueryData(searchconsole, fullRangeStart, now);

    console.log(`Fetched ${recentPageData.length} recent pages, ${priorPageData.length} prior pages, ${queryData.length} queries.`);

    // Analyze
    const declining = findDecliningPages(recentPageData, priorPageData);
    const lowCTR = findLowCTRPages(fullPageData);
    const strikingDistance = findStrikingDistancePages(fullPageData);
    const contentGaps = findContentGaps(queryData, fullPageData);

    // AI suggestions
    let aiSuggestions = null;
    if (process.env.OPENAI_API_KEY && (declining.length > 0 || lowCTR.length > 0 || contentGaps.length > 0)) {
      console.log('Generating AI suggestions...');
      aiSuggestions = await generateAISuggestions(declining, lowCTR, contentGaps);
    }

    // Print report
    printReport(declining, lowCTR, strikingDistance, contentGaps, aiSuggestions);

  } catch (error) {
    console.error('Pipeline error:', error.message);
    if (error.message.includes('credentials')) {
      console.error('\nTip: Set GOOGLE_SERVICE_ACCOUNT_KEY (base64-encoded JSON) or');
      console.error('GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY environment variables.');
    }
    process.exit(1);
  }
}

main();
