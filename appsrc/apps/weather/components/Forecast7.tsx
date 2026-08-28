// 未来 7 天:每天图标 + 高低温 + 一条落在本周区间里的高低温条。
import type { Forecast } from '../lib/types';
import { describe, dayMonth, weekday } from '../lib/weather';

export function Forecast7({ forecast, frac }: { forecast: Forecast; frac: (t: number) => number }) {
  if (forecast.days.length === 0) return null;
  return (
    <section className="wx-forecast">
      <div className="wx-forecast-title">未来 7 天</div>
      <div className="wx-fc-list">
        {forecast.days.map((d, i) => {
          const dc = describe(d.code, true);
          const left = Math.max(0, Math.min(1, frac(d.min)));
          const right = Math.max(0, Math.min(1, frac(d.max)));
          return (
            <div key={d.date} className={`wx-fc-row ${i === 0 ? 'today' : ''}`}>
              <div className="wx-fc-day">
                <span className="wx-fc-name">{weekday(d.date, i)}</span>
                <span className="wx-fc-date">{dayMonth(d.date)}</span>
              </div>
              <span className="wx-fc-icon" title={dc.label}>{dc.icon}</span>
              <span className="wx-fc-min">{d.min}°</span>
              <span className="wx-fc-track">
                <span className="wx-fc-fill" style={{ left: `${(left * 100).toFixed(1)}%`, width: `${Math.max(6, (right - left) * 100).toFixed(1)}%` }} />
              </span>
              <span className="wx-fc-max">{d.max}°</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
