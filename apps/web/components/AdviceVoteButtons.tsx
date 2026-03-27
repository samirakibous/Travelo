'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { voteAdvice } from '../lib/advice';
import { useAuth } from '../contexts/AuthContext';

type Props = {
  adviceId: string;
  initialUseful: number;
  initialNotUseful: number;
  initialUserVote: 'useful' | 'not_useful' | null;
};

export default function AdviceVoteButtons({
  adviceId,
  initialUseful,
  initialNotUseful,
  initialUserVote,
}: Props) {
  const { user } = useAuth();
  const [useful, setUseful] = useState(initialUseful);
  const [notUseful, setNotUseful] = useState(initialNotUseful);
  const [userVote, setUserVote] = useState(initialUserVote);
  const [loading, setLoading] = useState(false);

  const handle = async (type: 'useful' | 'not_useful') => {
    if (!user || loading) return;
    setLoading(true);
    const result = await voteAdvice(adviceId, type);
    if (result.success) {
      setUseful(result.data.usefulVotes);
      setNotUseful(result.data.notUsefulVotes);
      setUserVote(result.data.userVote);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
      <button
        onClick={() => handle('useful')}
        disabled={!user || loading}
        title={!user ? 'Connectez-vous pour voter' : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 8, border: 'none',
          cursor: !user || loading ? 'default' : 'pointer',
          fontSize: 12, fontWeight: 500,
          background: userVote === 'useful' ? '#dcfce7' : '#f3f4f6',
          color: userVote === 'useful' ? '#16a34a' : '#6b7280',
          transition: 'background 0.15s',
        }}
      >
        <ThumbsUp size={12} />
        {useful} Utile
      </button>
      <button
        onClick={() => handle('not_useful')}
        disabled={!user || loading}
        title={!user ? 'Connectez-vous pour voter' : undefined}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 10px', borderRadius: 8, border: 'none',
          cursor: !user || loading ? 'default' : 'pointer',
          fontSize: 12, fontWeight: 500,
          background: userVote === 'not_useful' ? '#fee2e2' : '#f3f4f6',
          color: userVote === 'not_useful' ? '#dc2626' : '#6b7280',
          transition: 'background 0.15s',
        }}
      >
        <ThumbsDown size={12} />
        {notUseful} Pas utile
      </button>
    </div>
  );
}
