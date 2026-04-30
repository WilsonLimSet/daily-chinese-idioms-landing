import fs from 'fs';
import path from 'path';

export type SlangTerm = {
  slug: string;
  characters: string;
  pinyin: string;
  meaning: string;
  origin: string;
  examples: string[];
  category: string;
  era: string;
  formality: 'very informal' | 'informal' | 'neutral';
  metaTitle?: string;
  metaDescription?: string;
  /** Optional slug of a long-form blog post that goes deeper than this dictionary entry. */
  deepDiveSlug?: string;
};

export type TranslatedSlangTerm = SlangTerm & {
  originalSlug: string;
};

export const SLANG_CATEGORIES = [
  'Work & Hustle',
  'Attitude & Lifestyle',
  'Social & Relationships',
  'Internet Culture',
  'Emotions & Reactions',
  'Youth Culture',
] as const;

export const slangTerms: SlangTerm[] = [
  {
    slug: 'yyds',
    characters: 'YYDS (永远的神)',
    pinyin: 'yǒng yuǎn de shén',
    meaning: 'GOAT (Greatest of All Time). Used to praise someone or something as the absolute best.',
    origin: 'Originated from gaming streamer Shiny (山泥若) in 2020 when praising a player, then spread to mainstream internet culture.',
    examples: [
      'This restaurant is YYDS! Best noodles I\'ve ever had.',
      '这家奶茶店YYDS！(This bubble tea shop is the GOAT!)',
    ],
    category: 'Internet Culture',
    era: '2020s',
    formality: 'very informal',
    metaTitle: 'YYDS Meaning — 永远的神 "Forever God" | Chinese Internet Slang',
    metaDescription: 'YYDS (永远的神) means "Forever God" — the Chinese internet\'s way of saying GOAT. Born from a gaming streamer in 2020, now used everywhere from Bilibili to WeChat. Origin story, examples & how to use it.',
    deepDiveSlug: 'yyds-meaning-chinese-internet-slang-yong-yuan-de-shen',
  },
  {
    slug: 'nei-juan',
    characters: '内卷',
    pinyin: 'nèi juǎn',
    meaning: 'Involution — excessive, often pointless competition where everyone works harder but nobody gains more.',
    origin: 'Originally an anthropological term, it went viral in 2020 when photos of Tsinghua students studying on laptops while biking circulated online.',
    examples: [
      'The tech industry in China is so 内卷 — everyone works 996 just to keep up.',
      '现在考研太内卷了。(The graduate school entrance exam is so involuted now.)',
    ],
    category: 'Work & Hustle',
    era: '2020s',
    formality: 'informal',
    metaTitle: '内卷 (Nèi Juǎn) — China\'s "Involution" Rat Race Explained',
    metaDescription: 'What is 内卷 (involution)? China\'s viral term for the exhausting rat race where everyone works harder but nobody wins. From Tsinghua students biking with laptops to 996 culture — origin, meaning & examples.',
  },
  {
    slug: 'tang-ping',
    characters: '躺平',
    pinyin: 'tǎng píng',
    meaning: 'Lying flat — rejecting the rat race, choosing to do the bare minimum instead of overworking.',
    origin: 'Coined in a 2021 viral post by a factory worker who quit his job and traveled on minimal savings, rejecting societal pressure to overachieve.',
    examples: [
      'I\'m done competing — I\'m just going to 躺平.',
      '年轻人选择躺平。(Young people are choosing to lie flat.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2021',
    formality: 'informal',
    metaTitle: '躺平 (Tǎng Píng) — "Lying Flat": China\'s Anti-Hustle Movement',
    metaDescription: '躺平 means "lying flat" — China\'s viral rejection of overwork culture. A factory worker quit, traveled on nothing, and inspired millions. How 躺平 became Gen Z\'s answer to 内卷 (involution). Meaning, origin & examples.',
    deepDiveSlug: 'tang-ping-lying-flat-chinese-millennial-movement-meaning',
  },
  {
    slug: 'bai-lan',
    characters: '摆烂',
    pinyin: 'bǎi làn',
    meaning: 'Let it rot — giving up entirely on trying, embracing failure or mediocrity.',
    origin: 'From NBA basketball culture where losing teams "tank" on purpose. Adopted by Chinese netizens as an even more extreme version of 躺平.',
    examples: [
      'Exams are tomorrow and I haven\'t studied — time to 摆烂.',
      '这学期我直接摆烂了。(I\'m just letting it rot this semester.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2022',
    formality: 'very informal',
  },
  {
    slug: 'jue-jue-zi',
    characters: '绝绝子',
    pinyin: 'jué jué zǐ',
    meaning: 'Absolutely amazing / Absolutely terrible — an emphatic expression that can be positive or negative depending on context.',
    origin: 'Popularized on Chinese social media platforms like Douyin and Xiaohongshu around 2021 as an intensifier.',
    examples: [
      'This sunset is 绝绝子! So beautiful!',
      '这个味道绝绝子！(This flavor is absolutely amazing!)',
    ],
    category: 'Emotions & Reactions',
    era: '2021',
    formality: 'very informal',
  },
  {
    slug: 'fan-er-sai',
    characters: '凡尔赛',
    pinyin: 'fán ěr sài',
    meaning: 'Humble-bragging — showing off wealth or achievements while pretending to be modest or complaining.',
    origin: 'Named after the Palace of Versailles. Popularized by blogger 小奶球 in 2020 who shared stories of people casually mentioning luxury lifestyles.',
    examples: [
      '"Ugh, my boyfriend only bought me a BMW, not a Porsche" — so 凡尔赛.',
      '她发朋友圈太凡尔赛了。(Her WeChat Moments posts are so humble-braggy.)',
    ],
    category: 'Social & Relationships',
    era: '2020',
    formality: 'informal',
  },
  {
    slug: 'she-si',
    characters: '社死',
    pinyin: 'shè sǐ',
    meaning: 'Social death — an extremely embarrassing moment that makes you want to disappear.',
    origin: 'Short for 社会性死亡 (social death). Became popular around 2020-2021 as Gen Z embraced sharing embarrassing moments online.',
    examples: [
      'I called my teacher "mom" in class — total 社死.',
      '我当众摔了一跤，社死了。(I fell in public — social death.)',
    ],
    category: 'Emotions & Reactions',
    era: '2020s',
    formality: 'informal',
  },
  {
    slug: 'da-gong-ren',
    characters: '打工人',
    pinyin: 'dǎ gōng rén',
    meaning: 'Working people / wage slaves — a self-deprecating term workers use to describe themselves.',
    origin: 'Went viral in late 2020 through motivational-yet-ironic morning greetings shared among office workers on social media.',
    examples: [
      'Good morning, 打工人! Time to make money for the boss.',
      '打工人打工魂，打工都是人上人。(Workers have a worker\'s soul, workers are the best of people.)',
    ],
    category: 'Work & Hustle',
    era: '2020',
    formality: 'informal',
  },
  {
    slug: 'gan-fan-ren',
    characters: '干饭人',
    pinyin: 'gān fàn rén',
    meaning: 'Eating machine / foodie warrior — someone who eats with great enthusiasm and passion.',
    origin: 'Evolved alongside 打工人 in late 2020. Celebrates the simple joy of eating as a form of self-care amid work stress.',
    examples: [
      'Lunch break! 干饭人 mode activated!',
      '干饭人干饭魂！(Foodies have a foodie soul!)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2020',
    formality: 'very informal',
  },
  {
    slug: 'fo-xi',
    characters: '佛系',
    pinyin: 'fó xì',
    meaning: 'Buddha-like — having a zen, whatever-happens-happens attitude toward life. Not caring about outcomes.',
    origin: 'Originated from a 2014 Japanese magazine article about "Buddha-like men," adopted into Chinese internet culture around 2017.',
    examples: [
      'I have a 佛系 approach to dating — if it happens, it happens.',
      '佛系青年什么都无所谓。(Buddha-like youth don\'t care about anything.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2017',
    formality: 'informal',
  },
  {
    slug: 'zhen-xiang',
    characters: '真香',
    pinyin: 'zhēn xiāng',
    meaning: 'Smells good / So good — used when someone ends up loving something they previously said they\'d never do.',
    origin: 'From a 2014 reality show where contestant Wang Jingze swore he\'d never eat the rural food, then was filmed saying "真香" while eating it.',
    examples: [
      'I said I\'d never use TikTok... 真香.',
      '说好不吃零食的，结果真香了。(Said I wouldn\'t eat snacks, then... so good.)',
    ],
    category: 'Internet Culture',
    era: '2018',
    formality: 'informal',
  },
  {
    slug: '996',
    characters: '996',
    pinyin: 'jiǔ jiǔ liù',
    meaning: 'Working 9am to 9pm, 6 days a week — describes the grueling work culture in Chinese tech companies.',
    origin: 'Became a major talking point in 2019 when tech workers created "996.ICU" on GitHub to protest overwork culture.',
    examples: [
      'I can\'t meet up this week — my company does 996.',
      '996工作制让人身心疲惫。(The 996 work schedule is physically and mentally exhausting.)',
    ],
    category: 'Work & Hustle',
    era: '2019',
    formality: 'informal',
  },
  {
    slug: 'pua',
    characters: 'PUA',
    pinyin: 'PUA',
    meaning: 'Psychological manipulation — used broadly to describe gaslighting, emotional manipulation, or toxic behavior by bosses, partners, etc.',
    origin: 'Originally from English "Pick-Up Artist," but in Chinese context it expanded to mean any form of psychological manipulation, especially in workplaces.',
    examples: [
      'My boss is totally PUA-ing me by saying I\'m not good enough.',
      '别被老板PUA了。(Don\'t let your boss gaslight you.)',
    ],
    category: 'Social & Relationships',
    era: '2020s',
    formality: 'informal',
    metaTitle: 'PUA in Chinese — Not "Pick-Up Artist" but Gaslighting & Manipulation',
    metaDescription: 'In China, PUA doesn\'t mean Pick-Up Artist — it means psychological manipulation by bosses, partners, or anyone in power. Why this term went viral, how it\'s used at work and in dating, with real examples.',
  },
  {
    slug: 'i-ren-e-ren',
    characters: 'i人/e人',
    pinyin: 'i rén / e rén',
    meaning: 'Introvert/Extrovert — referencing MBTI personality types, used casually to describe social preferences.',
    origin: 'MBTI personality testing became hugely popular in China around 2022-2023, with i人 (introvert) and e人 (extrovert) becoming everyday labels.',
    examples: [
      'I\'m such an i人 — parties drain my energy.',
      '作为一个i人，我周末只想在家待着。(As an introvert, I just want to stay home on weekends.)',
    ],
    category: 'Youth Culture',
    era: '2022',
    formality: 'informal',
  },
  {
    slug: 'xiu-gou',
    characters: '秀狗/秀恩爱',
    pinyin: 'xiù ēn ài',
    meaning: 'Showing off affection / PDA — couples who publicly display their relationship in an over-the-top way.',
    origin: 'Common internet slang criticizing excessive public displays of affection, especially on social media.',
    examples: [
      'Stop 秀恩爱 on WeChat Moments, we get it, you\'re in love.',
      '秀恩爱，死得快。(Show off love, die fast — a humorous warning.)',
    ],
    category: 'Social & Relationships',
    era: '2010s',
    formality: 'informal',
  },
  {
    slug: 'ji-wa',
    characters: '鸡娃',
    pinyin: 'jī wá',
    meaning: 'Tiger parenting on steroids — pushing children extremely hard academically with endless tutoring and activities.',
    origin: 'Combines 打鸡血 (inject chicken blood, meaning to energize) with 娃 (child). Reflects anxiety about education competition in China.',
    examples: [
      'Beijing parents are known for 鸡娃 — kids have no free time.',
      '别太鸡娃了，孩子需要玩耍。(Don\'t push your kids too hard, children need to play.)',
    ],
    category: 'Social & Relationships',
    era: '2020s',
    formality: 'informal',
  },
  {
    slug: 'e-yi-e',
    characters: 'EMO/emo',
    pinyin: 'emo',
    meaning: 'Feeling down, sad, or melancholic — used when experiencing a wave of negative emotions.',
    origin: 'Borrowed from English "emo" but used more broadly in Chinese to mean any temporary sadness or emotional low point.',
    examples: [
      'Rainy days make me so emo.',
      '今天又emo了。(I\'m feeling emo again today.)',
    ],
    category: 'Emotions & Reactions',
    era: '2021',
    formality: 'very informal',
    metaTitle: 'EMO Meaning in Chinese Slang — Not the Music Genre',
    metaDescription: 'When Chinese people say "emo了" they don\'t mean the music genre — it means feeling temporarily sad or down. How "emo" became China\'s go-to word for a bad mood, with examples and when to use it.',
  },
  {
    slug: 'gao-qing-shang',
    characters: '高情商',
    pinyin: 'gāo qíng shāng',
    meaning: 'High EQ — being tactful, diplomatic, or knowing exactly the right thing to say.',
    origin: 'Used in viral memes contrasting "low EQ" (blunt/rude response) vs "high EQ" (tactful/clever response) to the same situation.',
    examples: [
      'Low EQ: "You\'re fat." High EQ: "You look prosperous!"',
      '高情商说法：你不是胖，你是可爱。(High EQ: You\'re not fat, you\'re adorable.)',
    ],
    category: 'Internet Culture',
    era: '2021',
    formality: 'informal',
  },
  {
    slug: 'shuang-jian',
    characters: '双减',
    pinyin: 'shuāng jiǎn',
    meaning: 'Double reduction — the government policy reducing homework burden and after-school tutoring for students.',
    origin: 'Official policy launched in July 2021, became widely discussed slang as it dramatically changed education culture.',
    examples: [
      'After 双减, kids finally have time to play.',
      '双减政策改变了教育行业。(The double reduction policy changed the education industry.)',
    ],
    category: 'Youth Culture',
    era: '2021',
    formality: 'neutral',
  },
  {
    slug: 'yan-zhi',
    characters: '颜值',
    pinyin: 'yán zhí',
    meaning: 'Attractiveness score / face value — a numerical rating of someone\'s physical appearance.',
    origin: 'Popularized through Chinese social media and entertainment shows where appearance became openly discussed and "scored."',
    examples: [
      'That actor has insane 颜值.',
      '颜值即正义。(Attractiveness is justice — looks are everything.)',
    ],
    category: 'Youth Culture',
    era: '2015',
    formality: 'informal',
  },
  {
    slug: 'cp',
    characters: 'CP (嗑CP)',
    pinyin: 'kè CP',
    meaning: 'Shipping / pairing — supporting or fantasizing about a romantic couple, whether real or fictional.',
    origin: 'From English "couple" abbreviated to CP. 嗑CP means to "consume" or obsess over a romantic pairing.',
    examples: [
      'I\'m 嗑CP-ing these two actors so hard!',
      '这对CP好甜！(This couple is so sweet!)',
    ],
    category: 'Internet Culture',
    era: '2019',
    formality: 'very informal',
    metaTitle: 'CP Meaning in Chinese Chat — Couple, Shipping & 嗑CP Explained',
    metaDescription: 'What does CP mean in Chinese online chat? Short for "couple" — used when fans ship two people (real or fictional) as a romantic pair. 嗑CP means obsessing over a ship. Used on Weibo, Douyin, anime forums & C-drama fandoms.',
  },
  {
    slug: 'da-call',
    characters: '打call',
    pinyin: 'dǎ call',
    meaning: 'To show support / cheer for — enthusiastically supporting someone or something.',
    origin: 'From Japanese idol culture where fans do coordinated cheering ("call") at concerts. Adopted into Chinese internet culture.',
    examples: [
      'I\'m 打call for my favorite singer!',
      '为中国女排打call！(Cheering for the Chinese women\'s volleyball team!)',
    ],
    category: 'Internet Culture',
    era: '2017',
    formality: 'informal',
  },
  {
    slug: 'fan-quan',
    characters: '饭圈',
    pinyin: 'fàn quān',
    meaning: 'Fan circle / fandom — the organized community of fans around a celebrity or idol.',
    origin: 'From 粉丝 (fans) culture. Fandoms in China became highly organized with coordinated activities, fundraising, and online campaigns.',
    examples: [
      '饭圈 culture can be pretty intense in China.',
      '饭圈文化影响了年轻人。(Fan circle culture has influenced young people.)',
    ],
    category: 'Youth Culture',
    era: '2018',
    formality: 'informal',
  },
  {
    slug: 'xia-tou',
    characters: '虾头',
    pinyin: 'xiā tóu',
    meaning: 'Shrimp head — describes someone who is attractive from behind but disappointing from the front.',
    origin: 'Like a shrimp where the tail (body) is the good part and the head is discarded. Went viral on Douyin.',
    examples: [
      'I thought he was so handsome from behind, turned out to be a 虾头.',
      '背影杀手，结果是个虾头。(Back-view killer, but turned out to be a shrimp head.)',
    ],
    category: 'Social & Relationships',
    era: '2023',
    formality: 'very informal',
  },
  {
    slug: 'lao-liu-bi',
    characters: '老六',
    pinyin: 'lǎo liù',
    meaning: 'Sneaky player / camper — someone who plays dirty or hides and waits for others to fight first.',
    origin: 'From the game CS:GO where 5 players are on a team, and the "6th player" is someone hiding/camping instead of playing properly.',
    examples: [
      'Stop being an 老六 and fight properly!',
      '你怎么又当老六！(Why are you being a camper again!)',
    ],
    category: 'Internet Culture',
    era: '2022',
    formality: 'very informal',
  },
  {
    slug: 'gua',
    characters: '吃瓜',
    pinyin: 'chī guā',
    meaning: 'Eating melon — being a spectator watching drama unfold, enjoying gossip without getting involved.',
    origin: 'From a photo of a man eating watermelon while watching a street argument. The 吃瓜群众 (melon-eating masses) are passive bystanders.',
    examples: [
      'I\'m just here to 吃瓜, don\'t drag me into this.',
      '吃瓜群众已就位。(The melon-eating spectators are in position.)',
    ],
    category: 'Internet Culture',
    era: '2016',
    formality: 'informal',
    deepDiveSlug: 'chi-gua-eating-melon-chinese-internet-slang-meaning-origin',
  },
  {
    slug: 'niu',
    characters: '牛/牛逼',
    pinyin: 'niú / niú bī',
    meaning: 'Awesome / badass — strong praise for something impressive or someone skilled.',
    origin: 'One of the oldest Chinese internet slang terms, 牛 (cow/bull) has long been associated with being impressive or powerful.',
    examples: [
      'You got into Tsinghua? 牛!',
      '这个设计太牛了！(This design is so awesome!)',
    ],
    category: 'Emotions & Reactions',
    era: '2000s',
    formality: 'very informal',
    deepDiveSlug: 'niu-bi-meaning-chinese-slang-awesome-cool-history',
  },
  {
    slug: 'gan',
    characters: '尬',
    pinyin: 'gà',
    meaning: 'Awkward / cringe — describes an uncomfortable, secondhand-embarrassment situation.',
    origin: 'Short for 尴尬 (awkward). Became popular shorthand in text messages and social media posts.',
    examples: [
      'That conversation was so 尬.',
      '好尬啊，不知道说什么好。(So awkward, I don\'t know what to say.)',
    ],
    category: 'Emotions & Reactions',
    era: '2018',
    formality: 'informal',
  },
  {
    slug: 'xue-ba',
    characters: '学霸',
    pinyin: 'xué bà',
    meaning: 'Academic overachiever / study god — someone who excels at studying and always gets top grades.',
    origin: 'Combines 学 (study) with 霸 (tyrant/dominator). The opposite is 学渣 (xuézhā, academic failure).',
    examples: [
      'She\'s such a 学霸, always getting perfect scores.',
      '学霸的世界我们不懂。(We can\'t understand the world of academic overachievers.)',
    ],
    category: 'Youth Culture',
    era: '2010s',
    formality: 'informal',
  },
  {
    slug: 'ti-geng',
    characters: '梗',
    pinyin: 'gěng',
    meaning: 'Meme / running joke — an internet joke, reference, or catchphrase that people repeatedly use.',
    origin: 'Originally from 哏 (gén, a comedic punchline in crosstalk). Evolved to cover all internet memes and viral references.',
    examples: [
      'I don\'t get this 梗, can someone explain?',
      '这个梗已经过时了。(This meme is already outdated.)',
    ],
    category: 'Internet Culture',
    era: '2018',
    formality: 'informal',
  },
  {
    slug: 'ji-tang',
    characters: '鸡汤/毒鸡汤',
    pinyin: 'jī tāng / dú jī tāng',
    meaning: 'Chicken soup (for the soul) / toxic chicken soup — inspirational quotes vs. darkly humorous anti-motivational quotes.',
    origin: 'From the American book series "Chicken Soup for the Soul." 毒鸡汤 is the cynical Chinese internet parody version.',
    examples: [
      'That quote is pure 鸡汤 — sounds nice but means nothing.',
      '毒鸡汤：你不努力，别人替你努力。(Toxic chicken soup: If you don\'t work hard, others will work hard for you.)',
    ],
    category: 'Internet Culture',
    era: '2016',
    formality: 'informal',
  },
  {
    slug: 'e-ren-xian-gao-zhuang',
    characters: '内耗',
    pinyin: 'nèi hào',
    meaning: 'Internal friction — overthinking, self-doubt, and mental energy drain from excessive worry.',
    origin: 'Became popular around 2022 as discussions about mental health increased among young Chinese people.',
    examples: [
      'Stop 内耗 and just do it!',
      '别再内耗了，做就对了。(Stop overthinking and just go for it.)',
    ],
    category: 'Emotions & Reactions',
    era: '2022',
    formality: 'informal',
  },
  {
    slug: 'te-zhong-bing',
    characters: '特种兵旅游',
    pinyin: 'tè zhǒng bīng lǚ yóu',
    meaning: 'Special forces tourism — extreme speed travel, cramming maximum sightseeing into minimum time on a tiny budget.',
    origin: 'Trend among Chinese college students in 2023 who would visit 5+ cities in a weekend using overnight trains to save on hotels.',
    examples: [
      'We did a 特种兵旅游 — visited 3 cities in 2 days!',
      '大学生特种兵旅游攻略。(College student special forces travel guide.)',
    ],
    category: 'Youth Culture',
    era: '2023',
    formality: 'informal',
  },
  {
    slug: 'da-lian',
    characters: '搭子',
    pinyin: 'dā zi',
    meaning: 'Activity buddy — a person you pair up with for specific activities (meal buddy, study buddy, travel buddy).',
    origin: 'Became trendy in 2023 as young people sought low-commitment, activity-specific social connections.',
    examples: [
      'I need a 饭搭子 (meal buddy) for lunch today.',
      '找个学习搭子一起去图书馆。(Looking for a study buddy to go to the library together.)',
    ],
    category: 'Social & Relationships',
    era: '2023',
    formality: 'informal',
  },
  {
    slug: 'di-san-kong-jian',
    characters: '第三空间',
    pinyin: 'dì sān kōng jiān',
    meaning: 'Third space — a place that\'s neither home nor work where you can relax (cafes, libraries, parks).',
    origin: 'From sociologist Ray Oldenburg\'s concept, popularized in China as young people seek escape from cramped living and work spaces.',
    examples: [
      'This cafe is my 第三空间.',
      '年轻人需要第三空间来放松。(Young people need a third space to relax.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2023',
    formality: 'neutral',
  },
  {
    slug: 'song-si-rui',
    characters: '松弛感',
    pinyin: 'sōng chí gǎn',
    meaning: 'Relaxed vibe — the quality of being effortlessly calm and unbothered, not anxious about everything.',
    origin: 'Became a viral ideal in 2022 as a counter to the anxiety-driven culture, celebrating people who stay calm under pressure.',
    examples: [
      'She has such 松弛感 — nothing seems to bother her.',
      '我要学习她的松弛感。(I want to learn her relaxed vibe.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2022',
    formality: 'informal',
  },
  {
    slug: 'ka-dian',
    characters: '卡点',
    pinyin: 'kǎ diǎn',
    meaning: 'Arriving at exactly the last possible moment — being precisely on time with zero margin.',
    origin: 'Describes the habit of pushing deadlines and arrival times to the absolute limit, common among young people.',
    examples: [
      'He always 卡点 arrives — one second later and he\'d be late.',
      '每次上班都卡点到。(Always arriving at work at the last possible second.)',
    ],
    category: 'Work & Hustle',
    era: '2020s',
    formality: 'informal',
  },
  {
    slug: 'dian-zan',
    characters: '点赞',
    pinyin: 'diǎn zàn',
    meaning: 'To like / give a thumbs up — pressing the like button, or more broadly, to approve of something.',
    origin: 'From social media\'s like button. Has entered everyday speech to mean giving approval or praise.',
    examples: [
      '给你点赞! (Giving you a like!)',
      '这个操作我要点赞。(I have to give a thumbs up for this move.)',
    ],
    category: 'Internet Culture',
    era: '2012',
    formality: 'neutral',
  },
  {
    slug: 'gao-ji',
    characters: '割韭菜',
    pinyin: 'gē jiǔ cài',
    meaning: 'Harvesting leeks — scamming or exploiting consumers/investors, especially through overpriced products or bad investments.',
    origin: 'Leeks grow back after being cut, symbolizing how consumers/investors keep coming back to be exploited again.',
    examples: [
      'That crypto project is just 割韭菜.',
      '别被割韭菜了。(Don\'t get scammed.)',
    ],
    category: 'Work & Hustle',
    era: '2018',
    formality: 'informal',
  },
  {
    slug: 'hua-zi',
    characters: '画大饼',
    pinyin: 'huà dà bǐng',
    meaning: 'Drawing a big pancake — making empty promises, especially by bosses promising raises or promotions that never come.',
    origin: 'Traditional idiom repurposed for modern workplace culture, describing hollow promises from management.',
    examples: [
      'My boss loves to 画大饼 but never delivers.',
      '又画大饼了，这次我不信了。(Drawing another big pancake, but I won\'t believe it this time.)',
    ],
    category: 'Work & Hustle',
    era: '2020s',
    formality: 'informal',
  },
  {
    slug: 'shai-tai-yang',
    characters: '晒',
    pinyin: 'shài',
    meaning: 'To show off / share publicly — posting photos of purchases, trips, or achievements on social media.',
    origin: 'Originally means "to dry in the sun." Extended meaning: to expose/display something publicly, especially on social media.',
    examples: [
      'She\'s always 晒-ing her luxury bags on Instagram.',
      '朋友圈晒美食。(Sharing food photos on WeChat Moments.)',
    ],
    category: 'Social & Relationships',
    era: '2010s',
    formality: 'informal',
  },
  {
    slug: 'bao-fu-xing-xiao-fei',
    characters: '报复性消费',
    pinyin: 'bào fù xìng xiāo fèi',
    meaning: 'Revenge spending — splurging excessively after a period of being unable to spend (e.g., after lockdowns).',
    origin: 'Became popular after COVID lockdowns ended and people went on shopping and dining sprees.',
    examples: [
      'After lockdown, everyone went on a 报复性消费 spree.',
      '解封后开始报复性消费。(Started revenge spending after restrictions were lifted.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2020',
    formality: 'neutral',
  },
  {
    slug: 'tian-hua-ban',
    characters: '天花板',
    pinyin: 'tiān huā bǎn',
    meaning: 'Ceiling — the absolute peak or highest level of something. Used as a superlative.',
    origin: 'Borrowed from "glass ceiling" concept but used positively to mean "the very best" in Chinese internet slang.',
    examples: [
      'This is the 天花板 of hotpot restaurants.',
      '颜值天花板。(The ceiling of attractiveness — the most attractive person.)',
    ],
    category: 'Internet Culture',
    era: '2021',
    formality: 'informal',
  },
  {
    slug: 'ci-sheng-ren',
    characters: '刺客',
    pinyin: 'cì kè',
    meaning: 'Price assassin — a product that looks cheap but shocks you with an unexpectedly high price at checkout.',
    origin: 'Started with "雪糕刺客" (ice cream assassin) in 2022 when expensive ice cream brands tricked people expecting cheap prices.',
    examples: [
      'That ice cream was a 刺客 — looked normal but cost $8!',
      '小心超市里的雪糕刺客。(Watch out for ice cream assassins in the supermarket.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2022',
    formality: 'informal',
  },
  {
    slug: 'xia-ban-nao',
    characters: '下班脑',
    pinyin: 'xià bān nǎo',
    meaning: 'Off-work brain — the mental state of only thinking about leaving work, having zero motivation.',
    origin: 'Viral trend in 2023 describing workers who are physically present but mentally already checked out.',
    examples: [
      'I have serious 下班脑 today — can\'t focus on anything.',
      '一到下午三点就开始下班脑了。(Off-work brain kicks in at 3pm.)',
    ],
    category: 'Work & Hustle',
    era: '2023',
    formality: 'informal',
  },
  {
    slug: 'suan-le',
    characters: '算了',
    pinyin: 'suàn le',
    meaning: 'Forget it / never mind — expressing resignation or deciding not to bother with something.',
    origin: 'Traditional phrase that became a mood/attitude among young people, often used as a life philosophy.',
    examples: [
      'Want to argue about it? 算了.',
      '算了算了，不想了。(Forget it, forget it, I don\'t want to think about it.)',
    ],
    category: 'Emotions & Reactions',
    era: '2010s',
    formality: 'informal',
  },
  {
    slug: 'ye-sheng-de',
    characters: '野生',
    pinyin: 'yě shēng',
    meaning: 'Wild / unofficial — something or someone that\'s self-made, unofficial, or discovered in an unexpected place.',
    origin: 'Used to describe amateur but talented people found "in the wild" — like a street singer who\'s incredibly good.',
    examples: [
      'I found a 野生 singer on the subway who was amazing!',
      '野生程序员。(A self-taught "wild" programmer.)',
    ],
    category: 'Internet Culture',
    era: '2019',
    formality: 'informal',
  },
  {
    slug: 'zhuan-zhuan',
    characters: '润',
    pinyin: 'rùn',
    meaning: 'To emigrate / leave China — from the English word "run," used to describe people leaving the country.',
    origin: 'Became widespread in 2022 as discussions about emigration increased. Uses the character 润 (moist/smooth) as a pun for "run."',
    examples: [
      'Many tech workers are thinking about 润.',
      '他润到加拿大了。(He emigrated to Canada.)',
    ],
    category: 'Attitude & Lifestyle',
    era: '2022',
    formality: 'informal',
  },
  {
    slug: 'da-di',
    characters: '大地/大爹',
    pinyin: 'dà dì / dà diē',
    meaning: 'Big daddy — used sarcastically to describe arrogant or domineering behavior.',
    origin: 'Internet slang mocking people who act superior or entitled, especially customer service karens.',
    examples: [
      'Who do you think you are, 大爹?',
      '又来了一个大爹顾客。(Here comes another "big daddy" customer.)',
    ],
    category: 'Social & Relationships',
    era: '2022',
    formality: 'very informal',
  },
  {
    slug: 'ban-wei',
    characters: '班味',
    pinyin: 'bān wèi',
    meaning: 'Office stench — the lingering aura of exhaustion and despair that clings to you after work. Not a literal smell, but the dead-eyed, soul-drained vibe.',
    origin: 'The #1 buzzword of 2024. "去班味" (removing office stench) became a trend as young workers tried to reclaim their identity outside of work through hobbies, travel, and self-care.',
    examples: [
      'I need a vacation to wash off this 班味.',
      '下班后第一件事就是去班味。(The first thing after work is to remove the office stench.)',
    ],
    category: 'Work & Hustle',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'ying-kong',
    characters: '硬控',
    pinyin: 'yìng kòng',
    meaning: 'Hard-controlled — when something is so captivating it pins you in place. From gaming CC (crowd control) applied to real life.',
    origin: 'Gaming term that went mainstream in 2024. "This video hard-controlled me for 3 minutes" means you couldn\'t look away. Used for content, people, or moments that seize your full attention.',
    examples: [
      'This cat video 硬控 me for 10 minutes straight.',
      '这个视频硬控了我三分钟。(This video hard-controlled me for three minutes.)',
    ],
    category: 'Internet Culture',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'niu-ma',
    characters: '牛马',
    pinyin: 'niú mǎ',
    meaning: 'Beasts of burden — self-deprecating label for overworked, underpaid workers who toil like oxen and horses.',
    origin: 'Went viral in 2024 as an even more bitter upgrade to 打工人. While 打工人 had ironic pride, 牛马 is pure resignation — you\'re just livestock for the company.',
    examples: [
      'Back to being a 牛马 on Monday.',
      '我们都是公司的牛马。(We\'re all just beasts of burden for the company.)',
    ],
    category: 'Work & Hustle',
    era: '2024',
    formality: 'very informal',
  },
  {
    slug: 'city-bu-city',
    characters: 'city不city',
    pinyin: 'city bù city',
    meaning: 'City or not city? — asking whether something is modern, hip, or cosmopolitan enough. A vibe check for urbanness.',
    origin: 'Created by American vlogger "保保熊" (Bao Bao Xiong) in his Shanghai travel videos in 2024. He\'d point at things asking "city不city?" in a playful tone. Went massively viral — even state media picked it up.',
    examples: [
      'This rooftop bar is so city不city!',
      '上海外滩，city不city？(The Bund in Shanghai — city or not city?)',
    ],
    category: 'Youth Culture',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'chou-xiang',
    characters: '抽象',
    pinyin: 'chōu xiàng',
    meaning: 'Abstract — when something is so bizarre, confusing, or absurd that you\'re speechless. The 2024 catch-all for "what am I even looking at."',
    origin: 'Originally an art term, co-opted by Chinese internet culture in 2024 to describe any bewildering behavior. Closely tied to "抽象文化" (abstract culture) — intentionally chaotic humor.',
    examples: [
      'His breakup text was so 抽象 I couldn\'t even respond.',
      '这个操作太抽象了。(This move is too abstract.)',
    ],
    category: 'Emotions & Reactions',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'tou-gan',
    characters: '偷感',
    pinyin: 'tōu gǎn',
    meaning: 'Thief vibes — the feeling of doing normal things (eating alone, going to the gym) while looking around nervously like you\'re doing something wrong.',
    origin: 'Went viral in 2024 on Xiaohongshu. Describes social anxiety where you feel like everyone is watching and judging you, even when you\'re just existing. The opposite of 松弛感.',
    examples: [
      'I have major 偷感 eating alone at a restaurant.',
      '去健身房偷感很重。(I feel like a thief going to the gym.)',
    ],
    category: 'Emotions & Reactions',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'dan-ren-nong-ren',
    characters: '淡人/浓人',
    pinyin: 'dàn rén / nóng rén',
    meaning: 'Mild person vs. intense person — a simplified personality split. 淡人 are low-energy and unbothered, 浓人 are loud, passionate, and extra about everything.',
    origin: 'Emerged in 2024 as a simpler alternative to MBTI types. Instead of 16 personalities, just two: are you mild or intense? Became a popular way to describe friend dynamics.',
    examples: [
      'I\'m a 淡人 — don\'t expect me to be excited about anything.',
      '我是浓人，做什么都很投入。(I\'m an intense person, I go all-in on everything.)',
    ],
    category: 'Social & Relationships',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'xiao-hai-ge',
    characters: '小孩哥/小孩姐',
    pinyin: 'xiǎo hái gē / xiǎo hái jiě',
    meaning: 'Kid bro / Kid sis — a child who is surprisingly wise, skilled, or mature beyond their years. Used with genuine admiration.',
    origin: 'Viral in 2024 from videos of young kids showing off impressive skills — cooking, calligraphy, debate, sports. The respectful 哥/姐 title given to a child creates a funny contrast.',
    examples: [
      'This 8-year-old just beat me at chess — 小孩哥!',
      '这个小孩姐做菜比我好。(This kid sis cooks better than me.)',
    ],
    category: 'Youth Culture',
    era: '2024',
    formality: 'informal',
  },
  {
    slug: 'mo-yu',
    characters: '摸鱼',
    pinyin: 'mō yú',
    meaning: 'Touching fish — slacking off at work while pretending to be productive. Scrolling your phone, browsing Taobao, looking busy.',
    origin: 'From the idiom 浑水摸鱼 (fishing in muddy waters). Became standard office vocabulary as workers openly embraced strategic laziness. "摸鱼学" (the art of slacking) has its own subculture.',
    examples: [
      'I\'ve been 摸鱼 all afternoon — nobody noticed.',
      '今天摸了一天的鱼。(Slacked off the entire day today.)',
    ],
    category: 'Work & Hustle',
    era: '2020s',
    formality: 'informal',
    deepDiveSlug: 'mo-yu-touching-fish-chinese-slang-slacking-off-work',
  },
  {
    slug: 'po-fang',
    characters: '破防',
    pinyin: 'pò fáng',
    meaning: 'Defenses breached — when something hits you so emotionally hard that your composure breaks. Can be happy tears or devastating news.',
    origin: 'From gaming (breaking through defenses). Bilibili named it their "comment of the year." Used when a video, story, or moment makes you unexpectedly emotional.',
    examples: [
      'That soldier reunion video completely 破防了.',
      '看到这个视频我直接破防了。(Watching this video completely broke my defenses.)',
    ],
    category: 'Emotions & Reactions',
    era: '2021',
    formality: 'informal',
  },
  {
    slug: 'xin-tai-beng-le',
    characters: '心态崩了',
    pinyin: 'xīn tài bēng le',
    meaning: 'Mentality collapsed — when stress, bad luck, or frustration pushes you past your breaking point. Mental boom.',
    origin: 'From competitive gaming and esports where players\' mental state collapses under pressure. Now used broadly for any situation where you just can\'t take it anymore.',
    examples: [
      'Failed my driving test for the 4th time — 心态崩了.',
      '连续加班一周，心态崩了。(Overtime for a week straight, my mentality collapsed.)',
    ],
    category: 'Emotions & Reactions',
    era: '2020s',
    formality: 'informal',
  },
  {
    slug: 'gou-liang',
    characters: '狗粮',
    pinyin: 'gǒu liáng',
    meaning: 'Dog food — what single people are "fed" when couples show off their relationship in front of them. Forced to consume PDA.',
    origin: 'When a couple is being sweet in public or online, single bystanders say they\'re "eating dog food." It\'s self-deprecating humor from the single perspective.',
    examples: [
      'My friends are 撒狗粮 again — I need to leave this group chat.',
      '又被喂了一嘴狗粮。(Got fed another mouthful of dog food.)',
    ],
    category: 'Social & Relationships',
    era: '2018',
    formality: 'informal',
  },
  {
    slug: '666',
    characters: '666',
    pinyin: 'liù liù liù',
    meaning: 'Smooth / well played / awesome — universal approval in gaming and internet culture. The number 6 (六/溜) sounds like 溜 (smooth/skilled).',
    origin: 'One of the earliest Chinese internet slang terms from gaming. Spamming 666 in chat means you\'re impressed. Still ubiquitous in livestream comments and Bilibili danmaku.',
    examples: [
      'That play was 666!',
      '主播操作666！(The streamer\'s moves are sick!)',
    ],
    category: 'Internet Culture',
    era: '2010s',
    formality: 'very informal',
    metaTitle: '666 Meaning in Chinese — Why Gamers Spam 666 in Chat',
    metaDescription: 'Why do people spam 666 in gaming chats and livestreams? In Chinese, 6 (liù) sounds like 溜 (smooth/skilled). Typing 666 means "nice play!" or "awesome!" Origin from Chinese gaming culture, Bilibili & Twitch.',
  },
];

export const SLANG_ERAS = ['2024', '2023', '2022', '2021', '2020s', '2020', '2019', '2018', '2017', '2016', '2015', '2012', '2010s', '2000s'] as const;

// Helper functions
export function getAllSlangTerms(): SlangTerm[] {
  return slangTerms;
}

export function getSlangEras(): string[] {
  const eras = new Set(slangTerms.map(t => t.era));
  // Sort: recent first, decades last
  return Array.from(eras).sort((a, b) => {
    const numA = parseInt(a) || 0;
    const numB = parseInt(b) || 0;
    if (numA && numB) return numB - numA;
    if (numA) return -1;
    if (numB) return 1;
    return b.localeCompare(a);
  });
}

export function getSlangBySlug(slug: string): SlangTerm | undefined {
  return slangTerms.find(t => t.slug === slug);
}

export function getSlangByCategory(category: string): SlangTerm[] {
  return slangTerms.filter(t => t.category === category);
}

export function getRelatedSlang(slug: string, limit: number = 4): SlangTerm[] {
  const term = getSlangBySlug(slug);
  if (!term) return [];

  // First, get same category terms
  const sameCategory = slangTerms.filter(t => t.slug !== slug && t.category === term.category);
  // Then fill with other terms
  const others = slangTerms.filter(t => t.slug !== slug && t.category !== term.category);

  return [...sameCategory, ...others].slice(0, limit);
}

export function loadTranslatedSlang(lang: string): TranslatedSlangTerm[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'translations', lang, 'slang.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as TranslatedSlangTerm[];
  } catch {
    // Fallback to English if translation doesn't exist
    return slangTerms.map(term => ({
      ...term,
      originalSlug: term.slug,
    }));
  }
}

export function getTranslatedSlangBySlug(slug: string, lang: string): TranslatedSlangTerm | undefined {
  const terms = loadTranslatedSlang(lang);
  return terms.find(t => t.slug === slug || t.originalSlug === slug);
}
