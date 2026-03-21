'use client';

import { useState, useTransition } from 'react';
import { Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import type { Post, PostCategory } from '../../../types/post';
import { apiGetPosts } from '../../../services/post.service';

const CATEGORIES: { label: string; value: PostCategory | 'all' }[] = [
  { label: 'Tous', value: 'all' },
  { label: 'Sécurité', value: 'sécurité' },
  { label: 'Transport', value: 'transport' },
  { label: 'Arnaque', value: 'arnaque' },
  { label: 'Culture', value: 'culture' },
  { label: 'Incident', value: 'incident' },
];

type Props = {
  initialPosts: Post[];
  initialTotal: number;
};

export default function PostFeed({ initialPosts, initialTotal }: Props) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<PostCategory | 'all'>('all');
  const [sort, setSort] = useState<'recent' | 'popular'>('recent');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const fetchPosts = (params: {
    destination?: string;
    category?: PostCategory | 'all';
    sort?: 'recent' | 'popular';
    page?: number;
  }) => {
    startTransition(async () => {
      const result = await apiGetPosts({
        destination: params.destination || undefined,
        category: params.category === 'all' ? undefined : params.category,
        sort: params.sort,
        page: params.page ?? 1,
        limit: 10,
      });
      if (params.page && params.page > 1) {
        setPosts((prev) => [...prev, ...result.data]);
      } else {
        setPosts(result.data);
      }
      setTotal(result.total);
    });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
    fetchPosts({ destination: value, category, sort, page: 1 });
  };

  const handleCategory = (value: PostCategory | 'all') => {
    setCategory(value);
    setPage(1);
    fetchPosts({ destination: search, category: value, sort, page: 1 });
  };

  const handleSort = (value: 'recent' | 'popular') => {
    setSort(value);
    setPage(1);
    fetchPosts({ destination: search, category, sort: value, page: 1 });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts({ destination: search, category, sort, page: nextPage });
  };

  const handleDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
    setTotal((prev) => prev + 1);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Communauté</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} publication{total !== 1 ? 's' : ''}</p>
        </div>
        {user && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            <Plus size={16} />
            Publier
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Rechercher par destination..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => handleCategory(c.value)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c.value
                  ? 'bg-[#1a73e8] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {c.label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1 shrink-0">
            <SlidersHorizontal size={14} className="text-gray-400" />
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value as 'recent' | 'popular')}
              className="text-sm text-gray-600 bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recent">Récent</option>
              <option value="popular">Populaire</option>
            </select>
          </div>
        </div>
      </div>

      {/* Feed */}
      {isPending && posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">Chargement...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">Aucun post trouvé</p>
          <p className="text-sm mt-1">Soyez le premier à publier !</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} onDeleted={handleDeleted} />
          ))}

          {posts.length < total && (
            <button
              onClick={handleLoadMore}
              disabled={isPending}
              className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              {isPending ? 'Chargement...' : 'Voir plus'}
            </button>
          )}
        </div>
      )}

      {showModal && (
        <CreatePostModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
      )}
    </div>
  );
}
