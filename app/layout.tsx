import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Chinese Idioms (成语) Dictionary: 365+ Chengyu with English Meanings & Pinyin",
  description: "Master Chinese idioms (chengyu) with our complete dictionary of 365+ expressions. Learn meanings, pinyin, origins, and usage examples. Daily updates, iOS widgets & searchable database.",
  metadataBase: new URL('https://www.chineseidioms.com'),
  keywords: ['chinese idioms', 'chengyu', 'chinese proverbs', 'learn chinese idioms', 'chengyu dictionary', 'chinese idioms meanings', 'pinyin', 'mandarin idioms', 'chinese culture'],
  alternates: {
    canonical: 'https://www.chineseidioms.com',
    languages: {
      'en': 'https://www.chineseidioms.com',
      'es': 'https://www.chineseidioms.com/es',
      'pt': 'https://www.chineseidioms.com/pt',
      'id': 'https://www.chineseidioms.com/id',
      'vi': 'https://www.chineseidioms.com/vi',
      'ja': 'https://www.chineseidioms.com/ja',
      'ko': 'https://www.chineseidioms.com/ko',
      'th': 'https://www.chineseidioms.com/th',
      'hi': 'https://www.chineseidioms.com/hi',
      'ar': 'https://www.chineseidioms.com/ar',
      'fr': 'https://www.chineseidioms.com/fr',
      'tl': 'https://www.chineseidioms.com/tl',
      'ms': 'https://www.chineseidioms.com/ms',
      'ru': 'https://www.chineseidioms.com/ru',
      'zh': 'https://www.chineseidioms.com'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    alternateLocale: ['es_ES', 'pt_BR', 'id_ID', 'vi_VN', 'ja_JP', 'ko_KR', 'th_TH', 'hi_IN', 'ar_AR', 'fr_FR', 'tl_PH', 'ms_MY', 'ru_RU'],
    url: 'https://www.chineseidioms.com',
    title: "Chinese Idioms Dictionary: 365+ Chengyu with English Meanings & Pinyin",
    description: "Master 365+ Chinese idioms (chengyu) with English meanings, pinyin, origins, and examples. Daily updates, iOS widgets & complete searchable dictionary.",
    siteName: 'Daily Chinese Idioms',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Chinese Idioms Dictionary with Meanings'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chinese Idioms Dictionary - Meanings & Examples",
    description: "Complete guide to Chinese idioms (chengyu) with English meanings, pinyin pronunciation, and cultural examples.",
    images: ['/og-image.png'],
    creator: '@chineseidioms'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Daily Chinese Idioms',
              alternateName: 'Chinese Idioms Dictionary',
              url: 'https://www.chineseidioms.com',
              description: 'Learn Chinese idioms (chengyu) with English meanings, pinyin pronunciation, and cultural context.',
              inLanguage: 'en',
              potentialAction: {
                '@type': 'SearchAction',
                target: {
                  '@type': 'EntryPoint',
                  urlTemplate: 'https://www.chineseidioms.com/blog?q={search_term_string}'
                },
                'query-input': 'required name=search_term_string'
              },
              mainEntity: {
                '@type': 'EducationalOrganization',
                name: 'Daily Chinese Idioms',
                url: 'https://www.chineseidioms.com',
                sameAs: ['https://apps.apple.com/us/app/daily-chinese-idioms/id6740611324']
              }
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
