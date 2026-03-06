'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import PlanningForm from '@/components/PlanningForm';
import WeatherWidget from '@/components/WeatherWidget';
import type { TripRoute, WeatherForecast } from '@/lib/types';
import Cookies from 'js-cookie';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function PlanningPage() {
  const [route, setRoute] = useState<TripRoute | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const handlePlan = useCallback(
    async (data: { destination: string; tripType: 'cycling' | 'trekking'; durationDays: number }) => {
      setIsLoading(true);
      setError('');
      setRoute(null);
      setWeather(null);
      setImageUrl('');
      setSaved(false);

      try {
        const token = Cookies.get('token');
        const genRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(data),
        });
        if (!genRes.ok) {
          const errData = await genRes.json().catch(() => ({}));
          throw new Error(errData.message || 'שגיאה ביצירת המסלול');
        }
        const generatedRoute: TripRoute = await genRes.json();
        setRoute(generatedRoute);

        if (generatedRoute.dailyRoutes?.[0]?.waypoints?.[0]) {
          const firstWp = generatedRoute.dailyRoutes[0].waypoints[0];
          const [weatherRes, imageRes] = await Promise.allSettled([
            fetch(`/api/weather?lat=${firstWp.lat}&lng=${firstWp.lng}&location=${encodeURIComponent(data.destination)}`),
            fetch(`/api/image?query=${encodeURIComponent(data.destination)}`),
          ]);
          if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
            setWeather(await weatherRes.value.json());
          }
          if (imageRes.status === 'fulfilled' && imageRes.value.ok) {
            const imageData = await imageRes.value.json();
            setImageUrl(imageData.url || '');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'שגיאה לא צפויה');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleApprove = async () => {
    if (!route) return;
    setIsSaving(true);
    try {
      const token = Cookies.get('token');
      const res = await fetch('/api/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...route, imageUrl }),
      });
      if (!res.ok) throw new Error('שגיאה בשמירת המסלול');
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'שגיאה בשמירה');
    } finally {
      setIsSaving(false);
    }
  };

  const totalDistance = route?.dailyRoutes?.reduce((sum, r) => sum + r.distance_km, 0) || 0;

  return (
    <div className="page-container py-8">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
          style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.22)' }}
        >
          🗺️
        </div>
        <div>
          <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>תכנון מסלול</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>בחר יעד וסוג טיול לקבלת מסלול מותאם אישית</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <PlanningForm onSubmit={handlePlan} isLoading={isLoading} />

          {error && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm animate-scale-in"
              style={{ background: 'rgba(240,114,114,0.08)', border: '1px solid rgba(240,114,114,0.2)', color: 'var(--danger)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          )}

          {route && !saved && (
            <div
              className="rounded-2xl p-4 space-y-3 animate-scale-in"
              style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(74,222,128,0.25)', boxShadow: 'var(--glow-sm)' }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--trail)', color: '#0b1512' }}
                >✓</span>
                <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>אשר את המסלול</h3>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                לאחר אישור, המסלול יישמר ויהיה זמין בהיסטוריה.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleApprove}
                  disabled={isSaving}
                  className="flex-1 py-2.5 font-bold rounded-xl text-sm transition-all duration-200"
                  style={{
                    background: isSaving ? 'rgba(74,222,128,0.3)' : 'var(--trail)',
                    color: '#0b1512',
                    boxShadow: isSaving ? 'none' : '0 4px 14px rgba(74,222,128,0.3)',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                  }}
                >
                  {isSaving ? 'שומר...' : 'אשר ושמור'}
                </button>
                <button
                  onClick={() => { setRoute(null); setWeather(null); setImageUrl(''); }}
                  className="py-2.5 px-4 font-medium rounded-xl text-sm transition-all duration-150"
                  style={{
                    background: 'transparent',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  בטל
                </button>
              </div>
            </div>
          )}

          {saved && (
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium animate-scale-in"
              style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--trail)' }}
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              המסלול נשמר בהצלחה! ניתן לצפות בו בהיסטוריה.
            </div>
          )}

          {weather && <WeatherWidget weather={weather} />}
        </div>

        {/* Map + Results */}
        <div className="lg:col-span-2 space-y-5">
          {/* Map panel */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              height: '480px',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface)',
            }}
          >
            {route ? (
              <MapView dailyRoutes={route.dailyRoutes} />
            ) : isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center animate-fade-in">
                  <div className="relative w-14 h-14 mx-auto mb-5">
                    <div className="absolute inset-0 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: 'var(--border-medium)', borderTopColor: 'var(--trail)' }} />
                    <div className="absolute inset-2 flex items-center justify-center text-xl">🗺️</div>
                  </div>
                  <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>יוצר את המסלול שלך...</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>זה יכול לקחת כמה שניות</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />
                <div className="text-center animate-fade-in relative z-10">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                  >
                    🗺️
                  </div>
                  <p className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>המפה תופיע כאן</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>מלא את הטופס ולחץ &quot;צור מסלול&quot;</p>
                </div>
              </div>
            )}
          </div>

          {/* Route details */}
          {route && (
            <div className="space-y-4 animate-slide-up">
              {/* Summary card */}
              <div
                className="rounded-2xl p-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-black truncate" style={{ color: 'var(--text-primary)' }}>{route.destination}</h2>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="badge-slate">{route.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}</span>
                      <span className="badge-blue">{route.durationDays} ימים</span>
                      <span className="badge-green">{totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ</span>
                    </div>
                  </div>
                  {imageUrl && (
                    <div
                      className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ border: '1px solid var(--border-subtle)' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt={route.destination} className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.85) saturate(0.85)' }} />
                    </div>
                  )}
                </div>
              </div>

              {/* Daily cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {route.dailyRoutes.map(day => (
                  <div
                    key={day.day}
                    className="rounded-xl p-4 transition-all duration-200 group"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--border-medium)';
                      el.style.boxShadow = 'var(--glow-sm)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = 'var(--border-dim)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-mono transition-colors"
                        style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.2)', color: 'var(--trail)' }}
                      >
                        {String(day.day).padStart(2, '0')}
                      </span>
                      <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>יום {day.day}</h3>
                      <span className="mr-auto font-black text-sm font-mono" style={{ color: 'var(--trail)' }}>
                        {day.distance_km} ק&quot;מ
                      </span>
                    </div>
                    <div
                      className="space-y-1 text-xs pt-2.5"
                      style={{ borderTop: '1px solid var(--border-dim)', color: 'var(--text-secondary)' }}
                    >
                      <p><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>מ:</span> {day.startLocation}</p>
                      <p><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>עד:</span> {day.endLocation}</p>
                      <p className="leading-relaxed mt-1.5" style={{ color: 'var(--text-muted)' }}>{day.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
