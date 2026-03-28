'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import type { Post } from '../../../types/post';
import type { Category } from '../../../types/category';
import { apiGetPosts } from '../../../services/post.service';

type Props = {
  initialPosts: Post[];
  initialTotal: number;
  categories: Category[];
};

export default function PostFeed({ initialPosts, initialTotal, categories }: Props) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [showModal, setShowModal] = useState(false);
  const [category, setCategory] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();

  const fetchPosts = (params: {
    category?: string;
    page?: number;
  }) => {
    startTransition(async () => {
      const result = await apiGetPosts({
        category: params.category === 'all' ? undefined : params.category,
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


  const handleCategory = (value: string) => {
    setCategory(value);
    setPage(1);
    fetchPosts({ category: value, page: 1 });
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts({ category, page: nextPage });
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
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => handleCategory('all')}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              category === 'all' ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => handleCategory(c._id)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                category === c._id ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={category === c._id ? { background: c.color } : {}}
            >
              {c.name}
            </button>
          ))}

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
            <PostCard key={post._id} post={post} onDeleted={handleDeleted} categories={categories} />
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
        <CreatePostModal onClose={() => setShowModal(false)} onCreated={handleCreated} categories={categories} />
      )}
    </div>
  );
}
