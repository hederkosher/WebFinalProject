'use client';

import type { WeatherForecast } from '@/lib/types';

interface WeatherWidgetProps {
  weather: WeatherForecast;
}

const weatherIconUrl = (icon: string) =>
  icon.startsWith('//') ? `https:${icon}` : icon;

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather || !weather.days || weather.days.length === 0) return null;

  return (
    <div className="glass-card-strong rounded-xl p-4">
      <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center text-xs">
          🌤️
        </div>
        תחזית מזג אוויר — {weather.location}
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {weather.days.map((day, idx) => (
          <div
            key={idx}
            className="bg-slate-50 rounded-lg p-3 text-center border border-slate-100 hover:border-slate-200 transition-colors"
          >
            <p className="text-xs text-slate-400 font-medium mb-1">{day.date}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={weatherIconUrl(day.icon)}
              alt={day.description}
              className="w-10 h-10 mx-auto"
            />
            <p className="text-xs font-medium text-slate-700 mt-1">{day.description}</p>
            <div className="flex justify-center gap-1.5 text-xs mt-1 font-semibold">
              <span className="text-red-500">{Math.round(day.temp_max)}°</span>
              <span className="text-blue-500">{Math.round(day.temp_min)}°</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              💨 {day.wind_speed} מ/ש · 💧 {day.humidity}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
