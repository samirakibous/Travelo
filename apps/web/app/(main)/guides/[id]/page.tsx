import { notFound } from 'next/navigation';
import { apiGetGuide } from '../../../../services/guide.service';
import { apiGetAdvices } from '../../../../services/advice.service';
import { apiGetReviews } from '../../../../services/review.service';
import { getUser } from '../../../../lib/getUser';
import GuideProfileClient from './GuideProfileClient';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GuideProfilePage({ params }: Props) {
  const { id } = await params;

  let guide;
  try {
    guide = await apiGetGuide(id);
  } catch {
    notFound();
  }

  const [advices, reviews, user] = await Promise.all([
    apiGetAdvices({ authorId: guide.userId._id }).catch(() => []),
    apiGetReviews(id).catch(() => []),
    getUser(),
  ]);

  const canReview = user?.role === 'tourist';

  return <GuideProfileClient guide={guide} advices={advices} reviews={reviews} canReview={canReview} />;
}
