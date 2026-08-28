// 会动的天空 —— 从 React 版逐层平移成纯 JS 的 SVG 构建器。
// 布局全部确定式(种子 PRNG,无 Math.random),同样的天况每次画出来一模一样。
export const W = 1000, H = 640;

const mulberry = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const STARS = (() => {
  const rnd = mulberry(7);
  return Array.from({ length: 90 }, () => {
    const big = rnd() > 0.86;
    return {
      x: +(rnd() * W).toFixed(1), y: +(rnd() * H * 0.62).toFixed(1),
      r: +((big ? 1.6 : 0.7) + rnd() * 0.9).toFixed(2), o: +(0.35 + rnd() * 0.6).toFixed(2),
      dur: +(2.4 + rnd() * 4).toFixed(2), delay: +(rnd() * 5).toFixed(2), big,
    };
  });
})();

const SHOOTERS = [
  { x: 760, y: 70, len: 150, dur: 7, delay: 1.5 },
  { x: 420, y: 130, len: 110, dur: 9, delay: 5.5 },
];

const makeCloud = (rnd) => {
  const n = 4 + Math.floor(rnd() * 3);
  const puffs = [];
  let x = 0;
  const baseR = 26 + rnd() * 16;
  for (let i = 0; i < n; i++) {
    const r = baseR * (0.55 + rnd() * 0.7);
    x += r * (0.7 + rnd() * 0.4);
    puffs.push({ cx: +x.toFixed(1), cy: +(-(rnd() * r * 0.5)).toFixed(1), r: +r.toFixed(1) });
  }
  puffs.unshift({ cx: +(x * 0.5).toFixed(1), cy: 4, r: +(baseR * 1.15).toFixed(1) }); // 胖肚子
  return { puffs, w: x + baseR };
};

const buildClouds = (count, seed, opMul) => {
  const rnd = mulberry(seed);
  return Array.from({ length: count }, () => {
    const { puffs, w } = makeCloud(rnd);
    return {
      puffs, w,
      y: +(40 + rnd() * (H * 0.5)).toFixed(1),
      scale: +(0.7 + rnd() * 1.0).toFixed(2),
      dur: +(46 + rnd() * 60).toFixed(1),
      delay: +(-rnd() * 70).toFixed(1),
      op: +((0.5 + rnd() * 0.5) * opMul).toFixed(2),
    };
  });
};

const CLOUDS_FEW = buildClouds(4, 21, 1);
const CLOUDS_MANY = buildClouds(7, 33, 1);

const RAIN = (() => {
  const rnd = mulberry(91);
  return Array.from({ length: 90 }, () => ({
    x: +(rnd() * W).toFixed(1), len: +(16 + rnd() * 26).toFixed(1),
    dur: +(0.5 + rnd() * 0.5).toFixed(2), delay: +(-rnd() * 1.2).toFixed(2),
    o: +(0.18 + rnd() * 0.4).toFixed(2), w: rnd() > 0.7 ? 2 : 1.3,
  }));
})();

const RIPPLES = (() => {
  const rnd = mulberry(53);
  return Array.from({ length: 14 }, () => ({
    x: +(rnd() * W).toFixed(1), y: +(H - 40 - rnd() * 60).toFixed(1),
    dur: +(2.2 + rnd() * 1.8).toFixed(2), delay: +(-rnd() * 4).toFixed(2),
  }));
})();

const SNOW = (() => {
  const rnd = mulberry(67);
  return Array.from({ length: 70 }, () => ({
    x: +(rnd() * W).toFixed(1), r: +(1.6 + rnd() * 3.4).toFixed(2),
    dur: +(7 + rnd() * 8).toFixed(2), delay: +(-rnd() * 12).toFixed(2),
    drift: +((rnd() - 0.5) * 80).toFixed(1), o: +(0.45 + rnd() * 0.5).toFixed(2),
    sway: +(2.4 + rnd() * 3).toFixed(2),
  }));
})();

const RAYS = Array.from({ length: 12 }, (_, i) => i * 30);
const BOLTS = [
  "M520 70 L470 250 L520 250 L450 470 L560 240 L512 240 Z",
  "M650 50 L610 210 L656 210 L590 430 L700 200 L656 200 Z",
];

// ── 各层 ──
const defs = () => `<defs>
  <radialGradient id="wxSun" cx="42%" cy="40%" r="62%">
    <stop offset="0%" stop-color="#fff9e4"/><stop offset="42%" stop-color="#ffe27a"/><stop offset="100%" stop-color="#ffb23d"/>
  </radialGradient>
  <radialGradient id="wxSunGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="rgba(255,224,130,0.55)"/><stop offset="55%" stop-color="rgba(255,210,110,0.18)"/><stop offset="100%" stop-color="rgba(255,210,110,0)"/>
  </radialGradient>
  <radialGradient id="wxMoon" cx="38%" cy="34%" r="70%">
    <stop offset="0%" stop-color="#fdfdf4"/><stop offset="62%" stop-color="#e9e8d6"/><stop offset="100%" stop-color="#c3c2ad"/>
  </radialGradient>
  <radialGradient id="wxMoonGlow" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="rgba(238,238,210,0.4)"/><stop offset="60%" stop-color="rgba(238,238,210,0.1)"/><stop offset="100%" stop-color="rgba(238,238,210,0)"/>
  </radialGradient>
  <linearGradient id="wxCloud" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#dfe7f2"/>
  </linearGradient>
  <linearGradient id="wxCloudDark" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="#aab4c6"/><stop offset="100%" stop-color="#7e889b"/>
  </linearGradient>
  <linearGradient id="wxRain" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="rgba(220,235,255,0)"/><stop offset="100%" stop-color="rgba(220,235,255,0.95)"/>
  </linearGradient>
  <filter id="wxSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3"/></filter>
</defs>`;

const sun = () => {
  const cx = 770, cy = 150;
  return `<g class="wx-svg-sun">
    <circle cx="${cx}" cy="${cy}" r="210" fill="url(#wxSunGlow)" class="wx-svg-sunglow"/>
    <g class="wx-svg-rays" style="transform-origin:${cx}px ${cy}px">
      ${RAYS.map((d) => `<rect x="${cx - 3}" y="${cy - 150}" width="6" height="54" rx="3" fill="rgba(255,236,170,0.7)" transform="rotate(${d} ${cx} ${cy})"/>`).join("")}
    </g>
    <circle cx="${cx}" cy="${cy}" r="66" fill="url(#wxSun)" class="wx-svg-suncore"/>
  </g>`;
};

const moon = () => {
  const cx = 778, cy = 146;
  return `<g class="wx-svg-moon">
    <circle cx="${cx}" cy="${cy}" r="150" fill="url(#wxMoonGlow)"/>
    <circle cx="${cx}" cy="${cy}" r="58" fill="url(#wxMoon)"/>
    <circle cx="${cx - 18}" cy="${cy - 14}" r="11" fill="rgba(150,150,128,0.28)"/>
    <circle cx="${cx + 16}" cy="${cy + 10}" r="8" fill="rgba(150,150,128,0.22)"/>
    <circle cx="${cx + 6}" cy="${cy - 22}" r="5" fill="rgba(150,150,128,0.2)"/>
    <circle cx="${cx - 8}" cy="${cy + 22}" r="6" fill="rgba(150,150,128,0.18)"/>
  </g>`;
};

const stars = () => `<g class="wx-svg-stars">
  ${STARS.map((s) => `<circle cx="${s.x}" cy="${s.y}" r="${s.r}" fill="#fff" opacity="${s.o}" class="wx-svg-star${s.big ? " big" : ""}" style="animation-duration:${s.dur}s;animation-delay:${s.delay}s"/>`).join("")}
  ${SHOOTERS.map((s) => `<line x1="${s.x}" y1="${s.y}" x2="${s.x + s.len}" y2="${s.y + s.len * 0.42}" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round" class="wx-svg-shooter" style="animation-duration:${s.dur}s;animation-delay:${s.delay}s"/>`).join("")}
</g>`;

const clouds = (list, dark) => `<g>${list.map((c) => `
  <g class="wx-svg-cloud" style="--w:${c.w * c.scale + 260}px;animation-duration:${c.dur}s;animation-delay:${c.delay}s;opacity:${c.op}">
    <g transform="translate(0 ${c.y}) scale(${c.scale})" filter="url(#wxSoft)">
      ${c.puffs.map((p) => `<circle cx="${p.cx}" cy="${p.cy}" r="${p.r}" fill="url(#${dark ? "wxCloudDark" : "wxCloud"})"/>`).join("")}
    </g>
  </g>`).join("")}</g>`;

const rain = () => `<g class="wx-svg-rain">
  ${RAIN.map((d) => `<line x1="${d.x}" y1="${-d.len}" x2="${d.x - 6}" y2="0" stroke="url(#wxRain)" stroke-width="${d.w}" stroke-linecap="round" opacity="${d.o}" class="wx-svg-drop" style="--len:${d.len}px;animation-duration:${d.dur}s;animation-delay:${d.delay}s"/>`).join("")}
  ${RIPPLES.map((r) => `<ellipse cx="${r.x}" cy="${r.y}" rx="2" ry="1" fill="none" stroke="rgba(220,235,255,0.5)" stroke-width="1.4" class="wx-svg-ripple" style="animation-duration:${r.dur}s;animation-delay:${r.delay}s"/>`).join("")}
</g>`;

const snow = () => `<g class="wx-svg-snow">
  ${SNOW.map((s) => `<circle cx="${s.x}" cy="-6" r="${s.r}" fill="#fff" opacity="${s.o}" class="wx-svg-flake" style="--drift:${s.drift}px;--sway:${s.sway}s;animation-duration:${s.dur}s;animation-delay:${s.delay}s"/>`).join("")}
</g>`;

const fog = () => {
  const bands = [
    { y: 200, dur: 30, op: 0.16, dir: 1 }, { y: 320, dur: 38, op: 0.2, dir: -1 },
    { y: 440, dur: 26, op: 0.24, dir: 1 }, { y: 540, dur: 44, op: 0.28, dir: -1 },
  ];
  return `<g class="wx-svg-fog">${bands.map((b) => `<rect x="-200" y="${b.y}" width="${W + 400}" height="90" rx="45" fill="#fff" opacity="${b.op}" filter="url(#wxSoft)" class="wx-svg-fogband${b.dir > 0 ? "" : " rev"}" style="animation-duration:${b.dur}s"/>`).join("")}</g>`;
};

const lightning = () => `<g class="wx-svg-thunder">
  <rect x="0" y="0" width="${W}" height="${H}" fill="#fff" class="wx-svg-flash"/>
  ${BOLTS.map((d, i) => `<path d="${d}" fill="rgba(255,250,210,0.95)" class="wx-svg-bolt${i ? " b2" : ""}"/>`).join("")}
</g>`;

/** 按 (天况, 昼夜) 生成整张天空。只在天况真变时重建 —— 切城市交给 CSS 交叉淡入。 */
export function sceneSvg(sky, isDay) {
  const night = !isDay;
  const showStars = night && (sky === "clear" || sky === "cloud");
  const showClouds = ["clear", "cloud", "rain", "thunder"].includes(sky);
  const darkClouds = sky === "rain" || sky === "thunder" || (sky === "cloud" && night);
  return `<svg class="wx-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    ${defs()}
    ${showStars ? stars() : ""}
    ${isDay && sky === "clear" ? sun() : ""}
    ${showStars ? moon() : ""}
    ${showClouds ? clouds(sky === "clear" ? CLOUDS_FEW : CLOUDS_MANY, darkClouds) : ""}
    ${sky === "rain" || sky === "thunder" ? rain() : ""}
    ${sky === "snow" ? snow() : ""}
    ${sky === "fog" ? fog() : ""}
    ${sky === "thunder" ? lightning() : ""}
  </svg>`;
}
