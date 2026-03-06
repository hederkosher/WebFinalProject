'use client';

import type { TripRoute } from '@/lib/types';

interface RouteCardProps {
  route: TripRoute;
  onSelect?: (route: TripRoute) => void;
  selected?: boolean;
}

export default function RouteCard({ route, onSelect, selected }: RouteCardProps) {
  const totalDistance = route.dailyRoutes.reduce((sum, r) => sum + r.distance_km, 0);
  const isCycling = route.tripType === 'cycling';

  return (
    <button
      onClick={() => onSelect?.(route)}
      className="w-full text-right rounded-xl p-4 transition-all duration-200 relative overflow-hidden"
      style={{
        background: selected ? 'rgba(74,222,128,0.10)' : 'var(--bg-surface)',
        border: selected ? '1px solid rgba(74,222,128,0.35)' : '1px solid var(--border-subtle)',
        boxShadow: selected ? 'var(--glow-sm)' : 'var(--shadow-sm)',
      }}
      onMouseEnter={e => {
        if (!selected) {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--border-medium)';
          el.style.background = 'var(--bg-elevated)';
        }
      }}
      onMouseLeave={e => {
        if (!selected) {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = 'var(--border-subtle)';
          el.style.background = 'var(--bg-surface)';
        }
      }}
    >
      {/* Selected indicator line */}
      {selected && (
        <div
          className="absolute top-0 right-0 bottom-0 w-0.5 rounded-full"
          style={{ background: 'var(--trail)', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }}
        />
      )}

      {/* Top row */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
          style={{
            background: selected
              ? 'rgba(74,222,128,0.12)'
              : isCycling ? 'rgba(96,165,250,0.10)' : 'rgba(251,146,60,0.10)',
            color: selected
              ? 'var(--trail)'
              : isCycling ? '#93c5fd' : '#fdba74',
            border: `1px solid ${selected ? 'rgba(74,222,128,0.22)' : isCycling ? 'rgba(96,165,250,0.2)' : 'rgba(251,146,60,0.2)'}`,
          }}
        >
          {isCycling ? '🚴' : '🥾'} {isCycling ? 'אופניים' : 'טרק'}
        </span>
        {route.createdAt && (
          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            {new Date(route.createdAt).toLocaleDateString('he-IL')}
          </span>
        )}
      </div>

      {/* Destination */}
      <h3 className="text-base font-bold mb-1 truncate" style={{ color: 'var(--text-primary)' }}>
        {route.destination}
      </h3>

      {/* Metrics */}
      <div className="flex gap-4 text-xs font-mono mb-2.5" style={{ color: 'var(--text-secondary)' }}>
        <span>{route.durationDays} ימים</span>
        <span style={{ color: selected ? 'var(--trail)' : 'var(--text-secondary)' }}>
          {totalDistance.toFixed(1)} ק&quot;מ
        </span>
      </div>

      {/* Daily breakdown */}
      <div className="space-y-1">
        {route.dailyRoutes.map(day => (
          <div key={day.day} className="flex items-center gap-2 text-xs">
            <span
              className="font-black w-8 text-right shrink-0 font-mono"
              style={{ color: selected ? 'var(--trail)' : 'var(--text-muted)' }}
            >
              {String(day.day).padStart(2, '0')}
            </span>
            <span className="truncate flex-1" style={{ color: 'var(--text-secondary)' }}>
              {day.startLocation} → {day.endLocation}
            </span>
            <span className="font-semibold font-mono shrink-0" style={{ color: selected ? 'var(--trail)' : 'var(--text-secondary)' }}>
              {day.distance_km}
            </span>
          </div>
        ))}
      </div>

      {/* Destination image */}
      {route.imageUrl && (
        <div className="mt-3 rounded-lg overflow-hidden h-24" style={{ border: '1px solid var(--border-dim)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={route.imageUrl}
            alt={route.destination}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.85) saturate(0.9)' }}
          />
        </div>
      )}
    </button>
  );
}
