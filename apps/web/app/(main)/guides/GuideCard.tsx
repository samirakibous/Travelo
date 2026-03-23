'use client';

import { MapPin, Star, Mail, BadgeCheck } from 'lucide-react';
import type { GuideProfile } from '../../../types/guide';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

const EXPERTISE_LABELS: Record<string, string> = {
  elite: 'Elite Guide',
  professional: 'Professionnel',
  local: 'Local',
};

type Props = {
  guide: GuideProfile;
};

export default function GuideCard({ guide }: Props) {
  const { userId, bio, location, hourlyRate, specialties, rating, reviewCount, isCertified } = guide;
  const fullName = `${userId.firstName} ${userId.lastName}`;
  const avatarSrc = userId.profilePicture ? `${API_URL}${userId.profilePicture}` : null;
  const initials = `${userId.firstName[0]}${userId.lastName[0]}`.toUpperCase();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      {/* Photo */}
      <div className="relative h-48 bg-[#e8f0fe]">
        {avatarSrc ? (
          <img src={avatarSrc} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#1a73e8]">
            {initials}
          </div>
        )}

        {isCertified && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#1a73e8] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            <BadgeCheck size={12} />
            CERTIFIÉ
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          <MapPin size={10} />
          {location}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-[#1a1a2e] text-base">{fullName}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star size={13} fill="#f59e0b" color="#f59e0b" />
            <span className="text-sm font-semibold text-[#1a1a2e]">
              {rating > 0 ? rating.toFixed(1) : '—'}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 flex-1">{bio}</p>

        {specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {specialties.slice(0, 3).map((s) => (
              <span
                key={s._id}
                className="text-xs font-medium px-2.5 py-1 rounded-full border border-[#1a73e8] text-[#1a73e8] uppercase tracking-wide"
              >
                {s.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wide">Tarif horaire</p>
            <p className="font-bold text-[#1a1a2e]">
              ${hourlyRate}<span className="text-xs font-normal text-gray-400">/hr</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
              <Mail size={15} />
            </button>
            <button className="px-4 py-2 bg-[#1a73e8] text-white text-sm font-semibold rounded-xl hover:bg-blue-600 transition-colors">
              Réserver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
