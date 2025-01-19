import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Star, Shield, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-sm sticky top-0 shadow-sm z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-helvetica text-[#FF3B30]">
                Daily Chinese Idioms
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <a 
                href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF3B30] text-white px-4 py-2 rounded-full flex items-center space-x-2 hover:bg-red-600 transition-colors"
              >
                <span>Download Now</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-b from-red-50 via-white to-white py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 lg:pr-8">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-helvetica text-gray-900">
                  Master Chinese Wisdom,{' '}
                  <span className="text-[#FF3B30]">
                    One Idiom at a Time
                  </span>
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed font-helvetica">
                  Enhance your understanding of Chinese culture through carefully curated idioms, 
                  delivered daily through elegant widgets on your home screen.
                </p>
                <a 
                    href="https://apps.apple.com/us/app/dailychineseidioms/id6740611324" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Image 
                      src="/app-store-badge.svg" 
                      alt="Download on the App Store" 
                      width={140} 
                      height={46}
                      priority
                      className="w-36"
                    />
                  </a>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/30 to-red-300/30 blur-3xl rounded-full" />
                <div className="relative flex justify-center items-center gap-4">
                  <div className="transform-gpu hover:scale-105 transition-transform">
                    <Image
                      src="/app-screenshot.jpeg"
                      alt="App Screenshot"
                      width={280}
                      height={560}
                      className="rounded-3xl shadow-xl"
                      priority
                    />
                  </div>
                  <div className="transform-gpu hover:scale-105 transition-transform">
                    <Image
                      src="/widget-screenshot.jpeg"
                      alt="Widget Screenshot"
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

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-helvetica text-center mb-12 text-gray-900">
            Why Choose Daily Chinese Idioms?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all group">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-helvetica text-gray-900 mb-3 group-hover:text-[#FF3B30] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-helvetica">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-6 w-full">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-2">
            <p className="text-gray-600 font-helvetica">© {new Date().getFullYear()} Daily Chinese Idioms. All rights reserved.</p>
            <p className="text-gray-600 font-helvetica">
              Crafted with care by{' '}
              <a 
                href="https://wilsonlimset.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#FF3B30] hover:text-red-600 transition-colors font-medium"
              >
                Wilson
              </a>
            </p>
          </div>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    title: "Beautiful Widgets",
    description: "Transform your home screen with elegantly designed widgets that make learning Chinese idioms a seamless part of your daily routine.",
    icon: <Star className="w-8 h-8 text-[#FF3B30]" />
  },
  {
    title: "Privacy Focused",
    description: "Your privacy is our priority. Enjoy a completely offline experience with no data collection or tracking whatsoever.",
    icon: <Shield className="w-8 h-8 text-[#FF3B30]" />
  },
  {
    title: "Daily Learning",
    description: "Immerse yourself in Chinese culture through carefully selected idioms, complete with detailed explanations and cultural context.",
    icon: <BookOpen className="w-8 h-8 text-[#FF3B30]" />
  }
]