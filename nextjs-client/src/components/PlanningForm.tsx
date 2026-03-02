'use client';

import { useState } from 'react';

interface PlanningFormProps {
  onSubmit: (data: { destination: string; tripType: 'cycling' | 'trekking'; durationDays: number }) => void;
  isLoading: boolean;
}

export default function PlanningForm({ onSubmit, isLoading }: PlanningFormProps) {
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState<'cycling' | 'trekking'>('cycling');
  const [durationDays, setDurationDays] = useState(2);

  const maxDays = tripType === 'cycling' ? 3 : 3;
  const minDays = tripType === 'cycling' ? 2 : 1;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination: destination.trim(), tripType, durationDays });
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-6 space-y-5">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white text-sm">
          ✨
        </div>
        תכנון מסלול חדש
      </h2>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          יעד (מדינה / עיר)
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="לדוגמה: טוסקנה, איטליה"
          className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-100 outline-none transition-all bg-white/70 text-slate-800 placeholder:text-slate-400"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          סוג טיול
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              setTripType('cycling');
              setDurationDays(2);
            }}
            disabled={isLoading}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
              tripType === 'cycling'
                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-100'
                : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="text-3xl mb-1.5">🚴</div>
            <div className="text-sm font-bold">אופניים</div>
            <div className="text-xs text-slate-400 mt-0.5">30-70 ק&quot;מ ליום</div>
          </button>
          <button
            type="button"
            onClick={() => {
              setTripType('trekking');
              setDurationDays(1);
            }}
            disabled={isLoading}
            className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
              tripType === 'trekking'
                ? 'border-accent-500 bg-accent-50 text-accent-700 shadow-md shadow-accent-100'
                : 'border-slate-200 bg-white/60 text-slate-600 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <div className="text-3xl mb-1.5">🥾</div>
            <div className="text-sm font-bold">טרק רגלי</div>
            <div className="text-xs text-slate-400 mt-0.5">5-10 ק&quot;מ למסלול</div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
          {tripType === 'cycling' ? 'משך הטיול (ימים)' : 'מספר מסלולים'}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={minDays}
            max={maxDays}
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            disabled={isLoading}
            className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          />
          <span className="text-lg font-black text-primary-700 bg-primary-50 w-11 h-11 flex items-center justify-center rounded-xl border border-primary-200">
            {durationDays}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1.5">
          {tripType === 'cycling'
            ? `מסלול רכיבה רציף של ${durationDays} ימים מעיר לעיר`
            : `${durationDays} מסלולים מעגליים שמתחילים ומסתיימים באותה נקודה`}
        </p>
      </div>

      <button
        type="submit"
        disabled={isLoading || !destination.trim()}
        className="w-full py-3.5 px-4 bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-200/50 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 text-base"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            מתכנן מסלול...
          </span>
        ) : (
          'צור מסלול 🗺️'
        )}
      </button>
    </form>
  );
}
