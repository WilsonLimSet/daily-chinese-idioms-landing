const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Target languages for SEO - focusing on Asian markets and global languages
const LANGUAGES = {
  'id': 'Indonesian',     // Indonesia - huge market
  'vi': 'Vietnamese',      // Vietnam
  'th': 'Thai',           // Thailand
  'ja': 'Japanese',       // Japan
  'ko': 'Korean',         // Korea
  'es': 'Spanish',        // Latin America & Spain
  'pt': 'Portuguese',     // Brazil & Portugal
  'hi': 'Hindi',          // India
  'ar': 'Arabic',         // Middle East
  'fr': 'French',         // France & Africa
};

// Read idioms
const idiomsPath = path.join(__dirname, '../public/idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Create translations directory structure
Object.keys(LANGUAGES).forEach(lang => {
  const dir = path.join(__dirname, `../public/translations/${lang}`);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Helper function to add delay
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Translate a single idiom
async function translateIdiom(idiom, targetLang) {
  const translations = {};

  // Fields to translate
  const fieldsToTranslate = [
    'meaning',
    'metaphoric_meaning',
    'example',
    'description',
    'theme'
  ];

  for (const field of fieldsToTranslate) {
    try {
      const result = await translate(idiom[field], { to: targetLang });
      translations[field] = result.text;
      await delay(100); // Rate limiting
    } catch (error) {
      console.error(`Error translating ${field} to ${targetLang}:`, error.message);
      translations[field] = idiom[field]; // Fallback to original
    }
  }

  // Keep original Chinese fields
  return {
    ...idiom,
    ...translations,
    characters: idiom.characters,
    pinyin: idiom.pinyin,
    chineseExample: idiom.chineseExample,
    traditionalCharacters: idiom.traditionalCharacters,
    chineseExample_tr: idiom.chineseExample_tr,
    original_meaning: idiom.meaning,
    original_metaphoric: idiom.metaphoric_meaning
  };
}

// Main translation function
async function translateAllContent() {
  console.log('🌍 Starting translation process for SEO optimization...\n');

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    console.log(`\n📝 Translating to ${langName} (${langCode})...`);

    const translatedIdioms = [];
    const batchSize = 5; // Process in small batches

    for (let i = 0; i < idioms.length; i += batchSize) {
      const batch = idioms.slice(i, Math.min(i + batchSize, idioms.length));

      const translatedBatch = await Promise.all(
        batch.map(idiom => translateIdiom(idiom, langCode))
      );

      translatedIdioms.push(...translatedBatch);

      // Progress indicator
      const progress = Math.min(i + batchSize, idioms.length);
      process.stdout.write(`  Progress: ${progress}/${idioms.length} idioms\r`);

      // Save incrementally to avoid data loss
      if (progress % 20 === 0) {
        const outputPath = path.join(__dirname, `../public/translations/${langCode}/idioms.json`);
        fs.writeFileSync(outputPath, JSON.stringify(translatedIdioms, null, 2));
      }
    }

    // Final save
    const outputPath = path.join(__dirname, `../public/translations/${langCode}/idioms.json`);
    fs.writeFileSync(outputPath, JSON.stringify(translatedIdioms, null, 2));

    console.log(`\n  ✅ Completed ${langName}: ${translatedIdioms.length} idioms translated`);
    console.log(`  📁 Saved to: ${outputPath}`);
  }

  // Create language metadata file
  const metadata = {
    languages: LANGUAGES,
    generatedAt: new Date().toISOString(),
    totalIdioms: idioms.length,
    description: 'Multilingual Chinese idioms for SEO optimization'
  };

  fs.writeFileSync(
    path.join(__dirname, '../public/translations/languages.json'),
    JSON.stringify(metadata, null, 2)
  );

  console.log('\n\n🎉 Translation complete! Your content is now available in 11 languages!');
  console.log('📈 This will significantly boost your international SEO reach.\n');
}

// Run the translation
translateAllContent().catch(console.error);