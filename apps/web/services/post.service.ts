import { api } from './api';
import type { PostsResponse } from '../types/post';

// Appels publics uniquement — safe pour les Client Components
export async function apiGetPosts(params?: {
  category?: string;
  page?: number;
  limit?: number;
}): Promise<PostsResponse> {
  const { data } = await api.get<PostsResponse>('/posts', { params });
  return data;
}
