'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import Cookies from 'js-cookie';
import type { ChatMessage } from '../types/messaging';

const WS_URL =
  (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')) ?? 'http://localhost:3000';

export function useMessaging(conversationId: string, initialMessages: ChatMessage[] = []) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = Cookies.get('access_token');
    const socket = io(`${WS_URL}/messaging`, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => setConnected(true));
    socket.on('disconnect', () => setConnected(false));

    socket.on('new_message', (msg: ChatMessage) => {
      if (msg.conversation === conversationId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      }
    });

    socketRef.current = socket;
    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  const sendMessage = useCallback(
    (content: string) => {
      socketRef.current?.emit('send_message', { conversationId, content });
    },
    [conversationId],
  );

  return { messages, sendMessage, connected };
}
