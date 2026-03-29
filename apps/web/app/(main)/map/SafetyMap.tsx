'use client';

import { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { Advice } from '../../../types/advice';
import AdviceVoteButtons from '../../../components/AdviceVoteButtons';

// ── Advice type colors & icons ────────────────────────────────
const ADVICE_TYPE_COLORS: Record<string, string> = {
  danger:         '#dc2626',
  prudence:       '#d97706',
  recommandation: '#16a34a',
};

const ADVICE_TYPE_LABELS: Record<string, string> = {
  danger:         'Danger',
  prudence:       'Prudence',
  recommandation: 'Recommandation',
};

// SVG path data for each type icon
const ADVICE_TYPE_SVG: Record<string, string> = {
  danger:         '<path d="M12 2L2 20h20L12 2zm0 3.5L19.5 19h-15L12 5.5zm-1 5v5h2v-5h-2zm0 7v2h2v-2h-2z"/>',
  prudence:       '<path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm1 14h-2v-2h2v2zm0-4h-2V6h2v6z"/>',
  recommandation: '<path d="M9 12l2 2 4-4M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z"/>',
};


function createAdviceIcon(advice: Advice): L.DivIcon {
  const color = ADVICE_TYPE_COLORS[advice.adviceType] ?? '#6b7280';
  const svgPath = ADVICE_TYPE_SVG[advice.adviceType] ?? ADVICE_TYPE_SVG.prudence;
  const badge = advice.isCertifiedGuide
    ? `<span style="position:absolute;top:-4px;right:-4px;width:10px;height:10px;background:#1a73e8;border-radius:50%;border:1.5px solid white;"></span>`
    : '';
  return L.divIcon({
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `
      <div style="position:relative;width:28px;height:28px;">
        <div style="width:28px;height:28px;border-radius:50%;background:${color};border:2.5px solid white;box-shadow:0 2px 6px rgba(0,0,0,.25);display:flex;align-items:center;justify-content:center;">
          <svg width="14" height="14" fill="white" viewBox="0 0 24 24">${svgPath}</svg>
        </div>
        ${badge}
      </div>`,
  });
}

// ── Internal components ───────────────────────────────────────
function MapResizer() {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);
  return null;
}

function GeolocationController() {
  const map = useMap();
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        map.whenReady(() => {
          map.setView([coords.latitude, coords.longitude], 13);
        });
      },
      () => {},
    );
  }, [map]);
  return null;
}

function LocateButton() {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: 80 }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={() => map.locate({ setView: true, maxZoom: 15 })}
          title="Ma position"
          style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', border: 'none', cursor: 'pointer' }}
        >
          <Locate size={16} color="#555" />
        </button>
      </div>
    </div>
  );
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')) ?? 'http://localhost:3000';

function AdvicePopup({ advice }: { advice: Advice }) {
  const typeColor = ADVICE_TYPE_COLORS[advice.adviceType] ?? '#6b7280';
  return (
    <Popup>
      <div style={{ minWidth: 200, maxWidth: 280 }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{
            fontSize: 11, fontWeight: 600, color: typeColor,
            background: typeColor + '18', padding: '2px 8px', borderRadius: 99,
          }}>
            {ADVICE_TYPE_LABELS[advice.adviceType] ?? advice.adviceType}
          </span>
          {advice.isCertifiedGuide && (
            <span style={{ fontSize: 11, color: '#1a73e8', fontWeight: 600 }}>✓ Certifié</span>
          )}
        </div>
        <p style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e', marginBottom: 4 }}>{advice.title}</p>
        <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 8, lineHeight: 1.5 }}>{advice.content}</p>

        {advice.mediaUrls.length > 0 && (
          <img
            src={`${API_URL}${advice.mediaUrls[0]}`}
            alt=""
            style={{ width: '100%', borderRadius: 8, objectFit: 'cover', maxHeight: 120, marginBottom: 8 }}
          />
        )}

        <div style={{ fontSize: 11, color: '#9ca3af' }}>
          Par {advice.author.firstName} {advice.author.lastName}
          {advice.address && <> · {advice.address}</>}
        </div>

        <AdviceVoteButtons
          adviceId={advice._id}
          initialUseful={(advice.usefulVotes ?? []).length}
          initialNotUseful={(advice.notUsefulVotes ?? []).length}
          initialUserVote={null}
        />
      </div>
    </Popup>
  );
}

// ── Main component ────────────────────────────────────────────
type Props = {
  advices: Advice[];
  loading?: boolean;
};

export default function SafetyMap({ advices, loading }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div style={{ position: 'absolute', inset: 16, borderRadius: 16, overflow: 'hidden' }}>
      {loading && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.6)', backdropFilter: 'blur(4px)' }}>
          <span style={{ fontSize: 13, color: '#6b7280' }}>Chargement...</span>
        </div>
      )}
      <MapContainer center={[20, 0]} zoom={3} style={{ width: '100%', height: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapResizer />
        <GeolocationController />
        <LocateButton />

        {/* Advice markers */}
        {advices.map((advice) => (
          <Marker
            key={advice._id}
            position={[advice.lat, advice.lng]}
            icon={createAdviceIcon(advice)}
          >
            <AdvicePopup advice={advice} />
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
