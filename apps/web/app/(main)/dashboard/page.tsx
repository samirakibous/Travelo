import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Map, Users, MessageCircle,
  CalendarDays, Lightbulb, Star, ShieldAlert,
} from 'lucide-react';
import { getUser } from '../../../lib/getUser';

type Card = { href: string; icon: React.ElementType; color: string; bg: string; title: string; desc: string };

const CARDS: Record<string, Card[]> = {
  tourist: [
    { href: '/map',               icon: Map,           color: '#1a73e8', bg: '#e8f0fe', title: 'Safety Map',      desc: 'Visualisez les zones à risque en temps réel' },
    { href: '/guides',            icon: Users,         color: '#9333ea', bg: '#f5f3ff', title: 'Trouver un guide', desc: 'Réservez un guide local certifié' },
    { href: '/dashboard/bookings',icon: CalendarDays,  color: '#0891b2', bg: '#e0f2fe', title: 'Réservations',    desc: 'Suivez l\'état de vos demandes' },
    { href: '/dashboard/messages',icon: MessageCircle, color: '#16a34a', bg: '#dcfce7', title: 'Messages',        desc: 'Discutez avec votre guide' },
  ],
  guide: [
    { href: '/dashboard/bookings',      icon: CalendarDays, color: '#1a73e8', bg: '#e8f0fe', title: 'Réservations',    desc: 'Acceptez ou refusez les demandes' },
    { href: '/dashboard/messages',      icon: MessageCircle,color: '#16a34a', bg: '#dcfce7', title: 'Messages',        desc: 'Échangez avec vos touristes' },
    { href: '/dashboard/advice',        icon: Lightbulb,    color: '#d97706', bg: '#fef3c7', title: 'Mes conseils',    desc: 'Publiez des conseils géolocalisés' },
    { href: '/dashboard/guide-profile', icon: Star,         color: '#9333ea', bg: '#f5f3ff', title: 'Profil guide',   desc: 'Complétez votre profil public' },
  ],
  admin: [
    { href: '/admin', icon: ShieldAlert, color: '#dc2626', bg: '#fee2e2', title: 'Administration', desc: 'Modération et gestion de la plateforme' },
  ],
};

const ROLE_LABEL: Record<string, string> = {
  tourist: 'Touriste',
  guide:   'Guide certifié',
  admin:   'Administrateur',
};

const ROLE_DESC: Record<string, string> = {
  tourist: 'Explorez la carte de sécurité, réservez un guide local et rejoignez la communauté.',
  guide:   'Gérez vos réservations, publiez des conseils de sécurité et échangez avec vos touristes.',
  admin:   'Supervisez la plateforme, modérez les contenus et gérez les utilisateurs.',
};

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const cards = CARDS[user.role] ?? CARDS.tourist ?? [];

  return (
    <div style={{ maxWidth: 800 }}>
      {/* Welcome banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a73e8 0%, #9333ea 100%)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 28,
      }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.75)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 6px' }}>
          {ROLE_LABEL[user.role] ?? user.role}
        </p>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#fff', margin: '0 0 8px' }}>
          Bonjour, {user.firstName} !
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.6 }}>
          {ROLE_DESC[user.role]}
        </p>
      </div>

      {/* Quick access cards */}
      <p style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14 }}>
        Accès rapide
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
        {cards.map(({ href, icon: Icon, color, bg, title, desc }) => (
          <Link
            key={href}
            href={href}
            style={{
              display: 'block', padding: '18px 16px',
              background: '#fff', borderRadius: 14,
              border: '1px solid #f1f3f4', textDecoration: 'none',
              transition: 'box-shadow 0.15s',
            }}
          >
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: bg, display: 'flex', alignItems: 'center',
              justifyContent: 'center', marginBottom: 12,
            }}>
              <Icon size={18} color={color} />
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>{title}</p>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: 0, lineHeight: 1.4 }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
