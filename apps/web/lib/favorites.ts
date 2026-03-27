'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getSavedGuideIds(): Promise<string[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<string[]>('/users/me/saved-guides');
    return data;
  } catch {
    return [];
  }
}

export async function toggleSavedGuide(
  guideProfileId: string,
): Promise<ActionResult<{ saved: boolean }>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<{ saved: boolean }>(
      `/users/me/saved-guides/${guideProfileId}`,
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
