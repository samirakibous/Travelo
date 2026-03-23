import { api } from './api';
import type { Category } from '../types/category';

export async function apiGetCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}

export async function apiAdminCreateCategory(
  token: string,
  payload: { name: string; color?: string },
): Promise<Category> {
  const { data } = await api.post<Category>('/categories', payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function apiAdminUpdateCategory(
  token: string,
  id: string,
  payload: { name?: string; color?: string },
): Promise<Category> {
  const { data } = await api.patch<Category>(`/categories/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function apiAdminDeleteCategory(token: string, id: string): Promise<void> {
  await api.delete(`/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
