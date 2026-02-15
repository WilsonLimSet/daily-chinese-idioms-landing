import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Search, Layers, ArrowRight } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector'
import { getAllBlogPosts } from '@/src/lib/blog'
import { getAllListicles } from '@/src/lib/listicles'

// FAQ structured data for AI discoverability - static content only, safe to embed
const homepageFAQSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is a Chinese idiom (chengyu)?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A Chinese idiom (成语, chéng yǔ) is a fixed four-character expression that carries a deeper meaning beyond its literal translation. There are over 5,000 chengyu in common use, originating from ancient Chinese literature, historical events, and folk wisdom. They are essential for mastering the Chinese language."
      }
    },
    {
      "@type": "Question",
      "name": "How many Chinese idioms should I learn?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "For intermediate Chinese learners, knowing about 500 core idioms is sufficient for practical use. Native speakers typically use 200-300 idioms in daily conversation. Our collection covers 680+ essential idioms with meanings, origins, and examples."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best way to learn Chinese idioms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective approach is learning in context. Understand the story behind each idiom, explore them by theme (business, love, motivation), and practice using them in sentences. Browse our dictionary, curated lists, and daily blog for structured learning."
      }
    }
  ]
};

const THEME_MAP: { [key: string]: { name: string; description: string } } = {
  'success-perseverance': {
    name: 'Success & Perseverance',
    description: 'Idioms about achievement, determination, and resilience'
  },
  'life-philosophy': {
    name: 'Life Philosophy',
    description: 'Wisdom about life\'s meaning, perspective, and balance'
  },
  'wisdom-learning': {
    name: 'Wisdom & Learning',
    description: 'Knowledge, education, and intellectual growth'
  },
  'relationships-character': {
    name: 'Relationships & Character',
    description: 'Human bonds, moral character, and social wisdom'
  },
  'strategy-action': {
    name: 'Strategy & Action',
    description: 'Strategic thinking, decisive action, and planning'
  },
};

const POPULAR_IDIOMS = [
  { characters: '爱屋及乌', pinyin: 'ai wu ji wu', meaning: 'Love me, love my dog', slug: 'ai-wu-ji-wu' },
  { characters: '莫名其妙', pinyin: 'mo ming qi miao', meaning: 'Inexplicably strange', slug: 'mo-ming-qi-miao' },
  { characters: '七上八下', pinyin: 'qi shang ba xia', meaning: 'Anxious and restless', slug: 'qi-shang-ba-xia' },
  { characters: '一鸣惊人', pinyin: 'yi ming jing ren', meaning: 'Sudden remarkable success', slug: 'yi-ming-jing-ren' },
  { characters: '百折不挠', pinyin: 'bai zhe bu nao', meaning: 'Unshakeable despite adversity', slug: 'bai-zhe-bu-nao' },
  { characters: '知行合一', pinyin: 'zhi xing he yi', meaning: 'Practice what you know', slug: 'zhi-xing-he-yi' },
  { characters: '一模一样', pinyin: 'yi mu yi yang', meaning: 'Exactly identical', slug: 'yi-mu-yi-yang' },
  { characters: '学海无涯', pinyin: 'xue hai wu ya', meaning: 'Learning is limitless', slug: 'xue-hai-wu-ya' },
];

const FEATURED_LISTICLE_SLUGS = [
  'chinese-idioms-for-business',
  'chinese-idioms-about-love',
  'chinese-idioms-for-tattoos',
  'chinese-idioms-for-students',
  'chinese-idioms-about-success',
  'funny-chinese-idioms',
];

export default async function Home() {
  const allPosts = await getAllBlogPosts();
  const allListicles = getAllListicles();

  const themeCounts = Object.keys(THEME_MAP).reduce((acc, theme) => {
    acc[theme] = allPosts.filter(post =>
      post.idiom.theme.toLowerCase().replace(/[&\s]+/g, '-') === theme
    ).length;
    return acc;
  }, {} as { [key: string]: number });

  const featuredListicles = FEATURED_LISTICLE_SLUGS
    .map(slug => allListicles.find(l => l.slug === slug))
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* FAQ Schema for AI discoverability - static JSON-LD, no user input */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFAQSchema) }}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-red-50 via-white to-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,59,48,0.08),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
              Chinese Idioms (成语): Meanings in English{' '}
              <span className="text-[#FF3B30] inline-block relative mt-2 lg:mt-3">
                with Pinyin & Examples
                <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF3B30]/20 rounded-full"></div>
              </span>
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mt-6 max-w-2xl mx-auto">
              The most complete chengyu resource online. {allPosts.length}+ idioms with English meanings, pinyin pronunciation, historical origins, and practical examples. Browse by theme, explore curated lists, or search our full collection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Link
                href="/dictionary"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D32F2F] text-white font-semibold rounded-lg hover:bg-red-800 transition-colors"
              >
                <Search className="w-5 h-5" />
                Browse Dictionary
              </Link>
              <Link
                href="/themes"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Layers className="w-5 h-5" />
                Explore by Theme
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Theme */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Theme</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(THEME_MAP).map(([slug, theme]) => (
              <Link
                key={slug}
                href={`/themes/${slug}`}
                className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-all group"
              >
                <p className="font-semibold text-gray-900 group-hover:text-red-700 text-sm">{theme.name}</p>
                <p className="text-xs text-gray-500 mt-1">{theme.description}</p>
                <p className="text-xs text-red-600 font-medium mt-2">{themeCounts[slug] || 0} idioms →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Curated Collections */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Curated Idiom Collections</h2>
            <Link href="/blog/lists" className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1">
              View all {allListicles.length}+ lists <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredListicles.map((listicle) => (
              <Link
                key={listicle!.slug}
                href={`/blog/lists/${listicle!.slug}`}
                className="p-5 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-all"
              >
                <h3 className="font-semibold text-gray-900 mb-1">{listicle!.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{listicle!.description}</p>
                <p className="text-xs text-red-600 font-medium mt-3">{listicle!.idiomIds.length} idioms →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Searched Idioms */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Most Searched Chinese Idioms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {POPULAR_IDIOMS.map((idiom) => (
              <Link key={idiom.slug} href={`/blog/${idiom.slug}`} className="p-4 bg-gray-50 rounded-lg hover:shadow-md transition-all border border-gray-100 hover:border-red-200">
                <p className="font-bold text-gray-900 text-lg">{idiom.characters}</p>
                <p className="text-sm text-gray-500">{idiom.pinyin}</p>
                <p className="text-xs text-red-600 mt-1 font-medium">{idiom.meaning}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/dictionary" className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center gap-1">
              Browse full dictionary ({allPosts.length}+ idioms) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* What Are Chengyu - AI/AEO friendly */}
      <section className="bg-white py-8">
        <div className="container mx-auto px-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 max-w-4xl mx-auto">
            <h2 className="font-bold text-gray-900 mb-3 text-lg">What Are Chinese Idioms (Chengyu)?</h2>
            <p className="text-gray-700 mb-4">
              Chinese idioms (成语, chéng yǔ) are fixed four-character expressions with meanings beyond their literal translation.
              Originating from ancient literature, historical events, and folk wisdom, they are essential for Chinese language mastery.
            </p>
            <ul className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
              <li><strong>Total idioms:</strong> 5,000+ in common use</li>
              <li><strong>Essential for learners:</strong> ~500 core idioms</li>
              <li><strong>Structure:</strong> Always 4 characters</li>
              <li><strong>Our collection:</strong> {allPosts.length}+ with meanings, origins & examples</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/faq" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Learn more in our FAQ →
              </Link>
              <Link href="/blog/lists" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Browse idioms by topic →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* App Promo - Compact */}
      <section className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 max-w-2xl mx-auto">
            <div className="text-center sm:text-left">
              <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2 justify-center sm:justify-start">
                <BookOpen className="w-5 h-5 text-[#FF3B30]" />
                Learn on the Go
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Get a new idiom on your home screen every day with our free iOS app.
              </p>
            </div>
            <a
              href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity shrink-0"
              aria-label="Download Chinese Idioms on the App Store"
            >
              <Image
                src="/app-store-badge.svg"
                alt="Download on the App Store"
                width={140}
                height={47}
                className="w-36"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} chineseidioms</p>
              <span className="hidden sm:inline text-gray-400">•</span>
              <a
                href="https://wilsonlimset.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Built by Wilson
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/dictionary" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dictionary
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <LanguageSelector currentLang="en" />
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
