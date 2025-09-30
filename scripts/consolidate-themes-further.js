const fs = require('fs');
const path = require('path');

const idiomsPath = path.join(__dirname, '../public/idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Further consolidation - remove the 3 smallest themes
const furtherMapping = {
  // Mental States (8) -> Life Philosophy
  'Mental States': 'Life Philosophy',

  // Communication & Language (9) -> Relationships & Character
  'Communication & Language': 'Relationships & Character',

  // Assessment & Judgment (11) -> Wisdom & Learning
  'Assessment & Judgment': 'Wisdom & Learning',
};

// Apply theme consolidation
let changedCount = 0;
idioms.forEach(idiom => {
  if (furtherMapping[idiom.theme]) {
    console.log(`Changing "${idiom.theme}" to "${furtherMapping[idiom.theme]}" for ${idiom.characters}`);
    idiom.theme = furtherMapping[idiom.theme];
    changedCount++;
  }
});

// Save the updated idioms
fs.writeFileSync(idiomsPath, JSON.stringify(idioms, null, 2));

console.log(`\n✅ Further theme consolidation complete!`);
console.log(`📊 Changed ${changedCount} idioms`);

// Show new theme distribution
const themeCount = {};
idioms.forEach(idiom => {
  themeCount[idiom.theme] = (themeCount[idiom.theme] || 0) + 1;
});

const sortedThemes = Object.entries(themeCount)
  .sort((a, b) => b[1] - a[1])
  .map(([theme, count]) => ({ theme, count }));

console.log('\n📈 Final theme distribution:');
sortedThemes.forEach(({ theme, count }) => {
  console.log(`  ${theme}: ${count} idioms`);
});

console.log(`\n📝 Total themes: ${sortedThemes.length} (reduced from 9 to 6)`);