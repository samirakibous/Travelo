import { getAuthApi } from './api.server';
import type { Post } from '../types/post';

// Appels authentifiés — Server Components et Server Actions uniquement

export async function apiUpdatePost(
  postId: string,
  formData: FormData,
): Promise<Post> {
  const authApi = await getAuthApi();
  const { data } = await authApi.patch<Post>(`/posts/${postId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function apiCreatePost(formData: FormData): Promise<Post> {
  const authApi = await getAuthApi();
  const { data } = await authApi.post<Post>('/posts', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function apiDeletePost(postId: string): Promise<void> {
  const authApi = await getAuthApi();
  await authApi.delete(`/posts/${postId}`);
}

export async function apiVotePost(
  postId: string,
  type: 'up' | 'down',
): Promise<{ upvotes: number; downvotes: number; userVote: 'up' | 'down' | null }> {
  const authApi = await getAuthApi();
  const { data } = await authApi.post(`/posts/${postId}/vote`, { type });
  return data;
}

