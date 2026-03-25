import { notFound } from 'next/navigation';
import { apiGetGuide } from '../../../../services/guide.service';
import { apiGetAdvices } from '../../../../services/advice.service';
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

  const advices = await apiGetAdvices({ authorId: guide.userId._id }).catch(() => []);

  return <GuideProfileClient guide={guide} advices={advices} />;
}
