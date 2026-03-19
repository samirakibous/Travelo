'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../../lib/auth';
import { Eye, EyeOff, Shield } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result = await login(
      formData.get('email') as string,
      formData.get('password') as string,
    );

    if (result.success) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setError(result.error);
    }
    setLoading(false);
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, fontSize: 18 }}>
          <Shield size={20} color="#fff" />
          Travelo
        </div>

        <div>
          <h2 style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.2, marginBottom: 16 }}>
            Welcome back<br />to Travelo.
          </h2>
          <p style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.7, marginBottom: 32 }}>
            Your safety companion is ready. Log in to access your personalized safety map, guides, and alerts.
          </p>
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

        <p style={{ fontSize: 11, opacity: 0.6 }}>© 2026 Travelo Inc. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 64px', background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Sign in to your account</h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
            Welcome back! Please enter your details.
          </p>

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
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Password</label>
                <a href="#" style={{ fontSize: 13, color: '#1a73e8', textDecoration: 'none' }}>Forgot password?</a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
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
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px 0', background: '#1a73e8', color: '#fff',
                border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                marginTop: 4,
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 13, color: '#888', marginTop: 20 }}>
            Don&apos;t have an account?{' '}
            <a href="/register" style={{ color: '#1a73e8', fontWeight: 600, textDecoration: 'none' }}>Sign up</a>
          </p>
        </div>
      </div>

    </div>
  );
}
