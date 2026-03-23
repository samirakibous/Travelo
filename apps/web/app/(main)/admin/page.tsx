import { adminGetStats, adminGetUsers, adminGetPosts, adminGetAdvices } from '../../../lib/admin';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const [stats, users, posts, advices] = await Promise.all([
    adminGetStats(),
    adminGetUsers({ page: 1, limit: 20 }),
    adminGetPosts({ page: 1, limit: 20 }),
    adminGetAdvices({ page: 1, limit: 20 }),
  ]);

  return (
    <AdminClient
      initialStats={stats}
      initialUsers={users}
      initialPosts={posts}
      initialAdvices={advices}
    />
  );
}
