import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 🔑 1. Check for your authentication token cookie
  // Adjust 'access_token' to match whatever cookie name you save your JWT under during login
  const token = request.cookies.get("access_token")?.value;

  const { pathname } = request.nextUrl;

  // 🛡️ 2. If no token exists, redirect them straight to the login screen
  if (!token) {
    // We construct an absolute URL using the incoming request origin (e.g., http://localhost:3000)
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🔓 3. If a token exists, let them pass through seamlessly to the dashboard
  return NextResponse.next();
}

// 🎯 The matcher ensures this middleware ONLY runs on protected dashboard routes
export const config = {
  matcher: [
    /*
     * Excludes public paths from running the auth lock:
     * - api routes
     * - _next static assets & image optimization files
     * - favicon.ico
     * - login page
     * - register page
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|embed.js).*)",
  ],
};
