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
  metadataBase: new URL('https://dailychineseidioms.com'),
  openGraph: {
    title: "Daily Chinese Idioms - Home Screen Widget",
    description: "Discover Chinese idioms through beautiful widgets on your home screen. New phrases daily, with translations and stories behind them.",
    images: ['/og-image.jpg'], 
  },
  twitter: {
    card: 'summary_large_image',
    title: "Daily Chinese Idioms - Home Screen Widget",
  description: "Discover Chinese idioms through beautiful widgets on your home screen. New phrases daily, with translations and stories behind them.",
    images: ['/og-image.jpg'], 
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
      </body>
      <Analytics />
    </html>
  );
}
