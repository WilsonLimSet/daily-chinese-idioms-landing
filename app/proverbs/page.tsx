import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Heart, Trophy, Shield, GraduationCap, Scale } from 'lucide-react';
import { getProverbListiclesGrouped, type ProverbGroupKey } from '@/src/lib/listicles';
import LanguageSelector from '@/app/components/LanguageSelector';

const GROUP_META: Record<ProverbGroupKey, { title: string; desc: string; Icon: typeof BookOpen }> = {
  'life-wisdom': {
    title: 'Life & Wisdom',
    desc: 'Ancient sayings about how to live, age with grace, and see the world clearly — drawn from Confucian, Daoist, and folk traditions.',
    Icon: BookOpen,
  },
  'love-relationships': {
    title: 'Love & Relationships',
    desc: 'Proverbs about romance, family, and friendship — the relationships that shape a Chinese life.',
    Icon: Heart,
  },
  'success-motivation': {
    title: 'Success & Motivation',
    desc: 'Sayings to inspire effort, happiness, and the pursuit of meaningful goals.',
    Icon: Trophy,
  },
  'strength-character': {
    title: 'Strength & Character',
    desc: 'Proverbs about patience, resilience, and the steady character that endures change.',
    Icon: Shield,
  },
  'study-learning': {
    title: 'Study & Learning',
    desc: 'Classical wisdom about the discipline of learning and the life of the student.',
    Icon: GraduationCap,
  },
  'reference': {
    title: 'Reference & Comparison',
    desc: 'Cross-reference guides: English equivalents, Korean proverb comparisons, and a general best-of collection.',
    Icon: Scale,
  },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: 'What is a Chinese proverb?',
    a: 'A Chinese proverb (谚语, yànyǔ) is a short traditional saying that expresses a truth, observation, or piece of practical wisdom — usually in a complete sentence. Unlike Chinese idioms (成语), which are four-character literary phrases, proverbs are closer to everyday speech and often pass down through folk tradition, family, and classical texts like the Analects.',
  },
  {
    q: "What's the difference between a Chinese proverb (谚语) and an idiom (成语)?",
    a: 'Idioms (成语) are almost always four characters long, condensed from a historical story or classical text. Proverbs (谚语, 俗语) are longer, sentence-length sayings. "画蛇添足" is an idiom; "活到老，学到老" (keep learning as long as you live) is a proverb. Both are used in modern Chinese.',
  },
  {
    q: 'What are the most famous Chinese proverbs?',
    a: 'Widely-known proverbs include 活到老，学到老 (keep learning as long as you live), 失败是成功之母 (failure is the mother of success), 百闻不如一见 (seeing once is better than hearing a hundred times), and 一寸光阴一寸金 (an inch of time is an inch of gold). These appear in textbooks, speeches, and everyday conversation across the Chinese-speaking world.',
  },
  {
    q: 'Are Confucius quotes Chinese proverbs?',
    a: 'Many sayings attributed to Confucius (孔子, Kǒngzǐ) from the Analects (论语) now function as proverbs — for example 己所不欲，勿施于人 (do not do to others what you would not want done to yourself). Strictly, these are classical quotes (名言) rather than folk proverbs, but both overlap in modern usage.',
  },
  {
    q: 'Do Chinese proverbs have English equivalents?',
    a: 'Many do. "入乡随俗" parallels "when in Rome, do as the Romans do." "种瓜得瓜" matches "you reap what you sow." Others — like 塞翁失马 — have no clean English match and preserve a uniquely Chinese way of framing luck or fate. Our dedicated comparison list pairs the closest equivalents.',
  },
  {
    q: 'How do I use a Chinese proverb correctly?',
    a: 'Proverbs work best when they fit the situation naturally, not as showpieces. Use them in writing, toasts, speeches, or to make a point. Each listicle includes pinyin, literal translation, meaning, and an example so you can see the register and context before using the proverb yourself.',
  },
];

const LANG_CODES = ['ar', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ms', 'pt', 'ru', 'th', 'tl', 'vi'] as const;

export const metadata: Metadata = {
  title: 'Chinese Proverbs: 200+ Ancient Sayings with Meanings (谚语)',
  description: 'Explore Chinese proverbs (谚语, 俗语) about life, love, wisdom, and success — with pinyin, meaning, and origin. Learn how proverbs differ from idioms (成语).',
  keywords: [
    'chinese proverbs',
    'chinese sayings',
    'chinese proverbs with meanings',
    'ancient chinese proverbs',
    'chinese wisdom',
    'yanyu',
    '谚语',
    'chinese proverbs vs idioms',
  ],
  openGraph: {
    title: 'Chinese Proverbs: Ancient Sayings & Wisdom (谚语)',
    description: 'Explore Chinese proverbs (谚语, 俗语) about life, love, wisdom, and success — with pinyin, meaning, and origin.',
    url: 'https://www.chineseidioms.com/proverbs',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/proverbs',
    languages: {
      'x-default': 'https://www.chineseidioms.com/proverbs',
      'en': 'https://www.chineseidioms.com/proverbs',
      ...Object.fromEntries(LANG_CODES.map(l => [l, `https://www.chineseidioms.com/${l}/proverbs`])),
    },
  },
};

export default function ProverbsHubPage() {
  const groups = getProverbListiclesGrouped();
  const totalListicles = groups.reduce((sum, g) => sum + g.listicles.length, 0);

  // Server-rendered JSON-LD built from static site data (no user input); inlined as script per schema.org convention.
  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Chinese Proverbs',
    description: 'Curated collections of Chinese proverbs (谚语), folk sayings (俗语), and classical quotes organized by theme.',
    url: 'https://www.chineseidioms.com/proverbs',
    inLanguage: 'en',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chinese Idioms',
      url: 'https://www.chineseidioms.com',
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.chineseidioms.com' },
        { '@type': 'ListItem', position: 2, name: 'Proverbs', item: 'https://www.chineseidioms.com/proverbs' },
      ],
    },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalListicles,
      itemListElement: groups.flatMap((g, gi) =>
        g.listicles.map((l, li) => ({
          '@type': 'ListItem',
          position: gi * 100 + li + 1,
          name: l.title,
          url: `https://www.chineseidioms.com/blog/lists/${l.slug}`,
        })),
      ),
    },
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Chinese Proverbs: Ancient Sayings &amp; Wisdom <span className="text-gray-500">(谚语)</span>
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl leading-relaxed">
            Explore Chinese proverbs (谚语), folk sayings (俗语), and classical quotes (名言) —
            each with pinyin, meaning, and origin.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mt-4 leading-relaxed">
            A Chinese proverb distills centuries of wisdom into a single memorable line.
            From Confucius and Laozi to peasant folk wisdom, these sayings still guide how Chinese speakers
            talk about life, love, success, and character today. Browse {totalListicles} curated collections,
            grouped by theme.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Chinese Proverbs (谚语) vs Idioms (成语): What&apos;s the Difference?
          </h2>
          <div className="prose prose-gray max-w-none text-gray-700 leading-relaxed">
            <p>
              In Chinese, the word &ldquo;proverb&rdquo; usually maps to <strong>谚语 (yànyǔ)</strong> or{' '}
              <strong>俗语 (súyǔ)</strong> — folk sayings and popular wisdom, often in complete sentences
              (&ldquo;活到老，学到老&rdquo; — <em>keep learning as long as you live</em>). An idiom —{' '}
              <strong>成语 (chéngyǔ)</strong> — is almost always a four-character set phrase with a classical
              origin (&ldquo;画蛇添足&rdquo; — <em>draw a snake, add feet</em>).
            </p>
            <p>
              Proverbs are <strong>spoken wisdom</strong>; idioms are <strong>literary compression</strong>.
              Many classical quotes (名言, <em>míngyán</em>) straddle both. This hub focuses on proverbs and
              sayings. For four-character chengyu, browse our{' '}
              <Link href="/themes" className="text-blue-600 hover:underline">idiom themes</Link>.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Chinese Proverbs by Theme</h2>
          <p className="text-gray-600 mb-8 max-w-3xl">
            {totalListicles} curated collections covering the topics Chinese proverbs speak to most directly.
          </p>

          <div className="space-y-12">
            {groups.map(({ key, listicles }) => {
              if (listicles.length === 0) return null;
              const meta = GROUP_META[key];
              const Icon = meta.Icon;
              return (
                <div key={key}>
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <Icon className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{meta.title}</h3>
                      <p className="text-gray-600 mt-1 max-w-2xl">{meta.desc}</p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {listicles.map(l => (
                      <Link
                        key={l.slug}
                        href={`/blog/lists/${l.slug}`}
                        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-6 border border-gray-100 hover:border-red-200"
                      >
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 leading-snug">{l.title}</h4>
                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">{l.description}</p>
                        <p className="text-red-600 text-sm mt-4 font-medium">
                          {l.idiomIds.length} idioms →
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-16 pt-8 border-t">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About Chinese Proverbs</h2>
          <div className="space-y-6 max-w-3xl">
            {FAQ.map(item => (
              <div key={item.q}>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">{item.q}</h3>
                <p className="text-gray-700 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a href="https://wilsonlimset.com" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors">
                Built by Wilson
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/blog/lists" className="text-gray-600 hover:text-gray-900 transition-colors">Lists</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
