'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polygon, Popup, useMap } from 'react-leaflet';
import { Locate } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import type { SafeZone } from '../../../types/safety-zone';

const RISK_COLORS: Record<string, { color: string; fillColor: string }> = {
  safe:    { color: '#16a34a', fillColor: '#22c55e' },
  caution: { color: '#d97706', fillColor: '#f59e0b' },
  danger:  { color: '#dc2626', fillColor: '#ef4444' },
};

const CATEGORY_LABELS: Record<string, string> = {
  tourist:       'Touristique',
  transport:     'Transport',
  accommodation: 'Hébergement',
  food:          'Restauration',
  general:       'Général',
};

function LocateButton() {
  const map = useMap();

  const locate = () => {
    map.locate({ setView: true, maxZoom: 15 });
  };

  return (
    <div className="leaflet-top leaflet-right" style={{ marginTop: '80px' }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={locate}
          title="Ma position"
          style={{
            width: 34,
            height: 34,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Locate size={16} color="#555" />
        </button>
      </div>
    </div>
  );
}

function ZonePopup({ zone }: { zone: SafeZone }) {
  const { color } = RISK_COLORS[zone.riskLevel];
  const riskLabels: Record<string, string> = { safe: 'Sûre', caution: 'Prudence', danger: 'Danger' };

  return (
    <Popup>
      <div style={{ minWidth: 180 }}>
        <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, color: '#1a1a2e' }}>{zone.name}</p>
        {zone.description && (
          <p style={{ fontSize: 12, color: '#6b7280', marginBottom: 6 }}>{zone.description}</p>
        )}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color, background: color + '20', padding: '2px 8px', borderRadius: 99 }}>
            {riskLabels[zone.riskLevel]}
          </span>
          <span style={{ fontSize: 11, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 99 }}>
            {CATEGORY_LABELS[zone.category]}
          </span>
        </div>
        <div style={{ marginTop: 6, fontSize: 11, color: '#9ca3af' }}>
          {zone.activeDay && zone.activeNight ? 'Jour & Nuit' : zone.activeDay ? 'Jour uniquement' : 'Nuit uniquement'}
        </div>
      </div>
    </Popup>
  );
}

type Props = {
  zones: SafeZone[];
  loading?: boolean;
};

export default function SafetyMap({ zones, loading }: Props) {
  const defaultCenter: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden">
      {loading && (
        <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="text-sm text-gray-500">Chargement des zones...</div>
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <LocateButton />

        {zones.map((zone) => {
          const { color, fillColor } = RISK_COLORS[zone.riskLevel];

          if (zone.type === 'point' && zone.lat !== undefined && zone.lng !== undefined) {
            return (
              <CircleMarker
                key={zone._id}
                center={[zone.lat, zone.lng]}
                radius={14}
                pathOptions={{ color, fillColor, fillOpacity: 0.4, weight: 2 }}
              >
                <ZonePopup zone={zone} />
              </CircleMarker>
            );
          }

          if (zone.type === 'polygon' && zone.coordinates?.length) {
            const positions = zone.coordinates.map((c) => [c.lat, c.lng] as [number, number]);
            return (
              <Polygon
                key={zone._id}
                positions={positions}
                pathOptions={{ color, fillColor, fillOpacity: 0.25, weight: 2 }}
              >
                <ZonePopup zone={zone} />
              </Polygon>
            );
          }

          return null;
        })}
      </MapContainer>
    </div>
  );
}
