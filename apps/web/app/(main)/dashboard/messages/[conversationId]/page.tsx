import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { getUser } from '../../../../../lib/getUser';
import { getMessages, getConversations } from '../../../../../lib/messaging';
import ChatWindow from './ChatWindow';
import type { MessageParticipant } from '../../../../../types/messaging';

type Props = { params: Promise<{ conversationId: string }> };

export default async function ConversationPage({ params }: Props) {
  const { conversationId } = await params;
  const user = await getUser();
  if (!user) redirect('/login');

  const [initialMessages, conversations] = await Promise.all([
    getMessages(conversationId),
    getConversations(),
  ]);

  const conv = conversations.find((c) => c._id === conversationId);
  const otherUser: MessageParticipant = conv?.participants.find((p) => p._id !== user.id)
    ?? { _id: '', firstName: 'Utilisateur', lastName: '', profilePicture: null, role: '' };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '24px' }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <Link href="/dashboard/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#1a73e8', textDecoration: 'none', marginBottom: 16 }}>
          <ChevronLeft size={15} />
          Retour aux messages
        </Link>

        <ChatWindow
          conversationId={conversationId}
          initialMessages={initialMessages}
          currentUserId={user.id}
          otherUser={otherUser}
        />
      </div>
    </div>
  );
}
