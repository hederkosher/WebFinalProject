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
        const res = await fetch('/api/routes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setRoutes(data);
        }
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
        if (res.ok) {
          const data = await res.json();
          setWeather(data);
        }
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
        setRoutes((prev) => prev.filter((r) => r._id !== routeId));
        if (selectedRoute?._id === routeId) {
          setSelectedRoute(null);
          setWeather(null);
        }
      }
    } catch (err) {
      console.error('Failed to delete route:', err);
    }
  };

  const totalDistance =
    selectedRoute?.dailyRoutes?.reduce((sum, r) => sum + r.distance_km, 0) || 0;

  return (
    <div className="page-container py-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-sm">
          📋
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">היסטוריית מסלולים</h1>
          {!loading && routes.length > 0 && (
            <p className="text-xs text-slate-400">{routes.length} מסלולים שמורים</p>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-7 h-7 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">טוען מסלולים...</p>
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
            <span className="text-3xl opacity-60">📭</span>
          </div>
          <h2 className="text-lg font-bold text-slate-800 mb-1.5">אין מסלולים שמורים</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
            עבור לדף תכנון מסלולים כדי ליצור ולשמור מסלול חדש.
          </p>
          <Link
            href="/planning"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-semibold text-sm rounded-lg hover:bg-slate-800 transition-all"
          >
            תכנון מסלולים
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-5">
          {/* Route list */}
          <div className="lg:col-span-1 space-y-2 max-h-[calc(100vh-180px)] overflow-y-auto pl-1">
            {routes.map((route) => (
              <div key={route._id} className="relative group">
                <RouteCard
                  route={route}
                  onSelect={handleSelectRoute}
                  selected={selectedRoute?._id === route._id}
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(route._id!);
                  }}
                  className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-white/90 border border-slate-200 text-slate-400 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-xs hover:bg-red-50 hover:text-red-500 hover:border-red-200"
                  title="מחק מסלול"
                  aria-label="מחק מסלול"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Route details */}
          <div className="lg:col-span-2 space-y-5">
            {selectedRoute ? (
              <div className="animate-fade-in">
                <div className="glass-card rounded-2xl overflow-hidden" style={{ height: '420px' }}>
                  <MapView dailyRoutes={selectedRoute.dailyRoutes} />
                </div>

                <div className="flex items-center gap-3 flex-wrap mt-5">
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedRoute.destination}
                  </h2>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium border border-slate-200">
                    {selectedRoute.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedRoute.durationDays} ימים · {totalDistance.toFixed(1)} ק&quot;מ
                  </span>
                </div>

                {selectedRoute.imageUrl && (
                  <div className="rounded-xl overflow-hidden h-36 mt-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedRoute.imageUrl}
                      alt={selectedRoute.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
                  {selectedRoute.dailyRoutes.map((day) => (
                    <div key={day.day} className="glass-card rounded-xl p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                          {day.day}
                        </span>
                        <h3 className="font-bold text-slate-800 text-sm">יום {day.day}</h3>
                      </div>
                      <p className="text-xs text-slate-600">
                        {day.startLocation} → {day.endLocation}
                      </p>
                      <p className="text-sm font-bold text-primary-600 mt-1">
                        {day.distance_km} ק&quot;מ
                      </p>
                      <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{day.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  {weatherLoading ? (
                    <div className="glass-card rounded-xl p-8 text-center">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-sm text-slate-400">טוען תחזית מזג אוויר...</p>
                    </div>
                  ) : (
                    weather && <WeatherWidget weather={weather} />
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-14 text-center animate-fade-in">
                <div className="text-4xl mb-4 opacity-30">👈</div>
                <p className="text-base font-medium text-slate-400">
                  בחר מסלול מהרשימה כדי לצפות בפרטים
                </p>
                <p className="text-sm text-slate-300 mt-1">
                  כל המסלולים שאישרת מופיעים ברשימה משמאל
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
