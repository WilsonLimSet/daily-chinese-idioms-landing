#!/usr/bin/env node
/**
 * Fix listicle translations for SEO optimization
 * Based on Google Search Console data analysis (Jan 2026)
 *
 * Issues found:
 * 1. Thai (th) has empty slugs
 * 2. Keywords don't include actual search terms people use
 *    - Japanese: Missing "意味", "とは", Chinese characters
 *    - Thai: Missing "แปล", Chinese characters
 *    - Vietnamese: Missing "là gì"
 *    - Malay: Missing "maksud", "in chinese"
 *    - Others: Missing Chinese characters in keywords
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = path.join(__dirname, '../public/translations');

// Slug mappings for Thai (based on originalSlug -> Thai romanized)
const thaiSlugMappings = {
  'chinese-idioms-for-business': 'sam-nuan-jin-sam-rap-thurakit',
  'chinese-idioms-about-love': 'sam-nuan-jin-kiew-kap-khwam-rak',
  'chinese-idioms-for-students': 'sam-nuan-jin-sam-rap-nak-rien',
  'chinese-idioms-about-friendship': 'sam-nuan-jin-kiew-kap-mittraphap',
  'chinese-idioms-about-success': 'sam-nuan-jin-kiew-kap-khwam-samret',
  'chinese-idioms-about-hard-work': 'sam-nuan-jin-kiew-kap-khwam-khayen',
  'chinese-idioms-about-life': 'sam-nuan-jin-kiew-kap-chiwit',
  'chinese-idioms-for-motivation': 'sam-nuan-jin-sam-rap-raeng-ban-dan-jai',
  'chinese-idioms-about-patience': 'sam-nuan-jin-kiew-kap-khwam-ot-thon',
  'chinese-idioms-about-teamwork': 'sam-nuan-jin-kiew-kap-kan-tham-ngan-pen-thim',
  'chinese-idioms-about-change': 'sam-nuan-jin-kiew-kap-kan-plian-plaeng',
  'chinese-idioms-for-speeches': 'sam-nuan-jin-sam-rap-kan-klaw-suntharaphot',
  'chinese-idioms-about-courage': 'sam-nuan-jin-kiew-kap-khwam-klahan',
  'chinese-idioms-for-beginners': 'sam-nuan-jin-sam-rap-phu-roem-ton',
  'chinese-idioms-for-tattoos': 'sam-nuan-jin-sam-rap-sak',
  'funny-chinese-idioms': 'sam-nuan-jin-talok',
  'chinese-new-year-idioms': 'sam-nuan-jin-trut-jin-2026',
  'chinese-idioms-for-graduation': 'sam-nuan-jin-sam-rap-rab-parinya',
  'chinese-idioms-about-family': 'sam-nuan-jin-kiew-kap-khrop-khrua',
  'chinese-idioms-about-time': 'sam-nuan-jin-kiew-kap-wela',
  'chinese-idioms-about-nature': 'sam-nuan-jin-kiew-kap-thammachat',
  'chinese-idioms-for-instagram': 'sam-nuan-jin-sam-rap-instagram',
  'chinese-idioms-about-money': 'sam-nuan-jin-kiew-kap-ngoen',
  'year-of-the-horse-idioms-2026': 'sam-nuan-jin-pi-ma-2026',
  'chinese-new-year-red-envelope-messages': 'khwam-ang-pao-trut-jin',
  'chinese-new-year-family-reunion-idioms': 'sam-nuan-jin-ruam-khrop-khrua-trut-jin',
  'chinese-new-year-fresh-start-idioms': 'sam-nuan-jin-roem-ton-mai-trut-jin',
  'chinese-new-year-prosperity-blessings': 'sam-nuan-jin-khwam-ruengruang-trut-jin',
  'chinese-new-year-peace-harmony-idioms': 'sam-nuan-jin-santiphap-trut-jin',
  'chinese-new-year-first-day-chu-yi-greetings': 'sam-nuan-jin-wan-raek-trut-jin',
  'chinese-new-year-wishes-for-elders': 'sam-nuan-jin-sam-rap-phu-sung-ayu',
  'chinese-new-year-wishes-for-students': 'sam-nuan-jin-sam-rap-nak-rien-trut-jin',
  'chinese-new-year-idioms-for-in-laws': 'sam-nuan-jin-sam-rap-pho-mae-sami-phanraya',
  'chinese-new-year-idioms-for-grandparents': 'sam-nuan-jin-sam-rap-pu-ya-ta-yai',
  'chinese-new-year-idioms-for-aunties-uncles': 'sam-nuan-jin-sam-rap-lung-pa-na-a',
  'chinese-new-year-idioms-for-children': 'sam-nuan-jin-sam-rap-dek',
  'chinese-new-year-business-greetings': 'sam-nuan-jin-thurakit-trut-jin',
  'chinese-new-year-zodiac-blessings': 'sam-nuan-jin-rasi-trut-jin',
  'chinese-new-year-health-wishes': 'sam-nuan-jin-sukkhaphap-trut-jin',
  'chinese-new-year-reunion-dinner-toasts': 'sam-nuan-jin-liang-ruam-khrop-khrua',
  // New listicles
  'chinese-idioms-about-perseverance': 'sam-nuan-jin-kiew-kap-khwam-pha-yayam',
  'chinese-beauty-idioms-four-beauties': 'sam-nuan-jin-khwam-ngam-si-nang-ngam',
  'chinese-idioms-english-translations': 'sam-nuan-jin-plae-phasa-angkrit',
  'classic-chinese-fable-idioms': 'sam-nuan-jin-nithan-isan',
  'chinese-idioms-preparation-planning': 'sam-nuan-jin-kiew-kap-kan-triam-tua',
  'most-searched-chinese-idioms': 'sam-nuan-jin-yod-niyom'
};

// SEO keywords to add for each language based on search patterns
const seoKeywordsByLanguage = {
  ja: {
    // Add "意味" (meaning), "とは" (what is), Chinese characters
    suffixes: ['意味', 'とは', '使い方', '由来', '故事'],
    // High-volume idiom characters to include
    idiomChars: ['明鏡止水', '柳暗花明', '閉月羞花', '龍馬精神', '飲水思源', '物極必反', '自強不息']
  },
  th: {
    // Add "แปล" (translate), "ความหมาย" (meaning)
    suffixes: ['แปล', 'ความหมาย', 'หมายถึง'],
    idiomChars: ['守株待兔', '画龙点睛', '莫名其妙', '半途而废', '笨鸟先飞', '入乡随俗', '画蛇添足']
  },
  vi: {
    // Add "là gì" (what is), "nghĩa là gì"
    suffixes: ['là gì', 'nghĩa là gì', 'có nghĩa gì'],
    idiomChars: ['天道酬勤', '笨鸟先飞', '物极必反']
  },
  ms: {
    // Add "maksud" (meaning), "in chinese"
    suffixes: ['maksud', 'in chinese', 'peribahasa cina'],
    idiomChars: ['井底之蛙']
  },
  ko: {
    suffixes: ['뜻', '의미', '유래'],
    idiomChars: []
  },
  id: {
    suffixes: ['artinya', 'arti', 'makna'],
    idiomChars: []
  },
  hi: {
    suffixes: ['का अर्थ', 'मतलब'],
    idiomChars: []
  },
  ar: {
    suffixes: ['معنى', 'ترجمة'],
    idiomChars: []
  },
  ru: {
    suffixes: ['значение', 'перевод', 'смысл'],
    idiomChars: ['терпение', 'мудрость']
  },
  es: {
    suffixes: ['significado', 'traducción'],
    idiomChars: []
  },
  fr: {
    suffixes: ['signification', 'traduction'],
    idiomChars: []
  },
  pt: {
    suffixes: ['significado', 'tradução'],
    idiomChars: []
  },
  tl: {
    suffixes: ['kahulugan', 'ibig sabihin'],
    idiomChars: []
  }
};

// Map originalSlug to relevant Chinese idiom characters for keywords
const slugToIdiomChars = {
  'chinese-idioms-about-perseverance': ['水滴石穿', '百折不挠', '锲而不舍', '自强不息', '愚公移山'],
  'chinese-beauty-idioms-four-beauties': ['闭月羞花', '沉鱼落雁', '閉月羞花'],
  'chinese-idioms-english-translations': ['雪中送炭', '举一反三', '饮水思源', '望梅止渴', '胸有成竹'],
  'classic-chinese-fable-idioms': ['守株待兔', '狐假虎威', '井底之蛙', '叶公好龙', '对牛弹琴', '画蛇添足'],
  'chinese-idioms-preparation-planning': ['未雨绸缪', '胸有成竹'],
  'most-searched-chinese-idioms': ['物极必反', '柳暗花明', '人山人海', '明镜止水'],
  'chinese-idioms-for-business': ['一鸣惊人', '马到成功'],
  'chinese-idioms-about-success': ['马到成功', '一鸣惊人', '天道酬勤'],
  'chinese-idioms-about-hard-work': ['水滴石穿', '天道酬勤', '笨鸟先飞'],
  'chinese-idioms-about-patience': ['水滴石穿', '塞翁失马'],
  'chinese-idioms-about-life': ['物极必反', '塞翁失马', '因果报应'],
  'chinese-idioms-about-love': ['青梅竹马', '心心相印'],
  'chinese-idioms-about-friendship': ['同舟共济', '风雨同舟', '雪中送炭'],
  'chinese-idioms-for-students': ['举一反三', '温故知新', '学海无涯'],
  'chinese-idioms-about-family': ['饮水思源'],
  'funny-chinese-idioms': ['对牛弹琴', '狐假虎威'],
  'chinese-idioms-for-beginners': ['一模一样', '马马虎虎'],
  'chinese-idioms-about-nature': ['柳暗花明', '高山流水'],
  'year-of-the-horse-idioms-2026': ['马到成功', '龙马精神', '万马奔腾'],
  'chinese-new-year-idioms': ['马到成功', '龙马精神'],
};

function enhanceKeywords(listicle, lang) {
  const langConfig = seoKeywordsByLanguage[lang];
  if (!langConfig) return listicle.keywords;

  const newKeywords = [...listicle.keywords];
  const originalSlug = listicle.originalSlug;

  // Add idiom characters relevant to this listicle
  const relevantChars = slugToIdiomChars[originalSlug] || [];
  relevantChars.forEach(char => {
    // Add character + language suffix combinations
    langConfig.suffixes.forEach(suffix => {
      const keyword = `${char} ${suffix}`.trim();
      if (!newKeywords.includes(keyword)) {
        newKeywords.push(keyword);
      }
    });
    // Also add just the character
    if (!newKeywords.includes(char)) {
      newKeywords.push(char);
    }
  });

  // Add any language-specific high-volume idiom chars
  langConfig.idiomChars.forEach(char => {
    if (!newKeywords.includes(char)) {
      newKeywords.push(char);
    }
  });

  return newKeywords;
}

function fixThaiSlugs(listicles) {
  return listicles.map(listicle => {
    if (!listicle.slug || listicle.slug === '') {
      const newSlug = thaiSlugMappings[listicle.originalSlug];
      if (newSlug) {
        return { ...listicle, slug: newSlug };
      } else {
        // Fallback: use originalSlug
        console.warn(`No Thai slug mapping for: ${listicle.originalSlug}`);
        return { ...listicle, slug: listicle.originalSlug };
      }
    }
    return listicle;
  });
}

function processLanguage(lang) {
  const filePath = path.join(TRANSLATIONS_DIR, lang, 'listicles.json');

  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${lang}: file not found`);
    return;
  }

  console.log(`Processing ${lang}...`);

  let listicles = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  // Fix Thai slugs specifically
  if (lang === 'th') {
    listicles = fixThaiSlugs(listicles);
  }

  // Enhance keywords for all languages
  listicles = listicles.map(listicle => ({
    ...listicle,
    keywords: enhanceKeywords(listicle, lang)
  }));

  // Write back
  fs.writeFileSync(filePath, JSON.stringify(listicles, null, 2), 'utf-8');
  console.log(`  Updated ${listicles.length} listicles`);
}

// Main execution
console.log('Fixing listicle translations for SEO...\n');

const languages = ['ar', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ms', 'pt', 'ru', 'th', 'tl', 'vi'];

languages.forEach(lang => {
  try {
    processLanguage(lang);
  } catch (err) {
    console.error(`Error processing ${lang}:`, err.message);
  }
});

console.log('\nDone! Remember to generate translations for the 6 new listicles.');
