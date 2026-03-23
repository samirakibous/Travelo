import { redirect } from 'next/navigation';
import { getUser } from '../../../lib/getUser';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  if (!user) redirect('/login');
  if (user.role !== 'admin') redirect('/dashboard');
  return <>{children}</>;
}
