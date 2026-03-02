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
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const expressUrl = process.env.NEXT_PUBLIC_EXPRESS_URL || 'http://localhost:4000';
      await fetch(`${expressUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch { /* ignore */ }
    Cookies.remove('token');
    router.push('/login');
  };

  if (pathname === '/login') return null;

  const navLinks = [
    { href: '/', label: 'דף הבית', icon: '🏠' },
    { href: '/planning', label: 'תכנון מסלולים', icon: '🗺️' },
    { href: '/history', label: 'היסטוריית מסלולים', icon: '📋' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-card-strong border-b border-slate-200/60 shadow-lg shadow-slate-200/20'
          : 'bg-white/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md shadow-primary-200/50 group-hover:shadow-lg group-hover:scale-105 transition-all">
              <span className="text-lg">🥾</span>
            </div>
            <span className="text-lg font-bold text-gradient">מסלול טיולים אפקה</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? 'bg-primary-100 text-primary-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span className="ml-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn && userName && (
              <span className="text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                שלום, <span className="font-semibold text-slate-700">{userName}</span>
              </span>
            )}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-200"
              >
                התנתק
              </button>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 text-sm font-semibold bg-gradient-to-l from-primary-600 to-primary-500 text-white rounded-xl hover:from-primary-700 hover:to-primary-600 transition-all shadow-md shadow-primary-200/40 hover:shadow-lg"
              >
                התחבר
              </Link>
            )}
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200/50 mt-2 pt-3 space-y-1 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="ml-1.5">{link.icon}</span>
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-full text-right px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl mt-2 transition-colors"
              >
                התנתק
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
