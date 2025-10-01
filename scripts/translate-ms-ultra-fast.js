require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

const LANG_CODE = 'ms';
const LANG_NAME = 'Malay';
const PARALLEL_LIMIT = 30; // MUCH FASTER: Process 30 idioms at once

async function translateIdiomBatch(idiom) {
  const prompt = `Translate all fields of this Chinese idiom to ${LANG_NAME} (${LANG_CODE}).
Keep translations natural and culturally appropriate.

Idiom: ${idiom.characters}

Fields to translate:
1. Literal meaning: "${idiom.meaning}"
2. Example: "${idiom.example}"
3. Theme: "${idiom.theme}"
4. Description: "${idiom.description}"
5. Metaphoric meaning: "${idiom.metaphoric_meaning}"

Respond ONLY with valid JSON in this exact format:
{
  "meaning": "translated literal meaning",
  "example": "translated example",
  "theme": "translated theme",
  "description": "translated description",
  "metaphoric_meaning": "translated metaphoric meaning"
}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();

    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error(`\n  ❌ Translation error for ${idiom.characters}: ${error.message}`);
    throw error;
  }
}

async function processChunk(idioms, startIndex, endIndex) {
  const chunk = idioms.slice(startIndex, endIndex);
  const promises = chunk.map(idiom => translateIdiomBatch(idiom));

  try {
    const results = await Promise.all(promises);
    return results.map((translated, i) => ({
      id: chunk[i].id,
      characters: chunk[i].characters,
      pinyin: chunk[i].pinyin,
      meaning: translated.meaning,
      example: translated.example,
      chineseExample: chunk[i].chineseExample,
      theme: translated.theme,
      description: translated.description,
      metaphoric_meaning: translated.metaphoric_meaning,
      traditionalCharacters: chunk[i].traditionalCharacters,
      chineseExample_tr: chunk[i].chineseExample_tr
    }));
  } catch (error) {
    console.error(`\n  ❌ Chunk processing failed: ${error.message}`);
    throw error;
  }
}

async function createMalayTranslationFast() {
  console.log(`\n🚀 ULTRA FAST parallel translation to ${LANG_NAME} (${LANG_CODE})...\n`);

  const sourcePath = path.join(__dirname, '../public/idioms.json');
  const sourceIdioms = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

  const targetDir = path.join(__dirname, `../public/translations/${LANG_CODE}`);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const targetPath = path.join(targetDir, 'idioms.json');

  let translatedIdioms = [];
  let startIndex = 0;

  // Resume from existing file
  if (fs.existsSync(targetPath)) {
    console.log('  📂 Found existing file, resuming...');
    translatedIdioms = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
    startIndex = translatedIdioms.length;
  }

  console.log(`  📊 Processing ${sourceIdioms.length - startIndex} idioms (${PARALLEL_LIMIT} at a time)\n`);

  for (let i = startIndex; i < sourceIdioms.length; i += PARALLEL_LIMIT) {
    const endIndex = Math.min(i + PARALLEL_LIMIT, sourceIdioms.length);
    const chunkSize = endIndex - i;

    process.stdout.write(`\r  Progress: ${i}/${sourceIdioms.length} - Processing batch...          `);

    try {
      const chunkResults = await processChunk(sourceIdioms, i, endIndex);
      translatedIdioms.push(...chunkResults);

      // Save after each batch
      fs.writeFileSync(targetPath, JSON.stringify(translatedIdioms, null, 2));
      process.stdout.write(`\r  ✅ Saved: ${translatedIdioms.length}/${sourceIdioms.length} idioms (batch of ${chunkSize} done)\n`);

      // Minimal delay between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`\n  ❌ Batch failed at index ${i}: ${error.message}`);
      console.log(`  💾 Saved ${translatedIdioms.length} idioms before error`);

      // Wait before retry
      console.log('  ⏳ Waiting 3 seconds before retry...');
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Retry this batch
      i -= PARALLEL_LIMIT;
      continue;
    }
  }

  console.log(`\n\n  🎉 ${LANG_NAME} translation complete: ${translatedIdioms.length} idioms!`);
  console.log(`  📊 Speed: ~${PARALLEL_LIMIT} idioms per batch with auto-retry`);
}

createMalayTranslationFast().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
