import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Daily Chinese Idioms - Learn Chinese Culture One Idiom at a Time",
  description: "Enhance your understanding of Chinese culture through carefully curated idioms, delivered daily through elegant widgets on your home screen.",
  metadataBase: new URL('https://dailychineseidioms.com'),
  openGraph: {
    title: 'Daily Chinese Idioms - Learn Chinese Culture One Idiom at a Time',
    description: 'Enhance your understanding of Chinese culture through carefully curated idioms, delivered daily through elegant widgets on your home screen.',
    images: ['/og-image.jpg'], // Make sure to add this image to your public folder
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Daily Chinese Idioms - Learn Chinese Culture One Idiom at a Time',
    description: 'Enhance your understanding of Chinese culture through carefully curated idioms, delivered daily through elegant widgets on your home screen.',
    images: ['/og-image.jpg'], // Same image as OG
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
    </html>
  );
}
