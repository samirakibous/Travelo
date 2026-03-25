import { adminGetStats, adminGetUsers, adminGetPosts, adminGetAdvices, adminGetReviews } from '../../../lib/admin';
import { apiGetCategories } from '../../../services/category.service';
import { apiGetSpecialties } from '../../../services/specialty.service';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const [stats, users, posts, advices, reviews, categories, specialties] = await Promise.all([
    adminGetStats(),
    adminGetUsers({ page: 1, limit: 5 }),
    adminGetPosts({ page: 1, limit: 5 }),
    adminGetAdvices({ page: 1, limit: 5 }),
    adminGetReviews({ page: 1, limit: 5 }),
    apiGetCategories(),
    apiGetSpecialties(),
  ]);

  return (
    <AdminClient
      initialStats={stats}
      initialUsers={users}
      initialPosts={posts}
      initialAdvices={advices}
      initialReviews={reviews}
      initialCategories={categories}
      initialSpecialties={specialties}
    />
  );
}
