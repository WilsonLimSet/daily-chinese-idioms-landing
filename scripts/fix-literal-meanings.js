require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'models/gemini-2.5-flash-preview-05-20' });

// Configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds between requests (slow and safe)
const BATCH_SAVE_INTERVAL = 10; // Save after every 10 translations

// Language configuration
const LANGUAGES = {
  'es': 'Spanish',
  'pt': 'Portuguese',
  'id': 'Indonesian',
  'vi': 'Vietnamese',
  'ja': 'Japanese',
  'ko': 'Korean',
  'th': 'Thai',
  'hi': 'Hindi',
  'ar': 'Arabic',
  'fr': 'French',
  'tl': 'Tagalog',
  'ms': 'Malay',
  'ru': 'Russian'
};

// Check if meaning field has English words (indicating it needs translation)
function needsTranslation(meaning, langCode) {
  if (!meaning) return false;

  // Common English words that shouldn't appear in translated literal meanings
  const englishPatterns = [
    /\b(gold|silver|iron|horse|spear|shield|dragon|tiger|phoenix|crane)\b/i,
    /\b(wind|rain|snow|cloud|thunder|lightning|storm)\b/i,
    /\b(mountain|river|sea|lake|valley|forest)\b/i,
    /\b(emperor|king|prince|minister|general|soldier)\b/i,
    /\b(ancient|modern|old|new|precious|valuable)\b/i,
    /\b(jade|pearl|silk|bronze|bamboo|lotus)\b/i,
    /\b(call|pick|point|view|whole|entire)\b/i
  ];

  return englishPatterns.some(pattern => pattern.test(meaning));
}

// Delay function for rate limiting
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function translateLiteralMeaning(englishMeaning, characters, targetLang, targetLangName) {
  const prompt = `You are translating Chinese idiom literal meanings.

Chinese characters: ${characters}
Current literal meaning (in English): ${englishMeaning}

Task: Translate this literal meaning to ${targetLangName} (${targetLang}).
Important: This is a LITERAL word-by-word translation of the Chinese characters, not the metaphoric meaning.

Requirements:
- Keep it very short and literal (2-5 words)
- Translate ONLY the literal/direct meaning
- Do NOT add explanations or metaphoric interpretations
- Use natural ${targetLangName} grammar

Example:
English: "Gold spears iron horses"
Spanish: "Lanzas doradas caballos de hierro"
French: "Lances d'or chevaux de fer"

Provide only the translated literal meaning, nothing else.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translated = response.text().trim();

    // Clean up any quotes or extra formatting
    return translated.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error(`    ❌ Translation error: ${error.message}`);
    return englishMeaning; // Return original on error
  }
}

async function fixLanguage(langCode) {
  const langName = LANGUAGES[langCode];
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Fixing literal meanings for ${langName} (${langCode})`);
  console.log(`${'='.repeat(60)}\n`);

  const filePath = path.join(__dirname, `../public/translations/${langCode}/idioms.json`);

  if (!fs.existsSync(filePath)) {
    console.log(`  ❌ File not found: ${filePath}`);
    return;
  }

  const idioms = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let fixed = 0;
  let skipped = 0;
  let errors = 0;

  console.log(`  Total idioms: ${idioms.length}`);
  console.log(`  Rate limit: ${RATE_LIMIT_DELAY}ms between requests\n`);

  for (let i = 0; i < idioms.length; i++) {
    const idiom = idioms[i];
    const progress = `[${i + 1}/${idioms.length}]`;

    if (needsTranslation(idiom.meaning, langCode)) {
      console.log(`  ${progress} ${idiom.characters} - Translating...`);
      console.log(`    Current: "${idiom.meaning}"`);

      try {
        const translatedMeaning = await translateLiteralMeaning(
          idiom.meaning,
          idiom.characters,
          langCode,
          langName
        );

        idiom.meaning = translatedMeaning;
        fixed++;

        console.log(`    ✅ New: "${translatedMeaning}"\n`);

        // Save progress periodically
        if (fixed % BATCH_SAVE_INTERVAL === 0) {
          fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));
          console.log(`  💾 Progress saved: ${fixed} fixed so far\n`);
        }

        // Rate limiting delay
        await delay(RATE_LIMIT_DELAY);

      } catch (error) {
        console.error(`    ❌ Failed: ${error.message}\n`);
        errors++;
      }
    } else {
      console.log(`  ${progress} ${idiom.characters} - Already correct, skipping`);
      skipped++;
    }
  }

  // Final save
  fs.writeFileSync(filePath, JSON.stringify(idioms, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ ${langName} complete!`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Skipped: ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`${'='.repeat(60)}\n`);

  return { fixed, skipped, errors };
}

async function fixAllLanguages() {
  console.log('\n🌍 Starting literal meaning translation fix for all languages\n');
  console.log('⚠️  This will be SLOW (2s per translation) to control costs\n');

  const results = {};

  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    try {
      results[langCode] = await fixLanguage(langCode);
    } catch (error) {
      console.error(`\n❌ Fatal error processing ${langName}: ${error.message}\n`);
      results[langCode] = { fixed: 0, skipped: 0, errors: 1 };
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(60) + '\n');

  let totalFixed = 0;
  let totalSkipped = 0;
  let totalErrors = 0;

  for (const [langCode, result] of Object.entries(results)) {
    console.log(`${LANGUAGES[langCode].padEnd(15)} - Fixed: ${result.fixed}, Skipped: ${result.skipped}, Errors: ${result.errors}`);
    totalFixed += result.fixed;
    totalSkipped += result.skipped;
    totalErrors += result.errors;
  }

  console.log('\n' + '-'.repeat(60));
  console.log(`TOTAL              - Fixed: ${totalFixed}, Skipped: ${totalSkipped}, Errors: ${totalErrors}`);
  console.log('='.repeat(60) + '\n');
}

// Check if running with specific language argument
const args = process.argv.slice(2);
if (args.length > 0) {
  const langCode = args[0];
  if (LANGUAGES[langCode]) {
    fixLanguage(langCode).then(() => {
      console.log('✅ Done!');
      process.exit(0);
    });
  } else {
    console.error(`❌ Unknown language: ${langCode}`);
    console.log(`Available languages: ${Object.keys(LANGUAGES).join(', ')}`);
    process.exit(1);
  }
} else {
  // Run for all languages
  fixAllLanguages().then(() => {
    console.log('✅ All languages processed!');
    process.exit(0);
  });
}
