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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-black text-slate-800 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xl shadow-md shadow-primary-200/50">
          📋
        </div>
        היסטוריית מסלולים
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <svg className="animate-spin h-10 w-10 text-primary-500" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-slate-400 text-sm">טוען מסלולים...</p>
        </div>
      ) : routes.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-100 mb-6">
            <span className="text-5xl">📭</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">אין מסלולים שמורים</h2>
          <p className="text-slate-500 mb-6 max-w-sm mx-auto">
            עבור לדף תכנון מסלולים כדי ליצור ולשמור מסלול חדש.
          </p>
          <Link
            href="/planning"
            className="inline-block px-8 py-3 bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-lg shadow-primary-200/50 hover:-translate-y-0.5"
          >
            🗺️ תכנון מסלולים
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Route list */}
          <div className="lg:col-span-1 space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto pl-1">
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
                  className="absolute top-2 left-2 w-8 h-8 rounded-full bg-red-100 text-red-500 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center text-sm hover:bg-red-200 hover:scale-110"
                  title="מחק מסלול"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Route details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedRoute ? (
              <div className="animate-fade-in">
                <div className="glass-card rounded-2xl overflow-hidden" style={{ height: '450px' }}>
                  <MapView dailyRoutes={selectedRoute.dailyRoutes} />
                </div>

                <div className="flex items-center gap-4 flex-wrap mt-6">
                  <h2 className="text-2xl font-black text-slate-800">
                    {selectedRoute.destination}
                  </h2>
                  <span className="text-sm bg-primary-100 text-primary-700 px-3 py-1 rounded-full font-semibold border border-primary-200">
                    {selectedRoute.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק'}
                  </span>
                  <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                    {selectedRoute.durationDays} ימים | {totalDistance.toFixed(1)} ק&quot;מ
                  </span>
                </div>

                {selectedRoute.imageUrl && (
                  <div className="rounded-2xl overflow-hidden h-40 shadow-xl mt-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedRoute.imageUrl}
                      alt={selectedRoute.destination}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
                  {selectedRoute.dailyRoutes.map((day) => (
                    <div key={day.day} className="glass-card rounded-2xl p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                          {day.day}
                        </span>
                        <h3 className="font-bold text-slate-800">יום {day.day}</h3>
                      </div>
                      <p className="text-sm text-slate-600">
                        {day.startLocation} → {day.endLocation}
                      </p>
                      <p className="text-sm font-bold text-primary-700 mt-1">
                        {day.distance_km} ק&quot;מ
                      </p>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{day.description}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  {weatherLoading ? (
                    <div className="glass-card rounded-2xl p-8 text-center text-slate-500">
                      <svg className="animate-spin h-7 w-7 mx-auto mb-3 text-primary-500" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      טוען תחזית מזג אוויר...
                    </div>
                  ) : (
                    weather && <WeatherWidget weather={weather} />
                  )}
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-16 text-center animate-fade-in">
                <div className="text-6xl mb-5 animate-float-slow">👈</div>
                <p className="text-lg font-semibold text-slate-500">
                  בחר מסלול מהרשימה כדי לצפות בפרטים
                </p>
                <p className="text-sm text-slate-400 mt-2">
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
