// 当前天气大卡:温度 + 天况 + 今日高低 + 体感/湿度/风速。
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
          <span className="wx-now-hi"><span className="wx-hilo-k">高</span> {forecast.days[0].max}°</span>
          <span className="wx-now-dot" />
          <span className="wx-now-lo"><span className="wx-hilo-k">低</span> {forecast.days[0].min}°</span>
        </div>
      )}

      <div className="wx-now-stats">
        <div className="wx-stat">
          <span className="wx-stat-ic" aria-hidden="true">🌡️</span>
          <span className="wx-stat-v">{forecast.now.feels}°</span>
          <span className="wx-stat-k">体感</span>
        </div>
        <div className="wx-stat">
          <span className="wx-stat-ic" aria-hidden="true">💧</span>
          <span className="wx-stat-v">{forecast.now.humidity}%</span>
          <span className="wx-stat-k">湿度</span>
        </div>
        <div className="wx-stat">
          <span className="wx-stat-ic" aria-hidden="true">💨</span>
          <span className="wx-stat-v">{forecast.now.wind}<small> km/h</small></span>
          <span className="wx-stat-k">风速</span>
        </div>
      </div>
    </section>
  );
}
