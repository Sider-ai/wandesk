// Current-weather hero card: temperature + condition + today's high/low + feels-like/humidity/wind.
import type { Condition, Forecast } from '../lib/types';

export function NowCard({ forecast, cond, loading }: { forecast: Forecast; cond: Condition | null; loading: boolean }) {
  return (
    <section className={`wx-now ${loading ? 'is-loading' : ''}`}>
      <div className="wx-now-temp">
        <span className="wx-now-temp-num">{forecast.now.temp}</span>
        <span className="wx-deg">°</span>
      </div>
      <div className="wx-now-cond">{cond?.label}</div>

      {forecast.days[0] && (
        <div className="wx-now-hilo">
          <span className="wx-now-hi"><span className="wx-hilo-k">H</span> {forecast.days[0].max}°</span>
          <span className="wx-now-dot" />
          <span className="wx-now-lo"><span className="wx-hilo-k">L</span> {forecast.days[0].min}°</span>
        </div>
      )}

      <div className="wx-now-stats">
        <div className="wx-stat">
          <span className="wx-stat-ic" aria-hidden="true">🌡️</span>
          <span className="wx-stat-v">{forecast.now.feels}°</span>
          <span className="wx-stat-k">Feels like</span>
        </div>
        <div className="wx-stat">
          <span className="wx-stat-ic" aria-hidden="true">💧</span>
          <span className="wx-stat-v">{forecast.now.humidity}%</span>
          <span className="wx-stat-k">Humidity</span>
        </div>
        <div className="wx-stat">
          <span className="wx-stat-ic" aria-hidden="true">💨</span>
          <span className="wx-stat-v">{forecast.now.wind}<small> km/h</small></span>
          <span className="wx-stat-k">Wind</span>
        </div>
      </div>
    </section>
  );
}
