'use client';

import Link from 'next/link';
import RotatingText from '@/components/RotatingText';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/8 via-transparent to-accent-500/8" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-56 h-56 bg-accent-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="animate-fade-in inline-flex items-center gap-2 mb-8 px-4 py-1.5 bg-white/90 backdrop-blur-sm text-primary-700 rounded-full text-sm font-medium border border-primary-100 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-500 animate-pulse" />
            פרויקט סיום 2026 - אפקה
          </div>

          <h1 className="animate-slide-up text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tight">
            תכנן את הטיול הבא שלך
            <span className="flex items-center justify-center gap-2 sm:gap-3 mt-1">
              <span className="text-gradient">עם</span>
              <RotatingText
                texts={['מסלולי אופניים', 'מסלולי טרק', 'מפות חכמות', 'תחזית מזג אוויר', 'בינה מלאכותית']}
                mainClassName="px-3 sm:px-4 bg-slate-900 text-white overflow-hidden py-1 sm:py-1.5 justify-center rounded-xl"
                staggerFrom="first"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '-120%' }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1"
                transition={{ type: 'spring', damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
            </span>
          </h1>

          <p className="animate-slide-up stagger-2 text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            בחר יעד, סוג טיול ומשך — והמערכת תיצור עבורך מסלול מותאם אישית
            עם מפות אינטראקטיביות ותחזית מזג אוויר.
          </p>

          <div className="animate-slide-up stagger-3 flex flex-col sm:flex-row gap-3 justify-center mb-14">
            <Link href="/planning" className="btn-primary text-base px-8 py-3.5">
              התחל לתכנן
              <svg className="w-4 h-4 rotate-180 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href="/history" className="btn-secondary text-base px-8 py-3.5">
              היסטוריית מסלולים
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-slide-up stagger-4 grid grid-cols-3 gap-4 max-w-lg mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card rounded-2xl py-4 px-3 text-center">
                <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-blue mb-4">יכולות המערכת</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              מה המערכת מציעה?
            </h2>
            <p className="text-slate-500 text-base max-w-lg mx-auto">
              כלים חכמים שהופכים את תכנון הטיול לחוויה פשוטה ומהנה
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group glass-card rounded-2xl p-6 hover:shadow-lg hover:border-slate-200 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`icon-container mb-4 group-hover:scale-110 transition-transform duration-200 ${feature.bg}`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1.5">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-gradient-to-b from-white/60 to-transparent">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="badge-green mb-4">תהליך פשוט</div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3">
              איך זה עובד?
            </h2>
            <p className="text-slate-500 text-base">ארבעה צעדים פשוטים למסלול מושלם</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute right-[19px] top-10 bottom-10 w-px bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200 hidden sm:block" />

            <div className="space-y-4">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 group relative">
                  <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm z-10 group-hover:bg-primary-600 transition-colors duration-200">
                    {idx + 1}
                  </div>
                  <div className="glass-card rounded-xl p-4 flex-1 group-hover:shadow-md group-hover:border-primary-100 transition-all duration-200">
                    <h3 className="text-base font-bold text-slate-800 mb-0.5">{step.title}</h3>
                    <p className="text-slate-500 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-900/30 via-transparent to-accent-900/30" />
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 px-8 py-14 sm:px-14 sm:py-16">
              <div className="badge mb-6 bg-white/10 text-white/80 border-white/10 mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
                חינמי לחלוטין
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                מוכנים לצאת לדרך?
              </h2>
              <p className="text-slate-300 mb-8 max-w-md mx-auto text-base">
                התחילו לתכנן את הטיול הבא שלכם עכשיו — לוקח פחות מדקה.
              </p>
              <Link
                href="/planning"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-50 transition-all shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
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
  { value: 'AI', label: 'תכנון חכם' },
  { value: '3', label: 'ימי תחזית' },
  { value: '2-3', label: 'ימי טיול' },
];

const features = [
  {
    icon: '🤖',
    bg: 'bg-violet-50 text-violet-600',
    title: 'בינה מלאכותית',
    description:
      'המסלולים נוצרים באמצעות מודלי LLM מתקדמים שמתאימים את המסלול לפי סוג הטיול, אורכו ומיקומו.',
  },
  {
    icon: '🗺️',
    bg: 'bg-blue-50 text-blue-600',
    title: 'מפות אינטראקטיביות',
    description:
      'כל מסלול מוצג על מפה אינטראקטיבית עם Leaflet, כולל ניווט אמיתי על כבישים ושבילים.',
  },
  {
    icon: '🌤️',
    bg: 'bg-amber-50 text-amber-600',
    title: 'תחזית מזג אוויר',
    description:
      'תחזית מזג אוויר ל-3 ימים הקרובים במיקום המסלול, כדי שתוכלו לתכנן בהתאם.',
  },
  {
    icon: '🚴',
    bg: 'bg-green-50 text-green-600',
    title: 'מסלולי אופניים',
    description:
      'מסלולי רכיבה רציפים של 2-3 ימים מעיר לעיר, עם 30-70 ק"מ ביום.',
  },
  {
    icon: '🥾',
    bg: 'bg-orange-50 text-orange-600',
    title: 'מסלולי טרק',
    description:
      'מסלולים מעגליים של 5-10 ק"מ שמתחילים ומסתיימים באותה נקודה. 1-3 מסלולים.',
  },
  {
    icon: '💾',
    bg: 'bg-slate-100 text-slate-600',
    title: 'שמירת מסלולים',
    description:
      'כל מסלול שאושר נשמר בבסיס נתונים וניתן לצפות בו מחדש בכל עת עם תחזית עדכנית.',
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
