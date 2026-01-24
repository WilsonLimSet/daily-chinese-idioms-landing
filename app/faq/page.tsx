import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import LanguageSelector from '../components/LanguageSelector';

export const metadata: Metadata = {
  title: 'Chinese Idioms FAQ - Common Questions About Chengyu | Chinese Idioms Daily',
  description: 'Frequently asked questions about Chinese idioms (chengyu/成语). Learn what idioms are, how many exist, how to use them, and find the perfect idiom for any situation.',
  keywords: 'chinese idioms faq, chengyu questions, learn chinese idioms, what is chengyu, how many chinese idioms, chinese saying meaning',
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

const faqs = [
  {
    question: "What is a Chinese idiom (chengyu)?",
    answer: "A Chinese idiom (成语, chéng yǔ) is a fixed four-character expression that carries a deeper meaning beyond its literal translation. These phrases come from ancient Chinese literature, historical events, fables, and folk wisdom. Unlike regular phrases, chengyu cannot be modified - the four characters must stay together in their original form. They are considered a hallmark of Chinese language mastery and are used in both formal writing and everyday speech."
  },
  {
    question: "How many Chinese idioms are there?",
    answer: "There are over 5,000 Chinese idioms (chengyu) in common use, with dictionaries recording more than 20,000 in total. However, for practical purposes, knowing about 500 core idioms is sufficient for intermediate Chinese learners. Native speakers typically use 200-300 idioms regularly in daily conversation. Our dictionary covers 365+ essential idioms - one for each day of the year."
  },
  {
    question: "What is the most famous Chinese idiom?",
    answer: "Several idioms compete for this title, but 一鸣惊人 (yī míng jīng rén) - meaning 'to amaze the world with a single feat' - is among the most recognized. Other extremely popular idioms include: 画蛇添足 (huà shé tiān zú, 'to draw legs on a snake' = overdo something), 守株待兔 (shǒu zhū dài tù, 'wait by a tree for rabbits' = wait for opportunities passively), and 对牛弹琴 (duì niú tán qín, 'play music to a cow' = cast pearls before swine)."
  },
  {
    question: "How do I memorize Chinese idioms?",
    answer: "The most effective methods are: 1) Learn the story behind each idiom - most have fascinating historical origins that make them memorable. 2) Use spaced repetition with daily practice - our app shows one idiom per day on your home screen. 3) Practice using idioms in sentences rather than memorizing in isolation. 4) Group idioms by theme (success, love, hard work) to create mental associations. 5) Focus on the most practical 100-200 idioms first rather than trying to learn thousands."
  },
  {
    question: "What Chinese idiom means 'work hard'?",
    answer: "Several idioms express hard work and diligence: 勤能补拙 (qín néng bǔ zhuō) - 'Diligence can compensate for lack of talent'; 锲而不舍 (qiè ér bù shě) - 'Persevere and never give up'; 铁杵成针 (tiě chǔ chéng zhēn) - 'An iron rod can be ground into a needle' (patience and persistence overcome any challenge); 水滴石穿 (shuǐ dī shí chuān) - 'Water drops can pierce stone' (consistent effort yields results)."
  },
  {
    question: "What Chinese idiom should I use for a wedding speech?",
    answer: "For wedding speeches, consider: 百年好合 (bǎi nián hǎo hé) - 'A harmonious union for a hundred years'; 白头偕老 (bái tóu xié lǎo) - 'To grow old together with white hair'; 天作之合 (tiān zuò zhī hé) - 'A match made in heaven'; 比翼双飞 (bǐ yì shuāng fēi) - 'To fly wing to wing' (inseparable couple). These are considered auspicious and are commonly used to wish newlyweds well."
  },
  {
    question: "What Chinese idiom describes success?",
    answer: "Popular idioms about success include: 一鸣惊人 (yī míng jīng rén) - 'To amaze with a single brilliant feat'; 马到成功 (mǎ dào chéng gōng) - 'Success upon arrival' (instant success); 功成名就 (gōng chéng míng jiù) - 'Achievement brings fame'; 心想事成 (xīn xiǎng shì chéng) - 'May your wishes come true'. See our full list of success idioms for more options."
  },
  {
    question: "Are Chinese idioms and proverbs the same thing?",
    answer: "No, they're different. Chinese idioms (成语, chéng yǔ) are strictly four-character fixed expressions. Chinese proverbs (谚语, yàn yǔ) are folk sayings of varying length that express common wisdom, similar to English proverbs. There are also 歇后语 (xiē hòu yǔ, two-part allegorical sayings) and 俗语 (sú yǔ, common sayings). Chengyu are considered more literary and formal, while proverbs are more colloquial."
  },
  {
    question: "What Chinese idiom describes love?",
    answer: "Beautiful idioms about love include: 一见钟情 (yī jiàn zhōng qíng) - 'Love at first sight'; 海枯石烂 (hǎi kū shí làn) - 'Until the seas dry and rocks crumble' (eternal love); 情投意合 (qíng tóu yì hé) - 'Like-minded and emotionally compatible'; 心心相印 (xīn xīn xiāng yìn) - 'Hearts beating as one'. Browse our complete love idioms collection for more romantic expressions."
  },
  {
    question: "How do I use Chinese idioms correctly?",
    answer: "Tips for correct usage: 1) Understand both the literal and metaphorical meanings. 2) Know the context - some idioms are formal, others casual. 3) Never modify the characters or word order. 4) Don't overuse them - one or two per paragraph in writing is plenty. 5) Match the tone to the situation - some idioms are humorous, others serious. 6) Practice with native speakers who can correct misuse. Start with common, versatile idioms before moving to obscure ones."
  },
  {
    question: "What Chinese idiom means 'never give up'?",
    answer: "Several idioms convey perseverance and not giving up: 锲而不舍 (qiè ér bù shě) - 'Keep carving without stopping' (persistence); 坚持不懈 (jiān chí bù xiè) - 'Persist unremittingly'; 百折不挠 (bǎi zhé bù náo) - 'Unbowed after a hundred setbacks'; 愚公移山 (yú gōng yí shān) - 'The Foolish Old Man who moved mountains' (determination can overcome any obstacle)."
  },
  {
    question: "What is the best Chinese idiom for business?",
    answer: "Recommended idioms for business contexts: 一诺千金 (yī nuò qiān jīn) - 'A promise worth a thousand gold pieces' (reliability); 精益求精 (jīng yì qiú jīng) - 'Strive for perfection'; 事半功倍 (shì bàn gōng bèi) - 'Half the effort, double the results' (efficiency); 同舟共济 (tóng zhōu gòng jì) - 'Cross the river in the same boat' (teamwork). See our business idioms list for more."
  }
];

export default function FAQPage() {
  // Structured data for FAQPage schema - static content, safe to embed
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
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

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {faq.answer}
              </p>
            </div>
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
