'use client';

import { useState, useTransition, useEffect } from 'react';
import { Lightbulb, Plus, Trash2, MapPin, Shield, ChevronUp } from 'lucide-react';
import { getMyAdvices, deleteAdvice } from '../../../../lib/advice';
import CreateAdviceForm from './CreateAdviceForm';
import type { Advice } from '../../../../types/advice';

const ADVICE_TYPE_COLORS: Record<string, string> = {
  danger:         '#dc2626',
  prudence:       '#d97706',
  recommandation: '#16a34a',
};

export default function AdviceDashboardPage() {
  const [advices, setAdvices] = useState<Advice[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const data = await getMyAdvices();
      setAdvices(data);
    });
  }, []);

  const handleCreated = (advice: Advice) => {
    setAdvices((prev) => [advice, ...prev]);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteAdvice(id);
      if (result.success) {
        setAdvices((prev) => prev.filter((a) => a._id !== id));
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] flex items-center justify-center">
            <Lightbulb size={18} color="#1a73e8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1a1a2e]">Mes conseils de sécurité</h1>
            <p className="text-sm text-gray-500">{advices.length} conseil{advices.length !== 1 ? 's' : ''} publié{advices.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          {showForm ? <ChevronUp size={15} /> : <Plus size={15} />}
          {showForm ? 'Annuler' : 'Nouveau conseil'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <CreateAdviceForm onCreated={handleCreated} />
        </div>
      )}

      {/* List */}
      {isPending && advices.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
      ) : advices.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Lightbulb size={32} className="mx-auto mb-3 opacity-30" />
          <p className="font-medium">Aucun conseil publié</p>
          <p className="text-sm mt-1">Partagez vos connaissances avec les voyageurs</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {advices.map((advice) => {
            const typeColor = ADVICE_TYPE_COLORS[advice.adviceType] ?? '#6b7280';
            return (
              <div key={advice._id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4">
                {/* Color strip */}
                <div className="w-1 rounded-full shrink-0" style={{ background: typeColor }} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md" style={{ color: typeColor, background: typeColor + '15' }}>
                          {advice.adviceType}
                        </span>
                        {advice.isCertifiedGuide && (
                          <span className="flex items-center gap-1 text-xs text-[#1a73e8] font-semibold">
                            <Shield size={11} />
                            Certifié
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-[#1a1a2e] text-sm">{advice.title}</p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{advice.content}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(advice._id)}
                      disabled={isPending}
                      className="shrink-0 p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors disabled:opacity-40"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {advice.address ?? `${advice.lat.toFixed(4)}, ${advice.lng.toFixed(4)}`}
                    </span>
                    {advice.mediaUrls.length > 0 && (
                      <span>{advice.mediaUrls.length} média{advice.mediaUrls.length > 1 ? 's' : ''}</span>
                    )}
                    <span>{new Date(advice.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
