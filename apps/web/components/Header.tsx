'use client';

import Link from 'next/link';
import { Shield, Map, Users, Bell, UserCircle, LogOut, MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logout } from '../lib/auth';
import { getUnreadCount } from '../lib/messaging';

export default function Header() {
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user || (user.role !== 'tourist' && user.role !== 'guide')) return;
    const fetchCount = async () => {
      const count = await getUnreadCount();
      setUnread(count);
    };
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="flex items-center justify-between px-16 h-16 bg-white shadow-sm sticky top-0 z-[100]">
      <Link href="/" className="flex items-center gap-2 font-extrabold text-xl text-[#1a73e8]">
        <Shield size={22} color="#1a73e8" />
        Travelo
      </Link>

      <nav className="flex items-center gap-1">
        {[
          { href: '/map', icon: <Map size={16} />, label: 'Safety Map' },
          { href: '/guides', icon: <Users size={16} />, label: 'Guides' },
          { href: '#', icon: <Bell size={16} />, label: 'Alerts' },
          { href: '/community', label: 'Communauté' },
          { href: '#', label: 'Pricing' },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-[#444] hover:bg-gray-50 transition-colors"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2.5">
        {user ? (
          <>
            {(user.role === 'tourist' || user.role === 'guide') && (
              <Link
                href="/dashboard/messages"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors"
              >
                <MessageCircle size={18} />
                {unread > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1a73e8] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {unread > 9 ? '9+' : unread}
                  </span>
                )}
              </Link>
            )}
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] rounded-lg text-sm font-semibold text-[#1a1a2e] hover:bg-[#e2e8f0] transition-colors"
            >
              <UserCircle size={18} color="#1a73e8" />
              {user.firstName}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-[#e53e3e] hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-[18px] py-2 border border-[#e2e8f0] rounded-lg text-[#444] font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Se connecter
            </Link>
            <Link
              href="/register"
              className="px-[18px] py-2 bg-[#1a73e8] rounded-lg text-white font-semibold text-sm hover:bg-blue-600 transition-colors"
            >
              S&apos;inscrire
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
