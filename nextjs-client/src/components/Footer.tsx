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
    <footer
      className="relative z-20 mt-auto"
      style={{
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.10)', border: '1px solid rgba(74,222,128,0.2)' }}
              >
                <span className="text-sm">🥾</span>
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>מסלול טיולים אפקה</div>
                <div className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--trail)', opacity: 0.6 }}>AFEKA 2026</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              תכנון מסלולי טיולים חכם עם בינה מלאכותית, מפות אינטראקטיביות ותחזית מזג אוויר.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>ניווט</h3>
            <ul className="space-y-2">
              {[
                { href: '/',         label: 'דף הבית' },
                { href: '/planning', label: 'תכנון מסלולים' },
                { href: '/history',  label: 'היסטוריית מסלולים' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = 'var(--trail)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project info */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text-muted)' }}>אודות</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              פרויקט סיום 2026
              <br />
              פיתוח בפלטפורמת WEB
              <br />
              מכללת אפקה להנדסה
            </p>
          </div>
        </div>

        {/* Tech Stack Logo Loop */}
        <div className="mt-10 pt-6" style={{ borderTop: '1px solid var(--border-dim)' }}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-center mb-4" style={{ color: 'var(--text-muted)' }}>
            נבנה עם
          </p>
          <div className="h-8" style={{ color: 'var(--text-muted)' }}>
            <LogoLoop
              logos={techLogos}
              speed={40}
              direction="left"
              logoHeight={18}
              gap={48}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor="#111f19"
              ariaLabel="Tech stack"
            />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2026 מסלול טיולים אפקה · כל הזכויות שמורות
          </p>
        </div>
      </div>
    </footer>
  );
}
