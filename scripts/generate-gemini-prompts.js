#!/usr/bin/env node
/**
 * Generate Gemini prompts for all idiom illustrations
 *
 * Usage:
 *   node scripts/generate-gemini-prompts.js > prompts.txt
 *   node scripts/generate-gemini-prompts.js --batch 10
 *   node scripts/generate-gemini-prompts.js --id ID001
 */

const fs = require('fs');
const path = require('path');

const idiomsPath = path.join(__dirname, '..', 'public', 'idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Parse args
const args = process.argv.slice(2);
let targetId = null;
let batchCount = null;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--id' && args[i + 1]) targetId = args[i + 1];
  if (args[i] === '--batch' && args[i + 1]) batchCount = parseInt(args[i + 1]);
}

// Filter idioms
let targetIdioms = idioms;
if (targetId) {
  targetIdioms = idioms.filter(i => i.id === targetId);
} else if (batchCount) {
  targetIdioms = idioms.slice(0, batchCount);
}

// Generate prompts
function generatePrompt(idiom) {
  return `Create a traditional Chinese ink wash painting (水墨画) style illustration for the idiom "${idiom.characters}" (${idiom.pinyin}).

The idiom means: "${idiom.meaning}" (literally) and "${idiom.metaphoric_meaning}" (figuratively).

Style requirements:
- Traditional Chinese ink wash painting aesthetic with aged paper texture
- Soft, muted earth tones (beige, brown, sage green) with subtle color accents
- Depict a scene that represents the LITERAL meaning: "${idiom.meaning}"
- Include traditional Chinese elements (ancient clothing, architecture, nature)
- Mountains, pine trees, or water elements in the background
- NO text, NO Chinese characters, NO letters in the image
- Square format (1:1 ratio), high resolution
- Peaceful, contemplative, artistic mood
- Style similar to classical Chinese scroll paintings

Scene suggestion: ${getSuggestion(idiom)}`;
}

function getSuggestion(idiom) {
  // Generate scene suggestions based on literal meaning
  const meaning = idiom.meaning.toLowerCase();

  if (meaning.includes('water')) return 'A serene water scene with ripples or flowing stream';
  if (meaning.includes('mountain')) return 'Misty mountains with pine trees';
  if (meaning.includes('bird')) return 'A bird in natural setting, perhaps on a branch';
  if (meaning.includes('dragon')) return 'A majestic dragon among clouds';
  if (meaning.includes('tiger')) return 'A tiger in a bamboo forest';
  if (meaning.includes('horse')) return 'A galloping horse in an open field';
  if (meaning.includes('moon')) return 'A moonlit night scene';
  if (meaning.includes('flower')) return 'Delicate flowers in a garden setting';
  if (meaning.includes('tree')) return 'An ancient tree with gnarled branches';
  if (meaning.includes('stone') || meaning.includes('rock')) return 'Weathered rocks in a peaceful garden';
  if (meaning.includes('fire')) return 'Warm flames or lanterns';
  if (meaning.includes('wind')) return 'Swaying bamboo or willow trees';
  if (meaning.includes('rain')) return 'A rainy scene with traditional architecture';
  if (meaning.includes('sword') || meaning.includes('weapon')) return 'An elegant sword or warrior scene';
  if (meaning.includes('book') || meaning.includes('study')) return 'A scholar in a traditional study';
  if (meaning.includes('heart')) return 'A contemplative figure in nature';
  if (meaning.includes('eye')) return 'A wise elder or observant figure';
  if (meaning.includes('hand')) return 'Hands engaged in a meaningful gesture';

  return 'A scene with a scholar or figure in traditional Chinese setting that represents ' + idiom.meaning;
}

// Output
console.log('='.repeat(60));
console.log('GEMINI PROMPTS FOR CHINESE IDIOM ILLUSTRATIONS');
console.log('='.repeat(60));
console.log(`Total: ${targetIdioms.length} idioms\n`);

targetIdioms.forEach((idiom, index) => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`[${index + 1}/${targetIdioms.length}] ${idiom.id}: ${idiom.characters}`);
  console.log(`Save as: ${idiom.id}.png`);
  console.log('='.repeat(60));
  console.log(generatePrompt(idiom));
  console.log('\n');
});

// Also save to file
const outputPath = path.join(__dirname, 'gemini-prompts.txt');
let fileContent = `GEMINI PROMPTS FOR CHINESE IDIOM ILLUSTRATIONS\n`;
fileContent += `Generated: ${new Date().toISOString()}\n`;
fileContent += `Total: ${targetIdioms.length} idioms\n\n`;

targetIdioms.forEach((idiom, index) => {
  fileContent += `${'='.repeat(60)}\n`;
  fileContent += `[${index + 1}] ${idiom.id}: ${idiom.characters}\n`;
  fileContent += `Save image as: ${idiom.id}.png\n`;
  fileContent += `${'='.repeat(60)}\n`;
  fileContent += generatePrompt(idiom);
  fileContent += '\n\n';
});

fs.writeFileSync(outputPath, fileContent);
console.log(`\nPrompts also saved to: ${outputPath}`);
