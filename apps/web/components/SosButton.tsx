'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PhoneCall } from 'lucide-react';

export default function SosButton() {
  const router = useRouter();
  const [pressed, setPressed] = useState(false);

  return (
    <button
      onClick={() => router.push('/sos')}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      title="SOS — Urgences"
      style={{
        position: 'fixed',
        bottom: 28,
        right: 28,
        zIndex: 9999,
        width: 54,
        height: 54,
        borderRadius: '50%',
        background: pressed ? '#b91c1c' : '#dc2626',
        border: '3px solid white',
        boxShadow: '0 4px 20px rgba(220,38,38,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.1s, background 0.1s',
        transform: pressed ? 'scale(0.92)' : 'scale(1)',
      }}
    >
      <PhoneCall size={22} color="white" />
    </button>
  );
}
