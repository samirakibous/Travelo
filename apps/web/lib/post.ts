'use server';

import {
  apiCreatePost,
  apiUpdatePost,
  apiDeletePost,
  apiVotePost,
} from '../services/post.server.service';
import { parseApiError } from '../services/api';
import type { Post } from '../types/post';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(formData: FormData): Promise<ActionResult<Post>> {
  try {
    const data = await apiCreatePost(formData);
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
    const data = await apiUpdatePost(postId, formData);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function deletePost(postId: string): Promise<ActionResult> {
  try {
    await apiDeletePost(postId);
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
    const data = await apiVotePost(postId, type);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

