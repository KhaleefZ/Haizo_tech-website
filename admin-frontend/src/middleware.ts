import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // We check for a session token cookie
  const sessionToken = request.cookies.get('haizotech_session')?.value;
  
  const isLoginPage = pathname === '/login';
  const isPublicPage = isLoginPage
    || pathname === '/forgot-password'
    || pathname.startsWith('/forgot-password/')
    || pathname === '/reset-password';

  // Allow static files and API routes to pass through unhindered
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // If user is not logged in and tries to access ANY page other than public pages
  if (!sessionToken && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user IS logged in and tries to access the /login page, redirect them to dashboard
  if (sessionToken && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply this middleware to all paths except Next.js internals
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
