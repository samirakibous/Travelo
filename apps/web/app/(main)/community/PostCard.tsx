'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag, Trash2, MapPin, Pencil, User, Play } from 'lucide-react';

const STATIC_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';
import { votePost, deletePost, reportPost } from '../../../lib/post';
import CreatePostModal from './CreatePostModal';
import PostComments from './PostComments';
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

  const categoryColor = post.category?.color ?? '#6b7280';

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
          {post.category?.name}
        </span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-bold text-[#1a1a2e] mb-1">{currentPost.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-3">{currentPost.description}</p>
      </div>

      {/* Media */}
      {currentPost.mediaUrls?.length > 0 && (
        <div className={`grid gap-1.5 ${currentPost.mediaUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {currentPost.mediaUrls.map((url, i) => {
            const fullUrl = `${STATIC_URL}${url}`;
            const isVideo = url.match(/\.(mp4|webm|mov)$/i);
            return isVideo ? (
              <div key={i} className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video src={fullUrl} className="w-full h-full object-cover" controls muted />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                    <Play size={18} color="white" fill="white" />
                  </div>
                </div>
              </div>
            ) : (
              <img
                key={i}
                src={fullUrl}
                alt=""
                className="w-full rounded-xl object-cover"
                style={{ maxHeight: currentPost.mediaUrls.length === 1 ? 320 : 160 }}
              />
            );
          })}
        </div>
      )}

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

      {/* Comments */}
      <PostComments postId={post._id} initialCount={0} />

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
