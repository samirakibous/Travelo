import { api } from './api';
import type { PostsResponse } from '../types/post';

export async function apiGetPosts(): Promise<PostsResponse> {
  const { data } = await api.get<PostsResponse>('/posts');
  return data;
}
