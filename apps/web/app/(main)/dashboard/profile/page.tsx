import { redirect } from 'next/navigation';
import { getUser } from '../../../../lib/getUser';
import { getMyGuideProfile } from '../../../../lib/guide';
import { apiGetSpecialties } from '../../../../services/specialty.service';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const [guideProfile, availableSpecialties] = await Promise.all([
    user.role === 'guide' ? getMyGuideProfile() : Promise.resolve(null),
    user.role === 'guide' ? apiGetSpecialties() : Promise.resolve([]),
  ]);

  return <ProfileClient initialUser={user} guideProfile={guideProfile} availableSpecialties={availableSpecialties} />;
}
