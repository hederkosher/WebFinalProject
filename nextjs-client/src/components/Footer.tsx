import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="relative z-30 mt-auto border-t border-slate-200/70 bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">מסלול טיולים אפקה 2026</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              תכנון מסלולי טיולים חכם עם בינה מלאכותית, מפות אינטראקטיביות ותחזית מזג אוויר.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">ניווט</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
                  דף הבית
                </Link>
              </li>
              <li>
                <Link href="/planning" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
                  תכנון מסלולים
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
                  היסטוריית מסלולים
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-slate-500 hover:text-slate-900 text-sm transition-colors">
                  התחברות
                </Link>
              </li>
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-3">אודות</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              פרויקט סיום 2026 - פיתוח בפלטפורמת WEB
              <br />
              מכללת אפקה להנדסה
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
          <p className="text-slate-400 text-xs">
            © 2026 מסלול טיולים אפקה. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
