'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { Send } from 'lucide-react';
import { sendChatMessage, getMessages } from '../../../../../lib/messaging';
import type { ChatMessage, MessageParticipant } from '../../../../../types/messaging';

type Props = {
  conversationId: string;
  initialMessages: ChatMessage[];
  currentUserId: string;
  otherUser: MessageParticipant;
};

export default function ChatWindow({ conversationId, initialMessages, currentUserId, otherUser }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const [, startTransition] = useTransition();

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for new messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      startTransition(async () => {
        const updated = await getMessages(conversationId);
        setMessages(updated);
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setError('');
    setInput('');

    const result = await sendChatMessage(conversationId, content);
    setSending(false);

    if (result.success) {
      setMessages((prev) => {
        if (prev.some((m) => m._id === result.data._id)) return prev;
        return [...prev, result.data];
      });
    } else {
      setError(result.error);
      setInput(content); // restore input on error
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 160px)', background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid #f1f3f4', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
          {otherUser.firstName} {otherUser.lastName}
        </span>
        <span style={{ fontSize: 11, color: '#9ca3af', background: '#f3f4f6', padding: '2px 8px', borderRadius: 99 }}>
          {otherUser.role === 'guide' ? 'Guide' : 'Touriste'}
        </span>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {messages.length === 0 && (
          <p style={{ textAlign: 'center', fontSize: 13, color: '#9ca3af', marginTop: 32 }}>
            Démarrez la conversation avec {otherUser.firstName}
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender._id === currentUserId;
          return (
            <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '72%', padding: '9px 14px', borderRadius: 14, fontSize: 13, lineHeight: 1.5,
                background: isMe ? '#1a73e8' : '#f1f3f4',
                color: isMe ? '#fff' : '#1a1a2e',
                borderBottomRightRadius: isMe ? 2 : 14,
                borderBottomLeftRadius: isMe ? 14 : 2,
              }}>
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '6px 16px', background: '#fee2e2', fontSize: 12, color: '#dc2626' }}>
          {error}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f3f4', display: 'flex', gap: 10, alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Écrire un message..."
          disabled={sending}
          style={{
            flex: 1, border: '1px solid #e5e7eb', borderRadius: 10,
            padding: '9px 14px', fontSize: 13, outline: 'none',
            fontFamily: 'inherit', color: '#1a1a2e',
            background: sending ? '#f9fafb' : '#fff',
          }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          style={{
            width: 38, height: 38, borderRadius: '50%', border: 'none',
            background: input.trim() && !sending ? '#1a73e8' : '#e5e7eb',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: input.trim() && !sending ? 'pointer' : 'default', flexShrink: 0,
          }}
        >
          <Send size={15} color={input.trim() && !sending ? '#fff' : '#9ca3af'} />
        </button>
      </div>
    </div>
  );
}
