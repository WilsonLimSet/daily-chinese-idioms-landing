import Image from 'next/image'
import Link from 'next/link'
import { Star, Shield, BookOpen } from 'lucide-react'
import LanguageSelector from './components/LanguageSelector'
import AdUnit from './components/AdUnit'

// FAQ structured data for AI discoverability - static content, safe to embed
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
        "text": "For intermediate Chinese learners, knowing about 500 core idioms is sufficient for practical use. Native speakers typically use 200-300 idioms in daily conversation. Our collection covers 365+ essential idioms - one for each day of the year."
      }
    },
    {
      "@type": "Question",
      "name": "What is the best way to learn Chinese idioms?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The most effective approach is daily practice with context. Learn the story behind each idiom, use spaced repetition, and practice using them in sentences. Our iOS app delivers one idiom to your home screen each day with pinyin, meaning, and cultural background."
      }
    }
  ]
};

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* FAQ Schema for AI discoverability - static JSON-LD data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageFAQSchema) }}
      />

      {/* Enhanced Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-red-50 via-white to-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,59,48,0.1),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  Chinese Idioms (成语): Meanings in English{' '}
                  <span className="text-[#FF3B30] inline-block relative mt-2 lg:mt-3">
                    with Pinyin & Examples
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF3B30]/20 rounded-full"></div>
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Learn Chinese idioms (chengyu) through beautiful home screen widgets. Daily updates with 
                  pinyin pronunciation, English meanings, origins, and practical examples.
                </p>
                <div className="pt-4">
                  <a 
                    href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block hover:opacity-80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-lg"
                    aria-label="Download Daily Chinese Idioms on the App Store"
                  >
                    <Image 
                      src="/app-store-badge.svg" 
                      alt="Download on the App Store" 
                      width={160}
                      height={53}
                      priority
                      className="w-40"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-300/30 blur-3xl rounded-full animate-pulse" 
                  style={{ animationDuration: '4s' }}
                />
                <div className="relative flex justify-center items-center gap-4 perspective-1000">
                  <div className="transform-gpu transition-all duration-300 hover:scale-105 hover:-rotate-2 hover:shadow-2xl">
                    <Image
                      src="/app-screenshot.jpeg"
                      alt="Daily Chinese Idioms app interface showing detailed view of an idiom with its meaning and usage"
                      width={280}
                      height={560}
                      className="rounded-3xl shadow-xl"
                      priority
                    />
                  </div>
                  <div className="transform-gpu transition-all duration-300 hover:scale-105 hover:rotate-2 hover:shadow-2xl">
                    <Image
                      src="/widget-screenshot.jpeg"
                      alt="Home screen widget showcase displaying different sizes of Daily Chinese Idioms widgets"
                      width={280}
                      height={560}
                      className="rounded-3xl shadow-xl"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Facts Section - AI-Friendly Summary */}
      <section className="bg-white py-8 border-b border-gray-100">
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
              <li><strong>Our collection:</strong> 365+ with daily updates</li>
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

      {/* Popular Idioms Section - Internal Linking */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            Most Searched Chinese Idioms
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/blog/ai-wu-ji-wu" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900">爱屋及乌</p>
              <p className="text-sm text-gray-600">ai wu ji wu</p>
              <p className="text-xs text-blue-600 mt-1">Love me, love my dog</p>
            </Link>
            <Link href="/blog/mo-ming-qi-miao" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900">莫名其妙</p>
              <p className="text-sm text-gray-600">mo ming qi miao</p>
              <p className="text-xs text-blue-600 mt-1">Inexplicably wonderful</p>
            </Link>
            <Link href="/blog/qi-shang-ba-xia" className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <p className="font-bold text-gray-900">七上八下</p>
              <p className="text-sm text-gray-600">qi shang ba xia</p>
              <p className="text-xs text-blue-600 mt-1">Anxious and restless</p>
            </Link>
            <Link href="/dictionary" className="p-3 bg-red-50 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center">
              <p className="text-red-700 font-semibold">Chengyu Dictionary →</p>
            </Link>
          </div>
        </div>
      </section>
      
      <AdUnit type="display" />

      {/* Enhanced Features Section */}
      <section className="bg-white py-16 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Learn Chinese Idioms Daily
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 
                         shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="mb-4 transform-gpu transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AdUnit type="multiplex" />

      {/* Enhanced Footer */}
      <footer className="bg-gray-50 py-8 w-full border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <p className="text-gray-600">© {new Date().getFullYear()} Daily Chinese Idioms</p>
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
              <Link
                href="/blog"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Blog
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/dictionary"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dictionary
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/faq"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQ
              </Link>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link
                href="/privacy"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
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

const features = [
  {
    title: "Home Screen Widgets",
    description: "Choose from small, medium, or large widgets to display Chinese idioms right on your home screen. Each size shows different levels of detail.",
    icon: <Star className="w-8 h-8 text-[#FF3B30]" aria-hidden="true" />
  },
  {
    title: "Works Offline",
    description: "The app works completely offline with no data collection. All idioms are stored locally on your device.",
    icon: <Shield className="w-8 h-8 text-[#FF3B30]" aria-hidden="true" />
  },
  {
    title: "Daily Updates",
    description: "A new idiom appears each day with pinyin pronunciation, English translation, and its cultural background. Use the random button to see more.",
    icon: <BookOpen className="w-8 h-8 text-[#FF3B30]" aria-hidden="true" />
  }
]