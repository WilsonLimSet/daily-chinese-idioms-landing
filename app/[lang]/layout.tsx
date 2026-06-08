import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { notFound } from "next/navigation";
import { isNoindexLanguage } from "@/src/lib/constants";
import "../globals.css";

const SUPPORTED_LANGUAGES = new Set([
  'es', 'pt', 'id', 'hi', 'ja', 'ko', 'vi', 'th', 'ar', 'fr', 'de', 'tl', 'ms', 'ru'
]);

const RTL_LANGUAGES = new Set(['ar']);

// Dropped languages (Jun 2026) are kept live but noindexed at the root of every
// localized route. Child pages that don't set their own `robots` inherit this;
// the idiom route sets it explicitly too so the value is never cleared.
export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang } = await params;
  return isNoindexLanguage(lang)
    ? { robots: { index: false, follow: true } }
    : {};
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!SUPPORTED_LANGUAGES.has(lang)) {
    notFound();
  }

  return (
    <html lang={lang} dir={RTL_LANGUAGES.has(lang) ? 'rtl' : 'ltr'}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
