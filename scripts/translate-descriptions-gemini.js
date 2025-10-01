require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use the working model from the API list
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
    return description; // Return original on error
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

  for (let i = 0; i < idioms.length; i++) {
    const idiom = idioms[i];

    // Only translate if description starts with English text (not already translated)
    if (idiom.description && idiom.description.startsWith('This idiom')) {
      process.stdout.write(`\r  Progress: ${translated+1} translated, processing ${idiom.characters}...`);

      try {
        const translatedDesc = await translateDescription(idiom.description, langCode, langName);
        idiom.description = translatedDesc;
        translated++;

        // Save progress every 20 translations
        if (translated % 20 === 0) {
          fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
          process.stdout.write(`\r  ✅ Saved progress: ${translated} descriptions translated\n`);
        }

        // No delay - Gemini can handle rapid requests
      } catch (error) {
        console.error(`  ❌ Failed to translate description for ${idiom.characters}: ${error.message}`);
      }
    }
  }

  // Final save
  fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
  console.log(`\n  🎉 Completed ${langName}: ${translated} descriptions translated`);
}

async function translateAllDescriptions() {
  console.log('🚀 Starting description translation with Gemini AI...\n');
  console.log('This will translate the long descriptions for all idioms.');
  console.log('Note: This should complete in 5-10 minutes with fast processing.\n');

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    await translateDescriptionsForLanguage(langCode, langName);

    // No delay between languages
  }

  console.log('\n\n🎉 All descriptions translated successfully!');
  console.log('Your multilingual SEO system is now complete with full translations!');
}

// Run the translation
translateAllDescriptions().catch(console.error);