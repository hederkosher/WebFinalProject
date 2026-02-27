export interface Waypoint {
  lat: number;
  lng: number;
  name: string;
}

export interface DailyRoute {
  day: number;
  startLocation: string;
  endLocation: string;
  distance_km: number;
  description: string;
  waypoints: Waypoint[];
  routeGeometry?: [number, number][];
}

export interface TripRoute {
  _id?: string;
  userId: string;
  destination: string;
  tripType: 'cycling' | 'trekking';
  durationDays: number;
  dailyRoutes: DailyRoute[];
  imageUrl?: string;
  weather?: WeatherForecast;
  createdAt?: string;
  approved?: boolean;
}

export interface WeatherDay {
  date: string;
  temp_min: number;
  temp_max: number;
  description: string;
  icon: string;
  humidity: number;
  wind_speed: number;
}

export interface WeatherForecast {
  location: string;
  days: WeatherDay[];
}

export interface UserInfo {
  fullName: string;
  partnerName?: string;
  email: string;
}
