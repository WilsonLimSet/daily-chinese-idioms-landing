#!/usr/bin/env node
/**
 * Generate Blog Series for Trending Chinese Cultural Topics
 *
 * TWO-PHASE workflow to avoid AI slop:
 *
 * Phase 1 — RESEARCH (creates a research brief you review/edit):
 *   node scripts/generate-trending-series.js research --topic "Rising With the Wind (扶摇)"
 *   → Creates content/series-briefs/{topic}.json with research, idiom matches, article plans
 *   → YOU review and edit the brief before generating
 *
 * Phase 2 — GENERATE (uses your reviewed brief):
 *   node scripts/generate-trending-series.js generate --brief content/series-briefs/{topic}.json
 *   → Generates articles from the approved brief
 *
 * Other commands:
 *   node scripts/generate-trending-series.js --list              # Show existing series
 *
 * After generating, translate with:
 *   node scripts/translate-blog-articles-fast.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BLOG_DIR = path.join(__dirname, '../content/blog');
const BRIEFS_DIR = path.join(__dirname, '../content/series-briefs');
const IDIOMS_FILE = path.join(__dirname, '../public/idioms.json');
const SERIES_HISTORY = path.join(__dirname, '../.series-history.json');

// ─── Helpers ────────────────────────────────────────────

function loadIdioms() {
  return JSON.parse(fs.readFileSync(IDIOMS_FILE, 'utf-8'));
}

function loadSeriesHistory() {
  try {
    return JSON.parse(fs.readFileSync(SERIES_HISTORY, 'utf-8'));
  } catch {
    return { series: [] };
  }
}

function saveSeriesHistory(history) {
  fs.writeFileSync(SERIES_HISTORY, JSON.stringify(history, null, 2));
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

// ─── Phase 1: RESEARCH ─────────────────────────────────

async function doResearch(topic, articleCount, idioms) {
  console.log('🔍 Step 1/3: Researching topic and matching idioms...\n');

  const idiomRef = idioms.map(i =>
    `${i.id}: ${i.characters} (${i.pinyin}) — ${i.metaphoric_meaning} [${i.theme}]`
  ).join('\n');

  // Step 1: Deep research on the topic
  const researchPrompt = `You are a Chinese culture researcher. Research the following topic thoroughly.

TOPIC: "${topic}"

Provide a detailed research brief covering:

1. **BASIC FACTS**: What is this? (C-drama, movie, event, book, etc.) When did it release/happen? Key people involved (actors, directors, authors). Ratings, viewership, or cultural impact metrics if available.

2. **PLOT/EVENT SUMMARY**: Detailed summary — main characters with Chinese names, key plot points or event details, setting (dynasty, location, time period).

3. **HISTORICAL BASIS**: What real Chinese history, traditions, or cultural practices does this draw from? Be SPECIFIC — name dynasties, historical figures, legal codes, actual events. Do NOT make up historical facts.

4. **CULTURAL THEMES**: What Chinese cultural values, philosophies, or social dynamics are central? (e.g., filial piety, face/honor, literary tradition, martial culture, gender roles, class systems)

5. **KEY CHINESE TERMS**: Important Chinese words, phrases, or concepts that appear in or relate to this topic. Include characters and pinyin.

6. **WHY IT'S TRENDING**: What makes this culturally significant right now? Why are people searching for it?

IMPORTANT: Only include facts you are confident about. If you're unsure about a specific detail (release date, actor name, viewership number), say "VERIFY:" before it so the human editor can fact-check. It is much better to flag uncertainty than to state something wrong.

Return as JSON:
{
  "basicFacts": { "type": "", "releaseDate": "", "keyPeople": [], "impact": "" },
  "plotSummary": "",
  "historicalBasis": [{ "topic": "", "details": "", "dynasties": [], "figures": [] }],
  "culturalThemes": [{ "theme": "", "explanation": "" }],
  "keyChineseTerms": [{ "characters": "", "pinyin": "", "meaning": "", "relevance": "" }],
  "whyTrending": "",
  "verifyFlags": ["list of things marked VERIFY that need human fact-checking"]
}`;

  const researchResult = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: researchPrompt }],
    max_tokens: 4096,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const research = JSON.parse(researchResult.choices[0].message.content);
  console.log('   ✅ Research complete');

  if (research.verifyFlags && research.verifyFlags.length > 0) {
    console.log('\n   ⚠️  ITEMS TO FACT-CHECK:');
    research.verifyFlags.forEach(f => console.log(`      - ${f}`));
  }

  // Step 2: Match idioms to the topic
  console.log('\n🔍 Step 2/3: Matching idioms to topic...\n');

  const matchPrompt = `Given this research about "${topic}", select the most relevant Chinese idioms from the database.

RESEARCH:
${JSON.stringify(research, null, 2)}

IDIOM DATABASE (${idioms.length} idioms):
${idiomRef}

For each idiom you select, explain the SPECIFIC connection to the topic. Don't force connections — only pick idioms that genuinely relate to a character, theme, plot point, or historical parallel.

Return JSON:
{
  "matches": [
    {
      "id": "IDXXX",
      "characters": "...",
      "connection": "Specific explanation of how this idiom relates to the topic (1-2 sentences)",
      "strength": "strong|medium",
      "relevantTo": "which aspect of the topic (character name, theme, historical element, etc.)"
    }
  ]
}

Select 20-40 idioms total. Prioritize strong connections.`;

  const matchResult = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: matchPrompt }],
    max_tokens: 4096,
    temperature: 0.3,
    response_format: { type: 'json_object' },
  });

  const idiomMatches = JSON.parse(matchResult.choices[0].message.content);
  console.log(`   ✅ Found ${idiomMatches.matches.length} relevant idioms`);

  // Step 3: Plan the article series
  console.log(`\n🔍 Step 3/3: Planning ${articleCount} article angles...\n`);

  const strongMatches = idiomMatches.matches.filter(m => m.strength === 'strong');
  const mediumMatches = idiomMatches.matches.filter(m => m.strength === 'medium');

  const planPrompt = `Plan a series of ${articleCount} blog articles about "${topic}" for chineseidioms.com.

RESEARCH:
${JSON.stringify(research, null, 2)}

MATCHED IDIOMS (${idiomMatches.matches.length} total, ${strongMatches.length} strong):
${idiomMatches.matches.map(m => `${m.id} ${m.characters} — ${m.connection} [${m.strength}]`).join('\n')}

ARTICLE ANGLE TYPES (use a mix — no two articles should have the same angle):
1. "X Chinese Idioms Every [Topic] Fan Should Know" — listicle linking idioms to characters/plot
2. "The Real History Behind [Topic]" — deep historical dive with idioms as evidence
3. "Famous Quotes from [Topic] Explained" — quote/dialogue analysis with idiom connections
4. "Why [Symbol/Theme] Matters in Chinese Culture" — cultural symbolism exploration
5. "Learn Chinese Watching [Topic]" — language learning angle with vocabulary + idioms
6. "[Character] Through Chinese Idioms" — character study using chengyu
7. "Cultural References in [Topic] You Missed" — hidden meanings and allusions

RULES:
- First article should be the broadest (listicle format) — highest traffic potential
- Each article gets 5-12 idioms. Prefer strong matches. Don't repeat idioms across articles.
- Titles MUST include the topic name for SEO
- Include Chinese characters (汉字) in at least 2 titles
- Slugs should start with the topic name (e.g., "rising-with-the-wind-idioms-...")

Return JSON:
{
  "articles": [
    {
      "title": "...",
      "slug": "...",
      "angle": "which type from above",
      "theme": "Success & Perseverance | Life Philosophy | Wisdom & Learning | Relationships & Character | Strategy & Action",
      "description": "150-200 char meta description, make it clickable",
      "idiomIds": ["ID001", ...],
      "outline": "4-6 bullet points of what specific content this article will cover. Be concrete — name characters, scenes, historical parallels.",
      "keyFacts": ["specific facts from the research this article should reference"]
    }
  ]
}`;

  const planResult = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: planPrompt }],
    max_tokens: 4096,
    temperature: 0.5,
    response_format: { type: 'json_object' },
  });

  const plan = JSON.parse(planResult.choices[0].message.content);
  console.log(`   ✅ Planned ${plan.articles.length} articles\n`);

  // Assemble the full brief
  const brief = {
    _instructions: [
      'REVIEW THIS BRIEF BEFORE GENERATING ARTICLES.',
      'Edit anything that looks wrong, especially items in verifyFlags.',
      'You can: remove/add idiomIds, edit outlines, change titles, reorder articles.',
      'When ready: node scripts/generate-trending-series.js generate --brief <this-file>',
    ],
    topic,
    date: getToday(),
    research,
    idiomMatches: idiomMatches.matches,
    articles: plan.articles,
  };

  return brief;
}

// ─── Phase 2: GENERATE ─────────────────────────────────

async function generateArticle(articlePlan, brief, idioms) {
  const selectedIdioms = articlePlan.idiomIds
    .map(id => idioms.find(i => i.id === id))
    .filter(Boolean);

  const idiomDetails = selectedIdioms.map((i, idx) =>
    `${idx + 1}. ${i.characters} (${i.pinyin})
   Literal: ${i.meaning}
   Metaphoric: ${i.metaphoric_meaning}
   Origin: ${i.description.slice(0, 400)}
   Example: ${i.example}
   Chinese: ${i.chineseExample}`
  ).join('\n\n');

  // Internal links to other articles in the series
  const otherArticles = brief.articles
    .filter(a => a.slug !== articlePlan.slug)
    .map(a => `- [${a.title}](/blog/${a.slug})`)
    .join('\n');

  // Build research context specific to this article
  const researchContext = `
TOPIC: "${brief.topic}"
TYPE: ${brief.research.basicFacts.type}
KEY PEOPLE: ${brief.research.basicFacts.keyPeople?.join(', ') || 'N/A'}

RELEVANT HISTORICAL CONTEXT:
${brief.research.historicalBasis.map(h => `- ${h.topic}: ${h.details}`).join('\n')}

KEY CHINESE TERMS:
${brief.research.keyChineseTerms.map(t => `- ${t.characters} (${t.pinyin}): ${t.meaning}`).join('\n')}

KEY FACTS THIS ARTICLE SHOULD USE:
${(articlePlan.keyFacts || []).map(f => `- ${f}`).join('\n')}`;

  const prompt = `Write a long-form blog article for chineseidioms.com.

${researchContext}

ARTICLE TITLE: "${articlePlan.title}"
ANGLE: ${articlePlan.angle}

OUTLINE:
${articlePlan.outline}

IDIOMS TO FEATURE (use ALL of them, in a natural order):
${idiomDetails}

OTHER ARTICLES IN THIS SERIES (link to 2-3 naturally within the text):
${otherArticles}

WRITING RULES:
- 1500-3000 words. Prioritize depth over length.
- Write like a knowledgeable cultural essayist, not a content mill. Your Pursuit of Jade articles are the benchmark — specific, opinionated, historically grounded.
- Each idiom section: characters + pinyin heading, meaning, the SPECIFIC connection to this topic (not generic), and a "**Use it:**" line for practical application.
- Include SPECIFIC details: character names with Chinese (范长玉), dynasty names, historical dates, named historical figures, legal codes, actual cultural practices.
- Use markdown: ## for sections, ** for bold, * for italics, --- for section breaks
- Link to idiom pages naturally: [卧薪尝胆](/blog/wo-xin-chang-dan) using pinyin-slug format
- DO NOT include the title (it's in frontmatter)
- DO NOT add a conclusion section or "final thoughts" — end on the last idiom or a strong point
- Start with a compelling hook paragraph that establishes why this topic matters NOW
- NEVER use: "let's dive in", "in this article", "without further ado", "whether you're a beginner", "in conclusion", "as we've seen"
- If you're unsure about a fact, omit it rather than risk being wrong

OUTPUT: Return ONLY the article markdown body. No frontmatter, no title.`;

  const result = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 8192,
    temperature: 0.7,
  });

  return result.choices[0].message.content.trim();
}

function saveArticle(articlePlan, body, today) {
  const frontmatter = `---
title: "${articlePlan.title.replace(/"/g, '\\"')}"
date: "${today}"
characters: ""
pinyin: ""
meaning: ""
metaphoric_meaning: ""
theme: "${articlePlan.theme}"
description: "${articlePlan.description.replace(/"/g, '\\"')}"
---
`;

  const filePath = path.join(BLOG_DIR, `${articlePlan.slug}.md`);
  fs.writeFileSync(filePath, frontmatter + body);
  return filePath;
}

// ─── CLI ────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  // --list
  if (args.includes('--list')) {
    const history = loadSeriesHistory();
    if (history.series.length === 0) {
      console.log('No series generated yet.');
    } else {
      for (const s of history.series) {
        console.log(`\n📺 ${s.topic} (${s.date})`);
        for (const a of s.articles) {
          console.log(`   - ${a.title}`);
          console.log(`     /blog/${a.slug}`);
        }
      }
    }

    // Also show pending briefs
    ensureDir(BRIEFS_DIR);
    const briefs = fs.readdirSync(BRIEFS_DIR).filter(f => f.endsWith('.json'));
    if (briefs.length > 0) {
      console.log('\n📋 Pending briefs (not yet generated):');
      briefs.forEach(b => console.log(`   ${path.join(BRIEFS_DIR, b)}`));
    }
    return;
  }

  // research --topic "..."
  if (command === 'research') {
    const topicIdx = args.indexOf('--topic');
    if (topicIdx === -1) {
      console.error('Usage: node scripts/generate-trending-series.js research --topic "Topic Name" [--articles N]');
      process.exit(1);
    }
    const topic = args[topicIdx + 1];
    const countIdx = args.indexOf('--articles');
    const articleCount = countIdx !== -1 ? parseInt(args[countIdx + 1]) : 5;

    const idioms = loadIdioms();
    console.log(`📚 Loaded ${idioms.length} idioms\n`);

    const brief = await doResearch(topic, articleCount, idioms);

    // Save brief
    ensureDir(BRIEFS_DIR);
    const briefSlug = slugify(topic);
    const briefPath = path.join(BRIEFS_DIR, `${briefSlug}.json`);
    fs.writeFileSync(briefPath, JSON.stringify(brief, null, 2));

    console.log(`${'═'.repeat(60)}`);
    console.log(`📋 Brief saved: ${briefPath}`);
    console.log(`${'═'.repeat(60)}`);
    console.log('\nPlanned articles:');
    brief.articles.forEach((a, i) => {
      console.log(`\n  ${i + 1}. ${a.title}`);
      console.log(`     Slug: ${a.slug}`);
      console.log(`     Angle: ${a.angle}`);
      console.log(`     Idioms: ${a.idiomIds.length}`);
    });

    if (brief.research.verifyFlags?.length > 0) {
      console.log('\n⚠️  FACT-CHECK THESE BEFORE GENERATING:');
      brief.research.verifyFlags.forEach(f => console.log(`   - ${f}`));
    }

    console.log(`\nNext: Review & edit ${briefPath}, then run:`);
    console.log(`  node scripts/generate-trending-series.js generate --brief ${briefPath}`);
    return;
  }

  // generate --brief <path>
  if (command === 'generate') {
    const briefIdx = args.indexOf('--brief');
    if (briefIdx === -1) {
      console.error('Usage: node scripts/generate-trending-series.js generate --brief <path-to-brief.json>');
      process.exit(1);
    }
    const briefPath = args[briefIdx + 1];

    if (!fs.existsSync(briefPath)) {
      console.error(`Brief not found: ${briefPath}`);
      process.exit(1);
    }

    const brief = JSON.parse(fs.readFileSync(briefPath, 'utf-8'));
    const idioms = loadIdioms();
    const today = getToday();
    const savedFiles = [];

    console.log(`\n🎬 Generating ${brief.articles.length} articles for "${brief.topic}"...\n`);

    for (const [i, article] of brief.articles.entries()) {
      console.log(`✍️  ${i + 1}/${brief.articles.length}: "${article.title}"...`);

      const body = await generateArticle(article, brief, idioms);
      const filePath = saveArticle(article, body, today);
      savedFiles.push(filePath);

      const wordCount = body.split(/\s+/).length;
      console.log(`   ✅ ${wordCount} words → ${path.basename(filePath)}`);

      if (i < brief.articles.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }
    }

    // Update history
    const history = loadSeriesHistory();
    history.series.push({
      topic: brief.topic,
      date: today,
      articles: brief.articles.map(a => ({ title: a.title, slug: a.slug })),
    });
    saveSeriesHistory(history);

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`✅ ${savedFiles.length} articles generated for "${brief.topic}"`);
    console.log(`${'═'.repeat(60)}`);
    console.log('\nFiles:');
    savedFiles.forEach(f => console.log(`  ${path.basename(f)}`));
    console.log('\nNext steps:');
    console.log('  1. Review & edit articles in content/blog/');
    console.log('  2. Translate: node scripts/translate-blog-articles-fast.js');
    console.log('  3. Deploy: npm run build');
    return;
  }

  // Default: show help
  console.log(`Trending Series Generator — Two-Phase Workflow

Phase 1 (Research & Plan):
  node scripts/generate-trending-series.js research --topic "Drama Name (中文)" [--articles 5]

  → Creates a brief in content/series-briefs/ for you to review/edit
  → Flags uncertain facts for you to verify
  → Matches idioms to the topic with explanations

Phase 2 (Generate Articles):
  node scripts/generate-trending-series.js generate --brief content/series-briefs/topic.json

  → Generates articles from your reviewed brief
  → Saves to content/blog/

Other:
  --list    Show existing series and pending briefs

After generating:
  node scripts/translate-blog-articles-fast.js    # Translate to 13 languages
`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
