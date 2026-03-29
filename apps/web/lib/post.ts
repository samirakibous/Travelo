'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Post } from '../types/post';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(formData: FormData): Promise<ActionResult<Post>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Post>('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function updatePost(
  postId: string,
  formData: FormData,
): Promise<ActionResult<Post>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch<Post>(`/posts/${postId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/posts/${postId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function votePost(
  postId: string,
  type: 'up' | 'down',
): Promise<ActionResult<{ upvotes: number; downvotes: number; userVote: 'up' | 'down' | null }>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post(`/posts/${postId}/vote`, { type });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
