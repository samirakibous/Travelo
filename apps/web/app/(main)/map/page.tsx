'use client';

import dynamic from 'next/dynamic';
import { useState, useTransition, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { getAdvices } from '../../../lib/advice';
import FilterPanel from './FilterPanel';
import type { Advice, AdviceType } from '../../../types/advice';

const SafetyMap = dynamic(() => import('./SafetyMap'), { ssr: false });

const HEADER_H = 64;
const SUBHEADER_H = 49;
const SIDEBAR_W = 288;

export default function MapPage() {
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [adviceTypeFilter, setAdviceTypeFilter] = useState<AdviceType[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getAdvices({});
      setAdvices(data);
    });
  }, []);

  const handleAdviceTypeChange = (types: AdviceType[]) => {
    setAdviceTypeFilter(types);
    startTransition(async () => {
      const data = await getAdvices(
        types.length > 0 ? { adviceType: types.join(',') } : {},
      );
      setAdvices(data);
    });
  };

  return (
    <>
      {/* Sub-header */}
      <div style={{ position: 'fixed', top: HEADER_H, left: 0, right: 0, height: SUBHEADER_H, zIndex: 60, display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px', background: 'white', borderBottom: '1px solid #f1f5f9' }}>
        <Shield size={18} color="#1a73e8" />
        <span style={{ fontWeight: 700, color: '#1a1a2e', fontSize: 15 }}>Carte de sécurité</span>
        <span style={{ fontSize: 13, color: '#9ca3af' }}>
          {advices.length} conseil{advices.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Sidebar */}
      <div style={{ position: 'fixed', top: HEADER_H + SUBHEADER_H, left: 0, width: SIDEBAR_W, bottom: 0, zIndex: 50, overflowY: 'auto', padding: 16, background: '#f8f9ff', borderRight: '1px solid #f1f5f9' }}>
        <FilterPanel
          adviceTypeFilter={adviceTypeFilter}
          onAdviceTypeChange={handleAdviceTypeChange}
        />
      </div>

      {/* Map */}
      <div style={{ position: 'fixed', top: HEADER_H + SUBHEADER_H, left: SIDEBAR_W, right: 0, bottom: 0, zIndex: 40, padding: 16, background: '#f0f4f8' }}>
        <SafetyMap advices={advices} loading={isPending} />
      </div>
    </>
  );
}
