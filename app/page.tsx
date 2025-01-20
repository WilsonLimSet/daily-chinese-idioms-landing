import Image from 'next/image'
import Link from 'next/link'
import { Star, Shield, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">

      {/* Enhanced Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-red-50 via-white to-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,59,48,0.1),rgba(255,255,255,0))] pointer-events-none" />
        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                  Daily Chinese Idioms{' '}
                  <span className="text-[#FF3B30] inline-block relative mt-2 lg:mt-3">
                    On Your Home Screen
                    <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-[#FF3B30]/20 rounded-full"></div>
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Discover Chinese idioms through beautiful widgets on your home screen. New phrases daily, 
                  with translations and stories behind them.
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

      {/* Enhanced Features Section */}
      <section className="bg-white py-16 relative">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            What's Inside?
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
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#FF3B30] transition-colors">
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
                className="text-gray-600 hover:text-[#FF3B30] transition-colors"
              >
                Built by Wilson
              </a>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Link 
                href="/privacy" 
                className="text-gray-600 hover:text-[#FF3B30] transition-colors"
              >
                Privacy Policy
              </Link>
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