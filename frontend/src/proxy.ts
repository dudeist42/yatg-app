import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/auth', '/api/auth'];
const DARK_THEME_PATHS = [/\/movie\/*./];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  const payload = refreshToken && parseJwtPayload(refreshToken);

  if (!payload || isExpired(payload.exp)) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  const response = NextResponse.next();

  if (DARK_THEME_PATHS.some((p) => p.test(pathname))) {
    response.headers.set('x-theme', 'dark');
  }

  return response;
}

function parseJwtPayload(token: string) {
  try {
    const base64 = token.split('.')[1];
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isExpired(exp: number) {
  return Date.now() / 1000 > exp;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
