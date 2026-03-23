'use client';

import { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { createPost, updatePost } from '../../../lib/post';
import type { Post } from '../../../types/post';
import type { Category } from '../../../types/category';

type Props = {
  onClose: () => void;
  onCreated: (post: Post) => void;
  editPost?: Post;
  categories: Category[];
};

export default function CreatePostModal({ onClose, onCreated, editPost, categories }: Props) {
  const isEditing = !!editPost;
  const defaultCategory = editPost?.category ?? categories[0]?.slug ?? '';
  const [form, setForm] = useState({
    title: editPost?.title ?? '',
    description: editPost?.description ?? '',
    destination: editPost?.destination ?? '',
    category: defaultCategory,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.destination.trim()) {
      setError('Tous les champs sont requis');
      return;
    }
    setLoading(true);
    setError('');

    const result = isEditing
      ? await updatePost(editPost._id, form)
      : await createPost(form);

    setLoading(false);
    if (result.success) {
      onCreated(result.data);
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-[#1a1a2e]">
            {isEditing ? 'Modifier le post' : 'Nouveau post'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1a1a2e]">Titre</label>
            <input
              type="text"
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Ex: Attention aux pickpockets à la médina"
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1a1a2e]">Description</label>
            <textarea
              rows={4}
              maxLength={1000}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Décrivez votre expérience ou conseil..."
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors resize-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-sm font-medium text-[#1a1a2e]">Destination</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Paris, Marrakech..."
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[#1a1a2e]">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors bg-white capitalize"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-[#1a73e8] text-white text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
            >
              {loading ? (isEditing ? 'Enregistrement...' : 'Publication...') : (isEditing ? 'Enregistrer' : 'Publier')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
