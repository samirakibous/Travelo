import { redirect } from 'next/navigation';
import { getUser } from '../../../../lib/getUser';
import { getMyGuideProfile } from '../../../../lib/guide';
import { getSpecialties } from '../../../../lib/specialty';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [guideProfile, availableSpecialties] = await Promise.all([
    user.role === 'guide' ? getMyGuideProfile() : Promise.resolve(null),
    user.role === 'guide' ? getSpecialties() : Promise.resolve([]),
  ]);

  return <ProfileClient initialUser={user} guideProfile={guideProfile} availableSpecialties={availableSpecialties} />;
}
