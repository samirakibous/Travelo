import { apiGetGuides } from '../../../services/guide.service';
import { apiGetSpecialties } from '../../../services/specialty.service';
import GuidesClient from './GuidesClient';

export default async function GuidesPage() {
  const [{ data, total }, specialties] = await Promise.all([
    apiGetGuides({ limit: 12 }),
    apiGetSpecialties(),
  ]);

  return <GuidesClient initialGuides={data} initialTotal={total} specialties={specialties} />;
}
