const fs = require('fs');
const path = require('path');

// Theme mapping from English to each language
const THEME_TRANSLATIONS = {
  'Character & Behavior': {
    es: 'Carácter y Comportamiento',
    id: 'Karakter & Perilaku',
    pt: 'Caráter e Comportamento',
    ja: '性格と行動',
    ko: '성격과 행동',
    vi: 'Tính cách & Hành vi',
    th: 'ตัวละครและพฤติกรรม',
    hi: 'चरित्र और व्यवहार',
    ar: 'الشخصية والسلوك',
    fr: 'Caractère et Comportement'
  },
  'Strategy & Action': {
    es: 'Estrategia y Acción',
    id: 'Strategi & Tindakan',
    pt: 'Estratégia e Ação',
    ja: '戦略と行動',
    ko: '전략과 행동',
    vi: 'Chiến lược & Hành động',
    th: 'กลยุทธ์และการดำเนินการ',
    hi: 'रणनीति और कार्रवाई',
    ar: 'الاستراتيجية والعمل',
    fr: 'Stratégie et Action'
  },
  'Relationships & Character': {
    es: 'Relaciones y Carácter',
    id: 'Hubungan & Karakter',
    pt: 'Relacionamentos e Caráter',
    ja: '人間関係と性格',
    ko: '관계와 성격',
    vi: 'Mối quan hệ & Tính cách',
    th: 'ความสัมพันธ์และตัวละคร',
    hi: 'संबंध और चरित्र',
    ar: 'العلاقات والشخصية',
    fr: 'Relations et Caractère'
  },
  'Success & Perseverance': {
    es: 'Éxito y Perseverancia',
    id: 'Sukses & Ketekunan',
    pt: 'Sucesso e Perseverança',
    ja: '成功と忍耐',
    ko: '성공과 인내',
    vi: 'Thành công & Kiên trì',
    th: 'ความสำเร็จและความพากเพียร',
    hi: 'सफलता और दृढ़ता',
    ar: 'النجاح والمثابرة',
    fr: 'Succès et Persévérance'
  },
  'Wisdom & Learning': {
    es: 'Sabiduría y Aprendizaje',
    id: 'Kebijaksanaan & Pembelajaran',
    pt: 'Sabedoria e Aprendizagem',
    ja: '知恵と学習',
    ko: '지혜와 학습',
    vi: 'Trí tuệ & Học tập',
    th: 'ภูมิปัญญาและการเรียนรู้',
    hi: 'ज्ञान और सीखना',
    ar: 'الحكمة والتعلم',
    fr: 'Sagesse et Apprentissage'
  },
  'Life Philosophy': {
    es: 'Filosofía de Vida',
    id: 'Filosofi hidup',
    pt: 'Filosofia de Vida',
    ja: '人生哲学',
    ko: '인생 철학',
    vi: 'Triết lý sống',
    th: 'ปรัชญาชีวิต',
    hi: 'जीवन दर्शन',
    ar: 'فلسفة الحياة',
    fr: 'Philosophie de Vie'
  }
};

async function fixThemeTranslations() {
  // Load English idioms (source of truth)
  const englishPath = path.join(__dirname, '../public/idioms.json');
  const englishIdioms = JSON.parse(fs.readFileSync(englishPath, 'utf-8'));

  // Create a map of ID to English theme
  const idToEnglishTheme = {};
  englishIdioms.forEach(idiom => {
    idToEnglishTheme[idiom.id] = idiom.theme;
  });

  console.log(`Loaded ${englishIdioms.length} English idioms with ${Object.keys(THEME_TRANSLATIONS).length} unique themes`);

  // Process each language
  const languages = ['es', 'id', 'pt', 'ja', 'ko', 'vi', 'th', 'hi', 'ar', 'fr'];

  for (const lang of languages) {
    const langPath = path.join(__dirname, `../public/translations/${lang}/idioms.json`);

    if (!fs.existsSync(langPath)) {
      console.log(`⚠️  ${lang}: File not found, skipping`);
      continue;
    }

    const langIdioms = JSON.parse(fs.readFileSync(langPath, 'utf-8'));
    let fixedCount = 0;
    let unchangedCount = 0;

    // Fix each idiom's theme
    langIdioms.forEach(idiom => {
      const englishTheme = idToEnglishTheme[idiom.id];

      if (!englishTheme) {
        console.log(`⚠️  ${lang}: Unknown idiom ID ${idiom.id}`);
        return;
      }

      const correctTranslatedTheme = THEME_TRANSLATIONS[englishTheme]?.[lang];

      if (!correctTranslatedTheme) {
        console.log(`⚠️  ${lang}: No translation for theme "${englishTheme}"`);
        return;
      }

      if (idiom.theme !== correctTranslatedTheme) {
        idiom.theme = correctTranslatedTheme;
        fixedCount++;
      } else {
        unchangedCount++;
      }
    });

    // Write back to file
    fs.writeFileSync(langPath, JSON.stringify(langIdioms, null, 2), 'utf-8');

    // Count unique themes in fixed file
    const uniqueThemes = new Set(langIdioms.map(i => i.theme)).size;

    console.log(`✅ ${lang}: Fixed ${fixedCount} idioms, ${unchangedCount} unchanged, ${uniqueThemes} unique themes`);
  }

  console.log('\n🎉 Theme translation fix complete!');
}

fixThemeTranslations().catch(console.error);
