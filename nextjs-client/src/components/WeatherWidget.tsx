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
    <div className="glass-card-strong rounded-2xl p-5">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white text-sm shadow-sm">
          🌤️
        </div>
        תחזית מזג אוויר - {weather.location}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {weather.days.map((day, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-blue-50/80 to-white rounded-xl p-3.5 text-center border border-blue-100/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <p className="text-xs text-slate-500 font-semibold mb-1">{day.date}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={weatherIconUrl(day.icon)}
              alt={day.description}
              className="w-14 h-14 mx-auto"
            />
            <p className="text-sm font-bold text-slate-800 mt-1">{day.description}</p>
            <div className="flex justify-center gap-2 text-sm mt-1.5 font-semibold">
              <span className="text-red-500">{Math.round(day.temp_max)}°</span>
              <span className="text-blue-500">{Math.round(day.temp_min)}°</span>
            </div>
            <div className="text-xs text-slate-400 mt-1.5">
              💨 {day.wind_speed} מ/ש | 💧 {day.humidity}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
