'use server';

import { cookies } from 'next/headers';
import { api } from '../services/api';
import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import { getUser } from './getUser';

export type RegisterPayload = {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string;
  password: string;
  role?: string;
};

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
};

type AuthResult =
  | { success: true; user: any }
  | { success: false; error: string };

function decodeJwtPayload(token: string): { sub: string; exp: number } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

async function setAuthCookies(accessToken: string, refreshToken: string) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieStore = await cookies();

  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 59 * 60,
    path: '/',
  });

  cookieStore.set('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
    await setAuthCookies(data.accessToken, data.refreshToken);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  try {
    const { data } = await api.post<AuthResponse>('/auth/register', payload);
    await setAuthCookies(data.accessToken, data.refreshToken);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function logout() {
  const user = await getUser();
  if (user?.id) {
    try {
      const authApi = await getAuthApi();
      await authApi.post('/auth/logout', { userId: user.id });
    } catch {
      // on supprime les cookies même si l'appel API échoue
    }
  }
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function refresh(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    if (!refreshToken) return false;

    const payload = decodeJwtPayload(refreshToken);
    if (!payload || payload.exp * 1000 < Date.now()) return false;

    const { data } = await api.post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { userId: payload.sub, refreshToken },
    );
    await setAuthCookies(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}
