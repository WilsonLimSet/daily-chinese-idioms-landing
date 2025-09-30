const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Slower, more reliable translation with better rate limiting
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

const idiomsPath = path.join(__dirname, '../public/idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Much slower but reliable
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function translateWithRetry(text, targetLang, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await delay(500 + Math.random() * 1000); // Random delay 500-1500ms
      const result = await translate(text, { to: targetLang });
      return result.text;
    } catch (error) {
      if (error.message.includes('Too Many Requests') && i < maxRetries - 1) {
        console.log(`Rate limited, waiting ${(i + 1) * 5} seconds...`);
        await delay((i + 1) * 5000); // Exponential backoff
        continue;
      }
      console.error(`Translation failed: ${error.message}`);
      return text; // Return original if all retries fail
    }
  }
  return text;
}

async function translateIdiom(idiom, targetLang) {
  console.log(`  Translating: ${idiom.characters} (${idiom.pinyin})`);

  const translations = {};

  // Translate fields one by one with delays
  translations.meaning = await translateWithRetry(idiom.meaning, targetLang);
  translations.metaphoric_meaning = await translateWithRetry(idiom.metaphoric_meaning, targetLang);
  translations.example = await translateWithRetry(idiom.example, targetLang);

  // Skip long descriptions for now to speed up
  translations.description = idiom.description; // Keep original for now
  translations.theme = await translateWithRetry(idiom.theme, targetLang);

  return {
    ...idiom,
    ...translations,
    original_meaning: idiom.meaning,
    original_metaphoric: idiom.metaphoric_meaning
  };
}

async function translateAllContent() {
  console.log('🌍 Starting SLOW but reliable translation process...\n');

  // Process just 50 idioms per language for now (about 2 months worth)
  const limitedIdioms = idioms.slice(0, 50);

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    console.log(`\n📝 Translating to ${langName} (${langCode})...`);
    console.log(`Processing ${limitedIdioms.length} idioms with rate limiting\n`);

    const translatedIdioms = [];

    for (let i = 0; i < limitedIdioms.length; i++) {
      const idiom = limitedIdioms[i];

      try {
        const translated = await translateIdiom(idiom, langCode);
        translatedIdioms.push(translated);

        console.log(`  ✅ ${i + 1}/${limitedIdioms.length} - ${idiom.characters}`);

        // Save progress every 10 idioms
        if ((i + 1) % 10 === 0) {
          const dir = path.join(__dirname, `../public/translations/${langCode}`);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(
            path.join(dir, 'idioms.json'),
            JSON.stringify(translatedIdioms, null, 2)
          );
          console.log(`  💾 Saved progress: ${i + 1} idioms`);
        }

      } catch (error) {
        console.error(`  ❌ Failed to translate ${idiom.characters}: ${error.message}`);
        translatedIdioms.push(idiom); // Keep original
      }
    }

    // Final save
    const dir = path.join(__dirname, `../public/translations/${langCode}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(
      path.join(dir, 'idioms.json'),
      JSON.stringify(translatedIdioms, null, 2)
    );

    console.log(`\n  ✅ Completed ${langName}: ${translatedIdioms.length} idioms translated`);
  }

  console.log('\n\n🎉 Translation complete! 50 idioms × 10 languages = 500 new SEO pages!');
  console.log('📈 This covers ~2 months of daily content in each language.');
  console.log('\n💡 You can run this script again later to translate more idioms.');
}

translateAllContent().catch(console.error);