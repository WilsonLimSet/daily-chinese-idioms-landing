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
  title: "Chengyu: Daily Chinese Idioms - Home Screen Widget",
  description: "Learn Chinese idioms (chengyu) through beautiful widgets on your home screen. New idioms daily with pinyin, translations and cultural stories.",
  metadataBase: new URL('https://www.chineseidioms.com'),
  alternates: {
    canonical: 'https://www.chineseidioms.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.chineseidioms.com',
    title: "Chengyu: Daily Chinese Idioms - Home Screen Widget",
    description: "Learn Chinese idioms (chengyu) through beautiful widgets on your home screen. New idioms daily with pinyin, translations and cultural stories.",
    siteName: 'Chengyu: Daily Chinese Idioms',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Daily Chinese Idioms App'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Chengyu: Daily Chinese Idioms - Home Screen Widget",
    description: "Learn Chinese idioms (chengyu) through beautiful widgets on your home screen. New idioms daily with pinyin, translations and cultural stories.",
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
