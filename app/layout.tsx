import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chinese Idioms (成语): Meanings in English with Pinyin & Examples",
  description: "Learn Chinese idioms (chengyu) with English meanings, pinyin pronunciation, and cultural context. Daily updates, home screen widgets, and searchable blog.",
  metadataBase: new URL('https://www.chineseidioms.com'),
  keywords: ['chinese idioms', 'chengyu', 'ai wu ji wu', 'mo ming qi miao', 'pinyin meanings', 'chinese proverbs', 'learn chinese'],
  alternates: {
    canonical: 'https://www.chineseidioms.com',
    languages: {
      'en': 'https://www.chineseidioms.com',
      'zh': 'https://www.chineseidioms.com'
    }
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.chineseidioms.com',
    title: "Chinese Idioms (成语): Meanings in English with Pinyin & Examples",
    description: "Learn Chinese idioms (chengyu) with English meanings, pinyin pronunciation, and cultural context. Daily updates and searchable blog.",
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
