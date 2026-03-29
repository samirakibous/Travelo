'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Advice, AdviceQuery } from '../types/advice';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createAdvice(formData: FormData): Promise<ActionResult<Advice>> {
  try {
    const authApi = await getAuthApi();
    const API_URL = process.env.API_URL ?? 'http://localhost:3000/api';

    // Use native fetch for multipart/form-data
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;

    const res = await fetch(`${API_URL}/advices`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.message ?? 'Erreur lors de la création' };
    }

    const data: Advice = await res.json();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function deleteAdvice(id: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/advices/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function getMyAdvices(): Promise<Advice[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Advice[]>('/advices/mine');
    return data;
  } catch {
    return [];
  }
}

export async function getAdvices(query: AdviceQuery = {}): Promise<Advice[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Advice[]>('/advices', { params: query });
    return data;
  } catch {
    return [];
  }
}

export async function getAdvice(id: string): Promise<Advice | null> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Advice>(`/advices/${id}`);
    return data;
  } catch {
    return null;
  }
}

export async function voteAdvice(
  adviceId: string,
  type: 'useful' | 'not_useful',
): Promise<ActionResult<{ usefulVotes: number; notUsefulVotes: number; userVote: 'useful' | 'not_useful' | null }>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch(`/advices/${adviceId}/vote`, { type });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
