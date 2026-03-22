'use client';

import { Sun, Moon, Clock } from 'lucide-react';
import type { SafeZoneQuery, RiskLevel, ZoneCategory } from '../../../types/safety-zone';

const RISK_OPTIONS: { value: RiskLevel; label: string; color: string; bg: string }[] = [
  { value: 'safe', label: 'Sûre', color: '#16a34a', bg: '#dcfce7' },
  { value: 'caution', label: 'Prudence', color: '#d97706', bg: '#fef3c7' },
  { value: 'danger', label: 'Danger', color: '#dc2626', bg: '#fee2e2' },
];

const CATEGORY_OPTIONS: { value: ZoneCategory; label: string }[] = [
  { value: 'tourist', label: 'Touristique' },
  { value: 'transport', label: 'Transport' },
  { value: 'accommodation', label: 'Hébergement' },
  { value: 'food', label: 'Restauration' },
  { value: 'general', label: 'Général' },
];

type Props = {
  filters: SafeZoneQuery;
  onChange: (filters: SafeZoneQuery) => void;
};

export default function FilterPanel({ filters, onChange }: Props) {
  const selectedRisks = filters.riskLevel ? filters.riskLevel.split(',') : ['safe', 'caution', 'danger'];
  const selectedCategories = filters.category ? filters.category.split(',') : CATEGORY_OPTIONS.map((c) => c.value);

  const toggleRisk = (value: RiskLevel) => {
    const next = selectedRisks.includes(value)
      ? selectedRisks.filter((r) => r !== value)
      : [...selectedRisks, value];
    onChange({ ...filters, riskLevel: next.length === 3 ? undefined : next.join(',') });
  };

  const toggleCategory = (value: ZoneCategory) => {
    const next = selectedCategories.includes(value)
      ? selectedCategories.filter((c) => c !== value)
      : [...selectedCategories, value];
    onChange({ ...filters, category: next.length === 5 ? undefined : next.join(',') });
  };

  return (
    <div className="w-64 shrink-0 flex flex-col gap-5">
      {/* Niveau de risque */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Niveau de risque</p>
        <div className="flex flex-col gap-2">
          {RISK_OPTIONS.map((opt) => {
            const active = selectedRisks.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleRisk(opt.value)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors text-left ${
                  active ? 'opacity-100' : 'opacity-40'
                }`}
                style={{ backgroundColor: active ? opt.bg : '#f9fafb', color: opt.color }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Catégorie */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Catégorie</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORY_OPTIONS.map((opt) => {
            const active = selectedCategories.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleCategory(opt.value)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                  active
                    ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium'
                    : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? 'bg-[#1a73e8]' : 'bg-gray-300'}`}
                />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Heure */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Période</p>
        <div className="flex flex-col gap-1.5">
          {[
            { value: 'all', label: 'Toutes', icon: <Clock size={14} /> },
            { value: 'day', label: 'Jour', icon: <Sun size={14} /> },
            { value: 'night', label: 'Nuit', icon: <Moon size={14} /> },
          ].map((opt) => {
            const active = (filters.time ?? 'all') === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => onChange({ ...filters, time: opt.value as SafeZoneQuery['time'] })}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-left transition-colors ${
                  active ? 'bg-[#e8f0fe] text-[#1a73e8] font-medium' : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {opt.icon}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Légende */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Légende</p>
        <div className="flex flex-col gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20 shrink-0" />
            Zone sûre
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#d97706] bg-[#d97706]/20 shrink-0" />
            Zone de prudence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20 shrink-0" />
            Zone dangereuse
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#16a34a] shrink-0" />
            Polygone de zone
          </div>
        </div>
      </div>
    </div>
  );
}
