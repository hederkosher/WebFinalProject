'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { DailyRoute } from '@/lib/types';

const DAY_COLORS = ['#2563eb', '#dc2626', '#16a34a', '#9333ea', '#ea580c', '#0891b2', '#be185d'];

interface MapViewProps {
  dailyRoutes: DailyRoute[];
  center?: [number, number];
  zoom?: number;
}

export default function MapView({ dailyRoutes, center, zoom }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const defaultCenter: [number, number] = center || [32.0853, 34.7818];
    const map = L.map(containerRef.current).setView(defaultCenter, zoom || 10);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    if (!dailyRoutes || dailyRoutes.length === 0) return;

    const allBounds: L.LatLngExpression[] = [];

    dailyRoutes.forEach((route, idx) => {
      const color = DAY_COLORS[idx % DAY_COLORS.length];

      if (route.routeGeometry && route.routeGeometry.length > 0) {
        const latLngs: L.LatLngExpression[] = route.routeGeometry.map(
          (coord) => [coord[0], coord[1]] as L.LatLngExpression
        );
        L.polyline(latLngs, { color, weight: 4, opacity: 0.8 }).addTo(map);
        allBounds.push(...latLngs);
      } else if (route.waypoints && route.waypoints.length > 0) {
        const latLngs: L.LatLngExpression[] = route.waypoints.map(
          (wp) => [wp.lat, wp.lng] as L.LatLngExpression
        );
        L.polyline(latLngs, { color, weight: 4, opacity: 0.8, dashArray: '10, 5' }).addTo(map);
        allBounds.push(...latLngs);
      }

      if (route.waypoints) {
        route.waypoints.forEach((wp, wpIdx) => {
          const isStart = wpIdx === 0;
          const isEnd = wpIdx === route.waypoints.length - 1;

          const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              background: ${isStart ? '#22c55e' : isEnd ? '#ef4444' : color};
              color: white;
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              font-weight: bold;
              border: 2px solid white;
              box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            ">${isStart ? '▶' : isEnd ? '◼' : (wpIdx + 1)}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          L.marker([wp.lat, wp.lng], { icon })
            .bindPopup(
              `<div style="direction:rtl;text-align:right;">
                <strong>יום ${route.day}${isStart ? ' - התחלה' : isEnd ? ' - סיום' : ''}</strong><br/>
                ${wp.name}<br/>
                <small>${route.distance_km} ק"מ</small>
              </div>`
            )
            .addTo(map);
        });
      }
    });

    if (allBounds.length > 0) {
      map.fitBounds(L.latLngBounds(allBounds), { padding: [30, 30] });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [dailyRoutes, center, zoom]);

  return <div ref={containerRef} className="w-full h-full min-h-[400px] rounded-xl" />;
}
