'use client';

import { useState, useTransition } from 'react';
import {
  Users, FileText, Lightbulb, ShieldAlert,
  Trash2, UserCheck, UserX, ChevronDown, Search,
  BarChart3, AlertTriangle, ChevronLeft, ChevronRight,
} from 'lucide-react';
import {
  adminUpdateRole, adminToggleActive, adminDeleteUser,
  adminDeletePost, adminDeleteAdvice,
  adminGetUsers, adminGetPosts, adminGetAdvices,
} from '../../../lib/admin';
import type { AdminStats, AdminUser, AdminPost, AdminAdvice, AdminPagedResponse } from '../../../types/admin';

type Tab = 'overview' | 'users' | 'posts' | 'advices';

const LIMIT = 5;

// Static Tailwind class maps — full class names required for purge safety
const ROLE_CLASSES: Record<string, { badge: string; select: string; dot: string }> = {
  tourist: { badge: 'bg-gray-100 text-gray-600',  select: 'bg-gray-100  text-gray-600  border-gray-300',  dot: 'bg-gray-500'  },
  guide:   { badge: 'bg-blue-100 text-blue-600',  select: 'bg-blue-100  text-blue-600  border-blue-300',  dot: 'bg-blue-500'  },
  admin:   { badge: 'bg-red-100  text-red-600',   select: 'bg-red-100   text-red-600   border-red-300',   dot: 'bg-red-500'   },
};

const CATEGORY_CLASSES: Record<string, string> = {
  safety:    'bg-red-100    text-red-600',
  health:    'bg-green-100  text-green-600',
  transport: 'bg-blue-100   text-blue-600',
  culture:   'bg-purple-100 text-purple-600',
  emergency: 'bg-orange-100 text-orange-600',
  travel:    'bg-cyan-100   text-cyan-600',
  food:      'bg-amber-100  text-amber-700',
};

const STAT_CARDS = [
  { key: 'users',    icon: Users,         iconClass: 'text-blue-600',   bgClass: 'bg-blue-50'   },
  { key: 'posts',    icon: FileText,      iconClass: 'text-cyan-600',   bgClass: 'bg-cyan-50'   },
  { key: 'reports',  icon: AlertTriangle, iconClass: 'text-orange-500', bgClass: 'bg-orange-50' },
  { key: 'advices',  icon: Lightbulb,     iconClass: 'text-purple-600', bgClass: 'bg-purple-50' },
  { key: 'zones',    icon: ShieldAlert,   iconClass: 'text-green-600',  bgClass: 'bg-green-50'  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  const c = ROLE_CLASSES[role] ?? ROLE_CLASSES['tourist']!;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.badge}`}>
      {role === 'tourist' ? 'Touriste' : role === 'guide' ? 'Guide' : 'Admin'}
    </span>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_CLASSES[category] ?? 'bg-gray-100 text-gray-600';
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${c}`}>
      {category}
    </span>
  );
}

const ROLES = [
  { value: 'tourist', label: 'Touriste' },
  { value: 'guide',   label: 'Guide' },
];

function RoleSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const c = ROLE_CLASSES[value] ?? ROLE_CLASSES['tourist']!;
  const label = value === 'tourist' ? 'Touriste' : 'Guide';

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-xs font-semibold cursor-pointer ${c.select}`}
      >
        {label}
        <ChevronDown size={10} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 min-w-[110px] overflow-hidden">
            {ROLES.map((role) => {
              const rc = ROLE_CLASSES[role.value] ?? ROLE_CLASSES['tourist']!;
              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => { onChange(role.value); setOpen(false); }}
                  className={`flex items-center gap-2 w-full px-3 py-2 text-left text-xs font-semibold hover:bg-gray-50 transition-colors ${value === role.value ? 'bg-gray-50' : ''}`}
                >
                  <span className={`w-2 h-2 rounded-full shrink-0 ${rc.dot}`} />
                  <span className={rc.badge.split(' ')[1] ?? ''}>{role.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function Pagination({ page, total, limit, onChange, disabled }: {
  page: number; total: number; limit: number;
  onChange: (p: number) => void; disabled?: boolean;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  const pages: (number | '...')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (page > 3) pages.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i);
    if (page < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-between mt-4">
      <p className="text-xs text-gray-400">
        Page {page} sur {totalPages} · {total} résultat{total !== 1 ? 's' : ''}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1 || disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-30"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`dots-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              disabled={disabled}
              className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors disabled:opacity-40 border ${
                p === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages || disabled}
          className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-30"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

type Props = {
  initialStats: AdminStats | null;
  initialUsers: AdminPagedResponse<AdminUser>;
  initialPosts: AdminPagedResponse<AdminPost>;
  initialAdvices: AdminPagedResponse<AdminAdvice>;
};

export default function AdminClient({ initialStats, initialUsers, initialPosts, initialAdvices }: Props) {
  const [tab, setTab] = useState<Tab>('overview');
  const [stats] = useState(initialStats);

  const [users, setUsers]           = useState(initialUsers.data);
  const [usersTotal, setUsersTotal] = useState(initialUsers.total);
  const [usersPage, setUsersPage]   = useState(1);
  const [userSearch, setUserSearch] = useState('');
  const [isPendingUsers, startUsers] = useTransition();

  const [posts, setPosts]           = useState(initialPosts.data);
  const [postsTotal, setPostsTotal] = useState(initialPosts.total);
  const [postsPage, setPostsPage]   = useState(1);
  const [isPendingPosts, startPosts] = useTransition();

  const [advices, setAdvices]             = useState(initialAdvices.data);
  const [advicesTotal, setAdvicesTotal]   = useState(initialAdvices.total);
  const [advicesPage, setAdvicesPage]     = useState(1);
  const [isPendingAdvices, startAdvices]  = useTransition();

  const loadUsers = (page: number, search: string) => {
    startUsers(async () => {
      const res = await adminGetUsers({ page, limit: LIMIT, search });
      setUsers(res.data); setUsersTotal(res.total); setUsersPage(page);
    });
  };

  const loadPosts = (page: number) => {
    startPosts(async () => {
      const res = await adminGetPosts({ page, limit: LIMIT });
      setPosts(res.data); setPostsTotal(res.total); setPostsPage(page);
    });
  };

  const loadAdvices = (page: number) => {
    startAdvices(async () => {
      const res = await adminGetAdvices({ page, limit: LIMIT });
      setAdvices(res.data); setAdvicesTotal(res.total); setAdvicesPage(page);
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Supprimer cet utilisateur définitivement ?')) return;
    startUsers(async () => {
      const res = await adminDeleteUser(userId);
      if (res.success) {
        const updated = users.filter((u) => u._id !== userId);
        setUsersTotal((t) => t - 1);
        updated.length === 0 && usersPage > 1 ? loadUsers(usersPage - 1, userSearch) : setUsers(updated);
      }
    });
  };

  const handleToggleActive = (userId: string) => {
    startUsers(async () => {
      const res = await adminToggleActive(userId);
      if (res.success)
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, isActive: res.isActive } : u)));
    });
  };

  const handleChangeRole = (userId: string, role: string) => {
    startUsers(async () => {
      const res = await adminUpdateRole(userId, role);
      if (res.success)
        setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: res.data.role } : u)));
    });
  };

  const handleDeletePost = (postId: string) => {
    startPosts(async () => {
      const res = await adminDeletePost(postId);
      if (res.success) {
        const updated = posts.filter((p) => p._id !== postId);
        setPostsTotal((t) => t - 1);
        updated.length === 0 && postsPage > 1 ? loadPosts(postsPage - 1) : setPosts(updated);
      }
    });
  };

  const handleDeleteAdvice = (adviceId: string) => {
    startAdvices(async () => {
      const res = await adminDeleteAdvice(adviceId);
      if (res.success) {
        const updated = advices.filter((a) => a._id !== adviceId);
        setAdvicesTotal((t) => t - 1);
        updated.length === 0 && advicesPage > 1 ? loadAdvices(advicesPage - 1) : setAdvices(updated);
      }
    });
  };

  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: "Vue d'ensemble", icon: <BarChart3 size={15} /> },
    { key: 'users',    label: 'Utilisateurs',   icon: <Users size={15} /> },
    { key: 'posts',    label: 'Publications',    icon: <FileText size={15} /> },
    { key: 'advices',  label: 'Conseils',        icon: <Lightbulb size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">
          <ShieldAlert size={18} className="text-red-600" />
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
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {STAT_CARDS.map(({ key, icon: Icon, iconClass, bgClass }) => {
              const val =
                key === 'users'   ? stats.users.total :
                key === 'posts'   ? stats.posts :
                key === 'reports' ? stats.reportedPosts :
                key === 'advices' ? stats.advices :
                                    stats.zones;
              const label =
                key === 'users'   ? 'Utilisateurs' :
                key === 'posts'   ? 'Publications' :
                key === 'reports' ? 'Signalements' :
                key === 'advices' ? 'Conseils' :
                                    'Zones à risque';
              const sub =
                key === 'users'   ? `${stats.users.active} actifs · ${stats.users.banned} bannis` :
                key === 'reports' ? 'publications signalées' : undefined;

              return (
                <div key={key} className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgClass}`}>
                    <Icon size={20} className={iconClass} />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-[#1a1a2e]">{val}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    {sub && <p className="text-xs text-gray-400">{sub}</p>}
                  </div>
                </div>
              );
            })}
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
                onChange={(e) => { setUserSearch(e.target.value); loadUsers(1, e.target.value); }}
                placeholder="Rechercher par nom ou email..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-left">
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Utilisateur</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Statut</th>
                    <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-px whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className={isPendingUsers ? 'opacity-50' : ''}>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-gray-50 hover:bg-gray-50/50">

                      {/* Utilisateur */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {user.profilePicture ? (
                            <img
                              src={`http://localhost:3000${user.profilePicture}`}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0 text-xs font-bold text-blue-600">
                              {user.firstName[0]}{user.lastName[0]}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-[#1a1a2e] text-sm">{user.firstName} {user.lastName}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rôle */}
                      <td className="px-5 py-3.5">
                        {user.role === 'admin'
                          ? <RoleBadge role={user.role} />
                          : <RoleSelect value={user.role} onChange={(r) => handleChangeRole(user._id, r)} />
                        }
                      </td>

                      {/* Statut */}
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                        }`}>
                          {user.isActive ? 'Actif' : 'Banni'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 w-px whitespace-nowrap">
                        {user.role !== 'admin' && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggleActive(user._id)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 hover:bg-gray-50 transition-colors ${
                                user.isActive ? 'text-red-600' : 'text-green-600'
                              }`}
                            >
                              {user.isActive ? <UserX size={12} /> : <UserCheck size={12} />}
                              {user.isActive ? 'Bannir' : 'Réactiver'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors"
                            >
                              <Trash2 size={13} className="text-red-600" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <p className="text-center py-8 text-sm text-gray-400">Aucun utilisateur trouvé</p>
              )}
            </div>

            <Pagination page={usersPage} total={usersTotal} limit={LIMIT}
              onChange={(p) => loadUsers(p, userSearch)} disabled={isPendingUsers} />
          </div>
        )}

        {/* TAB: Posts */}
        {tab === 'posts' && (
          <div className="flex flex-col gap-3">
            <div className={`flex flex-col gap-3 ${isPendingPosts ? 'opacity-50' : ''}`}>
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
                      <span className="text-xs text-gray-400">par {post.author?.firstName} {post.author?.lastName}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePost(post._id)}
                    disabled={isPendingPosts}
                    className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 disabled:opacity-40"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              ))}
              {posts.length === 0 && <p className="text-center py-8 text-sm text-gray-400">Aucune publication</p>}
            </div>
            <Pagination page={postsPage} total={postsTotal} limit={LIMIT} onChange={loadPosts} disabled={isPendingPosts} />
          </div>
        )}

        {/* TAB: Advices */}
        {tab === 'advices' && (
          <div className="flex flex-col gap-3">
            <div className={`flex flex-col gap-3 ${isPendingAdvices ? 'opacity-50' : ''}`}>
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
                      <span className="text-xs text-gray-400">par {advice.author?.firstName} {advice.author?.lastName}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteAdvice(advice._id)}
                    disabled={isPendingAdvices}
                    className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center hover:bg-red-100 transition-colors shrink-0 disabled:opacity-40"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              ))}
              {advices.length === 0 && <p className="text-center py-8 text-sm text-gray-400">Aucun conseil</p>}
            </div>
            <Pagination page={advicesPage} total={advicesTotal} limit={LIMIT} onChange={loadAdvices} disabled={isPendingAdvices} />
          </div>
        )}
      </div>
    </div>
  );
}
