import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import Navbar from '@/components/Navbar';
import TokenRefresher from '@/components/TokenRefresher';

const LightPillarBackground = dynamic(() => import('@/components/LightPillarBackground'), { ssr: false });

export const metadata: Metadata = {
  title: 'מסלול טיולים אפקה 2026',
  description: 'תכנון מסלולי טיולים חכם עם מפות, תחזית מזג אוויר ובינה מלאכותית',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="min-h-screen bg-slate-100 font-hebrew">
        <TokenRefresher />
        <LightPillarBackground />
        <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-white/65 via-white/45 to-slate-100/60" />
        <Navbar />
        <main className="relative z-10 pt-16">{children}</main>
      </body>
    </html>
  );
}
