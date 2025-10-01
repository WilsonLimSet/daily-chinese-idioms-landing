const fs = require('fs');
const path = require('path');

// Test the new detection function
function isEnglish(text) {
  if (!text) return false;
  const englishWords = /\b(the|and|of|to|in|is|was|were|for|that|with|as|from|by|this|these|those|idiom|dynasty|emerged|century|originated|originating|popularized|dating|ancient|emperor|philosopher|literary|metaphor|expression|proverb|wisdom|emerged|during|period|warring|confucian|buddhist|describes|refers|emphasizes|captures)\b/gi;
  const matches = text.match(englishWords);
  return matches && matches.length >= 3;
}

const jaPath = path.join(__dirname, '../public/translations/ja/idioms.json');
const idioms = JSON.parse(fs.readFileSync(jaPath, 'utf-8'));

let detectedEnglish = 0;

idioms.forEach((idiom) => {
  if (idiom.description && isEnglish(idiom.description)) {
    detectedEnglish++;
  }
});

console.log(`✅ New detection will catch: ${detectedEnglish} English descriptions`);
console.log(`📊 Total idioms: ${idioms.length}`);
console.log(`📈 Will translate: ${detectedEnglish} idioms\n`);

// Show a sample
console.log('Sample detections:');
let shown = 0;
idioms.forEach((idiom, idx) => {
  if (shown < 5 && idiom.description && isEnglish(idiom.description)) {
    console.log(`  ✓ [${idx}] ${idiom.characters}: ${idiom.description.substring(0, 60)}...`);
    shown++;
  }
});
