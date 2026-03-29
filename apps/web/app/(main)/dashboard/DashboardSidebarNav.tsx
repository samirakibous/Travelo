'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  UserCircle, CalendarDays, MessageCircle,
  Lightbulb, ShieldAlert, Star,
} from 'lucide-react';

type NavItem = { href: string; icon: React.ElementType; label: string };

const NAV: Record<string, NavItem[]> = {
  tourist: [
    { href: '/dashboard/profile',  icon: UserCircle,   label: 'Mon profil' },
    { href: '/dashboard/bookings', icon: CalendarDays,  label: 'Réservations' },
    { href: '/dashboard/messages', icon: MessageCircle, label: 'Messages' },
  ],
  guide: [
    { href: '/dashboard/profile',       icon: UserCircle,   label: 'Mon profil' },
    { href: '/dashboard/guide-profile', icon: Star,         label: 'Profil guide' },
    { href: '/dashboard/bookings',      icon: CalendarDays,  label: 'Réservations' },
    { href: '/dashboard/messages',      icon: MessageCircle, label: 'Messages' },
    { href: '/dashboard/advice',        icon: Lightbulb,    label: 'Mes conseils' },
  ],
  admin: [
    { href: '/dashboard/profile', icon: UserCircle,  label: 'Mon profil' },
    { href: '/admin',             icon: ShieldAlert, label: 'Administration' },
  ],
};

export default function DashboardSidebarNav({ role }: { role: string }) {
  const pathname = usePathname();
  const items = NAV[role] ?? NAV.tourist;

  return (
    <nav style={{ padding: '12px 10px', flex: 1 }}>
      {items?.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '9px 12px', borderRadius: 10, marginBottom: 2,
              fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? '#1a73e8' : '#4b5563',
              background: active ? '#e8f0fe' : 'transparent',
              textDecoration: 'none',
            }}
          >
            <Icon size={16} color={active ? '#1a73e8' : '#9ca3af'} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
