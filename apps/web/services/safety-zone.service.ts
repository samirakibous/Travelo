import { api, parseApiError } from './api';
import type { SafeZone, SafeZoneQuery } from '../types/safety-zone';

export async function apiGetSafetyZones(query: SafeZoneQuery = {}): Promise<SafeZone[]> {
  try {
    const params: Record<string, string> = {};
    if (query.riskLevel) params.riskLevel = query.riskLevel;
    if (query.category) params.category = query.category;
    if (query.time && query.time !== 'all') params.time = query.time;

    const { data } = await api.get<SafeZone[]>('/safety-zones', { params });
    return data;
  } catch (error) {
    throw new Error(parseApiError(error));
  }
}
