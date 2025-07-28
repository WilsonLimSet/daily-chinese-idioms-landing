import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

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