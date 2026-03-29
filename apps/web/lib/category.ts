'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Category } from '../types/category';

export async function adminCreateCategory(
  payload: { name: string; color?: string },
): Promise<{ success: true; data: Category } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Category>('/categories', payload);
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
    const authApi = await getAuthApi();
    const { data } = await authApi.patch<Category>(`/categories/${id}`, payload);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminDeleteCategory(
  id: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/categories/${id}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}
