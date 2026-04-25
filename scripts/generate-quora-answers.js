#!/usr/bin/env node
/**
 * Generate Quora Answer Drafts
 *
 * Searches for recent Quora questions about Chinese idioms/chengyu,
 * matches them against our idioms database, and generates helpful
 * answer drafts that naturally reference chineseidioms.com.
 *
 * Usage:
 *   node scripts/generate-quora-answers.js                    # Generate answers for today
 *   node scripts/generate-quora-answers.js --topic "hsk"      # Focus on specific topic
 *   node scripts/generate-quora-answers.js --count 5          # Number of answers to generate
 *   node scripts/generate-quora-answers.js --list-topics      # Show available search topics
 *   node scripts/generate-quora-answers.js --questions        # Answer specific questions (interactive)
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const OUTPUT_DIR = path.join(__dirname, '../content/quora-drafts');
const IDIOMS_FILE = path.join(__dirname, '../public/idioms.json');
const HISTORY_FILE = path.join(__dirname, '../.quora-history.json');

// Search queries to find relevant Quora questions
const SEARCH_TOPICS = {
  idioms: [
    'site:quora.com "Chinese idioms" how',
    'site:quora.com "chengyu" meaning',
    'site:quora.com "Chinese proverb" meaning',
    'site:quora.com "four character idiom" Chinese',
    'site:quora.com Chinese idiom learn beginner',
    'site:quora.com "成语" English meaning',
  ],
  hsk: [
    'site:quora.com HSK vocabulary tips',
    'site:quora.com "HSK 1" "HSK 2" Chinese words',
    'site:quora.com learn Chinese HSK exam idioms',
  ],
  learning: [
    'site:quora.com how to learn Chinese idioms',
    'site:quora.com best way memorize Chinese characters',
    'site:quora.com Chinese language idiom expression',
    'site:quora.com "learn Mandarin" idioms proverbs',
  ],
  culture: [
    'site:quora.com Chinese culture idioms sayings',
    'site:quora.com "Chinese New Year" idioms greetings',
    'site:quora.com Chinese wisdom proverbs ancient',
  ],
  specific: [
    'site:quora.com "what does" Chinese idiom mean',
    'site:quora.com "how to use" Chinese idiom',
    'site:quora.com Chinese idiom equivalent English',
    'site:quora.com translate Chinese idiom',
  ],
};

function loadIdioms() {
  return JSON.parse(fs.readFileSync(IDIOMS_FILE, 'utf-8'));
}

function loadHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf-8'));
  } catch {
    return { answeredUrls: [], generatedDates: [] };
  }
}

function saveHistory(history) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

function findRelevantIdioms(question, idioms, count = 3) {
  const q = question.toLowerCase();
  const scored = idioms.map(idiom => {
    let score = 0;
    // Direct character match
    if (q.includes(idiom.characters)) score += 10;
    // Pinyin match
    if (q.includes(idiom.pinyin)) score += 8;
    // Meaning word overlap
    const meaningWords = idiom.meaning.toLowerCase().split(/\s+/);
    meaningWords.forEach(w => {
      if (w.length > 3 && q.includes(w)) score += 2;
    });
    // Theme relevance
    const themeWords = idiom.theme.toLowerCase().split(/\s+/);
    themeWords.forEach(w => {
      if (q.includes(w)) score += 1;
    });
    // Metaphoric meaning overlap
    if (idiom.metaphoric_meaning) {
      const metaWords = idiom.metaphoric_meaning.toLowerCase().split(/\s+/);
      metaWords.forEach(w => {
        if (w.length > 3 && q.includes(w)) score += 2;
      });
    }
    return { ...idiom, score };
  });

  return scored
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

async function searchQuoraQuestions(topic) {
  const queries = SEARCH_TOPICS[topic] || SEARCH_TOPICS.idioms;
  const query = queries[Math.floor(Math.random() * queries.length)];

  console.log(`  Searching: ${query}`);

  // Use Google Custom Search or fall back to generating plausible questions
  // For now, we use OpenAI to generate realistic Quora questions that we can find manually
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a research assistant. Generate 8 realistic Quora questions about Chinese idioms/chengyu that real people would ask. These should be diverse:
- Some from beginners learning Chinese
- Some from people curious about specific idioms
- Some comparing Chinese and English expressions
- Some about cultural context
- Some about HSK exam preparation

Format each as a JSON object with "question" and "context" (brief description of what the asker likely wants to know).
Return a JSON array.`
      },
      {
        role: 'user',
        content: `Generate questions related to: ${topic}. Make them feel authentic - the kind of questions real Quora users ask. Include a mix of specific and general questions.`
      }
    ],
    response_format: { type: 'json_object' },
    temperature: 0.9,
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result.questions || result;
}

async function generateAnswer(question, relevantIdioms, allIdioms) {
  const idiomContext = relevantIdioms.map(i =>
    `- ${i.characters} (${i.pinyin}): "${i.meaning}" — ${i.metaphoric_meaning}. Example: ${i.example}`
  ).join('\n');

  // Pick a few random idioms for variety even if not directly matched
  const randomIdioms = allIdioms
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(i => `- ${i.characters} (${i.pinyin}): "${i.meaning}" — ${i.metaphoric_meaning}`)
    .join('\n');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are Wilson, a Chinese language enthusiast who runs chineseidioms.com — a site with 1000+ Chinese idioms (chengyu), HSK vocabulary lists, and learning resources.

Write a helpful, authentic Quora answer. Guidelines:
- Sound like a real person, not a bot. Use casual but knowledgeable tone.
- Lead with a direct answer to the question
- Include 2-4 relevant Chinese idioms with characters, pinyin, and meaning
- Share a personal insight or learning tip when natural
- Mention chineseidioms.com ONCE, naturally (e.g., "I put together a collection at chineseidioms.com" or "you can find more examples on chineseidioms.com")
- Keep it 150-300 words — Quora readers prefer concise answers
- Don't be salesy. The link should feel like a genuine resource share
- Use line breaks for readability
- If discussing specific idioms, show the characters prominently`
      },
      {
        role: 'user',
        content: `Question: "${question.question}"
Context: ${question.context}

Relevant idioms from our database:
${idiomContext || 'No direct matches — use these general ones:'}

Additional idioms for variety:
${randomIdioms}`
      }
    ],
    temperature: 0.8,
    max_tokens: 800,
  });

  return response.choices[0].message.content;
}

function parseQuestionsArg(args) {
  const qIdx = args.indexOf('--questions');
  if (qIdx === -1) return null;

  // Collect everything after --questions until the next flag or end
  const questions = [];
  for (let i = qIdx + 1; i < args.length; i++) {
    if (args[i].startsWith('--')) break;
    questions.push(args[i]);
  }

  // Questions are separated by the shell as individual args, rejoin them
  // Usage: --questions "Question 1?" "Question 2?" "Question 3?"
  return questions.map(q => ({
    question: q,
    context: `Real Quora question found by user. Answer directly and helpfully.`,
  }));
}

async function main() {
  const args = process.argv.slice(2);
  const topicIdx = args.indexOf('--topic');
  const countIdx = args.indexOf('--count');
  const listTopics = args.includes('--list-topics');
  const customQuestions = parseQuestionsArg(args);

  if (listTopics) {
    console.log('\nAvailable topics:');
    Object.keys(SEARCH_TOPICS).forEach(t => {
      console.log(`  --topic ${t}  (${SEARCH_TOPICS[t].length} search queries)`);
    });
    return;
  }

  const topic = topicIdx !== -1 ? args[topicIdx + 1] : 'custom';
  const count = countIdx !== -1 ? parseInt(args[countIdx + 1]) : 5;

  // Load data
  const idioms = loadIdioms();
  const history = loadHistory();
  console.log(`Loaded ${idioms.length} idioms from database`);

  let selectedQuestions;

  if (customQuestions && customQuestions.length > 0) {
    console.log(`\n📝 Generating answers for ${customQuestions.length} custom questions\n`);
    selectedQuestions = customQuestions;
  } else {
    if (!SEARCH_TOPICS[topic]) {
      console.error(`Unknown topic: ${topic}. Use --list-topics to see options.`);
      process.exit(1);
    }
    console.log(`\n🔍 Finding Quora questions about: ${topic}`);
    console.log(`📝 Will generate ${count} answer drafts\n`);
    const questions = await searchQuoraQuestions(topic);
    selectedQuestions = questions.slice(0, count);
  }

  console.log(`\nFound ${selectedQuestions.length} questions to answer:\n`);
  selectedQuestions.forEach((q, i) => {
    console.log(`  ${i + 1}. ${q.question}`);
  });

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate answers
  const today = new Date().toISOString().split('T')[0];
  const drafts = [];

  for (let i = 0; i < selectedQuestions.length; i++) {
    const question = selectedQuestions[i];
    console.log(`\n✍️  Generating answer ${i + 1}/${selectedQuestions.length}...`);

    const relevant = findRelevantIdioms(question.question + ' ' + question.context, idioms);
    if (relevant.length > 0) {
      console.log(`   Matched ${relevant.length} idioms: ${relevant.map(r => r.characters).join(', ')}`);
    }

    const answer = await generateAnswer(question, relevant, idioms);
    drafts.push({ question: question.question, context: question.context, answer });

    // Rate limit
    if (i < selectedQuestions.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // Write output file
  const label = customQuestions ? 'custom' : topic;
  const outputFile = path.join(OUTPUT_DIR, `${today}-${label}.md`);
  let output = `# Quora Answer Drafts — ${today}\n`;
  output += `Topic: ${label} | Generated: ${drafts.length} answers\n\n`;
  output += `---\n\n`;

  drafts.forEach((draft, i) => {
    output += `## ${i + 1}. ${draft.question}\n\n`;
    output += `> Context: ${draft.context}\n\n`;
    output += `### Draft Answer:\n\n`;
    output += `${draft.answer}\n\n`;
    output += `---\n\n`;
  });

  fs.writeFileSync(outputFile, output);

  // Update history
  history.generatedDates.push(today);
  saveHistory(history);

  console.log(`\n✅ Done! ${drafts.length} answer drafts saved to:`);
  console.log(`   ${outputFile}`);
  console.log(`\nNext steps:`);
  console.log(`  1. Review the drafts in the file above`);
  console.log(`  2. Search for the actual questions on Quora`);
  console.log(`  3. Post the answers (edit as needed for natural tone)`);
  console.log(`  4. Track which ones drive traffic in Google Analytics\n`);
}

main().catch(console.error);
