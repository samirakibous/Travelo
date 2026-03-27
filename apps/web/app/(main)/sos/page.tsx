import { PhoneCall } from 'lucide-react';
import { getUser } from '../../../lib/getUser';
import { getMyContacts } from '../../../lib/sos';
import EmergencyNumbers from './EmergencyNumbers';
import LocationShare from './LocationShare';
import ContactsManager from './ContactsManager';

export default async function SosPage() {
  const user = await getUser();
  const contacts = user ? await getMyContacts() : [];

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9ff', padding: '32px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 4 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#fee2e2',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <PhoneCall size={28} color="#dc2626" />
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#1a1a2e' }}>SOS — Urgences</h1>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#6b7280' }}>
            En cas de danger, contactez immédiatement les secours locaux
          </p>
        </div>

        <EmergencyNumbers />
        <LocationShare />
        <ContactsManager initialContacts={contacts} />

      </div>
    </div>
  );
}
