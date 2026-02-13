const fs = require('fs').promises;
const path = require('path');
const { format } = require('date-fns');

async function generateBlogPosts() {
  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idiomsData = await fs.readFile(idiomsPath, 'utf-8');
  const idioms = JSON.parse(idiomsData);
  
  const outputDir = path.join(__dirname, '../content/blog');
  await fs.mkdir(outputDir, { recursive: true });
  
  const startDate = new Date('2025-01-01');
  const today = new Date();
  
  let generatedCount = 0;
  
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfYear = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const idiomId = `ID${dayOfYear.toString().padStart(3, '0')}`;
    const idiom = idioms.find(i => i.id === idiomId);
    
    if (!idiom) continue;
    
    const date = format(d, 'yyyy-MM-dd');
    const filename = `${date}-${idiom.pinyin.replace(/\s+/g, '-')}.md`;
    const filepath = path.join(outputDir, filename);
    
    const content = `---
title: "${idiom.characters} - ${idiom.metaphoric_meaning}"
date: "${date}"
characters: "${idiom.characters}"
pinyin: "${idiom.pinyin}"
meaning: "${idiom.meaning}"
metaphoric_meaning: "${idiom.metaphoric_meaning}"
theme: "${idiom.theme}"
---

${idiom.description}

## The Meaning

**Literal Translation:** ${idiom.meaning}

**Metaphorical Meaning:** ${idiom.metaphoric_meaning}

## How to Use It

### English Example
> ${idiom.example}

### Chinese Example
> ${idiom.chineseExample}

### Traditional Characters
> ${idiom.traditionalCharacters}

## Pronunciation Guide
**Pinyin:** ${idiom.pinyin}

## Theme
This idiom belongs to the category of **${idiom.theme}**.

---

*Learn more Chinese idioms with our [Chinese Idioms app](https://apps.apple.com/us/app/daily-chinese-idioms/id6740611324).*
`;

    await fs.writeFile(filepath, content);
    generatedCount++;
    console.log(`Generated: ${filename}`);
  }
  
  console.log(`\nTotal blog posts generated: ${generatedCount}`);
}

generateBlogPosts().catch(console.error);