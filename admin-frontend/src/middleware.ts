import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('haizotech_session')?.value;

  const isPublicPage =
    pathname === '/login' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/forgot-password/') ||
    pathname === '/reset-password' ||
    pathname.startsWith('/invite/');

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Cosmetic routing gate only. Real authorization is enforced by the
  // backend's authenticate middleware on every API call. We just check
  // for the presence of a session cookie to decide login vs dashboard.
  const hasSession = Boolean(token);

  if (!hasSession && !isPublicPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  if (hasSession && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
