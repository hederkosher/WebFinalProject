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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Right side - Form */}
        <div className="lg:col-span-1 space-y-5">
          <PlanningForm onSubmit={handlePlan} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2 animate-scale-in">
              <span>⚠️</span>
              {error}
            </div>
          )}

          {route && !saved && (
            <div className="glass-card-strong rounded-2xl p-5 space-y-3 animate-scale-in">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent-100 flex items-center justify-center text-xs">✓</span>
                אשר את המסלול
              </h3>
              <p className="text-sm text-slate-500">
                לאחר אישור, המסלול יישמר ויהיה זמין בהיסטוריה.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={isSaving}
                  className="flex-1 py-2.5 bg-gradient-to-l from-accent-500 to-accent-400 text-white font-bold rounded-xl hover:from-accent-600 hover:to-accent-500 transition-all disabled:opacity-50 shadow-md shadow-accent-200/50 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                >
                  {isSaving ? 'שומר...' : '✓ אשר ושמור'}
                </button>
                <button
                  onClick={() => {
                    setRoute(null);
                    setWeather(null);
                    setImageUrl('');
                  }}
                  className="py-2.5 px-5 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                >
                  ✕ בטל
                </button>
              </div>
            </div>
          )}

          {saved && (
            <div className="bg-accent-50 border border-accent-200 text-accent-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2 animate-scale-in">
              <span className="text-lg">🎉</span>
              המסלול נשמר בהצלחה! ניתן לצפות בו בהיסטוריה.
            </div>
          )}

          {weather && <WeatherWidget weather={weather} />}
        </div>

        {/* Left side - Map & Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-2xl overflow-hidden" style={{ height: '500px' }}>
            {route ? (
              <MapView dailyRoutes={route.dailyRoutes} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/50">
                <div className="text-center animate-fade-in">
                  <div className="text-7xl mb-5 animate-float-slow">🗺️</div>
                  <p className="text-lg font-semibold text-slate-500">המפה תופיע כאן לאחר תכנון מסלול</p>
                  <p className="text-sm mt-1.5 text-slate-400">מלא את הטופס ולחץ &quot;צור מסלול&quot;</p>
                </div>
              </div>
            )}
          </div>

          {route && (
            <div className="space-y-5 animate-slide-up">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-2xl font-black text-slate-800">{route.destination}</h2>
                <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold border border-primary-200">
                  {route.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}
                </span>
                <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {route.durationDays} ימים | {totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ
                </span>
              </div>

              {imageUrl && (
                <div className="rounded-2xl overflow-hidden h-48 shadow-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={route.destination} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {route.dailyRoutes.map((day) => (
                  <div key={day.day} className="glass-card rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <div className="flex items-center gap-2.5 mb-3">
                      <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {day.day}
                      </span>
                      <h3 className="font-bold text-slate-800">יום {day.day}</h3>
                    </div>
                    <div className="space-y-1.5 text-sm text-slate-600">
                      <p>
                        <span className="font-semibold text-slate-700">מ:</span> {day.startLocation}
                      </p>
                      <p>
                        <span className="font-semibold text-slate-700">עד:</span> {day.endLocation}
                      </p>
                      <p className="font-bold text-primary-700 text-base">{day.distance_km} ק&quot;מ</p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{day.description}</p>
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
