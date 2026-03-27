import { api, parseApiError } from './api';
import type { Review } from '../types/review';

export async function apiGetReviews(guideId: string): Promise<Review[]> {
  try {
    const { data } = await api.get<Review[]>(`/guides/${guideId}/reviews`);
    return data;
  } catch (error) {
    throw new Error(parseApiError(error));
  }
}
