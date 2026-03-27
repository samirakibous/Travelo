'use client';

import { useState } from 'react';
import { MapPin, Share2, Copy } from 'lucide-react';

export default function LocationShare() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const locate = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      ({ coords: c }) => {
        setCoords({ lat: c.latitude, lng: c.longitude });
        setLoading(false);
      },
      () => {
        setError('Localisation refusée ou indisponible');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const mapsUrl = coords
    ? `https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : '';

  const share = async () => {
    if (!coords) return;
    if (navigator.share) {
      await navigator.share({ title: 'Ma position SOS — Travelo', url: mapsUrl }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(mapsUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <MapPin size={18} color="#dc2626" />
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Partager ma position</h2>
      </div>

      {!coords ? (
        <button
          onClick={locate}
          disabled={loading}
          style={{
            width: '100%', padding: '12px 0', borderRadius: 10, border: 'none',
            background: loading ? '#e5e7eb' : '#1a73e8', color: '#fff',
            fontWeight: 600, fontSize: 14, cursor: loading ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          <MapPin size={16} />
          {loading ? 'Localisation en cours...' : 'Obtenir ma position'}
        </button>
      ) : (
        <div>
          <div style={{
            background: '#f0fdf4', borderRadius: 10, padding: '12px 14px',
            border: '1px solid #bbf7d0', marginBottom: 12,
          }}>
            <p style={{ margin: 0, fontSize: 12, color: '#16a34a', fontWeight: 600 }}>Position obtenue</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b7280' }}>
              {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10,
                background: '#e8f0fe', color: '#1a73e8',
                fontWeight: 600, fontSize: 13, textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <MapPin size={14} />
              Ouvrir Maps
            </a>
            <button
              onClick={share}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                background: copied ? '#dcfce7' : '#dc2626',
                color: copied ? '#16a34a' : '#fff',
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              {copied ? <Copy size={14} /> : <Share2 size={14} />}
              {copied ? 'Copié !' : 'Partager'}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#dc2626' }}>{error}</p>
      )}
    </div>
  );
}
