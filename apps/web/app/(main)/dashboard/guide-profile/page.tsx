import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';
import { getUser } from '../../../../lib/getUser';
import { getMyGuideProfile } from '../../../../lib/guide';
import { getSpecialties } from '../../../../lib/specialty';
import GuideProfileForm from './GuideProfileForm';

export default async function GuideProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');
  if (user.role !== 'guide') redirect('/dashboard');

  const [existing, availableSpecialties] = await Promise.all([
    getMyGuideProfile(),
    getSpecialties(),
  ]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#e8f0fe] flex items-center justify-center">
          <Users size={18} color="#1a73e8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">
            {existing ? 'Mon profil guide' : 'Créer mon profil guide'}
          </h1>
          <p className="text-sm text-gray-500">
            {existing
              ? 'Mettez à jour vos informations pour attirer plus de voyageurs'
              : 'Complétez votre profil pour apparaître dans la liste des guides'}
          </p>
        </div>
      </div>

      {existing && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-100">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <p className="text-sm text-green-700 font-medium">Profil actif — visible dans la liste des guides</p>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <GuideProfileForm existing={existing} availableSpecialties={availableSpecialties} />
      </div>
    </div>
  );
}
