// Weather — type definitions (storage, upstream data, normalized view models).
export type SkyKind = 'clear' | 'cloud' | 'rain' | 'snow' | 'thunder' | 'fog';

// stored city (our cities table)
export interface City {
  id: number;
  name: string;
  lat: number;
  lon: number;
  is_default: number;
  sort: number;
}

// geocoding upstream shape
export interface GeoResult {
  id?: number;
  name?: string;
  latitude?: number;
  longitude?: number;
  country?: string | null;
  country_code?: string | null;
  admin1?: string | null;
  admin2?: string | null;
}
export interface GeoResponse { results?: GeoResult[]; }

// a city candidate from search (not yet saved)
export interface Candidate { name: string; lat: number; lon: number; }

// forecast upstream shape
export interface CurrentBlock {
  temperature_2m?: number;
  relative_humidity_2m?: number;
  apparent_temperature?: number;
  weather_code?: number;
  wind_speed_10m?: number;
  is_day?: number;
}
export interface DailyBlock {
  time?: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
}
export interface ForecastResponse {
  current?: CurrentBlock;
  daily?: DailyBlock;
  timezone?: string;
  error?: boolean;
  reason?: string;
}

// normalized view models
export interface Now { temp: number; feels: number; humidity: number; wind: number; code: number; isDay: boolean; }
export interface DayCell { date: string; code: number; max: number; min: number; }
export interface Forecast { now: Now; days: DayCell[]; }
export interface Condition { label: string; icon: string; sky: SkyKind; }
