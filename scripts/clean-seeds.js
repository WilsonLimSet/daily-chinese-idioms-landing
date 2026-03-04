const fs = require('fs');
const idioms = JSON.parse(fs.readFileSync('public/idioms.json', 'utf-8'));
const existing = new Set(idioms.map(i => i.characters));
const seeds = JSON.parse(fs.readFileSync('data/new-seeds-230.json', 'utf-8'));

const seen = new Set();
const clean = seeds.filter(s => {
  if (existing.has(s.characters) || seen.has(s.characters) || s.characters.length !== 4) return false;
  seen.add(s.characters);
  return true;
});

console.log('Clean 4-char seeds:', clean.length);
fs.writeFileSync('data/new-seeds-230.json', JSON.stringify(clean, null, 2));
console.log('Saved');
