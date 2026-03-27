'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';

export type AppNotification = {
  _id: string;
  type: 'new_message' | 'new_booking' | 'booking_confirmed' | 'booking_rejected' | 'booking_cancelled';
  title: string;
  body: string;
  link: string;
  isRead: boolean;
  createdAt: string;
};

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function getNotifications(): Promise<AppNotification[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<AppNotification[]>('/notifications');
    return data;
  } catch {
    return [];
  }
}

export async function getNotificationUnreadCount(): Promise<number> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<{ count: number }>('/notifications/unread-count');
    return data.count;
  } catch {
    return 0;
  }
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.patch('/notifications/read-all');
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function markNotificationRead(id: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.patch(`/notifications/${id}/read`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
