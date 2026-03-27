'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, MessageCircle, CalendarDays, CheckCheck, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  getNotifications,
  getNotificationUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type AppNotification,
} from '../lib/notification';

const TYPE_ICON: Record<AppNotification['type'], React.ReactNode> = {
  new_message:       <MessageCircle size={14} color="#1a73e8" />,
  new_booking:       <CalendarDays size={14} color="#9333ea" />,
  booking_confirmed: <CalendarDays size={14} color="#16a34a" />,
  booking_rejected:  <CalendarDays size={14} color="#dc2626" />,
  booking_cancelled: <CalendarDays size={14} color="#d97706" />,
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'à l\'instant';
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  return `il y a ${Math.floor(hours / 24)}j`;
}

export default function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Poll unread count every 30s
  useEffect(() => {
    const fetch = async () => {
      const count = await getNotificationUnreadCount();
      setUnread((prev) => {
        // If count increased, invalidate loaded list so it refetches on next open
        if (count > prev) setLoaded(false);
        return count;
      });
    };
    fetch();
    const interval = setInterval(fetch, 10000);
    return () => clearInterval(interval);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    const nextOpen = !open;
    setOpen(nextOpen);
    if (nextOpen) {
      setLoaded(false);
      const data = await getNotifications();
      setNotifications(data);
      setLoaded(true);
    }
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnread(0);
  };

  const handleClick = async (n: AppNotification) => {
    if (!n.isRead) {
      await markNotificationRead(n._id);
      setNotifications((prev) =>
        prev.map((item) => (item._id === n._id ? { ...item, isRead: true } : item)),
      );
      setUnread((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    router.push(n.link);
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={handleOpen}
        style={{
          position: 'relative', width: 36, height: 36, borderRadius: 8,
          border: 'none', background: open ? '#f1f5f9' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: '#6b7280',
        }}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            minWidth: 16, height: 16, borderRadius: 99,
            background: '#1a73e8', color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0 3px',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: 0,
          width: 340, background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)', border: '1px solid #f1f3f4',
          zIndex: 200, overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderBottom: '1px solid #f1f3f4',
          }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>
              Notifications {unread > 0 && <span style={{ color: '#1a73e8' }}>({unread})</span>}
            </span>
            <div style={{ display: 'flex', gap: 4 }}>
              {unread > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Tout marquer comme lu"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6b7280' }}
                >
                  <CheckCheck size={15} />
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, color: '#6b7280' }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {!loaded ? (
              <p style={{ textAlign: 'center', padding: '24px 0', fontSize: 13, color: '#9ca3af' }}>
                Chargement...
              </p>
            ) : notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px' }}>
                <Bell size={28} color="#d1d5db" style={{ margin: '0 auto 8px' }} />
                <p style={{ fontSize: 13, color: '#9ca3af' }}>Aucune notification</p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => handleClick(n)}
                  style={{
                    width: '100%', textAlign: 'left', background: n.isRead ? '#fff' : '#eff6ff',
                    border: 'none', borderBottom: '1px solid #f9fafb',
                    padding: '12px 16px', cursor: 'pointer', display: 'flex', gap: 10,
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{
                    width: 30, height: 30, borderRadius: '50%', background: '#f1f5f9',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {TYPE_ICON[n.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: n.isRead ? 400 : 600, color: '#1a1a2e', margin: 0 }}>
                      {n.title}
                    </p>
                    <p style={{ fontSize: 12, color: '#6b7280', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {n.body}
                    </p>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: '3px 0 0' }}>
                      {timeAgo(n.createdAt)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#1a73e8', flexShrink: 0, marginTop: 4 }} />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
