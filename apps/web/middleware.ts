import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register'];
const protectedRoutes = ['/dashboard', '/profile', '/admin', '/community', '/guides'];

function decode(token: string | undefined) {
  if (!token) return null;
  try {
    const part = token.split('.')[1];
    if (!part) return null;
    return JSON.parse(atob(part));
  } catch {
    return null;
  }
}

function isExpired(token: string | undefined) {
  if (!token) return true;
  const payload = decode(token);
  return !payload || payload.exp * 1000 < Date.now();
}

async function refresh(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;
  if (!refreshToken || isExpired(refreshToken)) return null;

  const payload = decode(refreshToken);
  if (!payload) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: payload.sub, refreshToken }),
    });
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}

function setCookies(res: NextResponse, access: string, refresh: string) {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookies.set('access_token', access, { httpOnly: true, secure: isProd, path: '/' });
  res.cookies.set('refresh_token', refresh, { httpOnly: true, secure: isProd, path: '/' });

  return res;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;

  const isPublic = publicRoutes.includes(pathname);
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r));

  // 1. Token valide
  if (!isExpired(accessToken)) {
    if (isPublic) {
      const role = decode(accessToken)?.role;
      return NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // 2. Try refresh
  const tokens = await refresh(request);

  if (tokens) {
    const role = decode(tokens.accessToken)?.role;
    const res = isPublic
      ? NextResponse.redirect(new URL(role === 'admin' ? '/admin' : '/dashboard', request.url))
      : NextResponse.next();

    return setCookies(res, tokens.accessToken, tokens.refreshToken);
  }

  // 3. Pas authentifié
  if (isProtected) {
    const res = NextResponse.redirect(new URL('/login', request.url));
    res.cookies.delete('access_token');
    res.cookies.delete('refresh_token');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};