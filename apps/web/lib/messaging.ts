'use server';

import { getAuthApi } from '../services/api.server';
import { parseApiError } from '../services/api';
import type { Conversation, ChatMessage } from '../types/messaging';

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function findOrCreateConversation(
  participantId: string,
): Promise<ActionResult<Conversation>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<Conversation>('/messaging/conversations', { participantId });
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<Conversation[]>('/messaging/conversations');
    return data;
  } catch {
    return [];
  }
}

export async function getMessages(conversationId: string): Promise<ChatMessage[]> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<ChatMessage[]>(
      `/messaging/conversations/${conversationId}/messages`,
    );
    return data;
  } catch {
    return [];
  }
}

export async function sendChatMessage(
  conversationId: string,
  content: string,
): Promise<ActionResult<ChatMessage>> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.post<ChatMessage>(
      `/messaging/conversations/${conversationId}/messages`,
      { content },
    );
    return { success: true, data };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}

export async function getUnreadCount(): Promise<number> {
  try {
    const authApi = await getAuthApi();
    const { data } = await authApi.get<{ count: number }>('/messaging/unread-count');
    return data.count;
  } catch {
    return 0;
  }
}

export async function markAsRead(conversationId: string): Promise<ActionResult> {
  try {
    const authApi = await getAuthApi();
    await authApi.patch(`/messaging/conversations/${conversationId}/read`);
    return { success: true, data: undefined };
  } catch (error) {
    return { success: false, error: parseApiError(error) };
  }
}
