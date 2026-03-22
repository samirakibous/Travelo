'use client';

import { useState, useTransition, useRef } from 'react';
import { Save, Image, X, AlertCircle, CheckCircle } from 'lucide-react';
import { createAdvice } from '../../../../lib/advice';
import LocationPicker from './LocationPicker';
import type { Advice, AdviceCategory } from '../../../../types/advice';

type Coords = { lat: number; lng: number };

const CATEGORIES: { value: AdviceCategory; label: string; color: string }[] = [
  { value: 'safety',    label: 'Sécurité',   color: '#dc2626' },
  { value: 'health',    label: 'Santé',       color: '#16a34a' },
  { value: 'transport', label: 'Transport',   color: '#2563eb' },
  { value: 'culture',   label: 'Culture',     color: '#9333ea' },
  { value: 'emergency', label: 'Urgence',     color: '#ea580c' },
];

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm ${type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

export default function CreateAdviceForm({ onCreated }: { onCreated: (advice: Advice) => void }) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'safety' as AdviceCategory,
    address: '',
  });
  const [coords, setCoords] = useState<Coords | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).slice(0, 5 - files.length);
    setFiles((prev) => [...prev, ...selected]);
    setPreviews((prev) => [...prev, ...selected.map((f) => URL.createObjectURL(f))]);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coords) {
      setStatus({ type: 'error', message: 'Cliquez sur la carte pour choisir la position' });
      return;
    }
    startTransition(async () => {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('content', form.content);
      fd.append('category', form.category);
      fd.append('lat', String(coords.lat));
      fd.append('lng', String(coords.lng));
      if (form.address) fd.append('address', form.address);
      files.forEach((f) => fd.append('media', f));

      const result = await createAdvice(fd);
      if (result.success) {
        onCreated(result.data);
        setForm({ title: '', content: '', category: 'safety', address: '' });
        setCoords(null);
        setFiles([]);
        setPreviews([]);
        setStatus({ type: 'success', message: 'Conseil publié avec succès' });
      } else {
        setStatus({ type: 'error', message: result.error });
      }
      setTimeout(() => setStatus(null), 5000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {status && <Alert type={status.type} message={status.message} />}

      {/* Titre */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Titre</label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Ex : Zone de pickpockets près du marché central"
          required
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
        />
      </div>

      {/* Catégorie */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Catégorie</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setForm({ ...form, category: cat.value })}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-colors"
              style={{
                borderColor: form.category === cat.value ? cat.color : '#e5e7eb',
                color: form.category === cat.value ? cat.color : '#6b7280',
                background: form.category === cat.value ? cat.color + '15' : 'transparent',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Contenu du conseil</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Décrivez le conseil en détail : risques, précautions à prendre, alternatives..."
          required
          rows={4}
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors resize-none"
        />
      </div>

      {/* Localisation via carte */}
      <LocationPicker value={coords} onChange={setCoords} />

      {/* Adresse */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-[#1a1a2e]">Adresse (optionnel)</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Ex : Marché central, Rabat"
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
        />
      </div>

      {/* Médias */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-[#1a1a2e]">Photos / Vidéos (max 5)</label>
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
                >
                  <X size={10} color="white" />
                </button>
              </div>
            ))}
          </div>
        )}
        {files.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3.5 py-2.5 border border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-[#1a73e8] hover:text-[#1a73e8] transition-colors"
          >
            <Image size={15} />
            Ajouter des médias
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="self-end flex items-center gap-2 px-6 py-2.5 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
      >
        <Save size={15} />
        {isPending ? 'Publication...' : 'Publier le conseil'}
      </button>
    </form>
  );
}
