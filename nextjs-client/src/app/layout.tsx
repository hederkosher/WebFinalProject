import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import TokenRefresher from '@/components/TokenRefresher';

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
      <body className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 font-hebrew">
        <TokenRefresher />
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
