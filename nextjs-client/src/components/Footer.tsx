'use client';

import Link from 'next/link';
import LogoLoop from './LogoLoop';
import { SiNextdotjs, SiExpress, SiMongodb, SiReact, SiTailwindcss, SiTypescript } from 'react-icons/si';

const GroqIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 3.5a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13Zm0 2.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 1.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
  </svg>
);

const techLogos = [
  { node: <SiNextdotjs />, title: 'Next.js', href: 'https://nextjs.org' },
  { node: <SiExpress />, title: 'Express', href: 'https://expressjs.com' },
  { node: <SiMongodb />, title: 'MongoDB', href: 'https://www.mongodb.com' },
  { node: <GroqIcon />, title: 'Groq AI', href: 'https://groq.com' },
  { node: <SiReact />, title: 'React', href: 'https://react.dev' },
  { node: <SiTypescript />, title: 'TypeScript', href: 'https://www.typescriptlang.org' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS', href: 'https://tailwindcss.com' },
];

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

        {/* Tech Stack Logo Loop */}
        <div className="mt-10 pt-6 border-t border-slate-800">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest text-center mb-4">
            נבנה עם
          </p>
          <div className="h-8 text-slate-500">
            <LogoLoop
              logos={techLogos}
              speed={40}
              direction="left"
              logoHeight={18}
              gap={48}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#0f172a"
              ariaLabel="Tech stack"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-slate-600 text-xs">
            © 2026 מסלול טיולים אפקה. כל הזכויות שמורות.
          </p>
        </div>
      </div>
    </footer>
  );
}
