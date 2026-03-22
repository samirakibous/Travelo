import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register'];
const protectedRoutes = ['/dashboard', '/profile'];

function decodeJwtPayload(token: string): { sub: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
}

async function attemptRefresh(
  request: NextRequest,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken || isTokenExpired(refreshToken)) return null;

  const payload = decodeJwtPayload(refreshToken);
  if (!payload) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  try {
    const res = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: payload.sub, refreshToken }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

function applyTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
): NextResponse {
  const isProd = process.env.NODE_ENV === 'production';
  response.cookies.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 59 * 60,
    path: '/',
  });
  response.cookies.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const isPublic = publicRoutes.includes(pathname);
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  // Token valide → logique normale
  if (accessToken && !isTokenExpired(accessToken)) {
    if (isPublic) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Token expiré ou absent → tenter un refresh
  const newTokens = await attemptRefresh(request);

  if (newTokens) {
    if (isPublic) {
      return applyTokenCookies(
        NextResponse.redirect(new URL('/dashboard', request.url)),
        newTokens.accessToken,
        newTokens.refreshToken,
      );
    }
    return applyTokenCookies(NextResponse.next(), newTokens.accessToken, newTokens.refreshToken);
  }

  // Aucun token valide
  if (isProtected) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('refresh_token');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
