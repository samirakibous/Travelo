import { api } from './api';
import type { GuideProfile, GuidesResponse, GuideQuery } from '../types/guide';

export async function apiGetGuides(params?: GuideQuery): Promise<GuidesResponse> {
  const { data } = await api.get<GuidesResponse>('/guides', { params });
  return data;
}

export async function apiGetGuide(id: string): Promise<GuideProfile> {
  const { data } = await api.get<GuideProfile>(`/guides/${id}`);
  return data;
}
