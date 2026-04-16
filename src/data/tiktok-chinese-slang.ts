export type TikTokSlangMapping = {
  english: string;
  englishAka?: string; // alt/expansion (e.g. "LMAO or LOL")
  chinese: string;
  pinyin: string;
  pronunciation?: string; // approximate English pronunciation
  whenToUse: string;
  example: {
    english: string;
    chinese: string;
  };
  origin: string;
  altChinese?: Array<{ term: string; pinyin: string; note: string }>;
};

/**
 * English TikTok / Gen-Z slang → Chinese equivalents. Modeled on the viral
 * @mandarinwanda TikTok post format. Each entry teaches a single high-friction
 * slang pair that young people actually swap between languages.
 */
export const TIKTOK_CHINESE_SLANG: TikTokSlangMapping[] = [
  {
    english: 'LMAO',
    englishAka: 'LOL',
    chinese: '笑死我了',
    pinyin: 'xiào sǐ wǒ le',
    whenToUse: 'Text-chat reaction when something is outrageously funny. The hyperbole is the point — you\'re not literally dying.',
    example: {
      english: 'LMAO he did NOT just say that',
      chinese: '笑死我了，他不会真的那样说吧',
    },
    origin: 'Direct literal translation meaning "laughed to death." Works as SMS-length text the way LMAO does. The more common abbreviation is XSWL (from the pinyin 笑死我了 initials), used identically to LMAO on Weibo and Xiaohongshu.',
    altChinese: [
      { term: 'XSWL', pinyin: 'xiào sǐ wǒ le', note: 'Pinyin-initials abbreviation — the true Chinese LMAO equivalent' },
      { term: '蚌埠住了', pinyin: 'bèng bù zhù le', note: '"Can\'t hold it" — slightly newer, more about laugh-or-cry confusion' },
    ],
  },
  {
    english: 'gg',
    chinese: '寄',
    pinyin: 'jì',
    pronunciation: 'jee',
    whenToUse: 'Something is ruined, over, unrecoverable. "We\'re cooked." Lighter than a real loss.',
    example: {
      english: 'Got the wrong date on the exam. gg.',
      chinese: '考试日期记错了，寄。',
    },
    origin: 'Originally "好寄" (hǎo jì) from 寄了 meaning "sent/done." Gaming communities on Bilibili adopted it around 2020 as a pithy one-character equivalent of "gg" — partly because it looks similar to "寓" and "完" (done). The one-character brevity is the appeal.',
    altChinese: [
      { term: '完了', pinyin: 'wán le', note: '"It\'s over" — slightly more serious' },
      { term: '没救了', pinyin: 'méi jiù le', note: '"No saving it" — hyperbolic' },
    ],
  },
  {
    english: 'For real?',
    chinese: '真的假的',
    pinyin: 'zhēn de jiǎ de',
    whenToUse: 'Expressing disbelief at a surprising claim. Literally "real or fake?" — used the same way English speakers say "for real?" or "no way."',
    example: {
      english: 'He\'s dating Mia? For real?',
      chinese: '他和 Mia 在一起了？真的假的？',
    },
    origin: 'A classical Chinese construction (真假 real/fake) that evolved into modern colloquial use. Works across all Chinese-speaking regions and all ages — totally unmarked.',
  },
  {
    english: 'Ick',
    chinese: '下头',
    pinyin: 'xià tóu',
    pronunciation: 'sha toh',
    whenToUse: 'That sudden turn-off feeling — a crush did something cringe and you lost all attraction. Can also be used for any buzz-kill moment.',
    example: {
      english: 'He flexed his salary and I got the ick',
      chinese: '他炫耀工资，我真的下头',
    },
    origin: 'From 下头 literally "brings-head-down" — the visceral droop when something kills your vibe. Blew up on Xiaohongshu and Douyin around 2021 in dating-drama posts. Direct emotional parallel to English "ick."',
  },
  {
    english: 'GOAT',
    englishAka: 'G.O.A.T.',
    chinese: 'YYDS',
    pinyin: 'yǒng yuǎn de shén',
    whenToUse: '"Greatest of all time." Used for athletes, artists, food, moments — anything worthy of ultimate praise.',
    example: {
      english: 'This bubble tea is the GOAT',
      chinese: '这家奶茶 YYDS',
    },
    origin: 'Pinyin-initials of 永远的神 ("forever the god"). Originated in Chinese esports fandoms around 2017-2018, exploded mainstream during 2020-2021. Functions identically to English "GOAT" but used more broadly — applied to snacks, songs, boyfriends, weather.',
    altChinese: [
      { term: '永远的神', pinyin: 'yǒng yuǎn de shén', note: 'The full form of YYDS' },
    ],
  },
  {
    english: 'No cap',
    englishAka: 'no capping',
    chinese: '真没骗你',
    pinyin: 'zhēn méi piàn nǐ',
    whenToUse: '"I\'m not lying, this is real." Insisting on the truth of something unbelievable. Emphatic honesty.',
    example: {
      english: 'Her apartment has a rooftop pool, no cap',
      chinese: '她家公寓有屋顶泳池，真没骗你',
    },
    origin: 'Literally "truly didn\'t lie to you." Chinese doesn\'t have a direct one-word equivalent to "cap" — the meaning is carried through the phrase. 说真的 (shuō zhēn de, "speaking truly") is a shorter alternative.',
    altChinese: [
      { term: '说真的', pinyin: 'shuō zhēn de', note: '"Speaking truly" — shorter, same meaning' },
      { term: '我发誓', pinyin: 'wǒ fā shì', note: '"I swear" — stronger' },
    ],
  },
  {
    english: 'Main character energy',
    chinese: '女主气场 / 男主气场',
    pinyin: 'nǚ zhǔ qì chǎng / nán zhǔ qì chǎng',
    whenToUse: 'Compliment for someone radiating confidence like they\'re the protagonist of a drama. 女主 = female lead, 男主 = male lead.',
    example: {
      english: 'She walked in with main character energy',
      chinese: '她走进来那一刻真的是女主气场拉满',
    },
    origin: 'Literally "female lead aura" / "male lead aura." Blew up on Weibo around 2022 alongside the English TikTok trend. 气场 (aura) is a traditional Chinese concept — pairing it with 女主/男主 is the meme-ification.',
  },
  {
    english: 'WTF',
    chinese: '卧槽',
    pinyin: 'wò cáo',
    pronunciation: 'wuh-tsao',
    whenToUse: 'Exclamation of shock, disbelief, or frustration. Essentially a one-word reaction to anything WTF-worthy. Mild vulgarity — use with friends, not your boss.',
    example: {
      english: 'WTF did I just read',
      chinese: '卧槽，这是啥',
    },
    origin: 'Literally "lie grass" (卧=lie down, 槽=trough) — a deliberate mis-typing of a cruder 我操 (wǒ cào, "I f—"). The grass character makes it pass through text filters. Common in gaming and online chat. WOC is the shorter romanized version used in texting.',
    altChinese: [
      { term: 'WOC', pinyin: 'wò cáo', note: 'Romanized abbreviation used in texts' },
      { term: '卧了个草', pinyin: 'wò le ge cǎo', note: 'Extended playful form' },
    ],
  },
  {
    english: 'Sheesh',
    chinese: '牛逼',
    pinyin: 'niú bī',
    pronunciation: 'nyoo-bee',
    whenToUse: 'Expressing awed admiration. "Wow that\'s impressive." Mildly vulgar — 牛 (cow) is fine, adding 逼 kicks it up.',
    example: {
      english: 'Sheesh, you finished the whole marathon?',
      chinese: '牛逼，你跑完整个马拉松？',
    },
    origin: 'Literally "cow + vulgar slang." "Cow" (牛) has long meant "impressive" in Chinese; adding 逼 intensifies it. Extremely common in Chinese gaming/bro culture. The clean version is just 牛 (niú).',
    altChinese: [
      { term: '牛', pinyin: 'niú', note: '"Cow" — clean one-char version' },
      { term: 'NB', pinyin: 'niú bī', note: 'Text abbreviation' },
      { term: '绝绝子', pinyin: 'jué jué zi', note: 'More feminine-coded alternative' },
    ],
  },
  {
    english: 'Bet',
    chinese: 'OJBK',
    pinyin: 'OK jiù bái kāi',
    pronunciation: 'oh-jay-bee-kay',
    whenToUse: '"Sure, sounds good, I\'m in." Casual affirmative — agreeing with a plan or statement. Basically "bet" or "OK."',
    example: {
      english: 'Pregame at 9? — Bet',
      chinese: '九点开始喝？— OJBK',
    },
    origin: 'Stylized spelling combining "OK" with "就白开" (jiù bái kāi, "just plain water") — a meme-phrase from Chinese internet around 2018 meaning "fine, whatever, let\'s go." The exact origin is contested but the usage stuck. Treat it like "bet" or "say less."',
    altChinese: [
      { term: '11', pinyin: 'yī yī', note: 'Two "yes" strokes — even shorter' },
      { term: '冲', pinyin: 'chōng', note: '"Charge" — enthusiastic "let\'s go"' },
    ],
  },
  {
    english: 'Rizz',
    chinese: '魅力值',
    pinyin: 'mèi lì zhí',
    whenToUse: 'Charisma, game, the ability to charm someone into liking you. Literally "charm stat" — think video-game stat sheet.',
    example: {
      english: 'Bro\'s rizz is unmatched',
      chinese: '这哥们魅力值爆表',
    },
    origin: 'Literal = "charm value" — borrowed from RPG stat-sheet framing. Chinese internet tends to quantify social traits as "values" (气质值, 情商值, etc.). For the specific romantic/flirting angle, 撩 (liáo, "to flirt/tease") is the verb equivalent of "spitting rizz."',
    altChinese: [
      { term: '会撩', pinyin: 'huì liáo', note: '"Knows how to flirt" — the verb form' },
      { term: '情商高', pinyin: 'qíng shāng gāo', note: '"High EQ" — smoothness with people' },
    ],
  },
  {
    english: 'Delulu',
    chinese: '恋爱脑',
    pinyin: 'liàn ài nǎo',
    whenToUse: 'Romantically delusional — reading too much into texts, believing the crush likes them back when evidence says otherwise. "You\'re being delulu."',
    example: {
      english: 'She liked my story — I think we\'re dating now. — You\'re delulu.',
      chinese: '她给我的动态点赞了，我们应该是在一起了吧。— 你恋爱脑了。',
    },
    origin: 'Literal = "love-brain." Emerged on Weibo around 2020 describing the state of being so infatuated your logic shuts off. Closely related to the SBTI LOVE-R type. Stronger version: 恋爱脑晚期 ("terminal love-brain").',
    altChinese: [
      { term: '恋爱脑晚期', pinyin: 'liàn ài nǎo wǎn qī', note: 'Terminal delulu' },
      { term: '姨妈笑', pinyin: 'yí mā xiào', note: '"Auntie smile" — reading texts with starry eyes' },
    ],
  },
  {
    english: 'Slay',
    chinese: '绝绝子',
    pinyin: 'jué jué zi',
    pronunciation: 'juay-juay-dz',
    whenToUse: '"You ate that." Compliment for someone absolutely nailing it — outfit, performance, speech, tea. High-energy feminine-coded praise.',
    example: {
      english: 'Her makeup is slaying today',
      chinese: '她今天的妆容绝绝子',
    },
    origin: '绝 means "absolutely excellent/finished-off" — adding 绝子 makes it cutesy and amplified. Emerged on Xiaohongshu around 2021 among beauty/fashion influencers. The form 666 (liù liù liù, "666") is the bro-coded equivalent.',
    altChinese: [
      { term: '666', pinyin: 'liù liù liù', note: '"Awesome" — bro-coded, from gaming' },
      { term: '太赞了', pinyin: 'tài zàn le', note: '"Too praise-worthy" — cleaner version' },
      { term: '绝了', pinyin: 'jué le', note: 'Shorter form' },
    ],
  },
];
