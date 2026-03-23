'use server';

import { cookies } from 'next/headers';
import {
  apiAdminGetStats,
  apiAdminGetUsers,
  apiAdminUpdateRole,
  apiAdminToggleActive,
  apiAdminDeleteUser,
  apiAdminGetPosts,
  apiAdminDeletePost,
  apiAdminGetAdvices,
  apiAdminDeleteAdvice,
} from '../services/admin.service';
import { parseApiError } from '../services/api';
import type { AdminStats, AdminUser, AdminPost, AdminAdvice, AdminPagedResponse } from '../types/admin';

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value ?? '';
}

export async function adminGetStats(): Promise<AdminStats | null> {
  try {
    return await apiAdminGetStats(await getToken());
  } catch {
    return null;
  }
}

export async function adminGetUsers(
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<AdminPagedResponse<AdminUser>> {
  return apiAdminGetUsers(await getToken(), params);
}

export async function adminUpdateRole(
  userId: string,
  role: string,
): Promise<{ success: true; data: AdminUser } | { success: false; error: string }> {
  try {
    const data = await apiAdminUpdateRole(await getToken(), userId, role);
    return { success: true, data };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminDeleteUser(
  userId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await apiAdminDeleteUser(await getToken(), userId);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminToggleActive(
  userId: string,
): Promise<{ success: true; isActive: boolean } | { success: false; error: string }> {
  try {
    const data = await apiAdminToggleActive(await getToken(), userId);
    return { success: true, isActive: data.isActive };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminGetPosts(
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminPost>> {
  return apiAdminGetPosts(await getToken(), params);
}

export async function adminDeletePost(
  postId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await apiAdminDeletePost(await getToken(), postId);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminGetAdvices(
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminAdvice>> {
  return apiAdminGetAdvices(await getToken(), params);
}

export async function adminDeleteAdvice(
  adviceId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await apiAdminDeleteAdvice(await getToken(), adviceId);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}
