// 城市搜索浮层(geocoding),点结果即添加并切换过去。
import type { WeatherState } from '../lib/useWeather';

export function SearchOverlay({ wx }: { wx: WeatherState }) {
  const { query, results, searching, searchErr } = wx;
  return (
    <div className="wx-search-overlay" onClick={wx.closeSearch}>
      <div className="wx-search-panel" onClick={(e) => e.stopPropagation()}>
        <div className="wx-search-bar">
          <span className="wx-search-ic">🔍</span>
          <input
            className="wx-search-input"
            autoFocus
            value={query}
            onChange={(e) => wx.setQuery(e.target.value)}
            placeholder="搜索城市，如「上海」「Tokyo」"
          />
          <button className="wx-search-close" onClick={wx.closeSearch}>取消</button>
        </div>
        <div className="wx-search-results">
          {searching && <div className="wx-search-hint"><span className="wx-dots"><i /><i /><i /></span> 正在搜索…</div>}
          {!searching && searchErr && <div className="wx-search-hint err">{searchErr}</div>}
          {!searching && !searchErr && query.trim() && results.length === 0 && (
            <div className="wx-search-hint">没有找到「{query.trim()}」</div>
          )}
          {!searching && !query.trim() && <div className="wx-search-hint">输入城市名开始搜索</div>}
          {results.map((r, i) => (
            <button key={`${r.lat},${r.lon},${i}`} className="wx-search-item" onClick={() => wx.addCity(r)}>
              <span className="wx-search-item-pin">📍</span>
              <span className="wx-search-item-name">{r.name}</span>
              <span className="wx-search-item-add">＋</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
