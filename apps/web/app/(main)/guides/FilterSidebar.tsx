'use client';

import { SlidersHorizontal } from 'lucide-react';
import type { GuideQuery, ExpertiseLevel } from '../../../types/guide';

const EXPERTISE_OPTIONS = [
  { value: 'elite', label: 'Elite Guide (5+ ans)' },
  { value: 'professional', label: 'Professionnel (2-5 ans)' },
  { value: 'local', label: 'Local Enthusiast' },
];

const SPECIALTIES = ['Histoire', 'Culinaire', 'Sécurité nocturne', 'Randonnée', 'Photographie', 'Architecture', 'Art', 'Culture'];
const LANGUAGES = ['Français', 'Anglais', 'Espagnol', 'Arabe', 'Allemand'];

type Props = {
  filters: GuideQuery;
  onChange: (filters: GuideQuery) => void;
};

export default function FilterSidebar({ filters, onChange }: Props) {
  const toggle = <T extends string>(arr: T[] | undefined, value: T): T[] => {
    const current = arr ?? [];
    return current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  };

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={16} color="#1a73e8" />
        <h2 className="font-bold text-[#1a1a2e]">Filtres</h2>
      </div>

      {/* Destination */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#1a1a2e]">Destination</p>
        <input
          type="text"
          value={filters.location ?? ''}
          onChange={(e) => onChange({ ...filters, location: e.target.value || undefined, page: 1 })}
          placeholder="Toutes les destinations"
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
        />
      </div>

      {/* Expertise */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#1a1a2e]">Niveau d&apos;expertise</p>
        {EXPERTISE_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.expertiseLevel === opt.value}
              onChange={() =>
                onChange({
                  ...filters,
                  expertiseLevel: filters.expertiseLevel === opt.value ? undefined : opt.value as ExpertiseLevel,
                  page: 1,
                })
              }
              className="w-4 h-4 accent-[#1a73e8]"
            />
            <span className="text-sm text-gray-600">{opt.label}</span>
          </label>
        ))}
      </div>

      {/* Specialties */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#1a1a2e]">Spécialités</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => {
            const active = filters.specialty === s;
            return (
              <button
                key={s}
                onClick={() => onChange({ ...filters, specialty: active ? undefined : s, page: 1 })}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#1a73e8] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hourly Rate */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-[#1a1a2e]">Tarif horaire</p>
          <span className="text-sm font-medium text-[#1a73e8]">
            ${filters.minRate ?? 0} – ${filters.maxRate ?? 200}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={200}
          step={5}
          value={filters.maxRate ?? 200}
          onChange={(e) => onChange({ ...filters, maxRate: Number(e.target.value), page: 1 })}
          className="w-full accent-[#1a73e8]"
        />
      </div>

      {/* Languages */}
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-[#1a1a2e]">Langues</p>
        {LANGUAGES.map((lang) => (
          <label key={lang} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.language === lang}
              onChange={() =>
                onChange({
                  ...filters,
                  language: filters.language === lang ? undefined : lang,
                  page: 1,
                })
              }
              className="w-4 h-4 accent-[#1a73e8]"
            />
            <span className="text-sm text-gray-600">{lang}</span>
          </label>
        ))}
      </div>

      {/* Reset */}
      <button
        onClick={() => onChange({ page: 1, limit: 12 })}
        className="py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
      >
        Réinitialiser les filtres
      </button>
    </aside>
  );
}
