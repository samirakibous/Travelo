'use client';

import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { api } from '../../../services/api';
import type { EmergencyNumbers, CountryOption } from '../../../types/sos';

const SERVICE_CONFIG = [
  { key: 'police' as const,    label: 'Police',    color: '#1a73e8', bg: '#e8f0fe' },
  { key: 'fire' as const,      label: 'Pompiers',  color: '#dc2626', bg: '#fee2e2' },
  { key: 'ambulance' as const, label: 'Ambulance', color: '#16a34a', bg: '#dcfce7' },
  { key: 'general' as const,   label: 'Urgences',  color: '#7c3aed', bg: '#ede9fe' },
];

export default function EmergencyNumbers() {
  const [numbers, setNumbers] = useState<EmergencyNumbers | null>(null);
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [selectedCode, setSelectedCode] = useState('');

  useEffect(() => {
    api.get<CountryOption[]>('/sos/countries').then(({ data }) => {
      setCountries(data);
    }).catch(() => {});
    // Auto-detect country from browser language
    const lang = navigator.language?.split('-')[1]?.toUpperCase() ?? '';
    loadNumbers(lang || 'DEFAULT');
  }, []);

  const loadNumbers = (code: string) => {
    setSelectedCode(code);
    api.get<EmergencyNumbers>('/sos/numbers', { params: { country: code } })
      .then(({ data }) => setNumbers(data))
      .catch(() => {});
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Numéros d'urgence</h2>
        <select
          value={selectedCode}
          onChange={(e) => loadNumbers(e.target.value)}
          style={{
            padding: '6px 10px', borderRadius: 8, border: '1px solid #e5e7eb',
            fontSize: 13, color: '#374151', outline: 'none', cursor: 'pointer',
          }}
        >
          <option value="DEFAULT">International (112)</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      {numbers && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {SERVICE_CONFIG.map(({ key, label, color, bg }) => {
            const num = numbers[key];
            if (!num) return null;
            return (
              <a
                key={key}
                href={`tel:${num}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px', borderRadius: 12, background: bg,
                  textDecoration: 'none', border: `1px solid ${color}22`,
                }}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Phone size={16} color="#fff" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: '#6b7280', fontWeight: 500 }}>{label}</p>
                  <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color }}>{num}</p>
                </div>
              </a>
            );
          })}
        </div>
      )}

      <p style={{ margin: '14px 0 0', fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
        Appuyez sur un numéro pour appeler directement
      </p>
    </div>
  );
}
