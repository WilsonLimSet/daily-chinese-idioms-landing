#!/usr/bin/env node

/**
 * Analyze GSC CSV export data and generate AI recommendations
 * Usage: node scripts/analyze-gsc-export.js /path/to/export/folder
 */

const fs = require('fs');
const path = require('path');

const folder = process.argv[2];
if (!folder) {
  console.error('Usage: node scripts/analyze-gsc-export.js /path/to/gsc-export-folder');
  process.exit(1);
}

function parseCSV(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1).map(line => {
    // Handle quoted fields
    const values = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') { inQuotes = !inQuotes; continue; }
      if (char === ',' && !inQuotes) { values.push(current); current = ''; continue; }
      current += char;
    }
    values.push(current);
    const obj = {};
    headers.forEach((h, i) => {
      let val = (values[i] || '').trim();
      if (val.endsWith('%')) val = parseFloat(val) / 100;
      else if (!isNaN(val) && val !== '') val = parseFloat(val);
      obj[h.trim()] = val;
    });
    return obj;
  });
}

// Load data
const pages = parseCSV(path.join(folder, 'Pages.csv'));
const queries = parseCSV(path.join(folder, 'Queries.csv'));
const chart = parseCSV(path.join(folder, 'Chart.csv'));
const countries = parseCSV(path.join(folder, 'Countries.csv'));
const devices = parseCSV(path.join(folder, 'Devices.csv'));

const SITE = 'https://www.chineseidioms.com';

// === ANALYSIS ===

console.log('='.repeat(60));
console.log('  GSC ANALYSIS — chineseidioms.com');
console.log('  Data: Last 3 months (Dec 2025 - Mar 2026)');
console.log('='.repeat(60));

// 1. Traffic trend
const totalClicks = chart.reduce((s, r) => s + (r.Clicks || 0), 0);
const totalImpressions = chart.reduce((s, r) => s + (r.Impressions || 0), 0);

// Split into periods
const midpoint = Math.floor(chart.length / 2);
const firstHalf = chart.slice(0, midpoint);
const secondHalf = chart.slice(midpoint);
const firstClicks = firstHalf.reduce((s, r) => s + (r.Clicks || 0), 0);
const secondClicks = secondHalf.reduce((s, r) => s + (r.Clicks || 0), 0);

// CNY spike detection
const cnyPeak = chart.reduce((max, r) => (r.Clicks || 0) > (max.Clicks || 0) ? r : max, chart[0]);

console.log('\n📊 TRAFFIC OVERVIEW');
console.log(`  Total clicks: ${totalClicks.toLocaleString()}`);
console.log(`  Total impressions: ${totalImpressions.toLocaleString()}`);
console.log(`  Peak day: ${cnyPeak.Date} (${cnyPeak.Clicks} clicks, ${cnyPeak.Impressions} impressions)`);
console.log(`  First half clicks: ${firstClicks} → Second half: ${secondClicks} (${((secondClicks/firstClicks - 1)*100).toFixed(0)}%)`);

// Last 7 days trend
const last7 = chart.slice(-7);
const prior7 = chart.slice(-14, -7);
const last7clicks = last7.reduce((s, r) => s + (r.Clicks || 0), 0);
const prior7clicks = prior7.reduce((s, r) => s + (r.Clicks || 0), 0);
console.log(`  Last 7d: ${last7clicks} clicks vs prior 7d: ${prior7clicks} (${((last7clicks/prior7clicks - 1)*100).toFixed(0)}%)`);

// 2. Top pages (extract path)
console.log('\n📄 TOP 20 PAGES BY CLICKS');
pages.slice(0, 20).forEach((p, i) => {
  const page = (p['Top pages'] || '').replace(SITE, '');
  console.log(`  ${(i+1).toString().padStart(2)}. ${page}`);
  console.log(`      ${p.Clicks} clicks | ${p.Impressions} impr | CTR ${(p.CTR*100).toFixed(1)}% | pos ${p.Position}`);
});

// 3. Low CTR pages with high impressions (opportunity)
console.log('\n🎯 LOW CTR + HIGH IMPRESSIONS (optimization opportunities)');
const lowCTR = pages
  .filter(p => p.Impressions >= 1000 && p.CTR < 0.02)
  .sort((a, b) => b.Impressions - a.Impressions)
  .slice(0, 15);

lowCTR.forEach(p => {
  const page = (p['Top pages'] || '').replace(SITE, '');
  console.log(`  ${page}`);
  console.log(`    ${p.Impressions} impr, CTR ${(p.CTR*100).toFixed(2)}%, pos ${p.Position}, ${p.Clicks} clicks`);
});

// 4. Striking distance (position 5-15, could push to page 1)
console.log('\n🎪 STRIKING DISTANCE (pos 5-15, push to page 1)');
const strikingDist = pages
  .filter(p => p.Position >= 5 && p.Position <= 15 && p.Impressions >= 500)
  .sort((a, b) => a.Position - b.Position)
  .slice(0, 15);

strikingDist.forEach(p => {
  const page = (p['Top pages'] || '').replace(SITE, '');
  console.log(`  ${page}`);
  console.log(`    pos ${p.Position} | ${p.Impressions} impr | ${p.Clicks} clicks | CTR ${(p.CTR*100).toFixed(1)}%`);
});

// 5. Content gaps — queries with impressions but low CTR suggesting no good page
console.log('\n🔍 CONTENT GAP QUERIES (high impressions, low engagement)');
const gapQueries = queries
  .filter(q => q.Impressions >= 100 && q.CTR < 0.02 && q.Position > 5)
  .sort((a, b) => b.Impressions - a.Impressions)
  .slice(0, 20);

gapQueries.forEach(q => {
  console.log(`  "${q['Top queries']}" — ${q.Impressions} impr, pos ${q.Position}, CTR ${(q.CTR*100).toFixed(1)}%`);
});

// 6. Non-horse/CNY queries (evergreen potential)
console.log('\n🌿 NON-SEASONAL QUERIES (evergreen growth potential)');
const evergreenQueries = queries
  .filter(q => {
    const query = (q['Top queries'] || '').toLowerCase();
    return q.Impressions >= 50 &&
      !query.includes('horse') && !query.includes('马') && !query.includes('cny') &&
      !query.includes('new year') && !query.includes('year of') && !query.includes('龍馬') &&
      !query.includes('龙马') && !query.includes('万马') && !query.includes('萬馬');
  })
  .sort((a, b) => b.Impressions - a.Impressions)
  .slice(0, 30);

evergreenQueries.forEach(q => {
  console.log(`  "${q['Top queries']}" — ${q.Impressions} impr, ${q.Clicks} clicks, pos ${q.Position}`);
});

// 7. Country breakdown
console.log('\n🌍 TOP 10 COUNTRIES');
countries.slice(0, 10).forEach(c => {
  console.log(`  ${c.Country}: ${c.Clicks} clicks, ${c.Impressions} impr, CTR ${(c.CTR*100).toFixed(1)}%`);
});

// 8. Device split
console.log('\n📱 DEVICE SPLIT');
devices.forEach(d => {
  console.log(`  ${d.Device}: ${d.Clicks} clicks (${((d.Clicks/totalClicks)*100).toFixed(0)}%), CTR ${(d.CTR*100).toFixed(1)}%`);
});

// 9. Dependency analysis - how much traffic is horse/CNY
const horsePages = pages.filter(p => {
  const url = (p['Top pages'] || '').toLowerCase();
  return url.includes('horse') || url.includes('ma-dao') || url.includes('long-ma') ||
    url.includes('wan-ma') || url.includes('ma-shang') || url.includes('new-year') ||
    url.includes('cny') || url.includes('spring-festival') || url.includes('zodiac');
});
const horseClicks = horsePages.reduce((s, p) => s + (p.Clicks || 0), 0);
console.log(`\n⚠️  SEASONAL DEPENDENCY`);
console.log(`  Horse/CNY pages: ${horseClicks} clicks (${((horseClicks/totalClicks)*100).toFixed(0)}% of total)`);
console.log(`  Non-seasonal: ${totalClicks - horseClicks} clicks (${(((totalClicks - horseClicks)/totalClicks)*100).toFixed(0)}%)`);

// === AI RECOMMENDATIONS ===
async function getAIRecommendations() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('\n💡 Set OPENAI_API_KEY to get AI-powered recommendations.');
    return;
  }

  const OpenAI = require('openai');
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `You are an SEO expert analyzing Google Search Console data for chineseidioms.com, a Chinese idioms education site.

KEY METRICS (last 3 months):
- Total: ${totalClicks} clicks, ${totalImpressions} impressions
- CNY spike on ${cnyPeak.Date}: ${cnyPeak.Clicks} clicks
- Horse/CNY seasonal content: ${((horseClicks/totalClicks)*100).toFixed(0)}% of all clicks
- Current trend: last 7d ${last7clicks} clicks vs prior 7d ${prior7clicks} (${((last7clicks/prior7clicks - 1)*100).toFixed(0)}%)
- Mobile: ${((devices[0]?.Clicks/totalClicks)*100).toFixed(0)}% of traffic

TOP EVERGREEN QUERIES (non-seasonal):
${evergreenQueries.slice(0, 15).map(q => `  "${q['Top queries']}" — ${q.Impressions} impr, ${q.Clicks} clicks, pos ${q.Position}`).join('\n')}

LOW CTR PAGES (high impressions, poor click-through):
${lowCTR.slice(0, 10).map(p => `  ${(p['Top pages'] || '').replace(SITE, '')} — ${p.Impressions} impr, CTR ${(p.CTR*100).toFixed(2)}%, pos ${p.Position}`).join('\n')}

STRIKING DISTANCE PAGES (position 5-15):
${strikingDist.slice(0, 10).map(p => `  ${(p['Top pages'] || '').replace(SITE, '')} — pos ${p.Position}, ${p.Impressions} impr`).join('\n')}

TOP COUNTRIES: Singapore (4.8% CTR), US, Malaysia, Indonesia, Japan

The site already has: 680+ idioms, 240+ listicles, themes, dictionary, slang, HSK, phrases sections. We just added character pages (260 chars × 14 languages), Qingming Festival listicles, and 8 evergreen listicles.

Give me your TOP 10 specific, actionable recommendations to grow non-seasonal traffic. Focus on:
1. Quick wins for existing pages (title/meta fixes for low CTR)
2. New content ideas based on query gaps
3. How to reduce the ${((horseClicks/totalClicks)*100).toFixed(0)}% seasonal dependency
4. Any technical SEO concerns

Be specific with page URLs and suggested changes. Keep it concise.`;

  console.log('\n🤖 Generating AI recommendations...');
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
    });
    console.log('\n' + '='.repeat(60));
    console.log('  AI RECOMMENDATIONS');
    console.log('='.repeat(60));
    console.log(response.choices[0].message.content);
  } catch (err) {
    console.error('AI error:', err.message);
  }
}

getAIRecommendations();
