// 天气 — 状态、取数、城市管理与搜索都收进这个 hook;index 只做布局组装。
import { useEffect, useMemo, useRef, useState } from 'react';
import { proxy } from '../../../system/lib/http';
import * as data from '../db';
import { DEFAULT_CITY, FORECAST_URL, GEO_URL, SKY_GRADIENT, describe, parseForecast, parseGeo } from './weather';
import type { Candidate, City, Forecast, SkyKind } from './types';

export function useWeather(appId: string) {
  const [cities, setCities] = useState<City[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [morphKey, setMorphKey] = useState(0); // bumps to re-trigger entrance/morph on city change

  // search UI
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Candidate[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchErr, setSearchErr] = useState('');
  const searchSeq = useRef(0);

  const active = useMemo(() => cities.find((c) => c.id === activeId) ?? null, [cities, activeId]);

  // ── initial load: read saved cities, seed a default if empty ──
  useEffect(() => {
    (async () => {
      let rows = await data.loadCities(appId);
      if (rows.length === 0) {
        const id = await data.insertCity(appId, DEFAULT_CITY.name, DEFAULT_CITY.lat, DEFAULT_CITY.lon, 1, 0);
        rows = [{ id, name: DEFAULT_CITY.name, lat: DEFAULT_CITY.lat, lon: DEFAULT_CITY.lon, is_default: 1, sort: 0 }];
      }
      setCities(rows);
      setActiveId((rows.find((c) => c.is_default === 1) ?? rows[0])?.id ?? null);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── fetch forecast whenever the active city changes ──
  useEffect(() => {
    if (active) loadForecast(active.lat, active.lon);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  async function loadForecast(lat: number, lon: number) {
    setLoading(true);
    setError('');
    const res = await proxy(appId, FORECAST_URL(lat, lon));
    if (!res.ok || res.status === undefined || res.status >= 400 || !res.body) {
      setError(res.error || (res.status ? `请求失败 (HTTP ${res.status})` : '网络不太给力'));
      setLoading(false);
      return;
    }
    try {
      setForecast(parseForecast(res.body));
      setMorphKey((k) => k + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : '解析天气数据出错了');
    } finally {
      setLoading(false);
    }
  }

  const retry = () => { if (active) loadForecast(active.lat, active.lon); };

  // ── city search (geocoding) ──
  async function runSearch(q: string) {
    const term = q.trim();
    if (!term) { setResults([]); setSearchErr(''); setSearching(false); return; }
    const seq = ++searchSeq.current;
    setSearching(true);
    setSearchErr('');
    const res = await proxy(appId, GEO_URL(term));
    if (seq !== searchSeq.current) return; // a newer search superseded us
    if (!res.ok || res.status === undefined || res.status >= 400 || !res.body) {
      setSearchErr(res.error || '搜索失败,稍后再试');
      setResults([]); setSearching(false);
      return;
    }
    try { setResults(parseGeo(res.body)); }
    catch { setSearchErr('没看懂搜索结果'); setResults([]); }
    finally { if (seq === searchSeq.current) setSearching(false); }
  }

  useEffect(() => {
    if (!searchOpen) return;
    const id = setTimeout(() => runSearch(query), 350); // debounce
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, searchOpen]);

  function closeSearch() { setSearchOpen(false); setQuery(''); setResults([]); setSearchErr(''); }

  async function addCity(c: Candidate) {
    const dup = cities.find((x) => Math.abs(x.lat - c.lat) < 0.01 && Math.abs(x.lon - c.lon) < 0.01);
    if (dup) { setActiveId(dup.id); closeSearch(); return; }
    const nextSort = cities.reduce((m, x) => Math.max(m, x.sort), 0) + 1;
    const id = await data.insertCity(appId, c.name, c.lat, c.lon, 0, nextSort);
    setCities((s) => [...s, { id, name: c.name, lat: c.lat, lon: c.lon, is_default: 0, sort: nextSort }]);
    setActiveId(id);
    closeSearch();
  }

  async function removeCity(id: number) {
    const remaining = cities.filter((c) => c.id !== id);
    await data.deleteCity(appId, id);
    const removed = cities.find((c) => c.id === id);
    if (removed?.is_default === 1 && remaining[0]) {
      await data.setDefaultCity(appId, remaining[0].id);
      remaining[0] = { ...remaining[0], is_default: 1 };
    }
    setCities(remaining);
    if (activeId === id) {
      setActiveId(remaining[0]?.id ?? null);
      if (!remaining[0]) { setForecast(null); setError(''); }
    }
  }

  async function makeDefault(id: number) {
    await data.setDefaultCity(appId, id);
    setCities((s) => s.map((c) => ({ ...c, is_default: c.id === id ? 1 : 0 })));
  }

  const switchCity = (id: number) => { if (id !== activeId) setActiveId(id); };

  // ── derive theme ──
  const cond = forecast ? describe(forecast.now.code, forecast.now.isDay) : null;
  const sky: SkyKind = cond?.sky ?? 'cloud';
  const isDay = forecast?.now.isDay ?? true;
  const bg = SKY_GRADIENT[sky][isDay ? 'day' : 'night'];

  // shared min/max across the 7 days → drives hi-lo bar geometry
  const range = useMemo(() => {
    const days = forecast?.days ?? [];
    if (days.length === 0) return { lo: 0, hi: 1 };
    let lo = Infinity, hi = -Infinity;
    for (const d of days) { if (d.min < lo) lo = d.min; if (d.max > hi) hi = d.max; }
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || hi === lo) return { lo, hi: lo + 1 };
    return { lo, hi };
  }, [forecast]);
  const frac = (t: number) => (t - range.lo) / (range.hi - range.lo);

  return {
    cities, activeId, active, forecast, loading, error, morphKey,
    searchOpen, setSearchOpen, query, setQuery, results, searching, searchErr,
    cond, sky, isDay, bg, frac,
    retry, addCity, removeCity, makeDefault, switchCity, closeSearch,
  };
}

export type WeatherState = ReturnType<typeof useWeather>;
