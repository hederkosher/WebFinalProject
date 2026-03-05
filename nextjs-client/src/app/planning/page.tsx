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
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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
            fetch(
              `/api/weather?lat=${firstWp.lat}&lng=${firstWp.lng}&location=${encodeURIComponent(data.destination)}`
            ),
            fetch(`/api/image?query=${encodeURIComponent(data.destination)}`),
          ]);

          if (weatherRes.status === 'fulfilled' && weatherRes.value.ok) {
            const weatherData = await weatherRes.value.json();
            setWeather(weatherData);
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
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-base">
          🗺️
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">תכנון מסלול</h1>
          <p className="text-xs text-slate-400">בחר יעד וסוג טיול לקבלת מסלול מותאם אישית</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Form sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <PlanningForm onSubmit={handlePlan} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2.5 rounded-lg text-sm flex items-center gap-2 animate-scale-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {error}
            </div>
          )}

          {route && !saved && (
            <div className="relative glass-card-strong rounded-2xl p-4 space-y-3 animate-scale-in overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 via-transparent to-transparent pointer-events-none" />
              <div className="relative">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-accent-500 text-white flex items-center justify-center text-xs">✓</span>
                  אשר את המסלול
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  לאחר אישור, המסלול יישמר ויהיה זמין בהיסטוריה.
                </p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={handleApprove}
                    disabled={isSaving}
                    className="flex-1 py-2.5 bg-accent-600 text-white font-semibold rounded-xl hover:bg-accent-700 transition-all disabled:opacity-50 text-sm shadow-md shadow-accent-600/20"
                  >
                    {isSaving ? 'שומר...' : 'אשר ושמור'}
                  </button>
                  <button
                    onClick={() => {
                      setRoute(null);
                      setWeather(null);
                      setImageUrl('');
                    }}
                    className="py-2.5 px-4 bg-slate-100 text-slate-600 font-medium rounded-xl hover:bg-slate-200 transition-all text-sm"
                  >
                    בטל
                  </button>
                </div>
              </div>
            </div>
          )}

          {saved && (
            <div className="bg-accent-50 border border-accent-200 text-accent-700 px-3 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 animate-scale-in">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              המסלול נשמר בהצלחה! ניתן לצפות בו בהיסטוריה.
            </div>
          )}

          {weather && <WeatherWidget weather={weather} />}
        </div>

        {/* Map & results */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card rounded-2xl overflow-hidden" style={{ height: '480px' }}>
            {route ? (
              <MapView dailyRoutes={route.dailyRoutes} />
            ) : isLoading ? (
              <div className="w-full h-full flex items-center justify-center bg-slate-50/80">
                <div className="text-center animate-fade-in">
                  <div className="relative w-14 h-14 mx-auto mb-5">
                    <div className="absolute inset-0 border-4 border-slate-200 rounded-full" />
                    <div className="absolute inset-0 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    <div className="absolute inset-2 flex items-center justify-center text-xl">🗺️</div>
                  </div>
                  <p className="text-base font-semibold text-slate-600">יוצר את המסלול שלך...</p>
                  <p className="text-sm mt-1 text-slate-400">זה יכול לקחת כמה שניות</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100/50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" style={{backgroundImage: 'radial-gradient(circle at 1px 1px, #334155 1px, transparent 0)', backgroundSize: '32px 32px'}} />
                <div className="text-center animate-fade-in relative z-10">
                  <div className="w-20 h-20 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-4xl mx-auto mb-4">
                    🗺️
                  </div>
                  <p className="text-base font-semibold text-slate-500">המפה תופיע כאן</p>
                  <p className="text-sm mt-1 text-slate-400">מלא את הטופס ולחץ &quot;צור מסלול&quot;</p>
                </div>
              </div>
            )}
          </div>

          {route && (
            <div className="space-y-4 animate-slide-up">
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-slate-900 truncate">{route.destination}</h2>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="badge-slate">
                        {route.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}
                      </span>
                      <span className="badge-blue">
                        {route.durationDays} ימים
                      </span>
                      <span className="badge-green">
                        {totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ
                      </span>
                    </div>
                  </div>
                  {imageUrl && (
                    <div className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl} alt={route.destination} className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {route.dailyRoutes.map((day) => (
                  <div key={day.day} className="glass-card rounded-xl p-4 hover:shadow-md hover:border-primary-100 transition-all duration-200 group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs group-hover:bg-primary-600 transition-colors">
                        {day.day}
                      </span>
                      <h3 className="font-bold text-slate-800 text-sm">יום {day.day}</h3>
                      <span className="mr-auto font-bold text-primary-600 text-sm">{day.distance_km} ק&quot;מ</span>
                    </div>
                    <div className="space-y-1 text-xs text-slate-500 border-t border-slate-100 pt-2.5">
                      <p><span className="font-medium text-slate-600">מ:</span> {day.startLocation}</p>
                      <p><span className="font-medium text-slate-600">עד:</span> {day.endLocation}</p>
                      <p className="text-slate-400 mt-1.5 leading-relaxed">{day.description}</p>
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
