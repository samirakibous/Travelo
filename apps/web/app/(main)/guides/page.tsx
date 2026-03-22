import { apiGetGuides } from '../../../services/guide.service';
import GuidesClient from './GuidesClient';

export default async function GuidesPage() {
  const { data, total } = await apiGetGuides({ limit: 12 });

  return <GuidesClient initialGuides={data} initialTotal={total} />;
}
