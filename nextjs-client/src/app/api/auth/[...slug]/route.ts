import { NextRequest, NextResponse } from 'next/server';

const EXPRESS_URL = process.env.NEXT_PUBLIC_EXPRESS_URL || 'http://localhost:4000';

async function handler(req: NextRequest, context: { params: { slug: string[] } }) {
  const slug = context.params.slug.join('/');
  const targetUrl = `${EXPRESS_URL}/api/auth/${slug}`;

  const forwardHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) forwardHeaders['Cookie'] = cookieHeader;

  const fetchOptions: RequestInit = { method: req.method, headers: forwardHeaders };
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    fetchOptions.body = await req.text();
  }

  const upstream = await fetch(targetUrl, fetchOptions);
  const body = await upstream.text();

  const res = new NextResponse(body, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json' },
  });

  // Forward Set-Cookie headers from Express to the browser
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setCookies: string[] = (upstream.headers as any).getSetCookie?.() ??
    [upstream.headers.get('set-cookie')].filter(Boolean);
  for (const cookie of setCookies) {
    res.headers.append('Set-Cookie', cookie);
  }

  return res;
}

export const GET = handler;
export const POST = handler;
export const DELETE = handler;
