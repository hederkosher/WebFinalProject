'use client';

import { useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';

const REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour
const EXPIRY_THRESHOLD = 2 * 60 * 60; // 2 hours in seconds

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

export default function TokenRefresher() {
  const refreshToken = useCallback(async () => {
    const token = Cookies.get('token');
    if (!token) return;

    const payload = parseJwt(token);
    if (!payload?.exp) return;

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = payload.exp - now;

    if (timeLeft > EXPIRY_THRESHOLD) return;

    try {
      const expressUrl = process.env.NEXT_PUBLIC_EXPRESS_URL || 'http://localhost:4000';
      const res = await fetch(`${expressUrl}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        Cookies.set('token', data.accessToken, { expires: 1, sameSite: 'lax' });
      }
    } catch (err) {
      console.error('Silent token refresh failed:', err);
    }
  }, []);

  useEffect(() => {
    refreshToken();
    const interval = setInterval(refreshToken, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [refreshToken]);

  return null;
}
