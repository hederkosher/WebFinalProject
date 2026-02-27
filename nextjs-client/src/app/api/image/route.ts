import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ message: 'חסר שאילתת חיפוש' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ url: getFallbackImage(query) });
    }

    try {
      const openai = new OpenAI({ apiKey });
      const response = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `A beautiful landscape photograph of ${query}, travel photography, scenic nature view, high quality`,
        n: 1,
        size: '1792x1024',
        quality: 'standard',
      });

      const url = response.data?.[0]?.url;
      if (url) {
        return NextResponse.json({ url });
      }
    } catch (imgError) {
      console.error('DALL-E error, using fallback:', imgError);
    }

    return NextResponse.json({ url: getFallbackImage(query) });
  } catch (error) {
    console.error('Image API error:', error);
    return NextResponse.json({ url: '' }, { status: 200 });
  }
}

function getFallbackImage(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://source.unsplash.com/1200x600/?${encoded},landscape,travel`;
}
