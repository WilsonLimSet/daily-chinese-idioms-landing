import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">Daily Chinese Idioms</div>
            <div>
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 mb-12 lg:mb-0">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Learn Chinese Idioms Daily
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Discover the wisdom of Chinese culture through beautiful idioms, right on your home screen with our elegant widgets.
              </p>
              <div className="flex space-x-4">
                <Link href="https://apps.apple.com/" className="flex items-center hover:opacity-80 transition-opacity">
                  <Image 
                    src="/app-store-badge.svg" 
                    alt="Download on the App Store" 
                    width={150} 
                    height={50}
                    priority
                  />
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative flex justify-center items-center gap-4">
                <Image
                  src="/app-screenshot.png"
                  alt="App Screenshot"
                  width={300}
                  height={600}
                  className="rounded-3xl shadow-xl"
                  priority
                />
                <Image
                  src="/widget-screenshot.png"
                  alt="Widget Screenshot"
                  width={250}
                  height={500}
                  className="rounded-3xl shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose Our App?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center space-y-2">
            <p className="text-gray-600">© {new Date().getFullYear()} Daily Chinese Idioms. All rights reserved.</p>
            <p className="text-gray-600">
              Made by{' '}
              <a 
                href="https://wilsonlimset.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:text-blue-800 transition-colors"
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
    description: "Elegant home screen widgets that seamlessly integrate Chinese idioms into your daily life."
  },
  {
    title: "Privacy Focused",
    description: "No data collection, no tracking, and no internet required. Your privacy comes first."
  },
  {
    title: "Daily Learning",
    description: "Learn new Chinese idioms every day with clear explanations and cultural context."
  }
]