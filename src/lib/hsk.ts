import fs from 'fs';
import path from 'path';

export type HSKEntry = {
  characters: string;
  pinyin: string;
  meaning: string;
  partOfSpeech: string;
  hskLevel: number;
  examples: string[];
  notes?: string;
};

export type TranslatedHSKEntry = HSKEntry & {
  originalMeaning: string;
};

export const HSK_LEVEL_DESCRIPTIONS: Record<number, { title: string; description: string; cefrLevel: string; wordCount: string }> = {
  1: {
    title: 'HSK 1 — Beginner',
    description: 'Basic greetings, numbers, dates, and simple daily phrases. You can introduce yourself and handle simple interactions.',
    cefrLevel: 'A1',
    wordCount: '150 words',
  },
  2: {
    title: 'HSK 2 — Elementary',
    description: 'Shopping, transportation, and basic conversations about daily routines. You can discuss familiar topics in simple terms.',
    cefrLevel: 'A2',
    wordCount: '300 words',
  },
  3: {
    title: 'HSK 3 — Intermediate',
    description: 'Travel, hobbies, and expressing opinions. You can handle most situations while traveling in China.',
    cefrLevel: 'B1',
    wordCount: '600 words',
  },
  4: {
    title: 'HSK 4 — Upper Intermediate',
    description: 'Abstract topics, news, and professional discussions. You can converse fluently with native speakers on a wide range of topics.',
    cefrLevel: 'B2',
    wordCount: '1,200 words',
  },
  5: {
    title: 'HSK 5 — Advanced',
    description: 'Complex texts, formal writing, and nuanced expression. You can read Chinese newspapers and give structured speeches.',
    cefrLevel: 'C1',
    wordCount: '2,500 words',
  },
  6: {
    title: 'HSK 6 — Mastery',
    description: 'Near-native comprehension, academic writing, and subtle cultural expression. You can express yourself effortlessly in any situation.',
    cefrLevel: 'C2',
    wordCount: '5,000+ words',
  },
};

export const hskEntries: HSKEntry[] = [
  // HSK 1 — 30 words
  { characters: '你好', pinyin: 'nǐ hǎo', meaning: 'Hello', partOfSpeech: 'phrase', hskLevel: 1, examples: ['你好，我叫小明。(Hello, my name is Xiao Ming.)'] },
  { characters: '谢谢', pinyin: 'xiè xie', meaning: 'Thank you', partOfSpeech: 'verb', hskLevel: 1, examples: ['谢谢你的帮助。(Thank you for your help.)'] },
  { characters: '再见', pinyin: 'zài jiàn', meaning: 'Goodbye', partOfSpeech: 'phrase', hskLevel: 1, examples: ['明天见，再见！(See you tomorrow, goodbye!)'] },
  { characters: '是', pinyin: 'shì', meaning: 'To be / Yes', partOfSpeech: 'verb', hskLevel: 1, examples: ['我是学生。(I am a student.)'] },
  { characters: '不', pinyin: 'bù', meaning: 'Not / No', partOfSpeech: 'adverb', hskLevel: 1, examples: ['我不喝咖啡。(I don\'t drink coffee.)'] },
  { characters: '我', pinyin: 'wǒ', meaning: 'I / Me', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['我很高兴。(I am very happy.)'] },
  { characters: '他', pinyin: 'tā', meaning: 'He / Him', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['他是我朋友。(He is my friend.)'] },
  { characters: '她', pinyin: 'tā', meaning: 'She / Her', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['她很漂亮。(She is very beautiful.)'] },
  { characters: '好', pinyin: 'hǎo', meaning: 'Good / Well', partOfSpeech: 'adjective', hskLevel: 1, examples: ['今天天气很好。(The weather is great today.)'] },
  { characters: '大', pinyin: 'dà', meaning: 'Big / Large', partOfSpeech: 'adjective', hskLevel: 1, examples: ['这个房间很大。(This room is very big.)'] },
  { characters: '小', pinyin: 'xiǎo', meaning: 'Small / Little', partOfSpeech: 'adjective', hskLevel: 1, examples: ['我有一只小猫。(I have a small cat.)'] },
  { characters: '吃', pinyin: 'chī', meaning: 'To eat', partOfSpeech: 'verb', hskLevel: 1, examples: ['我们去吃饭吧。(Let\'s go eat.)'] },
  { characters: '喝', pinyin: 'hē', meaning: 'To drink', partOfSpeech: 'verb', hskLevel: 1, examples: ['你想喝什么？(What would you like to drink?)'] },
  { characters: '看', pinyin: 'kàn', meaning: 'To look / To watch', partOfSpeech: 'verb', hskLevel: 1, examples: ['我们看电影吧。(Let\'s watch a movie.)'] },
  { characters: '听', pinyin: 'tīng', meaning: 'To listen', partOfSpeech: 'verb', hskLevel: 1, examples: ['我喜欢听音乐。(I like listening to music.)'] },
  { characters: '说', pinyin: 'shuō', meaning: 'To speak / To say', partOfSpeech: 'verb', hskLevel: 1, examples: ['你会说中文吗？(Can you speak Chinese?)'] },
  { characters: '读', pinyin: 'dú', meaning: 'To read', partOfSpeech: 'verb', hskLevel: 1, examples: ['我每天读书。(I read every day.)'] },
  { characters: '写', pinyin: 'xiě', meaning: 'To write', partOfSpeech: 'verb', hskLevel: 1, examples: ['请写你的名字。(Please write your name.)'] },
  { characters: '学', pinyin: 'xué', meaning: 'To study / To learn', partOfSpeech: 'verb', hskLevel: 1, examples: ['我在学中文。(I am studying Chinese.)'] },
  { characters: '朋友', pinyin: 'péng you', meaning: 'Friend', partOfSpeech: 'noun', hskLevel: 1, examples: ['他是我的好朋友。(He is my good friend.)'] },
  { characters: '家', pinyin: 'jiā', meaning: 'Home / Family', partOfSpeech: 'noun', hskLevel: 1, examples: ['欢迎来我家。(Welcome to my home.)'] },
  { characters: '水', pinyin: 'shuǐ', meaning: 'Water', partOfSpeech: 'noun', hskLevel: 1, examples: ['请给我一杯水。(Please give me a glass of water.)'] },
  { characters: '钱', pinyin: 'qián', meaning: 'Money', partOfSpeech: 'noun', hskLevel: 1, examples: ['这个多少钱？(How much is this?)'] },
  { characters: '今天', pinyin: 'jīn tiān', meaning: 'Today', partOfSpeech: 'noun', hskLevel: 1, examples: ['今天星期几？(What day is today?)'] },
  { characters: '明天', pinyin: 'míng tiān', meaning: 'Tomorrow', partOfSpeech: 'noun', hskLevel: 1, examples: ['明天我们去公园。(Tomorrow we go to the park.)'] },
  { characters: '昨天', pinyin: 'zuó tiān', meaning: 'Yesterday', partOfSpeech: 'noun', hskLevel: 1, examples: ['昨天下雨了。(It rained yesterday.)'] },
  { characters: '多少', pinyin: 'duō shǎo', meaning: 'How much / How many', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['你多少岁？(How old are you?)'] },
  { characters: '什么', pinyin: 'shén me', meaning: 'What', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['你叫什么名字？(What is your name?)'] },
  { characters: '哪里', pinyin: 'nǎ lǐ', meaning: 'Where', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['你住在哪里？(Where do you live?)'] },
  { characters: '谁', pinyin: 'shéi', meaning: 'Who', partOfSpeech: 'pronoun', hskLevel: 1, examples: ['这是谁？(Who is this?)'] },

  // HSK 2 — 30 words
  { characters: '因为', pinyin: 'yīn wèi', meaning: 'Because', partOfSpeech: 'conjunction', hskLevel: 2, examples: ['因为下雨，所以我没去。(Because it rained, I didn\'t go.)'] },
  { characters: '所以', pinyin: 'suǒ yǐ', meaning: 'So / Therefore', partOfSpeech: 'conjunction', hskLevel: 2, examples: ['他病了，所以没来。(He\'s sick, so he didn\'t come.)'] },
  { characters: '但是', pinyin: 'dàn shì', meaning: 'But / However', partOfSpeech: 'conjunction', hskLevel: 2, examples: ['贵，但是很好吃。(Expensive, but very delicious.)'] },
  { characters: '已经', pinyin: 'yǐ jīng', meaning: 'Already', partOfSpeech: 'adverb', hskLevel: 2, examples: ['我已经吃过了。(I have already eaten.)'] },
  { characters: '可以', pinyin: 'kě yǐ', meaning: 'Can / May', partOfSpeech: 'verb', hskLevel: 2, examples: ['我可以进来吗？(May I come in?)'] },
  { characters: '快', pinyin: 'kuài', meaning: 'Fast / Quick', partOfSpeech: 'adjective', hskLevel: 2, examples: ['你走得太快了。(You walk too fast.)'] },
  { characters: '慢', pinyin: 'màn', meaning: 'Slow', partOfSpeech: 'adjective', hskLevel: 2, examples: ['请说慢一点。(Please speak slower.)'] },
  { characters: '忙', pinyin: 'máng', meaning: 'Busy', partOfSpeech: 'adjective', hskLevel: 2, examples: ['最近我很忙。(I\'ve been busy recently.)'] },
  { characters: '远', pinyin: 'yuǎn', meaning: 'Far', partOfSpeech: 'adjective', hskLevel: 2, examples: ['学校离这里很远。(The school is far from here.)'] },
  { characters: '近', pinyin: 'jìn', meaning: 'Near / Close', partOfSpeech: 'adjective', hskLevel: 2, examples: ['超市离我家很近。(The supermarket is close to my home.)'] },
  { characters: '帮助', pinyin: 'bāng zhù', meaning: 'To help', partOfSpeech: 'verb', hskLevel: 2, examples: ['谢谢你帮助我。(Thank you for helping me.)'] },
  { characters: '准备', pinyin: 'zhǔn bèi', meaning: 'To prepare', partOfSpeech: 'verb', hskLevel: 2, examples: ['你准备好了吗？(Are you ready?)'] },
  { characters: '开始', pinyin: 'kāi shǐ', meaning: 'To begin / To start', partOfSpeech: 'verb', hskLevel: 2, examples: ['比赛开始了。(The game has started.)'] },
  { characters: '知道', pinyin: 'zhī dào', meaning: 'To know', partOfSpeech: 'verb', hskLevel: 2, examples: ['我不知道。(I don\'t know.)'] },
  { characters: '觉得', pinyin: 'jué de', meaning: 'To think / To feel', partOfSpeech: 'verb', hskLevel: 2, examples: ['你觉得怎么样？(What do you think?)'] },
  { characters: '希望', pinyin: 'xī wàng', meaning: 'To hope / Hope', partOfSpeech: 'verb', hskLevel: 2, examples: ['我希望明天天气好。(I hope the weather is good tomorrow.)'] },
  { characters: '旁边', pinyin: 'páng biān', meaning: 'Beside / Next to', partOfSpeech: 'noun', hskLevel: 2, examples: ['银行在超市旁边。(The bank is next to the supermarket.)'] },
  { characters: '机场', pinyin: 'jī chǎng', meaning: 'Airport', partOfSpeech: 'noun', hskLevel: 2, examples: ['去机场要多久？(How long does it take to get to the airport?)'] },
  { characters: '地铁', pinyin: 'dì tiě', meaning: 'Subway / Metro', partOfSpeech: 'noun', hskLevel: 2, examples: ['我坐地铁去上班。(I take the subway to work.)'] },
  { characters: '手机', pinyin: 'shǒu jī', meaning: 'Mobile phone', partOfSpeech: 'noun', hskLevel: 2, examples: ['我的手机没电了。(My phone is out of battery.)'] },
  { characters: '生日', pinyin: 'shēng rì', meaning: 'Birthday', partOfSpeech: 'noun', hskLevel: 2, examples: ['生日快乐！(Happy birthday!)'] },
  { characters: '身体', pinyin: 'shēn tǐ', meaning: 'Body / Health', partOfSpeech: 'noun', hskLevel: 2, examples: ['注意身体。(Take care of your health.)'] },
  { characters: '眼睛', pinyin: 'yǎn jīng', meaning: 'Eye(s)', partOfSpeech: 'noun', hskLevel: 2, examples: ['她的眼睛很漂亮。(Her eyes are very beautiful.)'] },
  { characters: '虽然', pinyin: 'suī rán', meaning: 'Although', partOfSpeech: 'conjunction', hskLevel: 2, examples: ['虽然很累，但我很开心。(Although tired, I\'m very happy.)'] },
  { characters: '还是', pinyin: 'hái shì', meaning: 'Or / Still', partOfSpeech: 'conjunction', hskLevel: 2, examples: ['你喝茶还是咖啡？(Do you drink tea or coffee?)'] },
  { characters: '一起', pinyin: 'yī qǐ', meaning: 'Together', partOfSpeech: 'adverb', hskLevel: 2, examples: ['我们一起去吧。(Let\'s go together.)'] },
  { characters: '经常', pinyin: 'jīng cháng', meaning: 'Often / Frequently', partOfSpeech: 'adverb', hskLevel: 2, examples: ['我经常运动。(I exercise often.)'] },
  { characters: '非常', pinyin: 'fēi cháng', meaning: 'Very / Extremely', partOfSpeech: 'adverb', hskLevel: 2, examples: ['非常感谢！(Thank you very much!)'] },
  { characters: '可能', pinyin: 'kě néng', meaning: 'Maybe / Possible', partOfSpeech: 'adverb', hskLevel: 2, examples: ['明天可能下雨。(It might rain tomorrow.)'] },
  { characters: '一定', pinyin: 'yī dìng', meaning: 'Definitely / Must', partOfSpeech: 'adverb', hskLevel: 2, examples: ['你一定会成功。(You will definitely succeed.)'] },

  // HSK 3 — 30 words
  { characters: '关系', pinyin: 'guān xì', meaning: 'Relationship / Connection', partOfSpeech: 'noun', hskLevel: 3, examples: ['没关系。(It doesn\'t matter / No worries.)'] },
  { characters: '环境', pinyin: 'huán jìng', meaning: 'Environment', partOfSpeech: 'noun', hskLevel: 3, examples: ['我们要保护环境。(We must protect the environment.)'] },
  { characters: '经验', pinyin: 'jīng yàn', meaning: 'Experience', partOfSpeech: 'noun', hskLevel: 3, examples: ['你有工作经验吗？(Do you have work experience?)'] },
  { characters: '机会', pinyin: 'jī huì', meaning: 'Opportunity / Chance', partOfSpeech: 'noun', hskLevel: 3, examples: ['这是一个好机会。(This is a good opportunity.)'] },
  { characters: '选择', pinyin: 'xuǎn zé', meaning: 'To choose / Choice', partOfSpeech: 'verb', hskLevel: 3, examples: ['你选择哪个？(Which one do you choose?)'] },
  { characters: '决定', pinyin: 'jué dìng', meaning: 'To decide / Decision', partOfSpeech: 'verb', hskLevel: 3, examples: ['我决定去中国。(I decided to go to China.)'] },
  { characters: '影响', pinyin: 'yǐng xiǎng', meaning: 'To influence / Influence', partOfSpeech: 'verb', hskLevel: 3, examples: ['天气影响了我的心情。(The weather influenced my mood.)'] },
  { characters: '比较', pinyin: 'bǐ jiào', meaning: 'Relatively / To compare', partOfSpeech: 'adverb', hskLevel: 3, examples: ['今天比较冷。(It\'s relatively cold today.)'] },
  { characters: '特别', pinyin: 'tè bié', meaning: 'Especially / Special', partOfSpeech: 'adverb', hskLevel: 3, examples: ['这道菜特别好吃。(This dish is especially delicious.)'] },
  { characters: '其实', pinyin: 'qí shí', meaning: 'Actually / In fact', partOfSpeech: 'adverb', hskLevel: 3, examples: ['其实我也不知道。(Actually, I don\'t know either.)'] },
  { characters: '终于', pinyin: 'zhōng yú', meaning: 'Finally / At last', partOfSpeech: 'adverb', hskLevel: 3, examples: ['我终于找到了！(I finally found it!)'] },
  { characters: '感觉', pinyin: 'gǎn jué', meaning: 'Feeling / To feel', partOfSpeech: 'noun', hskLevel: 3, examples: ['我感觉不太舒服。(I feel a bit unwell.)'] },
  { characters: '解决', pinyin: 'jiě jué', meaning: 'To solve / To resolve', partOfSpeech: 'verb', hskLevel: 3, examples: ['问题解决了。(The problem is solved.)'] },
  { characters: '讨论', pinyin: 'tǎo lùn', meaning: 'To discuss', partOfSpeech: 'verb', hskLevel: 3, examples: ['我们来讨论这个问题。(Let\'s discuss this issue.)'] },
  { characters: '练习', pinyin: 'liàn xí', meaning: 'To practice / Exercise', partOfSpeech: 'verb', hskLevel: 3, examples: ['多练习就会进步。(More practice leads to improvement.)'] },
  { characters: '提高', pinyin: 'tí gāo', meaning: 'To improve / To raise', partOfSpeech: 'verb', hskLevel: 3, examples: ['我要提高中文水平。(I want to improve my Chinese level.)'] },
  { characters: '接受', pinyin: 'jiē shòu', meaning: 'To accept', partOfSpeech: 'verb', hskLevel: 3, examples: ['我接受你的建议。(I accept your suggestion.)'] },
  { characters: '参加', pinyin: 'cān jiā', meaning: 'To participate / To join', partOfSpeech: 'verb', hskLevel: 3, examples: ['你要参加比赛吗？(Are you going to join the competition?)'] },
  { characters: '了解', pinyin: 'liǎo jiě', meaning: 'To understand / To know about', partOfSpeech: 'verb', hskLevel: 3, examples: ['我想了解中国文化。(I want to learn about Chinese culture.)'] },
  { characters: '注意', pinyin: 'zhù yì', meaning: 'To pay attention / Be careful', partOfSpeech: 'verb', hskLevel: 3, examples: ['请注意安全。(Please pay attention to safety.)'] },
  { characters: '打算', pinyin: 'dǎ suàn', meaning: 'To plan / To intend', partOfSpeech: 'verb', hskLevel: 3, examples: ['你打算什么时候去？(When do you plan to go?)'] },
  { characters: '根据', pinyin: 'gēn jù', meaning: 'According to / Based on', partOfSpeech: 'preposition', hskLevel: 3, examples: ['根据天气预报，明天会下雨。(According to the forecast, it will rain tomorrow.)'] },
  { characters: '或者', pinyin: 'huò zhě', meaning: 'Or (in statements)', partOfSpeech: 'conjunction', hskLevel: 3, examples: ['你可以坐公交或者地铁。(You can take the bus or the subway.)'] },
  { characters: '只要', pinyin: 'zhǐ yào', meaning: 'As long as', partOfSpeech: 'conjunction', hskLevel: 3, examples: ['只要努力就会成功。(As long as you work hard, you will succeed.)'] },
  { characters: '无论', pinyin: 'wú lùn', meaning: 'No matter / Regardless', partOfSpeech: 'conjunction', hskLevel: 3, examples: ['无论如何我都支持你。(No matter what, I support you.)'] },
  { characters: '态度', pinyin: 'tài dù', meaning: 'Attitude', partOfSpeech: 'noun', hskLevel: 3, examples: ['态度决定一切。(Attitude determines everything.)'] },
  { characters: '需要', pinyin: 'xū yào', meaning: 'To need / Needs', partOfSpeech: 'verb', hskLevel: 3, examples: ['我需要你的帮助。(I need your help.)'] },
  { characters: '应该', pinyin: 'yīng gāi', meaning: 'Should / Ought to', partOfSpeech: 'verb', hskLevel: 3, examples: ['你应该多休息。(You should rest more.)'] },
  { characters: '满意', pinyin: 'mǎn yì', meaning: 'Satisfied', partOfSpeech: 'adjective', hskLevel: 3, examples: ['我对结果很满意。(I\'m very satisfied with the result.)'] },
  { characters: '普通', pinyin: 'pǔ tōng', meaning: 'Ordinary / Common', partOfSpeech: 'adjective', hskLevel: 3, examples: ['我是一个普通人。(I\'m an ordinary person.)'] },

  // HSK 4 — 30 words
  { characters: '道歉', pinyin: 'dào qiàn', meaning: 'To apologize', partOfSpeech: 'verb', hskLevel: 4, examples: ['我应该向你道歉。(I should apologize to you.)'] },
  { characters: '建议', pinyin: 'jiàn yì', meaning: 'To suggest / Suggestion', partOfSpeech: 'verb', hskLevel: 4, examples: ['我建议你多运动。(I suggest you exercise more.)'] },
  { characters: '表达', pinyin: 'biǎo dá', meaning: 'To express', partOfSpeech: 'verb', hskLevel: 4, examples: ['我不知道怎么表达。(I don\'t know how to express it.)'] },
  { characters: '交流', pinyin: 'jiāo liú', meaning: 'To communicate / Exchange', partOfSpeech: 'verb', hskLevel: 4, examples: ['我们需要多交流。(We need to communicate more.)'] },
  { characters: '证明', pinyin: 'zhèng míng', meaning: 'To prove / Proof', partOfSpeech: 'verb', hskLevel: 4, examples: ['事实证明他是对的。(Facts proved he was right.)'] },
  { characters: '丰富', pinyin: 'fēng fù', meaning: 'Rich / Abundant', partOfSpeech: 'adjective', hskLevel: 4, examples: ['中国文化非常丰富。(Chinese culture is very rich.)'] },
  { characters: '复杂', pinyin: 'fù zá', meaning: 'Complex / Complicated', partOfSpeech: 'adjective', hskLevel: 4, examples: ['这个问题很复杂。(This problem is very complex.)'] },
  { characters: '骄傲', pinyin: 'jiāo ào', meaning: 'Proud / Pride', partOfSpeech: 'adjective', hskLevel: 4, examples: ['我为你感到骄傲。(I\'m proud of you.)'] },
  { characters: '积极', pinyin: 'jī jí', meaning: 'Active / Positive', partOfSpeech: 'adjective', hskLevel: 4, examples: ['要保持积极的态度。(Keep a positive attitude.)'] },
  { characters: '困难', pinyin: 'kùn nán', meaning: 'Difficulty / Difficult', partOfSpeech: 'adjective', hskLevel: 4, examples: ['别怕困难。(Don\'t be afraid of difficulties.)'] },
  { characters: '温柔', pinyin: 'wēn róu', meaning: 'Gentle / Tender', partOfSpeech: 'adjective', hskLevel: 4, examples: ['她很温柔。(She is very gentle.)'] },
  { characters: '诚实', pinyin: 'chéng shí', meaning: 'Honest', partOfSpeech: 'adjective', hskLevel: 4, examples: ['做人要诚实。(One should be honest.)'] },
  { characters: '感动', pinyin: 'gǎn dòng', meaning: 'To be moved / Touching', partOfSpeech: 'verb', hskLevel: 4, examples: ['这个故事很感动。(This story is very touching.)'] },
  { characters: '误会', pinyin: 'wù huì', meaning: 'Misunderstanding', partOfSpeech: 'noun', hskLevel: 4, examples: ['这是一个误会。(This is a misunderstanding.)'] },
  { characters: '效果', pinyin: 'xiào guǒ', meaning: 'Effect / Result', partOfSpeech: 'noun', hskLevel: 4, examples: ['效果很好。(The effect is very good.)'] },
  { characters: '即使', pinyin: 'jí shǐ', meaning: 'Even if', partOfSpeech: 'conjunction', hskLevel: 4, examples: ['即使失败也不放弃。(Even if I fail, I won\'t give up.)'] },
  { characters: '否则', pinyin: 'fǒu zé', meaning: 'Otherwise', partOfSpeech: 'conjunction', hskLevel: 4, examples: ['快点，否则会迟到。(Hurry up, otherwise we\'ll be late.)'] },
  { characters: '既然', pinyin: 'jì rán', meaning: 'Since / Now that', partOfSpeech: 'conjunction', hskLevel: 4, examples: ['既然来了，就留下吧。(Since you\'re here, stay.)'] },
  { characters: '尽管', pinyin: 'jǐn guǎn', meaning: 'Despite / Even though', partOfSpeech: 'conjunction', hskLevel: 4, examples: ['尽管很难，我也要试。(Despite the difficulty, I\'ll try.)'] },
  { characters: '原来', pinyin: 'yuán lái', meaning: 'Originally / So that\'s how it is', partOfSpeech: 'adverb', hskLevel: 4, examples: ['原来是你！(So it was you!)'] },
  { characters: '竟然', pinyin: 'jìng rán', meaning: 'Unexpectedly / To one\'s surprise', partOfSpeech: 'adverb', hskLevel: 4, examples: ['他竟然会说中文！(He can speak Chinese, surprisingly!)'] },
  { characters: '逐渐', pinyin: 'zhú jiàn', meaning: 'Gradually', partOfSpeech: 'adverb', hskLevel: 4, examples: ['天气逐渐变暖了。(The weather is gradually getting warmer.)'] },
  { characters: '幸福', pinyin: 'xìng fú', meaning: 'Happy / Blessed', partOfSpeech: 'adjective', hskLevel: 4, examples: ['祝你幸福！(Wishing you happiness!)'] },
  { characters: '勇敢', pinyin: 'yǒng gǎn', meaning: 'Brave / Courageous', partOfSpeech: 'adjective', hskLevel: 4, examples: ['你要勇敢面对。(You must bravely face it.)'] },
  { characters: '尊重', pinyin: 'zūn zhòng', meaning: 'To respect / Respect', partOfSpeech: 'verb', hskLevel: 4, examples: ['要尊重别人。(Respect others.)'] },
  { characters: '责任', pinyin: 'zé rèn', meaning: 'Responsibility', partOfSpeech: 'noun', hskLevel: 4, examples: ['这是我的责任。(This is my responsibility.)'] },
  { characters: '经济', pinyin: 'jīng jì', meaning: 'Economy / Economic', partOfSpeech: 'noun', hskLevel: 4, examples: ['中国经济发展很快。(China\'s economy is developing rapidly.)'] },
  { characters: '传统', pinyin: 'chuán tǒng', meaning: 'Tradition / Traditional', partOfSpeech: 'noun', hskLevel: 4, examples: ['这是中国的传统文化。(This is traditional Chinese culture.)'] },
  { characters: '暂时', pinyin: 'zàn shí', meaning: 'Temporarily', partOfSpeech: 'adverb', hskLevel: 4, examples: ['我暂时没有计划。(I don\'t have plans temporarily.)'] },
  { characters: '充分', pinyin: 'chōng fèn', meaning: 'Fully / Ample', partOfSpeech: 'adjective', hskLevel: 4, examples: ['做好充分的准备。(Be fully prepared.)'] },

  // HSK 5 — 30 words
  { characters: '辩论', pinyin: 'biàn lùn', meaning: 'To debate / Debate', partOfSpeech: 'verb', hskLevel: 5, examples: ['大学生辩论赛很精彩。(The university debate competition was brilliant.)'] },
  { characters: '沟通', pinyin: 'gōu tōng', meaning: 'To communicate', partOfSpeech: 'verb', hskLevel: 5, examples: ['有效沟通很重要。(Effective communication is important.)'] },
  { characters: '协调', pinyin: 'xié tiáo', meaning: 'To coordinate', partOfSpeech: 'verb', hskLevel: 5, examples: ['我来协调各方面。(I\'ll coordinate all aspects.)'] },
  { characters: '贡献', pinyin: 'gòng xiàn', meaning: 'Contribution / To contribute', partOfSpeech: 'noun', hskLevel: 5, examples: ['他做出了巨大贡献。(He made a huge contribution.)'] },
  { characters: '素质', pinyin: 'sù zhì', meaning: 'Quality / Caliber (of a person)', partOfSpeech: 'noun', hskLevel: 5, examples: ['提高个人素质很重要。(Improving personal quality is important.)'] },
  { characters: '弥补', pinyin: 'mí bǔ', meaning: 'To make up for / To compensate', partOfSpeech: 'verb', hskLevel: 5, examples: ['用行动弥补过错。(Make up for mistakes with actions.)'] },
  { characters: '独特', pinyin: 'dú tè', meaning: 'Unique / Distinctive', partOfSpeech: 'adjective', hskLevel: 5, examples: ['这个地方很独特。(This place is very unique.)'] },
  { characters: '显然', pinyin: 'xiǎn rán', meaning: 'Obviously / Evidently', partOfSpeech: 'adverb', hskLevel: 5, examples: ['显然他说的不对。(Obviously what he said is wrong.)'] },
  { characters: '深刻', pinyin: 'shēn kè', meaning: 'Profound / Deep', partOfSpeech: 'adjective', hskLevel: 5, examples: ['这本书意义深刻。(This book has profound meaning.)'] },
  { characters: '频繁', pinyin: 'pín fán', meaning: 'Frequent', partOfSpeech: 'adjective', hskLevel: 5, examples: ['最近加班太频繁了。(Overtime has been too frequent recently.)'] },
  { characters: '承担', pinyin: 'chéng dān', meaning: 'To bear / To undertake', partOfSpeech: 'verb', hskLevel: 5, examples: ['我愿意承担责任。(I\'m willing to bear the responsibility.)'] },
  { characters: '保持', pinyin: 'bǎo chí', meaning: 'To maintain / To keep', partOfSpeech: 'verb', hskLevel: 5, examples: ['保持冷静。(Stay calm.)'] },
  { characters: '促进', pinyin: 'cù jìn', meaning: 'To promote / To facilitate', partOfSpeech: 'verb', hskLevel: 5, examples: ['运动促进健康。(Exercise promotes health.)'] },
  { characters: '反映', pinyin: 'fǎn yìng', meaning: 'To reflect / To report', partOfSpeech: 'verb', hskLevel: 5, examples: ['这反映了社会问题。(This reflects social issues.)'] },
  { characters: '目前', pinyin: 'mù qián', meaning: 'At present / Currently', partOfSpeech: 'adverb', hskLevel: 5, examples: ['目前情况还不错。(The current situation is not bad.)'] },
  { characters: '合理', pinyin: 'hé lǐ', meaning: 'Reasonable / Rational', partOfSpeech: 'adjective', hskLevel: 5, examples: ['这个价格很合理。(This price is very reasonable.)'] },
  { characters: '灵活', pinyin: 'líng huó', meaning: 'Flexible / Agile', partOfSpeech: 'adjective', hskLevel: 5, examples: ['工作时间比较灵活。(Working hours are relatively flexible.)'] },
  { characters: '本质', pinyin: 'běn zhì', meaning: 'Essence / Nature', partOfSpeech: 'noun', hskLevel: 5, examples: ['问题的本质是什么？(What is the essence of the problem?)'] },
  { characters: '趋势', pinyin: 'qū shì', meaning: 'Trend / Tendency', partOfSpeech: 'noun', hskLevel: 5, examples: ['这是未来的趋势。(This is the trend of the future.)'] },
  { characters: '领域', pinyin: 'lǐng yù', meaning: 'Field / Domain', partOfSpeech: 'noun', hskLevel: 5, examples: ['他在科技领域很有名。(He is famous in the technology field.)'] },
  { characters: '具备', pinyin: 'jù bèi', meaning: 'To possess / To have', partOfSpeech: 'verb', hskLevel: 5, examples: ['他具备领导能力。(He possesses leadership ability.)'] },
  { characters: '克服', pinyin: 'kè fú', meaning: 'To overcome', partOfSpeech: 'verb', hskLevel: 5, examples: ['克服困难，继续前进。(Overcome difficulties and keep going.)'] },
  { characters: '恢复', pinyin: 'huī fù', meaning: 'To recover / To restore', partOfSpeech: 'verb', hskLevel: 5, examples: ['他已经恢复健康了。(He has recovered his health.)'] },
  { characters: '形成', pinyin: 'xíng chéng', meaning: 'To form / To take shape', partOfSpeech: 'verb', hskLevel: 5, examples: ['慢慢形成了习惯。(Gradually formed a habit.)'] },
  { characters: '实践', pinyin: 'shí jiàn', meaning: 'Practice / To put into practice', partOfSpeech: 'noun', hskLevel: 5, examples: ['理论要与实践结合。(Theory should combine with practice.)'] },
  { characters: '规模', pinyin: 'guī mó', meaning: 'Scale / Scope', partOfSpeech: 'noun', hskLevel: 5, examples: ['公司规模越来越大。(The company\'s scale is growing.)'] },
  { characters: '必然', pinyin: 'bì rán', meaning: 'Inevitable / Certainly', partOfSpeech: 'adverb', hskLevel: 5, examples: ['努力必然有回报。(Hard work inevitably pays off.)'] },
  { characters: '大概', pinyin: 'dà gài', meaning: 'Roughly / Probably', partOfSpeech: 'adverb', hskLevel: 5, examples: ['大概需要两个小时。(It takes roughly two hours.)'] },
  { characters: '从而', pinyin: 'cóng ér', meaning: 'Thereby / Thus', partOfSpeech: 'conjunction', hskLevel: 5, examples: ['努力学习，从而取得好成绩。(Study hard, thereby achieving good grades.)'] },
  { characters: '何况', pinyin: 'hé kuàng', meaning: 'Let alone / Not to mention', partOfSpeech: 'conjunction', hskLevel: 5, examples: ['大人都做不到，何况小孩。(Adults can\'t do it, let alone children.)'] },

  // HSK 6 — 30 words
  { characters: '抽象', pinyin: 'chōu xiàng', meaning: 'Abstract', partOfSpeech: 'adjective', hskLevel: 6, examples: ['这幅画很抽象。(This painting is very abstract.)'] },
  { characters: '含蓄', pinyin: 'hán xù', meaning: 'Implicit / Reserved', partOfSpeech: 'adjective', hskLevel: 6, examples: ['中国人表达感情比较含蓄。(Chinese people express feelings in a reserved way.)'] },
  { characters: '陌生', pinyin: 'mò shēng', meaning: 'Strange / Unfamiliar', partOfSpeech: 'adjective', hskLevel: 6, examples: ['我对这里很陌生。(I\'m very unfamiliar with this place.)'] },
  { characters: '微妙', pinyin: 'wēi miào', meaning: 'Subtle / Delicate', partOfSpeech: 'adjective', hskLevel: 6, examples: ['两人的关系很微妙。(The relationship between them is subtle.)'] },
  { characters: '渊博', pinyin: 'yuān bó', meaning: 'Erudite / Profound (knowledge)', partOfSpeech: 'adjective', hskLevel: 6, examples: ['他的知识非常渊博。(His knowledge is very profound.)'] },
  { characters: '憧憬', pinyin: 'chōng jǐng', meaning: 'To look forward to / Yearning', partOfSpeech: 'verb', hskLevel: 6, examples: ['她对未来充满憧憬。(She is full of yearning for the future.)'] },
  { characters: '揣摩', pinyin: 'chuǎi mó', meaning: 'To ponder / To try to figure out', partOfSpeech: 'verb', hskLevel: 6, examples: ['我在揣摩他的意思。(I\'m trying to figure out what he means.)'] },
  { characters: '陶醉', pinyin: 'táo zuì', meaning: 'To be intoxicated (with joy)', partOfSpeech: 'verb', hskLevel: 6, examples: ['她陶醉在音乐中。(She was intoxicated by the music.)'] },
  { characters: '领悟', pinyin: 'lǐng wù', meaning: 'To comprehend / To grasp', partOfSpeech: 'verb', hskLevel: 6, examples: ['我终于领悟了这个道理。(I finally grasped this truth.)'] },
  { characters: '钻研', pinyin: 'zuān yán', meaning: 'To study intensively / To delve into', partOfSpeech: 'verb', hskLevel: 6, examples: ['他钻研了多年。(He studied it intensively for many years.)'] },
  { characters: '洞察', pinyin: 'dòng chá', meaning: 'Insight / To see through', partOfSpeech: 'verb', hskLevel: 6, examples: ['他对人性有深刻的洞察。(He has profound insight into human nature.)'] },
  { characters: '弘扬', pinyin: 'hóng yáng', meaning: 'To promote / To carry forward', partOfSpeech: 'verb', hskLevel: 6, examples: ['弘扬传统文化。(Promote traditional culture.)'] },
  { characters: '典故', pinyin: 'diǎn gù', meaning: 'Classical allusion / Historical anecdote', partOfSpeech: 'noun', hskLevel: 6, examples: ['成语背后都有一个典故。(Every idiom has a classical allusion behind it.)'], notes: 'Commonly used when discussing the origin of Chinese idioms.' },
  { characters: '内涵', pinyin: 'nèi hán', meaning: 'Connotation / Inner meaning', partOfSpeech: 'noun', hskLevel: 6, examples: ['这首诗内涵丰富。(This poem has rich connotations.)'] },
  { characters: '素养', pinyin: 'sù yǎng', meaning: 'Cultivation / Accomplishment', partOfSpeech: 'noun', hskLevel: 6, examples: ['提高文化素养。(Improve cultural cultivation.)'] },
  { characters: '底蕴', pinyin: 'dǐ yùn', meaning: 'Cultural heritage / Inner depth', partOfSpeech: 'noun', hskLevel: 6, examples: ['这个城市有深厚的文化底蕴。(This city has deep cultural heritage.)'] },
  { characters: '格局', pinyin: 'gé jú', meaning: 'Pattern / Layout / Vision', partOfSpeech: 'noun', hskLevel: 6, examples: ['要有大格局。(One should have a big-picture vision.)'] },
  { characters: '境界', pinyin: 'jìng jiè', meaning: 'Realm / Level of attainment', partOfSpeech: 'noun', hskLevel: 6, examples: ['这是人生的最高境界。(This is the highest realm of life.)'] },
  { characters: '精髓', pinyin: 'jīng suǐ', meaning: 'Essence / Quintessence', partOfSpeech: 'noun', hskLevel: 6, examples: ['学到了中国文化的精髓。(Learned the essence of Chinese culture.)'] },
  { characters: '渊源', pinyin: 'yuān yuán', meaning: 'Origin / Deep-rooted connection', partOfSpeech: 'noun', hskLevel: 6, examples: ['两国有深厚的历史渊源。(The two countries have deep historical connections.)'] },
  { characters: '隐喻', pinyin: 'yǐn yù', meaning: 'Metaphor', partOfSpeech: 'noun', hskLevel: 6, examples: ['成语常用隐喻的手法。(Idioms often use metaphorical techniques.)'] },
  { characters: '博大精深', pinyin: 'bó dà jīng shēn', meaning: 'Broad and profound', partOfSpeech: 'adjective', hskLevel: 6, examples: ['中国文化博大精深。(Chinese culture is broad and profound.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '融会贯通', pinyin: 'róng huì guàn tōng', meaning: 'To master thoroughly through understanding', partOfSpeech: 'verb', hskLevel: 6, examples: ['学习要融会贯通。(Learning should involve thorough understanding.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '源远流长', pinyin: 'yuán yuǎn liú cháng', meaning: 'Having a long history', partOfSpeech: 'adjective', hskLevel: 6, examples: ['中国文化源远流长。(Chinese culture has a long history.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '耐人寻味', pinyin: 'nài rén xún wèi', meaning: 'Thought-provoking / Worth pondering', partOfSpeech: 'adjective', hskLevel: 6, examples: ['这个故事耐人寻味。(This story is thought-provoking.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '潜移默化', pinyin: 'qián yí mò huà', meaning: 'To influence subtly / Imperceptible influence', partOfSpeech: 'verb', hskLevel: 6, examples: ['文化潜移默化地影响人们。(Culture subtly influences people.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '与日俱增', pinyin: 'yǔ rì jù zēng', meaning: 'Increasing day by day', partOfSpeech: 'verb', hskLevel: 6, examples: ['学中文的人与日俱增。(The number of people learning Chinese is increasing day by day.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '举一反三', pinyin: 'jǔ yī fǎn sān', meaning: 'To infer many things from one case', partOfSpeech: 'verb', hskLevel: 6, examples: ['学习要举一反三。(When learning, one should infer many things from one case.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '循序渐进', pinyin: 'xún xù jiàn jìn', meaning: 'Step by step / Progressing in order', partOfSpeech: 'adverb', hskLevel: 6, examples: ['学习语言要循序渐进。(Learning a language should progress step by step.)'], notes: 'This is itself an idiom (chengyu)!' },
  { characters: '独树一帜', pinyin: 'dú shù yī zhì', meaning: 'To stand out / Unique style', partOfSpeech: 'verb', hskLevel: 6, examples: ['他的写作风格独树一帜。(His writing style is truly unique.)'], notes: 'This is itself an idiom (chengyu)!' },
];

// Exam prep data — real exam formats from official HSK guidelines
export const HSK_EXAM_INFO: Record<number, {
  totalQuestions: number;
  duration: string;
  passingScore: string;
  totalPoints: number;
  sections: { name: string; questions: number; duration: string; tips: string }[];
  studyTips: string[];
  vocabRequired: string;
} | null> = {
  1: null,
  2: null,
  3: {
    totalQuestions: 80,
    duration: '90 minutes',
    passingScore: '180 / 300',
    totalPoints: 300,
    sections: [
      { name: 'Listening', questions: 40, duration: '35 min', tips: 'Focus on understanding short dialogues about daily life. Questions increase in length — practice with real HSK audio at 1x speed.' },
      { name: 'Reading', questions: 30, duration: '30 min', tips: 'Match sentences, fill in blanks, and read short paragraphs. Time management is key — skip questions you\'re stuck on and come back.' },
      { name: 'Writing', questions: 10, duration: '15 min', tips: 'Rearrange words into correct sentences. Practice common sentence patterns like 把 (bǎ) and 被 (bèi) constructions.' },
    ],
    studyTips: [
      'Master all 600 vocabulary words — flashcards with spaced repetition (Anki) work well at this level.',
      'Practice the 把 construction and 被 passive voice — they appear frequently in reading and writing.',
      'Listen to short Chinese podcasts or HSK 3 listening practice daily for at least 15 minutes.',
      'Write out sentences by hand — the writing section tests sentence construction, not free writing.',
    ],
    vocabRequired: '600 words',
  },
  4: {
    totalQuestions: 100,
    duration: '105 minutes',
    passingScore: '180 / 300',
    totalPoints: 300,
    sections: [
      { name: 'Listening', questions: 45, duration: '30 min', tips: 'Dialogues get longer and more natural. You\'ll hear conversations about work, social situations, and current events. Practice listening without reading transcripts first.' },
      { name: 'Reading', questions: 40, duration: '40 min', tips: 'Includes fill-in-the-blank, sentence ordering, and passage comprehension. Read the questions before the passage to save time. Look for context clues in surrounding sentences.' },
      { name: 'Writing', questions: 15, duration: '25 min', tips: 'Write sentences using given words, and describe a picture in 80+ characters. Practice writing short paragraphs about daily topics — focus on correct grammar over complex vocabulary.' },
    ],
    studyTips: [
      'HSK 4 is the biggest jump in difficulty. Budget 3-6 months of focused study if you passed HSK 3 recently.',
      'Read Chinese news headlines daily (try The Chairman\'s Bao or Du Chinese app) — HSK 4 reading passages mirror news style.',
      'Master complement structures (结果补语, 趋向补语) — they\'re tested heavily in both reading and writing.',
      'Practice writing 80-character paragraphs from picture prompts. Time yourself — you only get 25 minutes for the whole writing section.',
      'Watch Chinese shows with Chinese subtitles (not English). This builds reading speed and listening comprehension simultaneously.',
    ],
    vocabRequired: '1,200 words',
  },
  5: {
    totalQuestions: 100,
    duration: '125 minutes',
    passingScore: '180 / 300',
    totalPoints: 300,
    sections: [
      { name: 'Listening', questions: 45, duration: '30 min', tips: 'Includes longer monologues and interviews. Speakers talk at natural speed with colloquialisms. Practice with Chinese podcasts, news broadcasts, and TED talks in Chinese.' },
      { name: 'Reading', questions: 45, duration: '45 min', tips: 'Passages are 300-500 characters long, covering society, culture, science, and business. You need strong scanning skills — practice reading full articles in under 3 minutes.' },
      { name: 'Writing', questions: 10, duration: '40 min', tips: 'Write an essay of 80+ characters from keywords AND rewrite a passage from memory after reading it for 10 minutes. The rewrite is the hardest part — practice summarizing articles in your own words.' },
    ],
    studyTips: [
      'Read at least one full Chinese article daily — newspapers (人民日报), magazines, or graded readers at HSK 5 level.',
      'The passage-rewrite task is unique to HSK 5. Practice by reading a paragraph, closing it, and rewriting the key points from memory.',
      'Learn formal written Chinese (书面语) — HSK 5 tests written register, which differs from spoken Mandarin.',
      'Study idioms (成语) seriously — they appear in reading passages and are expected in writing at this level.',
      'Practice writing essays with clear structure: opening statement, 2-3 supporting points, conclusion. Chinese essay structure favors directness.',
      'Take full-length practice tests under timed conditions at least twice before your exam date.',
    ],
    vocabRequired: '2,500 words',
  },
  6: {
    totalQuestions: 101,
    duration: '140 minutes',
    passingScore: '180 / 300',
    totalPoints: 300,
    sections: [
      { name: 'Listening', questions: 50, duration: '35 min', tips: 'Native-speed conversations, lectures, and news broadcasts. Focus on understanding tone, implication, and speaker attitude — not just literal meaning.' },
      { name: 'Reading', questions: 50, duration: '50 min', tips: 'Includes texts with classical Chinese references and academic vocabulary. Speed is critical — practice reading 500+ character passages and answering questions in under 5 minutes.' },
      { name: 'Writing', questions: 1, duration: '45 min', tips: 'Write a 400-character essay summarizing a 1000-character passage read for 10 minutes. Structure your summary clearly: main argument, key evidence, conclusion.' },
    ],
    studyTips: [
      'At HSK 6, immersion is essential. Consume Chinese media daily — news, podcasts, books, social media.',
      'The writing section requires summarizing a long passage from memory. Practice by reading opinion articles and writing 400-character summaries.',
      'Learn to identify rhetorical devices and literary allusions — they appear in both reading and listening.',
      'Study classical Chinese (文言文) basics — HSK 6 reading occasionally includes classical references.',
      'Practice speed reading: aim to read 200+ characters per minute with 80%+ comprehension.',
    ],
    vocabRequired: '5,000+ words',
  },
};

// Listicle slugs related to each HSK level
export const HSK_LISTICLES: Record<number, { slug: string; title: string }[]> = {
  1: [],
  2: [],
  3: [
    { slug: 'chinese-idioms-hsk-3', title: '10 Simple Chinese Idioms for HSK 3 Learners' },
  ],
  4: [
    { slug: 'chinese-idioms-hsk-4', title: '12 Essential Chinese Idioms for HSK 4 Learners' },
    { slug: 'chinese-idioms-hsk-4-advanced', title: '12 More Chinese Idioms for HSK 4 Practice' },
  ],
  5: [
    { slug: 'chinese-idioms-hsk-5', title: '12 Advanced Chinese Idioms for HSK 5 Learners' },
    { slug: 'chinese-idioms-hsk-5-reading', title: 'Chinese Idioms for HSK 5 Reading Comprehension' },
  ],
  6: [
    { slug: 'chinese-idioms-hsk-6', title: '12 Sophisticated Chinese Idioms for HSK 6 Mastery' },
    { slug: 'chinese-idioms-hsk-6-writing', title: 'Chinese Idioms for HSK 6 Writing' },
    { slug: 'chinese-idioms-hsk-7-9', title: 'Chinese Idioms for HSK 7-9 (New HSK)' },
  ],
};

// Helper functions
export function getAllHSKEntries(): HSKEntry[] {
  return hskEntries;
}

export function getHSKByLevel(level: number): HSKEntry[] {
  return hskEntries.filter(e => e.hskLevel === level);
}

export function loadTranslatedHSK(lang: string): TranslatedHSKEntry[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'translations', lang, 'hsk.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as TranslatedHSKEntry[];
  } catch {
    // Fallback to English if translation doesn't exist
    return hskEntries.map(entry => ({
      ...entry,
      originalMeaning: entry.meaning,
    }));
  }
}

export function getTranslatedHSKByLevel(level: number, lang: string): TranslatedHSKEntry[] {
  const entries = loadTranslatedHSK(lang);
  return entries.filter(e => e.hskLevel === level);
}
