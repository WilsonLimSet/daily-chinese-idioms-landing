const fs = require('fs');
const path = require('path');
const { translate } = require('@vitalets/google-translate-api');

// Demo: Just translate first 3 idioms to show it works
const DEMO_LANGUAGES = {
  'id': 'Indonesian',
  'es': 'Spanish',
  'ja': 'Japanese',
};

async function translateDemo() {
  console.log('🌍 Running translation demo...\n');

  const idiomsPath = path.join(__dirname, '../public/idioms.json');
  const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));
  const demoIdioms = idioms.slice(0, 3); // Just first 3 for demo

  for (const [langCode, langName] of Object.entries(DEMO_LANGUAGES)) {
    console.log(`\nTranslating to ${langName}:`);
    console.log('=' . repeat(50));

    const translatedIdioms = [];

    for (const idiom of demoIdioms) {
      try {
        // Translate key fields
        const [meaning, metaphoric, example, theme] = await Promise.all([
          translate(idiom.meaning, { to: langCode }),
          translate(idiom.metaphoric_meaning, { to: langCode }),
          translate(idiom.example, { to: langCode }),
          translate(idiom.theme, { to: langCode }),
        ]);

        const translated = {
          ...idiom,
          meaning: meaning.text,
          metaphoric_meaning: metaphoric.text,
          example: example.text,
          theme: theme.text,
          // Keep originals for reference
          original_meaning: idiom.meaning,
          original_metaphoric: idiom.metaphoric_meaning,
        };

        translatedIdioms.push(translated);

        console.log(`\n${idiom.characters} (${idiom.pinyin})`);
        console.log(`  Original: ${idiom.metaphoric_meaning}`);
        console.log(`  ${langName}: ${metaphoric.text}`);

      } catch (error) {
        console.error(`Error translating: ${error.message}`);
      }
    }

    // Save demo translations
    const dir = path.join(__dirname, `../public/translations/${langCode}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'idioms.json'),
      JSON.stringify(translatedIdioms, null, 2)
    );
  }

  console.log('\n\n✅ Demo translation complete!');
  console.log('📝 Check /public/translations/ for sample translations');
  console.log('\n💡 To translate all 381 idioms, run: node scripts/translate-content.js');
}

translateDemo().catch(console.error);