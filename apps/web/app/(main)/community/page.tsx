import { apiGetPosts } from '../../../services/post.service';
import { apiGetCategories } from '../../../services/category.service';
import PostFeed from './PostFeed';

export default async function CommunityPage() {
  const [{ data, total }, categories] = await Promise.all([
    apiGetPosts({ sort: 'recent', limit: 10 }),
    apiGetCategories(),
  ]);

  return <PostFeed initialPosts={data} initialTotal={total} categories={categories} />;
}
