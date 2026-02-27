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
        <div className="lg:col-span-1 space-y-6">
          <PlanningForm onSubmit={handlePlan} isLoading={isLoading} />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {route && !saved && (
            <div className="glass-card rounded-xl p-4 space-y-3">
              <h3 className="font-bold text-slate-800">אשר את המסלול</h3>
              <p className="text-sm text-slate-600">
                לאחר אישור, המסלול יישמר ויהיה זמין בהיסטוריה.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={isSaving}
                  className="flex-1 py-2 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'שומר...' : '✓ אשר ושמור'}
                </button>
                <button
                  onClick={() => {
                    setRoute(null);
                    setWeather(null);
                    setImageUrl('');
                  }}
                  className="py-2 px-4 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all"
                >
                  ✕ בטל
                </button>
              </div>
            </div>
          )}

          {saved && (
            <div className="bg-accent-50 border border-accent-200 text-accent-700 px-4 py-3 rounded-xl text-sm font-medium">
              ✓ המסלול נשמר בהצלחה! ניתן לצפות בו בהיסטוריה.
            </div>
          )}

          {weather && <WeatherWidget weather={weather} />}
        </div>

        {/* Left side - Map & Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-xl overflow-hidden" style={{ height: '500px' }}>
            {route ? (
              <MapView dailyRoutes={route.dailyRoutes} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                <div className="text-center text-slate-400">
                  <div className="text-6xl mb-4">🗺️</div>
                  <p className="text-lg font-medium">המפה תופיע כאן לאחר תכנון מסלול</p>
                  <p className="text-sm mt-1">מלא את הטופס ולחץ &quot;צור מסלול&quot;</p>
                </div>
              </div>
            )}
          </div>

          {route && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-2xl font-bold text-slate-800">{route.destination}</h2>
                <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-medium">
                  {route.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}
                </span>
                <span className="text-sm text-slate-500">
                  {route.durationDays} ימים | {totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ
                </span>
              </div>

              {imageUrl && (
                <div className="rounded-xl overflow-hidden h-48 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imageUrl} alt={route.destination} className="w-full h-full object-cover" />
                </div>
              )}

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {route.dailyRoutes.map((day) => (
                  <div key={day.day} className="glass-card rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
                        {day.day}
                      </span>
                      <h3 className="font-bold text-slate-800">יום {day.day}</h3>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <p>
                        <span className="font-medium">מ:</span> {day.startLocation}
                      </p>
                      <p>
                        <span className="font-medium">עד:</span> {day.endLocation}
                      </p>
                      <p className="font-semibold text-primary-700">{day.distance_km} ק&quot;מ</p>
                      <p className="text-xs text-slate-500 mt-2">{day.description}</p>
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
