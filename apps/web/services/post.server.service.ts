import { getAuthApi } from './api.server';
import type { Post, PostCategory } from '../types/post';

// Appels authentifiés — Server Components et Server Actions uniquement

export type CreatePostPayload = {
  title: string;
  description: string;
  destination: string;
  category: PostCategory;
};

export async function apiUpdatePost(
  postId: string,
  payload: Partial<CreatePostPayload>,
): Promise<Post> {
  const authApi = await getAuthApi();
  const { data } = await authApi.patch<Post>(`/posts/${postId}`, payload);
  return data;
}

export async function apiCreatePost(payload: CreatePostPayload): Promise<Post> {
  const authApi = await getAuthApi();
  const { data } = await authApi.post<Post>('/posts', payload);
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

export async function apiReportPost(postId: string, reason: string): Promise<void> {
  const authApi = await getAuthApi();
  await authApi.post(`/posts/${postId}/report`, { reason });
}
