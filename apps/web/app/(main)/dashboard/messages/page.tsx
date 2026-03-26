import { redirect } from 'next/navigation';
import Link from 'next/link';
import { MessageCircle, ChevronRight } from 'lucide-react';
import { getUser } from '../../../../lib/getUser';
import { getConversations } from '../../../../lib/messaging';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

export default async function MessagesPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const conversations = await getConversations();

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '32px 24px' }}>
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <MessageCircle size={22} color="#1a73e8" />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>Messages</h1>
        </div>

        {conversations.length === 0 ? (
          <div style={{
            background: '#fff', borderRadius: 16, border: '1px solid #e8eaed',
            padding: '48px 24px', textAlign: 'center',
          }}>
            <MessageCircle size={40} color="#d1d5db" style={{ marginBottom: 16 }} />
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#6b7280' }}>
              Aucune conversation
            </p>
            <p style={{ margin: '8px 0 0', fontSize: 13, color: '#9ca3af' }}>
              Contactez un guide depuis sa page de profil pour démarrer une conversation.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {conversations.map((conv) => {
              const other = conv.participants.find((p) => p._id !== user.id) ?? conv.participants[0];
              const avatarSrc = other?.profilePicture ? `${API_URL}${other.profilePicture}` : null;
              const initials = other ? `${other.firstName[0]}${other.lastName[0]}`.toUpperCase() : '?';
              const lastMsg = conv.lastMessage;

              return (
                <Link
                  key={conv._id}
                  href={`/dashboard/messages/${conv._id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    background: '#fff', borderRadius: 14, border: '1px solid #e8eaed',
                    padding: '14px 16px', cursor: 'pointer',
                    transition: 'box-shadow 0.15s',
                  }}>
                    {/* Avatar */}
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                      background: '#e8f0fe', overflow: 'hidden',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ fontSize: 15, fontWeight: 700, color: '#1a73e8' }}>{initials}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>
                        {other ? `${other.firstName} ${other.lastName}` : 'Utilisateur'}
                      </p>
                      {lastMsg && (
                        <p style={{
                          margin: '2px 0 0', fontSize: 12, color: '#9ca3af',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {lastMsg.sender.firstName}: {lastMsg.content}
                        </p>
                      )}
                    </div>

                    <ChevronRight size={16} color="#9ca3af" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
