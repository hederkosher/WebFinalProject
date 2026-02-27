import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-accent-500/10" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
            פרויקט סיום 2026 - אפקה
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-slate-900 mb-6 leading-tight">
            מסלול טיולים
            <span className="text-gradient block mt-2">אפקה 2026</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            תכנן מסלולי טיולים חכמים עם בינה מלאכותית, מפות אינטראקטיביות,
            תחזית מזג אוויר ועוד. בחר יעד, סוג טיול ומשך - והמערכת תיצור עבורך
            מסלול מותאם אישית.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/planning"
              className="px-8 py-4 bg-gradient-to-l from-primary-600 to-primary-500 text-white font-bold text-lg rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-xl shadow-primary-200 hover:-translate-y-0.5"
            >
              🗺️ תכנון מסלולים
            </Link>
            <Link
              href="/history"
              className="px-8 py-4 bg-white text-slate-700 font-bold text-lg rounded-xl border-2 border-slate-200 hover:border-primary-300 hover:text-primary-700 transition-all hover:-translate-y-0.5"
            >
              📋 היסטוריית מסלולים
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            מה המערכת מציעה?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">
            איך זה עובד?
          </h2>
          <div className="space-y-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-lg">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                  <p className="text-slate-600">{step.description}</p>
                </div>
              </div>
            ))}
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
