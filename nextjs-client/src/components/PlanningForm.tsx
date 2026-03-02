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
    <form onSubmit={handleSubmit} className="glass-card-strong rounded-2xl p-5 space-y-5">
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-white text-xs">
          ✨
        </div>
        תכנון מסלול חדש
      </h2>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          יעד (מדינה / עיר)
        </label>
        <input
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="לדוגמה: טוסקנה, איטליה"
          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all bg-white text-sm text-slate-800 placeholder:text-slate-400"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          סוג טיול
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setTripType('cycling');
              setDurationDays(2);
            }}
            disabled={isLoading}
            className={`p-3.5 rounded-xl border-2 transition-all duration-150 text-center ${
              tripType === 'cycling'
                ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-1">🚴</div>
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
            className={`p-3.5 rounded-xl border-2 transition-all duration-150 text-center ${
              tripType === 'trekking'
                ? 'border-slate-900 bg-slate-50 text-slate-900 shadow-sm'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'
            }`}
          >
            <div className="text-2xl mb-1">🥾</div>
            <div className="text-sm font-bold">טרק רגלי</div>
            <div className="text-xs text-slate-400 mt-0.5">5-10 ק&quot;מ למסלול</div>
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
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
            className="flex-1"
          />
          <span className="text-base font-bold text-slate-900 bg-slate-100 w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200">
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
        className="w-full py-2.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-40 disabled:cursor-not-allowed text-sm"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            מתכנן מסלול...
          </span>
        ) : (
          'צור מסלול'
        )}
      </button>
    </form>
  );
}
