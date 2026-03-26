'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Comment } from '../types/comment';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getComments(postId: string): Promise<Comment[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Comment[]>(`/posts/${postId}/comments`);
    return data;
  } catch {
    return [];
  }
}

export async function createComment(
  postId: string,
  content: string,
): Promise<ActionResult<Comment>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Comment>(`/posts/${postId}/comments`, { content });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function deleteComment(
  postId: string,
  commentId: string,
): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/posts/${postId}/comments/${commentId}`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
