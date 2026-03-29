'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { GuideProfile, GuidesResponse, GuideQuery } from '../types/guide';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export type GuideProfilePayload = {
  bio: string;
  location: string;
  hourlyRate: number;
  yearsExperience: number;
  tripsCompleted: number;
  specialties: string[]; // array of Specialty ObjectIds
  languages: string[];
  expertiseLevel: 'elite' | 'professional' | 'local';
};

export async function createGuideProfile(
  payload: GuideProfilePayload,
): Promise<ActionResult<GuideProfile>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<GuideProfile>('/guides/profile', payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function updateGuideProfile(
  payload: Partial<GuideProfilePayload>,
): Promise<ActionResult<GuideProfile>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch<GuideProfile>('/guides/profile', payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function getMyGuideProfile(): Promise<GuideProfile | null> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<GuideProfile>('/guides/me');
    return data;
  } catch {
    return null;
  }
}

export async function getGuides(params?: GuideQuery): Promise<GuidesResponse> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<GuidesResponse>('/guides', { params });
  return data;
}

export async function getGuide(id: string): Promise<GuideProfile> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<GuideProfile>(`/guides/${id}`);
  return data;
}
