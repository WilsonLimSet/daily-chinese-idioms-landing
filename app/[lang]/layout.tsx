import { Analytics } from "@vercel/analytics/react";
import { notFound } from "next/navigation";
import "../globals.css";

const SUPPORTED_LANGUAGES = new Set([
  'es', 'pt', 'id', 'hi', 'ja', 'ko', 'vi', 'th', 'ar', 'fr', 'de', 'tl', 'ms', 'ru'
]);

const RTL_LANGUAGES = new Set(['ar']);

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
