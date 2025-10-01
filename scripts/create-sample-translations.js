const fs = require('fs');
const path = require('path');

const LANGUAGES = {
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'th': 'Thai',
  'ja': 'Japanese',
  'ko': 'Korean',
  'es': 'Spanish',
  'pt': 'Portuguese',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
};

// Load original idioms
const idiomsPath = path.join(__dirname, '../public/idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Take first 10 idioms and create sample translations
const sampleIdioms = idioms.slice(0, 10);

console.log('🌍 Creating sample translations for 10 idioms...\n');

for (const [langCode, langName] of Object.entries(LANGUAGES)) {
  console.log(`📝 Creating ${langName} (${langCode})...`);

  const translatedIdioms = sampleIdioms.map(idiom => ({
    ...idiom,
    meaning: `[${langName}] ${idiom.meaning}`,
    metaphoric_meaning: `[${langName}] ${idiom.metaphoric_meaning}`,
    example: `[${langName}] ${idiom.example}`,
    theme: idiom.theme, // Keep theme in English for now
    description: idiom.description, // Keep original description
    original_meaning: idiom.meaning,
    original_metaphoric: idiom.metaphoric_meaning
  }));

  // Create directory and save
  const dir = path.join(__dirname, `../public/translations/${langCode}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(dir, 'idioms.json'),
    JSON.stringify(translatedIdioms, null, 2)
  );

  console.log(`  ✅ Created ${translatedIdioms.length} sample translations`);
}

// Create metadata
const metadata = {
  languages: LANGUAGES,
  generatedAt: new Date().toISOString(),
  totalIdioms: sampleIdioms.length,
  description: 'Sample multilingual Chinese idioms for testing'
};

fs.writeFileSync(
  path.join(__dirname, '../public/translations/languages.json'),
  JSON.stringify(metadata, null, 2)
);

console.log('\n🎉 Sample translations created!');
console.log(`📊 Created ${sampleIdioms.length} × ${Object.keys(LANGUAGES).length} = ${sampleIdioms.length * Object.keys(LANGUAGES).length} sample pages`);
console.log('🚀 The multilingual system is now functional for testing');