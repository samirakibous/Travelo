'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Star,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Send,
  Globe,
  Shield,
  AlertTriangle,
  Heart,
  Bus,
  Landmark,
  Zap,
  Award,
  Clock,
  Users,
  MessageCircle,
  Image as ImageIcon,
} from 'lucide-react';
import type { GuideProfile } from '../../../../types/guide';
import type { Advice, AdviceCategory } from '../../../../types/advice';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

const EXPERTISE_LABELS: Record<string, string> = {
  elite: 'TOP RATED',
  professional: 'PROFESSIONNEL',
  local: 'LOCAL',
};

const EXPERTISE_COLORS: Record<string, string> = {
  elite: '#2e7d32',
  professional: '#1a73e8',
  local: '#e65100',
};

const CATEGORY_CONFIG: Record<AdviceCategory, {
  label: string;
  color: string;
  bg: string;
  border: string;
  Icon: React.ElementType;
}> = {
  safety:    { label: 'Sécurité',   color: '#c62828', bg: '#ffebee', border: '#ef9a9a', Icon: AlertTriangle },
  health:    { label: 'Santé',      color: '#2e7d32', bg: '#e8f5e9', border: '#a5d6a7', Icon: Heart },
  transport: { label: 'Transport',  color: '#1565c0', bg: '#e3f2fd', border: '#90caf9', Icon: Bus },
  culture:   { label: 'Culture',    color: '#6a1b9a', bg: '#f3e5f5', border: '#ce93d8', Icon: Landmark },
  emergency: { label: 'Urgence',    color: '#e65100', bg: '#fff3e0', border: '#ffcc80', Icon: Zap },
};

const DAYS = ['D', 'L', 'M', 'Me', 'J', 'V', 'S'];

const MONTH_NAMES = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

function buildCalendar(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return { firstDay, daysInMonth };
}

type Props = {
  guide: GuideProfile;
  advices: Advice[];
};

export default function GuideProfileClient({ guide, advices }: Props) {
  const { userId, bio, location, hourlyRate, specialties, languages, expertiseLevel, rating, reviewCount, isCertified } = guide;
  const fullName = `${userId.firstName} ${userId.lastName}`;
  const avatarSrc = userId.profilePicture ? `${API_URL}${userId.profilePicture}` : null;
  const initials = `${userId.firstName[0]}${userId.lastName[0]}`.toUpperCase();
  const badgeLabel = EXPERTISE_LABELS[expertiseLevel] ?? expertiseLevel.toUpperCase();
  const badgeColor = EXPERTISE_COLORS[expertiseLevel] ?? '#1a73e8';

  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<{ from: 'user' | 'guide'; text: string }[]>([
    { from: 'guide', text: `Bonjour ! Je suis disponible pour vous guider à ${location}. Comment puis-je vous aider ?` },
  ]);
  const [expandedAdvice, setExpandedAdvice] = useState<string | null>(null);

  const { firstDay, daysInMonth } = buildCalendar(calYear, calMonth);

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11); }
    else setCalMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0); }
    else setCalMonth(m => m + 1);
  };

  const sendMessage = () => {
    if (!chatMessage.trim()) return;
    setChatMessages(prev => [...prev, { from: 'user', text: chatMessage }]);
    setChatMessage('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'guide', text: 'Merci pour votre message ! Je vous répondrai dès que possible.' }]);
    }, 800);
  };

  const tripsCompleted = Math.max(reviewCount * 4, 12);
  const yearsExperience = Math.max(Math.floor((guide._id.charCodeAt(0) % 12) + 3), 3);

  // Map pins from real advices (only those with valid coords)
  const mapPins = advices.filter(a => a.lat && a.lng).slice(0, 8);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>

        {/* Breadcrumb */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 28, fontSize: 13, color: '#666' }}>
          <Link href="/" style={{ color: '#1a73e8', textDecoration: 'none' }}>Accueil</Link>
          <span>/</span>
          <Link href="/guides" style={{ color: '#1a73e8', textDecoration: 'none' }}>Guides</Link>
          <span>/</span>
          <span style={{ color: '#1a1a2e', fontWeight: 500 }}>{fullName}</span>
        </nav>

        <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>

          {/* ── LEFT COLUMN ─────────────────────────────── */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>

            {/* Profile Card */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 28, marginBottom: 20 }}>
              <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

                {/* Avatar */}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                  <div style={{
                    width: 100, height: 100, borderRadius: '50%', overflow: 'hidden',
                    background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: '3px solid #fff', boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                  }}>
                    {avatarSrc ? (
                      <img src={avatarSrc} alt={fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: 32, fontWeight: 700, color: '#1a73e8' }}>{initials}</span>
                    )}
                  </div>
                  {isCertified && (
                    <div style={{
                      position: 'absolute', bottom: 2, right: 2,
                      background: '#1a73e8', borderRadius: '50%', width: 24, height: 24,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: '2px solid #fff',
                    }}>
                      <BadgeCheck size={13} color="#fff" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                    <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{fullName}</h1>
                    {(isCertified || expertiseLevel) && (
                      <span style={{
                        background: badgeColor, color: '#fff', fontSize: 11, fontWeight: 700,
                        padding: '3px 10px', borderRadius: 20, letterSpacing: '0.05em',
                      }}>
                        {badgeLabel}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#666', fontSize: 13, marginBottom: 8 }}>
                    <MapPin size={13} />
                    <span>{location}</span>
                    {languages.length > 0 && (
                      <>
                        <span style={{ margin: '0 4px', color: '#ccc' }}>•</span>
                        <Globe size={13} />
                        <span>{languages.join(', ')}</span>
                      </>
                    )}
                  </div>

                  {specialties.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {specialties.map((s) => (
                        <span key={s._id} style={{
                          fontSize: 12, fontWeight: 500, padding: '4px 12px', borderRadius: 20,
                          background: '#f1f3f4', color: '#444', border: '1px solid #e0e0e0',
                        }}>
                          {s.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 1, marginTop: 24, background: '#f1f3f4', borderRadius: 12, overflow: 'hidden',
              }}>
                {[
                  { label: 'Voyages', value: tripsCompleted, icon: Users },
                  { label: "Ans d'expérience", value: yearsExperience, icon: Award },
                  { label: 'Conseils publiés', value: advices.length, icon: Shield },
                  { label: 'Note', value: rating > 0 ? `${rating.toFixed(1)}/5` : '—', icon: Star },
                ].map(({ label, value }) => (
                  <div key={label} style={{ background: '#fff', padding: '16px 12px', textAlign: 'center' }}>
                    <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#1a1a2e' }}>{value}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                  </div>
                ))}
              </div>

              {bio && (
                <p style={{ margin: '20px 0 0', fontSize: 14, color: '#555', lineHeight: 1.6 }}>{bio}</p>
              )}
            </div>

            {/* Safety Hub */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Shield size={18} color="#1a73e8" />
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>
                    Safety Hub de {userId.firstName}
                  </h2>
                  {advices.length > 0 && (
                    <span style={{
                      background: '#e8f0fe', color: '#1a73e8', fontSize: 12,
                      fontWeight: 600, padding: '2px 8px', borderRadius: 20,
                    }}>
                      {advices.length}
                    </span>
                  )}
                </div>
              </div>

              {advices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
                  <Shield size={36} color="#ccc" style={{ marginBottom: 12 }} />
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Aucun conseil publié pour l'instant</p>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 16 }}>
                  {/* Advice list */}
                  <div style={{ flex: '0 0 58%', display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 320, overflowY: 'auto' }}>
                    {advices.map((advice) => {
                      const cat = CATEGORY_CONFIG[advice.category] ?? CATEGORY_CONFIG.safety;
                      const { Icon } = cat;
                      const isExpanded = expandedAdvice === advice._id;
                      return (
                        <div
                          key={advice._id}
                          style={{
                            background: cat.bg, border: `1px solid ${cat.border}`,
                            borderRadius: 10, padding: '12px 14px', cursor: 'pointer',
                          }}
                          onClick={() => setExpandedAdvice(isExpanded ? null : advice._id)}
                        >
                          {/* Header row */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 4 }}>
                            <Icon size={14} color={cat.color} style={{ flexShrink: 0, marginTop: 2 }} />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: cat.color }}>{advice.title}</span>
                                <span style={{
                                  fontSize: 10, fontWeight: 600, padding: '1px 7px',
                                  borderRadius: 10, background: cat.color, color: '#fff',
                                  textTransform: 'uppercase', letterSpacing: '0.04em',
                                }}>
                                  {cat.label}
                                </span>
                              </div>
                              {advice.address && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3 }}>
                                  <MapPin size={10} color={cat.color} />
                                  <span style={{ fontSize: 11, color: '#666' }}>{advice.address}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content (collapsed/expanded) */}
                          <p style={{
                            margin: 0, fontSize: 12, color: '#555', lineHeight: 1.5,
                            display: '-webkit-box', WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: isExpanded ? undefined : 2,
                            overflow: isExpanded ? 'visible' : 'hidden',
                          }}>
                            {advice.content}
                          </p>

                          {/* Media thumbnails */}
                          {isExpanded && advice.mediaUrls.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                              {advice.mediaUrls.map((url, i) => (
                                <div key={i} style={{
                                  width: 60, height: 60, borderRadius: 6, overflow: 'hidden',
                                  background: '#e0e0e0', flexShrink: 0,
                                }}>
                                  {url.match(/\.(mp4|webm)$/i) ? (
                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <ImageIcon size={20} color="#888" />
                                    </div>
                                  ) : (
                                    <img
                                      src={`${API_URL}${url}`}
                                      alt=""
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Map placeholder with real pin count */}
                  <div style={{ flex: 1, borderRadius: 10, overflow: 'hidden', minHeight: 220, background: '#e8eaed', position: 'relative' }}>
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(135deg, #c8d6e5 0%, #a8bfd4 50%, #d4e4c8 100%)',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
                    }}>
                      <MapPin size={28} color="#1a73e8" />
                      <span style={{ fontSize: 12, color: '#555', fontWeight: 500 }}>{location}</span>
                      {mapPins.length > 0 && (
                        <span style={{ fontSize: 11, color: '#888' }}>{mapPins.length} pin{mapPins.length > 1 ? 's' : ''} sur la carte</span>
                      )}
                    </div>
                    {/* Visual pins */}
                    {mapPins.slice(0, 5).map((a, i) => {
                      const cat = CATEGORY_CONFIG[a.category] ?? CATEGORY_CONFIG.safety;
                      const positions = [
                        { top: '22%', left: '44%' }, { top: '52%', left: '28%' },
                        { top: '62%', left: '58%' }, { top: '35%', left: '70%' },
                        { top: '72%', left: '40%' },
                      ];
                      const pos = positions[i] ?? { top: '50%', left: '50%' };
                      return (
                        <div key={a._id} title={a.title} style={{
                          position: 'absolute', top: pos.top, left: pos.left,
                          width: 13, height: 13, borderRadius: '50%',
                          background: cat.color, border: '2px solid #fff',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                          cursor: 'pointer',
                        }} />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Star size={18} color="#f59e0b" fill="#f59e0b" />
                  <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Expériences des voyageurs</h2>
                </div>
              </div>

              {reviewCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', color: '#888' }}>
                  <MessageCircle size={36} color="#ccc" style={{ marginBottom: 12 }} />
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Aucun avis pour l'instant</p>
                  <p style={{ margin: '6px 0 0', fontSize: 13 }}>Soyez le premier à laisser un avis !</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 3 }}>
                      {[1, 2, 3, 4, 5].map(i => (
                        <Star key={i} size={18} color="#f59e0b" fill={i <= Math.round(rating) ? '#f59e0b' : 'none'} />
                      ))}
                    </div>
                    <span style={{ fontSize: 24, fontWeight: 700, color: '#1a1a2e' }}>{rating.toFixed(1)}</span>
                    <span style={{ fontSize: 13, color: '#888' }}>({reviewCount} avis)</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: '#888', fontStyle: 'italic' }}>
                    Les avis détaillés seront disponibles prochainement.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────── */}
          <div style={{ width: 320, flexShrink: 0 }}>

            {/* Book a Session */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>Réserver une session</h2>
                <Clock size={16} color="#888" />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                <div>
                  <span style={{ fontSize: 26, fontWeight: 700, color: '#1a1a2e' }}>€{hourlyRate}</span>
                  <span style={{ fontSize: 13, color: '#888', marginLeft: 4 }}>/hr</span>
                </div>
                <span style={{ fontSize: 11, color: '#2e7d32', fontWeight: 500 }}>Annulation gratuite 24h avant</span>
              </div>

              <div style={{ height: 1, background: '#f1f3f4', margin: '16px 0' }} />

              {/* Calendar */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#666' }}>
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#666' }}>
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
                  {DAYS.map((d, i) => (
                    <div key={i} style={{ textAlign: 'center', fontSize: 11, color: '#888', fontWeight: 600 }}>{d}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                  {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
                    const isToday = calYear === today.getFullYear() && calMonth === today.getMonth() && day === today.getDate();
                    const isSelected = selectedDay === day;
                    const isPast = new Date(calYear, calMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                    return (
                      <button
                        key={day}
                        onClick={() => !isPast && setSelectedDay(day)}
                        style={{
                          width: '100%', aspectRatio: '1', borderRadius: 6, border: 'none',
                          cursor: isPast ? 'default' : 'pointer', fontSize: 12,
                          fontWeight: isToday ? 700 : 400,
                          background: isSelected ? '#1a73e8' : isToday ? '#e8f0fe' : 'transparent',
                          color: isSelected ? '#fff' : isPast ? '#ccc' : isToday ? '#1a73e8' : '#1a1a2e',
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button style={{
                width: '100%', marginTop: 20, padding: '13px 0', borderRadius: 10,
                background: '#1a73e8', color: '#fff', fontWeight: 600, fontSize: 14,
                border: 'none', cursor: 'pointer',
              }}>
                Vérifier la disponibilité
              </button>
            </div>

            {/* Chat */}
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', overflow: 'hidden' }}>
              <div style={{
                padding: '14px 18px', borderBottom: '1px solid #f1f3f4',
                display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <MessageCircle size={16} color="#1a73e8" />
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>Chat avec {userId.firstName}</span>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#2e7d32', marginLeft: 'auto' }} />
              </div>

              <div style={{ padding: '14px 16px', minHeight: 140, maxHeight: 220, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {chatMessages.map((msg, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '80%', padding: '8px 12px', borderRadius: 12, fontSize: 12, lineHeight: 1.5,
                      background: msg.from === 'user' ? '#1a73e8' : '#f1f3f4',
                      color: msg.from === 'user' ? '#fff' : '#333',
                      borderBottomRightRadius: msg.from === 'user' ? 2 : 12,
                      borderBottomLeftRadius: msg.from === 'guide' ? 2 : 12,
                    }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f3f4', display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="text"
                  value={chatMessage}
                  onChange={e => setChatMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  placeholder="Envoyer un message..."
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 13, color: '#1a1a2e', background: 'transparent' }}
                />
                <button onClick={sendMessage} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1a73e8', padding: 4 }}>
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
