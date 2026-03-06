'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import RouteCard from '@/components/RouteCard';
import WeatherWidget from '@/components/WeatherWidget';
import type { TripRoute, WeatherForecast } from '@/lib/types';
import Cookies from 'js-cookie';
import Link from 'next/link';

const MapView = dynamic(() => import('@/components/MapView'), { ssr: false });

export default function HistoryPage() {
  const [routes, setRoutes] = useState<TripRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<TripRoute | null>(null);
  const [weather, setWeather] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const token = Cookies.get('token');
        const res = await fetch('/api/routes', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) setRoutes(await res.json());
      } catch (err) {
        console.error('Failed to fetch routes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleSelectRoute = useCallback(async (route: TripRoute) => {
    setSelectedRoute(route);
    setWeather(null);
    if (route.dailyRoutes?.[0]?.waypoints?.[0]) {
      setWeatherLoading(true);
      try {
        const firstWp = route.dailyRoutes[0].waypoints[0];
        const res = await fetch(
          `/api/weather?lat=${firstWp.lat}&lng=${firstWp.lng}&location=${encodeURIComponent(route.destination)}`
        );
        if (res.ok) setWeather(await res.json());
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      } finally {
        setWeatherLoading(false);
      }
    }
  }, []);

  const handleDelete = async (routeId: string) => {
    if (!confirm('האם למחוק את המסלול?')) return;
    try {
      const token = Cookies.get('token');
      const res = await fetch(`/api/routes?id=${routeId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setRoutes(prev => prev.filter(r => r._id !== routeId));
        if (selectedRoute?._id === routeId) { setSelectedRoute(null); setWeather(null); }
      }
    } catch (err) {
      console.error('Failed to delete route:', err);
    }
  };

  const totalDistance = selectedRoute?.dailyRoutes?.reduce((sum, r) => sum + r.distance_km, 0) || 0;

  return (
    <div className="page-container py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
          style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.20)' }}
        >
          📋
        </div>
        <div>
          <h1 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>היסטוריית מסלולים</h1>
          {!loading && routes.length > 0 && (
            <p className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
              {routes.length} מסלולים שמורים
            </p>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4 animate-fade-in">
          <div className="relative w-14 h-14">
            <div
              className="absolute inset-0 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'var(--border-medium)', borderTopColor: 'var(--trail)' }}
            />
            <div className="absolute inset-2 flex items-center justify-center text-xl">📋</div>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>טוען מסלולים...</p>
        </div>

      ) : routes.length === 0 ? (
        /* Empty state */
        <div className="text-center py-28 animate-fade-in">
          <div
            className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-6"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
          >
            <span className="text-4xl">🗺️</span>
          </div>
          <h2 className="text-xl font-black mb-2" style={{ color: 'var(--text-primary)' }}>אין מסלולים שמורים</h2>
          <p className="text-sm mb-8 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            עבור לדף תכנון מסלולים כדי ליצור ולשמור את המסלול הראשון שלך.
          </p>
          <Link href="/planning" className="btn-primary">
            תכנון מסלולים
            <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Route list */}
          <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pl-1">
            {routes.map(route => (
              <div key={route._id} className="relative group">
                <RouteCard
                  route={route}
                  onSelect={handleSelectRoute}
                  selected={selectedRoute?._id === route._id}
                />
                {/* Delete button */}
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(route._id!); }}
                  className="absolute top-2 left-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  title="מחק מסלול"
                  aria-label="מחק מסלול"
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(240,114,114,0.1)';
                    el.style.color = 'var(--danger)';
                    el.style.borderColor = 'rgba(240,114,114,0.3)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--bg-elevated)';
                    el.style.color = 'var(--text-muted)';
                    el.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Route detail */}
          <div className="lg:col-span-2 space-y-5">
            {selectedRoute ? (
              <div className="animate-fade-in">
                {/* Map */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ height: '420px', border: '1px solid var(--border-subtle)' }}
                >
                  <MapView dailyRoutes={selectedRoute.dailyRoutes} />
                </div>

                {/* Summary */}
                <div
                  className="rounded-2xl p-4 mt-5"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-black truncate" style={{ color: 'var(--text-primary)' }}>
                        {selectedRoute.destination}
                      </h2>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className="badge-slate">{selectedRoute.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}</span>
                        <span className="badge-blue">{selectedRoute.durationDays} ימים</span>
                        <span className="badge-green">{totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ</span>
                      </div>
                    </div>
                    {selectedRoute.imageUrl && (
                      <div
                        className="w-20 h-16 rounded-xl overflow-hidden flex-shrink-0"
                        style={{ border: '1px solid var(--border-subtle)' }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selectedRoute.imageUrl} alt={selectedRoute.destination}
                          className="w-full h-full object-cover"
                          style={{ filter: 'brightness(0.85) saturate(0.85)' }} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Daily cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {selectedRoute.dailyRoutes.map(day => (
                    <div
                      key={day.day}
                      className="rounded-xl p-4 transition-all duration-200"
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
                          className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs font-mono"
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

                {/* Weather */}
                <div className="mt-4">
                  {weatherLoading ? (
                    <div
                      className="rounded-xl p-8 text-center"
                      style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                    >
                      <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                        style={{ borderColor: 'var(--border-medium)', borderTopColor: 'var(--trail)' }} />
                      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>טוען תחזית מזג אוויר...</p>
                    </div>
                  ) : weather && <WeatherWidget weather={weather} />}
                </div>
              </div>
            ) : (
              /* No selection */
              <div
                className="rounded-2xl p-14 text-center animate-fade-in relative overflow-hidden"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="absolute inset-0 dot-pattern opacity-30 pointer-events-none" />
                <div className="relative z-10">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
                    style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                  >
                    🗺️
                  </div>
                  <p className="text-base font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    בחר מסלול לצפייה
                  </p>
                  <p className="text-sm mt-1.5 max-w-xs mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    לחץ על אחד מהמסלולים ברשימה כדי לצפות בו על המפה
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
