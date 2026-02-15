import { Analytics } from "@vercel/analytics/react";
import "../globals.css";

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <html lang={lang}>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
