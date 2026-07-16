import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export type MythFigure = {
  slug: string;
  name: string;            // common English name US searchers use
  chineseName: string;     // simplified Chinese (verified)
  pinyin: string;
  category: 'deity' | 'creature';
  /** Short role/type label, e.g. "Monkey King · trickster hero" or "Celestial water dragon". */
  role: string;
  /** One-line hook for cards + meta. */
  tagline: string;
  /** 3-4 sentence overview: who/what, defining story, why it matters. */
  overview: string;
  /** The single most useful fact block — the key myth (deity) or symbolism (creature). */
  keyFact: string;
  /** Where modern audiences meet it (films, games, festivals, feng shui, tattoos). */
  significance: string;
  /** Optional "actually…" correction of a common Western misconception. */
  misconception?: string;
  /** Slugs of related figures for cross-linking. */
  related: string[];
  /** Cross-vertical tags: 'journey-to-the-west' | 'black-myth' | 'investiture' | 'feng-shui' | 'new-year' | 'mid-autumn'. */
  tags: string[];
  /** Prefix for any long-form essays tied to this figure. */
  postPrefix: string;
};

export type MythPost = { slug: string; title: string; date: string; description: string };
export type FigureWithPosts = MythFigure & { posts: MythPost[] };

const FIGURES: MythFigure[] = [
  // ————————————————————————— DEITIES & FIGURES —————————————————————————
  {
    slug: 'sun-wukong', name: 'Sun Wukong', chineseName: '孙悟空', pinyin: 'Sūn Wùkōng',
    category: 'deity', role: 'The Monkey King · rebel immortal',
    tagline: 'The stone-born Monkey King who stormed Heaven — Chinese myth\'s great rebel.',
    overview:
      'Born from a stone egg on Flower-Fruit Mountain, Sun Wukong masters Daoist magic, 72 transformations, and cloud-somersault flight, then crowns himself the "Great Sage Equal to Heaven" (齐天大圣). He is the breakout hero of the 16th-century novel Journey to the West (西游记). After the Buddha pins him under a mountain for 500 years, he is freed to escort the monk Tang Sanzang west to fetch Buddhist scriptures, and finally attains Buddhahood himself.',
    keyFact:
      'His "Havoc in Heaven" (大闹天宫) — eating the Queen Mother\'s immortality peaches and Laozi\'s elixir, then fighting off the entire celestial army — is the most famous episode in Chinese mythology. His weapon, the Ruyi Jingu Bang staff, shrinks to a needle he tucks behind his ear.',
    significance:
      'One of the most adapted characters on earth: the 1986 CCTV series a whole generation grew up on, a loose inspiration for Dragon Ball\'s Goku, and the 2024 game Black Myth: Wukong, whose hero retraces his legend.',
    related: ['jade-emperor', 'erlang-shen', 'dragon-king', 'guanyin'],
    tags: ['journey-to-the-west', 'black-myth'], postPrefix: 'myth-sun-wukong-',
  },
  {
    slug: 'nezha', name: 'Nezha', chineseName: '哪吒', pinyin: 'Nézhā',
    category: 'deity', role: 'Rebellious child-god · "Third Prince"',
    tagline: 'The lotus-reborn boy-god who defied a dragon and repaid his own father in flesh.',
    overview:
      'Nezha arrives as a ball of flesh after a pregnancy of three and a half years, third son of the general Li Jing; his fullest story is told in the Ming novel Investiture of the Gods (封神演义). He kills the Dragon King\'s son, and to spare his family from the Dragon King\'s revenge he returns his own flesh and bones to his parents — after which his master resurrects him with a body made of lotus root. He rides Wind-Fire Wheels and wields the Universe Ring and Red Armillary Sash.',
    keyFact:
      'His self-sacrifice — giving his body back to his parents to settle his own debt, then being reborn from lotus — is the defining act of filial atonement and rebellion in the myth.',
    significance:
      'The animated films Ne Zha (2019) and Ne Zha 2 (2025) drove a global surge — Ne Zha 2 became the highest-grossing animated film ever made, the first past $2 billion.',
    misconception:
      'The common Mandarin reading is Nézhā; you may see an older literary reading, Nuózhā, in scholarly sources.',
    related: ['dragon-king', 'erlang-shen', 'jade-emperor'],
    tags: ['investiture'], postPrefix: 'myth-nezha-',
  },
  {
    slug: 'guanyin', name: 'Guanyin', chineseName: '观音', pinyin: 'Guānyīn',
    category: 'deity', role: 'Bodhisattva of compassion · "Goddess of Mercy"',
    tagline: 'The bodhisattva who hears every cry for help — the most revered figure in Chinese Buddhism.',
    overview:
      'The name Guanyin means "Perceiver of the Sounds of the World" — the one who hears all cries for help. She is the Chinese form of the Buddhist bodhisattva Avalokiteśvara, worshipped for compassion and deliverance from suffering, and revered as the patron of mothers, sailors, and the desperate. In Journey to the West she is the bodhisattva who recruits and guides the pilgrims.',
    keyFact:
      'The legend of Princess Miaoshan (妙善): a devout princess martyred by her father who attains enlightenment as Guanyin and gives up her own eyes and arms to heal him — the origin of her thousand-armed iconography.',
    significance:
      'The most widely worshipped deity in Chinese Buddhism and folk religion, with temples across the Chinese world.',
    misconception:
      'Avalokiteśvara was originally depicted as male or gender-neutral in India; in China the figure was gradually feminized and, by about the Ming dynasty, worshipped overwhelmingly as female. The Japanese Kannon and Korean Gwan-eum are the same bodhisattva, not different gods.',
    related: ['sun-wukong', 'jade-emperor'],
    tags: ['journey-to-the-west'], postPrefix: 'myth-guanyin-',
  },
  {
    slug: 'jade-emperor', name: 'Jade Emperor', chineseName: '玉皇大帝', pinyin: 'Yù Huáng Dàdì',
    category: 'deity', role: 'Supreme ruler of Heaven',
    tagline: 'The emperor of Heaven who runs the cosmos like an imperial bureaucracy.',
    overview:
      'Heaven, in Chinese folk religion and Daoism, is run like imperial China — a celestial administration of ministries, records, and gods, and at its head sits the Jade Emperor. He is best known through Journey to the West, where he presides over the court and sends army after army to subdue the rampaging Sun Wukong.',
    keyFact:
      'A folk explanation for the Chinese zodiac names him as the organizer of the Great Race that set the order of the twelve animals.',
    significance:
      'Central to Chinese New Year — his birthday falls on the 9th day of the first lunar month, and the Kitchen God reports each household\'s conduct to him each year.',
    misconception:
      'In formal Daoist theology he actually ranks below the Three Pure Ones (三清), not as the absolute top god — a nuance popular retellings tend to flatten.',
    related: ['sun-wukong', 'erlang-shen', 'zhong-kui'],
    tags: ['journey-to-the-west', 'new-year'], postPrefix: 'myth-jade-emperor-',
  },
  {
    slug: 'nuwa', name: 'Nüwa', chineseName: '女娲', pinyin: 'Nǚwā',
    category: 'deity', role: 'Creator goddess · mother of humanity',
    tagline: 'The serpent-bodied goddess who shaped humans from clay and patched the broken sky.',
    overview:
      'With a woman\'s upper body and a serpent\'s lower body, Nüwa is the primordial mother-goddess of Chinese myth. In the best-known story she creates humans from yellow clay, hand-shaping the first and then flinging mud droplets from a cord to make the rest. She is often paired with Fuxi, the two shown with intertwined tails holding a compass and set-square.',
    keyFact:
      'Mending the Heavens: after the water god Gonggong cracks the sky, Nüwa smelts five-colored stones to patch it and props up the four corners with the legs of a giant turtle.',
    significance:
      'A foundational creation figure; the leftover stone she didn\'t use opens the classic novel Dream of the Red Chamber.',
    related: ['pangu', 'dragon'],
    tags: [], postPrefix: 'myth-nuwa-',
  },
  {
    slug: 'change', name: "Chang'e", chineseName: '嫦娥', pinyin: "Cháng'é",
    category: 'deity', role: 'Goddess of the Moon',
    tagline: 'The goddess who drifted to the Moon — and the reason families gather at Mid-Autumn.',
    overview:
      "High in the Moon Palace, with only the Jade Rabbit for company, lives Chang'e, goddess of the Moon. Wife of the archer Houyi, she ends up taking the elixir of immortality and floats up to the Moon, forever separated from her husband.",
    keyFact:
      'Two canonical versions exist and shouldn\'t be blended: in the sympathetic telling she swallows the elixir to keep a thief from stealing it while Houyi is away; in older, harsher versions she takes it selfishly.',
    significance:
      "Her legend is the heart of the Mid-Autumn Festival (中秋节) — mooncakes and moon-viewing — and she is the namesake of China's Chang'e lunar program.",
    related: ['jade-emperor', 'nuwa'],
    tags: ['mid-autumn'], postPrefix: 'myth-change-',
  },
  {
    slug: 'pangu', name: 'Pangu', chineseName: '盘古', pinyin: 'Pángǔ',
    category: 'deity', role: 'Primordial creator being',
    tagline: 'The giant who cracked the cosmic egg and became the world.',
    overview:
      'Out of chaos, over 18,000 years, a cosmic egg forms — and Pangu, the first living being, hatches from it. He splits the egg, murky yin sinking to form Earth and clear yang rising to form sky, then stands between them and grows daily for another 18,000 years to hold them apart. When he dies, his body becomes the world: his breath the wind, his eyes the sun and moon, his blood the rivers.',
    keyFact:
      'The earliest written versions are attributed to the 3rd-century author Xu Zheng, making this famous creation myth comparatively late in the textual record.',
    significance:
      'The canonical Chinese creation myth and the standard reference point when comparing Chinese cosmogony to other world traditions.',
    related: ['nuwa'],
    tags: [], postPrefix: 'myth-pangu-',
  },
  {
    slug: 'guan-yu', name: 'Guan Yu', chineseName: '关羽', pinyin: 'Guān Yǔ',
    category: 'deity', role: 'Deified general · god of war & loyalty',
    tagline: 'A real Three Kingdoms general who became one of China\'s most worshipped gods.',
    overview:
      'Alone among the figures here, Guan Yu began as a flesh-and-blood man — a general under the warlord Liu Bei in the late Han and Three Kingdoms period, who died in 220 CE and was progressively deified into a god of war, loyalty, and, later, wealth. His mythic image comes chiefly from the 14th-century novel Romance of the Three Kingdoms, which amplified his loyalty and martial virtue.',
    keyFact:
      'The Peach Garden Oath — his sworn brotherhood with Liu Bei and Zhang Fei — and his refusal to betray Liu Bei even when richly honored by the rival Cao Cao make him the archetype of loyalty (义).',
    significance:
      'Red-faced, long-bearded, and holding the Green Dragon Crescent Blade, "Lord Guan" stands in temples, shops, restaurants, and police stations across the Chinese world as a guardian of loyalty and fortune.',
    misconception:
      'Unlike the purely mythical figures here, Guan Yu was a historical person later turned into a god — venerated across Confucianism, Daoism, and Buddhism alike.',
    related: ['guanyin'],
    tags: [], postPrefix: 'myth-guan-yu-',
  },
  {
    slug: 'erlang-shen', name: 'Erlang Shen', chineseName: '二郎神', pinyin: 'Èrláng Shén',
    category: 'deity', role: 'Three-eyed warrior god · demon-subduer',
    tagline: 'The three-eyed god whose truth-seeing eye pierces any disguise.',
    overview:
      'A third, truth-seeing eye in the middle of his forehead marks out Erlang Shen, a warrior deity shown as a handsome young man with a three-pointed, double-bladed glaive and a loyal Roaring Celestial Dog at his side. In later tradition he is identified as Yang Jian, nephew of the Jade Emperor. That third eye sees through any disguise or transformation.',
    keyFact:
      'In Journey to the West he is sent to capture Sun Wukong and fights him to a standstill — his heavenly eye catching through every shape Wukong takes.',
    significance:
      'Rising fast in Western awareness as a secret superboss ("The Sacred Divinity") in Black Myth: Wukong.',
    related: ['sun-wukong', 'jade-emperor', 'nezha'],
    tags: ['journey-to-the-west', 'black-myth', 'investiture'], postPrefix: 'myth-erlang-shen-',
  },
  {
    slug: 'dragon-king', name: 'Dragon King', chineseName: '龙王', pinyin: 'Lóngwáng',
    category: 'deity', role: 'Water & weather god · ruler of the seas',
    tagline: 'The rain-bringing dragon-god of the seas — farmers\' friend, heroes\' foe.',
    overview:
      'From an undersea Crystal Palace, the Dragon King commands water and weather, a shape-shifting dragon-god who can take human form. There are four of him, one per sea and direction — Ao Guang of the East Sea the most prominent — and as rain-bringers they were petitioned by farmers whenever drought struck.',
    keyFact:
      'He clashes with heroes in the great novels: Sun Wukong bullies Ao Guang into giving up the golden staff, and Nezha kills his son Ao Bing — triggering his wrath.',
    significance:
      'Found in temples near water and in Dragon Boat and rain-praying customs, and a recurring authority-figure antagonist in the Nezha and Monkey King films.',
    misconception:
      '"Dragon King" usually means the collective institution of four; when a single one is meant, it is normally Ao Guang of the East Sea.',
    related: ['dragon', 'nezha', 'sun-wukong'],
    tags: ['journey-to-the-west', 'investiture'], postPrefix: 'myth-dragon-king-',
  },
  {
    slug: 'zhong-kui', name: 'Zhong Kui', chineseName: '钟馗', pinyin: 'Zhōng Kuí',
    category: 'deity', role: 'The demon-queller · King of Ghosts',
    tagline: 'The failed scholar who took his own life — and became the underworld\'s demon-hunter.',
    overview:
      'Zhong Kui topped the imperial examination, then was stripped of his rightful first-place rank because the emperor found him too ugly. Humiliated, he took his own life at the palace gates — and in death became King of Ghosts, a hunter and judge of evil spirits, his fearsome face turned against the very demons that frighten the living.',
    keyFact:
      'The origin legend: Emperor Xuanzong of Tang dreamed of Zhong Kui devouring a thieving imp and woke cured of illness. He had the painter Wu Daozi capture the vision, and Zhong Kui\'s portrait became a New Year talisman hung on doorways to ward off evil.',
    significance:
      'A fixture of door-guardian art and New Year customs — and the title character of the upcoming game Black Myth: Zhong Kui.',
    related: ['jade-emperor', 'jiangshi', 'nian'],
    tags: ['black-myth', 'new-year'], postPrefix: 'myth-zhong-kui-',
  },

  // ————————————————————————— CREATURES & BEASTS —————————————————————————
  {
    slug: 'dragon', name: 'Chinese Dragon', chineseName: '龙', pinyin: 'lóng',
    category: 'creature', role: 'Celestial water deity · auspicious beast',
    tagline: 'A benevolent, wingless rain-bringer — the opposite of the Western dragon.',
    overview:
      'Nothing like the fire-breathing beast of the West, the Chinese dragon (lóng) is a divine bringer of water — rain, rivers, seas, floods — and, through water, of harvests and prosperity. A composite of nine animals, it has a long serpentine body, deer-like antlers, whiskers, and eagle claws, and flies without wings. It embodies yang energy and imperial authority: the emperor was called "the son of the dragon."',
    keyFact:
      'Claw count once signaled rank — five claws were reserved for the emperor, four for nobles, three for commoners.',
    significance:
      'The defining Chinese tattoo motif, the centerpiece of Lunar New Year dragon dances and dragon-boat racing, and the root of the phrase "descendants of the dragon" as a marker of Chinese identity.',
    misconception:
      'Fundamentally unlike the Western dragon: it is benevolent, wingless, serpentine, and tied to water and luck — not an evil, hoarding, fire-breathing beast to be slain. Some now romanize it "loong" to break the false equivalence.',
    related: ['dragon-king', 'fenghuang', 'four-symbols'],
    tags: ['feng-shui'], postPrefix: 'myth-dragon-',
  },
  {
    slug: 'fenghuang', name: 'Fenghuang', chineseName: '凤凰', pinyin: 'fènghuáng',
    category: 'creature', role: 'Chinese phoenix · auspicious celestial bird',
    tagline: 'The "Chinese phoenix" — a bird of peace and virtue, not fiery rebirth.',
    overview:
      'Ruler of all birds, the fenghuang appears only when a just ruler reigns and withdraws in times of disorder — a living omen of peace, virtue, and cosmic harmony. A composite bird in five ceremonial colors, it originally combined the male 凤 (fèng) and female 凰 (huáng); the pair later merged into a single feminine symbol, the empress to the dragon\'s emperor.',
    keyFact:
      'Paired with the dragon, it is one of the most common Chinese wedding motifs — the dragon-and-phoenix representing husband and wife in perfect balance.',
    significance:
      'A common tattoo, jewelry, and wedding design, and a recurring figure in film and animation.',
    misconception:
      'Do not equate it with the Greek/Egyptian phoenix that burns and rises reborn from ash. Classical Chinese sources give the fenghuang no fire-death-and-rebirth cycle — that association is a modern graft. Its core meaning is auspicious omen and harmony.',
    related: ['dragon', 'four-symbols', 'qilin'],
    tags: [], postPrefix: 'myth-fenghuang-',
  },
  {
    slug: 'qilin', name: 'Qilin', chineseName: '麒麟', pinyin: 'qílín',
    category: 'creature', role: 'Benevolent omen-beast · "Chinese unicorn"',
    tagline: 'A gentle chimera whose arrival heralds a sage — and the origin of the word "kirin."',
    overview:
      'Gentle enough, legend says, to walk without crushing a blade of grass or harming an insect, the qilin is a benevolent omen-beast despite its fierce composite look — a deer\'s body, ox tail, hooves, scaled dragon-like skin, and one or two horns. Its appearance marks the birth or death of a sage; tradition links it to Confucius. It punishes only the wicked.',
    keyFact:
      'When Zheng He\'s 15th-century fleet brought back a giraffe, it was hailed as a living qilin — which is why the modern Japanese word for giraffe, "kirin," uses the very same characters (麒麟).',
    significance:
      'A common feng shui statue for protection and fertility (often placed in pairs), and a familiar figure in games under its Japanese reading, "kirin."',
    misconception:
      'The "Chinese unicorn" nickname is loose — the qilin usually has two horns, not one. Japan\'s kirin and Korea\'s girin derive directly from it.',
    related: ['dragon', 'fenghuang', 'bai-ze'],
    tags: ['feng-shui'], postPrefix: 'myth-qilin-',
  },
  {
    slug: 'nine-tailed-fox', name: 'Nine-Tailed Fox', chineseName: '九尾狐', pinyin: 'jiǔwěihú',
    category: 'creature', role: 'Shapeshifting fox spirit (húlijīng)',
    tagline: 'Auspicious omen in one text, life-draining seductress in the next.',
    overview:
      'The nine-tailed fox, or fox spirit (húlijīng, 狐狸精), is morally ambivalent in Chinese tradition — an auspicious omen in early texts like the Classic of Mountains and Seas, a devouring seductress in others. A fox gains power and extra tails as it ages, up to nine at full potency, and can transform into a beautiful human — in demonized form draining a partner\'s yang life-essence.',
    keyFact:
      'The archetypal malevolent example is Daji, the fox-possessed consort blamed for the fall of the Shang dynasty in Investiture of the Gods.',
    significance:
      'Everywhere in modern C-dramas, xianxia novels, games, and tattoos; "húlijīng" is still a live insult meaning a home-wrecking seductress.',
    misconception:
      'Don\'t conflate three traditions: the Chinese húlijīng is morally mixed; the Japanese kitsune is the most benevolent and divine (tied to the god Inari); the Korean gumiho is almost always malevolent.',
    related: ['zhong-kui', 'jiangshi', 'nuwa'],
    tags: ['investiture'], postPrefix: 'myth-nine-tailed-fox-',
  },
  {
    slug: 'pixiu', name: 'Pixiu', chineseName: '貔貅', pinyin: 'píxiū',
    category: 'creature', role: 'Wealth-magnet guardian beast',
    tagline: 'The winged beast that eats gold and can never let it out — feng shui\'s wealth-magnet.',
    overview:
      'Pixiu eats only gold, silver, and jewels — and, by a quirk of legend, can never let any of it out again. A winged, lion-like beast with a dragon\'s head and a fanged mouth, it is said to be a son of the Dragon King who once relieved itself in Heaven, for which the Jade Emperor sealed its rear.',
    keyFact:
      'That sealed-rear legend is exactly why it is the premier feng shui wealth charm: it draws money in and holds it.',
    significance:
      'One of the most-searched feng shui items in the West — sold as obsidian bracelets, rings, and statues. Its mouth should face outward to "eat" incoming wealth, and it should never face the owner directly or sit in a bedroom.',
    misconception:
      'Distinct from the guardian lion-dogs ("foo dogs," 石狮) — Pixiu is specifically a wealth beast, not a door guardian.',
    related: ['dragon-king', 'dragon'],
    tags: ['feng-shui'], postPrefix: 'myth-pixiu-',
  },
  {
    slug: 'four-symbols', name: 'The Four Symbols', chineseName: '四象', pinyin: 'sì xiàng',
    category: 'creature', role: 'Four directional guardian beasts',
    tagline: 'The four celestial beasts that guard the directions, seasons, and elements.',
    overview:
      'Four astral guardians divide the night sky, each ruling a direction, season, and element: the Azure Dragon (青龙, East/Spring/Wood), the Vermilion Bird (朱雀, South/Summer/Fire), the White Tiger (白虎, West/Autumn/Metal), and the Black Tortoise, or Xuanwu (玄武, North/Winter/Water). Together they structure Chinese astrology, feng shui, and Daoist cosmology.',
    keyFact:
      'Ideal feng shui terrain places the four guardians in their proper directions; Xuanwu, the tortoise-and-snake of the north, later became a major Daoist deity.',
    significance:
      'Widely known through Japanese media as Seiryu, Suzaku, Byakko, and Genbu — the White Tiger and Azure Dragon are especially popular tattoo subjects.',
    misconception:
      'The Vermilion Bird (朱雀) is a fire-and-south guardian, a different creature from the empress-phoenix Fenghuang (凤凰) — a common mix-up.',
    related: ['dragon', 'fenghuang'],
    tags: ['feng-shui'], postPrefix: 'myth-four-symbols-',
  },
  {
    slug: 'jiangshi', name: 'Jiangshi', chineseName: '僵尸', pinyin: 'jiāngshī',
    category: 'creature', role: 'Hopping undead · Chinese "vampire"',
    tagline: 'The stiff, hopping corpse that drains your life-energy — not your blood.',
    overview:
      'Rigor mortis stiffens its limbs, so a jiangshi ("stiff corpse") hops with arms outstretched — a reanimated body that rises to drain the qi, or life-force, of the living. It is typically dressed in a Qing-dynasty official\'s robe, and a Daoist paper talisman stuck to its forehead can freeze it in place.',
    keyFact:
      'The folklore is often traced to Xiangxi "corpse-driving" (赶尸) — transporting the dead home trussed upright to bamboo poles, which gave the eerie impression of hopping bodies.',
    significance:
      'Defined by 1980s Hong Kong horror-comedy — the Mr. Vampire films fixed its modern image — and a recurring figure in games and Halloween culture.',
    misconception:
      'Despite the "vampire" label, it feeds on qi (not blood), hops stiffly (rather than seduces), and is far closer to a zombie or revenant than to a Dracula-type.',
    related: ['zhong-kui', 'nian'],
    tags: [], postPrefix: 'myth-jiangshi-',
  },
  {
    slug: 'nian', name: 'Nian', chineseName: '年', pinyin: 'nián',
    category: 'creature', role: 'The New Year beast (年兽)',
    tagline: 'The beast whose fear of red and firecrackers gave us Chinese New Year customs.',
    overview:
      'Once a year, on New Year\'s Eve, a beast called Nian (as the New Year monster, 年兽 niánshòu) came out of the sea or mountains to devour livestock, crops, and people. Villagers discovered it feared three things — the color red, bright fire, and loud noise — so they hung red banners, lit lanterns, and set off firecrackers to drive it away.',
    keyFact:
      'This legend is the folk origin of the New Year\'s red decorations, firecrackers, and red envelopes; folk etymology even reads the word for celebrating the year, guònián (过年), as "passing/overcoming the Nian."',
    significance:
      'The explanatory story behind the most-searched Chinese holiday in the West, and a fixture of children\'s books and festival content.',
    misconception:
      'Treat it as "the traditional legend" rather than ancient scripture: Nian\'s earliest written records as a monster date only to the early 20th century.',
    related: ['zhong-kui', 'jade-emperor'],
    tags: ['new-year'], postPrefix: 'myth-nian-',
  },
  {
    slug: 'taotie', name: 'Taotie', chineseName: '饕餮', pinyin: 'tāotiè',
    category: 'creature', role: 'The glutton · bronze-age mask motif',
    tagline: 'A monster so greedy it devours its own body — and China\'s signature bronze-age face.',
    overview:
      'The taotie has two overlapping identities. As a decorative motif it is the frontal, symmetrical zoomorphic mask — bulging eyes, horns, fangs, usually no lower jaw — that dominates Shang and Zhou ritual bronzes. As a mythological being it is a gluttonous monster, one of the "Four Perils" (四凶) of the classical texts, so greedy it is said to eat its own body.',
    keyFact:
      'Confucian writers used it as a moral warning against avarice and excess — the emblem of insatiable greed.',
    significance:
      'A cornerstone of Chinese art history, revived in modern fantasy (the monsters of the 2016 film The Great Wall are "Tao Tie") and in games.',
    misconception:
      'Scholars do not agree on what the bronze mask originally meant; the "glutton" reading is a later textual gloss and may postdate the design itself, so it shouldn\'t be stated as settled fact for the Bronze Age motif.',
    related: ['four-symbols', 'bai-ze'],
    tags: [], postPrefix: 'myth-taotie-',
  },
  {
    slug: 'bai-ze', name: 'Bai Ze', chineseName: '白泽', pinyin: 'báizé',
    category: 'creature', role: 'Omniscient virtuous beast',
    tagline: 'The all-knowing beast that catalogued every spirit and demon in the world.',
    overview:
      'Bai Ze knows every spirit and demon in existence — an omniscient, virtuous beast, generally lion- or ox-like with extra eyes and horns, that can speak human language and appears only under a virtuous ruler.',
    keyFact:
      'Meeting the Yellow Emperor, Bai Ze dictated a catalogue of all 11,520 kinds of supernatural beings — how to recognize and ward off each — recorded as the Bai Ze Tu (白泽图), an early demon-identification guide.',
    significance:
      'Used as a talisman against ghosts and nightmares, and rising in the West through anime and games under its Japanese reading, Hakutaku.',
    misconception:
      'Known in Japan as Hakutaku (白澤) — fans meeting "Hakutaku" are meeting Bai Ze.',
    related: ['qilin', 'taotie'],
    tags: [], postPrefix: 'myth-bai-ze-',
  },
];

export function getAllFigures(): MythFigure[] { return FIGURES; }
export function getFigure(slug: string): MythFigure | null { return FIGURES.find(f => f.slug === slug) || null; }
export function getFiguresByCategory(category: 'deity' | 'creature'): MythFigure[] {
  return FIGURES.filter(f => f.category === category);
}

/** Resolve related-figure slugs to figures (dropping any that don't exist / self). */
export function getRelatedFigures(slug: string, limit = 4): MythFigure[] {
  const f = getFigure(slug);
  if (!f) return [];
  const out = f.related.map(getFigure).filter((x): x is MythFigure => !!x && x.slug !== slug);
  return out.slice(0, limit);
}

export function getFigureForBlogSlug(blogSlug: string): MythFigure | null {
  return FIGURES.find(f => blogSlug.startsWith(f.postPrefix)) || null;
}

export function getPostsForFigure(slug: string, excludeSlug?: string): MythPost[] {
  const f = getFigure(slug);
  if (!f) return [];
  const dir = path.join(process.cwd(), 'content/blog');
  if (!fs.existsSync(dir)) return [];
  const posts: MythPost[] = [];
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const s = file.replace(/\.md$/, '');
    if (!s.startsWith(f.postPrefix) || s === excludeSlug) continue;
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
    posts.push({ slug: s, title: data.title || s, date: data.date || '', description: data.description || '' });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
