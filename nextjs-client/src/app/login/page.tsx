'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

const LightPillarBackground = dynamic(() => import('@/components/LightPillarBackground'), { ssr: false });

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-primary-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }
    >
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
      if (isRegister) {
        body.fullName = fullName;
        body.partnerName = partnerName;
      }

      const res = await fetch(`${expressUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'שגיאה בתהליך ההתחברות');
        return;
      }

      Cookies.set('token', data.accessToken, { expires: 1, sameSite: 'lax' });
      router.push(redirect);
      router.refresh();
    } catch {
      setError('שגיאת חיבור לשרת. ודא שהשרת פעיל.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <LightPillarBackground />

      <div className="w-full max-w-md relative z-10 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-accent-500 shadow-xl shadow-primary-200/50 mb-5">
            <span className="text-4xl">🥾</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900">מסלול טיולים אפקה</h1>
          <p className="text-slate-500 mt-2 text-lg">
            {isRegister ? 'יצירת חשבון חדש' : 'התחברות למערכת'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-strong rounded-3xl p-8 space-y-5">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">שם מלא</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="השם המלא שלך"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white/70"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  שם בן/בת זוג (אופציונלי)
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="שם בן/בת הזוג לפרויקט"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white/70"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white/70"
              required
              disabled={loading}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white/70"
              required
              minLength={6}
              disabled={loading}
              dir="ltr"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <span className="text-red-400">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-50 shadow-lg shadow-primary-200/50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                מתחבר...
              </span>
            ) : isRegister ? (
              'הרשמה'
            ) : (
              'התחברות'
            )}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
            >
              {isRegister ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
