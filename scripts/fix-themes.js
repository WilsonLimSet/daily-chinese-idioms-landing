require('dotenv').config();
const fs = require('fs');
const path = require('path');

// STANDARDIZED 6 THEMES - NO MORE WILL BE CREATED
const STANDARD_THEMES = {
  en: {
    'Life Philosophy': 'Life Philosophy',
    'Wisdom & Learning': 'Wisdom & Learning',
    'Success & Perseverance': 'Success & Perseverance',
    'Relationships & Character': 'Relationships & Character',
    'Strategy & Action': 'Strategy & Action',
    'Character & Behavior': 'Character & Behavior'
  },
  es: {
    'Life Philosophy': 'Filosofía de Vida',
    'Wisdom & Learning': 'Sabiduría y Aprendizaje',
    'Success & Perseverance': 'Éxito y Perseverancia',
    'Relationships & Character': 'Relaciones y Carácter',
    'Strategy & Action': 'Estrategia y Acción',
    'Character & Behavior': 'Carácter y Comportamiento'
  },
  pt: {
    'Life Philosophy': 'Filosofia de Vida',
    'Wisdom & Learning': 'Sabedoria e Aprendizagem',
    'Success & Perseverance': 'Sucesso e Perseverança',
    'Relationships & Character': 'Relacionamentos e Caráter',
    'Strategy & Action': 'Estratégia e Ação',
    'Character & Behavior': 'Caráter e Comportamento'
  },
  id: {
    'Life Philosophy': 'Filosofi Hidup',
    'Wisdom & Learning': 'Kebijaksanaan & Pembelajaran',
    'Success & Perseverance': 'Sukses & Ketekunan',
    'Relationships & Character': 'Hubungan & Karakter',
    'Strategy & Action': 'Strategi & Tindakan',
    'Character & Behavior': 'Karakter & Perilaku'
  },
  vi: {
    'Life Philosophy': 'Triết lý sống',
    'Wisdom & Learning': 'Trí tuệ & Học tập',
    'Success & Perseverance': 'Thành công & Kiên trì',
    'Relationships & Character': 'Mối quan hệ & Tính cách',
    'Strategy & Action': 'Chiến lược & Hành động',
    'Character & Behavior': 'Tính cách & Hành vi'
  },
  ja: {
    'Life Philosophy': '人生哲学',
    'Wisdom & Learning': '知恵と学び',
    'Success & Perseverance': '成功と忍耐',
    'Relationships & Character': '人間関係と性格',
    'Strategy & Action': '戦略と行動',
    'Character & Behavior': '性格と行動'
  },
  ko: {
    'Life Philosophy': '인생 철학',
    'Wisdom & Learning': '지혜와 학습',
    'Success & Perseverance': '성공과 인내',
    'Relationships & Character': '관계와 성격',
    'Strategy & Action': '전략과 행동',
    'Character & Behavior': '성격과 행동'
  },
  th: {
    'Life Philosophy': 'ปรัชญาชีวิต',
    'Wisdom & Learning': 'ปัญญาและการเรียนรู้',
    'Success & Perseverance': 'ความสำเร็จและความพากเพียร',
    'Relationships & Character': 'ความสัมพันธ์และบุคลิกภาพ',
    'Strategy & Action': 'กลยุทธ์และการกระทำ',
    'Character & Behavior': 'บุคลิกภาพและพฤติกรรม'
  },
  hi: {
    'Life Philosophy': 'जीवन दर्शन',
    'Wisdom & Learning': 'ज्ञान और सीखना',
    'Success & Perseverance': 'सफलता और दृढ़ता',
    'Relationships & Character': 'संबंध और चरित्र',
    'Strategy & Action': 'रणनीति और कार्रवाई',
    'Character & Behavior': 'चरित्र और व्यवहार'
  },
  ar: {
    'Life Philosophy': 'فلسفة الحياة',
    'Wisdom & Learning': 'الحكمة والتعلم',
    'Success & Perseverance': 'النجاح والمثابرة',
    'Relationships & Character': 'العلاقات والشخصية',
    'Strategy & Action': 'الاستراتيجية والعمل',
    'Character & Behavior': 'الشخصية والسلوك'
  },
  fr: {
    'Life Philosophy': 'Philosophie de Vie',
    'Wisdom & Learning': 'Sagesse et Apprentissage',
    'Success & Perseverance': 'Succès et Persévérance',
    'Relationships & Character': 'Relations et Caractère',
    'Strategy & Action': 'Stratégie et Action',
    'Character & Behavior': 'Caractère et Comportement'
  },
  tl: {
    'Life Philosophy': 'Pilosopiya ng Buhay',
    'Wisdom & Learning': 'Karunungan at Pagkatuto',
    'Success & Perseverance': 'Tagumpay at Pagtitiyaga',
    'Relationships & Character': 'Ugnayan at Pagkatao',
    'Strategy & Action': 'Estratehiya at Aksyon',
    'Character & Behavior': 'Pagkatao at Pag-uugali'
  },
  ms: {
    'Life Philosophy': 'Falsafah Kehidupan',
    'Wisdom & Learning': 'Kebijaksanaan dan Pembelajaran',
    'Success & Perseverance': 'Kejayaan dan Ketekunan',
    'Relationships & Character': 'Hubungan dan Perwatakan',
    'Strategy & Action': 'Strategi dan Tindakan',
    'Character & Behavior': 'Perwatakan dan Tingkah Laku'
  },
  ru: {
    'Life Philosophy': 'Философия жизни',
    'Wisdom & Learning': 'Мудрость и Обучение',
    'Success & Perseverance': 'Успех и Упорство',
    'Relationships & Character': 'Отношения и Характер',
    'Strategy & Action': 'Стратегия и Действие',
    'Character & Behavior': 'Характер и Поведение'
  }
};

function fixThemesForLanguage(langCode) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`🎨 Fixing themes for ${langCode.toUpperCase()}`);
  console.log(`${'='.repeat(60)}\n`);

  // Read English idioms to get canonical theme for each ID
  const englishPath = path.join(__dirname, '../public/idioms.json');
  const englishIdioms = JSON.parse(fs.readFileSync(englishPath, 'utf-8'));

  // Create ID -> English theme mapping
  const idToTheme = {};
  englishIdioms.forEach(idiom => {
    idToTheme[idiom.id] = idiom.theme;
  });

  // Read target language idioms
  const targetPath = langCode === 'en'
    ? englishPath
    : path.join(__dirname, `../public/translations/${langCode}/idioms.json`);

  if (!fs.existsSync(targetPath)) {
    console.log(`  ❌ File not found: ${targetPath}`);
    return { fixed: 0, errors: 0 };
  }

  const idioms = JSON.parse(fs.readFileSync(targetPath, 'utf-8'));
  const themeMapping = STANDARD_THEMES[langCode];

  if (!themeMapping) {
    console.log(`  ❌ No theme mapping defined for ${langCode}`);
    return { fixed: 0, errors: 0 };
  }

  let fixed = 0;
  let unchanged = 0;
  const themeCounts = {};

  // Fix each idiom's theme
  idioms.forEach(idiom => {
    const englishTheme = idToTheme[idiom.id];

    if (!englishTheme) {
      console.log(`  ⚠️  ${idiom.id} - No English theme found`);
      return;
    }

    const correctTheme = themeMapping[englishTheme];

    if (!correctTheme) {
      console.log(`  ⚠️  ${idiom.id} - No translation for theme: ${englishTheme}`);
      return;
    }

    if (idiom.theme !== correctTheme) {
      console.log(`  ${idiom.characters} (${idiom.id})`);
      console.log(`    Old: "${idiom.theme}"`);
      console.log(`    New: "${correctTheme}"`);
      idiom.theme = correctTheme;
      fixed++;
    } else {
      unchanged++;
    }

    // Count themes
    themeCounts[correctTheme] = (themeCounts[correctTheme] || 0) + 1;
  });

  // Save updated file
  fs.writeFileSync(targetPath, JSON.stringify(idioms, null, 2));

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ ${langCode.toUpperCase()} Complete`);
  console.log(`   Fixed: ${fixed}`);
  console.log(`   Unchanged: ${unchanged}`);
  console.log(`\n   Theme Distribution:`);

  Object.entries(themeCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([theme, count]) => {
      console.log(`     ${count.toString().padStart(3)} - ${theme}`);
    });

  console.log(`${'='.repeat(60)}\n`);

  return { fixed, unchanged };
}

function fixAllLanguages() {
  console.log('\n🎨 STANDARDIZING THEMES TO 6 ACROSS ALL LANGUAGES\n');
  console.log('📋 Standard Themes:');
  Object.keys(STANDARD_THEMES.en).forEach((theme, i) => {
    console.log(`   ${i + 1}. ${theme}`);
  });
  console.log('');

  const results = {};
  const languages = ['en', ...Object.keys(STANDARD_THEMES).filter(l => l !== 'en')];

  languages.forEach(langCode => {
    try {
      results[langCode] = fixThemesForLanguage(langCode);
    } catch (error) {
      console.error(`\n❌ Error processing ${langCode}: ${error.message}\n`);
      results[langCode] = { fixed: 0, unchanged: 0, errors: 1 };
    }
  });

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 FINAL SUMMARY');
  console.log('='.repeat(60) + '\n');

  let totalFixed = 0;
  let totalUnchanged = 0;

  languages.forEach(langCode => {
    const result = results[langCode];
    const langName = langCode === 'en' ? 'English' : langCode.toUpperCase();
    console.log(`${langName.padEnd(15)} - Fixed: ${result.fixed}, Unchanged: ${result.unchanged}`);
    totalFixed += result.fixed;
    totalUnchanged += result.unchanged;
  });

  console.log('\n' + '-'.repeat(60));
  console.log(`TOTAL              - Fixed: ${totalFixed}, Unchanged: ${totalUnchanged}`);
  console.log('='.repeat(60) + '\n');
}

// Check if running with specific language argument
const args = process.argv.slice(2);
if (args.length > 0) {
  const langCode = args[0];
  if (STANDARD_THEMES[langCode]) {
    fixThemesForLanguage(langCode);
    console.log('✅ Done!');
    process.exit(0);
  } else {
    console.error(`❌ Unknown language: ${langCode}`);
    console.log(`Available languages: ${Object.keys(STANDARD_THEMES).join(', ')}`);
    process.exit(1);
  }
} else {
  // Run for all languages
  fixAllLanguages();
  console.log('✅ All languages processed!');
  process.exit(0);
}
