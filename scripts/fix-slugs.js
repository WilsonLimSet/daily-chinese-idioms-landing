const fs = require('fs').promises;
const path = require('path');

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

async function fixSlugs() {
  const blogDir = path.join(__dirname, '../content/blog');
  const files = await fs.readdir(blogDir);
  
  let renamedCount = 0;
  
  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    
    // Extract date and pinyin parts
    const match = file.match(/^(\d{4}-\d{2}-\d{2})-(.+)\.md$/);
    if (!match) continue;
    
    const [, date, pinyinPart] = match;
    const cleanPinyin = removeToneMarks(pinyinPart);
    
    if (pinyinPart !== cleanPinyin) {
      const oldPath = path.join(blogDir, file);
      const newFilename = `${date}-${cleanPinyin}.md`;
      const newPath = path.join(blogDir, newFilename);
      
      await fs.rename(oldPath, newPath);
      console.log(`Renamed: ${file} → ${newFilename}`);
      renamedCount++;
    }
  }
  
  console.log(`\n✅ Slug fixing complete!`);
  console.log(`📝 Total files renamed: ${renamedCount}`);
}

fixSlugs().catch(console.error);