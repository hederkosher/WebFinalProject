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
      className={`w-full text-right glass-card rounded-xl p-4 transition-all hover:shadow-xl hover:-translate-y-0.5 ${
        selected ? 'ring-2 ring-primary-500 bg-primary-50/50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
          {typeLabel}
        </span>
        {route.createdAt && (
          <span className="text-xs text-slate-400">
            {new Date(route.createdAt).toLocaleDateString('he-IL')}
          </span>
        )}
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-1">{route.destination}</h3>

      <div className="flex gap-4 text-sm text-slate-600 mb-3">
        <span>{route.durationDays} ימים</span>
        <span>{totalDistance.toFixed(1)} ק&quot;מ סה&quot;כ</span>
      </div>

      <div className="space-y-1">
        {route.dailyRoutes.map((day) => (
          <div key={day.day} className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 w-12">יום {day.day}:</span>
            <span className="truncate flex-1">{day.startLocation} → {day.endLocation}</span>
            <span className="font-medium text-slate-600">{day.distance_km} ק&quot;מ</span>
          </div>
        ))}
      </div>

      {route.imageUrl && (
        <div className="mt-3 rounded-lg overflow-hidden h-32">
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
