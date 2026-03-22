import { redirect } from 'next/navigation';
import { getUser } from '../../../../lib/getUser';
import { getMyGuideProfile } from '../../../../lib/guide';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const user = await getUser();
  if (!user) redirect('/login');

  const guideProfile = user.role === 'guide' ? await getMyGuideProfile() : null;

  return <ProfileClient initialUser={user} guideProfile={guideProfile} />;
}
