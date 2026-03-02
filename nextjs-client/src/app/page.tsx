import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-500/10" />
        <div className="absolute top-20 right-[10%] w-72 h-72 bg-primary-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 left-[15%] w-64 h-64 bg-accent-400/20 rounded-full blur-3xl animate-float-delay" />
        <div className="absolute top-40 left-[40%] w-48 h-48 bg-yellow-300/15 rounded-full blur-3xl animate-float-slow" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="animate-fade-in inline-block mb-6 px-5 py-2 bg-primary-100/80 backdrop-blur-sm text-primary-700 rounded-full text-sm font-semibold border border-primary-200/50">
            פרויקט סיום 2026 - אפקה
          </div>
          <h1 className="animate-slide-up text-5xl sm:text-7xl font-black text-slate-900 mb-6 leading-tight tracking-tight">
            מסלול טיולים
            <span className="text-gradient block mt-2">אפקה 2026</span>
          </h1>
          <p className="animate-slide-up stagger-2 text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            תכנן מסלולי טיולים חכמים עם בינה מלאכותית, מפות אינטראקטיביות,
            תחזית מזג אוויר ועוד. בחר יעד, סוג טיול ומשך - והמערכת תיצור עבורך
            מסלול מותאם אישית.
          </p>
          <div className="animate-slide-up stagger-3 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planning"
              className="group px-8 py-4 bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold text-lg rounded-2xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-200/50 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-300/50"
            >
              <span className="inline-block transition-transform group-hover:scale-110 ml-2">🗺️</span>
              תכנון מסלולים
            </Link>
            <Link
              href="/history"
              className="group px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-700 font-bold text-lg rounded-2xl border-2 border-slate-200 hover:border-primary-300 hover:text-primary-700 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="inline-block transition-transform group-hover:scale-110 ml-2">📋</span>
              היסטוריית מסלולים
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              מה המערכת מציעה?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              כלים חכמים שהופכים את תכנון הטיול לחוויה פשוטה ומהנה
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group glass-card rounded-2xl p-6 hover:shadow-2xl hover:shadow-primary-100/50 transition-all duration-300 hover:-translate-y-2 border border-slate-100 hover:border-primary-200/50"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-white/60 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              איך זה עובד?
            </h2>
            <p className="text-slate-500 text-lg">ארבעה צעדים פשוטים למסלול מושלם</p>
          </div>
          <div className="relative">
            <div className="absolute right-[23px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-200 via-primary-300 to-accent-200 hidden sm:block" />
            <div className="space-y-8">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-5 group">
                  <div className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 text-white flex items-center justify-center font-black text-lg shadow-lg shadow-primary-200/50 group-hover:scale-110 transition-transform duration-300 z-10">
                    {idx + 1}
                  </div>
                  <div className="glass-card rounded-2xl p-5 flex-1 group-hover:shadow-xl group-hover:border-primary-200/50 transition-all duration-300">
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{step.title}</h3>
                    <p className="text-slate-500 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-card-strong rounded-3xl p-10 sm:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/50" />
            <div className="relative z-10">
              <div className="text-5xl mb-4">🌍</div>
              <h2 className="text-3xl font-black text-slate-800 mb-3">
                מוכנים לצאת לדרך?
              </h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">
                התחילו לתכנן את הטיול הבא שלכם עכשיו - זה חינמי ולוקח פחות מדקה.
              </p>
              <Link
                href="/planning"
                className="inline-block px-10 py-4 bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold text-lg rounded-2xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-200/50 hover:-translate-y-1 hover:shadow-2xl"
              >
                התחל עכשיו
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-slate-400 border-t border-slate-200/50">
        <p>פרויקט סיום - פיתוח בפלטפורמת WEB | אפקה 2026</p>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: '🤖',
    title: 'בינה מלאכותית',
    description:
      'המסלולים נוצרים באמצעות מודלי LLM מתקדמים שמתאימים את המסלול לפי סוג הטיול, אורכו ומיקומו.',
  },
  {
    icon: '🗺️',
    title: 'מפות אינטראקטיביות',
    description:
      'כל מסלול מוצג על מפה אינטראקטיבית עם Leaflet, כולל ניווט אמיתי על כבישים ושבילים.',
  },
  {
    icon: '🌤️',
    title: 'תחזית מזג אוויר',
    description:
      'תחזית מזג אוויר ל-3 ימים הקרובים במיקום המסלול, כדי שתוכלו לתכנן בהתאם.',
  },
  {
    icon: '🚴',
    title: 'מסלולי אופניים',
    description:
      'מסלולי רכיבה רציפים של 2-3 ימים מעיר לעיר, עם 30-70 ק"מ ביום.',
  },
  {
    icon: '🥾',
    title: 'מסלולי טרק',
    description:
      'מסלולים מעגליים של 5-10 ק"מ שמתחילים ומסתיימים באותה נקודה. 1-3 מסלולים.',
  },
  {
    icon: '💾',
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
