import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface ForecastItem {
  dt: number;
  main: { temp_min: number; temp_max: number; humidity: number };
  weather: { description: string; icon: string }[];
  wind: { speed: number };
  dt_txt: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const location = searchParams.get('location') || 'Unknown';

    if (!lat || !lng) {
      return NextResponse.json({ message: 'חסרים קואורדינטות' }, { status: 400 });
    }

    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { message: 'מפתח API של מזג אוויר לא הוגדר' },
        { status: 500 }
      );
    }

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric&lang=he`
    );

    if (!res.ok) {
      return NextResponse.json({ message: 'שגיאה בשליפת מזג אוויר' }, { status: 500 });
    }

    const data = await res.json();

    const dailyMap = new Map<
      string,
      { temp_min: number; temp_max: number; humidity: number; description: string; icon: string; wind_speed: number }
    >();

    data.list.forEach((item: ForecastItem) => {
      const date = item.dt_txt.split(' ')[0];
      const existing = dailyMap.get(date);

      if (!existing) {
        dailyMap.set(date, {
          temp_min: item.main.temp_min,
          temp_max: item.main.temp_max,
          humidity: item.main.humidity,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
          wind_speed: item.wind.speed,
        });
      } else {
        existing.temp_min = Math.min(existing.temp_min, item.main.temp_min);
        existing.temp_max = Math.max(existing.temp_max, item.main.temp_max);
      }
    });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const days = Array.from(dailyMap.entries())
      .filter(([dateStr]) => new Date(dateStr) >= tomorrow)
      .slice(0, 3)
      .map(([dateStr, info]) => ({
        date: new Date(dateStr).toLocaleDateString('he-IL', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        ...info,
      }));

    return NextResponse.json({ location: decodeURIComponent(location), days });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json({ message: 'שגיאה בשליפת מזג אוויר' }, { status: 500 });
  }
}
