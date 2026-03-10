import fs from 'fs';
import path from 'path';
import { getAllPoems, type Poem } from './poems';

export type PoetProfile = {
  slug: string;
  name: string;
  nameChinese: string;
  nameTraditional: string;
  courtesy: string;
  courtesyChinese: string;
  dynasty: string;
  dynastyChinese: string;
  birthYear: string;
  deathYear: string;
  title: string;
  bio: string;
  style: string;
  legacy: string;
  famousLines: { chinese: string; pinyin: string; english: string; from: string }[];
  relatedIdioms?: string[];
};

export type TranslatedPoetProfile = PoetProfile & {
  originalSlug: string;
};

export const poetProfiles: PoetProfile[] = [
  {
    slug: 'li-bai',
    name: 'Li Bai',
    nameChinese: '李白',
    nameTraditional: '李白',
    courtesy: 'Taibai',
    courtesyChinese: '字太白',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '701',
    deathYear: '762',
    title: 'The Immortal Poet (诗仙)',
    bio: 'Li Bai (701–762) is widely regarded as the greatest romantic poet in Chinese history and one of the two towering figures of Tang Dynasty poetry alongside Du Fu. Born in Suyab (in modern Kyrgyzstan) along the Silk Road, he grew up in Sichuan province. He never succeeded in the imperial examinations but was briefly summoned to the court of Emperor Xuanzong around 742, only to be dismissed after two years — reportedly for his unconventional behavior and drinking. He spent most of his life traveling across China, writing poetry, and cultivating a legendary reputation for genius, eccentricity, and wine.',
    style: 'Li Bai\'s poetry is characterized by bold imagination, effortless spontaneity, and a sense of cosmic grandeur. He frequently employs hyperbole ("three thousand feet," "the Milky Way falling from heaven") that somehow feels natural rather than forced. His verse moves between tender intimacy and sweeping vistas, between drunken abandon and profound loneliness. He drew heavily on Daoist philosophy and mythology, and his best work has an almost supernatural quality — as if the words arrived fully formed. Unlike the meticulous craft of Du Fu, Li Bai\'s genius appears to be pure inspiration.',
    legacy: 'Li Bai\'s influence on Chinese literature is immeasurable. He is the subject of countless legends — that he drowned trying to embrace the moon\'s reflection in a river, that he could compose masterpieces while drunk, that he was a "banished immortal" from heaven. His poems are memorized by every Chinese schoolchild. The expression "诗仙" (Poet-Immortal) has been his title for over a thousand years. His work has been translated into virtually every major language and continues to inspire poets worldwide. In China, he represents the ideal of artistic genius freed from worldly constraints.',
    famousLines: [
      { chinese: '床前明月光，疑是地上霜', pinyin: 'chuáng qián míng yuè guāng, yí shì dì shàng shuāng', english: 'Before my bed, bright moonlight gleams — I wonder if it\'s frost upon the ground', from: 'Quiet Night Thought (静夜思)' },
      { chinese: '天生我材必有用，千金散尽还复来', pinyin: 'tiān shēng wǒ cái bì yǒu yòng, qiān jīn sàn jìn hái fù lái', english: 'Heaven gave me talents that must be put to use; a thousand gold coins spent will all come back again', from: 'Bring in the Wine (将进酒)' },
      { chinese: '飞流直下三千尺，疑是银河落九天', pinyin: 'fēi liú zhí xià sān qiān chǐ, yí shì yín hé luò jiǔ tiān', english: 'Its torrent plunges straight down three thousand feet — as if the Milky Way were falling from the ninth heaven', from: 'Viewing the Waterfall at Mount Lu (望庐山瀑布)' },
    ],
  },
  {
    slug: 'du-fu',
    name: 'Du Fu',
    nameChinese: '杜甫',
    nameTraditional: '杜甫',
    courtesy: 'Zimei',
    courtesyChinese: '字子美',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '712',
    deathYear: '770',
    title: 'The Poet-Sage (诗圣)',
    bio: 'Du Fu (712–770) is revered as the greatest realist poet in Chinese history and stands alongside Li Bai as the supreme figure of Chinese poetry. Born into a scholarly family in Henan, he spent years pursuing an official career but repeatedly failed the examinations. His life was upended by the devastating An Lushan Rebellion (755–763), which killed millions and shattered the Tang Dynasty\'s golden age. Du Fu experienced the war firsthand — capture, flight, poverty, and the loss of a child to starvation. He spent his final years wandering southwestern China in poor health, dying on a boat on the Xiang River at age 58.',
    style: 'Du Fu\'s poetry is defined by its technical perfection, moral seriousness, and unflinching compassion. He is the acknowledged master of regulated verse (律诗), achieving effects of density and precision unmatched in Chinese literature. His work ranges from intimate domestic scenes to sweeping panoramas of war and displacement. Unlike Li Bai\'s inspired spontaneity, Du Fu\'s genius lies in painstaking craft — he reportedly said "I won\'t rest until my words can startle people" (语不惊人死不休). His late poetry achieves a compression and emotional depth that later critics considered the pinnacle of the art.',
    legacy: 'Du Fu was not widely celebrated during his lifetime, but by the Song Dynasty he was recognized as the supreme poet of China. His title "诗圣" (Poet-Sage) reflects both his moral stature and technical mastery. His "Three Officials" and "Three Farewells" poems are considered the finest war poetry in Chinese. His Thatched Cottage in Chengdu is now a major museum and cultural site. Du Fu\'s influence extends far beyond China — in Japan, he is considered the greatest poet who ever lived, and his work has shaped East Asian literary tradition for over a millennium.',
    famousLines: [
      { chinese: '国破山河在，城春草木深', pinyin: 'guó pò shān hé zài, chéng chūn cǎo mù shēn', english: 'The nation is broken, though mountains and rivers remain; the city in spring is overgrown with grass', from: 'Spring View (春望)' },
      { chinese: '烽火连三月，家书抵万金', pinyin: 'fēng huǒ lián sān yuè, jiā shū dǐ wàn jīn', english: 'Beacon fires have burned for three months; a letter from home is worth ten thousand in gold', from: 'Spring View (春望)' },
      { chinese: '无边落木萧萧下，不尽长江滚滚来', pinyin: 'wú biān luò mù xiāo xiāo xià, bú jìn cháng jiāng gǔn gǔn lái', english: 'Boundless falling leaves rustle down; the endless Yangtze rolls and rolls onward', from: 'Climbing High (登高)' },
    ],
  },
  {
    slug: 'wang-wei',
    name: 'Wang Wei',
    nameChinese: '王维',
    nameTraditional: '王維',
    courtesy: 'Mojie',
    courtesyChinese: '字摩诘',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '701',
    deathYear: '761',
    title: 'The Poet-Buddha (诗佛)',
    bio: 'Wang Wei (701–761) was a Tang Dynasty poet, musician, painter, and statesman whose work embodies the intersection of art, nature, and Buddhist spirituality. Born in Shanxi province, he passed the highest imperial examination at a young age and served in various government positions throughout his life. After the death of his wife, he never remarried and increasingly turned to Chan (Zen) Buddhism. He established a mountain retreat at Wangchuan (辋川) in the Zhongnan Mountains, where he composed many of his most celebrated poems.',
    style: 'Wang Wei\'s poetry is celebrated for its meditative stillness, sensory precision, and spiritual depth. Su Shi (Su Dongpo) famously said of him: "In his poems there are paintings, and in his paintings there are poems" (诗中有画，画中有诗). His nature poetry achieves a luminous quietness that reflects his Buddhist practice — finding profound meaning in apparently simple observations of light, shadow, sound, and silence. His landscapes feel inhabited by a consciousness that is fully present yet completely at peace.',
    legacy: 'Wang Wei is one of the "Three Great Poets of the Tang" alongside Li Bai and Du Fu, and is the defining figure of Chinese landscape poetry. His title "诗佛" (Poet-Buddha) reflects the spiritual dimension of his work. His influence extends to Chinese painting — he is traditionally credited as the founder of the Southern School of Chinese landscape painting. His "Wang River Collection" (辋川集) is considered one of the greatest poetry sequences in Chinese literature. His poems continue to be studied as models of how art can express meditative consciousness.',
    famousLines: [
      { chinese: '空山不见人，但闻人语响', pinyin: 'kōng shān bú jiàn rén, dàn wén rén yǔ xiǎng', english: 'In the empty mountains, no one can be seen — yet voices echo from somewhere', from: 'Deer Enclosure (鹿柴)' },
      { chinese: '劝君更尽一杯酒，西出阳关无故人', pinyin: 'quàn jūn gèng jìn yī bēi jiǔ, xī chū yáng guān wú gù rén', english: 'I urge you to drink one more cup of wine — west of Yang Pass, you will have no old friends', from: 'Farewell to Yuan Er (送元二使安西)' },
    ],
  },
  {
    slug: 'bai-juyi',
    name: 'Bai Juyi',
    nameChinese: '白居易',
    nameTraditional: '白居易',
    courtesy: 'Letian',
    courtesyChinese: '字乐天',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '772',
    deathYear: '846',
    title: 'The People\'s Poet',
    bio: 'Bai Juyi (772–846) was one of the most prolific and popular poets of the Tang Dynasty, renowned for writing in a clear, accessible style that could be understood by common people. Legend says he would read his poems to an old woman and revise anything she couldn\'t understand. He had a successful official career, rising to high positions before being exiled for his outspoken criticism of government policy. His narrative poems, especially "Song of Everlasting Regret" (长恨歌) about Emperor Xuanzong and Yang Guifei, are among the most beloved works in Chinese literature.',
    style: 'Bai Juyi deliberately cultivated a plain, direct style, believing that poetry should serve as social commentary accessible to all. His "New Yuefu" (新乐府) poems directly addressed social injustices — corruption, military conscription, poverty, and the excesses of the wealthy. Despite this accessibility, his best work achieves remarkable emotional depth and narrative power. His long ballads combine storytelling skill with lyric beauty, while his shorter poems demonstrate that simplicity and profundity are not mutually exclusive.',
    legacy: 'Bai Juyi was enormously popular during his lifetime — his poems were copied on walls and sung in streets across China. His influence was particularly strong in Japan, where he was considered the greatest Chinese poet for centuries (more popular there than Li Bai or Du Fu). His emphasis on clarity and social relevance influenced generations of Chinese writers. "Song of Everlasting Regret" has been adapted into operas, films, and novels. His famous couplet "Wildfire cannot burn them away; spring wind blows and they grow once more" from "Grasses" remains one of the most quoted lines in Chinese.',
    famousLines: [
      { chinese: '野火烧不尽，春风吹又生', pinyin: 'yě huǒ shāo bù jìn, chūn fēng chuī yòu shēng', english: 'Wildfire cannot burn them away; spring wind blows and they grow once more', from: 'Grasses (赋得古原草送别)' },
      { chinese: '离离原上草，一岁一枯荣', pinyin: 'lí lí yuán shàng cǎo, yī suì yī kū róng', english: 'Endless grasses on the plain — each year they wither and flourish again', from: 'Grasses (赋得古原草送别)' },
    ],
  },
  {
    slug: 'li-shangyin',
    name: 'Li Shangyin',
    nameChinese: '李商隐',
    nameTraditional: '李商隱',
    courtesy: 'Yishan',
    courtesyChinese: '字义山',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '813',
    deathYear: '858',
    title: 'Master of Allusion',
    bio: 'Li Shangyin (813–858) was a late Tang Dynasty poet celebrated for his richly allusive, emotionally complex verse. Born into a declining gentry family, he showed early literary promise and passed the imperial examination with the help of a patron. However, he became trapped in factional politics — his marriage to the daughter of one political faction alienated the other, effectively ending his chances of advancement. He spent his career in minor provincial posts, suffering from political frustration and personal grief, including the early death of his wife.',
    style: 'Li Shangyin\'s poetry is renowned for its dense layers of meaning, rich imagery, and emotional ambiguity. His "Untitled Poems" (无题诗) are among the most debated works in Chinese literature — scholars have argued for centuries about whether they describe romantic love, political allegory, or spiritual longing. His verse is characterized by sensuous imagery (candles, rain, silk, jade), intricate allusions to mythology and history, and a melancholic beauty that suggests meanings just beyond reach. He pushed the Chinese poetic language to new levels of complexity and sophistication.',
    legacy: 'Li Shangyin, together with Du Mu, is known as the "Little Li and Du" (小李杜), echoing the "Great Li and Du" (Li Bai and Du Fu). His influence on Chinese love poetry is profound — his imagery of candles, rain, and separated lovers became enduring literary conventions. His line "The spring silkworm\'s thread ends only when it dies" (春蚕到死丝方尽) remains one of the most famous expressions of devotion in Chinese. Modern scholars and readers continue to find new interpretations in his deliberately ambiguous verse.',
    famousLines: [
      { chinese: '君问归期未有期，巴山夜雨涨秋池', pinyin: 'jūn wèn guī qī wèi yǒu qī, bā shān yè yǔ zhǎng qiū chí', english: 'You ask when I will return — there is no date set. The night rain on Mount Ba swells the autumn pools', from: 'Night Rain — Letter to the North (夜雨寄北)' },
      { chinese: '何当共剪西窗烛，却话巴山夜雨时', pinyin: 'hé dāng gòng jiǎn xī chuāng zhú, què huà bā shān yè yǔ shí', english: 'When will we sit together trimming candles by the west window, and talk about this night of rain?', from: 'Night Rain — Letter to the North (夜雨寄北)' },
    ],
  },
  {
    slug: 'du-mu',
    name: 'Du Mu',
    nameChinese: '杜牧',
    nameTraditional: '杜牧',
    courtesy: 'Muzhi',
    courtesyChinese: '字牧之',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '803',
    deathYear: '852',
    title: 'The Little Du (小杜)',
    bio: 'Du Mu (803–852) was a late Tang Dynasty poet and essayist known for his elegant, often melancholic verse and sharp historical commentary. Born into a prominent family — his grandfather Du You was a prime minister and historian — he passed the imperial examinations and served in various government posts. He was known for his wit, his appreciation of beauty, and his keen awareness of historical decline. His prose essays on military strategy were also highly regarded.',
    style: 'Du Mu\'s poetry is characterized by its elegance, vivid imagery, and a distinctive blend of sensual beauty with historical melancholy. His quatrains are considered among the finest in the Tang Dynasty — each one a perfectly crafted miniature painting with an emotional twist. He excelled at viewing present-day scenes through the lens of historical change, finding poignancy in the contrast between past glory and present decay. His style is more polished and controlled than Li Bai\'s, with a wistfulness that is uniquely his own.',
    legacy: 'Together with Li Shangyin, Du Mu is known as the "Little Li and Du" (小李杜). His "Qingming" poem has become permanently associated with the Tomb-Sweeping Festival — it is virtually impossible to observe Qingming in China without hearing it quoted. His historical poems about the decline of earlier dynasties were read as commentaries on the fading Tang Dynasty, giving them prophetic resonance. His quatrains are studied as models of the form, and his phrase "牧童遥指杏花村" (the shepherd boy points to Apricot Blossom Village) has entered the Chinese imagination as an archetype of rustic beauty.',
    famousLines: [
      { chinese: '清明时节雨纷纷，路上行人欲断魂', pinyin: 'qīng míng shí jié yǔ fēn fēn, lù shàng xíng rén yù duàn hún', english: 'During the Qingming Festival, rain falls thick and fast; travelers on the road are weary to their souls', from: 'Qingming Festival (清明)' },
      { chinese: '借问酒家何处有，牧童遥指杏花村', pinyin: 'jiè wèn jiǔ jiā hé chù yǒu, mù tóng yáo zhǐ xìng huā cūn', english: '"Where can I find a tavern?" — a shepherd boy points to Apricot Blossom Village', from: 'Qingming Festival (清明)' },
    ],
  },
  {
    slug: 'meng-haoran',
    name: 'Meng Haoran',
    nameChinese: '孟浩然',
    nameTraditional: '孟浩然',
    courtesy: 'Haoran',
    courtesyChinese: '名浩然',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '689',
    deathYear: '740',
    title: 'The Hermit Poet',
    bio: 'Meng Haoran (689–740) was one of the most prominent pastoral and nature poets of the Tang Dynasty. Uniquely among major Tang poets, he never held an official government position, choosing instead a life of rural seclusion and travel. He was deeply admired by Li Bai, who wrote a famous poem praising him. He traveled to Chang\'an to seek an official career but failed the examination, and an audience with Emperor Xuanzong reportedly went badly when he recited a poem the emperor found disrespectful. He returned to his home in Hubei and lived among the mountains and rivers.',
    style: 'Meng Haoran\'s poetry is celebrated for its natural simplicity, genuine feeling, and pastoral beauty. He is the defining figure of the "mountain and field" (山水田园) school of Tang poetry. His verse feels unstudied and spontaneous, capturing moments of natural beauty with a freshness that more learned poets envied. Li Bai praised his "clear poetry" that "elevated beyond the mundane world." His best poems achieve their effect through understatement — suggesting deep emotion through apparently simple observations of nature.',
    legacy: 'Meng Haoran is paired with Wang Wei as the "Wang-Meng" (王孟) school of nature poetry, representing the pinnacle of Chinese pastoral verse. His "Spring Morning" (春晓) is one of the first poems every Chinese child learns, making it one of the most widely known poems in any language. His choice of a life outside officialdom influenced generations of Chinese literati who idealized the hermit-poet lifestyle. Li Bai\'s admiration for him ensured his lasting fame — to be praised by Li Bai was the ultimate literary endorsement.',
    famousLines: [
      { chinese: '春眠不觉晓，处处闻啼鸟', pinyin: 'chūn mián bù jué xiǎo, chù chù wén tí niǎo', english: 'In spring sleep, dawn arrives unnoticed — everywhere I hear the birds singing', from: 'Spring Morning (春晓)' },
      { chinese: '夜来风雨声，花落知多少', pinyin: 'yè lái fēng yǔ shēng, huā luò zhī duō shǎo', english: 'Last night came the sound of wind and rain; who knows how many petals have fallen?', from: 'Spring Morning (春晓)' },
    ],
  },
  {
    slug: 'wang-changling',
    name: 'Wang Changling',
    nameChinese: '王昌龄',
    nameTraditional: '王昌齡',
    courtesy: 'Shaobo',
    courtesyChinese: '字少伯',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '698',
    deathYear: '756',
    title: 'Master of Seven-character Quatrains (七绝圣手)',
    bio: 'Wang Changling (698–756) was a High Tang poet considered the supreme master of the seven-character quatrain form. He passed the imperial examination and served in various posts but suffered political setbacks, being demoted twice to remote southern regions. Despite his literary fame, he led a difficult official life. He was killed during the chaos of the An Lushan Rebellion by a jealous local official — a tragically ironic end for a poet who wrote so movingly about the waste of war.',
    style: 'Wang Changling\'s specialty was the seven-character quatrain (七言绝句), in which he achieved a perfection that earned him the title "Saint of Seven-character Quatrains" (七绝圣手). His frontier poems combine martial spirit with deep compassion for common soldiers, avoiding both jingoistic glory and defeatist despair. His palace poems and farewell poems demonstrate equal mastery. Each quatrain is precisely constructed, with a dramatic turn in the final lines that delivers maximum emotional impact in minimum space.',
    legacy: 'Wang Changling\'s "Out on the Frontier" (出塞) is consistently ranked among the greatest Tang quatrains ever written. Its opening line — "The same moon that shone in Qin, the same passes from the Han" — is one of the most recognized lines in Chinese poetry. His mastery of the quatrain form influenced every subsequent poet who worked in the genre. His frontier poetry established a template for how Chinese literature addresses the human cost of war — with dignity, compassion, and a keen sense of historical perspective.',
    famousLines: [
      { chinese: '秦时明月汉时关，万里长征人未还', pinyin: 'qín shí míng yuè hàn shí guān, wàn lǐ cháng zhēng rén wèi huán', english: 'The same moon that shone in Qin, the same passes from the Han — soldiers marched ten thousand miles and have not returned', from: 'Out on the Frontier (出塞)' },
      { chinese: '但使龙城飞将在，不教胡马度阴山', pinyin: 'dàn shǐ lóng chéng fēi jiàng zài, bù jiào hú mǎ dù yīn shān', english: 'If only the Flying General were here, he would never let the enemy horses cross Yin Mountain', from: 'Out on the Frontier (出塞)' },
    ],
  },
  {
    slug: 'liu-zongyuan',
    name: 'Liu Zongyuan',
    nameChinese: '柳宗元',
    nameTraditional: '柳宗元',
    courtesy: 'Zihou',
    courtesyChinese: '字子厚',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '773',
    deathYear: '819',
    title: 'Master of Landscape Prose',
    bio: 'Liu Zongyuan (773–819) was a Tang Dynasty essayist, poet, and political reformer counted among the "Eight Great Prose Masters of the Tang and Song" (唐宋八大家). Born into an aristocratic family in Chang\'an, he passed the imperial examination at a young age and rose quickly in government. In 805, he participated in a political reform movement that failed after only 146 days. The reformers were punished severely — Liu Zongyuan was exiled to Yongzhou (modern Hunan) and later to Liuzhou (modern Guangxi), where he spent the remaining 14 years of his life in isolation.',
    style: 'Liu Zongyuan\'s poetry and prose transform the experience of exile into art of the highest order. His landscape essays ("Eight Records of Yongzhou") are considered the finest nature prose in Classical Chinese, combining precise observation with philosophical depth. His poetry, while smaller in volume, achieves extraordinary effects — "River Snow" creates an entire frozen world in just 20 characters. His writing is characterized by crystalline clarity, structural precision, and an undercurrent of political defiance expressed through natural imagery.',
    legacy: 'Liu Zongyuan\'s "River Snow" (江雪) is one of the most visually iconic Chinese poems, endlessly reproduced in Chinese painting and calligraphy. The image of the lone fisherman in a frozen landscape has become a universal symbol of principled solitude. His prose essays established the standard for Chinese landscape writing and influenced the entire tradition of nature essay through the Ming and Qing dynasties. Together with Han Yu, he led the "Ancient Prose Movement" (古文运动) that reformed Chinese literary style, advocating clarity and substance over ornamental parallelism.',
    famousLines: [
      { chinese: '千山鸟飞绝，万径人踪灭', pinyin: 'qiān shān niǎo fēi jué, wàn jìng rén zōng miè', english: 'From a thousand mountains, birds have vanished; on ten thousand paths, human traces are gone', from: 'River Snow (江雪)' },
      { chinese: '孤舟蓑笠翁，独钓寒江雪', pinyin: 'gū zhōu suō lì wēng, dú diào hán jiāng xuě', english: 'A lone boat, an old man in straw cloak — fishing alone in the cold river snow', from: 'River Snow (江雪)' },
    ],
  },
  {
    slug: 'wang-zhihuan',
    name: 'Wang Zhihuan',
    nameChinese: '王之涣',
    nameTraditional: '王之渙',
    courtesy: 'Jiling',
    courtesyChinese: '字季凌',
    dynasty: 'Tang Dynasty',
    dynastyChinese: '唐代',
    birthYear: '688',
    deathYear: '742',
    title: 'The Visionary Poet',
    bio: 'Wang Zhihuan (688–742) is one of the most remarkable cases in Chinese literary history: a poet whose fame rests on just six surviving poems, two of which rank among the most famous in all of Chinese literature. Born in Shanxi province, he held minor official positions but spent much of his life traveling the northern frontier regions. Little is known about his biography compared to other major Tang poets, which only adds to the mystique surrounding his small but supremely powerful body of work.',
    style: 'Wang Zhihuan\'s surviving poems are characterized by their expansive vision, bold imagery, and philosophical depth achieved in extremely compressed forms. His two masterpieces — "Climbing Stork Tower" and "Song of Liangzhou" — both paint vast panoramas of landscape and then pivot to profound statements about human aspiration or frontier isolation. His vision operates at a cosmic scale: rivers flowing to the sea, the sun setting behind mountains, the Yellow River rising into clouds. Yet this grandeur serves human insight, not mere spectacle.',
    legacy: 'Wang Zhihuan proves that literary immortality requires quality, not quantity. "Climbing Stork Tower" (登鹳雀楼) has become one of the most quoted poems in Chinese — its final lines "climb one more floor" (更上一层楼) are used as a proverb for continuous improvement in everything from education to business. "Song of Liangzhou" (凉州词) is considered the definitive frontier poem. His work is proof that a single perfect poem can outlast thousands of lesser ones.',
    famousLines: [
      { chinese: '欲穷千里目，更上一层楼', pinyin: 'yù qióng qiān lǐ mù, gèng shàng yī céng lóu', english: 'If you wish to see a thousand miles further, climb one more floor of the tower', from: 'Climbing Stork Tower (登鹳雀楼)' },
      { chinese: '白日依山尽，黄河入海流', pinyin: 'bái rì yī shān jìn, huáng hé rù hǎi liú', english: 'The white sun sets behind the mountains; the Yellow River flows into the sea', from: 'Climbing Stork Tower (登鹳雀楼)' },
    ],
  },
];

// Helper functions
export function getAllPoets(): PoetProfile[] {
  return poetProfiles;
}

export function getPoetBySlug(slug: string): PoetProfile | undefined {
  return poetProfiles.find(p => p.slug === slug);
}

export function getPoetPoems(poetName: string): Poem[] {
  return getAllPoems().filter(p => p.poet.name === poetName);
}

export function loadTranslatedPoets(lang: string): TranslatedPoetProfile[] {
  try {
    const filePath = path.join(process.cwd(), 'public', 'translations', lang, 'poets.json');
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data) as TranslatedPoetProfile[];
  } catch {
    return poetProfiles.map(p => ({ ...p, originalSlug: p.slug }));
  }
}

export function getTranslatedPoetBySlug(slug: string, lang: string): TranslatedPoetProfile | undefined {
  const poets = loadTranslatedPoets(lang);
  return poets.find(p => p.slug === slug || p.originalSlug === slug);
}
