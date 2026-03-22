import { apiGetPosts } from '../../../services/post.service';
import PostFeed from './PostFeed';

export default async function CommunityPage() {
  const { data, total } = await apiGetPosts({ sort: 'recent', limit: 10 });

  return <PostFeed initialPosts={data} initialTotal={total} />;
}
