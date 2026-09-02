import { useWeather } from './lib/useWeather';
import WeatherScene from './WeatherScene';
import { NowCard } from './components/NowCard';
import { Forecast7 } from './components/Forecast7';
import { CityBar } from './components/CityBar';
import { SearchOverlay } from './components/SearchOverlay';
import './style.css';

// ──────────────────────────────────────────────────────────────
// Weather — live conditions + 7-day forecast. Open-Meteo (free, no key).
// The sky shifts as a whole with "condition + time of day"; switching cities
// transitions the scene smoothly. This file only assembles the layout:
// data/logic lives in lib/useWeather, the sky in WeatherScene, the views in
// components/, and city data in db.ts.
// ──────────────────────────────────────────────────────────────

export default function Weather({ appId }: { appId: string }) {
  const wx = useWeather(appId);
  const { forecast, error, loading, cond, isDay, sky, bg, active } = wx;

  return (
    <div className={`wx-root ${isDay ? 'is-day' : 'is-night'} sky-${sky}`} style={{ ['--wx-bg' as string]: bg }}>
      <div className="wx-scene" key={`scene-${sky}-${isDay ? 'd' : 'n'}`}>
        <WeatherScene sky={sky} isDay={isDay} />
      </div>
      <div className="wx-scrim" aria-hidden="true" />

      {/* header: city + search */}
      <header className="wx-head">
        <div className="wx-place">
          <span className="wx-pin" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c-3.9 0-7 3.1-7 7 0 5 7 13 7 13s7-8 7-13c0-3.9-3.1-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" /></svg>
          </span>
          <span className="wx-place-name">{active?.name ?? 'Weather'}</span>
          {active?.is_default === 1 && <span className="wx-default-tag">Default</span>}
        </div>
        <button className="wx-icon-btn" onClick={() => wx.setSearchOpen(true)} aria-label="Search cities">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.3-4.3" /></svg>
        </button>
      </header>

      {/* main scroll */}
      <main className="wx-main">
        {error && !forecast ? (
          <div className="wx-state">
            <div className="wx-state-emoji">🛰️</div>
            <div className="wx-state-title">Couldn't get the weather</div>
            <div className="wx-state-sub">{error}</div>
            <button className="wx-retry" onClick={wx.retry} disabled={loading}>
              <span className={`wx-retry-ic ${loading ? 'spin' : ''}`}>↻</span>{loading ? 'Retrying…' : 'Retry'}
            </button>
          </div>
        ) : !forecast ? (
          <div className="wx-now wx-now-skeleton">
            <div className="wx-skel wx-skel-icon" />
            <div className="wx-skel wx-skel-temp" />
            <div className="wx-skel wx-skel-line" />
            <div className="wx-skel-row">
              <div className="wx-skel wx-skel-stat" /><div className="wx-skel wx-skel-stat" /><div className="wx-skel wx-skel-stat" />
            </div>
          </div>
        ) : (
          <div className="wx-morph" key={wx.morphKey}>
            {error && <div className="wx-inline-err">⚠ Refresh failed: {error}</div>}
            <NowCard forecast={forecast} cond={cond} loading={loading} />
            <Forecast7 forecast={forecast} frac={wx.frac} />
          </div>
        )}

        <CityBar wx={wx} />
      </main>

      {wx.searchOpen && <SearchOverlay wx={wx} />}
    </div>
  );
}
