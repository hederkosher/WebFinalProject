import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export async function verifyAuth(): Promise<{
  userId: string;
  fullName: string;
  partnerName: string;
} | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

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
