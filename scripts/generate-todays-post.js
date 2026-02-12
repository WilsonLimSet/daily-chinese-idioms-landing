const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

// All supported languages
const LANGUAGES = ['es', 'pt', 'id', 'vi', 'th', 'ja', 'ko', 'hi', 'ar', 'fr', 'tl', 'ms', 'ru'];

// Function to remove tone marks from pinyin
function removeToneMarks(pinyin) {
  const toneMap = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ü': 'v', 'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v',
    'ń': 'n', 'ň': 'n', 'ǹ': 'n',
    'ḿ': 'm', 'm̀': 'm'
  };

  return pinyin.split('').map(char => toneMap[char] || char).join('');
}

async function generatePostForLanguage(lang, idiom, date, cleanPinyin) {
  const outputDir = lang === 'en'
    ? path.join(__dirname, '../content/blog')
    : path.join(__dirname, `../content/blog/${lang}`);

  await fs.mkdir(outputDir, { recursive: true });

  const filename = `${cleanPinyin}.md`;
  const filepath = path.join(outputDir, filename);

  // Check if file already exists
  try {
    await fs.access(filepath);
    console.log(`  [${lang}] Already exists: ${filename}`);
    return false;
  } catch (error) {
    // File doesn't exist, proceed to create it
  }

  const content = `---
title: "${idiom.characters} - ${idiom.metaphoric_meaning}"
date: "${date}"
characters: "${idiom.characters}"
pinyin: "${idiom.pinyin}"
meaning: "${idiom.meaning}"
metaphoric_meaning: "${idiom.metaphoric_meaning}"
theme: "${idiom.theme}"
---

**Pronunciation:** *${idiom.pinyin}*
**Literal meaning:** ${idiom.meaning}

## Origin & Usage

${idiom.description}

## When to Use

**Situation:** ${idiom.example}

---

*Discover a new Chinese idiom every day with our [iOS app](https://apps.apple.com/us/app/daily-chinese-idioms/id6740611324).*
`;

  await fs.writeFile(filepath, content);
  console.log(`  [${lang}] ✅ Generated: ${filename}`);
  return true;
}

async function generateTodaysPost() {
  const today = new Date();
  const date = format(today, 'yyyy-MM-dd');
  const startDate = new Date('2025-01-01');
  const dayOfYear = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const idiomId = `ID${dayOfYear.toString().padStart(3, '0')}`;

  console.log(`\n📅 Generating blog posts for ${date} (Idiom: ${idiomId})\n`);

  let generatedCount = 0;
  let skippedCount = 0;

  // Generate English post
  console.log('🇺🇸 English:');
  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idiomsData = await fs.readFile(idiomsPath, 'utf-8');
  const idioms = JSON.parse(idiomsData);
  const idiom = idioms.find(i => i.id === idiomId);

  if (!idiom) {
    console.log('❌ No idiom found for today');
    return;
  }

  const cleanPinyin = removeToneMarks(idiom.pinyin).replace(/\s+/g, '-');

  // Generate English post
  const generated = await generatePostForLanguage('en', idiom, date, cleanPinyin);
  if (generated) generatedCount++; else skippedCount++;

  // Generate posts for all other languages
  for (const lang of LANGUAGES) {
    const langEmojis = {
      es: '🇪🇸', pt: '🇧🇷', id: '🇮🇩', vi: '🇻🇳',
      th: '🇹🇭', ja: '🇯🇵', ko: '🇰🇷', hi: '🇮🇳',
      ar: '🇸🇦', fr: '🇫🇷', tl: '🇵🇭', ms: '🇲🇾', ru: '🇷🇺'
    };

    console.log(`\n${langEmojis[lang]} ${lang.toUpperCase()}:`);

    try {
      const langIdiomsPath = path.join(__dirname, `../public/translations/${lang}/idioms.json`);
      const langIdiomsData = await fs.readFile(langIdiomsPath, 'utf-8');
      const langIdioms = JSON.parse(langIdiomsData);
      const langIdiom = langIdioms.find(i => i.id === idiomId);

      if (!langIdiom) {
        console.log(`  [${lang}] ⚠️  Idiom not found in translation`);
        skippedCount++;
        continue;
      }

      const generated = await generatePostForLanguage(lang, langIdiom, date, cleanPinyin);
      if (generated) generatedCount++; else skippedCount++;

    } catch (error) {
      console.log(`  [${lang}] ❌ Error: ${error.message}`);
      skippedCount++;
    }
  }

  // Generate social media data (English only)
  console.log('\n📱 Social Media:');
  const socialData = {
    date,
    idiom: {
      characters: idiom.characters,
      pinyin: idiom.pinyin,
      meaning: idiom.metaphoric_meaning,
      example: idiom.example,
      theme: idiom.theme
    },
    shortDescription: idiom.description.substring(0, 280) + '...',
    hashtags: ['ChineseIdioms', 'LearnChinese', 'ChineseCulture', idiom.theme.replace(/\s+/g, '')]
  };

  const socialPath = path.join(__dirname, '../content/social', `${date}.json`);
  await fs.mkdir(path.dirname(socialPath), { recursive: true });
  await fs.writeFile(socialPath, JSON.stringify(socialData, null, 2));
  console.log(`  ✅ Generated: ${date}.json`);

  // Summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 Summary: ${generatedCount} generated, ${skippedCount} skipped`);
  console.log(`${'='.repeat(60)}\n`);
}

generateTodaysPost().catch(console.error);