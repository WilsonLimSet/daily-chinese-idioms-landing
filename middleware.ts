import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Supported languages
const SUPPORTED_LANGUAGES = ['es', 'pt', 'id', 'hi', 'ja', 'ko', 'vi', 'th', 'ar', 'fr', 'tl', 'ms'];

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

  // Force HTTPS in production
  if (process.env.NODE_ENV === 'production' &&
      request.headers.get('x-forwarded-proto') === 'http') {
    url.protocol = 'https:';
    url.host = 'www.chineseidioms.com';
    return NextResponse.redirect(url, { status: 301 });
  }

  // Redirect non-www to www
  if (url.hostname === 'chineseidioms.com') {
    url.hostname = 'www.chineseidioms.com';
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

  // Set canonical header for pages with tracking parameters
  const response = NextResponse.next();

  // Add canonical link header to help with SEO
  const canonicalUrl = new URL(url);
  canonicalUrl.search = ''; // Remove all query parameters for canonical
  response.headers.set('Link', `<${canonicalUrl.toString()}>; rel="canonical"`);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};