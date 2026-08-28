// 我的城市:城市芯片(切换 / 设默认 / 移除)+ 添加。
import type { WeatherState } from '../lib/useWeather';

export function CityBar({ wx }: { wx: WeatherState }) {
  const { cities, activeId } = wx;
  if (cities.length === 0) return null;
  return (
    <section className="wx-cities">
      <div className="wx-cities-title">我的城市</div>
      <div className="wx-chips">
        {cities.map((c) => (
          <div key={c.id} className={`wx-chip ${c.id === activeId ? 'on' : ''}`} onClick={() => wx.switchCity(c.id)}>
            <span className="wx-chip-name">{c.name}</span>
            {c.is_default !== 1 && (
              <button className="wx-chip-star" title="设为默认" onClick={(e) => { e.stopPropagation(); wx.makeDefault(c.id); }}>☆</button>
            )}
            {c.is_default === 1 && <span className="wx-chip-star on" title="默认城市">★</span>}
            {cities.length > 1 && (
              <button className="wx-chip-del" title="移除" onClick={(e) => { e.stopPropagation(); wx.removeCity(c.id); }}>✕</button>
            )}
          </div>
        ))}
        <button className="wx-chip wx-chip-add" onClick={() => wx.setSearchOpen(true)}>＋ 添加</button>
      </div>
    </section>
  );
}
