'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--trail)', borderTopColor: 'transparent' }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const expressUrl = process.env.NEXT_PUBLIC_EXPRESS_URL || 'http://localhost:4000';
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
      const body: Record<string, string> = { email, password };
      if (isRegister) { body.fullName = fullName; body.partnerName = partnerName; }
      const res = await fetch(`${expressUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || 'שגיאה בתהליך ההתחברות'); return; }
      Cookies.set('token', data.accessToken, { expires: 1, sameSite: 'lax' });
      router.push(redirect);
      router.refresh();
    } catch {
      setError('שגיאת חיבור לשרת. ודא שהשרת פעיל.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-subtle)',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-base)' }}>

      {/* Left panel — brand / visual */}
      <div
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
        style={{
          width: '42%',
          background: 'linear-gradient(160deg, #111f19 0%, #0b1512 60%, #0e1b16 100%)',
          borderLeft: '1px solid var(--border-subtle)',
        }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 40% 50%, rgba(74,222,128,0.07) 0%, transparent 70%)' }} />

        {/* Decorative coordinate grid lines */}
        {[20, 40, 60, 80].map(pct => (
          <div key={pct} className="absolute left-0 right-0 pointer-events-none"
            style={{ top: `${pct}%`, height: '1px', background: 'rgba(74,222,128,0.04)' }} />
        ))}
        {[25, 50, 75].map(pct => (
          <div key={pct} className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${pct}%`, width: '1px', background: 'rgba(74,222,128,0.04)' }} />
        ))}

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)' }}>
              🥾
            </div>
            <div>
              <div className="font-black text-lg" style={{ color: 'var(--text-primary)' }}>מסלול טיולים</div>
              <div className="text-xs font-mono uppercase tracking-widest" style={{ color: 'var(--trail)', opacity: 0.7 }}>AFEKA 2026</div>
            </div>
          </div>
        </div>

        {/* Centre illustration area */}
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Compass-like decorative ring */}
            <div className="relative inline-flex items-center justify-center mb-8">
              <div className="w-32 h-32 rounded-full" style={{ border: '1px solid var(--border-medium)' }} />
              <div className="absolute w-24 h-24 rounded-full" style={{ border: '1px solid var(--border-subtle)' }} />
              <div className="absolute w-16 h-16 rounded-full" style={{ border: '1px dashed rgba(74,222,128,0.12)' }} />
              <span className="absolute text-4xl" style={{ filter: 'drop-shadow(0 0 12px rgba(74,222,128,0.4))' }}>🗺️</span>
            </div>
            <h2 className="text-2xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>
              תכנן. חקור. גלה.
            </h2>
            <p className="text-sm max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              בינה מלאכותית שמתכננת עבורך מסלולי אופניים וטרק ברחבי העולם.
            </p>
          </div>
        </div>

        {/* Bottom tag */}
        <div className="relative z-10">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            מכללת אפקה להנדסה · פיתוח בפלטפורמת WEB
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm animate-fade-in">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
              style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.22)' }}>
              <span className="text-2xl">🥾</span>
            </div>
            <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>מסלול טיולים</h1>
          </div>

          <h1 className="text-2xl font-black mb-1" style={{ color: 'var(--text-primary)' }}>
            {isRegister ? 'יצירת חשבון' : 'ברוכים הבאים'}
          </h1>
          <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'הירשם כדי להתחיל לתכנן מסלולים' : 'התחבר כדי לגשת למסלולים שלך'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>שם מלא</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder="השם המלא שלך"
                    style={inputStyle}
                    required
                    disabled={loading}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = 'var(--border-strong)';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(74,222,128,0.1)';
                    }}
                    onBlur={e => {
                      (e.target as HTMLInputElement).style.borderColor = 'var(--border-subtle)';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                    style={{ color: 'var(--text-secondary)' }}>
                    שם בן/בת זוג
                    <span className="normal-case mr-1" style={{ color: 'var(--text-muted)' }}>(אופציונלי)</span>
                  </label>
                  <input
                    type="text"
                    value={partnerName}
                    onChange={e => setPartnerName(e.target.value)}
                    placeholder="שם בן/בת הזוג לפרויקט"
                    style={inputStyle}
                    disabled={loading}
                    onFocus={e => {
                      (e.target as HTMLInputElement).style.borderColor = 'var(--border-strong)';
                      (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(74,222,128,0.1)';
                    }}
                    onBlur={e => {
                      (e.target as HTMLInputElement).style.borderColor = 'var(--border-subtle)';
                      (e.target as HTMLInputElement).style.boxShadow = 'none';
                    }}
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}>אימייל</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={inputStyle}
                required
                disabled={loading}
                dir="ltr"
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--border-strong)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(74,222,128,0.1)';
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--border-subtle)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
                style={{ color: 'var(--text-secondary)' }}>סיסמה</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="לפחות 6 תווים"
                style={inputStyle}
                required
                minLength={6}
                disabled={loading}
                dir="ltr"
                onFocus={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--border-strong)';
                  (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(74,222,128,0.1)';
                }}
                onBlur={e => {
                  (e.target as HTMLInputElement).style.borderColor = 'var(--border-subtle)';
                  (e.target as HTMLInputElement).style.boxShadow = 'none';
                }}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm animate-scale-in"
                style={{ background: 'rgba(240,114,114,0.08)', border: '1px solid rgba(240,114,114,0.2)', color: 'var(--danger)' }}>
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 font-bold rounded-xl text-sm transition-all duration-200 mt-2"
              style={{
                background: loading ? 'rgba(74,222,128,0.4)' : 'var(--trail)',
                color: '#0b1512',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(74,222,128,0.3)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                    style={{ borderColor: 'rgba(11,21,18,0.5)', borderTopColor: 'transparent' }} />
                  {isRegister ? 'נרשם...' : 'מתחבר...'}
                </span>
              ) : isRegister ? 'הרשמה' : 'התחברות'}
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => { setIsRegister(!isRegister); setError(''); }}
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--text-secondary)' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--trail)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
              >
                {isRegister ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
