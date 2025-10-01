const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI('AIzaSyCec988GsUdH53HRyAsZ44pEnqly10bhLc');
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

const LANG_CODE = 'tl';
const LANG_NAME = 'Tagalog';

async function translateText(text, fieldType) {
  const prompt = `Translate the following ${fieldType} to ${LANG_NAME} (${LANG_CODE}).
Keep the translation natural and culturally appropriate. This is part of a Chinese idiom description.

Text to translate:
${text}

Provide only the translated text, no explanations or notes.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error(`Translation error: ${error.message}`);
    throw error;
  }
}

async function createTagalogTranslation() {
  console.log(`\n🌏 Creating ${LANG_NAME} (${LANG_CODE}) translation...\n`);

  // Read the English source
  const sourcePath = path.join(__dirname, '../public/idioms.json');
  const sourceIdioms = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

  // Create target directory
  const targetDir = path.join(__dirname, `../public/translations/${LANG_CODE}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, 'idioms.json');

  // Check if file exists and load existing translations
  let translatedIdioms = [];
  let startIndex = 0;

  if (fs.existsSync(targetPath)) {
    console.log('  📂 Found existing file, resuming...');
    translatedIdioms = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    startIndex = translatedIdioms.length;
  }

  console.log(`  📊 Starting from idiom ${startIndex + 1}/${sourceIdioms.length}`);

  for (let i = startIndex; i < sourceIdioms.length; i++) {
    const idiom = sourceIdioms[i];

    process.stdout.write(`\r  Progress: ${i + 1}/${sourceIdioms.length} - ${idiom.characters}          `);

    try {
      // Translate the necessary fields
      const translatedMeaning = await translateText(idiom.meaning, 'literal meaning');
      await new Promise(resolve => setTimeout(resolve, 500)); // Rate limiting

      const translatedExample = await translateText(idiom.example, 'example sentence');
      await new Promise(resolve => setTimeout(resolve, 500));

      const translatedTheme = await translateText(idiom.theme, 'theme');
      await new Promise(resolve => setTimeout(resolve, 500));

      const translatedDescription = await translateText(idiom.description, 'description');
      await new Promise(resolve => setTimeout(resolve, 500));

      const translatedMetaphoric = await translateText(idiom.metaphoric_meaning, 'metaphoric meaning');
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create the translated idiom object (without the English-only fields)
      const translatedIdiom = {
        id: idiom.id,
        characters: idiom.characters,
        pinyin: idiom.pinyin,
        meaning: translatedMeaning,
        example: translatedExample,
        chineseExample: idiom.chineseExample,
        theme: translatedTheme,
        description: translatedDescription,
        metaphoric_meaning: translatedMetaphoric,
        traditionalCharacters: idiom.traditionalCharacters,
        chineseExample_tr: idiom.chineseExample_tr
      };

      translatedIdioms.push(translatedIdiom);

      // Save progress every 10 translations
      if ((i + 1) % 10 === 0) {
        fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));
        process.stdout.write(`\r  ✅ Saved: ${i + 1}/${sourceIdioms.length} idioms\n`);
      }
    } catch (error) {
      console.error(`\n  ❌ Failed: ${idiom.characters}: ${error.message}`);
      // Save progress before stopping
      if (translatedIdioms.length > 0) {
        fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));
        console.log(`  💾 Saved ${translatedIdioms.length} idioms before error`);
      }
      throw error;
    }
  }

  // Final save
  fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));
  console.log(`\n\n  🎉 ${LANG_NAME} translation complete: ${translatedIdioms.length} idioms translated!`);
}

createTagalogTranslation().catch(console.error);
