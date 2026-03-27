'use client';

import { useState, useTransition } from 'react';
import { Save, X, MapPin, DollarSign, BookOpen, Globe, Star, AlertCircle, CheckCircle, Briefcase, Award, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { createGuideProfile, updateGuideProfile } from '../../../../lib/guide';
import type { GuideProfilePayload } from '../../../../lib/guide';
import type { GuideProfile } from '../../../../types/guide';
import type { Specialty } from '../../../../types/specialty';

const EXPERTISE_OPTIONS = [
  { value: 'elite', label: 'Elite', description: 'Guide expert internationalement reconnu' },
  { value: 'professional', label: 'Professionnel', description: 'Guide certifié avec expérience avérée' },
  { value: 'local', label: 'Local', description: 'Connaissance approfondie de la région' },
] as const;

const COMMON_LANGUAGES = ['Français', 'Anglais', 'Arabe', 'Espagnol', 'Allemand', 'Italien', 'Portugais', 'Mandarin'];

const MONTH_NAMES = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAY_NAMES = ['D','L','M','Me','J','V','S'];

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm ${
        type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
      }`}
    >
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

function TagInput({
  label,
  icon,
  tags,
  onChange,
  placeholder,
  suggestions,
}: {
  label: string;
  icon: React.ReactNode;
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  suggestions?: string[];
}) {
  const [input, setInput] = useState('');

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag));

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-sm font-medium text-[#1a1a2e]">{label}</label>
      </div>
      <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 min-h-[46px]">
        {tags.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#e8f0fe] text-[#1a73e8] text-xs font-medium rounded-lg"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-800">
              <X size={11} />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') {
              e.preventDefault();
              addTag(input);
            }
          }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] text-sm outline-none bg-transparent"
        />
      </div>
      {suggestions && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {suggestions
            .filter((s) => !tags.includes(s))
            .map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addTag(s)}
                className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-500 hover:border-[#1a73e8] hover:text-[#1a73e8] transition-colors"
              >
                + {s}
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

export default function GuideProfileForm({
  existing,
  availableSpecialties,
}: {
  existing: GuideProfile | null;
  availableSpecialties: Specialty[];
}) {
  const isEdit = existing !== null;

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const [form, setForm] = useState<GuideProfilePayload>({
    bio: existing?.bio ?? '',
    location: existing?.location ?? '',
    hourlyRate: existing?.hourlyRate ?? 50,
    yearsExperience: existing?.yearsExperience ?? 0,
    tripsCompleted: existing?.tripsCompleted ?? 0,
    specialties: existing?.specialties.map((s) => s._id) ?? [],
    languages: existing?.languages ?? [],
    expertiseLevel: existing?.expertiseLevel ?? 'local',
    availableDates: existing?.availableDates ?? [],
  });

  const toggleDate = (dateStr: string) => {
    setForm((prev) => ({
      ...prev,
      availableDates: prev.availableDates.includes(dateStr)
        ? prev.availableDates.filter((d) => d !== dateStr)
        : [...prev.availableDates, dateStr],
    }));
  };

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const prevMonth = () => calMonth === 0 ? (setCalYear(y => y - 1), setCalMonth(11)) : setCalMonth(m => m - 1);
  const nextMonth = () => calMonth === 11 ? (setCalYear(y => y + 1), setCalMonth(0)) : setCalMonth(m => m + 1);

  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const result = isEdit ? await updateGuideProfile(form) : await createGuideProfile(form);
      if (result.success) {
        setStatus({ type: 'success', message: isEdit ? 'Profil mis à jour avec succès' : 'Profil guide créé avec succès' });
      } else {
        setStatus({ type: 'error', message: result.error });
      }
      setTimeout(() => setStatus(null), 5000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {status && <Alert type={status.type} message={status.message} />}

      {/* Niveau d'expertise */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Star size={16} color="#1a73e8" />
          <label className="text-sm font-medium text-[#1a1a2e]">Niveau d&apos;expertise</label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {EXPERTISE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setForm({ ...form, expertiseLevel: opt.value })}
              className={`p-3 rounded-xl border-2 text-left transition-colors ${
                form.expertiseLevel === opt.value
                  ? 'border-[#1a73e8] bg-[#e8f0fe]'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className={`text-sm font-semibold ${form.expertiseLevel === opt.value ? 'text-[#1a73e8]' : 'text-[#1a1a2e]'}`}>
                {opt.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Localisation & Tarif & Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <MapPin size={16} color="#1a73e8" />
            <label className="text-sm font-medium text-[#1a1a2e]">Localisation</label>
          </div>
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="ex: Paris, France"
            required
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <DollarSign size={16} color="#1a73e8" />
            <label className="text-sm font-medium text-[#1a1a2e]">Tarif horaire (€)</label>
          </div>
          <input
            type="number"
            min={1}
            value={form.hourlyRate}
            onChange={(e) => setForm({ ...form, hourlyRate: Number(e.target.value) })}
            required
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Award size={16} color="#1a73e8" />
            <label className="text-sm font-medium text-[#1a1a2e]">Années d&apos;expérience</label>
          </div>
          <input
            type="number"
            min={0}
            value={form.yearsExperience}
            onChange={(e) => setForm({ ...form, yearsExperience: Number(e.target.value) })}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <Briefcase size={16} color="#1a73e8" />
            <label className="text-sm font-medium text-[#1a1a2e]">Voyages complétés</label>
          </div>
          <input
            type="number"
            min={0}
            value={form.tripsCompleted}
            onChange={(e) => setForm({ ...form, tripsCompleted: Number(e.target.value) })}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
          />
        </div>
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <BookOpen size={16} color="#1a73e8" />
          <label className="text-sm font-medium text-[#1a1a2e]">Biographie</label>
        </div>
        <textarea
          value={form.bio}
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
          placeholder="Décrivez votre expérience, vos destinations favorites, ce qui vous rend unique..."
          required
          rows={4}
          className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors resize-none"
        />
        <p className="text-xs text-gray-400">{form.bio.length} caractères</p>
      </div>

      {/* Spécialités */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Star size={16} color="#1a73e8" />
          <label className="text-sm font-medium text-[#1a1a2e]">Spécialités</label>
        </div>
        <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 min-h-[46px]">
          {availableSpecialties.map((s) => {
            const selected = form.specialties.includes(s._id);
            return (
              <button
                key={s._id}
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    specialties: selected
                      ? form.specialties.filter((id) => id !== s._id)
                      : [...form.specialties, s._id],
                  })
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selected
                    ? 'bg-[#e8f0fe] text-[#1a73e8]'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Langues */}
      <TagInput
        label="Langues parlées"
        icon={<Globe size={16} color="#1a73e8" />}
        tags={form.languages}
        onChange={(languages) => setForm({ ...form, languages })}
        placeholder="Tapez une langue et appuyez sur Entrée"
        suggestions={COMMON_LANGUAGES}
      />

      {/* Disponibilités */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Calendar size={16} color="#1a73e8" />
          <label className="text-sm font-medium text-[#1a1a2e]">Dates disponibles</label>
          {form.availableDates.length > 0 && (
            <span className="text-xs text-[#1a73e8] font-medium bg-[#e8f0fe] px-2 py-0.5 rounded-full">
              {form.availableDates.length} sélectionnée{form.availableDates.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400">Cliquez sur les jours où vous êtes disponible</p>

        <div className="border border-gray-200 rounded-xl p-4">
          {/* Nav mois */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronLeft size={15} color="#666" />
            </button>
            <span className="text-sm font-semibold text-[#1a1a2e]">{MONTH_NAMES[calMonth]} {calYear}</span>
            <button type="button" onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <ChevronRight size={15} color="#666" />
            </button>
          </div>

          {/* En-têtes jours */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAY_NAMES.map((d, i) => (
              <div key={i} className="text-center text-xs font-semibold text-gray-400">{d}</div>
            ))}
          </div>

          {/* Grille jours */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
              const isSelected = form.availableDates.includes(dateStr);
              const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
              return (
                <button
                  key={day}
                  type="button"
                  disabled={isPast}
                  onClick={() => toggleDate(dateStr)}
                  className={`aspect-square rounded-lg text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-default
                    ${isSelected ? 'bg-[#1a73e8] text-white' : isToday ? 'border border-[#1a73e8] text-[#1a73e8]' : 'hover:bg-gray-100 text-gray-700'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="self-end flex items-center gap-2 px-6 py-2.5 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
      >
        <Save size={15} />
        {isPending ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer mon profil'}
      </button>
    </form>
  );
}
