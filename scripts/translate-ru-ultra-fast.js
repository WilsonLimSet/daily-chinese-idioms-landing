require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

const LANG_CODE = 'ru';
const LANG_NAME = 'Russian';
const PARALLEL_LIMIT = 30; // 30x parallelism for ultra-fast processing

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

async function createRussianTranslation() {
  console.log(`\n🌏 Creating ${LANG_NAME} (${LANG_CODE}) translation with ${PARALLEL_LIMIT}x parallelism...\n`);

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
  console.log(`  ⚡ Processing ${PARALLEL_LIMIT} idioms in parallel\n`);

  // Process in batches
  for (let i = startIndex; i < sourceIdioms.length; i += PARALLEL_LIMIT) {
    const batch = sourceIdioms.slice(i, Math.min(i + PARALLEL_LIMIT, sourceIdioms.length));

    const batchPromises = batch.map(async (idiom) => {
      try {
        // Translate all fields in parallel
        const [translatedMeaning, translatedExample, translatedTheme, translatedDescription, translatedMetaphoric] = await Promise.all([
          translateText(idiom.meaning, 'literal meaning'),
          translateText(idiom.example, 'example sentence'),
          translateText(idiom.theme, 'theme'),
          translateText(idiom.description, 'description'),
          translateText(idiom.metaphoric_meaning, 'metaphoric meaning')
        ]);

        return {
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
      } catch (error) {
        console.error(`  ❌ Failed: ${idiom.characters}: ${error.message}`);
        throw error;
      }
    });

    try {
      const batchResults = await Promise.all(batchPromises);
      translatedIdioms.push(...batchResults);

      // Save progress after each batch
      fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));

      const progress = Math.min(i + PARALLEL_LIMIT, sourceIdioms.length);
      console.log(`  ✅ Progress: ${progress}/${sourceIdioms.length} idioms (${Math.round(progress/sourceIdioms.length*100)}%)`);

      // Small delay between batches to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`\n  ❌ Batch failed at idiom ${i + 1}`);
      if (translatedIdioms.length > 0) {
        fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));
        console.log(`  💾 Saved ${translatedIdioms.length} idioms before error`);
      }
      throw error;
    }
  }

  // Final save
  fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));
  console.log(`\n  🎉 ${LANG_NAME} translation complete: ${translatedIdioms.length} idioms translated!`);
}

createRussianTranslation().catch(console.error);
