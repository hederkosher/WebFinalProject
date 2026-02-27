import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface WeatherApiForecastDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avghumidity: number;
    maxwind_kph: number;
    condition: { text: string; icon: string };
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const location = searchParams.get('location') || 'Unknown';

    if (!lat || !lng) {
      return NextResponse.json({ message: 'Missing coordinates' }, { status: 400 });
    }

    const apiKey = process.env.WEATHERAPI_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'Weather API key not configured' },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${lat},${lng}&days=4&lang=he`
    );

    if (!res.ok) {
      return NextResponse.json({ message: 'Failed to fetch weather' }, { status: 500 });
    }

    const data = await res.json();
    const forecastDays: WeatherApiForecastDay[] = data.forecast?.forecastday || [];

    const days = forecastDays
      .slice(1, 4)
      .map((fd) => ({
        date: new Date(fd.date).toLocaleDateString('he-IL', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        temp_min: fd.day.mintemp_c,
        temp_max: fd.day.maxtemp_c,
        humidity: fd.day.avghumidity,
        description: fd.day.condition.text,
        icon: fd.day.condition.icon,
        wind_speed: fd.day.maxwind_kph,
      }));

    return NextResponse.json({ location: decodeURIComponent(location), days });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ message: 'Failed to fetch weather' }, { status: 500 });
  }
}
