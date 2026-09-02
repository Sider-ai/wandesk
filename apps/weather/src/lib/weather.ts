// Weather — WMO condition mapping, sky gradients, upstream URLs, parsing and display helpers (pure functions).
import type { Candidate, Condition, Forecast, ForecastResponse, GeoResponse, GeoResult, Now, SkyKind, DayCell } from './types';

// WMO weather_code → condition (English label + emoji)  https://open-meteo.com/en/docs
export function describe(code: number, isDay: boolean): Condition {
  const sun = isDay ? '☀️' : '🌙';
  const partly = isDay ? '⛅' : '☁️';
  switch (code) {
    case 0: return { label: 'Clear', icon: sun, sky: 'clear' };
    case 1: return { label: 'Mostly Clear', icon: isDay ? '🌤️' : '🌙', sky: 'clear' };
    case 2: return { label: 'Partly Cloudy', icon: partly, sky: 'cloud' };
    case 3: return { label: 'Overcast', icon: '☁️', sky: 'cloud' };
    case 45: return { label: 'Foggy', icon: '🌫️', sky: 'fog' };
    case 48: return { label: 'Rime Fog', icon: '🌫️', sky: 'fog' };
    case 51: return { label: 'Light Drizzle', icon: '🌦️', sky: 'rain' };
    case 53: return { label: 'Drizzle', icon: '🌦️', sky: 'rain' };
    case 55: return { label: 'Dense Drizzle', icon: '🌧️', sky: 'rain' };
    case 56: return { label: 'Freezing Drizzle', icon: '🌧️', sky: 'rain' };
    case 57: return { label: 'Dense Freezing Drizzle', icon: '🌧️', sky: 'rain' };
    case 61: return { label: 'Light Rain', icon: '🌦️', sky: 'rain' };
    case 63: return { label: 'Rain', icon: '🌧️', sky: 'rain' };
    case 65: return { label: 'Heavy Rain', icon: '🌧️', sky: 'rain' };
    case 66: return { label: 'Freezing Rain', icon: '🌧️', sky: 'rain' };
    case 67: return { label: 'Heavy Freezing Rain', icon: '🌧️', sky: 'rain' };
    case 71: return { label: 'Light Snow', icon: '🌨️', sky: 'snow' };
    case 73: return { label: 'Snow', icon: '🌨️', sky: 'snow' };
    case 75: return { label: 'Heavy Snow', icon: '❄️', sky: 'snow' };
    case 77: return { label: 'Snow Grains', icon: '🌨️', sky: 'snow' };
    case 80: return { label: 'Rain Showers', icon: '🌦️', sky: 'rain' };
    case 81: return { label: 'Heavy Rain Showers', icon: '🌧️', sky: 'rain' };
    case 82: return { label: 'Violent Rain Showers', icon: '⛈️', sky: 'rain' };
    case 85: return { label: 'Snow Showers', icon: '🌨️', sky: 'snow' };
    case 86: return { label: 'Heavy Snow Showers', icon: '❄️', sky: 'snow' };
    case 95: return { label: 'Thunderstorm', icon: '⛈️', sky: 'thunder' };
    case 96: return { label: 'Thunderstorm with Hail', icon: '⛈️', sky: 'thunder' };
    case 99: return { label: 'Severe Thunderstorm with Hail', icon: '⛈️', sky: 'thunder' };
    default: return { label: 'Unknown', icon: partly, sky: 'cloud' };
  }
}

// gradient per sky-kind, split by day/night — drives the deep backdrop the SVG scene sits on.
export const SKY_GRADIENT: Record<SkyKind, { day: string; night: string }> = {
  clear: { day: 'linear-gradient(180deg, #1e6fe0 0%, #3f93f2 38%, #74b8fa 72%, #a9d6fb 100%)', night: 'linear-gradient(180deg, #060a1f 0%, #0e1640 44%, #1d2a5c 78%, #2c3a6e 100%)' },
  cloud: { day: 'linear-gradient(180deg, #5a7794 0%, #7e98b4 46%, #a6bacf 78%, #c6d4e2 100%)', night: 'linear-gradient(180deg, #0b0f1a 0%, #161d2e 50%, #232c40 80%, #2f3950 100%)' },
  rain: { day: 'linear-gradient(180deg, #2c3a49 0%, #41566a 45%, #5a7187 78%, #738a9d 100%)', night: 'linear-gradient(180deg, #05080f 0%, #0e141f 48%, #18212f 80%, #222c3c 100%)' },
  snow: { day: 'linear-gradient(180deg, #6a7c95 0%, #91a4bd 42%, #bccbdd 76%, #dfe8f1 100%)', night: 'linear-gradient(180deg, #0e1422 0%, #1c2538 50%, #2c3852 80%, #3c4a68 100%)' },
  thunder: { day: 'linear-gradient(180deg, #232a36 0%, #353d4d 48%, #495263 78%, #5b6478 100%)', night: 'linear-gradient(180deg, #04060c 0%, #0c1019 50%, #161b28 80%, #1f2533 100%)' },
  fog: { day: 'linear-gradient(180deg, #7d8693 0%, #9aa3b0 46%, #bcc3cd 78%, #d6dbe2 100%)', night: 'linear-gradient(180deg, #10141b 0%, #1e232d 50%, #2d343f 80%, #3a414e 100%)' },
};

export const FORECAST_URL = (lat: number, lon: number): string =>
  `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day` +
  `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;

export const GEO_URL = (q: string): string =>
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`;

export const DEFAULT_CITY: Candidate = { name: 'New York', lat: 40.7128, lon: -74.006 };

const round = (n: number | undefined): number => Math.round(typeof n === 'number' && Number.isFinite(n) ? n : 0);

function geoLabel(g: GeoResult): string {
  const parts: string[] = [];
  if (g.name) parts.push(g.name);
  const region = g.admin1 && g.admin1 !== g.name ? g.admin1 : '';
  if (region) parts.push(region);
  if (g.country && g.country !== g.name && g.country !== region) parts.push(g.country);
  return parts.join(' · ') || (g.name ?? 'Unknown Location');
}

export function weekday(date: string, idx: number): string {
  if (idx === 0) return 'Today';
  const t = Date.parse(date + 'T00:00:00');
  if (Number.isNaN(t)) return '';
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[new Date(t).getDay()] ?? '';
}

export function dayMonth(date: string): string {
  const t = Date.parse(date + 'T00:00:00');
  if (Number.isNaN(t)) return '';
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

export function parseForecast(body: string): Forecast {
  const data = JSON.parse(body) as ForecastResponse;
  if (data?.error) throw new Error(data?.reason || 'The weather service returned an error');
  const c = data?.current;
  if (!c || typeof c.temperature_2m !== 'number') throw new Error('No current weather data received');
  const now: Now = {
    temp: round(c.temperature_2m),
    feels: round(c.apparent_temperature ?? c.temperature_2m),
    humidity: round(c.relative_humidity_2m),
    wind: round(c.wind_speed_10m),
    code: typeof c.weather_code === 'number' ? c.weather_code : 0,
    isDay: c.is_day !== 0,
  };
  const d = data?.daily;
  const times = d?.time ?? [];
  const days: DayCell[] = times.map((t, i) => ({
    date: t, code: d?.weather_code?.[i] ?? 0, max: round(d?.temperature_2m_max?.[i]), min: round(d?.temperature_2m_min?.[i]),
  }));
  return { now, days };
}

export function parseGeo(body: string): Candidate[] {
  const data = JSON.parse(body) as GeoResponse;
  return (data?.results ?? [])
    .filter((g) => typeof g.latitude === 'number' && typeof g.longitude === 'number')
    .map((g) => ({ name: geoLabel(g), lat: g.latitude as number, lon: g.longitude as number }));
}
