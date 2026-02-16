import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supported languages
const SUPPORTED_LANGUAGES = ['es', 'pt', 'id', 'hi', 'ja', 'ko', 'vi', 'th', 'ar', 'fr', 'tl', 'ms', 'ru'];

// Language detection from Accept-Language header
function detectLanguage(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return null;

  // Parse Accept-Language header (e.g., "en-US,en;q=0.9,es;q=0.8")
  const languages = acceptLanguage.split(',').map(lang => {
    const [code] = lang.trim().split(';');
    return code.split('-')[0].toLowerCase(); // Get primary language code
  });

  // Find first supported language
  for (const lang of languages) {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      return lang;
    }
  }

  return null;
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  // Redirect old dated blog URLs (e.g. /blog/2025-01-01-slug → /blog/slug)
  const datedBlogMatch = url.pathname.match(/^(?:\/([a-z]{2}))?\/blog\/\d{4}-\d{2}-\d{2}-(.+)$/);
  if (datedBlogMatch) {
    const lang = datedBlogMatch[1];
    const slug = datedBlogMatch[2];
    const newPath = lang ? `/${lang}/blog/${slug}` : `/blog/${slug}`;
    url.pathname = newPath;
    return NextResponse.redirect(url, { status: 301 });
  }

  // Auto-detect language on homepage only (not blog or other pages)
  if (url.pathname === '/' && !request.cookies.get('lang-preference')) {
    const detectedLang = detectLanguage(request);

    if (detectedLang) {
      // Redirect to detected language
      const response = NextResponse.redirect(new URL(`/${detectedLang}`, request.url));
      // Set cookie to avoid repeat redirects (expires in 1 year)
      response.cookies.set('lang-preference', detectedLang, {
        maxAge: 31536000,
        path: '/'
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Homepage (language detection)
    '/',
    // Blog paths (dated URL redirects)
    '/blog/:path*',
    '/:lang/blog/:path*',
  ],
};