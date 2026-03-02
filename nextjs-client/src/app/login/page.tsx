'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
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
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 mb-4">
            <span className="text-2xl">🥾</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isRegister ? 'יצירת חשבון' : 'התחברות'}
          </h1>
          <p className="text-slate-500 mt-1 text-sm">
            {isRegister ? 'הירשם כדי להתחיל לתכנן מסלולים' : 'התחבר כדי לגשת למסלולים שלך'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-6 space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">שם מלא</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="השם המלא שלך"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  שם בן/בת זוג
                  <span className="text-slate-400 font-normal mr-1">(אופציונלי)</span>
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="שם בן/בת הזוג לפרויקט"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
                  disabled={loading}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">אימייל</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
              required
              disabled={loading}
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">סיסמה</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="לפחות 6 תווים"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm"
              required
              minLength={6}
              disabled={loading}
              dir="ltr"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-sm flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isRegister ? 'נרשם...' : 'מתחבר...'}
              </span>
            ) : isRegister ? (
              'הרשמה'
            ) : (
              'התחברות'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
              className="text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              {isRegister ? 'כבר יש לך חשבון? התחבר' : 'אין לך חשבון? הירשם'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
