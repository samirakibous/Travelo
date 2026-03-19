'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register } from '../../../lib/auth';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'tourist' | 'guide'>('tourist');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!agreed) return setError('Please agree to the Terms of Service.');
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const parts = (formData.get('fullName') as string).trim().split(' ');
    const firstName = parts[0] || '';
    const lastName = parts.slice(1).join(' ') || firstName;

    const result = await register({
      firstName,
      lastName,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role,
    });

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>

      {/* Left panel */}
      <div style={{
        width: '42%', position: 'relative', overflow: 'hidden',
        backgroundImage: 'linear-gradient(180deg, rgba(26,115,232,0.55) 0%, rgba(10,30,80,0.85) 100%), url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900&q=80)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '36px 40px', color: '#fff',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18 }}>
          <Shield size={20} color="#fff" />
          Travelo
        </div>

        {/* Text */}
        <div>
          <h2 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Start your journey<br />with Travelo.
          </h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.7, marginBottom: 32 }}>
            Join a global community of explorers and local experts. Experience the world like a local, or share your knowledge as a guide.
          </p>
          {/* Avatars */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex' }}>
              {['#4f9ef8', '#a78bfa', '#34d399'].map((c, i) => (
                <div key={i} style={{
                  width: 36, height: 36, borderRadius: '50%', background: c,
                  border: '2px solid #fff', marginLeft: i > 0 ? -10 : 0,
                }} />
              ))}
            </div>
            <p style={{ fontSize: 13, opacity: 0.9 }}>Trusted by 50,000+ travelers worldwide</p>
          </div>
        </div>

        {/* Footer */}
        <p style={{ fontSize: 11, opacity: 0.6 }}>© 2026 Travelo Inc. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 64px', background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Create your account</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
            Join Travelo and start planning your next adventure.
          </p>

          {/* Role tabs */}
          <div style={{
            display: 'flex', background: '#f1f5f9', borderRadius: 10,
            padding: 4, marginBottom: 24,
          }}>
            {(['tourist', 'guide'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                  background: role === r ? '#fff' : 'transparent',
                  color: role === r ? '#1a73e8' : '#888',
                  boxShadow: role === r ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                {r === 'tourist' ? 'Tourist' : 'Certified Guide'}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            <span style={{ fontSize: 12, color: '#aaa', whiteSpace: 'nowrap' }}>OR CONTINUE WITH</span>
            <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
          </div>

          {error && (
            <p style={{ color: '#e53935', fontSize: 13, marginBottom: 16, background: '#fff2f2', padding: '10px 14px', borderRadius: 8 }}>
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                placeholder="John Doe"
                required
                style={{
                  width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Email Address
              </label>
              <input
                name="email"
                type="email"
                placeholder="john@example.com"
                required
                style={{
                  width: '100%', padding: '12px 14px', border: '1px solid #e2e8f0',
                  borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  style={{
                    width: '100%', padding: '12px 44px 12px 14px', border: '1px solid #e2e8f0',
                    borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <p style={{ fontSize: 11, color: '#aaa', marginTop: 5 }}>
                Use 8 or more characters with a mix of letters, numbers & symbols.
              </p>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: 13, color: '#555' }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: '#1a73e8' }}
              />
              I agree to the{' '}
              <span style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 0', background: '#1a73e8', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
            Already have an account?{' '}
            <a href="/login" style={{ color: '#1a73e8', fontWeight: 600, textDecoration: 'none' }}>Log in</a>
          </p>
        </div>
      </div>

    </div>
  );
}
