'use client';

import { useState, useTransition } from 'react';
import { MessageCircle, Send, Trash2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { getComments, createComment, deleteComment } from '../../../lib/comment';
import { useAuth } from '../../../contexts/AuthContext';
import type { Comment } from '../../../types/comment';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

type Props = {
  postId: string;
  initialCount: number;
};

export default function PostComments({ postId, initialCount }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [count, setCount] = useState(initialCount);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [, startTransition] = useTransition();

  const toggle = () => {
    if (!open && !loaded) {
      startTransition(async () => {
        const data = await getComments(postId);
        setComments(data);
        setCount(data.length);
        setLoaded(true);
      });
    }
    setOpen((v) => !v);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || sending || !user) return;
    setSending(true);
    setInput('');
    const result = await createComment(postId, content);
    setSending(false);
    if (result.success) {
      setComments((prev) => [...prev, result.data]);
      setCount((c) => c + 1);
    } else {
      setInput(content);
    }
  };

  const handleDelete = async (commentId: string) => {
    const result = await deleteComment(postId, commentId);
    if (result.success) {
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setCount((c) => c - 1);
    }
  };

  return (
    <div style={{ borderTop: '1px solid #f1f3f4', paddingTop: 10 }}>
      <button
        onClick={toggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 13, color: '#6b7280', background: 'none', border: 'none',
          cursor: 'pointer', padding: '2px 0',
        }}
      >
        <MessageCircle size={14} />
        {count > 0 ? `${count} commentaire${count > 1 ? 's' : ''}` : 'Commenter'}
        {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
      </button>

      {open && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {comments.map((c) => {
            const isAuthor = user?.id === c.author._id;
            const isAdmin = user?.role === 'admin';
            return (
              <div key={c._id} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 30, height: 30, borderRadius: '50%',
                  background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User size={13} color="#1a73e8" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#1a1a2e' }}>
                      {c.author.firstName} {c.author.lastName}
                    </span>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>{timeAgo(c.createdAt)}</span>
                    {(isAuthor || isAdmin) && (
                      <button
                        onClick={() => handleDelete(c._id)}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}
                      >
                        <Trash2 size={12} color="#9ca3af" />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.4, margin: 0 }}>{c.content}</p>
                </div>
              </div>
            );
          })}

          {comments.length === 0 && loaded && (
            <p style={{ fontSize: 12, color: '#9ca3af', textAlign: 'center', padding: '8px 0' }}>
              Aucun commentaire. Soyez le premier !
            </p>
          )}

          {user && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Écrire un commentaire..."
                disabled={sending}
                style={{
                  flex: 1, border: '1px solid #e5e7eb', borderRadius: 10,
                  padding: '7px 12px', fontSize: 12, outline: 'none',
                  fontFamily: 'inherit', color: '#1a1a2e',
                  background: sending ? '#f9fafb' : '#fff',
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                style={{
                  width: 32, height: 32, borderRadius: '50%', border: 'none',
                  background: input.trim() && !sending ? '#1a73e8' : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: input.trim() && !sending ? 'pointer' : 'default', flexShrink: 0,
                }}
              >
                <Send size={13} color={input.trim() && !sending ? '#fff' : '#9ca3af'} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
