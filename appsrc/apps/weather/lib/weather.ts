// 天气 — WMO 天况映射、天空渐变、上游 URL、解析与展示辅助(纯函数)。
import type { Candidate, Condition, Forecast, ForecastResponse, GeoResponse, GeoResult, Now, SkyKind, DayCell } from './types';

// WMO weather_code → condition (zh label + emoji)  https://open-meteo.com/en/docs
export function describe(code: number, isDay: boolean): Condition {
  const sun = isDay ? '☀️' : '🌙';
  const partly = isDay ? '⛅' : '☁️';
  switch (code) {
    case 0: return { label: '晴', icon: sun, sky: 'clear' };
    case 1: return { label: '大致晴朗', icon: isDay ? '🌤️' : '🌙', sky: 'clear' };
    case 2: return { label: '局部多云', icon: partly, sky: 'cloud' };
    case 3: return { label: '阴', icon: '☁️', sky: 'cloud' };
    case 45: return { label: '有雾', icon: '🌫️', sky: 'fog' };
    case 48: return { label: '雾凇', icon: '🌫️', sky: 'fog' };
    case 51: return { label: '小毛毛雨', icon: '🌦️', sky: 'rain' };
    case 53: return { label: '毛毛雨', icon: '🌦️', sky: 'rain' };
    case 55: return { label: '浓毛毛雨', icon: '🌧️', sky: 'rain' };
    case 56: return { label: '冻毛毛雨', icon: '🌧️', sky: 'rain' };
    case 57: return { label: '浓冻毛毛雨', icon: '🌧️', sky: 'rain' };
    case 61: return { label: '小雨', icon: '🌦️', sky: 'rain' };
    case 63: return { label: '中雨', icon: '🌧️', sky: 'rain' };
    case 65: return { label: '大雨', icon: '🌧️', sky: 'rain' };
    case 66: return { label: '冻雨', icon: '🌧️', sky: 'rain' };
    case 67: return { label: '强冻雨', icon: '🌧️', sky: 'rain' };
    case 71: return { label: '小雪', icon: '🌨️', sky: 'snow' };
    case 73: return { label: '中雪', icon: '🌨️', sky: 'snow' };
    case 75: return { label: '大雪', icon: '❄️', sky: 'snow' };
    case 77: return { label: '雪粒', icon: '🌨️', sky: 'snow' };
    case 80: return { label: '阵雨', icon: '🌦️', sky: 'rain' };
    case 81: return { label: '强阵雨', icon: '🌧️', sky: 'rain' };
    case 82: return { label: '暴雨', icon: '⛈️', sky: 'rain' };
    case 85: return { label: '阵雪', icon: '🌨️', sky: 'snow' };
    case 86: return { label: '强阵雪', icon: '❄️', sky: 'snow' };
    case 95: return { label: '雷阵雨', icon: '⛈️', sky: 'thunder' };
    case 96: return { label: '雷阵雨伴冰雹', icon: '⛈️', sky: 'thunder' };
    case 99: return { label: '强雷雨伴冰雹', icon: '⛈️', sky: 'thunder' };
    default: return { label: '未知', icon: partly, sky: 'cloud' };
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
  `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=zh&format=json`;

export const DEFAULT_CITY: Candidate = { name: '北京', lat: 39.9042, lon: 116.4074 };

const round = (n: number | undefined): number => Math.round(typeof n === 'number' && Number.isFinite(n) ? n : 0);

function geoLabel(g: GeoResult): string {
  const parts: string[] = [];
  if (g.name) parts.push(g.name);
  const region = g.admin1 && g.admin1 !== g.name ? g.admin1 : '';
  if (region) parts.push(region);
  if (g.country && g.country !== g.name && g.country !== region) parts.push(g.country);
  return parts.join(' · ') || (g.name ?? '未知地点');
}

export function weekday(date: string, idx: number): string {
  if (idx === 0) return '今天';
  const t = Date.parse(date + 'T00:00:00');
  if (Number.isNaN(t)) return '';
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
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
  if (data?.error) throw new Error(data?.reason || '天气服务返回了错误');
  const c = data?.current;
  if (!c || typeof c.temperature_2m !== 'number') throw new Error('没有拿到当前天气数据');
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
