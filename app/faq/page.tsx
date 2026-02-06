import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

export const metadata: Metadata = {
  title: 'Chinese Idioms FAQ - 40+ Common Questions About Chengyu Answered | Chinese Idioms Daily',
  description: 'Comprehensive FAQ about Chinese idioms (chengyu/成语). 40+ answers about learning, memorizing, HSK prep, usage tips, wedding speeches, business, tattoos, and finding the perfect idiom for any occasion.',
  keywords: 'chinese idioms faq, chengyu questions, learn chinese idioms, what is chengyu, how many chinese idioms, chinese saying meaning, hsk idioms, chinese idiom tattoo, wedding chinese idiom, business chengyu',
  openGraph: {
    title: 'Chinese Idioms FAQ - Your Questions Answered',
    description: 'Everything you need to know about Chinese idioms (chengyu). Common questions answered with examples.',
    url: 'https://www.chineseidioms.com/faq',
    siteName: 'Daily Chinese Idioms',
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/faq',
  },
};

type FAQSection = {
  title: string;
  faqs: { question: string; answer: string }[];
};

const faqSections: FAQSection[] = [
  {
    title: "Basics: What Are Chinese Idioms?",
    faqs: [
      {
        question: "What is a Chinese idiom (chengyu)?",
        answer: "A Chinese idiom (成语, chéng yǔ) is a fixed four-character expression that carries a deeper meaning beyond its literal translation. These phrases come from ancient Chinese literature, historical events, fables, and folk wisdom. Unlike regular phrases, chengyu cannot be modified - the four characters must stay together in their original form. They are considered a hallmark of Chinese language mastery and are used in both formal writing and everyday speech."
      },
      {
        question: "How many Chinese idioms are there?",
        answer: "There are over 5,000 Chinese idioms (chengyu) in common use, with dictionaries recording more than 20,000 in total. However, for practical purposes, knowing about 500 core idioms is sufficient for intermediate Chinese learners. Native speakers typically use 200-300 idioms regularly in daily conversation. Our dictionary covers 365+ essential idioms - one for each day of the year."
      },
      {
        question: "Are Chinese idioms and proverbs the same thing?",
        answer: "No, they're different. Chinese idioms (成语, chéng yǔ) are strictly four-character fixed expressions. Chinese proverbs (谚语, yàn yǔ) are folk sayings of varying length that express common wisdom, similar to English proverbs. There are also 歇后语 (xiē hòu yǔ, two-part allegorical sayings) and 俗语 (sú yǔ, common sayings). Chengyu are considered more literary and formal, while proverbs are more colloquial."
      },
      {
        question: "What is the difference between chengyu and xiehouyu?",
        answer: "Chengyu (成语) are four-character idioms with fixed form, while xiehouyu (歇后语) are two-part allegorical sayings where the first part is a riddle and the second is the answer. For example, '竹篮打水 - 一场空' means 'fetching water with a bamboo basket - all for nothing.' Xiehouyu are more colloquial and humorous, while chengyu are used in both formal and informal contexts."
      },
      {
        question: "Why are Chinese idioms always four characters?",
        answer: "Most Chinese idioms are four characters because of the rhythm and balance valued in Classical Chinese. Four characters create two pairs (2+2), which feels natural and rhythmic in Chinese speech. This pattern was established in ancient texts like the Book of Songs (诗经) and the Analects (论语). However, not all chengyu are strictly four characters - some have three, five, or more characters, though four-character idioms make up about 96% of the total."
      },
      {
        question: "Where do Chinese idioms come from?",
        answer: "Chinese idioms come from several sources: 1) Classical literature like the Analerta, Mencius, and the Book of Songs. 2) Historical events, especially from the Spring & Autumn and Warring States periods. 3) Ancient fables and folk tales, like the story of the foolish old man who moved mountains. 4) Buddhist and Taoist philosophy. 5) Famous poets and writers from the Tang and Song dynasties. Each idiom carries the cultural DNA of its era."
      },
    ]
  },
  {
    title: "Learning & Memorizing Chinese Idioms",
    faqs: [
      {
        question: "How do I memorize Chinese idioms?",
        answer: "The most effective methods are: 1) Learn the story behind each idiom - most have fascinating historical origins that make them memorable. 2) Use spaced repetition with daily practice - our app shows one idiom per day on your home screen. 3) Practice using idioms in sentences rather than memorizing in isolation. 4) Group idioms by theme (success, love, hard work) to create mental associations. 5) Focus on the most practical 100-200 idioms first rather than trying to learn thousands."
      },
      {
        question: "How many Chinese idioms should I learn?",
        answer: "For basic conversational fluency: 50-100 idioms. For intermediate proficiency (HSK 4-5): 200-300 idioms. For advanced/near-native level (HSK 6+): 500+ idioms. Start with the most commonly used ones - our beginner list has the 10 easiest to learn first. Most Chinese adults actively use 200-300 idioms, so that's a practical target for serious learners."
      },
      {
        question: "What Chinese idioms should I learn first as a beginner?",
        answer: "Start with idioms that are: 1) Common in daily conversation (一模一样, 半途而废). 2) Have vivid, memorable stories (守株待兔, 画蛇添足). 3) Have clear, practical meanings (事半功倍, 一举两得). 4) Match HSK 3-4 vocabulary levels. Our beginner idioms list has 10 perfect starting idioms with simple characters and useful daily applications."
      },
      {
        question: "How long does it take to learn Chinese idioms?",
        answer: "Learning one idiom per day, you'll know 365 idioms in a year - enough for strong conversational use. Most learners can memorize the meaning of an idiom in 5-10 minutes, but truly mastering when and how to use it takes practice over weeks. The key is consistency: daily exposure through reading, apps, or conversation builds familiarity naturally. Many learners report significant improvement after just 3 months of daily practice."
      },
      {
        question: "What are the best apps for learning Chinese idioms?",
        answer: "Our Daily Chinese Idioms app delivers one new idiom to your home screen every day with pinyin, meaning, origin story, and usage examples. For broader Chinese study, apps like Pleco (dictionary with idiom entries), Anki (spaced repetition flashcards), and HelloChinese (gamified learning) can complement your idiom study. The best approach combines a dedicated idiom app with reading Chinese content where you encounter idioms in context."
      },
      {
        question: "Which Chinese idioms appear on the HSK exam?",
        answer: "HSK 4 introduces basic idioms like 各种各样, 自言自语. HSK 5 expects about 100 idioms including 半途而废, 爱不释手, 不知不觉. HSK 6 tests 300+ idioms and expects natural usage. We have dedicated lists for HSK 4, HSK 5, and HSK 6 idioms to help you prepare for each level."
      },
    ]
  },
  {
    title: "Using Chinese Idioms Correctly",
    faqs: [
      {
        question: "How do I use Chinese idioms correctly?",
        answer: "Tips for correct usage: 1) Understand both the literal and metaphorical meanings. 2) Know the context - some idioms are formal, others casual. 3) Never modify the characters or word order. 4) Don't overuse them - one or two per paragraph in writing is plenty. 5) Match the tone to the situation - some idioms are humorous, others serious. 6) Practice with native speakers who can correct misuse. Start with common, versatile idioms before moving to obscure ones."
      },
      {
        question: "Can I use Chinese idioms in casual conversation?",
        answer: "Yes! While chengyu are often associated with formal writing, many are commonly used in everyday speech. Idioms like 一模一样 ('exactly the same'), 乱七八糟 ('a complete mess'), and 莫名其妙 ('inexplicable') are used casually by native speakers daily. The key is knowing which idioms suit casual contexts versus formal ones. Generally, idioms with simpler meanings and common vocabulary are fine for conversation."
      },
      {
        question: "What mistakes do foreigners make with Chinese idioms?",
        answer: "Common mistakes include: 1) Using idioms in wrong contexts (e.g., using a negative idiom as a compliment). 2) Misunderstanding the metaphorical meaning by translating literally. 3) Overusing idioms to sound impressive, which sounds unnatural. 4) Confusing similar-sounding idioms. 5) Using formal/literary idioms in casual settings. 6) Getting tones wrong on key characters, which can change meaning. The best prevention is learning idioms in context, not isolation."
      },
      {
        question: "How do Chinese people react when foreigners use idioms?",
        answer: "Chinese people are generally very impressed and delighted when foreigners use idioms correctly! It demonstrates deep cultural understanding beyond basic language skills. Even using simple idioms like 入乡随俗 ('when in Rome, do as the Romans do') can earn genuine admiration. However, using them incorrectly may cause confusion or amusement, so it's better to master a few well than to attempt many poorly."
      },
    ]
  },
  {
    title: "Finding the Right Idiom",
    faqs: [
      {
        question: "What is the most famous Chinese idiom?",
        answer: "Several idioms compete for this title, but 一鸣惊人 (yī míng jīng rén) - meaning 'to amaze the world with a single feat' - is among the most recognized. Other extremely popular idioms include: 画蛇添足 (huà shé tiān zú, 'to draw legs on a snake' = overdo something), 守株待兔 (shǒu zhū dài tù, 'wait by a tree for rabbits' = wait for opportunities passively), and 对牛弹琴 (duì niú tán qín, 'play music to a cow' = cast pearls before swine)."
      },
      {
        question: "What Chinese idiom means 'work hard'?",
        answer: "Several idioms express hard work and diligence: 勤能补拙 (qín néng bǔ zhuō) - 'Diligence can compensate for lack of talent'; 锲而不舍 (qiè ér bù shě) - 'Persevere and never give up'; 铁杵成针 (tiě chǔ chéng zhēn) - 'An iron rod can be ground into a needle' (patience and persistence overcome any challenge); 水滴石穿 (shuǐ dī shí chuān) - 'Water drops can pierce stone' (consistent effort yields results)."
      },
      {
        question: "What Chinese idiom means 'never give up'?",
        answer: "Several idioms convey perseverance and not giving up: 锲而不舍 (qiè ér bù shě) - 'Keep carving without stopping' (persistence); 坚持不懈 (jiān chí bù xiè) - 'Persist unremittingly'; 百折不挠 (bǎi zhé bù náo) - 'Unbowed after a hundred setbacks'; 愚公移山 (yú gōng yí shān) - 'The Foolish Old Man who moved mountains' (determination can overcome any obstacle)."
      },
      {
        question: "What Chinese idiom describes success?",
        answer: "Popular idioms about success include: 一鸣惊人 (yī míng jīng rén) - 'To amaze with a single brilliant feat'; 马到成功 (mǎ dào chéng gōng) - 'Success upon arrival' (instant success); 功成名就 (gōng chéng míng jiù) - 'Achievement brings fame'; 心想事成 (xīn xiǎng shì chéng) - 'May your wishes come true'. See our full list of success idioms for more options."
      },
      {
        question: "What Chinese idiom describes love?",
        answer: "Beautiful idioms about love include: 一见钟情 (yī jiàn zhōng qíng) - 'Love at first sight'; 海枯石烂 (hǎi kū shí làn) - 'Until the seas dry and rocks crumble' (eternal love); 情投意合 (qíng tóu yì hé) - 'Like-minded and emotionally compatible'; 心心相印 (xīn xīn xiāng yìn) - 'Hearts beating as one'. Browse our complete love idioms collection for more romantic expressions."
      },
      {
        question: "What Chinese idiom means 'blessing in disguise'?",
        answer: "The most famous is 塞翁失马 (sài wēng shī mǎ) - 'The old man at the frontier lost his horse.' This comes from a story where an old man's horse ran away, but later returned with a herd of wild horses. It teaches that apparent misfortune can lead to unexpected good. Similar idioms include 因祸得福 ('gain fortune from disaster') and 柳暗花明 ('dark willows and bright flowers' - hope after despair)."
      },
      {
        question: "What Chinese idiom means 'once in a lifetime'?",
        answer: "千载难逢 (qiān zǎi nán féng) means 'hard to encounter in a thousand years' - the closest to 'once in a lifetime.' Also consider: 百年不遇 (bǎi nián bù yù) - 'not encountered in a hundred years'; 机不可失 (jī bù kě shī) - 'opportunity cannot be missed'; and 稍纵即逝 (shāo zòng jí shì) - 'gone in the blink of an eye.' These are perfect for describing rare, precious opportunities."
      },
    ]
  },
  {
    title: "Chinese Idioms for Specific Occasions",
    faqs: [
      {
        question: "What Chinese idiom should I use for a wedding speech?",
        answer: "For wedding speeches, consider: 百年好合 (bǎi nián hǎo hé) - 'A harmonious union for a hundred years'; 白头偕老 (bái tóu xié lǎo) - 'To grow old together with white hair'; 天作之合 (tiān zuò zhī hé) - 'A match made in heaven'; 比翼双飞 (bǐ yì shuāng fēi) - 'To fly wing to wing' (inseparable couple). These are considered auspicious and are commonly used to wish newlyweds well."
      },
      {
        question: "What is the best Chinese idiom for business?",
        answer: "Recommended idioms for business contexts: 一诺千金 (yī nuò qiān jīn) - 'A promise worth a thousand gold pieces' (reliability); 精益求精 (jīng yì qiú jīng) - 'Strive for perfection'; 事半功倍 (shì bàn gōng bèi) - 'Half the effort, double the results' (efficiency); 同舟共济 (tóng zhōu gòng jì) - 'Cross the river in the same boat' (teamwork). See our business idioms list for more."
      },
      {
        question: "What Chinese idiom is good for Chinese New Year?",
        answer: "The most popular Chinese New Year idioms are: 恭喜发财 (gōng xǐ fā cái) - 'Wishing you wealth and prosperity'; 万事如意 (wàn shì rú yì) - 'May everything go as you wish'; 年年有余 (nián nián yǒu yú) - 'Abundance year after year'; 大吉大利 (dà jí dà lì) - 'Great luck and great profit.' We have dedicated CNY idiom lists for every situation - from greeting elders to writing on red envelopes."
      },
      {
        question: "What Chinese idiom can I use to encourage someone?",
        answer: "To encourage someone facing challenges: 加油 (jiā yóu, while not technically a chengyu, is the most common encouragement). For idioms: 再接再厉 (zài jiē zài lì) - 'Keep up the good work'; 坚持就是胜利 (jiān chí jiù shì shèng lì) - 'Persistence is victory'; 天道酬勤 (tiān dào chóu qín) - 'Heaven rewards the diligent.' See our full encouragement idioms list."
      },
      {
        question: "What Chinese idiom should I use for a birthday?",
        answer: "For birthday wishes: 福如东海 (fú rú dōng hǎi) - 'May your fortune be as vast as the East Sea'; 寿比南山 (shòu bǐ nán shān) - 'May your life be as long as the Southern Mountains' (these two are traditionally paired for elders). For younger people: 心想事成 (xīn xiǎng shì chéng) - 'May your wishes come true'; 前程似锦 (qián chéng sì jǐn) - 'A future as bright as brocade.'"
      },
      {
        question: "What Chinese idiom is good for a tattoo?",
        answer: "Meaningful idiom tattoo ideas: 知行合一 (zhī xíng hé yī) - 'Unity of knowledge and action'; 百折不挠 (bǎi zhé bù náo) - 'Unbowed after a hundred setbacks'; 厚德载物 (hòu dé zài wù) - 'Great virtue carries all things'; 自强不息 (zì qiáng bù xī) - 'Strive ceaselessly for self-improvement.' Important: always verify the correct characters with a native speaker before getting a tattoo. See our complete tattoo idioms list."
      },
    ]
  },
  {
    title: "Cultural Context & Comparisons",
    faqs: [
      {
        question: "Do Japanese and Korean languages have idioms from Chinese?",
        answer: "Yes! Japanese yojijukugo (四字熟語) and Korean sajaseongeo (사자성어) both derive heavily from Chinese chengyu. Japan borrowed thousands of Chinese idioms through kanji characters, and many are still used identically. Korean also adopted Chinese four-character idioms through hanja. Learning Chinese idioms gives you a head start on understanding Japanese and Korean expressions too."
      },
      {
        question: "Are there Chinese idioms similar to English proverbs?",
        answer: "Many Chinese idioms have English equivalents: 入乡随俗 = 'When in Rome, do as the Romans do'; 画蛇添足 = 'Gilding the lily'; 塞翁失马 = 'Every cloud has a silver lining'; 班门弄斧 = 'Teaching your grandmother to suck eggs'; 对牛弹琴 = 'Casting pearls before swine.' These parallels show how different cultures arrived at similar wisdom independently."
      },
      {
        question: "Why is 'face' (面子) so important in Chinese idioms?",
        answer: "Face (面子, miàn zi) represents one's social reputation, dignity, and standing. It's central to Chinese social dynamics and appears in many idioms: 丢脸 ('lose face'), 给面子 ('give face' = show respect), 不要脸 ('don't want face' = shameless). Understanding face culture is essential for using Chinese idioms about social situations correctly, and for navigating Chinese business and personal relationships."
      },
      {
        question: "What role do animals play in Chinese idioms?",
        answer: "Animals are central to Chinese idioms: the dragon (龙) represents power and luck; the tiger (虎) symbolizes courage; the horse (马) means success; the ox (牛) represents hard work; the monkey (猴) suggests cleverness. Many idioms come from zodiac animals or ancient fables about animals. We have dedicated lists for dragon, tiger, horse, snake, ox, rooster, dog, pig, monkey, rat, bird, and fish idioms."
      },
      {
        question: "Do Chinese people actually use idioms in daily life?",
        answer: "Absolutely! While some literary idioms are reserved for formal writing, many chengyu are part of everyday Chinese speech. Phrases like 一模一样 ('exactly the same'), 乱七八糟 ('a total mess'), 莫名其妙 ('inexplicable'), and 不可思议 ('unbelievable') are used as casually as English speakers say 'piece of cake' or 'last straw.' Educated speakers use idioms more frequently, and they appear constantly in news, social media, and conversation."
      },
      {
        question: "How are Chinese idioms used in modern social media?",
        answer: "Chinese idioms are thriving on social media! On WeChat, Douyin (TikTok), and Weibo, users share idiom-based memes, use them as captions, and even create viral challenges around them. Hashtags like #成语接龙 (idiom chain game) are popular. Young Chinese people mix classical idioms with modern slang, creating a dynamic linguistic culture. Idioms with relatable meanings go viral regularly."
      },
    ]
  },
  {
    title: "Chinese Idioms by Theme",
    faqs: [
      {
        question: "What are the best Chinese idioms about friendship?",
        answer: "Powerful friendship idioms include: 肝胆相照 (gān dǎn xiāng zhào) - 'Sharing liver and gallbladder' (absolute trust); 莫逆之交 (mò nì zhī jiāo) - 'Friendship without disagreement' (best friends); 风雨同舟 (fēng yǔ tóng zhōu) - 'Sharing the boat through wind and rain' (standing together through hardship). See our complete friendship idioms list."
      },
      {
        question: "What Chinese idioms describe courage and bravery?",
        answer: "Courage-themed idioms include: 破釜沉舟 (pò fǔ chén zhōu) - 'Smash the pots, sink the boats' (burn your bridges, commit fully); 赴汤蹈火 (fù tāng dǎo huǒ) - 'Wade through fire and boiling water' (brave any danger); 大义凛然 (dà yì lǐn rán) - 'Righteously fearless.' Browse our courage idioms list for more."
      },
      {
        question: "What Chinese idioms are about patience?",
        answer: "Patience-themed idioms include: 水滴石穿 (shuǐ dī shí chuān) - 'Water drops pierce stone' (patient persistence wins); 厚积薄发 (hòu jī bó fā) - 'Accumulate thickly, release thinly' (build up before acting); 守株待兔 (shǒu zhū dài tù) - 'Wait by a tree for rabbits' (warning against passive waiting). Chinese culture values active patience - persistent effort, not just waiting."
      },
      {
        question: "What Chinese idioms are about nature and the seasons?",
        answer: "Nature idioms are abundant in Chinese: 春暖花开 (chūn nuǎn huā kāi) - 'Spring warms and flowers bloom'; 秋高气爽 (qiū gāo qì shuǎng) - 'Autumn sky high and air crisp'; 风和日丽 (fēng hé rì lì) - 'Gentle breeze and beautiful sun'; 山清水秀 (shān qīng shuǐ xiù) - 'Clear mountains and beautiful waters.' We have dedicated lists for spring, summer, autumn, winter, and nature-themed idioms."
      },
      {
        question: "What Chinese idioms are about food and eating?",
        answer: "Food is central to Chinese culture and idioms: 画饼充饥 (huà bǐng chōng jī) - 'Draw a pancake to satisfy hunger' (wishful thinking); 望梅止渴 (wàng méi zhǐ kě) - 'Look at plums to quench thirst' (use imagination to comfort yourself); 锦上添花 (jǐn shàng tiān huā) - 'Adding flowers to brocade' (making something good even better). See our food idioms list for more delicious expressions."
      },
    ]
  },
  {
    title: "Advanced & Interesting Questions",
    faqs: [
      {
        question: "Are there Chinese idioms that are impossible to translate into English?",
        answer: "Yes! Some chengyu express concepts with no English equivalent: 缘分 (yuán fèn) - the fateful connection between people (broader than 'destiny'); 江湖 (jiāng hú) - literally 'rivers and lakes,' meaning the world of wandering martial artists or the unwritten social rules; 热闹 (rè nao) - a specific kind of festive, bustling atmosphere that English 'lively' doesn't capture. These untranslatable idioms reveal uniquely Chinese ways of understanding the world."
      },
      {
        question: "What is the funniest Chinese idiom?",
        answer: "Chinese idioms with hilarious literal meanings include: 对牛弹琴 (duì niú tán qín) - 'Playing music to a cow' (wasting effort on someone who can't appreciate it); 鸡飞蛋打 (jī fēi dàn dǎ) - 'The chicken flew and the eggs broke' (total loss); 狗急跳墙 (gǒu jí tiào qiáng) - 'A cornered dog jumps over the wall' (desperate measures); 画蛇添足 (huà shé tiān zú) - 'Drawing legs on a snake' (overdoing it). See our funny idioms list for more laughs."
      },
      {
        question: "Can Chinese idioms be used in Chinese calligraphy?",
        answer: "Absolutely! Chinese idioms are among the most popular subjects for calligraphy. The four-character structure fits perfectly into square formats and scrolls. Popular calligraphy idioms include 厚德载物 ('great virtue carries all things'), 天道酬勤 ('heaven rewards the diligent'), and 宁静致远 ('tranquility leads to far-reaching insight'). Calligraphy of meaningful idioms makes popular gifts, office decorations, and art pieces."
      },
      {
        question: "What are the oldest Chinese idioms still used today?",
        answer: "Some idioms date back over 2,500 years: 温故知新 (wēn gù zhī xīn) from Confucius' Analects (~500 BCE) means 'review the old to learn the new'; 朝三暮四 (zhāo sān mù sì) from Zhuangzi (~300 BCE) means 'three in the morning, four at night' (easily fooled by surface changes). These ancient expressions are still used daily in modern Chinese, proving the timeless relevance of their wisdom."
      },
      {
        question: "How do I write Chinese idioms with correct stroke order?",
        answer: "Stroke order matters for proper character writing. General rules: 1) Top to bottom (三). 2) Left to right (你). 3) Horizontal before vertical (十). 4) Outside before inside for enclosed characters (国). 5) Center stroke before symmetric sides. For learning stroke order, use apps like Pleco or Skritter that animate each character. Practicing writing idioms by hand significantly improves character recognition and memory."
      },
    ]
  },
];

export default function FAQPage() {
  // Flatten all FAQs for structured data
  const allFaqs = faqSections.flatMap(section => section.faqs);

  // Structured data for FAQPage schema - static content, safe to embed
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": allFaqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <div className="flex items-center gap-2 text-sm text-blue-600 mb-3">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Chinese Idioms FAQ
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Everything you need to know about Chinese idioms (chengyu/成语). Find answers to common questions about learning, using, and understanding these powerful four-character expressions.
          </p>
        </header>

        {/* Quick Summary Box for AI */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-10">
          <h2 className="font-bold text-gray-900 mb-3">Quick Facts About Chinese Idioms</h2>
          <ul className="space-y-2 text-gray-700">
            <li><strong>Definition:</strong> Four-character fixed expressions (成语) with deeper cultural meaning</li>
            <li><strong>Total Count:</strong> 5,000+ in common use; 500 essential for learners</li>
            <li><strong>Origin:</strong> Ancient literature, historical events, fables, folk wisdom</li>
            <li><strong>Usage:</strong> Formal writing and everyday speech to express complex ideas concisely</li>
          </ul>
        </div>

        {/* Table of Contents */}
        <nav className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10">
          <h2 className="font-bold text-gray-900 mb-3">Jump to Section</h2>
          <ul className="grid gap-2 md:grid-cols-2">
            {faqSections.map((section, i) => (
              <li key={i}>
                <a href={`#section-${i}`} className="text-blue-600 hover:text-blue-800 text-sm">
                  {section.title} ({section.faqs.length})
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* FAQ Sections */}
        <div className="space-y-12">
          {faqSections.map((section, sectionIndex) => (
            <section key={sectionIndex} id={`section-${sectionIndex}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                {section.title}
              </h2>
              <div className="space-y-6">
                {section.faqs.map((faq, faqIndex) => (
                  <div
                    key={faqIndex}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Related Resources */}
        <section className="mt-12 pt-8 border-t">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Explore Chinese Idioms</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              href="/dictionary"
              className="block p-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-bold text-gray-900 mb-2">Complete Dictionary</h3>
              <p className="text-sm text-gray-600">Browse all 365+ idioms with pinyin and meanings</p>
            </Link>
            <Link
              href="/blog/lists"
              className="block p-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-bold text-gray-900 mb-2">Curated Lists</h3>
              <p className="text-sm text-gray-600">Idioms organized by theme: business, love, success...</p>
            </Link>
            <Link
              href="/blog/lists/chinese-idioms-for-business"
              className="block p-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-bold text-gray-900 mb-2">Business Idioms</h3>
              <p className="text-sm text-gray-600">Professional Chinese expressions for the workplace</p>
            </Link>
            <Link
              href="/blog/lists/chinese-idioms-about-love"
              className="block p-5 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all"
            >
              <h3 className="font-bold text-gray-900 mb-2">Love & Romance Idioms</h3>
              <p className="text-sm text-gray-600">Beautiful expressions about relationships</p>
            </Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mt-12 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Learn One Idiom Every Day</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            The best way to learn Chinese idioms is consistent daily practice. Our free iOS app delivers one idiom to your home screen each day.
          </p>
          <a
            href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Download Free App
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">&copy; {new Date().getFullYear()} Daily Chinese Idioms</p>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Built by Wilson
              </a>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href="/dictionary"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dictionary
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">&bull;</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
