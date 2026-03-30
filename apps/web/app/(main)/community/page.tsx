import { getPosts } from '../../../lib/post';
import { getCategories } from '../../../lib/category';
import PostFeed from './PostFeed';

export default async function CommunityPage() {
  const [{ data, total }, categories] = await Promise.all([
    getPosts(),
    getCategories(),
  ]);
  return (
    <PostFeed initialPosts={data} initialTotal={total} categories={categories} />
  );
}
