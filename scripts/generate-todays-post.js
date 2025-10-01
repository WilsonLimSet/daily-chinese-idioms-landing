const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

// Function to remove tone marks from pinyin
function removeToneMarks(pinyin) {
  const toneMap = {
    'ā': 'a', 'á': 'a', 'ǎ': 'a', 'à': 'a',
    'ē': 'e', 'é': 'e', 'ě': 'e', 'è': 'e',
    'ī': 'i', 'í': 'i', 'ǐ': 'i', 'ì': 'i',
    'ō': 'o', 'ó': 'o', 'ǒ': 'o', 'ò': 'o',
    'ū': 'u', 'ú': 'u', 'ǔ': 'u', 'ù': 'u',
    'ǖ': 'v', 'ǘ': 'v', 'ǚ': 'v', 'ǜ': 'v',
    'ń': 'n', 'ň': 'n', 'ǹ': 'n',
    'ḿ': 'm', 'm̀': 'm'
  };
  
  return pinyin.split('').map(char => toneMap[char] || char).join('');
}

async function generateTodaysPost() {
  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idiomsData = await fs.readFile(idiomsPath, 'utf-8');
  const idioms = JSON.parse(idiomsData);
  
  const outputDir = path.join(__dirname, '../content/blog');
  await fs.mkdir(outputDir, { recursive: true });
  
  const startDate = new Date('2025-01-01');
  const today = new Date();
  
  const dayOfYear = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const idiomId = `ID${dayOfYear.toString().padStart(3, '0')}`;
  const idiom = idioms.find(i => i.id === idiomId);
  
  if (!idiom) {
    console.log('No idiom found for today');
    return;
  }
  
  const date = format(today, 'yyyy-MM-dd');
  const cleanPinyin = removeToneMarks(idiom.pinyin).replace(/\s+/g, '-');
  const filename = `${date}-${cleanPinyin}.md`;
  const filepath = path.join(outputDir, filename);
  
  // Check if file already exists
  try {
    await fs.access(filepath);
    console.log(`Blog post already exists: ${filename}`);
    return;
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

**{{pronunciation}}:** *${idiom.pinyin}*
**{{literalMeaning}}:** ${idiom.meaning}

## {{originUsage}}

${idiom.description}

## {{whenToUse}}

**{{situation}}:** ${idiom.example}

---

*{{discoverDaily}}*
`;

  await fs.writeFile(filepath, content);
  console.log(`Generated: ${filename}`);
  
  // Also generate a JSON file for easy social media automation
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
  console.log(`Generated social media data: ${date}.json`);
}

generateTodaysPost().catch(console.error);