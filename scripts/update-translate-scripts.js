const fs = require('fs');
const path = require('path');

const languages = [
  ['id', 'Indonesian'],
  ['vi', 'Vietnamese'],
  ['th', 'Thai'],
  ['ja', 'Japanese'],
  ['ko', 'Korean'],
  ['es', 'Spanish'],
  ['pt', 'Portuguese'],
  ['hi', 'Hindi'],
  ['ar', 'Arabic'],
  ['fr', 'French']
];

const scriptTemplate = (langCode, langName) => `require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

const LANG_CODE = '${langCode}';
const LANG_NAME = '${langName}';

// Better function to detect if text is in English
function isEnglish(text) {
  if (!text) return false;

  const englishStarts = [
    'This idiom', 'Han Dynasty', 'Tang Dynasty', 'Emerging from',
    'Originating', 'Dating to', 'First appearing', 'Ming Dynasty',
    'Song Dynasty', 'Qing Dynasty', 'The phrase', 'During the',
    'From ancient', 'In ancient', 'This vivid', 'This expression',
    'This proverb', 'Drawn from', 'Rooted in', 'Born from'
  ];

  return englishStarts.some(start => text.startsWith(start));
}

async function translateDescription(description) {
  const prompt = \`Translate the following text to \${LANG_NAME} (\${LANG_CODE}).
Keep the translation natural and culturally appropriate. This is a description of a Chinese idiom.

Text to translate:
\${description}

Provide only the translated text, no explanations or notes.\`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error(\`Translation error: \${error.message}\`);
    return description;
  }
}

async function translateDescriptions() {
  console.log(\`\\n📝 Translating descriptions to \${LANG_NAME} (\${LANG_CODE})...\`);

  const filePath = path.join(__dirname, \`../public/translations/\${LANG_CODE}/idioms.json\`);

  if (!fs.existsSync(filePath)) {
    console.log(\`  ❌ File not found: \${filePath}\`);
    return;
  }

  const idioms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let translated = 0;
  let skipped = 0;

  for (let i = 0; i < idioms.length; i++) {
    const idiom = idioms[i];

    if (idiom.description && isEnglish(idiom.description)) {
      process.stdout.write(\`\\r  Progress: \${translated+1} translated, processing \${idiom.characters}...\`);

      try {
        const translatedDesc = await translateDescription(idiom.description);
        idiom.description = translatedDesc;
        translated++;

        if (translated % 20 === 0) {
          fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
          process.stdout.write(\`\\r  ✅ Saved: \${translated} descriptions\\n\`);
        }
      } catch (error) {
        console.error(\`  ❌ Failed: \${idiom.characters}: \${error.message}\`);
      }
    } else {
      skipped++;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
  console.log(\`\\n  🎉 \${LANG_NAME} complete: \${translated} translated, \${skipped} already done\`);
}

translateDescriptions().catch(console.error);
`;

// Generate all language-specific scripts
for (const [langCode, langName] of languages) {
  const scriptPath = path.join(__dirname, `translate-${langCode}.js`);
  fs.writeFileSync(scriptPath, scriptTemplate(langCode, langName));
  console.log(`✅ Updated: translate-${langCode}.js`);
}

console.log('\n🎉 All scripts updated with better English detection!');
