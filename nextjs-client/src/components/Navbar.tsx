'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = Cookies.get('token');
    setIsLoggedIn(!!token);
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        setUserName(payload.fullName || '');
      } catch { /* ignore */ }
    }
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const handleLogout = async () => {
    try {
      const expressUrl = process.env.NEXT_PUBLIC_EXPRESS_URL || 'http://localhost:4000';
      await fetch(`${expressUrl}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch { /* ignore */ }
    Cookies.remove('token');
    router.push('/login');
  };

  if (pathname === '/login') return null;

  const navLinks = [
    { href: '/',          label: 'בית',        icon: '◈' },
    { href: '/planning',  label: 'תכנון',       icon: '◎' },
    { href: '/history',   label: 'היסטוריה',   icon: '◫' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? 'rgba(11, 21, 18, 0.92)'
          : 'rgba(11, 21, 18, 0.6)',
        borderBottom: scrolled
          ? '1px solid rgba(74, 222, 128, 0.12)'
          : '1px solid rgba(74, 222, 128, 0.05)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.4)' : 'none',
      }}
    >
      <div className="page-container">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105"
              style={{
                background: 'rgba(74, 222, 128, 0.12)',
                border: '1px solid rgba(74, 222, 128, 0.25)',
                boxShadow: '0 0 12px rgba(74, 222, 128, 0.15)',
              }}
            >
              <span className="text-sm" style={{ filter: 'drop-shadow(0 0 4px rgba(74,222,128,0.5))' }}>🥾</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>מסלול טיולים</span>
              <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: 'var(--trail)', opacity: 0.7 }}>AFEKA 2026</span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150"
                  style={{
                    background: active ? 'rgba(74, 222, 128, 0.12)' : 'transparent',
                    color: active ? 'var(--trail)' : 'var(--text-secondary)',
                    border: active ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  {link.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+3px)] w-1 h-1 rounded-full animate-pulse-dot"
                      style={{ background: 'var(--trail)' }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User + auth */}
          <div className="hidden md:flex items-center gap-2">
            {isLoggedIn && userName && (
              <span className="text-xs font-medium px-3 py-1.5 rounded-lg"
                style={{ color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)' }}>
                שלום, <span style={{ color: 'var(--trail)' }}>{userName}</span>
              </span>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150"
                style={{ color: 'var(--danger)', border: '1px solid rgba(240,114,114,0.15)' }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(240,114,114,0.08)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,114,114,0.3)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(240,114,114,0.15)';
                }}
              >
                התנתק
              </button>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-150"
                style={{
                  background: 'var(--trail)',
                  color: '#0b1512',
                  boxShadow: '0 2px 10px rgba(74,222,128,0.25)',
                }}
              >
                התחבר
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 -ml-2 rounded-lg transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            className="md:hidden pb-3 mt-1 pt-2 space-y-1 animate-fade-in"
            style={{ borderTop: '1px solid var(--border-dim)' }}
          >
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: active ? 'rgba(74,222,128,0.10)' : 'transparent',
                    color: active ? 'var(--trail)' : 'var(--text-secondary)',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2" style={{ borderTop: '1px solid var(--border-dim)' }}>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full text-right px-3 py-2 text-sm font-medium rounded-lg"
                  style={{ color: 'var(--danger)' }}
                >
                  התנתק
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm font-bold rounded-lg"
                  style={{ color: 'var(--trail)' }}
                >
                  התחבר
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
