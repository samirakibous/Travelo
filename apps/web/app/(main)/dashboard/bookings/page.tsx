import { getMyBookings, getIncomingBookings } from '../../../../lib/booking';
import { getUser } from '../../../../lib/getUser';
import BookingsClient from './BookingsClient';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
  const user = await getUser();
  const isGuide = user?.role === 'guide';

  const [myBookings, incomingBookings] = await Promise.all([
    isGuide ? [] : getMyBookings(),
    isGuide ? getIncomingBookings() : [],
  ]);

  return (
    <BookingsClient
      role={user?.role ?? 'tourist'}
      myBookings={myBookings}
      incomingBookings={incomingBookings}
    />
  );
}
