'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../lib/auth';
import { registerSchema } from '../../../lib/validations';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { ValidationError } from 'yup';

type FieldErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  agreed?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'tourist' | 'guide'>('tourist');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError('');

    const formData = new FormData(e.currentTarget);
    const values = {
      fullName: (formData.get('fullName') as string).trim(),
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      agreed,
    };

    try {
      await registerSchema.validate(values, { abortEarly: false });
    } catch (err) {
      if (err instanceof ValidationError) {
        const errors: FieldErrors = {};
        err.inner.forEach((e) => {
          if (e.path) errors[e.path as keyof FieldErrors] = e.message;
        });
        setFieldErrors(errors);
        return;
      }
    }

    setFieldErrors({});
    setLoading(true);

    const parts = values.fullName.split(' ');
    const firstName = parts[0];
    const lastName = parts.slice(1).join(' ') || firstName;

    const result = await register({ firstName, lastName, email: values.email, password: values.password, role });

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setServerError(result.error);
      setLoading(false);
    }
  }

  const inputCls = (hasError: boolean) =>
    `w-full px-3.5 py-3 border rounded-[10px] text-sm outline-none box-border ${hasError ? 'border-red-500' : 'border-[#e2e8f0]'}`;

  return (
    <div className="flex min-h-screen font-sans">

      {/* Left panel */}
      <div
        className="w-[42%] relative overflow-hidden flex flex-col justify-between p-10 text-white bg-cover bg-center"
        style={{ backgroundImage: 'linear-gradient(180deg, rgba(26,115,232,0.55) 0%, rgba(10,30,80,0.85) 100%), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80)' }}
      >
        <div className="flex items-center gap-2 font-bold text-lg">
          <Shield size={20} color="#fff" />
          Travelo
        </div>

        <div>
          <h2 className="text-[34px] font-extrabold leading-tight mb-4">
            Start your journey<br />with Travelo.
          </h2>
          <p className="text-sm opacity-85 leading-[1.7] mb-8">
            Join a global community of explorers and local experts. Experience the world like a local, or share your knowledge as a guide.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex">
              {['#4f9ef8', '#a78bfa', '#34d399'].map((c, i) => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-white" style={{ background: c, marginLeft: i > 0 ? -10 : 0 }} />
              ))}
            </div>
            <p className="text-[13px] opacity-90">Trusted by 50,000+ travelers worldwide</p>
          </div>
        </div>

        <p className="text-[11px] opacity-60">© 2026 Travelo Inc. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-16 py-12 bg-white">
        <div className="w-full max-w-[420px]">
          <h1 className="text-[26px] font-extrabold mb-1.5">Créer votre compte</h1>
          <p className="text-sm text-[#888] mb-7">Rejoignez Travelo et planifiez votre prochaine aventure.</p>

          {/* Role tabs */}
          <div className="flex bg-[#f1f5f9] rounded-[10px] p-1 mb-6">
            {(['tourist', 'guide'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg border-none cursor-pointer font-semibold text-sm transition-all ${
                  role === r ? 'bg-white text-[#1a73e8] shadow-sm' : 'bg-transparent text-[#888]'
                }`}
              >
                {r === 'tourist' ? 'Touriste' : 'Guide certifié'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="text-xs text-[#aaa] whitespace-nowrap tracking-widest">OU CONTINUER AVEC</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          {serverError && (
            <p className="text-red-600 text-[13px] mb-4 bg-red-50 px-3.5 py-2.5 rounded-lg">{serverError}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Nom complet</label>
              <input
                name="fullName"
                type="text"
                placeholder="Jean Dupont"
                className={inputCls(!!fieldErrors.fullName)}
              />
              {fieldErrors.fullName && <p className="text-red-500 text-xs mt-1">{fieldErrors.fullName}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Adresse email</label>
              <input
                name="email"
                type="text"
                placeholder="john@example.com"
                className={inputCls(!!fieldErrors.email)}
              />
              {fieldErrors.email && <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-semibold text-[#374151] mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className={`${inputCls(!!fieldErrors.password)} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#aaa] bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
              ) : (
                <p className="text-[11px] text-[#aaa] mt-1">8+ caractères, une majuscule, un chiffre, un caractère spécial.</p>
              )}
            </div>

            <div>
              <label className="flex items-start gap-2.5 cursor-pointer text-[13px] text-[#555]">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-[#1a73e8]"
                />
                J&apos;accepte les{' '}
                <span className="text-[#1a73e8] underline cursor-pointer">Conditions d&apos;utilisation</span>
                {' '}et la{' '}
                <span className="text-[#1a73e8] underline cursor-pointer">Politique de confidentialité</span>
              </label>
              {fieldErrors.agreed && <p className="text-red-500 text-xs mt-1">{fieldErrors.agreed}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#1a73e8] text-white border-none rounded-[10px] font-bold text-[15px] cursor-pointer hover:bg-blue-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Création en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center text-[13px] text-[#888] mt-5">
            Déjà un compte ?{' '}
            <a href="/login" className="text-[#1a73e8] font-semibold">Se connecter</a>
          </p>
        </div>
      </div>
    </div>
  );
}
