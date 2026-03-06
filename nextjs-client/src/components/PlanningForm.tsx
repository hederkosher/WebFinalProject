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

  const minDays = 1;
  const maxDays = 3;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;
    onSubmit({ destination: destination.trim(), tripType, durationDays });
  };

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-subtle)',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.15s, box-shadow 0.15s',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-5 space-y-5"
      style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-medium)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs"
          style={{ background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.22)' }}
        >
          ✨
        </div>
        <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>תכנון מסלול חדש</h2>
      </div>

      {/* Destination input */}
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}>
          יעד (מדינה / עיר)
        </label>
        <input
          type="text"
          value={destination}
          onChange={e => setDestination(e.target.value)}
          placeholder="לדוגמה: טוסקנה, איטליה"
          style={inputStyle}
          required
          disabled={isLoading}
          onFocus={e => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-strong)';
            (e.target as HTMLInputElement).style.boxShadow = '0 0 0 3px rgba(74,222,128,0.08)';
          }}
          onBlur={e => {
            (e.target as HTMLInputElement).style.borderColor = 'var(--border-subtle)';
            (e.target as HTMLInputElement).style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Trip type toggle */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}>
          סוג טיול
        </label>
        <div className="grid grid-cols-2 gap-2">
          {([
            { value: 'cycling',  emoji: '🚴', label: 'אופניים',   sub: '30-70 ק"מ ליום' },
            { value: 'trekking', emoji: '🥾', label: 'טרק רגלי',  sub: '5-10 ק"מ למסלול' },
          ] as const).map(opt => {
            const active = tripType === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTripType(opt.value);
                  setDurationDays(opt.value === 'cycling' ? 2 : 1);
                }}
                disabled={isLoading}
                className="p-3.5 rounded-xl text-center transition-all duration-150"
                style={{
                  background: active ? 'rgba(74,222,128,0.10)' : 'var(--bg-surface)',
                  border: active ? '2px solid rgba(74,222,128,0.35)' : '2px solid var(--border-dim)',
                  boxShadow: active ? 'var(--glow-sm)' : 'none',
                }}
              >
                <div className="text-2xl mb-1">{opt.emoji}</div>
                <div className="text-sm font-bold" style={{ color: active ? 'var(--trail)' : 'var(--text-primary)' }}>{opt.label}</div>
                <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>{opt.sub}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration slider */}
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider"
          style={{ color: 'var(--text-secondary)' }}>
          {tripType === 'cycling' ? 'משך הטיול (ימים)' : 'מספר מסלולים'}
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={minDays}
            max={maxDays}
            value={durationDays}
            onChange={e => setDurationDays(Number(e.target.value))}
            disabled={isLoading}
            className="flex-1"
          />
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-base font-mono flex-shrink-0"
            style={{
              background: 'rgba(74,222,128,0.10)',
              border: '1px solid rgba(74,222,128,0.22)',
              color: 'var(--trail)',
            }}
          >
            {durationDays}
          </div>
        </div>
        <p className="text-xs mt-1.5" style={{ color: 'var(--text-muted)' }}>
          {tripType === 'cycling'
            ? `מסלול רכיבה רציף של ${durationDays} ימים מעיר לעיר`
            : `${durationDays} מסלולים מעגליים שמתחילים ומסתיימים באותה נקודה`}
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || !destination.trim()}
        className="w-full py-3 font-bold rounded-xl text-sm transition-all duration-200"
        style={{
          background: isLoading || !destination.trim() ? 'rgba(74,222,128,0.25)' : 'var(--trail)',
          color: isLoading || !destination.trim() ? 'rgba(11,21,18,0.5)' : '#0b1512',
          boxShadow: isLoading || !destination.trim() ? 'none' : '0 4px 16px rgba(74,222,128,0.3)',
          cursor: isLoading || !destination.trim() ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <div
              className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: 'rgba(11,21,18,0.4)', borderTopColor: 'transparent' }}
            />
            מתכנן מסלול...
          </span>
        ) : 'צור מסלול'}
      </button>
    </form>
  );
}
