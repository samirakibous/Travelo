'use client';

import dynamic from 'next/dynamic';
import { useState, useTransition, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { apiGetSafetyZones } from '../../../services/safety-zone.service';
import FilterPanel from './FilterPanel';
import type { SafeZone, SafeZoneQuery } from '../../../types/safety-zone';

// SSR must be disabled — Leaflet requires window
const SafetyMap = dynamic(() => import('./SafetyMap'), { ssr: false });

export default function MapPage() {
  const [zones, setZones] = useState<SafeZone[]>([]);
  const [filters, setFilters] = useState<SafeZoneQuery>({});
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await apiGetSafetyZones({});
      setZones(data);
    });
  }, []);

  const handleFilterChange = (newFilters: SafeZoneQuery) => {
    setFilters(newFilters);
    startTransition(async () => {
      const data = await apiGetSafetyZones(newFilters);
      setZones(data);
    });
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Shield size={18} color="#1a73e8" />
          <h1 className="font-bold text-[#1a1a2e]">Carte de sécurité</h1>
          <span className="text-sm text-gray-400 ml-1">
            {zones.length} zone{zones.length !== 1 ? 's' : ''} affichée{zones.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* Filter sidebar */}
        <div className="w-72 shrink-0 overflow-y-auto p-4 bg-[#f8f9ff] border-r border-gray-100">
          <FilterPanel filters={filters} onChange={handleFilterChange} />
        </div>

        {/* Map */}
        <div className="flex-1 p-4 bg-[#f0f4f8]">
          <SafetyMap zones={zones} loading={isPending} />
        </div>
      </div>
    </div>
  );
}
