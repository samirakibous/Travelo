'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Specialty } from '../types/specialty';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function adminCreateSpecialty(payload: { name: string }): Promise<ActionResult<Specialty>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Specialty>('/specialties', payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function adminUpdateSpecialty(id: string, payload: { name: string }): Promise<ActionResult<Specialty>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch<Specialty>(`/specialties/${id}`, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function adminDeleteSpecialty(id: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/specialties/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function getSpecialties(): Promise<Specialty[]> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<Specialty[]>('/specialties');
  return data;
}
