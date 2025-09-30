const fs = require('fs');
const path = require('path');

const idiomsPath = path.join(__dirname, '../public/idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Theme consolidation mapping
const themeMapping = {
  // Consolidate Communication themes (currently split into 5 different ones)
  'Communication & Approach': 'Communication & Language',
  'Communication & Credibility': 'Communication & Language',
  'Communication & Exchange': 'Communication & Language',
  'Communication & Taboo': 'Communication & Language',

  // Consolidate Ethics themes
  'Ethics & Karma': 'Character & Behavior',
  'Ethics & Values': 'Character & Behavior',
  'Ethics & Behavior': 'Character & Behavior',
  'Ethics & Morality': 'Character & Behavior',
  'Atonement & Responsibility': 'Character & Behavior',
  'Behavior & Demeanor': 'Character & Behavior',
  'Attitude & Behavior': 'Character & Behavior',

  // Consolidate into Wisdom & Learning
  'Analysis & Understanding': 'Wisdom & Learning',
  'Understanding & Realization': 'Wisdom & Learning',
  'Information & Knowledge': 'Wisdom & Learning',
  'Learning & Respect': 'Wisdom & Learning',
  'Authenticity & Learning': 'Wisdom & Learning',
  'Mastery & Skill': 'Wisdom & Learning',
  'Talent & Organization': 'Wisdom & Learning',

  // Consolidate into Life Philosophy
  'Life Experience': 'Life Philosophy',
  'Causality & Events': 'Life Philosophy',
  'Priorities & Action': 'Life Philosophy',
  'Culture & Society': 'Life Philosophy',
  'Satisfaction & Pleasure': 'Life Philosophy',
  'Nature & Classification': 'Life Philosophy',
  'Economics & Balance': 'Life Philosophy',

  // Consolidate into Success & Perseverance
  'Advantage & Fortune': 'Success & Perseverance',
  'Dedication & Focus': 'Success & Perseverance',
  'Consistency & Completion': 'Success & Perseverance',
  'Resilience & Recovery': 'Success & Perseverance',
  'Difficulty & Challenge': 'Success & Perseverance',

  // Consolidate into Strategy & Action
  'Strategy & Planning': 'Strategy & Action',
  'Action & Movement': 'Strategy & Action',
  'Coordination & Coincidence': 'Strategy & Action',

  // Consolidate Emotions into Mental States
  'Emotions & Feelings': 'Mental States',
  'Emotions & Reactions': 'Mental States',
  'Sensitivity & Awareness': 'Mental States',

  // Consolidate Relationships
  'Group Dynamics': 'Relationships & Character',
  'Relationships & Interactions': 'Relationships & Character',

  // Consolidate Stability/Security
  'Stability & Persistence': 'Life Philosophy',
  'Stability & Security': 'Life Philosophy',
  'Security & Peace': 'Life Philosophy',
  'Order & Disorder': 'Life Philosophy',

  // Consolidate Assessment themes
  'Evaluation & Judgment': 'Assessment & Judgment',
  'Perception & Propriety': 'Assessment & Judgment',

  // Miscellaneous consolidations
  'Atmosphere & Environment': 'Life Philosophy',
  'Beauty & Appearance': 'Assessment & Judgment',
  'Change & Transformation': 'Life Philosophy',
  'Conflict & Opposition': 'Strategy & Action',
  'Creativity & Expression': 'Wisdom & Learning',
  'Power & Position': 'Relationships & Character',
  'Quantity & Abundance': 'Life Philosophy',
  'Self-Destruction': 'Character & Behavior',
};

// Apply theme consolidation
let changedCount = 0;
idioms.forEach(idiom => {
  if (themeMapping[idiom.theme]) {
    console.log(`Changing "${idiom.theme}" to "${themeMapping[idiom.theme]}" for ${idiom.characters}`);
    idiom.theme = themeMapping[idiom.theme];
    changedCount++;
  }
});

// Save the updated idioms
fs.writeFileSync(idiomsPath, JSON.stringify(idioms, null, 2));

console.log(`\n✅ Theme consolidation complete!`);
console.log(`📊 Changed ${changedCount} idioms`);

// Show new theme distribution
const themeCount = {};
idioms.forEach(idiom => {
  themeCount[idiom.theme] = (themeCount[idiom.theme] || 0) + 1;
});

const sortedThemes = Object.entries(themeCount)
  .sort((a, b) => b[1] - a[1])
  .map(([theme, count]) => ({ theme, count }));

console.log('\n📈 New theme distribution:');
sortedThemes.forEach(({ theme, count }) => {
  console.log(`  ${theme}: ${count} idioms`);
});

console.log(`\n📝 Total themes: ${sortedThemes.length} (reduced from 66)`);