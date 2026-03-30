'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Review, CreateReviewPayload } from '../types/review';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createReview(
  guideId: string,
  payload: CreateReviewPayload,
): Promise<ActionResult<Review>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Review>(`/guides/${guideId}/reviews`, payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function deleteReview(
  guideId: string,
  reviewId: string,
): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/guides/${guideId}/reviews/${reviewId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function getReviews(guideId: string): Promise<Review[]> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<Review[]>(`/guides/${guideId}/reviews`);
  return data;
}
