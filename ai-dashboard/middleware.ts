import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔓 FORCE BYPASS GUARD: Allow anyone to view the script asset and the embedded frame layout
  if (pathname === '/embed.js' || pathname.startsWith('/widget')) {
    return NextResponse.next();
  }

  // 🔑 Check for your authentication token cookie
  const token = request.cookies.get('access_token')?.value;

  // 🛡️ If no token exists, redirect them straight to the login screen
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// 🎯 Update your matcher exclusion pattern to include widget paths
export const config = {
  matcher: [
    /*
     * Excludes public paths from running the auth lock:
     * - api routes
     * - _next static assets & image optimization files
     * - favicon.ico
     * - login, register pages
     * - embed.js asset path
     * - widget layout views 🚀 EXCLUDED!
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|register|embed.js|widget).*)',
  ],
};