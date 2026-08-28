// 天气 —— 逻辑与视图。原 React 版的 useWeather + 四个组件,平移成纯 JS。
import { sceneSvg } from "./scene.js";

const $ = (s) => document.querySelector(s);
const api = (p, body) =>
  fetch(p, body ? { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) } : undefined)
    .then((r) => r.json());

// WMO 天况码 → 中文 + emoji + 天空类型  https://open-meteo.com/en/docs
const CONDITIONS = {
  0: ["晴", "sun", "clear"], 1: ["大致晴朗", "sun1", "clear"], 2: ["局部多云", "partly", "cloud"],
  3: ["阴", "☁️", "cloud"], 45: ["有雾", "🌫️", "fog"], 48: ["雾凇", "🌫️", "fog"],
  51: ["小毛毛雨", "🌦️", "rain"], 53: ["毛毛雨", "🌦️", "rain"], 55: ["浓毛毛雨", "🌧️", "rain"],
  56: ["冻毛毛雨", "🌧️", "rain"], 57: ["浓冻毛毛雨", "🌧️", "rain"],
  61: ["小雨", "🌦️", "rain"], 63: ["中雨", "🌧️", "rain"], 65: ["大雨", "🌧️", "rain"],
  66: ["冻雨", "🌧️", "rain"], 67: ["强冻雨", "🌧️", "rain"],
  71: ["小雪", "🌨️", "snow"], 73: ["中雪", "🌨️", "snow"], 75: ["大雪", "❄️", "snow"], 77: ["雪粒", "🌨️", "snow"],
  80: ["阵雨", "🌦️", "rain"], 81: ["强阵雨", "🌧️", "rain"], 82: ["暴雨", "⛈️", "rain"],
  85: ["阵雪", "🌨️", "snow"], 86: ["强阵雪", "❄️", "snow"],
  95: ["雷阵雨", "⛈️", "thunder"], 96: ["雷阵雨伴冰雹", "⛈️", "thunder"], 99: ["强雷雨伴冰雹", "⛈️", "thunder"],
};

function describe(code, isDay) {
  const hit = CONDITIONS[code];
  if (!hit) return { label: "未知", icon: isDay ? "⛅" : "☁️", sky: "cloud" };
  const [label, icon, sky] = hit;
  if (icon === "sun") return { label, icon: isDay ? "☀️" : "🌙", sky };
  if (icon === "sun1") return { label, icon: isDay ? "🌤️" : "🌙", sky };
  if (icon === "partly") return { label, icon: isDay ? "⛅" : "☁️", sky };
  return { label, icon, sky };
}

const SKY_GRADIENT = {
  clear: { day: "linear-gradient(180deg, #1e6fe0 0%, #3f93f2 38%, #74b8fa 72%, #a9d6fb 100%)", night: "linear-gradient(180deg, #060a1f 0%, #0e1640 44%, #1d2a5c 78%, #2c3a6e 100%)" },
  cloud: { day: "linear-gradient(180deg, #5a7794 0%, #7e98b4 46%, #a6bacf 78%, #c6d4e2 100%)", night: "linear-gradient(180deg, #0b0f1a 0%, #161d2e 50%, #232c40 80%, #2f3950 100%)" },
  rain: { day: "linear-gradient(180deg, #2c3a49 0%, #41566a 45%, #5a7187 78%, #738a9d 100%)", night: "linear-gradient(180deg, #05080f 0%, #0e141f 48%, #18212f 80%, #222c3c 100%)" },
  snow: { day: "linear-gradient(180deg, #6a7c95 0%, #91a4bd 42%, #bccbdd 76%, #dfe8f1 100%)", night: "linear-gradient(180deg, #0e1422 0%, #1c2538 50%, #2c3852 80%, #3c4a68 100%)" },
  thunder: { day: "linear-gradient(180deg, #232a36 0%, #353d4d 48%, #495263 78%, #5b6478 100%)", night: "linear-gradient(180deg, #04060c 0%, #0c1019 50%, #161b28 80%, #1f2533 100%)" },
  fog: { day: "linear-gradient(180deg, #7d8693 0%, #9aa3b0 46%, #bcc3cd 78%, #d6dbe2 100%)", night: "linear-gradient(180deg, #10141b 0%, #1e232d 50%, #2d343f 80%, #3a414e 100%)" },
};

const round = (n) => Math.round(Number.isFinite(n) ? n : 0);
const WEEK = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
const weekday = (date, i) => {
  if (i === 0) return "今天";
  const t = Date.parse(date + "T00:00:00");
  return Number.isNaN(t) ? "" : WEEK[new Date(t).getDay()];
};
const dayMonth = (date) => {
  const t = Date.parse(date + "T00:00:00");
  if (Number.isNaN(t)) return "";
  const d = new Date(t);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

// ── 状态 ──
const state = { cities: [], activeId: null, forecast: null, error: "", loading: false, lastSceneKey: "" };

function parseForecast(data) {
  const c = data?.current;
  if (!c || typeof c.temperature_2m !== "number") throw new Error("没有拿到当前天气数据");
  const now = {
    temp: round(c.temperature_2m), feels: round(c.apparent_temperature ?? c.temperature_2m),
    humidity: round(c.relative_humidity_2m), wind: round(c.wind_speed_10m),
    code: typeof c.weather_code === "number" ? c.weather_code : 0, isDay: c.is_day !== 0,
  };
  const d = data?.daily || {};
  const days = (d.time || []).map((t, i) => ({
    date: t, code: d.weather_code?.[i] ?? 0,
    max: round(d.temperature_2m_max?.[i]), min: round(d.temperature_2m_min?.[i]),
  }));
  return { now, days };
}

async function loadCities(selectId) {
  const { cities } = await api("/api/cities");
  state.cities = cities || [];
  state.activeId = selectId
    ?? state.cities.find((c) => c.id === state.activeId)?.id
    ?? state.cities.find((c) => c.is_default === 1)?.id
    ?? state.cities[0]?.id
    ?? null;
}

async function loadForecast() {
  const city = state.cities.find((c) => c.id === state.activeId);
  if (!city) { state.forecast = null; return; }
  state.loading = true; render();
  try {
    const data = await api(`/api/forecast?lat=${city.lat}&lon=${city.lon}`);
    if (data.error) throw new Error(data.error);
    state.forecast = parseForecast(data);
    state.error = "";
  } catch (e) {
    state.error = String(e?.message || e);
  } finally {
    state.loading = false;
    render();
  }
}

// ── 渲染 ──
function render() {
  const { forecast, error, loading } = state;
  const city = state.cities.find((c) => c.id === state.activeId);
  const cond = forecast ? describe(forecast.now.code, forecast.now.isDay) : null;
  const isDay = forecast ? forecast.now.isDay : true;
  const sky = cond?.sky || "clear";

  const root = $(".wx-root");
  root.className = `wx-root ${isDay ? "is-day" : "is-night"} sky-${sky}`;
  root.style.setProperty("--wx-bg", SKY_GRADIENT[sky][isDay ? "day" : "night"]);

  // 天况没变就不重建 SVG(重建会把动画打回原点)
  const sceneKey = `${sky}-${isDay ? "d" : "n"}`;
  if (sceneKey !== state.lastSceneKey) {
    $(".wx-scene").innerHTML = sceneSvg(sky, isDay);
    state.lastSceneKey = sceneKey;
  }

  $(".wx-place-name").textContent = city?.name || "天气";
  $(".wx-default-tag").hidden = city?.is_default !== 1;
  document.title = city ? `天气 — ${city.name}` : "天气";
  window.wandesk?.ui.title(city ? `天气 — ${city.name}` : "天气");

  // 主体
  const main = $(".wx-body");
  if (error && !forecast) {
    main.innerHTML = `<div class="wx-state">
      <div class="wx-state-emoji">🛰️</div>
      <div class="wx-state-title">没拿到天气</div>
      <div class="wx-state-sub">${esc(error)}</div>
      <button class="wx-retry" id="retry"${loading ? " disabled" : ""}>
        <span class="wx-retry-ic${loading ? " spin" : ""}">↻</span>${loading ? "重试中…" : "重试"}
      </button>
    </div>`;
  } else if (!forecast) {
    main.innerHTML = `<div class="wx-now wx-now-skeleton">
      <div class="wx-skel wx-skel-icon"></div><div class="wx-skel wx-skel-temp"></div>
      <div class="wx-skel wx-skel-line"></div>
      <div class="wx-skel-row"><div class="wx-skel wx-skel-stat"></div><div class="wx-skel wx-skel-stat"></div><div class="wx-skel wx-skel-stat"></div></div>
    </div>`;
  } else {
    const d0 = forecast.days[0];
    // 高低温条:把每天的区间摆在本周的整体区间里
    const lows = forecast.days.map((d) => d.min), highs = forecast.days.map((d) => d.max);
    const lo = Math.min(...lows), hi = Math.max(...highs);
    const frac = (t) => (hi === lo ? 0.5 : (t - lo) / (hi - lo));

    main.innerHTML = `
      ${error ? `<div class="wx-inline-err">⚠ 刷新失败:${esc(error)}</div>` : ""}
      <section class="wx-now${loading ? " is-loading" : ""}">
        <div class="wx-now-temp"><span class="wx-now-temp-num">${forecast.now.temp}</span><span class="wx-deg">°</span></div>
        <div class="wx-now-cond">${esc(cond.label)}</div>
        ${d0 ? `<div class="wx-now-hilo">
          <span class="wx-now-hi"><span class="wx-hilo-k">高</span> ${d0.max}°</span>
          <span class="wx-now-dot"></span>
          <span class="wx-now-lo"><span class="wx-hilo-k">低</span> ${d0.min}°</span>
        </div>` : ""}
        <div class="wx-now-stats">
          <div class="wx-stat"><span class="wx-stat-ic">🌡️</span><span class="wx-stat-v">${forecast.now.feels}°</span><span class="wx-stat-k">体感</span></div>
          <div class="wx-stat"><span class="wx-stat-ic">💧</span><span class="wx-stat-v">${forecast.now.humidity}%</span><span class="wx-stat-k">湿度</span></div>
          <div class="wx-stat"><span class="wx-stat-ic">💨</span><span class="wx-stat-v">${forecast.now.wind}<small> km/h</small></span><span class="wx-stat-k">风速</span></div>
        </div>
      </section>
      <section class="wx-forecast">
        <div class="wx-forecast-title">未来 7 天</div>
        <div class="wx-fc-list">${forecast.days.map((d, i) => {
          const dc = describe(d.code, true);
          const left = Math.max(0, Math.min(1, frac(d.min))) * 100;
          const right = Math.max(0, Math.min(1, frac(d.max))) * 100;
          return `<div class="wx-fc-row${i === 0 ? " today" : ""}">
            <div class="wx-fc-day"><span class="wx-fc-name">${weekday(d.date, i)}</span><span class="wx-fc-date">${dayMonth(d.date)}</span></div>
            <span class="wx-fc-icon" title="${esc(dc.label)}">${dc.icon}</span>
            <span class="wx-fc-min">${d.min}°</span>
            <span class="wx-fc-track"><span class="wx-fc-fill" style="left:${left.toFixed(1)}%;width:${Math.max(6, right - left).toFixed(1)}%"></span></span>
            <span class="wx-fc-max">${d.max}°</span>
          </div>`;
        }).join("")}</div>
      </section>`;
  }

  // 我的城市
  const bar = $(".wx-citybar");
  bar.innerHTML = state.cities.length ? `
    <div class="wx-cities-title">我的城市</div>
    <div class="wx-chips">
      ${state.cities.map((c) => `<div class="wx-chip${c.id === state.activeId ? " on" : ""}" data-city="${c.id}">
        <span class="wx-chip-name">${esc(c.name)}</span>
        ${c.is_default === 1
          ? `<span class="wx-chip-star on" title="默认城市">★</span>`
          : `<button class="wx-chip-star" data-star="${c.id}" title="设为默认">☆</button>`}
        ${state.cities.length > 1 ? `<button class="wx-chip-del" data-del="${c.id}" title="移除">✕</button>` : ""}
      </div>`).join("")}
      <button class="wx-chip wx-chip-add" id="add">＋ 添加</button>
    </div>` : "";
}

// ── 交互 ──
document.addEventListener("click", async (e) => {
  if (e.target.closest("#retry")) return loadForecast();
  if (e.target.closest("#add") || e.target.closest(".wx-icon-btn")) return openSearch();

  const star = e.target.closest("[data-star]");
  if (star) { await api("/api/default", { id: Number(star.dataset.star) }); await loadCities(); return render(); }

  const del = e.target.closest("[data-del]");
  if (del) {
    const id = Number(del.dataset.del);
    await api("/api/remove", { id });
    await loadCities(id === state.activeId ? undefined : state.activeId);
    return loadForecast();
  }

  const chip = e.target.closest("[data-city]");
  if (chip) {
    const id = Number(chip.dataset.city);
    if (id === state.activeId) return;
    state.activeId = id;
    return loadForecast();
  }
});

// ── 搜索浮层 ──
function openSearch() {
  const box = $(".wx-search");
  box.hidden = false;
  box.innerHTML = `
    <div class="wx-search-overlay">
      <div class="wx-search-panel">
        <div class="wx-search-bar">
          <span class="wx-search-ic">🔍</span>
          <input class="wx-search-input" id="q" placeholder="搜索城市,如「上海」「Tokyo」" autocomplete="off" />
          <button class="wx-search-close" id="close">取消</button>
        </div>
        <div class="wx-search-results" id="results">
          <div class="wx-search-hint">输入城市名开始搜索</div>
        </div>
      </div>
    </div>`;

  const q = $("#q");
  q.focus();
  let timer = 0;
  q.addEventListener("input", () => {
    clearTimeout(timer);
    const text = q.value.trim();
    if (!text) return ($("#results").innerHTML = `<div class="wx-search-hint">输入城市名开始搜索</div>`);
    $("#results").innerHTML = `<div class="wx-search-hint"><span class="wx-dots"><i></i><i></i><i></i></span> 正在搜索…</div>`;
    timer = setTimeout(async () => {
      const { results, error } = await api(`/api/geo?q=${encodeURIComponent(text)}`);
      $("#results").innerHTML = error
        ? `<div class="wx-search-hint err">${esc(error)}</div>`
        : (results || []).length
          ? results.map((r) => `<button class="wx-search-item" data-lat="${r.lat}" data-lon="${r.lon}" data-name="${esc(r.name)}">
              <span class="wx-search-item-pin">📍</span>
              <span class="wx-search-item-name">${esc(r.name)}</span>
              <span class="wx-search-item-add">＋</span>
            </button>`).join("")
          : `<div class="wx-search-hint">没有找到「${esc(text)}」</div>`;
    }, 280);
  });

  box.addEventListener("click", async (e) => {
    // 点遮罩或「取消」都关掉;点面板内部不关
    if (e.target.closest("#close") || !e.target.closest(".wx-search-panel")) { box.hidden = true; return; }
    const item = e.target.closest(".wx-search-item");
    if (!item) return;
    const { id } = await api("/api/add", { name: item.dataset.name, lat: Number(item.dataset.lat), lon: Number(item.dataset.lon) });
    box.hidden = true;
    await loadCities(id);
    await loadForecast();
  });
}

// ── 启动 ──
(async () => {
  render();            // 先画骨架:城市与天气都要走网络,别让窗口白着
  await loadCities();
  render();
  await loadForecast();
  // 每 10 分钟刷一次;窗口重新可见也刷
  setInterval(() => { if (!document.hidden) loadForecast(); }, 600000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) loadForecast(); });
})();
