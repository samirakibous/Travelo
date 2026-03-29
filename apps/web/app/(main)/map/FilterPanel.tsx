'use client';

import type { AdviceType } from '../../../types/advice';

const ADVICE_TYPE_OPTIONS: { value: AdviceType; label: string; color: string; bg: string }[] = [
  { value: 'danger',         label: 'Danger',         color: '#dc2626', bg: '#fee2e2' },
  { value: 'prudence',       label: 'Prudence',       color: '#d97706', bg: '#fef3c7' },
  { value: 'recommandation', label: 'Recommandation', color: '#16a34a', bg: '#dcfce7' },
];

type Props = {
  adviceTypeFilter: string[];
  onAdviceTypeChange: (types: AdviceType[]) => void;
};

export default function FilterPanel({ adviceTypeFilter, onAdviceTypeChange }: Props) {
  const toggleAdviceType = (value: AdviceType) => {
    const next = adviceTypeFilter.includes(value)
      ? adviceTypeFilter.filter((t) => t !== value)
      : [...adviceTypeFilter, value];
    onAdviceTypeChange(next as AdviceType[]);
  };

  return (
    <div className="w-64 shrink-0 flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Type de conseil</p>
        <div className="flex flex-col gap-2">
          {ADVICE_TYPE_OPTIONS.map((opt) => {
            const active = adviceTypeFilter.length === 0 || adviceTypeFilter.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => toggleAdviceType(opt.value)}
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

      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Légende</p>
        <div className="flex flex-col gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#dc2626] bg-[#dc2626]/20 shrink-0" />
            Danger
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#d97706] bg-[#d97706]/20 shrink-0" />
            Prudence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full border-2 border-[#16a34a] bg-[#16a34a]/20 shrink-0" />
            Recommandation
          </div>
        </div>
      </div>
    </div>
  );
}
