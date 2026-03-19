import Link from 'next/link';
import { Shield, Map, Users, Bell, Menu } from 'lucide-react';

export default function Header() {
  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 64px', height: 64, background: '#fff',
      boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <Link href="/" style={{
        display: 'flex', alignItems: 'center', gap: 8,
        fontWeight: 800, fontSize: 20, color: '#1a73e8', textDecoration: 'none',
      }}>
        <Shield size={22} color="#1a73e8" />
        Travelo
      </Link>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {[
          { href: '#', icon: <Map size={16} />, label: 'Safety Map' },
          { href: '#', icon: <Users size={16} />, label: 'Guides' },
          { href: '#', icon: <Bell size={16} />, label: 'Alerts' },
          { href: '#', label: 'Community' },
          { href: '#', label: 'Pricing' },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 500,
            color: '#444', textDecoration: 'none',
          }}>
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/login" style={{
          padding: '8px 18px', border: '1px solid #e2e8f0',
          borderRadius: 8, color: '#444', fontWeight: 600, fontSize: 14,
          textDecoration: 'none',
        }}>
          Log in
        </Link>
        <Link href="/register" style={{
          padding: '8px 18px', background: '#1a73e8',
          borderRadius: 8, color: '#fff', fontWeight: 600, fontSize: 14,
          textDecoration: 'none',
        }}>
          Sign up free
        </Link>
      </div>
    </header>
  );
}
