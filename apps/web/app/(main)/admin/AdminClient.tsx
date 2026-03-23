'use client';

import { useState, useTransition } from 'react';
import {
  Users, FileText, Lightbulb, ShieldAlert,
  Trash2, UserCheck, UserX, ChevronDown, Search,
  BarChart3, AlertTriangle,
} from 'lucide-react';
import {
  adminUpdateRole,
  adminToggleActive,
  adminDeletePost,
  adminDeleteAdvice,
  adminGetUsers,
  adminGetPosts,
  adminGetAdvices,
} from '../../../lib/admin';
import type { AdminStats, AdminUser, AdminPost, AdminAdvice, AdminPagedResponse } from '../../../types/admin';

type Tab = 'overview' | 'users' | 'posts' | 'advices';

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  tourist:  { label: 'Touriste', color: '#6b7280' },
  guide:    { label: 'Guide',    color: '#2563eb' },
  admin:    { label: 'Admin',    color: '#dc2626' },
};

const CATEGORY_COLORS: Record<string, string> = {
  safety: '#dc2626', health: '#16a34a', transport: '#2563eb',
  culture: '#9333ea', emergency: '#ea580c',
  travel: '#0891b2', food: '#d97706', culture2: '#7c3aed',
};

function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: number | string;
  sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + '18' }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-[#1a1a2e]">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const r = ROLE_LABELS[role] ?? { label: role, color: '#6b7280' };
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: r.color + '18', color: r.color }}>
      {r.label}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const color = CATEGORY_COLORS[category] ?? '#6b7280';
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
      style={{ background: color + '18', color }}>
      {category}
    </span>
  );
}

type Props = {
  initialStats: AdminStats | null;
  initialUsers: AdminPagedResponse<AdminUser>;
  initialPosts: AdminPagedResponse<AdminPost>;
  initialAdvices: AdminPagedResponse<AdminAdvice>;
};

export default function AdminClient({ initialStats, initialUsers, initialPosts, initialAdvices }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats] = useState(initialStats);

  // Users
  const [users, setUsers] = useState(initialUsers.data);
  const [userSearch, setUserSearch] = useState('');
  const [isPendingUsers, startUsers] = useTransition();

  // Posts
  const [posts, setPosts] = useState(initialPosts.data);
  const [isPendingPosts, startPosts] = useTransition();

  // Advices
  const [advices, setAdvices] = useState(initialAdvices.data);
  const [isPendingAdvices, startAdvices] = useTransition();

  const handleSearchUsers = (search: string) => {
    setUserSearch(search);
    startUsers(async () => {
      const res = await adminGetUsers({ search, limit: 20 });
      setUsers(res.data);
    });
  };

  const handleToggleActive = (userId: string) => {
    startUsers(async () => {
      const res = await adminToggleActive(userId);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, isActive: res.isActive } : u)),
        );
      }
    });
  };

  const handleChangeRole = (userId: string, role: string) => {
    startUsers(async () => {
      const res = await adminUpdateRole(userId, role);
      if (res.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: res.data.role } : u)),
        );
      }
    });
  };

  const handleDeletePost = (postId: string) => {
    startPosts(async () => {
      const res = await adminDeletePost(postId);
      if (res.success) setPosts((prev) => prev.filter((p) => p._id !== postId));
    });
  };

  const handleDeleteAdvice = (adviceId: string) => {
    startAdvices(async () => {
      const res = await adminDeleteAdvice(adviceId);
      if (res.success) setAdvices((prev) => prev.filter((a) => a._id !== adviceId));
    });
  };

  const loadMorePosts = () => {
    startPosts(async () => {
      const res = await adminGetPosts({ page: Math.ceil(posts.length / 20) + 1, limit: 20 });
      setPosts((prev) => [...prev, ...res.data]);
    });
  };

  const loadMoreAdvices = () => {
    startAdvices(async () => {
      const res = await adminGetAdvices({ page: Math.ceil(advices.length / 20) + 1, limit: 20 });
      setAdvices((prev) => [...prev, ...res.data]);
    });
  };

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Vue d\'ensemble', icon: <BarChart3 size={15} /> },
    { key: 'users',    label: 'Utilisateurs',    icon: <Users size={15} /> },
    { key: 'posts',    label: 'Publications',     icon: <FileText size={15} /> },
    { key: 'advices',  label: 'Conseils',         icon: <Lightbulb size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <ShieldAlert size={18} color="#dc2626" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold text-[#1a1a2e]">Administration</h1>
          <p className="text-xs text-gray-400">Modération et gestion de la plateforme</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-8">
        <div className="flex gap-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors"
              style={{
                borderColor: tab === t.key ? '#1a73e8' : 'transparent',
                color: tab === t.key ? '#1a73e8' : '#6b7280',
              }}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-8 max-w-6xl mx-auto">

        {/* TAB: Overview */}
        {tab === 'overview' && stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <StatCard icon={<Users size={20} color="#1a73e8" />}
              label="Utilisateurs" value={stats.users.total}
              sub={`${stats.users.active} actifs · ${stats.users.banned} bannis`}
              color="#1a73e8" />
            <StatCard icon={<FileText size={20} color="#0891b2" />}
              label="Publications" value={stats.posts} color="#0891b2" />
            <StatCard icon={<AlertTriangle size={20} color="#ea580c" />}
              label="Signalements" value={stats.reportedPosts}
              sub="publications signalées" color="#ea580c" />
            <StatCard icon={<Lightbulb size={20} color="#9333ea" />}
              label="Conseils" value={stats.advices} color="#9333ea" />
            <StatCard icon={<ShieldAlert size={20} color="#16a34a" />}
              label="Zones à risque" value={stats.zones} color="#16a34a" />
          </div>
        )}

        {/* TAB: Users */}
        {tab === 'users' && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => handleSearchUsers(e.target.value)}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8]"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilisateur</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className={isPendingUsers ? 'opacity-60' : ''}>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-[#1a1a2e]">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative inline-block">
                          <select
                            value={user.role}
                            onChange={(e) => handleChangeRole(user._id, e.target.value)}
                            className="appearance-none pl-2 pr-6 py-1 rounded-lg text-xs font-semibold border border-gray-200 bg-white focus:outline-none cursor-pointer"
                            style={{ color: ROLE_LABELS[user.role]?.color ?? '#6b7280' }}
                          >
                            <option value="tourist">Touriste</option>
                            <option value="guide">Guide</option>
                            <option value="admin">Admin</option>
                          </select>
                          <ChevronDown size={10} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{
                            background: user.isActive ? '#dcfce7' : '#fee2e2',
                            color: user.isActive ? '#16a34a' : '#dc2626',
                          }}>
                          {user.isActive ? 'Actif' : 'Banni'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleActive(user._id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors"
                          style={{ color: user.isActive ? '#dc2626' : '#16a34a' }}
                        >
                          {user.isActive ? <UserX size={12} /> : <UserCheck size={12} />}
                          {user.isActive ? 'Bannir' : 'Réactiver'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center py-8 text-sm text-gray-400">Aucun utilisateur trouvé</p>
              )}
            </div>
          </div>
        )}

        {/* TAB: Posts */}
        {tab === 'posts' && (
          <div className="flex flex-col gap-3">
            {posts.map((post) => (
              <div key={post._id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#1a1a2e] text-sm truncate">{post.title}</p>
                    {post.reports.length > 0 && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600 shrink-0">
                        <AlertTriangle size={10} />
                        {post.reports.length} signalement{post.reports.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{post.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <CategoryBadge category={post.category} />
                    <span className="text-xs text-gray-400">{post.destination}</span>
                    <span className="text-xs text-gray-400">
                      par {post.author?.firstName} {post.author?.lastName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeletePost(post._id)}
                  disabled={isPendingPosts}
                  className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 disabled:opacity-40"
                >
                  <Trash2 size={14} color="#dc2626" />
                </button>
              </div>
            ))}
            {posts.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-400">Aucune publication</p>
            )}
            {posts.length > 0 && posts.length % 20 === 0 && (
              <button
                onClick={loadMorePosts}
                disabled={isPendingPosts}
                className="mx-auto px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                {isPendingPosts ? 'Chargement...' : 'Charger plus'}
              </button>
            )}
          </div>
        )}

        {/* TAB: Advices */}
        {tab === 'advices' && (
          <div className="flex flex-col gap-3">
            {advices.map((advice) => (
              <div key={advice._id} className="bg-white rounded-2xl shadow-sm p-5 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-[#1a1a2e] text-sm truncate">{advice.title}</p>
                    <CategoryBadge category={advice.category} />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{advice.content}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {advice.address && <span className="text-xs text-gray-400">{advice.address}</span>}
                    <span className="text-xs text-gray-400">
                      par {advice.author?.firstName} {advice.author?.lastName}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteAdvice(advice._id)}
                  disabled={isPendingAdvices}
                  className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 disabled:opacity-40"
                >
                  <Trash2 size={14} color="#dc2626" />
                </button>
              </div>
            ))}
            {advices.length === 0 && (
              <p className="text-center py-8 text-sm text-gray-400">Aucun conseil</p>
            )}
            {advices.length > 0 && advices.length % 20 === 0 && (
              <button
                onClick={loadMoreAdvices}
                disabled={isPendingAdvices}
                className="mx-auto px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40"
              >
                {isPendingAdvices ? 'Chargement...' : 'Charger plus'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
