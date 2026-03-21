import { redirect } from 'next/navigation';
import { logout } from '../../../lib/auth';
import { getUser } from '../../../lib/getUser';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen p-8 bg-[#f8f9ff]">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-[#1a1a2e]">Bienvenue, {user.firstName}</h1>
          <form
            action={async () => {
              'use server';
              await logout();
              redirect('/login');
            }}
          >
            <button
              type="submit"
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors cursor-pointer border-none"
            >
              Déconnexion
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3">
          <p className="text-sm"><span className="font-semibold text-[#374151]">Nom :</span> {user.firstName} {user.lastName}</p>
          <p className="text-sm"><span className="font-semibold text-[#374151]">Email :</span> {user.email}</p>
          <p className="text-sm"><span className="font-semibold text-[#374151]">Rôle :</span> <span className="capitalize">{user.role}</span></p>
        </div>
      </div>
    </div>
  );
}
