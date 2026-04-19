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
const { GoogleGenerativeAI } = require('@google/generative-ai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Gemini 2.5 Pro handles the long-form article writing — GPT-4o stays for
// structured JSON (research extraction, idiom matching, planning, review).
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const writerModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro',
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 16384,
  },
});

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

async function doResearch(topic, articleCount, idioms, externalResearchMd) {
  console.log('🔍 Step 1/3: Researching topic and matching idioms...\n');

  const idiomRef = idioms.map(i =>
    `${i.id}: ${i.characters} (${i.pinyin}) — ${i.metaphoric_meaning} [${i.theme}]`
  ).join('\n');

  // Step 1: Deep research on the topic
  const researchPrompt = externalResearchMd
    ? `You are a Chinese culture researcher. Below is a web-sourced research brief about a topic. Your job is to EXTRACT and STRUCTURE it into the JSON schema specified — do NOT add new facts, do NOT invent details. Only restructure what's already in the brief. If a field has no supporting information in the brief, leave it empty.

TOPIC: "${topic}"

WEB-SOURCED RESEARCH BRIEF:
"""
${externalResearchMd}
"""

Return as JSON (pull every detail from the brief above):
{
  "basicFacts": { "type": "", "releaseDate": "", "keyPeople": [], "impact": "" },
  "plotSummary": "",
  "historicalBasis": [{ "topic": "", "details": "", "dynasties": [], "figures": [] }],
  "culturalThemes": [{ "theme": "", "explanation": "" }],
  "keyChineseTerms": [{ "characters": "", "pinyin": "", "meaning": "", "relevance": "" }],
  "whyTrending": "",
  "verifyFlags": []
}`
    : `You are a Chinese culture researcher. Research the following topic thoroughly.

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
  console.log(externalResearchMd
    ? '   ✅ Research extracted from external brief'
    : '   ✅ Research complete');

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
      "theme": "<PICK EXACTLY ONE of these 5 strings verbatim — do not combine with pipes, do not invent: 'Success & Perseverance', 'Life Philosophy', 'Wisdom & Learning', 'Relationships & Character', 'Strategy & Action'>",
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
    // Preserve full web-sourced research so generate step has access to depth
    // the structured JSON schema drops (cast, controversies, viral moments, etc.)
    externalResearchMd: externalResearchMd || null,
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
   Origin: ${i.description.slice(0, 600)}
   Example: ${i.example}
   Chinese: ${i.chineseExample}
   Slug: ${pinyinToSlug(i.pinyin)}`
  ).join('\n\n');

  // Internal links to other articles in the series
  const otherArticles = brief.articles
    .filter(a => a.slug !== articlePlan.slug)
    .map(a => `- [${a.title}](/blog/${a.slug})`)
    .join('\n');

  // Build research context specific to this article
  const structuredContext = `
TOPIC: "${brief.topic}"
TYPE: ${brief.research.basicFacts.type}
KEY PEOPLE: ${brief.research.basicFacts.keyPeople?.join(', ') || 'N/A'}

PLOT SUMMARY (source of truth — do NOT contradict):
${brief.research.plotSummary || 'N/A'}

RELEVANT HISTORICAL CONTEXT:
${brief.research.historicalBasis.map(h => `- ${h.topic}: ${h.details}`).join('\n')}

KEY CHINESE TERMS:
${brief.research.keyChineseTerms.map(t => `- ${t.characters} (${t.pinyin}): ${t.meaning}`).join('\n')}

KEY FACTS THIS ARTICLE SHOULD USE:
${(articlePlan.keyFacts || []).map(f => `- ${f}`).join('\n')}`;

  // If the brief has a full web-sourced research markdown, include it as
  // additional context. Structured JSON extraction drops 80% of the original
  // depth (cast, controversies, viral moments, specific quotes) — passing the
  // raw markdown restores it for the writer.
  const fullResearchSection = brief.externalResearchMd
    ? `\n\nFULL WEB-SOURCED RESEARCH BRIEF (authoritative — use for specifics, cast names, controversies, viral moments, cultural depth):
"""
${brief.externalResearchMd}
"""`
    : '';

  const prompt = `Write a long-form blog article for chineseidioms.com.

${structuredContext}${fullResearchSection}

ARTICLE TITLE: "${articlePlan.title}"
ANGLE: ${articlePlan.angle}

OUTLINE:
${articlePlan.outline}

IDIOMS TO FEATURE (use ALL of them, in a natural order):
${idiomDetails}

OTHER ARTICLES IN THIS SERIES (link to 2-3 naturally within the text):
${otherArticles}

═══════════════════════════════════════════════════════════
HARD RULES — violations will be visible and the article will be rejected:
═══════════════════════════════════════════════════════════

LENGTH: 2000-3500 words. The benchmark Pursuit of Jade articles are ~3,500 words. If you find yourself under 2,000 words, you have not done your job — expand the idiom origin stories and the topic-specific connections.

PER-IDIOM STRUCTURE (every idiom section must have ALL of these):
1. Heading: ## {chinese characters} ({pinyin}) — "{short English gloss}"
2. **Meaning:** one-line English meaning.
3. **Origin paragraph**: where does this idiom COME FROM? Name the classical text, dynasty, historical figure, or story. Example: "卧薪尝胆 comes from King Goujian of Yue (勾践), who..." — if the structured idiom data doesn't have an origin, write what you know to be true from the classical canon. NEVER skip this.
4. **Connection paragraph**: how does it map onto a specific character, scene, or plot beat in the drama? Name the character, the episode, or the event. Generic connections are a failure.
5. **Use it:** a one-line practical guide, not an example sentence.

FACTUAL ACCURACY (non-negotiable):
- Before writing each character's name, verify against the PLOT SUMMARY and KEY PEOPLE lists. If the research says "Chu Qiao has amnesia", you must never say another character has amnesia.
- If the drama is a sequel (like Rebirth → Princess Agents 2), do not confuse the two. State which is which.
- If a fact is not in the research, do not invent it. Omit it.

TONE:
- Write like a knowledgeable cultural essayist. Take positions. "Patience is not passivity — it's strategy forged in suffering" is the benchmark register.
- Include specific cultural or textual references: 史记, 左传, 论语, I Ching, Tang/Song poets by name.
- Identify the single thematic thesis of the drama early and return to it.

LEVERAGE THE RESEARCH:
- If the research mentions a controversy, viral moment, ratings flop, actor drama, or famous quote — USE IT. Mentioning something once in the intro and dropping it is a failure.
- If there is a famous poem, folk saying, or cultural concept named in the research, name it in the article with its Chinese + pinyin + source.

INTERNAL LINKING:
- At least 5 idiom character-headings should link to the idiom's slug page: [卧薪尝胆](/blog/wo-xin-chang-dan) — use the slug provided in the IDIOMS list.
- Link to 2-3 other articles from OTHER ARTICLES IN THIS SERIES naturally in the body.

FORMATTING:
- ## for sections, ** for bold, * for italics, --- between idiom sections
- DO NOT include the title (it's in frontmatter).
- DO NOT add a conclusion section, "final thoughts", "in summary", or a wrap-up paragraph. End on the last idiom's content.

BANNED PHRASES (if any appear, the article will be rejected):
- "In a world where"
- "let's dive in"
- "in this article"
- "without further ado"
- "whether you're a beginner"
- "in conclusion"
- "as we've seen"
- "intricate tapestry"
- "emerges as"
- "highly anticipated"
- "captivates" / "captivating"
- "unfolds" / "unfolding"
- "delve into"

OUTPUT: Return ONLY the article markdown body. No frontmatter, no title.`;

  const result = await writerModel.generateContent(prompt);
  let text = result.response.text().trim();

  // Gemini sometimes wraps output in ```markdown ... ``` — strip if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:markdown|md)?\s*\n?/, '').replace(/\n?```\s*$/, '').trim();
  }
  // Also strip any leading frontmatter the model might have added against instructions
  if (text.startsWith('---')) {
    const endIdx = text.indexOf('---', 3);
    if (endIdx !== -1) {
      text = text.slice(endIdx + 3).trim();
    }
  }

  // Gemini sometimes nests ### on top of ## for idiom headings — flatten to ##
  text = text.replace(/^###\s+##\s+/gm, '## ');
  // And normalize any accidental #### to ## as well
  text = text.replace(/^####\s+##\s+/gm, '## ');

  return text;
}

// Copied from src/lib/utils/pinyin.ts for Node usage
function pinyinToSlug(pinyin) {
  const TONE_MAP = {
    'ā':'a','á':'a','ǎ':'a','à':'a',
    'ē':'e','é':'e','ě':'e','è':'e',
    'ī':'i','í':'i','ǐ':'i','ì':'i',
    'ō':'o','ó':'o','ǒ':'o','ò':'o',
    'ū':'u','ú':'u','ǔ':'u','ù':'u',
    'ü':'v','ǖ':'v','ǘ':'v','ǚ':'v','ǜ':'v',
    'ń':'n','ň':'n','ǹ':'n',
  };
  return pinyin
    .split('')
    .map(c => TONE_MAP[c] || c)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-');
}

// Self-review step: catches factual errors, banned phrases, missing origins
async function reviewArticle(articleBody, articlePlan, brief) {
  const plotSummary = brief.research.plotSummary || '';
  const keyPeople = brief.research.basicFacts.keyPeople?.join('\n') || '';

  const reviewPrompt = `You are a factual reviewer for chineseidioms.com blog articles. Review the article below against the ground-truth research and flag any problems.

ARTICLE TITLE: ${articlePlan.title}

GROUND TRUTH — PLOT:
${plotSummary}

GROUND TRUTH — KEY PEOPLE:
${keyPeople}

ARTICLE TO REVIEW:
"""
${articleBody}
"""

Check and return JSON:
{
  "factualErrors": ["list statements that contradict the plot/people ground truth"],
  "bannedPhrases": ["any phrases like: 'In a world where', 'intricate tapestry', 'delve into', 'emerges as', 'captivates', 'unfolds', 'highly anticipated'"],
  "hasConcludingWrapUp": true_or_false,
  "missingOriginStories": ["list any idiom headings that don't explain where the idiom comes from (classical text, historical figure, dynasty)"],
  "hasIntroHook": true_or_false,
  "introHookQuality": "strong|weak|missing",
  "internalIdiomLinkCount": number_of_markdown_links_to_blog_idiom_slugs,
  "dramaContextMentions": number_of_times_the_article_body_(not_intro)_cites_specific_drama_facts_like_ratings_cast_episodes_controversies,
  "wordCount": approximate_number,
  "overallGrade": "A|B|C|D|F",
  "needsRegeneration": true_or_false
}

Set needsRegeneration=true if ANY of:
- factualErrors.length > 0
- hasConcludingWrapUp is true
- missingOriginStories.length > 0
- hasIntroHook is false
- internalIdiomLinkCount < 5
- wordCount < 2500
- dramaContextMentions < 3`;

  const result = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: reviewPrompt }],
    max_tokens: 2048,
    temperature: 0,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(result.choices[0].message.content);
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

  // research --topic "..." [--research-file <path>]
  if (command === 'research') {
    const topicIdx = args.indexOf('--topic');
    if (topicIdx === -1) {
      console.error('Usage: node scripts/generate-trending-series.js research --topic "Topic Name" [--articles N] [--research-file path/to/research.md]');
      process.exit(1);
    }
    const topic = args[topicIdx + 1];
    const countIdx = args.indexOf('--articles');
    const articleCount = countIdx !== -1 ? parseInt(args[countIdx + 1]) : 5;

    const researchFileIdx = args.indexOf('--research-file');
    let externalResearchMd = null;
    if (researchFileIdx !== -1) {
      const researchFilePath = args[researchFileIdx + 1];
      if (!fs.existsSync(researchFilePath)) {
        console.error(`Research file not found: ${researchFilePath}`);
        process.exit(1);
      }
      externalResearchMd = fs.readFileSync(researchFilePath, 'utf-8');
      console.log(`📄 Using external research: ${researchFilePath} (${externalResearchMd.length} chars)\n`);
    }

    const idioms = loadIdioms();
    console.log(`📚 Loaded ${idioms.length} idioms\n`);

    const brief = await doResearch(topic, articleCount, idioms, externalResearchMd);

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

      let body = await generateArticle(article, brief, idioms);
      let wordCount = body.split(/\s+/).length;
      console.log(`   📝 Draft: ${wordCount} words`);

      // Self-review: check for factual errors, banned phrases, missing origins
      console.log(`   🔍 Reviewing...`);
      const review = await reviewArticle(body, article, brief);

      const issues = [];
      if (review.factualErrors?.length) issues.push(`${review.factualErrors.length} factual error(s)`);
      if (review.bannedPhrases?.length) issues.push(`${review.bannedPhrases.length} banned phrase(s)`);
      if (review.hasConcludingWrapUp) issues.push('conclusion section');
      if (review.missingOriginStories?.length) issues.push(`${review.missingOriginStories.length} idiom(s) missing origin`);
      if (!review.hasIntroHook) issues.push('no intro hook');
      if ((review.internalIdiomLinkCount || 0) < 5) issues.push(`${review.internalIdiomLinkCount || 0}/5 internal idiom links`);
      if ((review.dramaContextMentions || 0) < 3) issues.push(`${review.dramaContextMentions || 0}/3 drama context mentions`);
      if (review.wordCount < 2500) issues.push(`under 2500 words (${review.wordCount})`);

      if (review.needsRegeneration && issues.length > 0) {
        console.log(`   ⚠️  Issues: ${issues.join(', ')} — regenerating with feedback...`);

        // Second attempt with explicit feedback on what to fix
        const feedback = `
PREVIOUS DRAFT FAILED REVIEW. Specific issues to fix:
${review.factualErrors?.length ? `\nFACTUAL ERRORS (contradicted the research):\n${review.factualErrors.map(e => `- ${e}`).join('\n')}` : ''}
${review.bannedPhrases?.length ? `\nBANNED PHRASES USED — remove every instance:\n${review.bannedPhrases.map(p => `- ${p}`).join('\n')}` : ''}
${review.hasConcludingWrapUp ? `\nCONCLUSION SECTION FOUND — remove any wrap-up, summary, or "final thoughts" paragraph. End on the last idiom.` : ''}
${review.missingOriginStories?.length ? `\nIDIOMS MISSING ORIGIN STORIES — every idiom needs a paragraph naming the classical text, historical figure, or dynasty it comes from:\n${review.missingOriginStories.map(e => `- ${e}`).join('\n')}` : ''}
${!review.hasIntroHook ? `\nNO INTRO HOOK — the article started with a bare idiom heading. Add 2-3 opening paragraphs BEFORE the first idiom heading that establish: what the drama is, why it matters right now (use Douban ratings, viral moments, cast controversy from the research), and what the reader will learn. The Pursuit of Jade article opens with "If you've been watching Pursuit of Jade (逐玉) — the 2026 C-drama that shattered records with a 55.1% daily market share..." — match that register.` : ''}
${(review.internalIdiomLinkCount || 0) < 5 ? `\nINSUFFICIENT INTERNAL LINKS — the first mention of each idiom in a section heading should be a markdown link to its slug, e.g. [卧薪尝胆](/blog/wo-xin-chang-dan). Need at least 5.` : ''}
${(review.dramaContextMentions || 0) < 3 ? `\nNOT USING THE RESEARCH — the article body (not just intro) must cite at least 3 specific drama facts: Douban rating, Tencent heat score, Zhao Liying controversy, OST plagiarism scandal, Huangyang Tiantian meta-layer, specific episode ranges, SEA fandom, etc. Generic statements about "the drama" don't count.` : ''}
${review.wordCount < 2500 ? `\nWORD COUNT TOO LOW (${review.wordCount} — target 2800+): expand origin stories (each should be 3-5 sentences with specific dates, figures, texts) and topic-specific connections (each should name specific characters, episodes, scenes).` : ''}

Rewrite the article addressing EVERY issue above. Do not just touch the problem lines — re-think and expand.`;

        body = await generateArticle({
          ...article,
          outline: article.outline + '\n\n' + feedback,
        }, brief, idioms);
        wordCount = body.split(/\s+/).length;
        console.log(`   🔄 Revised: ${wordCount} words`);
      } else {
        console.log(`   ✅ Review passed (grade: ${review.overallGrade})`);
      }

      const filePath = saveArticle(article, body, today);
      savedFiles.push(filePath);

      console.log(`   → ${path.basename(filePath)}`);

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
  node scripts/generate-trending-series.js research --topic "Drama Name (中文)" [--articles 5] [--research-file path.md]

  → Creates a brief in content/series-briefs/ for you to review/edit
  → Flags uncertain facts for you to verify
  → Matches idioms to the topic with explanations

  --research-file: Use a pre-written web-sourced research markdown as input
                   (bypasses GPT-4o's stale training knowledge for new dramas)
                   See content/series-briefs/research/ for examples.

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
