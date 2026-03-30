'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { AdminStats, AdminUser, AdminPost, AdminAdvice, AdminReview, AdminPagedResponse } from '../types/admin';

export async function adminGetStats(): Promise<AdminStats | null> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<AdminStats>('/admin/stats');
    return data;
  } catch {
    return null;
  }
}

export async function adminGetUsers(
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<AdminPagedResponse<AdminUser>> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<AdminPagedResponse<AdminUser>>('/admin/users', { params });
  return data;
}

export async function adminUpdateRole(
  userId: string,
  role: string,
): Promise<{ success: true; data: AdminUser } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch<AdminUser>(`/admin/users/${userId}/role`, { role });
    return { success: true, data };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminDeleteUser(
  userId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/admin/users/${userId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminToggleActive(
  userId: string,
): Promise<{ success: true; isActive: boolean } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.patch<{ id: string; isActive: boolean }>(`/admin/users/${userId}/toggle-active`, {});
    return { success: true, isActive: data.isActive };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminGetPosts(
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminPost>> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<AdminPagedResponse<AdminPost>>('/admin/posts', { params });
  return data;
}

export async function adminDeletePost(
  postId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/admin/posts/${postId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminGetAdvices(
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminAdvice>> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<AdminPagedResponse<AdminAdvice>>('/admin/advices', { params });
  return data;
}

export async function adminDeleteAdvice(
  adviceId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/admin/advices/${adviceId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}

export async function adminGetReviews(
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminReview>> {
  const authApi = await getAuthApi();
  const { data } = await authApi.get<AdminPagedResponse<AdminReview>>('/admin/reviews', { params });
  return data;
}

export async function adminDeleteReview(
  reviewId: string,
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const authApi = await getAuthApi();
    await authApi.delete(`/admin/reviews/${reviewId}`);
    return { success: true };
  } catch (e) {
    return { success: false, error: parseApiError(e) };
  }
}
