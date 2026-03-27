import { api, parseApiError } from './api';
import type { Advice, AdviceQuery } from '../types/advice';

export async function apiGetAdvices(query: AdviceQuery = {}): Promise<Advice[]> {
  try {
    const params: Record<string, string> = {};
    if (query.category) params.category = query.category;
    if (query.certifiedOnly) params.certifiedOnly = query.certifiedOnly;
    if (query.authorId) params.authorId = query.authorId;
    if (query.adviceType) params.adviceType = query.adviceType;

    const { data } = await api.get<Advice[]>('/advices', { params });
    return data;
  } catch (error) {
    throw new Error(parseApiError(error));
  }
}

export async function apiGetAdvice(id: string): Promise<Advice> {
  const { data } = await api.get<Advice>(`/advices/${id}`);
  return data;
}
