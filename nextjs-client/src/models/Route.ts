import mongoose, { Schema, Document } from 'mongoose';

export interface IRoute extends Document {
  userId: string;
  destination: string;
  tripType: 'cycling' | 'trekking';
  durationDays: number;
  dailyRoutes: {
    day: number;
    startLocation: string;
    endLocation: string;
    distance_km: number;
    description: string;
    waypoints: { lat: number; lng: number; name: string }[];
    routeGeometry?: [number, number][];
  }[];
  imageUrl?: string;
  createdAt: Date;
}

const waypointSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
  },
  { _id: false }
);

const dailyRouteSchema = new Schema(
  {
    day: { type: Number, required: true },
    startLocation: { type: String, required: true },
    endLocation: { type: String, required: true },
    distance_km: { type: Number, required: true },
    description: { type: String, required: true },
    waypoints: [waypointSchema],
    routeGeometry: { type: [[Number]], default: [] },
  },
  { _id: false }
);

const routeSchema = new Schema({
  userId: { type: String, required: true, index: true },
  destination: { type: String, required: true },
  tripType: { type: String, enum: ['cycling', 'trekking'], required: true },
  durationDays: { type: Number, required: true },
  dailyRoutes: [dailyRouteSchema],
  imageUrl: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Route || mongoose.model<IRoute>('Route', routeSchema);
