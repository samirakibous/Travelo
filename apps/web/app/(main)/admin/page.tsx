import { adminGetStats, adminGetUsers, adminGetPosts, adminGetAdvices } from '../../../lib/admin';
import { apiGetCategories } from '../../../services/category.service';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const [stats, users, posts, advices, categories] = await Promise.all([
    adminGetStats(),
    adminGetUsers({ page: 1, limit: 5 }),
    adminGetPosts({ page: 1, limit: 5 }),
    adminGetAdvices({ page: 1, limit: 5 }),
    apiGetCategories(),
  ]);

  return (
    <AdminClient
      initialStats={stats}
      initialUsers={users}
      initialPosts={posts}
      initialAdvices={advices}
      initialCategories={categories}
    />
  );
}
