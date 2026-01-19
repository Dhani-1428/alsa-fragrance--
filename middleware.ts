import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const hostname = request.headers.get('host') || ''
  
  // Get the preferred domain from environment variable or default to www
  const preferredDomain = process.env.NEXT_PUBLIC_PREFERRED_DOMAIN || 'www.alsafragrance.com'
  const preferredHost = preferredDomain.replace(/^https?:\/\//, '')
  
  // Skip if it's already the preferred domain or localhost/development
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || hostname.includes('vercel.app')) {
    return NextResponse.next()
  }
  
  // Redirect non-www to www (or vice versa based on preferred domain)
  if (hostname === 'alsafragrance.com' && preferredHost === 'www.alsafragrance.com') {
    url.host = 'www.alsafragrance.com'
    return NextResponse.redirect(url, 301)
  }
  
  if (hostname === 'www.alsafragrance.com' && preferredHost === 'alsafragrance.com') {
    url.host = 'alsafragrance.com'
    return NextResponse.redirect(url, 301)
  }
  
  return NextResponse.next()
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
}
