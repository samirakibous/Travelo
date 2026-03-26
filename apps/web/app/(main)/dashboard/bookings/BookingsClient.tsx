'use client';

import { useState, useTransition } from 'react';
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Check, X } from 'lucide-react';
import { confirmBooking, rejectBooking, cancelBooking } from '../../../../lib/booking';
import type { Booking, BookingStatus } from '../../../../types/booking';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

const MONTH_NAMES = ['Jan','Fév','Mar','Avr','Mai','Jun','Jul','Aoû','Sep','Oct','Nov','Déc'];

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; bg: string; Icon: React.ElementType }> = {
  pending:   { label: 'En attente',  color: '#b45309', bg: '#fffbeb', Icon: Clock },
  confirmed: { label: 'Confirmée',   color: '#15803d', bg: '#f0fdf4', Icon: CheckCircle },
  rejected:  { label: 'Refusée',     color: '#b91c1c', bg: '#fef2f2', Icon: XCircle },
  cancelled: { label: 'Annulée',     color: '#6b7280', bg: '#f9fafb', Icon: AlertCircle },
};

function Avatar({ src, initials, size = 36 }: { src: string | null; initials: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
      background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {src ? (
        <img src={`${API_URL}${src}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: size * 0.35, fontWeight: 700, color: '#1a73e8' }}>{initials}</span>
      )}
    </div>
  );
}

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${d} ${MONTH_NAMES[m - 1]} ${y}`;
}

type Props = {
  role: string;
  myBookings: Booking[];
  incomingBookings: Booking[];
};

function BookingCard({
  booking,
  isIncoming,
  isPending,
  onConfirm,
  onReject,
  onCancel,
}: {
  booking: Booking;
  isIncoming: boolean;
  isPending: boolean;
  onConfirm?: (id: string) => void;
  onReject?: (id: string) => void;
  onCancel?: (id: string) => void;
}) {
  const cfg = STATUS_CONFIG[booking.status];
  const { Icon } = cfg;

  const person = isIncoming ? booking.touristId : booking.guideId?.userId;
  const personInitials = person ? `${person.firstName[0]}${person.lastName[0]}` : '?';
  const personName = person ? `${person.firstName} ${person.lastName}` : '—';
  const personSub = isIncoming
    ? (booking.touristId as any)?.email
    : `${booking.guideId?.location ?? ''} · €${booking.guideId?.hourlyRate}/hr`;

  return (
    <div style={{
      background: '#fff', borderRadius: 14, border: '1px solid #e8eaed',
      padding: '18px 20px', display: 'flex', alignItems: 'flex-start', gap: 16,
      opacity: isPending ? 0.6 : 1,
    }}>
      <Avatar src={person?.profilePicture ?? null} initials={personInitials} size={42} />

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{personName}</span>
            {personSub && <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{personSub}</span>}
          </div>
          <span style={{
            display: 'flex', alignItems: 'center', gap: 4,
            fontSize: 11, fontWeight: 600, padding: '3px 10px',
            borderRadius: 20, background: cfg.bg, color: cfg.color,
          }}>
            <Icon size={11} />
            {cfg.label}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: booking.message ? 8 : 0 }}>
          <Calendar size={12} color="#888" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#1a73e8' }}>{formatDate(booking.date)}</span>
        </div>

        {booking.message && (
          <p style={{
            margin: 0, fontSize: 12, color: '#555', fontStyle: 'italic',
            background: '#f8f9fa', padding: '6px 10px', borderRadius: 8,
          }}>
            "{booking.message}"
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {isIncoming && booking.status === 'pending' && (
          <>
            <button
              onClick={() => onConfirm?.(booking._id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: '#f0fdf4', color: '#15803d', fontWeight: 600,
                fontSize: 12, cursor: 'pointer',
              }}
            >
              <Check size={13} /> Confirmer
            </button>
            <button
              onClick={() => onReject?.(booking._id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: '#fef2f2', color: '#b91c1c', fontWeight: 600,
                fontSize: 12, cursor: 'pointer',
              }}
            >
              <X size={13} /> Refuser
            </button>
          </>
        )}
        {!isIncoming && booking.status === 'pending' && (
          <button
            onClick={() => onCancel?.(booking._id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 14px', borderRadius: 8, border: 'none',
              background: '#f9fafb', color: '#6b7280', fontWeight: 600,
              fontSize: 12, cursor: 'pointer', border: '1px solid #e5e7eb',
            } as React.CSSProperties}
          >
            <X size={13} /> Annuler
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookingsClient({ role, myBookings: initialMy, incomingBookings: initialIncoming }: Props) {
  const isGuide = role === 'guide';
  const [myBookings, setMyBookings] = useState<Booking[]>(initialMy);
  const [incoming, setIncoming] = useState<Booking[]>(initialIncoming);
  const [isPending, startTransition] = useTransition();

  const updateMyStatus = (id: string, status: BookingStatus) =>
    setMyBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));

  const updateIncomingStatus = (id: string, status: BookingStatus) =>
    setIncoming(prev => prev.map(b => b._id === id ? { ...b, status } : b));

  const handleConfirm = (id: string) => {
    startTransition(async () => {
      const res = await confirmBooking(id);
      if (res.success) updateIncomingStatus(id, 'confirmed');
    });
  };

  const handleReject = (id: string) => {
    startTransition(async () => {
      const res = await rejectBooking(id);
      if (res.success) updateIncomingStatus(id, 'rejected');
    });
  };

  const handleCancelMy = (id: string) => {
    if (!confirm('Annuler cette réservation ?')) return;
    startTransition(async () => {
      const res = await cancelBooking(id);
      if (res.success) updateMyStatus(id, 'cancelled');
    });
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
        <Calendar size={22} color="#1a73e8" />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
          Réservations
        </h1>
      </div>

      {/* Guide: incoming requests */}
      {isGuide && (
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
            Demandes reçues
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: '#888' }}>
              {incoming.length} demande{incoming.length !== 1 ? 's' : ''}
            </span>
          </h2>
          {incoming.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', background: '#f8f9fa', borderRadius: 12 }}>
              <p style={{ margin: 0, fontSize: 14 }}>Les demandes des touristes apparaîtront ici</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {incoming.map(b => (
                <BookingCard
                  key={b._id}
                  booking={b}
                  isIncoming={true}
                  isPending={isPending}
                  onConfirm={handleConfirm}
                  onReject={handleReject}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* My own bookings (tourists only) */}
      {!isGuide && <section>
        <h2 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>
          Mes réservations
          <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 500, color: '#888' }}>
            {myBookings.length} réservation{myBookings.length !== 1 ? 's' : ''}
          </span>
        </h2>
        {myBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#aaa', background: '#f8f9fa', borderRadius: 12 }}>
            <Calendar size={36} color="#ddd" style={{ marginBottom: 10 }} />
            <p style={{ margin: 0, fontSize: 14 }}>Aucune réservation</p>
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>Réservez un guide depuis la page des guides</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {myBookings.map(b => (
              <BookingCard
                key={b._id}
                booking={b}
                isIncoming={false}
                isPending={isPending}
                onCancel={handleCancelMy}
              />
            ))}
          </div>
        )}
      </section>}
    </div>
  );
}
