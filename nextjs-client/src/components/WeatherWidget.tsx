'use client';

import type { WeatherForecast } from '@/lib/types';

interface WeatherWidgetProps {
  weather: WeatherForecast;
}

const weatherIconUrl = (icon: string) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

export default function WeatherWidget({ weather }: WeatherWidgetProps) {
  if (!weather || !weather.days || weather.days.length === 0) return null;

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
        <span>🌤️</span>
        תחזית מזג אוויר - {weather.location}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {weather.days.map((day, idx) => (
          <div
            key={idx}
            className="bg-gradient-to-b from-blue-50 to-white rounded-lg p-3 text-center border border-blue-100"
          >
            <p className="text-xs text-slate-500 font-medium">{day.date}</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={weatherIconUrl(day.icon)}
              alt={day.description}
              className="w-12 h-12 mx-auto"
            />
            <p className="text-sm font-semibold text-slate-800">{day.description}</p>
            <div className="flex justify-center gap-2 text-xs mt-1">
              <span className="text-red-500">{Math.round(day.temp_max)}°</span>
              <span className="text-blue-500">{Math.round(day.temp_min)}°</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              💨 {day.wind_speed} מ/ש | 💧 {day.humidity}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
