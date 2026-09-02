// My cities: city chips (switch / set default / remove) + add.
import type { WeatherState } from '../lib/useWeather';

export function CityBar({ wx }: { wx: WeatherState }) {
  const { cities, activeId } = wx;
  if (cities.length === 0) return null;
  return (
    <section className="wx-cities">
      <div className="wx-cities-title">My Cities</div>
      <div className="wx-chips">
        {cities.map((c) => (
          <div key={c.id} className={`wx-chip ${c.id === activeId ? 'on' : ''}`} onClick={() => wx.switchCity(c.id)}>
            <span className="wx-chip-name">{c.name}</span>
            {c.is_default !== 1 && (
              <button className="wx-chip-star" title="Set as default" onClick={(e) => { e.stopPropagation(); wx.makeDefault(c.id); }}>☆</button>
            )}
            {c.is_default === 1 && <span className="wx-chip-star on" title="Default city">★</span>}
            {cities.length > 1 && (
              <button className="wx-chip-del" title="Remove" onClick={(e) => { e.stopPropagation(); wx.removeCity(c.id); }}>✕</button>
            )}
          </div>
        ))}
        <button className="wx-chip wx-chip-add" onClick={() => wx.setSearchOpen(true)}>＋ Add</button>
      </div>
    </section>
  );
}
