import { redirect } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { getUser } from '../../../lib/getUser';
import { logout } from '../../../lib/auth';
import DashboardSidebarNav from './DashboardSidebarNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/login');

  const roleColors: Record<string, { color: string; bg: string }> = {
    tourist: { color: '#1a73e8', bg: '#e8f0fe' },
    guide:   { color: '#9333ea', bg: '#f5f3ff' },
    admin:   { color: '#dc2626', bg: '#fee2e2' },
  };
  const rc = roleColors[user.role] ?? roleColors.tourist;
  const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase();

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', background: '#f8f9ff' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 256, flexShrink: 0,
        background: '#fff', borderRight: '1px solid #f1f3f4',
        position: 'sticky', top: 64, height: 'calc(100vh - 64px)',
        display: 'flex', flexDirection: 'column',
      }}>

        {/* User card */}
        <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid #f1f3f4', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #1a73e8, #9333ea)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{initials}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.firstName} {user.lastName}
              </p>
              <span style={{
                display: 'inline-block', marginTop: 4,
                fontSize: 10, fontWeight: 700, letterSpacing: '0.06em',
                textTransform: 'uppercase', color: rc.color, background: rc.bg,
                padding: '2px 7px', borderRadius: 99,
              }}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <DashboardSidebarNav role={user.role} />
        </div>

        {/* Logout */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid #f1f3f4', flexShrink: 0 }}>
          <form action={async () => { 'use server'; await logout(); redirect('/login'); }}>
            <button
              type="submit"
              style={{
                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                fontSize: 13, fontWeight: 600, color: '#ef4444',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '9px 12px', borderRadius: 10,
              }}
            >
              <LogOut size={15} />
              Déconnexion
            </button>
          </form>
        </div>
      </aside>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
