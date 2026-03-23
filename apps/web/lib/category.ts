'use server';

import { cookies } from 'next/headers';
import {
  apiAdminCreateCategory,
  apiAdminUpdateCategory,
  apiAdminDeleteCategory,
} from '../services/category.service';
import { parseApiError } from '../services/api';
import type { Category } from '../types/category';

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value ?? '';
}

export async function adminCreateCategory(
  payload: { name: string; color?: string },
): Promise<{ success: true; data: Category } | { success: false; error: string }> {
  try {
    const data = await apiAdminCreateCategory(await getToken(), payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminUpdateCategory(
  id: string,
  payload: { name?: string; color?: string },
): Promise<{ success: true; data: Category } | { success: false; error: string }> {
  try {
    const data = await apiAdminUpdateCategory(await getToken(), id, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminDeleteCategory(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await apiAdminDeleteCategory(await getToken(), id);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}
