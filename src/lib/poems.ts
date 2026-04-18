import fs from 'fs';
import path from 'path';

export type PoemLine = {
  chinese: string;
  pinyin: string;
};

export type Poet = {
  name: string;
  nameChinese: string;
  dynasty: string;
  dynastyChinese: string;
  birthYear?: string;
  deathYear?: string;
  bio: string;
};

export type Poem = {
  id: string;
  slug: string;
  title: string;
  titleChinese: string;
  titlePinyin: string;
  poet: Poet;
  lines: PoemLine[];
  traditionalChinese: string;
  translation: string;
  background: string;
  analysis: string;
  form: string;
  theme: string;
};

export type TranslatedPoem = Poem & {
  originalSlug: string;
  /** Display-ready translation of the theme; p.theme remains EN as a stable
   *  grouping key. Falls back to theme if translation is missing. */
  themeTranslated?: string;
};

export const POEM_THEMES = [
  'Homesickness & Longing',
  'Nature & Landscape',
  'Friendship & Farewell',
  'War & Frontier',
  'Love & Devotion',
  'Life & Philosophy',
  'Seasons & Time',
] as const;

export const POEM_FORMS = [
  'Five-character Quatrain (五言绝句)',
  'Seven-character Quatrain (七言绝句)',
  'Five-character Regulated Verse (五言律诗)',
  'Seven-character Regulated Verse (七言律诗)',
  'Ancient Verse (古体诗)',
] as const;

export const poems: Poem[] = [
  {
    id: 'P001',
    slug: 'jing-ye-si',
    title: 'Quiet Night Thought',
    titleChinese: '静夜思',
    titlePinyin: 'jìng yè sī',
    poet: {
      name: 'Li Bai',
      nameChinese: '李白',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '762',
      bio: 'Li Bai is one of the most celebrated poets in Chinese history, known as the "Immortal Poet" (诗仙). Born in Central Asia and raised in Sichuan, he was famous for his romantic imagination, love of wine, and Daoist-influenced worldview. His poetry combines grandeur with effortless elegance.',
    },
    lines: [
      { chinese: '床前明月光，', pinyin: 'chuáng qián míng yuè guāng,' },
      { chinese: '疑是地上霜。', pinyin: 'yí shì dì shàng shuāng.' },
      { chinese: '举头望明月，', pinyin: 'jǔ tóu wàng míng yuè,' },
      { chinese: '低头思故乡。', pinyin: 'dī tóu sī gù xiāng.' },
    ],
    traditionalChinese: '床前明月光，疑是地上霜。舉頭望明月，低頭思故鄉。',
    translation: 'Before my bed, bright moonlight gleams — I wonder if it\'s frost upon the ground. I raise my head to gaze at the bright moon, then lower it, thinking of my homeland.',
    background: 'Written around 726 AD, this is perhaps the most famous Chinese poem ever composed. Li Bai wrote it while traveling far from his hometown of Sichuan. The poem captures a universal moment: lying awake at night, seeing moonlight, and feeling the ache of being far from home. Nearly every Chinese person can recite this poem from memory, as it is one of the first poems taught to children.',
    analysis: 'The genius of this poem lies in its simplicity. In just 20 characters, Li Bai creates a complete emotional arc: observation (moonlight), confusion (is it frost?), action (looking up), and feeling (homesickness). The parallel structure of the last two lines — raising and lowering the head — mirrors the movement between the external world (moon) and internal feelings (longing). The moon serves as a bridge between the poet and his distant home, since the same moon shines on both.',
    form: 'Five-character Quatrain (五言绝句)',
    theme: 'Homesickness & Longing',
  },
  {
    id: 'P002',
    slug: 'chun-xiao',
    title: 'Spring Morning',
    titleChinese: '春晓',
    titlePinyin: 'chūn xiǎo',
    poet: {
      name: 'Meng Haoran',
      nameChinese: '孟浩然',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '689',
      deathYear: '740',
      bio: 'Meng Haoran was one of the most prominent pastoral poets of the Tang Dynasty. Unlike many of his contemporaries, he never held an official government position, choosing instead a life close to nature. His poetry is celebrated for its natural simplicity and genuine feeling.',
    },
    lines: [
      { chinese: '春眠不觉晓，', pinyin: 'chūn mián bù jué xiǎo,' },
      { chinese: '处处闻啼鸟。', pinyin: 'chù chù wén tí niǎo.' },
      { chinese: '夜来风雨声，', pinyin: 'yè lái fēng yǔ shēng,' },
      { chinese: '花落知多少。', pinyin: 'huā luò zhī duō shǎo.' },
    ],
    traditionalChinese: '春眠不覺曉，處處聞啼鳥。夜來風雨聲，花落知多少。',
    translation: 'In spring sleep, dawn arrives unnoticed — everywhere I hear the birds singing. Last night came the sound of wind and rain; who knows how many petals have fallen?',
    background: 'This deceptively simple poem is among the first poems Chinese children learn. Meng Haoran captures the drowsy pleasure of sleeping late on a spring morning, then shifts to gentle melancholy as he wonders about flowers knocked down by overnight rain. The poem dates to the early 8th century.',
    analysis: 'The poem moves through the senses: first touch (the warmth of the bed), then hearing (birdsong, then recalled sounds of rain), and finally imagination (the fallen flowers). The closing question is open-ended — the poet doesn\'t get up to check, leaving the loss of beauty as a lingering thought. This interplay between comfort and impermanence is quintessentially Chinese in its aesthetic sensibility.',
    form: 'Five-character Quatrain (五言绝句)',
    theme: 'Seasons & Time',
  },
  {
    id: 'P003',
    slug: 'deng-guan-que-lou',
    title: 'Climbing Stork Tower',
    titleChinese: '登鹳雀楼',
    titlePinyin: 'dēng guàn què lóu',
    poet: {
      name: 'Wang Zhihuan',
      nameChinese: '王之涣',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '688',
      deathYear: '742',
      bio: 'Wang Zhihuan was a Tang Dynasty poet known for his frontier and landscape poetry. Despite only six of his poems surviving to the present day, two of them rank among the most famous in all of Chinese literature. He was admired for his bold and expansive vision.',
    },
    lines: [
      { chinese: '白日依山尽，', pinyin: 'bái rì yī shān jìn,' },
      { chinese: '黄河入海流。', pinyin: 'huáng hé rù hǎi liú.' },
      { chinese: '欲穷千里目，', pinyin: 'yù qióng qiān lǐ mù,' },
      { chinese: '更上一层楼。', pinyin: 'gèng shàng yī céng lóu.' },
    ],
    traditionalChinese: '白日依山盡，黃河入海流。欲窮千里目，更上一層樓。',
    translation: 'The white sun sets behind the mountains; the Yellow River flows into the sea. If you wish to see a thousand miles further, climb one more floor of the tower.',
    background: 'Written at Stork Tower (鹳雀楼) in Shanxi province, overlooking the Yellow River. The tower, originally built during the Northern Zhou Dynasty, was a famous scenic spot. The poem has become a proverb for ambition and self-improvement — "climb one more floor" is used in everyday Chinese to mean "reach the next level."',
    analysis: 'The first two lines paint a vast panorama: the sun disappearing behind mountains, the river flowing to the distant sea. Both images convey immensity and the passage of things beyond human control. The final two lines pivot from observation to philosophy: to see further, you must climb higher. This metaphor for continuous self-improvement has made the poem an enduring motto in Chinese culture.',
    form: 'Five-character Quatrain (五言绝句)',
    theme: 'Life & Philosophy',
  },
  {
    id: 'P004',
    slug: 'yong-e',
    title: 'Ode to the Goose',
    titleChinese: '咏鹅',
    titlePinyin: 'yǒng é',
    poet: {
      name: 'Luo Binwang',
      nameChinese: '骆宾王',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '619',
      deathYear: '687',
      bio: 'Luo Binwang was one of the "Four Great Poets of the Early Tang" (初唐四杰). He is said to have written "Ode to the Goose" at just seven years old, making it one of the most famous child-authored poems in Chinese history. He later became known for political writing and died in the aftermath of a failed rebellion.',
    },
    lines: [
      { chinese: '鹅，鹅，鹅，', pinyin: 'é, é, é,' },
      { chinese: '曲项向天歌。', pinyin: 'qū xiàng xiàng tiān gē.' },
      { chinese: '白毛浮绿水，', pinyin: 'bái máo fú lǜ shuǐ,' },
      { chinese: '红掌拨清波。', pinyin: 'hóng zhǎng bō qīng bō.' },
    ],
    traditionalChinese: '鵝，鵝，鵝，曲項向天歌。白毛浮綠水，紅掌撥清波。',
    translation: 'Goose, goose, goose — you bend your neck and sing toward the sky. White feathers float on green water; red feet paddle the clear waves.',
    background: 'Legend has it that Luo Binwang composed this poem at the age of seven when an elder asked him to write about geese. It is typically the very first poem taught to Chinese children, beloved for its vivid colors, playful repetition, and childlike wonder. The poem dates to approximately 626 AD.',
    analysis: 'The opening triple repetition of "goose" mimics a child\'s excitement. The poem then builds a vivid color palette: white feathers, green water, red feet, clear waves. Each detail is precise and sensory. Despite its simplicity, the poem demonstrates sophisticated technique — the contrast of colors and the dynamic verbs (float, paddle) bring the scene to life.',
    form: 'Ancient Verse (古体诗)',
    theme: 'Nature & Landscape',
  },
  {
    id: 'P005',
    slug: 'min-nong',
    title: 'Sympathy for the Farmers',
    titleChinese: '悯农（其二）',
    titlePinyin: 'mǐn nóng (qí èr)',
    poet: {
      name: 'Li Shen',
      nameChinese: '李绅',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '772',
      deathYear: '846',
      bio: 'Li Shen was a Tang Dynasty poet and official who rose to become Chancellor. Ironically, despite writing this compassionate poem about farmers\' hardship, he was later known for his extravagant lifestyle as an official. His "Sympathy for the Farmers" poems remain among the most recited in Chinese education.',
    },
    lines: [
      { chinese: '锄禾日当午，', pinyin: 'chú hé rì dāng wǔ,' },
      { chinese: '汗滴禾下土。', pinyin: 'hàn dī hé xià tǔ.' },
      { chinese: '谁知盘中餐，', pinyin: 'shéi zhī pán zhōng cān,' },
      { chinese: '粒粒皆辛苦。', pinyin: 'lì lì jiē xīn kǔ.' },
    ],
    traditionalChinese: '鋤禾日當午，汗滴禾下土。誰知盤中餐，粒粒皆辛苦。',
    translation: 'Hoeing grain under the midday sun, sweat drips onto the soil beneath the crops. Who knows that the food upon your plate — every single grain was hard-earned toil?',
    background: 'This poem is a moral lesson about respecting food and the labor behind it. It is recited by virtually every Chinese child and is often quoted by parents at mealtimes. The poem was written during a time when the gap between the wealthy and working classes was stark, and Li Shen sought to remind the privileged of the human cost behind their meals.',
    analysis: 'The poem\'s power lies in its directness. The first two lines place us in the field under scorching sun — we can feel the heat and see the sweat. The rhetorical question in line three addresses the reader directly, creating a sense of guilt or responsibility. The final line, with its repetition of "every grain" (粒粒), drives home the point that no amount of food should be wasted.',
    form: 'Five-character Quatrain (五言绝句)',
    theme: 'Life & Philosophy',
  },
  {
    id: 'P006',
    slug: 'wang-lu-shan-pu-bu',
    title: 'Viewing the Waterfall at Mount Lu',
    titleChinese: '望庐山瀑布',
    titlePinyin: 'wàng lú shān pù bù',
    poet: {
      name: 'Li Bai',
      nameChinese: '李白',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '762',
      bio: 'Li Bai is one of the most celebrated poets in Chinese history, known as the "Immortal Poet" (诗仙). Born in Central Asia and raised in Sichuan, he was famous for his romantic imagination, love of wine, and Daoist-influenced worldview. His poetry combines grandeur with effortless elegance.',
    },
    lines: [
      { chinese: '日照香炉生紫烟，', pinyin: 'rì zhào xiāng lú shēng zǐ yān,' },
      { chinese: '遥看瀑布挂前川。', pinyin: 'yáo kàn pù bù guà qián chuān.' },
      { chinese: '飞流直下三千尺，', pinyin: 'fēi liú zhí xià sān qiān chǐ,' },
      { chinese: '疑是银河落九天。', pinyin: 'yí shì yín hé luò jiǔ tiān.' },
    ],
    traditionalChinese: '日照香爐生紫煙，遙看瀑布掛前川。飛流直下三千尺，疑是銀河落九天。',
    translation: 'Sunlight on Incense Burner Peak produces purple haze; from afar I see the waterfall hanging over the river. Its torrent plunges straight down three thousand feet — as if the Milky Way were falling from the ninth heaven.',
    background: 'Li Bai wrote this poem while visiting Mount Lu (庐山) in Jiangxi province, one of China\'s most famous mountains. The "Incense Burner Peak" (香炉峰) is a summit whose mist, when lit by sunlight, resembles incense smoke. The waterfall described is likely the Kai先 Waterfall (开先瀑布), one of several at Mount Lu.',
    analysis: 'This poem showcases Li Bai\'s trademark hyperbole and cosmic imagination. The progression builds from realistic observation (sunlight on mist) to increasingly fantastical description — the waterfall "hangs" like a curtain, plunges "three thousand feet," and finally becomes the Milky Way itself falling from heaven. The number "nine" in Chinese cosmology represents the highest, making "ninth heaven" the ultimate height.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Nature & Landscape',
  },
  {
    id: 'P007',
    slug: 'chun-wang',
    title: 'Spring View',
    titleChinese: '春望',
    titlePinyin: 'chūn wàng',
    poet: {
      name: 'Du Fu',
      nameChinese: '杜甫',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '712',
      deathYear: '770',
      bio: 'Du Fu is revered as the "Poet-Sage" (诗圣) of China, regarded as the greatest realist poet in Chinese literary history. His work reflects deep compassion for human suffering and keen observation of the social turmoil of his era, particularly the devastating An Lushan Rebellion. His technical mastery is unmatched.',
    },
    lines: [
      { chinese: '国破山河在，', pinyin: 'guó pò shān hé zài,' },
      { chinese: '城春草木深。', pinyin: 'chéng chūn cǎo mù shēn.' },
      { chinese: '感时花溅泪，', pinyin: 'gǎn shí huā jiàn lèi,' },
      { chinese: '恨别鸟惊心。', pinyin: 'hèn bié niǎo jīng xīn.' },
      { chinese: '烽火连三月，', pinyin: 'fēng huǒ lián sān yuè,' },
      { chinese: '家书抵万金。', pinyin: 'jiā shū dǐ wàn jīn.' },
      { chinese: '白头搔更短，', pinyin: 'bái tóu sāo gèng duǎn,' },
      { chinese: '浑欲不胜簪。', pinyin: 'hún yù bù shèng zān.' },
    ],
    traditionalChinese: '國破山河在，城春草木深。感時花濺淚，恨別鳥驚心。烽火連三月，家書抵萬金。白頭搔更短，渾欲不勝簪。',
    translation: 'The nation is broken, though mountains and rivers remain; the city in spring is overgrown with grass and trees. Moved by the times, flowers bring tears; hating separation, birdsong startles the heart. Beacon fires have burned for three months straight; a letter from home is worth ten thousand in gold. I scratch my white hair, grown ever thinner — soon it won\'t even hold a hairpin.',
    background: 'Written in spring 757 AD, during the An Lushan Rebellion (755–763) that devastated the Tang Dynasty. Du Fu was trapped in the rebel-occupied capital Chang\'an, separated from his family. The poem captures the anguish of witnessing national destruction while helplessly worrying about loved ones. It is considered one of the greatest war poems in Chinese literature.',
    analysis: 'The opening line is stunning in its contrast: the nation is "broken" but nature endures — mountains and rivers remain indifferent to human catastrophe. In the famous third and fourth lines, even beautiful things (flowers, birdsong) become sources of pain because the poet\'s emotional state transforms everything. The phrase "a letter from home is worth ten thousand in gold" (家书抵万金) has become a common Chinese saying still used today.',
    form: 'Five-character Regulated Verse (五言律诗)',
    theme: 'War & Frontier',
  },
  {
    id: 'P008',
    slug: 'lu-chai',
    title: 'Deer Enclosure',
    titleChinese: '鹿柴',
    titlePinyin: 'lù zhài',
    poet: {
      name: 'Wang Wei',
      nameChinese: '王维',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '761',
      bio: 'Wang Wei was a Tang Dynasty poet, musician, painter, and statesman known as the "Poet-Buddha" (诗佛) for the Zen Buddhist sensibility in his work. His nature poetry achieves a meditative stillness that has been compared to traditional Chinese landscape painting. He is considered one of the greatest landscape poets in Chinese literature.',
    },
    lines: [
      { chinese: '空山不见人，', pinyin: 'kōng shān bú jiàn rén,' },
      { chinese: '但闻人语响。', pinyin: 'dàn wén rén yǔ xiǎng.' },
      { chinese: '返景入深林，', pinyin: 'fǎn jǐng rù shēn lín,' },
      { chinese: '复照青苔上。', pinyin: 'fù zhào qīng tái shàng.' },
    ],
    traditionalChinese: '空山不見人，但聞人語響。返景入深林，復照青苔上。',
    translation: 'In the empty mountains, no one can be seen — yet voices echo from somewhere. Returning sunlight enters the deep forest and shines again upon the green moss.',
    background: 'This is one of twenty poems in Wang Wei\'s "Wang River Collection" (辋川集), describing scenes around his country estate in the Zhongnan Mountains near Chang\'an. The Deer Enclosure was a specific location on the property. Wang Wei composed these poems during periods of retreat from official life, deeply influenced by Chan (Zen) Buddhism.',
    analysis: 'This poem is a masterclass in creating atmosphere through absence. The "empty mountain" with unseen voices creates a paradox — the emptiness is not truly empty. The shaft of sunlight entering the deep forest illuminates only moss, suggesting how rarely light (or people) penetrate this place. The poem embodies the Zen concept of finding profound presence within apparent emptiness.',
    form: 'Five-character Quatrain (五言绝句)',
    theme: 'Nature & Landscape',
  },
  {
    id: 'P010',
    slug: 'song-yuan-er-shi-an-xi',
    title: 'Farewell to Yuan Er on His Mission to Anxi',
    titleChinese: '送元二使安西',
    titlePinyin: 'sòng yuán èr shǐ ān xī',
    poet: {
      name: 'Wang Wei',
      nameChinese: '王维',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '761',
      bio: 'Wang Wei was a Tang Dynasty poet, musician, painter, and statesman known as the "Poet-Buddha" (诗佛) for the Zen Buddhist sensibility in his work. His nature poetry achieves a meditative stillness that has been compared to traditional Chinese landscape painting. He is considered one of the greatest landscape poets in Chinese literature.',
    },
    lines: [
      { chinese: '渭城朝雨浥轻尘，', pinyin: 'wèi chéng zhāo yǔ yì qīng chén,' },
      { chinese: '客舍青青柳色新。', pinyin: 'kè shè qīng qīng liǔ sè xīn.' },
      { chinese: '劝君更尽一杯酒，', pinyin: 'quàn jūn gèng jìn yī bēi jiǔ,' },
      { chinese: '西出阳关无故人。', pinyin: 'xī chū yáng guān wú gù rén.' },
    ],
    traditionalChinese: '渭城朝雨浥輕塵，客舍青青柳色新。勸君更盡一杯酒，西出陽關無故人。',
    translation: 'Morning rain in Weicheng has dampened the light dust; the inn is fresh and green with new willow colors. I urge you to drink one more cup of wine — west of Yang Pass, you will have no old friends.',
    background: 'Wang Wei wrote this poem to bid farewell to his friend Yuan Er, who was being sent on a diplomatic mission to Anxi (in modern Xinjiang), far beyond the western frontier. Yang Pass (阳关) was the last gateway before the desolate western regions. The poem was later set to music as "Three Variations on Yang Pass" (阳关三叠), becoming the most famous farewell song in Chinese history.',
    analysis: 'The morning rain washing the dust creates a scene of freshness and clarity that contrasts with the impending separation. Willows (柳) are a traditional farewell symbol in Chinese culture, as the word sounds like "stay" (留). The third line\'s urgency — "drink one more cup" — carries the weight of knowing this may be the last time friends share wine. The final line is devastating in its simplicity: beyond Yang Pass, there will be no one you know.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Friendship & Farewell',
  },
  {
    id: 'P011',
    slug: 'you-zi-yin',
    title: 'Song of the Wandering Son',
    titleChinese: '游子吟',
    titlePinyin: 'yóu zǐ yín',
    poet: {
      name: 'Meng Jiao',
      nameChinese: '孟郊',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '751',
      deathYear: '814',
      bio: 'Meng Jiao was a Tang Dynasty poet known for his austere, emotionally intense style. He struggled in poverty for much of his life and did not pass the imperial examinations until age 46. His poetry often reflects themes of hardship, family bonds, and moral earnestness.',
    },
    lines: [
      { chinese: '慈母手中线，', pinyin: 'cí mǔ shǒu zhōng xiàn,' },
      { chinese: '游子身上衣。', pinyin: 'yóu zǐ shēn shàng yī.' },
      { chinese: '临行密密缝，', pinyin: 'lín xíng mì mì féng,' },
      { chinese: '意恐迟迟归。', pinyin: 'yì kǒng chí chí guī.' },
      { chinese: '谁言寸草心，', pinyin: 'shéi yán cùn cǎo xīn,' },
      { chinese: '报得三春晖。', pinyin: 'bào dé sān chūn huī.' },
    ],
    traditionalChinese: '慈母手中線，遊子身上衣。臨行密密縫，意恐遲遲歸。誰言寸草心，報得三春暉。',
    translation: 'A loving mother\'s thread is in her hand — clothes for her wandering child. Before he leaves, she sews with close, dense stitches, fearing he will be long in returning. Who says the heart of an inch of grass can repay the warmth of three springs of sunshine?',
    background: 'Meng Jiao wrote this poem after finally passing the imperial examination at age 46. The poem is a tribute to his mother, who supported and believed in him through decades of failure and poverty. It has become the quintessential Chinese poem about maternal love and is recited on Mother\'s Day throughout the Chinese-speaking world.',
    analysis: 'The poem creates its emotional power through a single concrete image: a mother sewing clothes for her departing son. The "close, dense stitches" reveal her anxiety — as if sewing more tightly could somehow keep him closer or protect him longer. The closing metaphor compares the child\'s ability to repay his mother to a blade of grass trying to repay the sun for three seasons of warmth — an impossible debt of gratitude.',
    form: 'Ancient Verse (古体诗)',
    theme: 'Love & Devotion',
  },
  {
    id: 'P012',
    slug: 'jiang-xue',
    title: 'River Snow',
    titleChinese: '江雪',
    titlePinyin: 'jiāng xuě',
    poet: {
      name: 'Liu Zongyuan',
      nameChinese: '柳宗元',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '773',
      deathYear: '819',
      bio: 'Liu Zongyuan was a Tang Dynasty essayist, poet, and political reformer. After a failed political reform, he was exiled to remote southern regions for the rest of his life. His poetry and prose reflect themes of isolation, resilience, and communion with nature. He is counted among the "Eight Great Prose Masters of the Tang and Song."',
    },
    lines: [
      { chinese: '千山鸟飞绝，', pinyin: 'qiān shān niǎo fēi jué,' },
      { chinese: '万径人踪灭。', pinyin: 'wàn jìng rén zōng miè.' },
      { chinese: '孤舟蓑笠翁，', pinyin: 'gū zhōu suō lì wēng,' },
      { chinese: '独钓寒江雪。', pinyin: 'dú diào hán jiāng xuě.' },
    ],
    traditionalChinese: '千山鳥飛絕，萬徑人蹤滅。孤舟蓑笠翁，獨釣寒江雪。',
    translation: 'From a thousand mountains, birds have vanished; on ten thousand paths, human traces are gone. A lone boat, an old man in straw cloak and hat — fishing alone in the cold river snow.',
    background: 'Liu Zongyuan wrote this poem during his political exile in Yongzhou (modern Hunan). Having been banished for his role in a failed reform movement, he spent over a decade in the remote south. The poem is widely read as a self-portrait of the poet in exile — alone and unbowed. It is one of the most visually iconic Chinese poems, frequently depicted in traditional painting.',
    analysis: 'The poem achieves extraordinary stillness through systematic negation. First all birds vanish, then all human traces. The world is emptied of all life except one old man. The scale is vast (thousands of mountains, ten thousand paths) yet narrows to a single point (one boat, one figure). The old fisherman, alone in a frozen landscape, embodies Confucian integrity — maintaining one\'s principles despite complete isolation.',
    form: 'Five-character Quatrain (五言绝句)',
    theme: 'Nature & Landscape',
  },
  {
    id: 'P013',
    slug: 'chu-sai',
    title: 'Out on the Frontier',
    titleChinese: '出塞',
    titlePinyin: 'chū sài',
    poet: {
      name: 'Wang Changling',
      nameChinese: '王昌龄',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '698',
      deathYear: '756',
      bio: 'Wang Changling was known as the "Master of Seven-character Quatrains" (七绝圣手) during the Tang Dynasty. He excelled at frontier poetry that combined martial spirit with deep compassion for soldiers. Despite his literary fame, he suffered political setbacks and was ultimately killed during the An Lushan Rebellion.',
    },
    lines: [
      { chinese: '秦时明月汉时关，', pinyin: 'qín shí míng yuè hàn shí guān,' },
      { chinese: '万里长征人未还。', pinyin: 'wàn lǐ cháng zhēng rén wèi huán.' },
      { chinese: '但使龙城飞将在，', pinyin: 'dàn shǐ lóng chéng fēi jiàng zài,' },
      { chinese: '不教胡马度阴山。', pinyin: 'bù jiào hú mǎ dù yīn shān.' },
    ],
    traditionalChinese: '秦時明月漢時關，萬里長征人未還。但使龍城飛將在，不教胡馬度陰山。',
    translation: 'The same moon that shone in Qin, the same passes from the Han — soldiers marched ten thousand miles and have not returned. If only the Flying General of Dragon City were here, he would never let the enemy horses cross Yin Mountain.',
    background: 'This frontier poem (边塞诗) reflects on the endless cycle of border warfare throughout Chinese history. The "Flying General" (飞将) refers to Li Guang, a legendary Han Dynasty general famous for defeating the Xiongnu nomads. Wang Changling wrote during a period of ongoing Tang military campaigns against northern and western peoples.',
    analysis: 'The opening line is breathtaking in its compression of time: the same moon and the same frontier passes have witnessed warfare from the Qin Dynasty through the Han and into the present Tang. Centuries pass but the situation never changes — soldiers still march away and don\'t return. The wish for a great general like Li Guang is both patriotic and heartbreaking, implying that current leadership is inadequate and soldiers are dying needlessly.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'War & Frontier',
  },
  {
    id: 'P014',
    slug: 'ye-yu-ji-bei',
    title: 'Night Rain — Letter to the North',
    titleChinese: '夜雨寄北',
    titlePinyin: 'yè yǔ jì běi',
    poet: {
      name: 'Li Shangyin',
      nameChinese: '李商隐',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '813',
      deathYear: '858',
      bio: 'Li Shangyin was a late Tang Dynasty poet celebrated for his richly allusive, emotionally complex verse. His love poems are considered among the finest in Chinese literature, though their dense symbolism has kept scholars debating their meaning for centuries. He is paired with Du Mu as the "Little Li and Du" (小李杜).',
    },
    lines: [
      { chinese: '君问归期未有期，', pinyin: 'jūn wèn guī qī wèi yǒu qī,' },
      { chinese: '巴山夜雨涨秋池。', pinyin: 'bā shān yè yǔ zhǎng qiū chí.' },
      { chinese: '何当共剪西窗烛，', pinyin: 'hé dāng gòng jiǎn xī chuāng zhú,' },
      { chinese: '却话巴山夜雨时。', pinyin: 'què huà bā shān yè yǔ shí.' },
    ],
    traditionalChinese: '君問歸期未有期，巴山夜雨漲秋池。何當共剪西窗燭，卻話巴山夜雨時。',
    translation: 'You ask when I will return — there is no date set. The night rain on Mount Ba swells the autumn pools. When will we sit together trimming candles by the west window, and talk about this night of rain on Mount Ba?',
    background: 'Li Shangyin wrote this poem while stranded in the Ba (Sichuan) region, far from his wife in Chang\'an. The letter he received asked when he would return, but he had no answer. The poem is remarkable for its structure: the present (rain, loneliness) and an imagined future (reunion) fold into each other through the repeated phrase "night rain on Mount Ba."',
    analysis: 'The repetition of "Ba Mountain night rain" (巴山夜雨) creates a temporal loop. In the present, the rain is a source of melancholy. In the imagined future, that same rain becomes a story to share with a loved one — transforming suffering into memory, loneliness into intimacy. The act of "trimming candles" suggests a long, unhurried conversation late into the night. The poem turns present pain into future tenderness.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Love & Devotion',
  },
  {
    id: 'P015',
    slug: 'qing-ming',
    title: 'Qingming Festival',
    titleChinese: '清明',
    titlePinyin: 'qīng míng',
    poet: {
      name: 'Du Mu',
      nameChinese: '杜牧',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '803',
      deathYear: '852',
      bio: 'Du Mu was a late Tang Dynasty poet known for his elegant, often melancholic verse. He is particularly famous for his historical reflections and lyrical quatrains. Together with Li Shangyin, he is referred to as the "Little Li and Du" (小李杜), a nod to the earlier "Great Li and Du" (Li Bai and Du Fu).',
    },
    lines: [
      { chinese: '清明时节雨纷纷，', pinyin: 'qīng míng shí jié yǔ fēn fēn,' },
      { chinese: '路上行人欲断魂。', pinyin: 'lù shàng xíng rén yù duàn hún.' },
      { chinese: '借问酒家何处有，', pinyin: 'jiè wèn jiǔ jiā hé chù yǒu,' },
      { chinese: '牧童遥指杏花村。', pinyin: 'mù tóng yáo zhǐ xìng huā cūn.' },
    ],
    traditionalChinese: '清明時節雨紛紛，路上行人欲斷魂。借問酒家何處有，牧童遙指杏花村。',
    translation: 'During the Qingming Festival, rain falls thick and fast; travelers on the road are weary to their souls. "Where can I find a tavern?" I ask — a shepherd boy points to Apricot Blossom Village in the distance.',
    background: 'The Qingming Festival (Clear Brightness Festival, also called Tomb-Sweeping Day) occurs in early April, when families visit ancestral graves. Rain during Qingming is considered auspicious but makes the already somber occasion more melancholy. This poem has become so intertwined with the festival that it is virtually impossible to mention Qingming without someone quoting it.',
    analysis: 'The poem tells a miniature story. The rain and emotional weight of the festival are established in the first two lines. Then a simple question-and-answer exchange between traveler and shepherd boy provides the turn. The final image — a distant village named after apricot blossoms — offers both literal shelter (a tavern to rest in) and symbolic hope (beauty beyond the rain). The poem\'s narrative structure makes it feel like a scene from a film.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Seasons & Time',
  },
  {
    id: 'P016',
    slug: 'fu-de-gu-yuan-cao-song-bie',
    title: 'Grasses',
    titleChinese: '赋得古原草送别',
    titlePinyin: 'fù dé gǔ yuán cǎo sòng bié',
    poet: {
      name: 'Bai Juyi',
      nameChinese: '白居易',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '772',
      deathYear: '846',
      bio: 'Bai Juyi was one of the most prolific and popular Tang Dynasty poets. He advocated for poetry that common people could understand, writing in a clear, accessible style. He held various government positions and is also famous for his long narrative poems like "Song of Everlasting Regret" (长恨歌).',
    },
    lines: [
      { chinese: '离离原上草，', pinyin: 'lí lí yuán shàng cǎo,' },
      { chinese: '一岁一枯荣。', pinyin: 'yī suì yī kū róng.' },
      { chinese: '野火烧不尽，', pinyin: 'yě huǒ shāo bù jìn,' },
      { chinese: '春风吹又生。', pinyin: 'chūn fēng chuī yòu shēng.' },
      { chinese: '远芳侵古道，', pinyin: 'yuǎn fāng qīn gǔ dào,' },
      { chinese: '晴翠接荒城。', pinyin: 'qíng cuì jiē huāng chéng.' },
      { chinese: '又送王孙去，', pinyin: 'yòu sòng wáng sūn qù,' },
      { chinese: '萋萋满别情。', pinyin: 'qī qī mǎn bié qíng.' },
    ],
    traditionalChinese: '離離原上草，一歲一枯榮。野火燒不盡，春風吹又生。遠芳侵古道，晴翠接荒城。又送王孫去，萋萋滿別情。',
    translation: 'Endless grasses on the plain — each year they wither and flourish again. Wildfire cannot burn them away; spring wind blows and they grow once more. Their distant fragrance reaches the old road; their sunlit green meets the ruined city. Once more I see a friend off — the thick grasses overflow with parting sorrow.',
    background: 'Bai Juyi wrote this poem at age 16 as an examination piece. Legend says that when the famous poet Gu Kuang first read it, he was astonished by the young poet\'s talent. The lines "Wildfire cannot burn them away; spring wind blows and they grow once more" became one of the most quoted couplets in Chinese literature, symbolizing indomitable resilience.',
    analysis: 'The poem works on two levels: as nature observation and as farewell. The grass becomes a metaphor for both the persistence of life (surviving fire, returning each spring) and the persistence of sorrow (always growing back when friends depart). The middle section expands the scene — grass reaching along ancient roads and against ruined cities — connecting personal farewell to the passage of history. The closing ties everything to the specific moment of saying goodbye.',
    form: 'Five-character Regulated Verse (五言律诗)',
    theme: 'Friendship & Farewell',
  },
  {
    id: 'P017',
    slug: 'zao-fa-bai-di-cheng',
    title: 'Early Departure from White Emperor City',
    titleChinese: '早发白帝城',
    titlePinyin: 'zǎo fā bái dì chéng',
    poet: {
      name: 'Li Bai',
      nameChinese: '李白',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '762',
      bio: 'Li Bai is one of the most celebrated poets in Chinese history, known as the "Immortal Poet" (诗仙). Born in Central Asia and raised in Sichuan, he was famous for his romantic imagination, love of wine, and Daoist-influenced worldview. His poetry combines grandeur with effortless elegance.',
    },
    lines: [
      { chinese: '朝辞白帝彩云间，', pinyin: 'zhāo cí bái dì cǎi yún jiān,' },
      { chinese: '千里江陵一日还。', pinyin: 'qiān lǐ jiāng líng yī rì huán.' },
      { chinese: '两岸猿声啼不住，', pinyin: 'liǎng àn yuán shēng tí bú zhù,' },
      { chinese: '轻舟已过万重山。', pinyin: 'qīng zhōu yǐ guò wàn chóng shān.' },
    ],
    traditionalChinese: '朝辭白帝彩雲間，千里江陵一日還。兩岸猿聲啼不住，輕舟已過萬重山。',
    translation: 'At dawn I depart White Emperor City among the colorful clouds; a thousand miles to Jiangling, I\'ll return in a single day. From both banks, the monkeys\' cries never cease — my light boat has already passed ten thousand mountains.',
    background: 'Li Bai wrote this poem in 759 AD after being pardoned from exile. He had been sentenced to banishment in remote Guizhou for his involvement in a political rebellion, but an amnesty was declared while he was traveling upriver. This poem captures his joy as he races back downstream through the Three Gorges of the Yangtze River. The exuberance is palpable.',
    analysis: 'The poem surges with speed and elation. "Colorful clouds" frame the departure in beauty; "a thousand miles in one day" conveys breathtaking velocity. The monkey cries — a traditional symbol of sorrow in Chinese poetry — are transformed here: they cannot slow him down. The final line\'s past tense ("has already passed") creates a feeling of effortlessness, as if the mountains flew by while we weren\'t looking. It\'s Li Bai at his most jubilant.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Nature & Landscape',
  },
  {
    id: 'P018',
    slug: 'huang-he-lou-song-meng-hao-ran',
    title: 'Seeing Off Meng Haoran at Yellow Crane Tower',
    titleChinese: '黄鹤楼送孟浩然之广陵',
    titlePinyin: 'huáng hè lóu sòng mèng hào rán zhī guǎng líng',
    poet: {
      name: 'Li Bai',
      nameChinese: '李白',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '762',
      bio: 'Li Bai is one of the most celebrated poets in Chinese history, known as the "Immortal Poet" (诗仙). Born in Central Asia and raised in Sichuan, he was famous for his romantic imagination, love of wine, and Daoist-influenced worldview. His poetry combines grandeur with effortless elegance.',
    },
    lines: [
      { chinese: '故人西辞黄鹤楼，', pinyin: 'gù rén xī cí huáng hè lóu,' },
      { chinese: '烟花三月下扬州。', pinyin: 'yān huā sān yuè xià yáng zhōu.' },
      { chinese: '孤帆远影碧空尽，', pinyin: 'gū fān yuǎn yǐng bì kōng jìn,' },
      { chinese: '唯见长江天际流。', pinyin: 'wéi jiàn cháng jiāng tiān jì liú.' },
    ],
    traditionalChinese: '故人西辭黃鶴樓，煙花三月下揚州。孤帆遠影碧空盡，唯見長江天際流。',
    translation: 'My old friend bids farewell at Yellow Crane Tower in the west, amid the mist and blossoms of March, heading down to Yangzhou. His lone sail\'s distant shadow vanishes into blue sky — all I see is the Yangtze flowing to the edge of heaven.',
    background: 'Li Bai wrote this poem to see off his friend and fellow poet Meng Haoran, who was traveling east to Yangzhou. Yellow Crane Tower in Wuhan is one of China\'s most famous landmarks. The two poets had a deep friendship, and Li Bai greatly admired the older Meng Haoran. The poem is set in the most beautiful month — March, when the riverbanks are covered in blossoms.',
    analysis: 'The poem never directly states Li Bai\'s feelings — instead, his emotions are conveyed through what he watches. He stands at the tower watching his friend\'s boat until the sail disappears into the horizon, then keeps watching as the river flows on. The fact that he continues to gaze after the boat has vanished reveals the depth of his attachment. The final image — the Yangtze stretching to heaven\'s edge — transforms personal sorrow into cosmic vastness.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Friendship & Farewell',
  },
  {
    id: 'P019',
    slug: 'deng-gao',
    title: 'Climbing High',
    titleChinese: '登高',
    titlePinyin: 'dēng gāo',
    poet: {
      name: 'Du Fu',
      nameChinese: '杜甫',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '712',
      deathYear: '770',
      bio: 'Du Fu is revered as the "Poet-Sage" (诗圣) of China, regarded as the greatest realist poet in Chinese literary history. His work reflects deep compassion for human suffering and keen observation of the social turmoil of his era, particularly the devastating An Lushan Rebellion. His technical mastery is unmatched.',
    },
    lines: [
      { chinese: '风急天高猿啸哀，', pinyin: 'fēng jí tiān gāo yuán xiào āi,' },
      { chinese: '渚清沙白鸟飞回。', pinyin: 'zhǔ qīng shā bái niǎo fēi huí.' },
      { chinese: '无边落木萧萧下，', pinyin: 'wú biān luò mù xiāo xiāo xià,' },
      { chinese: '不尽长江滚滚来。', pinyin: 'bú jìn cháng jiāng gǔn gǔn lái.' },
      { chinese: '万里悲秋常作客，', pinyin: 'wàn lǐ bēi qiū cháng zuò kè,' },
      { chinese: '百年多病独登台。', pinyin: 'bǎi nián duō bìng dú dēng tái.' },
      { chinese: '艰难苦恨繁霜鬓，', pinyin: 'jiān nán kǔ hèn fán shuāng bìn,' },
      { chinese: '潦倒新停浊酒杯。', pinyin: 'liáo dǎo xīn tíng zhuó jiǔ bēi.' },
    ],
    traditionalChinese: '風急天高猿嘯哀，渚清沙白鳥飛回。無邊落木蕭蕭下，不盡長江滾滾來。萬里悲秋常作客，百年多病獨登臺。艱難苦恨繁霜鬢，潦倒新停濁酒杯。',
    translation: 'Fierce wind, high sky, monkeys howling in grief; clear islet, white sand, birds circling back. Boundless falling leaves rustle down; the endless Yangtze rolls and rolls onward. Ten thousand miles from home, forever a guest in sorrowful autumn; a hundred years of illness, I climb the terrace alone. Hardship and bitter regret have frosted my temples; worn down, I have newly given up my cup of cloudy wine.',
    background: 'Written in 767 AD in Kuizhou (modern Chongqing) during Du Fu\'s late years. The poet was old, sick, impoverished, and far from home. The Double Ninth Festival tradition called for climbing heights and drinking wine, but Du Fu was too ill to drink. This poem is widely considered the greatest regulated verse (律诗) ever written in Chinese.',
    analysis: 'Every couplet is masterfully crafted. The opening two lines present six images in rapid succession (wind, sky, monkeys, islet, sand, birds) that create an overwhelming sensory experience. Lines three and four achieve one of poetry\'s great panoramic effects: endless leaves falling and the infinite river flowing — both images of things passing beyond human control. The turn to the personal in lines five and six is devastating: a lifetime of wandering and illness, climbing alone. The final couplet\'s forced sobriety (even wine is denied him) makes the poem\'s sadness absolute.',
    form: 'Seven-character Regulated Verse (七言律诗)',
    theme: 'Life & Philosophy',
  },
  {
    id: 'P027',
    slug: 'hui-xiang-ou-shu',
    title: 'Returning Home — An Impromptu Verse',
    titleChinese: '回乡偶书',
    titlePinyin: 'huí xiāng ǒu shū',
    poet: {
      name: 'He Zhizhang',
      nameChinese: '贺知章',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '659',
      deathYear: '744',
      bio: 'He Zhizhang was an early Tang Dynasty poet and official who served with distinction for over 50 years in the capital. He was known for his wit, his love of wine, and his friendship with Li Bai, whom he famously nicknamed the "Immortal Banished from Heaven" (谪仙人) upon reading his poetry for the first time.',
    },
    lines: [
      { chinese: '少小离家老大回，', pinyin: 'shào xiǎo lí jiā lǎo dà huí,' },
      { chinese: '乡音无改鬓毛衰。', pinyin: 'xiāng yīn wú gǎi bìn máo shuāi.' },
      { chinese: '儿童相见不相识，', pinyin: 'ér tóng xiāng jiàn bù xiāng shí,' },
      { chinese: '笑问客从何处来。', pinyin: 'xiào wèn kè cóng hé chù lái.' },
    ],
    traditionalChinese: '少小離家老大回，鄉音無改鬢毛衰。兒童相見不相識，笑問客從何處來。',
    translation: 'I left home young and return old — my local accent unchanged, but my temple hair has thinned. The village children see me but don\'t recognize me; smiling, they ask: "Visitor, where do you come from?"',
    background: 'He Zhizhang wrote this poem upon returning to his hometown of Yongxing (in modern Zhejiang) after more than 50 years of serving as an official in the capital Chang\'an. At age 86, he finally retired and went home, only to find that no one recognized him. The bittersweet humor of being a stranger in your own hometown resonated deeply across Chinese culture.',
    analysis: 'The poem\'s emotional impact comes from the gap between identity and recognition. The poet knows who he is — his accent hasn\'t changed — but time has transformed him beyond recognition. The children\'s innocent question is devastating precisely because it\'s cheerful: they see a friendly visitor, not a returning native. The poem captures one of life\'s cruelest ironies: you can go home, but home may not know you anymore.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Homesickness & Longing',
  },
  {
    id: 'P030',
    slug: 'jiang-jin-jiu',
    title: 'Bring in the Wine',
    titleChinese: '将进酒',
    titlePinyin: 'jiāng jìn jiǔ',
    poet: {
      name: 'Li Bai',
      nameChinese: '李白',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '701',
      deathYear: '762',
      bio: 'Li Bai is one of the most celebrated poets in Chinese history, known as the "Immortal Poet" (诗仙). Born in Central Asia and raised in Sichuan, he was famous for his romantic imagination, love of wine, and Daoist-influenced worldview. His poetry combines grandeur with effortless elegance.',
    },
    lines: [
      { chinese: '君不见，黄河之水天上来，', pinyin: 'jūn bú jiàn, huáng hé zhī shuǐ tiān shàng lái,' },
      { chinese: '奔流到海不复回。', pinyin: 'bēn liú dào hǎi bù fù huí.' },
      { chinese: '君不见，高堂明镜悲白发，', pinyin: 'jūn bú jiàn, gāo táng míng jìng bēi bái fà,' },
      { chinese: '朝如青丝暮成雪。', pinyin: 'zhāo rú qīng sī mù chéng xuě.' },
      { chinese: '人生得意须尽欢，', pinyin: 'rén shēng dé yì xū jìn huān,' },
      { chinese: '莫使金樽空对月。', pinyin: 'mò shǐ jīn zūn kōng duì yuè.' },
      { chinese: '天生我材必有用，', pinyin: 'tiān shēng wǒ cái bì yǒu yòng,' },
      { chinese: '千金散尽还复来。', pinyin: 'qiān jīn sàn jìn hái fù lái.' },
      { chinese: '烹羊宰牛且为乐，', pinyin: 'pēng yáng zǎi niú qiě wéi lè,' },
      { chinese: '会须一饮三百杯。', pinyin: 'huì xū yī yǐn sān bǎi bēi.' },
      { chinese: '岑夫子，丹丘生，', pinyin: 'cén fū zǐ, dān qiū shēng,' },
      { chinese: '将进酒，杯莫停。', pinyin: 'jiāng jìn jiǔ, bēi mò tíng.' },
      { chinese: '与君歌一曲，', pinyin: 'yǔ jūn gē yī qǔ,' },
      { chinese: '请君为我倾耳听。', pinyin: 'qǐng jūn wèi wǒ qīng ěr tīng.' },
      { chinese: '钟鼓馔玉不足贵，', pinyin: 'zhōng gǔ zhuàn yù bù zú guì,' },
      { chinese: '但愿长醉不愿醒。', pinyin: 'dàn yuàn cháng zuì bù yuàn xǐng.' },
      { chinese: '古来圣贤皆寂寞，', pinyin: 'gǔ lái shèng xián jiē jì mò,' },
      { chinese: '惟有饮者留其名。', pinyin: 'wéi yǒu yǐn zhě liú qí míng.' },
      { chinese: '陈王昔时宴平乐，', pinyin: 'chén wáng xī shí yàn píng lè,' },
      { chinese: '斗酒十千恣欢谑。', pinyin: 'dǒu jiǔ shí qiān zì huān xuè.' },
      { chinese: '主人何为言少钱，', pinyin: 'zhǔ rén hé wéi yán shǎo qián,' },
      { chinese: '径须沽取对君酌。', pinyin: 'jìng xū gū qǔ duì jūn zhuó.' },
      { chinese: '五花马，千金裘，', pinyin: 'wǔ huā mǎ, qiān jīn qiú,' },
      { chinese: '呼儿将出换美酒，', pinyin: 'hū ér jiāng chū huàn měi jiǔ,' },
      { chinese: '与尔同销万古愁。', pinyin: 'yǔ ěr tóng xiāo wàn gǔ chóu.' },
    ],
    traditionalChinese: '君不見，黃河之水天上來，奔流到海不復回。君不見，高堂明鏡悲白髮，朝如青絲暮成雪。人生得意須盡歡，莫使金樽空對月。天生我材必有用，千金散盡還復來。烹羊宰牛且為樂，會須一飲三百杯。岑夫子，丹丘生，將進酒，杯莫停。與君歌一曲，請君為我傾耳聽。鐘鼓饌玉不足貴，但願長醉不願醒。古來聖賢皆寂寞，惟有飲者留其名。陳王昔時宴平樂，斗酒十千恣歡謔。主人何為言少錢，徑須沽取對君酌。五花馬，千金裘，呼兒將出換美酒，與爾同銷萬古愁。',
    translation: 'Do you not see the waters of the Yellow River come from heaven, rushing to the sea, never to return? Do you not see the mirrors in high halls reflecting white hair in grief — black silk at dawn, snow by dusk? When life goes well, enjoy it to the fullest; don\'t let your golden cup sit empty under the moon. Heaven gave me talents that must be put to use; a thousand gold coins spent will all come back again. Roast your mutton, slaughter your cattle, and make merry — we must drink three hundred cups in one sitting! Master Cen, young Danqiu — bring in the wine, don\'t stop the cups! Let me sing you a song — please lend me your ears and listen. Bells, drums, fine food and jade are not what I prize — I only wish to stay drunk and never wake up. Since ancient times, sages and wise men have all been forgotten — only the great drinkers leave their names behind. The Prince of Chen once feasted at the Pleasure Palace, spending ten thousand on wine and reveling freely. Why does our host say he has too little money? Just go buy more wine so we can drink together! My dappled horse, my thousand-gold fur coat — call the boy to take them out and trade for fine wine, and together we\'ll dissolve the sorrows of ten thousand ages.',
    background: 'This is Li Bai\'s most famous drinking poem and one of the greatest Chinese poems ever written. He composed it around 752 AD while visiting friends Cen Xun and Danqiu in the mountains. The poem is a defiant celebration of life in the face of mortality, a rebellion against the conventional values of wealth and status, and a passionate argument for living fully in the present moment.',
    analysis: 'The poem opens with two of the grandest images in Chinese poetry: the Yellow River flowing from heaven and hair turning from black to white in a single day. Both convey the terrifying speed at which life passes. From this existential crisis, Li Bai pivots not to despair but to ecstasy — if life is short, then seize joy now. The escalation is relentless: drink 300 cups, never stop, trade your horse and furs for more wine. The line "天生我材必有用" (Heaven gave me talents that must be used) has become one of the most motivational phrases in Chinese, while "与尔同销万古愁" (together dissolve the sorrows of ten thousand ages) captures the poem\'s defiant spirit.',
    form: 'Ancient Verse (古体诗)',
    theme: 'Life & Philosophy',
  },
  {
    id: 'P020',
    slug: 'qiantang-lake-spring-walk',
    title: 'Spring Walk by Qiantang Lake',
    titleChinese: '钱塘湖春行',
    titlePinyin: 'Qián Táng Hú Chūn Xíng',
    poet: {
      name: 'Bai Juyi',
      nameChinese: '白居易',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '772',
      deathYear: '846',
      bio: 'Bai Juyi was one of the most prolific and popular Tang Dynasty poets, known as the \'Poet King\' (诗王). He championed plain, accessible language in poetry and served as governor of both Hangzhou and Suzhou. His works include the epic narrative poems \'Song of Everlasting Sorrow\' and \'The Pipa Player\'.',
    },
    lines: [
      { chinese: '孤山寺北贾亭西，', pinyin: 'gū shān sì běi jiǎ tíng xī,' },
      { chinese: '水面初平云脚低。', pinyin: 'shuǐ miàn chū píng yún jiǎo dī.' },
      { chinese: '几处早莺争暖树，', pinyin: 'jǐ chù zǎo yīng zhēng nuǎn shù,' },
      { chinese: '谁家新燕啄春泥。', pinyin: 'shuí jiā xīn yàn zhuó chūn ní.' },
      { chinese: '乱花渐欲迷人眼，', pinyin: 'luàn huā jiàn yù mí rén yǎn,' },
      { chinese: '浅草才能没马蹄。', pinyin: 'qiǎn cǎo cái néng mò mǎ tí.' },
      { chinese: '最爱湖东行不足，', pinyin: 'zuì ài hú dōng xíng bù zú,' },
      { chinese: '绿杨阴里白沙堤。', pinyin: 'lǜ yáng yīn lǐ bái shā dī.' },
    ],
    traditionalChinese: '孤山寺北賈亭西，水面初平雲腳低。幾處早鶯爭暖樹，誰家新燕啄春泥。亂花漸欲迷人眼，淺草才能沒馬蹄。最愛湖東行不足，綠楊陰裏白沙堤。',
    translation: 'North of Solitary Hill Temple, west of Jia Pavilion, the water surface has just leveled, the low clouds skim the waves. Here and there, early orioles compete for warm trees; whose new swallows are pecking at spring mud? Wild flowers are gradually becoming dazzling to the eyes; the shallow grass can barely cover the horse\'s hooves. What I love most is the east of the lake where I never walk enough — the white sand causeway amid the shade of green willows.',
    background: 'Written around 822 AD when Bai Juyi served as governor of Hangzhou, this poem captures the beauty of West Lake (Qiantang Lake) in early spring. Bai Juyi was a devoted lover of West Lake and built the famous causeway (Bai Causeway) that still bears his name today.',
    analysis: 'This poem is a masterclass in capturing the exact moment of early spring. Each couplet adds a new sensory detail: the risen water level, the competing orioles, the nest-building swallows, the blooming flowers, and the young grass. The progression from distant landscape to close-up details creates a cinematic walk around the lake. The final couplet reveals the poet\'s deep personal attachment to this place.',
    form: 'Seven-character Regulated Verse (七言律诗)',
    theme: 'Seasons & Time',
  },
  {
    id: 'P021',
    slug: 'untitled-hard-to-meet',
    title: 'Untitled — Hard to Meet, Hard to Part',
    titleChinese: '无题·相见时难别亦难',
    titlePinyin: 'Wú Tí · Xiāng Jiàn Shí Nán Bié Yì Nán',
    poet: {
      name: 'Li Shangyin',
      nameChinese: '李商隐',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '813',
      deathYear: '858',
      bio: 'Li Shangyin was a Late Tang poet celebrated for his densely allusive and emotionally complex verse. His \'Untitled\' poems are among the most analyzed in Chinese literature, blending romantic passion with political allegory in richly layered imagery.',
    },
    lines: [
      { chinese: '相见时难别亦难，', pinyin: 'xiāng jiàn shí nán bié yì nán,' },
      { chinese: '东风无力百花残。', pinyin: 'dōng fēng wú lì bǎi huā cán.' },
      { chinese: '春蚕到死丝方尽，', pinyin: 'chūn cán dào sǐ sī fāng jìn,' },
      { chinese: '蜡炬成灰泪始干。', pinyin: 'là jù chéng huī lèi shǐ gān.' },
      { chinese: '晓镜但愁云鬓改，', pinyin: 'xiǎo jìng dàn chóu yún bìn gǎi,' },
      { chinese: '夜吟应觉月光寒。', pinyin: 'yè yín yīng jué yuè guāng hán.' },
      { chinese: '蓬山此去无多路，', pinyin: 'péng shān cǐ qù wú duō lù,' },
      { chinese: '青鸟殷勤为探看。', pinyin: 'qīng niǎo yīn qín wèi tàn kàn.' },
    ],
    traditionalChinese: '相見時難別亦難，東風無力百花殘。春蠶到死絲方盡，蠟炬成灰淚始乾。曉鏡但愁雲鬢改，夜吟應覺月光寒。蓬山此去無多路，青鳥殷勤為探看。',
    translation: 'It is hard to meet and hard to part; the east wind is powerless, a hundred flowers wither. The spring silkworm spins silk until it dies; the candle\'s tears dry only when it turns to ash. Facing the morning mirror, she worries her cloud-like hair will change; chanting poems at night, she must feel the moonlight\'s chill. From here to Penglai Mountain, the road is not far — may the blue bird diligently go and look for me.',
    background: 'This is Li Shangyin\'s most famous love poem, likely written in the 840s. Li Shangyin\'s "Untitled" poems are known for their ambiguity — they may reference a forbidden love affair, political frustration, or spiritual longing. The third couplet ("spring silkworm" and "candle tears") has become one of the most quoted lines in all Chinese poetry.',
    analysis: 'The poem\'s genius lies in its layered metaphors. The silkworm\'s thread (丝/sī) is a homophone for longing (思/sī), so "the silkworm spins until death" means "my longing ends only in death." The candle weeping wax tears mirrors the lover\'s endless grief. Every image reinforces the theme of devotion unto death. The final couplet introduces hope through the mythical blue bird messenger of the Queen Mother of the West, suggesting that even across impossible distances, love seeks connection.',
    form: 'Seven-character Regulated Verse (七言律诗)',
    theme: 'Love & Longing',
  },
  {
    id: 'P022',
    slug: 'mountain-walk',
    title: 'Mountain Walk',
    titleChinese: '山行',
    titlePinyin: 'Shān Xíng',
    poet: {
      name: 'Du Mu',
      nameChinese: '杜牧',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '803',
      deathYear: '852',
      bio: 'Du Mu, known as \'Little Du\' to distinguish him from Du Fu, was a Late Tang poet famous for his elegant quatrains and lyrical reflections on history. His poetry combines sharp observation with a melancholic awareness of time\'s passage.',
    },
    lines: [
      { chinese: '远上寒山石径斜，', pinyin: 'yuǎn shàng hán shān shí jìng xié,' },
      { chinese: '白云生处有人家。', pinyin: 'bái yún shēng chù yǒu rén jiā.' },
      { chinese: '停车坐爱枫林晚，', pinyin: 'tíng chē zuò ài fēng lín wǎn,' },
      { chinese: '霜叶红于二月花。', pinyin: 'shuāng yè hóng yú èr yuè huā.' },
    ],
    traditionalChinese: '遠上寒山石徑斜，白雲生處有人家。停車坐愛楓林晚，霜葉紅於二月花。',
    translation: 'Far up the cold mountain, the stone path winds; where white clouds rise, there are homes. I stop my carriage, enchanted by the maple forest at dusk — frost-touched leaves are redder than the flowers of February.',
    background: 'Written during an autumn excursion, this poem captures Du Mu\'s journey up a mountain path. Du Mu, known as "Little Du" (小杜) to distinguish him from Du Fu ("Old Du"), was celebrated for his elegant and vivid quatrains. This poem has become the definitive Chinese poem about autumn scenery.',
    analysis: 'In just four lines, Du Mu creates a complete journey: the winding path, the distant homes in the clouds, the sudden stop, and the breathtaking revelation. The final line is the poem\'s stroke of genius — comparing autumn\'s red maple leaves favorably to spring\'s flowers, subverting the Chinese poetic tradition that usually mourns autumn and celebrates spring. The word "坐" (zuò, "because") rather than its homophone meaning "sit" shows the poet is compelled to stop, not choosing to rest.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Seasons & Time',
  },
  {
    id: 'P023',
    slug: 'visiting-old-friends-farm',
    title: 'Visiting an Old Friend\'s Farm',
    titleChinese: '过故人庄',
    titlePinyin: 'Guò Gù Rén Zhuāng',
    poet: {
      name: 'Meng Haoran',
      nameChinese: '孟浩然',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '689',
      deathYear: '740',
      bio: 'Meng Haoran was the great pastoral poet of the Tang Dynasty and a close friend of Li Bai and Wang Wei. Unlike most major Tang poets, he never held an official position, instead choosing a reclusive life close to nature near his hometown in Hubei.',
    },
    lines: [
      { chinese: '故人具鸡黍，', pinyin: 'gù rén jù jī shǔ,' },
      { chinese: '邀我至田家。', pinyin: 'yāo wǒ zhì tián jiā.' },
      { chinese: '绿树村边合，', pinyin: 'lǜ shù cūn biān hé,' },
      { chinese: '青山郭外斜。', pinyin: 'qīng shān guō wài xié.' },
      { chinese: '开轩面场圃，', pinyin: 'kāi xuān miàn chǎng pǔ,' },
      { chinese: '把酒话桑麻。', pinyin: 'bǎ jiǔ huà sāng má.' },
      { chinese: '待到重阳日，', pinyin: 'dài dào chóng yáng rì,' },
      { chinese: '还来就菊花。', pinyin: 'hái lái jiù jú huā.' },
    ],
    traditionalChinese: '故人具雞黍，邀我至田家。綠樹村邊合，青山郭外斜。開軒面場圃，把酒話桑麻。待到重陽日，還來就菊花。',
    translation: 'My old friend prepared chicken and millet, and invited me to his farmhouse. Green trees enclose the village; blue mountains slope beyond the outer wall. We open the window facing the garden and threshing floor, and over wine we talk of mulberry and hemp. When the Double Ninth Festival comes, I\'ll return to enjoy the chrysanthemums.',
    background: 'This poem captures a simple visit to a friend\'s rural home. Meng Haoran, who spent most of his life as a recluse near his hometown in Hubei, was the great poet of pastoral life. Unlike many Tang poets who sought official careers, Meng Haoran chose to live close to nature, and this poem embodies his ideal of rustic contentment.',
    analysis: 'The beauty of this poem is its perfect simplicity. There is no grand metaphor, no philosophical meditation — just a friend\'s invitation, good food, beautiful scenery, wine, conversation about farming, and a promise to return. The middle couplets paint an idyllic rural scene: green trees surrounding the village, mountains beyond, a window opening onto fields. The poem\'s warmth comes from its complete absence of pretension, making it one of the most beloved friendship poems in Chinese literature.',
    form: 'Five-character Regulated Verse (五言律诗)',
    theme: 'Friendship & Farewell',
  },
  {
    id: 'P024',
    slug: 'seeing-off-xin-jian-at-lotus-tower',
    title: 'Seeing Off Xin Jian at Lotus Tower',
    titleChinese: '芙蓉楼送辛渐',
    titlePinyin: 'Fú Róng Lóu Sòng Xīn Jiàn',
    poet: {
      name: 'Wang Changling',
      nameChinese: '王昌龄',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '698',
      deathYear: '756',
      bio: 'Wang Changling was known as the \'Sage of Seven-character Quatrains\' for his mastery of the form. He excelled at frontier poetry and farewell poems, combining vivid imagery with deep emotion in remarkably concise verse.',
    },
    lines: [
      { chinese: '寒雨连江夜入吴，', pinyin: 'hán yǔ lián jiāng yè rù wú,' },
      { chinese: '平明送客楚山孤。', pinyin: 'píng míng sòng kè chǔ shān gū.' },
      { chinese: '洛阳亲友如相问，', pinyin: 'luò yáng qīn yǒu rú xiāng wèn,' },
      { chinese: '一片冰心在玉壶。', pinyin: 'yī piàn bīng xīn zài yù hú.' },
    ],
    traditionalChinese: '寒雨連江夜入吳，平明送客楚山孤。洛陽親友如相問，一片冰心在玉壺。',
    translation: 'Cold rain merges with the river, entering Wu by night; at dawn I see off my friend, the Chu mountains stand alone. If friends and family in Luoyang ask about me — my heart is pure as ice in a jade vessel.',
    background: 'Written around 742 AD when Wang Changling was stationed in the south, far from the capital. His friend Xin Jian was heading back to Luoyang, and Wang Changling composed this farewell at Lotus Tower (in present-day Zhenjiang, Jiangsu). Known as the "Sage of Seven-character Quatrains," Wang Changling was at this time serving in a minor post after being demoted from the capital.',
    analysis: 'The poem moves from the vast to the intimate: night rain over the river, the lonely mountain at dawn, then the personal message. The final line — "一片冰心在玉壶" (a piece of ice heart in a jade vessel) — has become a classic expression of moral purity. Despite his demotion and exile, Wang Changling\'s heart remains uncorrupted. The "ice in jade" metaphor conveys both transparency and preciousness, a declaration of integrity that transcends his circumstances.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'Friendship & Farewell',
  },
  {
    id: 'P025',
    slug: 'the-fisherman',
    title: 'The Fisherman',
    titleChinese: '渔翁',
    titlePinyin: 'Yú Wēng',
    poet: {
      name: 'Liu Zongyuan',
      nameChinese: '柳宗元',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '773',
      deathYear: '819',
      bio: 'Liu Zongyuan was a leading prose stylist and poet of the Tang Dynasty, one of the \'Eight Great Prose Masters.\' After a failed political reform, he was exiled to the remote south, where he wrote some of the most celebrated nature poetry and philosophical prose in Chinese literature.',
    },
    lines: [
      { chinese: '渔翁夜傍西岩宿，', pinyin: 'yú wēng yè bàng xī yán sù,' },
      { chinese: '晓汲清湘燃楚竹。', pinyin: 'xiǎo jí qīng xiāng rán chǔ zhú.' },
      { chinese: '烟销日出不见人，', pinyin: 'yān xiāo rì chū bù jiàn rén,' },
      { chinese: '欸乃一声山水绿。', pinyin: 'ǎi nǎi yī shēng shān shuǐ lǜ.' },
      { chinese: '回看天际下中流，', pinyin: 'huí kàn tiān jì xià zhōng liú,' },
      { chinese: '岩上无心云相逐。', pinyin: 'yán shàng wú xīn yún xiāng zhú.' },
    ],
    traditionalChinese: '漁翁夜傍西巖宿，曉汲清湘燃楚竹。煙銷日出不見人，欸乃一聲山水綠。回看天際下中流，巖上無心雲相逐。',
    translation: 'The old fisherman sleeps by the western cliff at night; at dawn he draws clear Xiang River water and burns Chu bamboo. When the mist clears and the sun rises, he\'s nowhere to be seen — the creak of his oar, and the mountains and water turn green. Looking back at the sky\'s edge, he drifts mid-stream; above the cliff, carefree clouds chase one another.',
    background: 'Written during Liu Zongyuan\'s exile in Yongzhou (modern Hunan) around 810 AD. After being banished from the capital for his role in a failed political reform, Liu Zongyuan spent a decade in the remote south. This poem reflects his spiritual state — the fisherman is both a real figure and a projection of the poet\'s desire for freedom from worldly concerns.',
    analysis: 'The fourth line is one of the most celebrated in Chinese poetry: "欸乃一声山水绿" — a single sound of an oar, and suddenly the whole landscape turns green. It\'s a synesthetic masterpiece: sound transforms into color. The fisherman appears and vanishes like a spirit of the landscape. The final image of "mindless clouds" (无心云) chasing each other symbolizes the ideal Daoist state of acting without intention. Su Shi later suggested the final couplet was unnecessary, but most readers treasure its contemplative closure.',
    form: 'Seven-character Ancient Verse (七言古诗)',
    theme: 'Seasons & Time',
  },
  {
    id: 'P026',
    slug: 'song-of-liangzhou',
    title: 'Song of Liangzhou',
    titleChinese: '凉州词',
    titlePinyin: 'Liáng Zhōu Cí',
    poet: {
      name: 'Wang Zhihuan',
      nameChinese: '王之涣',
      dynasty: 'Tang Dynasty',
      dynastyChinese: '唐代',
      birthYear: '688',
      deathYear: '742',
      bio: 'Wang Zhihuan was a Tang Dynasty poet famous for his frontier poetry. Though only six of his poems survive, two of them — \'Climbing Stork Tower\' and \'Song of Liangzhou\' — are among the most beloved and frequently recited poems in the Chinese language.',
    },
    lines: [
      { chinese: '黄河远上白云间，', pinyin: 'huáng hé yuǎn shàng bái yún jiān,' },
      { chinese: '一片孤城万仞山。', pinyin: 'yī piàn gū chéng wàn rèn shān.' },
      { chinese: '羌笛何须怨杨柳，', pinyin: 'qiāng dí hé xū yuàn yáng liǔ,' },
      { chinese: '春风不度玉门关。', pinyin: 'chūn fēng bù dù yù mén guān.' },
    ],
    traditionalChinese: '黃河遠上白雲間，一片孤城萬仞山。羌笛何須怨楊柳，春風不度玉門關。',
    translation: 'The Yellow River rises far into the white clouds; a lonely fortress city stands amid mountains ten thousand feet high. Why should the Qiang flute complain about the willows? The spring wind never crosses the Jade Gate Pass.',
    background: 'One of the greatest frontier poems (边塞诗) of the Tang Dynasty. Wang Zhihuan wrote this while stationed at the northwestern border. Liangzhou (modern Wuwei, Gansu) was a frontier garrison town on the Silk Road. The Jade Gate Pass (Yumen Guan) marked the western boundary of the Chinese empire, beyond which lay the vast desert of Central Asia.',
    analysis: 'The poem builds from the grandest possible image — the Yellow River seeming to flow upward into the clouds — to the intimate sound of a soldier\'s flute. The "willow" in the third line references the folk song "Breaking Willows" (折杨柳), traditionally played at partings, as travelers would break willow branches as farewell gifts. The final line is devastating in its simplicity: the spring wind (warmth, civilization, home) literally cannot reach this place beyond the pass. It expresses the loneliness of frontier soldiers with an understatement that makes it all the more powerful.',
    form: 'Seven-character Quatrain (七言绝句)',
    theme: 'War & Frontier',
  },
];

// Helper functions
let cachedPoems: Poem[] | null = null;

export function getAllPoems(): Poem[] {
  if (cachedPoems) return cachedPoems;
  cachedPoems = poems;
  return cachedPoems;
}

export function getPoemBySlug(slug: string): Poem | undefined {
  return poems.find(p => p.slug === slug);
}

export function getPoemsByTheme(theme: string): Poem[] {
  return poems.filter(p => p.theme === theme);
}

export function getPoemsByPoet(poetName: string): Poem[] {
  return poems.filter(p => p.poet.name === poetName);
}

export function getRelatedPoems(slug: string, limit: number = 4): Poem[] {
  const poem = getPoemBySlug(slug);
  if (!poem) return [];

  // First, get same poet's other poems
  const samePoet = poems.filter(p => p.slug !== slug && p.poet.name === poem.poet.name);
  // Then same theme
  const sameTheme = poems.filter(p => p.slug !== slug && p.poet.name !== poem.poet.name && p.theme === poem.theme);
  // Then fill with others
  const others = poems.filter(p => p.slug !== slug && p.poet.name !== poem.poet.name && p.theme !== poem.theme);

  return [...samePoet, ...sameTheme, ...others].slice(0, limit);
}

export function getUniquePoets(): Poet[] {
  const seen = new Set<string>();
  const poets: Poet[] = [];
  for (const poem of poems) {
    if (!seen.has(poem.poet.name)) {
      seen.add(poem.poet.name);
      poets.push(poem.poet);
    }
  }
  return poets;
}

export function loadTranslatedPoems(lang: string): TranslatedPoem[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'translations', lang, 'poems.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as TranslatedPoem[];
  } catch {
    // Fallback to English if translation doesn't exist
    return poems.map(poem => ({
      ...poem,
      originalSlug: poem.slug,
    }));
  }
}

export function getTranslatedPoemBySlug(slug: string, lang: string): TranslatedPoem | undefined {
  const translated = loadTranslatedPoems(lang);
  return translated.find(p => p.slug === slug || p.originalSlug === slug);
}
