'use client';

import type { TripRoute } from '@/lib/types';

interface RouteCardProps {
  route: TripRoute;
  onSelect?: (route: TripRoute) => void;
  selected?: boolean;
}

export default function RouteCard({ route, onSelect, selected }: RouteCardProps) {
  const totalDistance = route.dailyRoutes.reduce((sum, r) => sum + r.distance_km, 0);
  const typeLabel = route.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק רגלי';

  return (
    <button
      onClick={() => onSelect?.(route)}
      className={`w-full text-right glass-card rounded-2xl p-4 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${
        selected
          ? 'ring-2 ring-primary-500 bg-primary-50/60 shadow-lg shadow-primary-100/50'
          : 'hover:bg-white/90'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs bg-primary-100 text-primary-700 px-2.5 py-1 rounded-full font-semibold border border-primary-200/50">
          {typeLabel}
        </span>
        {route.createdAt && (
          <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md">
            {new Date(route.createdAt).toLocaleDateString('he-IL')}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1">{route.destination}</h3>

      <div className="flex gap-4 text-sm text-slate-500 mb-3">
        <span>{route.durationDays} ימים</span>
        <span className="font-medium">{totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ</span>
      </div>

      <div className="space-y-1.5">
        {route.dailyRoutes.map((day) => (
          <div key={day.day} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-slate-700 w-12">יום {day.day}:</span>
            <span className="truncate flex-1">{day.startLocation} → {day.endLocation}</span>
            <span className="font-semibold text-primary-600">{day.distance_km} ק&quot;מ</span>
          </div>
        ))}
      </div>

      {route.imageUrl && (
        <div className="mt-3 rounded-xl overflow-hidden h-32">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={route.imageUrl}
            alt={route.destination}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </button>
  );
}
