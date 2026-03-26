import { redirect } from 'next/navigation';
import Link from 'next/link';
import { UserCircle, Lightbulb, ShieldAlert, CalendarDays, MessageCircle } from 'lucide-react';
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

        <div className="bg-white rounded-xl shadow-sm p-6 space-y-3 mb-6">
          <p className="text-sm"><span className="font-semibold text-[#374151]">Nom :</span> {user.firstName} {user.lastName}</p>
          <p className="text-sm"><span className="font-semibold text-[#374151]">Email :</span> {user.email}</p>
          <p className="text-sm"><span className="font-semibold text-[#374151]">Rôle :</span> <span className="capitalize">{user.role}</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center shrink-0">
              <UserCircle size={20} color="#1a73e8" />
            </div>
            <div>
              <p className="font-semibold text-[#1a1a2e] text-sm">Mon profil</p>
              <p className="text-xs text-gray-500 mt-0.5">Modifier mes informations personnelles</p>
            </div>
          </Link>

          {(user.role === 'tourist' || user.role === 'guide') && (
            <Link
              href="/dashboard/bookings"
              className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center shrink-0">
                <CalendarDays size={20} color="#1a73e8" />
              </div>
              <div>
                <p className="font-semibold text-[#1a1a2e] text-sm">Réservations</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {user.role === 'guide' ? 'Gérer les demandes de réservation' : 'Voir mes réservations'}
                </p>
              </div>
            </Link>
          )}

          {user.role === 'guide' && (
            <Link
              href="/dashboard/advice"
              className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center shrink-0">
                <Lightbulb size={20} color="#1a73e8" />
              </div>
              <div>
                <p className="font-semibold text-[#1a1a2e] text-sm">Mes conseils</p>
                <p className="text-xs text-gray-500 mt-0.5">Publier des conseils de sécurité géolocalisés</p>
              </div>
            </Link>
          )}

          {(user.role === 'tourist' || user.role === 'guide') && (
            <Link
              href="/dashboard/messages"
              className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f0fe] flex items-center justify-center shrink-0">
                <MessageCircle size={20} color="#1a73e8" />
              </div>
              <div>
                <p className="font-semibold text-[#1a1a2e] text-sm">Messages</p>
                <p className="text-xs text-gray-500 mt-0.5">Discuter avec votre guide ou vos touristes</p>
              </div>
            </Link>
          )}

          {user.role === 'admin' && (
            <Link
              href="/admin"
              className="flex items-center gap-4 bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                <ShieldAlert size={20} color="#dc2626" />
              </div>
              <div>
                <p className="font-semibold text-[#1a1a2e] text-sm">Administration</p>
                <p className="text-xs text-gray-500 mt-0.5">Modération et gestion de la plateforme</p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
