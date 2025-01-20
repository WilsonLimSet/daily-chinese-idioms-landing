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
  title: "Daily Chinese Idioms - Home Screen Widget",
  description: "Discover Chinese idioms through beautiful widgets on your home screen. New phrases daily, with translations and stories behind them.",
  metadataBase: new URL('https://www.chineseidioms.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.chineseidioms.com',
    title: "Daily Chinese Idioms - Home Screen Widget",
    description: "Discover Chinese idioms through beautiful widgets on your home screen. New phrases daily, with translations and stories behind them.",
    siteName: 'Daily Chinese Idioms',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Daily Chinese Idioms App'
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Daily Chinese Idioms - Home Screen Widget",
    description: "Discover Chinese idioms through beautiful widgets on your home screen. New phrases daily, with translations and stories behind them.",
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
