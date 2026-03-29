import { api } from './api';
import type { Category } from '../types/category';

export async function apiGetCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories');
  return data;
}
