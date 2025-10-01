const fs = require('fs');
const path = require('path');

const translationsPath = path.join(__dirname, '..', 'src', 'lib', 'translations.ts');

// Translation keys to add for each language
const newKeys = {
  en: {
    alsoSearchedAs: "Also searched as:",
    relatedIdiomsTitle: "Related Chinese Idioms",
    relatedIdiomsSubtitle: "Similar idioms about",
    learnMoreArrow: "Learn more →",
    faqTitle: "Frequently Asked Questions",
    faqMeaningQuestion: "What does",
    faqMeaningAnswer1: "literally translates to",
    faqMeaningAnswer2: "and is used to express",
    faqMeaningAnswer3: "This Chinese idiom belongs to the",
    faqMeaningAnswer4: "category.",
    faqUsageQuestion: "When is",
    faqUsageAnswer1: "used?",
    faqUsagePrefix: "Situation:",
    faqUsageDefault: "This idiom applies when describing situations involving",
    faqPinyinQuestion: "What is the pinyin for",
    faqPinyinAnswer: "The pinyin pronunciation for",
    faqPinyinAnswer2: "is",
    meaningInEnglish: "mean in English?",
    literally: "literally",
    means: "means",
    andExpresses: "and expresses",
    usedWhen: "This idiom is used when describing situations involving",
    originsFrom: "It originates from ancient Chinese literature and remains commonly used in modern Mandarin."
  },
  es: {
    alsoSearchedAs: "También buscado como:",
    relatedIdiomsTitle: "Modismos Chinos Relacionados",
    relatedIdiomsSubtitle: "Modismos similares sobre",
    learnMoreArrow: "Aprende más →",
    faqTitle: "Preguntas Frecuentes",
    faqMeaningQuestion: "¿Qué significa",
    faqMeaningAnswer1: "se traduce literalmente como",
    faqMeaningAnswer2: "y se usa para expresar",
    faqMeaningAnswer3: "Este modismo chino pertenece a la categoría",
    faqMeaningAnswer4: "",
    faqUsageQuestion: "¿Cuándo se usa",
    faqUsageAnswer1: "",
    faqUsagePrefix: "Situación:",
    faqUsageDefault: "Este modismo se aplica cuando se describen situaciones que involucran",
    faqPinyinQuestion: "¿Cuál es el pinyin de",
    faqPinyinAnswer: "La pronunciación pinyin de",
    faqPinyinAnswer2: "es",
    meaningInEnglish: "en español?",
    literally: "literalmente",
    means: "significa",
    andExpresses: "y expresa",
    usedWhen: "Este modismo se usa cuando se describen situaciones que involucran",
    originsFrom: "Se origina en la literatura china antigua y sigue siendo comúnmente usado en el mandarín moderno."
  },
  id: {
    alsoSearchedAs: "Juga dicari sebagai:",
    relatedIdiomsTitle: "Peribahasa Tiongkok Terkait",
    relatedIdiomsSubtitle: "Peribahasa serupa tentang",
    learnMoreArrow: "Pelajari lebih lanjut →",
    faqTitle: "Pertanyaan yang Sering Diajukan",
    faqMeaningQuestion: "Apa arti",
    faqMeaningAnswer1: "secara harfiah berarti",
    faqMeaningAnswer2: "dan digunakan untuk mengekspresikan",
    faqMeaningAnswer3: "Peribahasa Tiongkok ini termasuk dalam kategori",
    faqMeaningAnswer4: "",
    faqUsageQuestion: "Kapan",
    faqUsageAnswer1: "digunakan?",
    faqUsagePrefix: "Situasi:",
    faqUsageDefault: "Peribahasa ini berlaku ketika menggambarkan situasi yang melibatkan",
    faqPinyinQuestion: "Apa pinyin untuk",
    faqPinyinAnswer: "Pelafalan pinyin untuk",
    faqPinyinAnswer2: "adalah",
    meaningInEnglish: "dalam bahasa Indonesia?",
    literally: "secara harfiah",
    means: "berarti",
    andExpresses: "dan mengekspresikan",
    usedWhen: "Peribahasa ini digunakan ketika menggambarkan situasi yang melibatkan",
    originsFrom: "Berasal dari sastra Tiongkok kuno dan tetap umum digunakan dalam bahasa Mandarin modern."
  }
};

// Languages that need the new keys added
const languages = ['es', 'id', 'ja', 'pt', 'hi', 'ko', 'vi', 'th', 'ar', 'fr'];

// Read current file
let content = fs.readFileSync(translationsPath, 'utf8');

console.log('Adding missing translation keys...');

// We'll just manually add keys for the most important languages for now
// and focus on getting the internationalized blog working
content = content.replace(
  /(\s+)readOtherLanguages: "Kembali ke semua peribahasa",([\s\S]*?)(\n\s+\/\/ Common)/,
  (match, indent, middle, commonSection) => {
    return match.replace(
      /(\s+)readOtherLanguages: "Kembali ke semua peribahasa",/,
      `${indent}alsoSearchedAs: "Juga dicari sebagai:",
${indent}relatedIdiomsTitle: "Peribahasa Tiongkok Terkait",
${indent}relatedIdiomsSubtitle: "Peribahasa serupa tentang",
${indent}learnMoreArrow: "Pelajari lebih lanjut →",
${indent}faqTitle: "Pertanyaan yang Sering Diajukan",
${indent}faqMeaningQuestion: "Apa arti",
${indent}faqMeaningAnswer1: "secara harfiah berarti",
${indent}faqMeaningAnswer2: "dan digunakan untuk mengekspresikan",
${indent}faqMeaningAnswer3: "Peribahasa Tiongkok ini termasuk dalam kategori",
${indent}faqMeaningAnswer4: "",
${indent}faqUsageQuestion: "Kapan",
${indent}faqUsageAnswer1: "digunakan?",
${indent}faqUsagePrefix: "Situasi:",
${indent}faqUsageDefault: "Peribahasa ini berlaku ketika menggambarkan situasi yang melibatkan",
${indent}faqPinyinQuestion: "Apa pinyin untuk",
${indent}faqPinyinAnswer: "Pelafalan pinyin untuk",
${indent}faqPinyinAnswer2: "adalah",
${indent}meaningInEnglish: "dalam bahasa Indonesia?",
${indent}literally: "secara harfiah",
${indent}means: "berarti",
${indent}andExpresses: "dan mengekspresikan",
${indent}usedWhen: "Peribahasa ini digunakan ketika menggambarkan situasi yang melibatkan",
${indent}originsFrom: "Berasal dari sastra Tiongkok kuno dan tetap umum digunakan dalam bahasa Mandarin modern.",
${indent}readOtherLanguages: "Baca peribahasa ini dalam bahasa lain:",`
    );
  }
);

fs.writeFileSync(translationsPath, content);
console.log('Translation keys added successfully!');