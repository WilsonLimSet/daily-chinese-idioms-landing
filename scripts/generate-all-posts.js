const fs = require('fs').promises;
const path = require('path');

async function generateAllPosts() {
  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idiomsData = await fs.readFile(idiomsPath, 'utf-8');
  const idioms = JSON.parse(idiomsData);
  
  const outputDir = path.join(__dirname, '../content/blog');
  await fs.mkdir(outputDir, { recursive: true });
  
  const startDate = new Date('2025-01-01');
  const today = new Date('2025-07-24'); // Today's date
  
  let generatedCount = 0;
  let skippedCount = 0;
  
  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const dayOfYear = Math.floor((d.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const idiomId = `ID${dayOfYear.toString().padStart(3, '0')}`;
    const idiom = idioms.find(i => i.id === idiomId);
    
    if (!idiom) {
      console.log(`No idiom found for day ${dayOfYear} (${idiomId})`);
      continue;
    }
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const date = `${year}-${month}-${day}`;
    
    const filename = `${date}-${idiom.pinyin.replace(/\s+/g, '-')}.md`;
    const filepath = path.join(outputDir, filename);
    
    // Check if file already exists
    try {
      await fs.access(filepath);
      console.log(`Skipping existing: ${filename}`);
      skippedCount++;
      continue;
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

## Examples

**English:** "${idiom.example}"

**Chinese:** ${idiom.chineseExample}

---

*Discover a new Chinese idiom every day with our [iOS app](https://apps.apple.com/us/app/daily-chinese-idioms/id6670238264).*
`;

    await fs.writeFile(filepath, content);
    generatedCount++;
    console.log(`Generated: ${filename}`);
  }
  
  console.log(`\n✅ Generation complete!`);
  console.log(`📝 Total blog posts generated: ${generatedCount}`);
  console.log(`⏭️  Files skipped (already existed): ${skippedCount}`);
  console.log(`📅 Posts cover: Jan 1 - Jul 24, 2025`);
}

generateAllPosts().catch(console.error);