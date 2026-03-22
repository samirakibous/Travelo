'use client';

import { useRef, useState, useTransition } from 'react';
import { Camera, Save, Lock, User, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { updateProfile, changePassword, uploadAvatar } from '../../../../lib/user';
import GuideProfileForm from '../guide-profile/GuideProfileForm';
import type { User as UserType } from '../../../../types/auth';
import type { GuideProfile } from '../../../../types/guide';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') ?? 'http://localhost:3000';

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  return (
    <div
      className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm ${
        type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
      }`}
    >
      {type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
      {message}
    </div>
  );
}

export default function ProfileClient({ initialUser, guideProfile }: { initialUser: UserType; guideProfile: GuideProfile | null }) {
  const { user, setUser } = useAuth();
  const currentUser = user ?? initialUser;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Info form
  const [infoForm, setInfoForm] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
  });
  const [infoStatus, setInfoStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [infoLoading, startInfoTransition] = useTransition();

  // Password form
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [pwdStatus, setPwdStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [pwdLoading, startPwdTransition] = useTransition();

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startInfoTransition(async () => {
      const result = await updateProfile(infoForm);
      if (result.success) {
        setUser({ ...currentUser, ...infoForm });
        setInfoStatus({ type: 'success', message: 'Profil mis à jour' });
      } else {
        setInfoStatus({ type: 'error', message: result.error });
      }
      setTimeout(() => setInfoStatus(null), 4000);
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirm) {
      setPwdStatus({ type: 'error', message: 'Les mots de passe ne correspondent pas' });
      return;
    }
    startPwdTransition(async () => {
      const result = await changePassword({
        currentPassword: pwdForm.currentPassword,
        newPassword: pwdForm.newPassword,
      });
      if (result.success) {
        setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
        setPwdStatus({ type: 'success', message: 'Mot de passe modifié avec succès' });
      } else {
        setPwdStatus({ type: 'error', message: result.error });
      }
      setTimeout(() => setPwdStatus(null), 4000);
    });
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
    setAvatarLoading(true);
    const fd = new FormData();
    fd.append('avatar', file);
    const result = await uploadAvatar(fd);
    setAvatarLoading(false);
    if (result.success) {
      setUser({ ...currentUser, profilePicture: result.data.profilePicture });
    }
  };

  const avatarSrc = avatarPreview
    ?? (currentUser.profilePicture ? `${API_URL}${currentUser.profilePicture}` : null);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-[#1a1a2e]">Mon profil</h1>

      {/* Avatar */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-[#e8f0fe] flex items-center justify-center overflow-hidden">
            {avatarSrc ? (
              <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={32} color="#1a73e8" />
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarLoading}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#1a73e8] rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors disabled:opacity-60"
          >
            <Camera size={13} color="white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="font-semibold text-[#1a1a2e]">
            {currentUser.firstName} {currentUser.lastName}
          </p>
          <p className="text-sm text-gray-500 capitalize">{currentUser.role}</p>
          <p className="text-xs text-gray-400 mt-1">JPEG, PNG ou WebP · max 5 Mo</p>
        </div>
      </div>

      {/* Infos personnelles */}
      <form onSubmit={handleInfoSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <User size={16} color="#1a73e8" />
          <h2 className="font-bold text-[#1a1a2e]">Informations personnelles</h2>
        </div>

        {infoStatus && <Alert type={infoStatus.type} message={infoStatus.message} />}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1a1a2e]">Prénom</label>
            <input
              type="text"
              value={infoForm.firstName}
              onChange={(e) => setInfoForm({ ...infoForm, firstName: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1a1a2e]">Nom</label>
            <input
              type="text"
              value={infoForm.lastName}
              onChange={(e) => setInfoForm({ ...infoForm, lastName: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#1a1a2e]">Email</label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={infoForm.email}
              onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={infoLoading}
          className="self-end flex items-center gap-2 px-5 py-2.5 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
        >
          <Save size={15} />
          {infoLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </form>

      {/* Profil guide */}
      {currentUser.role === 'guide' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-1">
            <User size={16} color="#1a73e8" />
            <h2 className="font-bold text-[#1a1a2e]">Profil guide</h2>
          </div>
          <GuideProfileForm existing={guideProfile} />
        </div>
      )}

      {/* Mot de passe */}
      <form onSubmit={handlePasswordSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock size={16} color="#1a73e8" />
          <h2 className="font-bold text-[#1a1a2e]">Changer le mot de passe</h2>
        </div>

        {pwdStatus && <Alert type={pwdStatus.type} message={pwdStatus.message} />}

        {[
          { label: 'Mot de passe actuel', key: 'currentPassword' },
          { label: 'Nouveau mot de passe', key: 'newPassword' },
          { label: 'Confirmer le nouveau mot de passe', key: 'confirm' },
        ].map(({ label, key }) => (
          <div key={key} className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[#1a1a2e]">{label}</label>
            <input
              type="password"
              value={pwdForm[key as keyof typeof pwdForm]}
              onChange={(e) => setPwdForm({ ...pwdForm, [key]: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#1a73e8] transition-colors"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={pwdLoading}
          className="self-end flex items-center gap-2 px-5 py-2.5 bg-[#1a73e8] text-white rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors disabled:opacity-60"
        >
          <Save size={15} />
          {pwdLoading ? 'Modification...' : 'Modifier le mot de passe'}
        </button>
      </form>
    </div>
  );
}
