import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { verifyAuth } from '@/lib/auth';

function getOpenAI() {
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function buildCyclingPrompt(destination: string, days: number): string {
  return `You are a travel route planner. Plan a ${days}-day cycling route in/near ${destination}.

Requirements:
- Each day covers 30-70 km of cycling
- Route goes from city/town to city/town (consecutive days, continuous route)
- Provide REAL waypoints with accurate GPS coordinates on actual cycling roads
- Waypoints should follow real roads, not straight lines
- Include 4-6 waypoints per day along the route
- The route should be realistic and bikeable

Respond ONLY with valid JSON (no markdown, no explanation) in this exact format:
{
  "destination": "${destination}",
  "tripType": "cycling",
  "durationDays": ${days},
  "dailyRoutes": [
    {
      "day": 1,
      "startLocation": "City A",
      "endLocation": "City B",
      "distance_km": 45,
      "description": "Brief route description in Hebrew",
      "waypoints": [
        {"lat": 43.7696, "lng": 11.2558, "name": "City A"},
        {"lat": 43.75, "lng": 11.30, "name": "Intermediate point"},
        {"lat": 43.72, "lng": 11.35, "name": "City B"}
      ]
    }
  ]
}`;
}

function buildTrekkingPrompt(destination: string, numRoutes: number): string {
  return `You are a travel route planner. Plan ${numRoutes} circular trekking route(s) in/near ${destination}.

Requirements:
- Each route is 5-10 km long
- Each route STARTS and ENDS at the same point (circular/loop)
- Provide REAL waypoints with accurate GPS coordinates on actual hiking trails
- Waypoints should follow real trails/paths, not straight lines
- Include 5-8 waypoints per route forming a loop
- The first and last waypoint must be the same location
- Routes should be realistic and hikeable

Respond ONLY with valid JSON (no markdown, no explanation) in this exact format:
{
  "destination": "${destination}",
  "tripType": "trekking",
  "durationDays": ${numRoutes},
  "dailyRoutes": [
    {
      "day": 1,
      "startLocation": "Trail Start",
      "endLocation": "Trail Start",
      "distance_km": 7,
      "description": "Brief route description in Hebrew",
      "waypoints": [
        {"lat": 43.7696, "lng": 11.2558, "name": "Trail Start"},
        {"lat": 43.77, "lng": 11.26, "name": "Scenic Point"},
        {"lat": 43.7696, "lng": 11.2558, "name": "Trail Start"}
      ]
    }
  ]
}`;
}

async function getRouteGeometry(
  waypoints: { lat: number; lng: number }[],
  profile: string
): Promise<[number, number][]> {
  const orsKey = process.env.ORS_API_KEY;
  if (!orsKey || waypoints.length < 2) return [];

  try {
    const coordinates = waypoints.map((wp) => [wp.lng, wp.lat]);

    const res = await fetch(
      `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
      {
        method: 'POST',
        headers: {
          Authorization: orsKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ coordinates }),
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    const coords = data?.features?.[0]?.geometry?.coordinates;
    if (!coords) return [];

    return coords.map((c: number[]) => [c[1], c[0]] as [number, number]);
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ message: 'לא מורשה' }, { status: 401 });
  }

  try {
    const { destination, tripType, durationDays } = await request.json();

    if (!destination || !tripType || !durationDays) {
      return NextResponse.json({ message: 'חסרים פרמטרים' }, { status: 400 });
    }

    const prompt =
      tripType === 'cycling'
        ? buildCyclingPrompt(destination, durationDays)
        : buildTrekkingPrompt(destination, durationDays);

    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content?.trim();
    if (!content) {
      return NextResponse.json({ message: 'לא התקבלה תשובה מהמודל' }, { status: 500 });
    }

    let routeData;
    try {
      const cleanJson = content.replace(/```json\n?|```\n?/g, '').trim();
      routeData = JSON.parse(cleanJson);
    } catch {
      return NextResponse.json(
        { message: 'שגיאה בפענוח תשובת המודל', raw: content },
        { status: 500 }
      );
    }

    const orsProfile = tripType === 'cycling' ? 'cycling-regular' : 'foot-hiking';

    const routesWithGeometry = await Promise.all(
      routeData.dailyRoutes.map(async (day: { waypoints: { lat: number; lng: number }[] }) => {
        const geometry = await getRouteGeometry(day.waypoints, orsProfile);
        return { ...day, routeGeometry: geometry };
      })
    );

    routeData.dailyRoutes = routesWithGeometry;
    routeData.userId = user.userId;

    return NextResponse.json(routeData);
  } catch (error) {
    console.error('Generate route error:', error);
    return NextResponse.json({ message: 'שגיאה ביצירת המסלול' }, { status: 500 });
  }
}
