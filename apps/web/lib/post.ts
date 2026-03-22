'use server';

import {
  apiCreatePost,
  apiUpdatePost,
  apiDeletePost,
  apiVotePost,
  apiReportPost,
  type CreatePostPayload,
} from '../services/post.server.service';
import { parseApiError } from '../services/api';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createPost(
  payload: CreatePostPayload,
): Promise<ActionResult<Awaited<ReturnType<typeof apiCreatePost>>>> {
  try {
    const data = await apiCreatePost(payload);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function updatePost(
  postId: string,
  payload: Partial<CreatePostPayload>,
): Promise<ActionResult<Awaited<ReturnType<typeof apiCreatePost>>>> {
  try {
    const data = await apiUpdatePost(postId, payload);
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

export async function reportPost(postId: string, reason: string): Promise<ActionResult> {
  try {
    await apiReportPost(postId, reason);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
