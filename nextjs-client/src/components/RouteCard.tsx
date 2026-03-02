'use client';

import type { TripRoute } from '@/lib/types';

interface RouteCardProps {
  route: TripRoute;
  onSelect?: (route: TripRoute) => void;
  selected?: boolean;
}

export default function RouteCard({ route, onSelect, selected }: RouteCardProps) {
  const totalDistance = route.dailyRoutes.reduce((sum, r) => sum + r.distance_km, 0);
  const typeLabel = route.tripType === 'cycling' ? '🚴 אופניים' : '🥾 טרק';

  return (
    <button
      onClick={() => onSelect?.(route)}
      className={`w-full text-right rounded-xl p-4 transition-all duration-150 border ${
        selected
          ? 'bg-slate-900 text-white border-slate-900 shadow-md'
          : 'glass-card hover:shadow-md hover:border-slate-200'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${
          selected
            ? 'bg-white/15 text-white/90'
            : 'bg-slate-100 text-slate-600 border border-slate-200'
        }`}>
          {typeLabel}
        </span>
        {route.createdAt && (
          <span className={`text-xs ${selected ? 'text-white/50' : 'text-slate-400'}`}>
            {new Date(route.createdAt).toLocaleDateString('he-IL')}
          </span>
        )}
      </div>

      <h3 className={`text-base font-bold mb-1 ${selected ? 'text-white' : 'text-slate-800'}`}>
        {route.destination}
      </h3>

      <div className={`flex gap-3 text-xs mb-2.5 ${selected ? 'text-white/60' : 'text-slate-400'}`}>
        <span>{route.durationDays} ימים</span>
        <span>{totalDistance.toFixed(1)} ק&quot;מ</span>
      </div>

      <div className="space-y-1">
        {route.dailyRoutes.map((day) => (
          <div key={day.day} className={`flex items-center gap-2 text-xs ${selected ? 'text-white/70' : 'text-slate-500'}`}>
            <span className={`font-bold w-10 ${selected ? 'text-white/90' : 'text-slate-700'}`}>יום {day.day}:</span>
            <span className="truncate flex-1">{day.startLocation} → {day.endLocation}</span>
            <span className={`font-medium ${selected ? 'text-white/80' : 'text-primary-600'}`}>{day.distance_km} ק&quot;מ</span>
          </div>
        ))}
      </div>

      {route.imageUrl && (
        <div className="mt-2.5 rounded-lg overflow-hidden h-28">
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
