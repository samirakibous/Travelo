'use client';

import { useState, useTransition } from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { getGuides } from '../../../lib/guide';
import FilterSidebar from './FilterSidebar';
import GuideCard from './GuideCard';
import type { GuideProfile, GuideQuery } from '../../../types/guide';
import type { Specialty } from '../../../types/specialty';

type Props = {
  initialGuides: GuideProfile[];
  initialTotal: number;
  specialties: Specialty[];
};

export default function GuidesClient({ initialGuides, initialTotal, specialties }: Props) {
  const [guides, setGuides] = useState(initialGuides);
  const [total, setTotal] = useState(initialTotal);
  const [filters, setFilters] = useState<GuideQuery>({ page: 1, limit: 12 });
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isPending, startTransition] = useTransition();

  const applyFilters = (newFilters: GuideQuery) => {
    setFilters(newFilters);
    startTransition(async () => {
      const result = await getGuides(newFilters);
      setGuides(result.data);
      setTotal(result.total);
    });
  };

  const handleLoadMore = () => {
    const nextPage = (filters.page ?? 1) + 1;
    const newFilters = { ...filters, page: nextPage };
    setFilters(newFilters);
    startTransition(async () => {
      const result = await getGuides(newFilters);
      setGuides((prev) => [...prev, ...result.data]);
      setTotal(result.total);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
      <FilterSidebar filters={filters} onChange={applyFilters} specialties={specialties} />

      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#1a1a2e]">Guides touristiques certifiés</h1>
            <p className="text-sm text-gray-500 mt-1">
              {total} professionnel{total !== 1 ? 's' : ''} vérifié{total !== 1 ? 's' : ''}
              {filters.location ? ` à ${filters.location}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-[#1a73e8] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-[#1a73e8] text-white' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Grid */}
        {isPending && guides.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-sm">Chargement...</div>
        ) : guides.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="font-medium">Aucun guide trouvé</p>
            <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
          </div>
        ) : (
          <div
            className={
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'flex flex-col gap-4'
            }
          >
            {guides.map((guide) => (
              <GuideCard key={guide._id} guide={guide} />
            ))}
          </div>
        )}

        {/* Load more */}
        {guides.length < total && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="px-8 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isPending ? 'Chargement...' : 'Voir plus de guides'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
