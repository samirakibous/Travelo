import { api } from './api';
import type { AdminStats, AdminUser, AdminPost, AdminAdvice, AdminReview, AdminPagedResponse } from '../types/admin';

export async function apiAdminGetStats(token: string): Promise<AdminStats> {
  const { data } = await api.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function apiAdminGetUsers(
  token: string,
  params: { page?: number; limit?: number; search?: string } = {},
): Promise<AdminPagedResponse<AdminUser>> {
  const { data } = await api.get('/admin/users', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
}

export async function apiAdminUpdateRole(
  token: string,
  userId: string,
  role: string,
): Promise<AdminUser> {
  const { data } = await api.patch(
    `/admin/users/${userId}/role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function apiAdminDeleteUser(token: string, userId: string): Promise<void> {
  await api.delete(`/admin/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function apiAdminToggleActive(
  token: string,
  userId: string,
): Promise<{ id: string; isActive: boolean }> {
  const { data } = await api.patch(
    `/admin/users/${userId}/toggle-active`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return data;
}

export async function apiAdminGetPosts(
  token: string,
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminPost>> {
  const { data } = await api.get('/admin/posts', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
}

export async function apiAdminDeletePost(token: string, postId: string): Promise<void> {
  await api.delete(`/admin/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function apiAdminGetAdvices(
  token: string,
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminAdvice>> {
  const { data } = await api.get('/admin/advices', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
}

export async function apiAdminDeleteAdvice(token: string, adviceId: string): Promise<void> {
  await api.delete(`/admin/advices/${adviceId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export async function apiAdminGetReviews(
  token: string,
  params: { page?: number; limit?: number } = {},
): Promise<AdminPagedResponse<AdminReview>> {
  const { data } = await api.get('/admin/reviews', {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
}

export async function apiAdminDeleteReview(token: string, reviewId: string): Promise<void> {
  await api.delete(`/admin/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
