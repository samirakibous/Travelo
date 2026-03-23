'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, Trash2, MapPin, Pencil, User } from 'lucide-react';
import { votePost, deletePost, reportPost } from '../../../lib/post';
import CreatePostModal from './CreatePostModal';
import { useAuth } from '../../../contexts/AuthContext';
import type { Post } from '../../../types/post';
import type { Category } from '../../../types/category';


function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

type Props = {
  post: Post;
  onDeleted: (id: string) => void;
  categories: Category[];
};

export default function PostCard({ post, onDeleted, categories }: Props) {
  const { user } = useAuth();
  const [upvotes, setUpvotes] = useState(post.upvotes.length);
  const [downvotes, setDownvotes] = useState(post.downvotes.length);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(() => {
    if (!user) return null;
    if (post.upvotes.includes(user.id)) return 'up';
    if (post.downvotes.includes(user.id)) return 'down';
    return null;
  });
  const [reported, setReported] = useState(
    user ? post.reports.some((r) => r.user === user.id) : false,
  );
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(post);

  const isAuthor = user?.id === post.author._id;
  const isAdmin = user?.role === 'admin';

  const handleVote = async (type: 'up' | 'down') => {
    if (!user || loading) return;
    setLoading(true);
    const result = await votePost(post._id, type);
    if (result.success) {
      setUpvotes(result.data.upvotes);
      setDownvotes(result.data.downvotes);
      setUserVote(result.data.userVote);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Supprimer ce post ?')) return;
    const result = await deletePost(post._id);
    if (result.success) onDeleted(post._id);
  };

  const handleReport = async () => {
    if (!user || reported) return;
    const reason = prompt('Raison du signalement :');
    if (!reason?.trim()) return;
    const result = await reportPost(post._id, reason.trim());
    if (result.success) setReported(true);
  };

  const categoryColor = categories.find((c) => c.slug === post.category)?.color ?? '#6b7280';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-[#e8f0fe] flex items-center justify-center">
            <User size={16} color="#1a73e8" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1a1a2e]">
              {post.author.firstName} {post.author.lastName}
            </p>
            <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: `${categoryColor}18`, color: categoryColor }}
        >
          {post.category}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-bold text-[#1a1a2e] mb-1">{currentPost.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{currentPost.description}</p>
      </div>

      {/* Destination */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <MapPin size={12} />
        <span>{currentPost.destination}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleVote('up')}
            disabled={!user || loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              userVote === 'up'
                ? 'bg-green-100 text-green-700'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ThumbsUp size={14} />
            {upvotes}
          </button>
          <button
            onClick={() => handleVote('down')}
            disabled={!user || loading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              userVote === 'down'
                ? 'bg-red-100 text-red-600'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            <ThumbsDown size={14} />
            {downvotes}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {user && !isAuthor && (
            <button
              onClick={handleReport}
              disabled={reported}
              className={`p-1.5 rounded-lg transition-colors ${
                reported ? 'text-orange-400' : 'text-gray-400 hover:text-orange-400 hover:bg-orange-50'
              }`}
              title={reported ? 'Déjà signalé' : 'Signaler'}
            >
              <Flag size={14} />
            </button>
          )}
          {isAuthor && (
            <button
              onClick={() => setShowEditModal(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
              title="Modifier"
            >
              <Pencil size={14} />
            </button>
          )}
          {(isAuthor || isAdmin) && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {showEditModal && (
        <CreatePostModal
          editPost={currentPost}
          onClose={() => setShowEditModal(false)}
          onCreated={(updated) => setCurrentPost(updated)}
          categories={categories}
        />
      )}
    </div>
  );
}
