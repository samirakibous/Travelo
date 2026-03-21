import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AuthProvider } from '../../providers/AuthProvider';
import { getUser } from '../../lib/getUser';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <AuthProvider initialUser={user}>
      <Header />
      <main>{children}</main>
      <Footer />
    </AuthProvider>
  );
}
