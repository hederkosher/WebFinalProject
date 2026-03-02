import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
                <span className="text-xs">🥾</span>
              </div>
              <span className="text-sm font-bold text-white">מסלול טיולים אפקה</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              תכנון מסלולי טיולים חכם עם בינה מלאכותית, מפות אינטראקטיביות ותחזית מזג אוויר.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">ניווט</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link href="/planning" className="text-sm text-slate-400 hover:text-white transition-colors">
                  תכנון מסלולים
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-sm text-slate-400 hover:text-white transition-colors">
                  היסטוריית מסלולים
                </Link>
              </li>
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">אודות</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              פרויקט סיום 2026
              <br />
              פיתוח בפלטפורמת WEB
              <br />
              מכללת אפקה להנדסה
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs">
            © 2026 מסלול טיולים אפקה. כל הזכויות שמורות.
          </p>
          <p className="text-slate-600 text-xs">
            Next.js · Express · MongoDB · Groq AI
          </p>
        </div>
      </div>
    </footer>
  );
}
