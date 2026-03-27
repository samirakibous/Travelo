'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { EmergencyContact } from '../types/sos';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getMyContacts(): Promise<EmergencyContact[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<EmergencyContact[]>('/sos/contacts');
    return data;
  } catch {
    return [];
  }
}

export async function createContact(
  payload: { name: string; phone: string; relationship?: string },
): Promise<ActionResult<EmergencyContact>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<EmergencyContact>('/sos/contacts', payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function deleteContact(id: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/sos/contacts/${id}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
