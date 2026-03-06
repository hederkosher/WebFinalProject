'use client';

import type { WeatherForecast } from '@/lib/types';

interface WeatherWidgetProps {
  weather: WeatherForecast;
}

const weatherIconUrl = (icon: string) =>
  icon.startsWith('//') ? `https:${icon}` : icon;

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather?.days?.length) return null;

  return (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-xs"
          style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.2)' }}
        >
          🌤️
        </div>
        <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          תחזית מזג אוויר
        </h3>
        <span className="text-xs mr-auto font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
          {weather.location}
        </span>
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-3 gap-2">
        {weather.days.map((day, idx) => (
          <div
            key={idx}
            className="rounded-lg p-3 text-center transition-all duration-150"
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-dim)',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--border-subtle)';
              el.style.background = 'rgba(96,165,250,0.05)';
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement;
              el.style.borderColor = 'var(--border-dim)';
              el.style.background = 'var(--bg-surface)';
            }}
          >
            <p className="text-[10px] font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              {day.date}
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={weatherIconUrl(day.icon)}
              alt={day.description}
              className="w-9 h-9 mx-auto"
              style={{ filter: 'brightness(1.1) saturate(0.9)' }}
            />
            <p className="text-[11px] font-medium mt-1 leading-tight" style={{ color: 'var(--text-secondary)' }}>
              {day.description}
            </p>
            <div className="flex justify-center gap-1.5 text-sm mt-1.5 font-black font-mono">
              <span style={{ color: '#f87171' }}>{Math.round(day.temp_max)}°</span>
              <span style={{ color: 'var(--text-muted)' }}>/</span>
              <span style={{ color: '#60a5fa' }}>{Math.round(day.temp_min)}°</span>
            </div>
            <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              💨 {day.wind_speed} · 💧 {day.humidity}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
