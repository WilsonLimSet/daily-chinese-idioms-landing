require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

const LANG_CODE = 'pt';
const LANG_NAME = 'Portuguese';

// Simple: just check if text contains English words
function containsEnglish(text) {
  if (!text) return false;

  // Look for any common English words anywhere in the text
  const hasEnglish = /\b(the|and|of|to|in|is|was|were|are|for|that|with|as|from|by|this|these|those|dynasty|emperor|period|century|during|ancient|modern|became|emerged|originated|describes|refers|emphasizes)\b/i.test(text);

  return hasEnglish;
}

async function translateDescription(description) {
  const prompt = `Translate the following text to ${LANG_NAME} (${LANG_CODE}).
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

async function translateDescriptions() {
  console.log(`\n📝 Translating ALL English descriptions to ${LANG_NAME} (${LANG_CODE})...`);

  const filePath = path.join(__dirname, `../public/translations/${LANG_CODE}/idioms.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`);
    return;
  }

  const idioms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let translated = 0;
  let skipped = 0;

  for (let i = 0; i < idioms.length; i++) {
    const idiom = idioms[i];

    // Simply: if it has English words, translate it
    if (idiom.description && containsEnglish(idiom.description)) {
      process.stdout.write(`\r  Progress: ${translated+1}/${idioms.length} - ${idiom.characters}          `);

      try {
        const translatedDesc = await translateDescription(idiom.description);
        idiom.description = translatedDesc;
        translated++;

        if (translated % 20 === 0) {
          fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
          process.stdout.write(`\r  ✅ Saved: ${translated} descriptions\n`);
        }
      } catch (error) {
        console.error(`\n  ❌ Failed: ${idiom.characters}: ${error.message}`);
      }
    } else {
      skipped++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
  console.log(`\n  🎉 ${LANG_NAME} complete: ${translated} translated, ${skipped} already done`);
}

translateDescriptions().catch(console.error);
