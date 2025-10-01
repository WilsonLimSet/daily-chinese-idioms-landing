const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCec988GsUdH53HRyAsZ44pEnqly10bhLc');
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

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

// Better function to detect if text is in English
function isEnglish(text) {
  if (!text) return false;

  // Check for common English words at the start
  const englishStarts = [
    'This idiom', 'Han Dynasty', 'Tang Dynasty', 'Emerging from',
    'Originating', 'Dating to', 'First appearing', 'Ming Dynasty',
    'Song Dynasty', 'Qing Dynasty', 'The phrase', 'During the',
    'From ancient', 'In ancient', 'This vivid', 'This expression',
    'This proverb', 'Drawn from', 'Rooted in', 'Born from'
  ];

  return englishStarts.some(start => text.startsWith(start));
}

async function translateDescription(description, targetLanguage, langName) {
  const prompt = `Translate the following text to ${langName} (${targetLanguage}).
Keep the translation natural and culturally appropriate. This is a description of a Chinese idiom.

Text to translate:
${description}

Provide only the translated text, no explanations or notes.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    return description;
  }
}

async function translateDescriptionsForLanguage(langCode, langName) {
  console.log(`\n📝 Translating descriptions to ${langName} (${langCode})...`);

  const filePath = path.join(__dirname, `../public/translations/${langCode}/idioms.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`);
    return;
  }

  const idioms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let translated = 0;
  let skipped = 0;

  for (let i = 0; i < idioms.length; i++) {
    const idiom = idioms[i];

    // Check if description is in English
    if (idiom.description && isEnglish(idiom.description)) {
      process.stdout.write(`\r  Progress: ${translated+1}/${idioms.length} translating ${idiom.characters}...`);

      try {
        const translatedDesc = await translateDescription(idiom.description, langCode, langName);
        idiom.description = translatedDesc;
        translated++;

        // Save progress every 20 translations
        if (translated % 20 === 0) {
          fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
          process.stdout.write(`\r  ✅ Saved progress: ${translated} descriptions translated\n`);
        }
      } catch (error) {
        console.error(`  ❌ Failed to translate description for ${idiom.characters}: ${error.message}`);
      }
    } else {
      skipped++;
    }
  }

  // Final save
  fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
  console.log(`\n  🎉 Completed ${langName}: ${translated} descriptions translated, ${skipped} already done`);
}

async function translateAllDescriptions() {
  console.log('🚀 Starting description translation with Gemini AI...\n');
  console.log('This will translate ALL English descriptions for all idioms.');
  console.log('Expected: ~381 descriptions per language\n');

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    await translateDescriptionsForLanguage(langCode, langName);
  }

  console.log('\n\n🎉 All descriptions translated successfully!');
}

// Get language from command line argument or run all
const targetLang = process.argv[2];
if (targetLang && LANGUAGES[targetLang]) {
  translateDescriptionsForLanguage(targetLang, LANGUAGES[targetLang]).catch(console.error);
} else {
  translateAllDescriptions().catch(console.error);
}
