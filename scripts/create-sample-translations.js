const fs = require('fs');
const path = require('path');

// Create sample translations for demo - just first 10 idioms
const idiomsPath = path.join(__dirname, '../public/idioms.json');
const idioms = JSON.parse(fs.readFileSync(idiomsPath, 'utf-8'));

// Sample translations for first 10 idioms to demonstrate the system
const sampleTranslations = {
  'es': { // Spanish
    translations: [
      { meaning: "Canto de pájaro que sobresalta a todos", metaphoric_meaning: "Éxito repentino y notable", example: "Después de años de preparación silenciosa, su novela se convirtió en una sensación de la noche a la mañana", theme: "Éxito y Perseverancia" },
      { meaning: "Fusionar y conectar completamente", metaphoric_meaning: "Dominar algo completamente", example: "Después de años de estudio, finalmente dominó los principios de la física", theme: "Sabiduría y Aprendizaje" },
      { meaning: "El mar del aprendizaje no tiene orillas", metaphoric_meaning: "El aprendizaje es ilimitado", example: "Sin importar cuánto sepas, siempre hay más por descubrir", theme: "Sabiduría y Aprendizaje" },
      { meaning: "El agua clara no tiene peces", metaphoric_meaning: "Ser demasiado exigente te deja solo", example: "Su perfeccionismo extremo le dificultaba hacer amigos duraderos", theme: "Filosofía de Vida" },
      { meaning: "Un error perpetuo por mil años", metaphoric_meaning: "Una decisión que causa arrepentimiento duradero", example: "Su decisión apresurada de dejar la universidad lo persiguió durante décadas", theme: "Filosofía de Vida" }
    ]
  },
  'id': { // Indonesian
    translations: [
      { meaning: "Kicauan burung yang mengagetkan semua", metaphoric_meaning: "Sukses yang tiba-tiba dan luar biasa", example: "Setelah bertahun-tahun persiapan diam-diam, novelnya menjadi sensasi dalam semalam", theme: "Sukses & Ketekunan" },
      { meaning: "Menyatu dan menghubungkan sepenuhnya", metaphoric_meaning: "Menguasai sesuatu sepenuhnya", example: "Setelah bertahun-tahun belajar, dia akhirnya menguasai prinsip-prinsip fisika", theme: "Kebijaksanaan & Pembelajaran" },
      { meaning: "Lautan pembelajaran tidak memiliki pantai", metaphoric_meaning: "Pembelajaran tidak terbatas", example: "Tidak peduli seberapa banyak yang Anda ketahui, selalu ada lebih banyak lagi untuk ditemukan", theme: "Kebijaksanaan & Pembelajaran" },
      { meaning: "Air jernih tidak memiliki ikan", metaphoric_meaning: "Terlalu pilih-pilih membuat Anda sendirian", example: "Perfeksionismenya yang ekstrem membuatnya sulit menjalin persahabatan yang langgeng", theme: "Filosofi Hidup" },
      { meaning: "Satu kesalahan abadi selama seribu tahun", metaphoric_meaning: "Keputusan yang menyebabkan penyesalan yang bertahan lama", example: "Keputusannya yang terburu-buru untuk meninggalkan universitas menghantuinya selama beberapa dekade", theme: "Filosofi Hidup" }
    ]
  },
  'ja': { // Japanese
    translations: [
      { meaning: "すべてを驚かせる鳥の鳴き声", metaphoric_meaning: "突然の驚くべき成功", example: "何年もの静かな準備の後、彼の小説は一夜にしてセンセーションになった", theme: "成功と忍耐" },
      { meaning: "完全に融合し貫通する", metaphoric_meaning: "何かを完全にマスターする", example: "何年もの勉強の後、彼はついに物理学の原理をマスターした", theme: "知恵と学習" },
      { meaning: "学びの海には岸がない", metaphoric_meaning: "学習は無限である", example: "どれだけ知っていても、常にもっと発見することがある", theme: "知恵と学習" },
      { meaning: "澄んだ水には魚がいない", metaphoric_meaning: "あまりにも要求が厳しいと一人になる", example: "彼の極端な完璧主義は、lasting friendshipsを築くことを困難にした", theme: "人生哲学" },
      { meaning: "千年続く一つの永遠の間違い", metaphoric_meaning: "lasting regretを引き起こす決定", example: "大学を辞めるという彼の性急な決定は、何十年もの間彼につきまとった", theme: "人生哲学" }
    ]
  }
};

function createSampleTranslations() {
  console.log('📝 Creating sample translations for demo...\n');

  for (const [langCode, langData] of Object.entries(sampleTranslations)) {
    console.log(`Creating ${langCode} translations...`);

    const translatedIdioms = [];

    for (let i = 0; i < Math.min(5, idioms.length); i++) {
      const idiom = idioms[i];
      const translation = langData.translations[i];

      const translatedIdiom = {
        ...idiom,
        meaning: translation.meaning,
        metaphoric_meaning: translation.metaphoric_meaning,
        example: translation.example,
        theme: translation.theme,
        description: idiom.description, // Keep original for now
        original_meaning: idiom.meaning,
        original_metaphoric: idiom.metaphoric_meaning
      };

      translatedIdioms.push(translatedIdiom);
    }

    // Create directory and save
    const dir = path.join(__dirname, `../public/translations/${langCode}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(dir, 'idioms.json'),
      JSON.stringify(translatedIdioms, null, 2)
    );

    console.log(`  ✅ Created ${translatedIdioms.length} ${langCode} translations`);
  }

  // Create metadata
  const metadata = {
    languages: {
      'es': 'Spanish',
      'id': 'Indonesian',
      'ja': 'Japanese'
    },
    generatedAt: new Date().toISOString(),
    totalIdioms: 5,
    description: 'Sample multilingual Chinese idioms for demo'
  };

  fs.writeFileSync(
    path.join(__dirname, '../public/translations/languages.json'),
    JSON.stringify(metadata, null, 2)
  );

  console.log('\n✅ Sample translations created!');
  console.log('🌍 You can now test:');
  console.log('  - /es/blog (Spanish)');
  console.log('  - /id/blog (Indonesian)');
  console.log('  - /ja/blog (Japanese)');
  console.log('\n💡 Later, use a proper translation service for the full dataset.');
}

createSampleTranslations();