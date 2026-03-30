import { notFound } from 'next/navigation';
import { getGuide } from '../../../../lib/guide';
import { getAdvices } from '../../../../lib/advice';
import { getReviews } from '../../../../lib/review';
import { getUser } from '../../../../lib/getUser';
import GuideProfileClient from './GuideProfileClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GuideProfilePage({ params }: Props) {
  const { id } = await params;

  let guide;
  try {
    guide = await getGuide(id);
  } catch {
    notFound();
  }

  const [advices, reviews, user] = await Promise.all([
    getAdvices({ authorId: guide.userId._id }).catch(() => []),
    getReviews(id).catch(() => []),
    getUser(),
  ]);

  const canReview = user?.role === 'tourist';

  return <GuideProfileClient guide={guide} advices={advices} reviews={reviews} canReview={canReview} />;
}
