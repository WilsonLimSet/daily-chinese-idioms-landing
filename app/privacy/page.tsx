import Link from 'next/link'
import { Metadata } from 'next'
import { LANGUAGES } from '@/src/lib/constants'

export const metadata: Metadata = {
  title: 'Privacy Policy | Chinese Idioms',
  description: 'Daily Chinese Idiom privacy policy - We do not collect, store, or share any personal information.',
  openGraph: {
    title: 'Privacy Policy | Chinese Idioms',
    description: 'Privacy policy for Chinese Idioms app',
    url: 'https://www.chineseidioms.com/privacy',
    siteName: 'Chinese Idioms',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
    type: 'website',
  },
  alternates: {
    canonical: 'https://www.chineseidioms.com/privacy',
    languages: {
      'x-default': '/privacy',
      'en': '/privacy',
      ...Object.fromEntries(
        Object.keys(LANGUAGES).map(lang => [lang, `/${lang}/privacy`])
      ),
    },
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center space-x-4 mb-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-gray-900 flex items-center space-x-1"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span>Back to Home</span>
            </Link>
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: January 13, 2025</p>
          </div>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Overview</h2>
            <p className="text-gray-700">
              Daily Chinese Idiom is a widget and app that displays Chinese idioms. We believe in complete transparency and want you to know that we do not collect, store, or share any personal information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Information Collection</h2>
            <p className="text-gray-700">Our app:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Does not collect personal information</li>
              <li>Does not require user registration</li>
              <li>Does not track user activity</li>
              <li>Does not use cookies</li>
              <li>Does not access device location</li>
              <li>Does not require internet access</li>
              <li>Does not store any user data</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Widget Functionality</h2>
            <p className="text-gray-700">The widget operates completely locally on your device and:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Only displays pre-loaded Chinese idioms</li>
              <li>Does not transmit any data</li>
              <li>Does not access any device features</li>
              <li>Does not require any permissions</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to Our App</h2>
            <p className="text-gray-700">
              All idioms and functionality are included in the app installation. Any changes or updates will be made through the App Store update process.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
} 