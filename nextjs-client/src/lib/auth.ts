import { jwtVerify } from 'jose';
import { cookies, headers } from 'next/headers';

export async function verifyAuth(): Promise<{
  userId: string;
  fullName: string;
  partnerName: string;
} | null> {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const cookieToken = cookieStore.get('token')?.value;
  const authHeader = headerStore.get('authorization') || headerStore.get('Authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  const token = cookieToken || bearerToken;
  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      fullName: payload.fullName as string,
      partnerName: (payload.partnerName as string) || '',
    };
  } catch {
    return null;
  }
}
