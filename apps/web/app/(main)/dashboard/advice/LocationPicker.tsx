'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { MapPin } from 'lucide-react';

// Leaflet imports are deferred — must not run on server
const LocationPickerMap = dynamic(() => import('./LocationPickerMap'), { ssr: false });

type Coords = { lat: number; lng: number };

type Props = {
  value: Coords | null;
  onChange: (coords: Coords) => void;
};

export default function LocationPicker({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#1a1a2e]">Localisation sur la carte</label>
        {value && (
          <span className="text-xs text-gray-400 font-mono">
            {value.lat.toFixed(5)}, {value.lng.toFixed(5)}
          </span>
        )}
      </div>

      <div className="rounded-xl overflow-hidden border border-gray-200" style={{ height: 220 }}>
        {mounted ? (
          <LocationPickerMap value={value} onChange={onChange} />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-sm text-gray-400">Chargement de la carte...</span>
          </div>
        )}
      </div>

      {!value && (
        <p className="flex items-center gap-1.5 text-xs text-gray-400">
          <MapPin size={11} />
          Cliquez sur la carte pour choisir la position du conseil
        </p>
      )}
    </div>
  );
}
