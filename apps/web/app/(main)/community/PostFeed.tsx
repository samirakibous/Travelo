'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import type { Post } from '../../../types/post';
import type { Category } from '../../../types/category';
import { useAuth } from '../../../contexts/AuthContext';

type Props = {
  initialPosts: Post[];
  initialTotal: number;
  categories: Category[];
};

export default function PostFeed({ initialPosts, initialTotal, categories }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [showModal, setShowModal] = useState(false);
  const [filtre, setFiltre] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categoriesList, setCategoriesList] = useState<Category[]>(categories);
  const {user}=useAuth();

  const handleDeleted = (id: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleCreated = (post: Post) => {
    setPosts((prev) => [post, ...prev]);
    setTotal((prev) => prev + 1);
  };
const filterdPosts = selectedCategory === "all"?posts : posts.filter(p=>p.category.name==selectedCategory &&p.author._id==user?.id)  
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Communauté</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} publication{total !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors"
        >
          <Plus size={16} />
          Publier
        </button>
        {categoriesList.map((category) => (

          <button
            key={category.name}
            onClick={() => setSelectedCategory(category.name)}
            className="text-sm text-blue-500 hover:text-blue-700"
          >
            {category.name}
          </button>
        ))}
      </div>

      {filterdPosts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="font-medium">Aucun post trouvé</p>
          <p className="text-sm mt-1">Soyez le premier à publier !</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filterdPosts.map((post) => (
            <PostCard key={post._id} post={post} onDeleted={handleDeleted} categories={categories} />
          ))}
        </div>
      )}

      {showModal && (
        <CreatePostModal onClose={() => setShowModal(false)} onCreated={handleCreated} categories={categories} />
      )}
    </div>
  );
}
