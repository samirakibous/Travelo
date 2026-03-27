'use client';

import { useState, useRef } from 'react';
import { X, MapPin, Image } from 'lucide-react';
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
  const defaultCategory = editPost?.category._id ?? categories[0]?._id ?? '';
  const [form, setForm] = useState({
    title: editPost?.title ?? '',
    description: editPost?.description ?? '',
    destination: editPost?.destination ?? '',
    category: defaultCategory,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.destination.trim()) {
      setError('Tous les champs sont requis');
      return;
    }
    setLoading(true);
    setError('');

    let result;
    if (isEditing) {
      result = await updatePost(editPost._id, form);
    } else {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('destination', form.destination);
      fd.append('category', form.category);
      files.forEach((f) => fd.append('media', f));
      result = await createPost(fd);
    }

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
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
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
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Media upload — create mode only */}
          {!isEditing && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#1a1a2e]">
                Photos / Vidéos <span className="text-gray-400 font-normal">(optionnel, max 5)</span>
              </label>
              {previews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {previews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200">
                      {files[i]?.type.startsWith('video/') ? (
                        <video src={src} className="w-full h-full object-cover" muted />
                      ) : (
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      )}
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
                  Ajouter des photos / vidéos
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
          )}

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
