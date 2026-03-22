'use server';

import { cookies } from 'next/headers';
import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function updateProfile(payload: {
  firstName?: string;
  lastName?: string;
  email?: string;
}): Promise<ActionResult<any>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch('/users/me', payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function changePassword(payload: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult<{ message: string }>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch('/users/me/password', payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function uploadAvatar(formData: FormData): Promise<ActionResult<any>> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const response = await fetch(`${apiUrl}/users/me/avatar`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Erreur upload' };
    }
    return { success: true, data };
  } catch {
    return { success: false, error: 'Impossible de contacter le serveur' };
  }
}
