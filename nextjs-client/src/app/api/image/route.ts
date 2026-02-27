import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ message: 'חסר שאילתת חיפוש' }, { status: 400 });
    }

    const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;
    if (unsplashKey) {
      try {
        const res = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
          { headers: { Authorization: `Client-ID ${unsplashKey}` } }
        );
        if (res.ok) {
          const data = await res.json();
          const url = data.results?.[0]?.urls?.regular;
          if (url) return NextResponse.json({ url });
        }
      } catch (err) {
        console.error('Unsplash error:', err);
      }
    }

    return NextResponse.json({ url: getFallbackImage(query) });
  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({ url: '' }, { status: 200 });
  }
}

function getFallbackImage(query: string): string {
  const seed = encodeURIComponent(query).replace(/%/g, '');
  return `https://picsum.photos/seed/${seed || 'travel'}/1200/600`;
}
