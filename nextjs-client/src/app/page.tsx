'use client';

import Link from 'next/link';
import RotatingText from '@/components/RotatingText';

export default function HomePage() {
  return (
    <div className="relative">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden min-h-[92vh] flex items-center">
        {/* Layered background */}
        <div className="absolute inset-0 grid-pattern opacity-60 pointer-events-none" />
        <div className="absolute inset-0 topo-gradient pointer-events-none" />
        {/* Horizon glow line */}
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: '55%',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(74,222,128,0.15) 30%, rgba(74,222,128,0.25) 50%, rgba(74,222,128,0.15) 70%, transparent)',
          }}
        />

        <div className="page-container w-full py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center relative">
            {/* Dark scrim so the green light pillar can't wash out text */}
            <div
              className="absolute -inset-x-8 -inset-y-12 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 90% at 50% 50%, rgba(11,21,18,0.6) 0%, transparent 100%)' }}
            />

            {/* All hero content above the scrim */}
            <div className="relative z-10">

            {/* Badge */}
            <div className="animate-fade-in inline-flex items-center gap-2 mb-10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest"
              style={{
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.18)',
                color: 'var(--trail)',
              }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: 'var(--trail)' }} />
              פרויקט סיום — אפקה 2026
            </div>

            {/* Headline */}
            <h1 className="animate-slide-up text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-6"
              style={{ color: 'var(--text-primary)' }}>
              תכנן את
              <br />
              <span className="text-gradient">המסע הבא</span>
              <br />
              שלך
            </h1>

            {/* Rotating text row */}
            <div className="animate-slide-up stagger-2 flex items-center justify-center gap-3 mb-6">
              <span className="text-lg sm:text-xl font-medium" style={{ color: 'var(--text-primary)' }}>עם</span>
              <RotatingText
                texts={['מסלולי אופניים', 'מסלולי טרק', 'מפות חכמות', 'תחזית מזג אוויר', 'בינה מלאכותית']}
                mainClassName="px-4 py-1.5 rounded-xl text-lg sm:text-xl font-black overflow-hidden justify-center"
                staggerFrom="first"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2500}
                style={{
                  background: 'rgba(74,222,128,0.12)',
                  border: '1px solid rgba(74,222,128,0.25)',
                  color: 'var(--trail)',
                }}
              />
            </div>

            {/* Subtitle */}
            <p className="animate-slide-up stagger-3 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12"
              style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
              בחר יעד, סוג טיול ומשך — המערכת תיצור עבורך מסלול מותאם אישית
              עם מפות אינטראקטיביות ותחזית מזג אוויר.
            </p>

            {/* CTAs */}
            <div className="animate-slide-up stagger-4 flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Link href="/planning" className="btn-primary text-base px-8 py-3.5 group">
                התחל לתכנן
                <svg className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link href="/history" className="btn-secondary text-base px-8 py-3.5">
                היסטוריית מסלולים
              </Link>
            </div>

            {/* Stats */}
            <div className="animate-slide-up stagger-5 grid grid-cols-3 gap-3 max-w-sm mx-auto">
              {stats.map((stat, i) => (
                <div key={i} className="rounded-2xl py-4 px-3 text-center relative overflow-hidden"
                  style={{
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                  <div
                    className="text-2xl font-black font-mono mb-0.5"
                    style={{ color: 'var(--trail)' }}
                  >{stat.value}</div>
                  <div className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            </div>{/* end relative z-10 */}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, var(--bg-base))' }} />
      </section>

      {/* ── Features ── */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="mb-4 mx-auto" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'9999px', fontSize:'0.75rem', fontWeight:600, background:'rgba(74,222,128,0.14)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.30)' }}>יכולות המערכת</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              מה המערכת מציעה?
            </h2>
            <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-primary)', opacity: 0.75 }}>
              כלים חכמים שהופכים את תכנון הטיול לחוויה פשוטה ומהנה
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group rounded-2xl p-6 transition-all duration-300 relative overflow-hidden"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: 'var(--shadow-sm)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border-medium)';
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = 'var(--shadow-md), var(--glow)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'var(--border-subtle)';
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: feature.bg, border: `1px solid ${feature.border}` }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-14">
            <div className="mb-4 mx-auto" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'9999px', fontSize:'0.75rem', fontWeight:600, background:'rgba(96,165,250,0.14)', color:'#93c5fd', border:'1px solid rgba(96,165,250,0.30)' }}>תהליך פשוט</div>
            <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
              איך זה עובד?
            </h2>
            <p className="text-base" style={{ color: 'var(--text-primary)', opacity: 0.75 }}>ארבעה צעדים פשוטים למסלול מושלם</p>
          </div>

          <div className="relative space-y-3">
            {/* Track line */}
            <div
              className="absolute top-6 bottom-6 pointer-events-none hidden sm:block"
              style={{
                right: '19px',
                width: '1px',
                background: 'linear-gradient(to bottom, transparent, var(--border-medium) 15%, var(--border-medium) 85%, transparent)',
              }}
            />

            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                {/* Step number */}
                <div
                  className="relative flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm z-10 transition-all duration-200"
                  style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-medium)',
                    color: 'var(--trail)',
                    fontFamily: 'var(--font-mono, monospace)',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(74,222,128,0.15)';
                    el.style.borderColor = 'var(--border-strong)';
                    el.style.boxShadow = 'var(--glow)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'var(--bg-elevated)';
                    el.style.borderColor = 'var(--border-medium)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
                {/* Content */}
                <div
                  className="rounded-xl p-4 flex-1 transition-all duration-200"
                  style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-dim)' }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--border-subtle)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = 'var(--border-dim)';
                  }}
                >
                  <h3 className="text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto">
          <div
            className="relative rounded-3xl overflow-hidden px-8 py-16 sm:px-14 text-center"
            style={{
              background: 'linear-gradient(135deg, #111f19 0%, #172b22 50%, #0b1512 100%)',
              border: '1px solid var(--border-medium)',
              boxShadow: 'var(--shadow-lg), var(--glow-lg)',
            }}
          >
            {/* Background glow blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(74,222,128,0.08) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(96,165,250,0.06) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
            {/* Grid overlay */}
            <div className="absolute inset-0 dot-pattern opacity-40 pointer-events-none" />

            <div className="relative z-10">
              <div className="mb-6 mx-auto" style={{ display:'inline-flex', alignItems:'center', gap:'6px', padding:'4px 12px', borderRadius:'9999px', fontSize:'0.75rem', fontWeight:600, background:'rgba(74,222,128,0.14)', color:'#4ade80', border:'1px solid rgba(74,222,128,0.30)' }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse-dot" style={{ background: '#4ade80' }} />
                חינמי לחלוטין
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: 'var(--text-primary)' }}>
                מוכנים לצאת לדרך?
              </h2>
              <p className="mb-8 max-w-md mx-auto text-base" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>
                התחילו לתכנן את הטיול הבא שלכם עכשיו — לוקח פחות מדקה.
              </p>
              <Link
                href="/planning"
                className="btn-primary inline-flex text-base px-10 py-3.5"
              >
                התחל עכשיו
                <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const stats = [
  { value: 'AI',  label: 'תכנון חכם' },
  { value: '3',   label: 'ימי תחזית' },
  { value: '2–3', label: 'ימי טיול' },
];

const features = [
  {
    icon: '🤖',
    bg: 'rgba(139,92,246,0.12)',
    border: 'rgba(139,92,246,0.2)',
    title: 'בינה מלאכותית',
    description: 'המסלולים נוצרים באמצעות מודלי LLM מתקדמים שמתאימים את המסלול לפי סוג הטיול, אורכו ומיקומו.',
  },
  {
    icon: '🗺️',
    bg: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.2)',
    title: 'מפות אינטראקטיביות',
    description: 'כל מסלול מוצג על מפה אינטראקטיבית עם Leaflet, כולל ניווט אמיתי על כבישים ושבילים.',
  },
  {
    icon: '🌤️',
    bg: 'rgba(250,204,21,0.10)',
    border: 'rgba(250,204,21,0.18)',
    title: 'תחזית מזג אוויר',
    description: 'תחזית מזג אוויר ל-3 ימים הקרובים במיקום המסלול, כדי שתוכלו לתכנן בהתאם.',
  },
  {
    icon: '🚴',
    bg: 'rgba(74,222,128,0.11)',
    border: 'rgba(74,222,128,0.2)',
    title: 'מסלולי אופניים',
    description: 'מסלולי רכיבה רציפים של 2-3 ימים מעיר לעיר, עם 30-70 ק"מ ביום.',
  },
  {
    icon: '🥾',
    bg: 'rgba(251,146,60,0.11)',
    border: 'rgba(251,146,60,0.2)',
    title: 'מסלולי טרק',
    description: 'מסלולים מעגליים של 5-10 ק"מ שמתחילים ומסתיימים באותה נקודה. 1-3 מסלולים.',
  },
  {
    icon: '💾',
    bg: 'rgba(255,255,255,0.05)',
    border: 'rgba(255,255,255,0.09)',
    title: 'שמירת מסלולים',
    description: 'כל מסלול שאושר נשמר בבסיס נתונים וניתן לצפות בו מחדש בכל עת עם תחזית עדכנית.',
  },
];

const steps = [
  {
    title: 'בחר יעד',
    description: 'הכנס שם מדינה, עיר או אזור שאתה רוצה לטייל בו.',
  },
  {
    title: 'בחר סוג טיול',
    description: 'אופניים (30-70 ק"מ ליום) או טרק רגלי (5-10 ק"מ למסלול).',
  },
  {
    title: 'קבל מסלול מותאם',
    description: 'המערכת תייצר עבורך מסלול עם מפה, תחזית מזג אוויר ותמונה.',
  },
  {
    title: 'אשר ושמור',
    description: 'בדוק את המסלול, אשר אותו, והוא יישמר בהיסטוריה שלך.',
  },
];
