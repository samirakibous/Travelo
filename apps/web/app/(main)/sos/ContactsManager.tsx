'use client';

import { useState } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';
import { createContact, deleteContact } from '../../../lib/sos';
import { useAuth } from '../../../contexts/AuthContext';
import type { EmergencyContact } from '../../../types/sos';

type Props = {
  initialContacts: EmergencyContact[];
};

export default function ContactsManager({ initialContacts }: Props) {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', relationship: '' });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24, textAlign: 'center' }}>
        <Users size={32} color="#d1d5db" style={{ marginBottom: 12 }} />
        <p style={{ margin: 0, fontSize: 14, color: '#6b7280' }}>
          Connectez-vous pour gérer vos contacts d'urgence
        </p>
      </div>
    );
  }

  const handleAdd = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      setError('Nom et téléphone requis');
      return;
    }
    setPending(true);
    setError('');
    const result = await createContact({
      name: form.name,
      phone: form.phone,
      relationship: form.relationship || undefined,
    });
    setPending(false);
    if (result.success) {
      setContacts((prev) => [...prev, result.data]);
      setForm({ name: '', phone: '', relationship: '' });
      setShowForm(false);
    } else {
      setError(result.error);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteContact(id);
    if (result.success) {
      setContacts((prev) => prev.filter((c) => c._id !== id));
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8eaed', padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={18} color="#1a73e8" />
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1a1a2e' }}>Contacts d'urgence</h2>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 14px', borderRadius: 8,
            background: showForm ? '#f3f4f6' : '#1a73e8',
            color: showForm ? '#374151' : '#fff',
            border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500,
          }}
        >
          <Plus size={14} />
          Ajouter
        </button>
      </div>

      {showForm && (
        <div style={{ background: '#f8f9ff', borderRadius: 10, padding: 16, marginBottom: 16, border: '1px solid #e8eaed' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input
              placeholder="Nom complet *"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
            />
            <input
              placeholder="Numéro de téléphone *"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              type="tel"
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
            />
            <input
              placeholder="Relation (famille, ami, ambassade...)"
              value={form.relationship}
              onChange={(e) => setForm({ ...form, relationship: e.target.value })}
              style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13, outline: 'none' }}
            />
            {error && <p style={{ margin: 0, fontSize: 12, color: '#dc2626' }}>{error}</p>}
            <button
              onClick={handleAdd}
              disabled={pending}
              style={{
                padding: '9px 0', borderRadius: 8, border: 'none',
                background: pending ? '#9db8e8' : '#1a73e8', color: '#fff',
                fontWeight: 600, fontSize: 13, cursor: pending ? 'default' : 'pointer',
              }}
            >
              {pending ? 'Ajout...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      )}

      {contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af' }}>
          <p style={{ margin: 0, fontSize: 13 }}>Aucun contact d'urgence enregistré</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {contacts.map((c) => (
            <div key={c._id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10, background: '#f8f9fa',
              border: '1px solid #e8eaed',
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', background: '#fee2e2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Users size={16} color="#dc2626" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1a1a2e' }}>{c.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: '#6b7280' }}>
                  <a href={`tel:${c.phone}`} style={{ color: '#1a73e8', textDecoration: 'none' }}>{c.phone}</a>
                  {c.relationship && ` · ${c.relationship}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(c._id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
