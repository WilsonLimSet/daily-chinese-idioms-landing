const fs = require('fs');
const langs = ['es', 'pt', 'id', 'vi', 'ja', 'ko', 'th', 'hi', 'ar', 'fr'];

function containsEnglish(text) {
  if (!text) return false;
  return /\b(the|and|of|to|in|is|was|were|are|for|that|with|as|from|by|this|these|those|dynasty|emperor|period|century|during|ancient|modern|became|emerged|originated|describes|refers|emphasizes)\b/i.test(text);
}

console.log('\n📊 Translation Status Report:\n');

langs.forEach(lang => {
  const data = JSON.parse(fs.readFileSync(`public/translations/${lang}/idioms.json`, 'utf8'));
  const total = data.length;
  const stillEnglish = data.filter(i => i.description && containsEnglish(i.description)).length;
  const translated = total - stillEnglish;
  const percentage = ((translated / total) * 100).toFixed(1);
  console.log(`${lang}: ${translated}/${total} translated (${percentage}%), ${stillEnglish} still in English`);
});
