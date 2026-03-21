'use server';

import { cookies } from 'next/headers';
import { apiLogin, apiRegister, apiLogout as apiLogoutCall, type RegisterPayload } from '../services/auth.service';
import { parseApiError } from '../services/api';
import { getUser } from './getUser';

type AuthResult =
  | { success: true; user: any }
  | { success: false; error: string };

async function setAuthCookie(accessToken: string) {
  const cookieStore = await cookies();
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 59 * 60,
    path: '/',
  });
}

export async function login(email: string, password: string): Promise<AuthResult> {
  try {
    const data = await apiLogin(email, password);
    await setAuthCookie(data.accessToken);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResult> {
  try {
    const data = await apiRegister(payload);
    await setAuthCookie(data.accessToken);
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function logout() {
  const user = await getUser();
  if (user?.id) {
    try {
      await apiLogoutCall(user.id);
    } catch {
      // on supprime le cookie même si l'appel API échoue
    }
  }
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
}
