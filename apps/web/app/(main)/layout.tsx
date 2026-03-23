import { headers } from 'next/headers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AuthProvider } from '../../providers/AuthProvider';
import { getUser } from '../../lib/getUser';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') ?? '';
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) {
    return (
      <AuthProvider initialUser={user}>
        {children}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider initialUser={user}>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}
