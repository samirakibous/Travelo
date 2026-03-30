import { getGuides } from '../../../lib/guide';
import { getSpecialties } from '../../../lib/specialty';
import GuidesClient from './GuidesClient';

export default async function GuidesPage() {
  const [{ data, total }, specialties] = await Promise.all([
    getGuides({ limit: 12 }),
    getSpecialties(),
  ]);

  return <GuidesClient initialGuides={data} initialTotal={total} specialties={specialties} />;
}
