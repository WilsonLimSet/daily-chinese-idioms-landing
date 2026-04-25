#!/usr/bin/env node
/**
 * Generate Medium Article Drafts
 *
 * Creates 800-1500 word articles from listicle content for publishing on Medium.
 * Each article includes natural backlinks to chineseidioms.com and outputs
 * the canonical URL for Medium's "Import Story" feature (dofollow link).
 *
 * Usage:
 *   node scripts/generate-medium-articles.js                          # Generate 3 articles
 *   node scripts/generate-medium-articles.js --count 5                # Generate 5
 *   node scripts/generate-medium-articles.js --category "culture"     # Focus on category
 *   node scripts/generate-medium-articles.js --slug "chinese-idioms-for-business"  # Specific listicle
 *   node scripts/generate-medium-articles.js --list                   # List available listicles
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUTPUT_DIR = path.join(__dirname, '../content/medium-drafts');
const IDIOMS_FILE = path.join(__dirname, '../public/idioms.json');
const HISTORY_FILE = path.join(__dirname, '../.medium-history.json');

// Parse listicles from the TypeScript source
function loadListicles() {
  const filePath = path.join(__dirname, '../src/lib/listicles.ts');
  const content = fs.readFileSync(filePath, 'utf-8');

  const listicles = [];
  const regex = /{\s*slug:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'[\s\S]*?(?:description:\s*'([^']*)')?[\s\S]*?(?:intro:\s*['`]([^'`]*?)['`])?[\s\S]*?idiomIds:\s*\[([^\]]*)\][\s\S]*?category:\s*'([^']+)'/g;

  let match;
  while ((match = regex.exec(content)) !== null) {
    const idiomIds = match[5].split(',').map(s => s.trim().replace(/'/g, '')).filter(Boolean);
    listicles.push({
      slug: match[1],
      title: match[2],
      description: match[3] || '',
      intro: match[4] || '',
      idiomIds,
      category: match[6],
    });
  }

  return listicles;
}

function loadIdioms() {
  return JSON.parse(fs.readFileSync(IDIOMS_FILE, 'utf-8'));
}

function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  } catch {
    return { publishedSlugs: [], generatedDates: [] };
  }
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function getIdiomsForListicle(listicle, allIdioms) {
  return listicle.idiomIds
    .map(id => allIdioms.find(i => i.id === id))
    .filter(Boolean);
}

async function generateMediumArticle(listicle, idioms) {
  const idiomDetails = idioms.map((i, idx) =>
    `${idx + 1}. ${i.characters} (${i.pinyin}) — "${i.meaning}"\n   Metaphoric: ${i.metaphoric_meaning}\n   Origin: ${i.description.slice(0, 200)}...\n   Example: ${i.example}`
  ).join('\n\n');

  const canonicalUrl = `https://www.chineseidioms.com/blog/lists/${listicle.slug}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are Wilson, a Chinese language enthusiast who writes engaging articles about Chinese idioms and culture. You run chineseidioms.com.

Write a Medium article (800-1500 words) that is:
- Engaging and storytelling-focused (not a dry list)
- Structured with a compelling intro, idiom deep-dives, and a conclusion
- Educational but entertaining — share cultural insights and real usage
- Include ALL the idioms provided, with characters, pinyin, and explanations
- Weave in 2-3 natural backlinks to chineseidioms.com pages:
  * One link to the main listicle page
  * One link to a specific idiom blog post (format: chineseidioms.com/blog/{pinyin-slug})
  * Optionally one to the dictionary or HSK pages
- Links should feel like genuine "learn more" resources, not ads
- Use Medium-friendly formatting: headers (##), bold (**), italic (*), blockquotes (>)
- Open with a hook — a story, surprising fact, or relatable scenario
- End with a takeaway or call-to-explore

DO NOT include a canonical URL tag in the article body — that's handled separately via Medium's import feature.`
      },
      {
        role: 'user',
        content: `Write a Medium article based on this listicle:

Title: ${listicle.title}
Category: ${listicle.category}
Description: ${listicle.description}
Intro context: ${listicle.intro}

Idioms to cover:
${idiomDetails}

Site URL for backlinks: https://www.chineseidioms.com
Listicle URL: ${canonicalUrl}
Blog post URL format: https://www.chineseidioms.com/blog/{pinyin-with-hyphens}
Dictionary: https://www.chineseidioms.com/dictionary`
      }
    ],
    temperature: 0.8,
    max_tokens: 3000,
  });

  return {
    content: response.choices[0].message.content,
    canonicalUrl,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const countIdx = args.indexOf('--count');
  const catIdx = args.indexOf('--category');
  const slugIdx = args.indexOf('--slug');
  const listMode = args.includes('--list');

  const listicles = loadListicles();
  const allIdioms = loadIdioms();
  const history = loadHistory();

  console.log(`Loaded ${listicles.length} listicles, ${allIdioms.length} idioms`);

  if (listMode) {
    const categories = [...new Set(listicles.map(l => l.category))].sort();
    console.log('\nAvailable categories:');
    categories.forEach(c => {
      const count = listicles.filter(l => l.category === c).length;
      console.log(`  ${c} (${count} listicles)`);
    });
    console.log(`\nTotal: ${listicles.length} listicles`);
    console.log('Already published:', history.publishedSlugs.length);
    console.log('Remaining:', listicles.length - history.publishedSlugs.length);
    return;
  }

  const count = countIdx !== -1 ? parseInt(args[countIdx + 1]) : 3;
  const category = catIdx !== -1 ? args[catIdx + 1] : null;
  const specificSlug = slugIdx !== -1 ? args[slugIdx + 1] : null;

  // Select listicles
  let candidates;
  if (specificSlug) {
    candidates = listicles.filter(l => l.slug === specificSlug);
    if (candidates.length === 0) {
      console.error(`Listicle not found: ${specificSlug}`);
      process.exit(1);
    }
  } else {
    candidates = listicles.filter(l => !history.publishedSlugs.includes(l.slug));
    if (category) {
      candidates = candidates.filter(l =>
        l.category.toLowerCase().includes(category.toLowerCase())
      );
    }
    // Prefer listicles with more idioms (better articles)
    candidates.sort((a, b) => b.idiomIds.length - a.idiomIds.length);
    candidates = candidates.slice(0, count);
  }

  if (candidates.length === 0) {
    console.log('No new listicles to generate articles for.');
    return;
  }

  console.log(`\nGenerating ${candidates.length} Medium articles:\n`);
  candidates.forEach((l, i) => console.log(`  ${i + 1}. ${l.title} (${l.idiomIds.length} idioms)`));

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const results = [];

  for (let i = 0; i < candidates.length; i++) {
    const listicle = candidates[i];
    const idioms = getIdiomsForListicle(listicle, allIdioms);

    console.log(`\n  Writing article ${i + 1}/${candidates.length}: "${listicle.title}" (${idioms.length} idioms)...`);

    const { content, canonicalUrl } = await generateMediumArticle(listicle, idioms);
    results.push({ listicle, content, canonicalUrl });

    // Track as generated
    if (!history.publishedSlugs.includes(listicle.slug)) {
      history.publishedSlugs.push(listicle.slug);
    }

    // Rate limit
    if (i < candidates.length - 1) {
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  // Write output
  const outputFile = path.join(OUTPUT_DIR, `${today}-medium.md`);
  let output = `# Medium Article Drafts — ${today}\n\n`;
  output += `Generated: ${results.length} articles\n\n`;
  output += `---\n\n`;

  results.forEach((r, i) => {
    output += `# Article ${i + 1}: ${r.listicle.title}\n\n`;
    output += `**Category:** ${r.listicle.category}\n`;
    output += `**Canonical URL:** ${r.canonicalUrl}\n`;
    output += `**Medium tags:** Chinese, Language Learning, Culture, Idioms, Mandarin\n\n`;
    output += `> **How to publish on Medium:**\n`;
    output += `> 1. Go to medium.com → "Write a story"\n`;
    output += `> 2. OR use "Import story" with URL: ${r.canonicalUrl}\n`;
    output += `>    (This auto-sets the canonical tag for dofollow SEO credit)\n`;
    output += `> 3. If writing manually, paste the article below\n`;
    output += `> 4. Add to publications: "Learn Chinese", "Language Learning", "Chinese Culture"\n\n`;
    output += `---\n\n`;
    output += r.content;
    output += `\n\n${'='.repeat(80)}\n\n`;
  });

  fs.writeFileSync(outputFile, output);

  // Save history
  history.generatedDates.push(today);
  saveHistory(history);

  console.log(`\n  Done! ${results.length} articles saved to:`);
  console.log(`  ${outputFile}`);
  console.log(`\nPublishing steps:`);
  console.log(`  1. Review and edit the drafts`);
  console.log(`  2. For each article, either:`);
  console.log(`     a. Use Medium's "Import story" with the canonical URL (best for SEO — auto-sets canonical)`);
  console.log(`     b. Copy-paste and manually add links`);
  console.log(`  3. Add tags: Chinese, Language Learning, Culture, Idioms, Mandarin`);
  console.log(`  4. Submit to publications for wider reach`);
  console.log(`  5. Track referral traffic in Google Analytics\n`);
}

main().catch(console.error);
