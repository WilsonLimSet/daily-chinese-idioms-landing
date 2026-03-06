export type Festival = {
  slug: string;
  chineseName: string;
  pinyin: string;
  englishName: string;
  alternateName?: string;
  date2026: string;
  lunarDate: string;
  month: number; // 1-12 for chronological sorting
  significance: string;
  traditions: string[];
  funFact: string;
  relatedListicleSlugs: string[];
};

export const FESTIVALS: Festival[] = [
  {
    slug: 'spring-festival',
    chineseName: '春节',
    pinyin: 'Chūn Jié',
    englishName: 'Spring Festival',
    alternateName: 'Chinese New Year',
    date2026: 'February 17, 2027 (January 29, 2026 was Year of the Horse)',
    lunarDate: '1st day of the 1st lunar month',
    month: 1,
    significance: 'Spring Festival is the most important holiday in Chinese culture, marking the beginning of the lunar new year. Families travel across the country for reunion dinners (年夜饭), exchange red envelopes (红包), and celebrate with fireworks and lion dances. The festival carries over 4,000 years of tradition, rooted in the legend of the monster Nian (年) who was frightened away by loud noises and the color red. Each year is associated with one of the 12 zodiac animals — 2026 is the Year of the Horse (马年).',
    traditions: [
      'Reunion dinner (年夜饭) on New Year\'s Eve',
      'Red envelopes (红包) with money for children and elders',
      'Lion and dragon dances',
      'Fireworks and firecrackers at midnight',
      'Spring couplets (春联) pasted on doorways',
      'Staying up until midnight (守岁)',
    ],
    funFact: 'Spring Festival triggers the largest annual human migration on Earth — "Chunyun" (春运) — with billions of trips made as people travel home for reunion.',
    relatedListicleSlugs: [
      'chinese-idioms-for-spring-festival',
      'chinese-new-year-idioms',
      'year-of-the-horse-idioms-2026',
      'chinese-new-year-family-reunion-idioms',
      'chinese-new-year-reunion-dinner-toasts',
      'chinese-new-year-red-envelope-messages',
      'chinese-new-year-prosperity-blessings',
      'chinese-new-year-first-day-chu-yi-greetings',
      'chinese-new-year-wishes-for-elders',
    ],
  },
  {
    slug: 'lantern-festival',
    chineseName: '元宵节',
    pinyin: 'Yuán Xiāo Jié',
    englishName: 'Lantern Festival',
    date2026: 'February 12, 2026',
    lunarDate: '15th day of the 1st lunar month',
    month: 2,
    significance: 'The Lantern Festival marks the end of Spring Festival celebrations with the first full moon of the new year. Streets and temples are filled with colorful lanterns of every shape — from traditional red globes to elaborate dragon sculptures. The festival dates back over 2,000 years to the Han Dynasty, when Emperor Ming ordered lanterns lit to honor Buddha. Today it blends ancient ritual with community celebration, as families gather to solve lantern riddles (猜灯谜), watch performances, and share sweet glutinous rice balls (汤圆) that symbolize unity and togetherness.',
    traditions: [
      'Displaying and admiring colorful lanterns',
      'Solving lantern riddles (猜灯谜)',
      'Eating tangyuan (汤圆) — sweet rice balls symbolizing reunion',
      'Dragon and lion dance processions',
      'Guessing riddles written on lanterns',
    ],
    funFact: 'Tangyuan (汤圆) are round to symbolize family togetherness and completeness — the Chinese word for "round" (圆) sounds the same as "reunion" (团圆).',
    relatedListicleSlugs: [
      'chinese-idioms-for-lantern-festival',
      'chinese-idioms-light-brightness-lantern-festival',
    ],
  },
  {
    slug: 'qingming-festival',
    chineseName: '清明节',
    pinyin: 'Qīng Míng Jié',
    englishName: 'Qingming Festival',
    alternateName: 'Tomb Sweeping Day',
    date2026: 'April 4, 2026',
    lunarDate: '15th day after the Spring Equinox (solar term)',
    month: 4,
    significance: 'Qingming literally means "clear and bright" — it falls when spring arrives in full, making it both a day to honor the dead and to celebrate the living world. Families visit ancestral graves to clean tombstones, offer food and incense, and burn paper offerings. But Qingming is not solely somber. The Tang Dynasty poet Du Mu wrote the famous poem "清明时节雨纷纷" (It drizzles endlessly during Qingming), capturing how grief and spring\'s beauty intertwine. After paying respects, families traditionally enjoy spring outings (踏青), fly kites, and plant willows — embracing renewal alongside remembrance.',
    traditions: [
      'Sweeping and cleaning ancestral graves',
      'Offering food, tea, and incense at tombs',
      'Burning joss paper and paper offerings',
      'Spring outings (踏青) — walking in nature',
      'Flying kites, sometimes releasing them to let go of misfortune',
      'Eating qingtuan (青团) — green rice balls with sweet filling',
    ],
    funFact: 'The tradition of cold food (寒食节) before Qingming honors Jie Zitui, a loyal minister who refused to seek reward and was accidentally killed when a duke set fire to a forest to draw him out.',
    relatedListicleSlugs: [
      'chinese-idioms-qingming-festival-tomb-sweeping-day',
      'chinese-idioms-for-qingming-festival',
      'chinese-idioms-remembering-family-ancestors',
      'chinese-idioms-about-spring-renewal',
    ],
  },
  {
    slug: 'dragon-boat-festival',
    chineseName: '端午节',
    pinyin: 'Duān Wǔ Jié',
    englishName: 'Dragon Boat Festival',
    date2026: 'May 31, 2026',
    lunarDate: '5th day of the 5th lunar month',
    month: 5,
    significance: 'Dragon Boat Festival commemorates Qu Yuan (屈原), a patriotic poet from the Warring States period who drowned himself in the Miluo River in 278 BC after his beloved state of Chu fell to invaders. Villagers raced boats to save him and threw rice into the water to keep fish from eating his body — giving rise to dragon boat racing and zongzi (rice dumplings wrapped in bamboo leaves). The festival is a celebration of loyalty, integrity, and standing up for what is right, even at personal cost. Dragon boat races have since become an international sport, with teams competing worldwide.',
    traditions: [
      'Dragon boat races (赛龙舟)',
      'Eating zongzi (粽子) — sticky rice dumplings in bamboo leaves',
      'Hanging mugwort (艾草) and calamus to ward off evil',
      'Drinking realgar wine (雄黄酒)',
      'Wearing five-color silk threads for protection',
      'Balancing eggs at noon (a Duanwu tradition)',
    ],
    funFact: 'Qu Yuan is considered one of China\'s greatest poets. His masterwork "Li Sao" (离骚, "Encountering Sorrow") is one of the longest poems in ancient Chinese literature, expressing his anguish over political corruption.',
    relatedListicleSlugs: [
      'chinese-idioms-for-dragon-boat-festival',
      'chinese-idioms-loyalty-sacrifice-dragon-boat',
    ],
  },
  {
    slug: 'qixi-festival',
    chineseName: '七夕节',
    pinyin: 'Qī Xī Jié',
    englishName: 'Qixi Festival',
    alternateName: 'Chinese Valentine\'s Day',
    date2026: 'August 19, 2026',
    lunarDate: '7th day of the 7th lunar month',
    month: 8,
    significance: 'Qixi celebrates the love story of the cowherd Niulang (牛郎) and the weaver girl Zhinu (织女), lovers separated by the Milky Way who may only meet once a year when magpies form a bridge across the sky. The story dates back over 2,600 years and represents faithful, enduring love against impossible odds. Unlike Western Valentine\'s Day (also celebrated in China on February 14), Qixi carries deeper cultural weight — it\'s tied to astronomy (the stars Altair and Vega), textile arts, and the tension between duty and desire in Chinese tradition.',
    traditions: [
      'Gazing at the stars Altair (Niulang) and Vega (Zhinu)',
      'Praying for skillful hands in needlework (乞巧)',
      'Gifting flowers, chocolates, and jewelry (modern)',
      'Writing love letters and poems',
      'Young women displaying handcraft skills',
    ],
    funFact: 'On the eve of Qixi, it\'s said that if you stand under a grapevine, you can overhear the whispered conversation between Niulang and Zhinu as they reunite.',
    relatedListicleSlugs: [
      'chinese-idioms-for-chinese-valentines-day',
      'chinese-idioms-for-valentines-day',
    ],
  },
  {
    slug: 'mid-autumn-festival',
    chineseName: '中秋节',
    pinyin: 'Zhōng Qiū Jié',
    englishName: 'Mid-Autumn Festival',
    alternateName: 'Moon Festival',
    date2026: 'October 3, 2026',
    lunarDate: '15th day of the 8th lunar month',
    month: 10,
    significance: 'Mid-Autumn Festival is the second most important Chinese holiday after Spring Festival. It falls on the night of the brightest full moon, celebrating harvest, abundance, and family reunion. The legend of Chang\'e (嫦娥) — who drank an elixir of immortality and floated to the moon — gives the festival its romantic mythology. Mooncakes (月饼) are exchanged between families and friends, each round cake symbolizing completeness and reunion. The festival reminds families that no matter how far apart they are, they share the same moon — a sentiment captured in the famous line "但愿人长久，千里共婵娟" (May we all be blessed with longevity, sharing the moonlight across a thousand miles).',
    traditions: [
      'Eating mooncakes (月饼) with various fillings',
      'Moon gazing with family',
      'Lighting and carrying lanterns',
      'Drinking osmanthus wine (桂花酒)',
      'Telling the legend of Chang\'e and the Jade Rabbit',
      'Family reunion dinners',
    ],
    funFact: 'In the Yuan Dynasty, revolutionaries used mooncakes to smuggle hidden messages coordinating an uprising against Mongol rule — making mooncakes a symbol of both reunion and resistance.',
    relatedListicleSlugs: [
      'chinese-idioms-for-mid-autumn-festival',
      'chinese-idioms-moon-reunion-mid-autumn',
    ],
  },
  {
    slug: 'double-ninth-festival',
    chineseName: '重阳节',
    pinyin: 'Chóng Yáng Jié',
    englishName: 'Double Ninth Festival',
    alternateName: 'Chongyang Festival',
    date2026: 'October 25, 2026',
    lunarDate: '9th day of the 9th lunar month',
    month: 10,
    significance: 'Double Ninth takes its name from the doubling of the number nine (九, jiǔ) — the highest single yang number in Chinese numerology, making 9/9 "double yang." Since nine also sounds like the word for "long-lasting" (久, jiǔ), the festival is associated with longevity and has become China\'s official Senior Citizens\' Day since 1989. The tradition of climbing heights (登高) on this day began as a way to escape plague — legend says a man named Huan Jing was warned by a sage to take his family to high ground, and when they returned, all their livestock had perished. Today it\'s a day to honor elders, enjoy chrysanthemum tea, and appreciate autumn scenery from mountain peaks.',
    traditions: [
      'Climbing mountains or hills (登高)',
      'Drinking chrysanthemum wine or tea (菊花酒)',
      'Wearing zhuyu (茱萸) plant sprigs for protection',
      'Eating chongyang cake (重阳糕)',
      'Visiting and honoring elderly family members',
    ],
    funFact: 'The famous Tang Dynasty poem by Wang Wei, "独在异乡为异客，每逢佳节倍思亲" (Alone as a stranger in a strange land, every festival I miss my family more), was written on Double Ninth — and is still memorized by every Chinese student today.',
    relatedListicleSlugs: [
      'chinese-idioms-for-double-ninth-festival',
      'chinese-idioms-respecting-elders-double-ninth',
    ],
  },
  {
    slug: 'winter-solstice',
    chineseName: '冬至',
    pinyin: 'Dōng Zhì',
    englishName: 'Winter Solstice Festival',
    date2026: 'December 21, 2026',
    lunarDate: 'Solar term (shortest day of the year)',
    month: 12,
    significance: 'Winter Solstice has been celebrated in China for over 2,500 years — predating even Spring Festival. In ancient China, it was considered the "start of the new year" because it marks the point when daylight begins to increase and yang energy returns. The saying "冬至大如年" (Winter Solstice is as important as the New Year) reflects its historical weight. Northern Chinese eat dumplings (饺子) — legend says this prevents ears from getting frostbite, as dumplings resemble ears. Southern Chinese eat tangyuan (汤圆), the same sweet rice balls as Lantern Festival, because adding one year of age at the solstice requires a family celebration.',
    traditions: [
      'Eating dumplings (饺子) in Northern China',
      'Eating tangyuan (汤圆) in Southern China',
      'Family gatherings and reunion meals',
      'Counting the "nine nines" (数九) — tracking 81 days until spring',
      'Offering sacrifices to ancestors',
    ],
    funFact: 'The "Nine Nines" chart (九九消寒图) is a traditional way to count down winter: people paint one petal of a plum blossom each day for 81 days (9 groups of 9), and when the flower is complete, spring has arrived.',
    relatedListicleSlugs: [
      'chinese-idioms-winter-solstice-dongzhi',
    ],
  },
];

export function getAllFestivals(): Festival[] {
  return FESTIVALS;
}

export function getFestival(slug: string): Festival | undefined {
  return FESTIVALS.find(f => f.slug === slug);
}
