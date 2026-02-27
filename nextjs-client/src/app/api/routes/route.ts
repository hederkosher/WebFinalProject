import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Route from '@/models/Route';
import { verifyAuth } from '@/lib/auth';

export async function GET(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ message: 'לא מורשה' }, { status: 401 });
  }

  try {
    await connectDB();
    const routes = await Route.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(routes);
  } catch (error) {
    console.error('Get routes error:', error);
    return NextResponse.json({ message: 'שגיאה בטעינת המסלולים' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ message: 'לא מורשה' }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await request.json();

    const route = new Route({
      userId: user.userId,
      destination: body.destination,
      tripType: body.tripType,
      durationDays: body.durationDays,
      dailyRoutes: body.dailyRoutes,
      imageUrl: body.imageUrl || '',
    });

    await route.save();

    return NextResponse.json(route, { status: 201 });
  } catch (error) {
    console.error('Save route error:', error);
    return NextResponse.json({ message: 'שגיאה בשמירת המסלול' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const user = await verifyAuth();
  if (!user) {
    return NextResponse.json({ message: 'לא מורשה' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'חסר מזהה מסלול' }, { status: 400 });
    }

    await connectDB();
    const route = await Route.findOneAndDelete({ _id: id, userId: user.userId });

    if (!route) {
      return NextResponse.json({ message: 'מסלול לא נמצא' }, { status: 404 });
    }

    return NextResponse.json({ message: 'המסלול נמחק' });
  } catch (error) {
    console.error('Delete route error:', error);
    return NextResponse.json({ message: 'שגיאה במחיקת המסלול' }, { status: 500 });
  }
}
