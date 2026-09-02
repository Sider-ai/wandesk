// The individual layers for WeatherScene: gradient defs + sun/moon/stars/clouds/rain/snow/fog/lightning.
import {
  BOLTS, CLOUDS_FEW, CLOUDS_MANY, H, RAIN, RAYS, RIPPLES, SHOOTERS, SNOW, STARS, W,
  type CloudDef,
} from './data';

export { CLOUDS_FEW, CLOUDS_MANY, W, H };

export function Defs() {
  return (
    <defs>
      {/* sun gradient */}
      <radialGradient id="wxSun" cx="42%" cy="40%" r="62%">
        <stop offset="0%" stopColor="#fff9e4" /><stop offset="42%" stopColor="#ffe27a" /><stop offset="100%" stopColor="#ffb23d" />
      </radialGradient>
      <radialGradient id="wxSunGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,224,130,0.55)" /><stop offset="55%" stopColor="rgba(255,210,110,0.18)" /><stop offset="100%" stopColor="rgba(255,210,110,0)" />
      </radialGradient>
      {/* moon */}
      <radialGradient id="wxMoon" cx="38%" cy="34%" r="70%">
        <stop offset="0%" stopColor="#fdfdf4" /><stop offset="62%" stopColor="#e9e8d6" /><stop offset="100%" stopColor="#c3c2ad" />
      </radialGradient>
      <radialGradient id="wxMoonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(238,238,210,0.4)" /><stop offset="60%" stopColor="rgba(238,238,210,0.1)" /><stop offset="100%" stopColor="rgba(238,238,210,0)" />
      </radialGradient>
      {/* soft cloud fill */}
      <linearGradient id="wxCloud" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#dfe7f2" />
      </linearGradient>
      <linearGradient id="wxCloudDark" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#aab4c6" /><stop offset="100%" stopColor="#7e889b" />
      </linearGradient>
      {/* rain streak */}
      <linearGradient id="wxRain" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(220,235,255,0)" /><stop offset="100%" stopColor="rgba(220,235,255,0.95)" />
      </linearGradient>
      <filter id="wxSoft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3" /></filter>
    </defs>
  );
}

export function Sun({ night }: { night: boolean }) {
  if (night) return null; // sun lives top-right by day
  const cx = 770, cy = 150;
  return (
    <g className="wx-svg-sun">
      <circle cx={cx} cy={cy} r={210} fill="url(#wxSunGlow)" className="wx-svg-sunglow" />
      <g className="wx-svg-rays" style={{ transformOrigin: `${cx}px ${cy}px` }}>
        {RAYS.map((deg) => (
          <rect key={deg} x={cx - 3} y={cy - 150} width={6} height={54} rx={3} fill="rgba(255,236,170,0.7)" transform={`rotate(${deg} ${cx} ${cy})`} />
        ))}
      </g>
      <circle cx={cx} cy={cy} r={66} fill="url(#wxSun)" className="wx-svg-suncore" />
    </g>
  );
}

export function Moon({ show }: { show: boolean }) {
  if (!show) return null;
  const cx = 778, cy = 146;
  return (
    <g className="wx-svg-moon">
      <circle cx={cx} cy={cy} r={150} fill="url(#wxMoonGlow)" />
      <circle cx={cx} cy={cy} r={58} fill="url(#wxMoon)" />
      <circle cx={cx - 18} cy={cy - 14} r={11} fill="rgba(150,150,128,0.28)" />
      <circle cx={cx + 16} cy={cy + 10} r={8} fill="rgba(150,150,128,0.22)" />
      <circle cx={cx + 6} cy={cy - 22} r={5} fill="rgba(150,150,128,0.2)" />
      <circle cx={cx - 8} cy={cy + 22} r={6} fill="rgba(150,150,128,0.18)" />
    </g>
  );
}

export function Stars({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <g className="wx-svg-stars">
      {STARS.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o}
          style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }}
          className={s.big ? 'wx-svg-star big' : 'wx-svg-star'} />
      ))}
      {SHOOTERS.map((s, i) => (
        <line key={`sh${i}`} x1={s.x} y1={s.y} x2={s.x + s.len} y2={s.y + s.len * 0.42}
          stroke="rgba(255,255,255,0.85)" strokeWidth={2} strokeLinecap="round" className="wx-svg-shooter"
          style={{ animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
      ))}
    </g>
  );
}

export function Clouds({ defs, dark }: { defs: CloudDef[]; dark: boolean }) {
  return (
    <g>
      {defs.map((c, i) => (
        <g key={i} className="wx-svg-cloud"
          style={{ ['--w' as string]: `${c.w * c.scale + 260}px`, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s`, opacity: c.op }}>
          <g transform={`translate(0 ${c.y}) scale(${c.scale})`} filter="url(#wxSoft)">
            {c.puffs.map((p, j) => (
              <circle key={j} cx={p.cx} cy={p.cy} r={p.r} fill={dark ? 'url(#wxCloudDark)' : 'url(#wxCloud)'} />
            ))}
          </g>
        </g>
      ))}
    </g>
  );
}

export function Rain({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <g className="wx-svg-rain">
      {RAIN.map((d, i) => (
        <line key={i} x1={d.x} y1={-d.len} x2={d.x - 6} y2={0} stroke="url(#wxRain)" strokeWidth={d.w} strokeLinecap="round" opacity={d.o}
          className="wx-svg-drop" style={{ ['--len' as string]: `${d.len}px`, animationDuration: `${d.dur}s`, animationDelay: `${d.delay}s` }} />
      ))}
      {RIPPLES.map((r, i) => (
        <ellipse key={`rip${i}`} cx={r.x} cy={r.y} rx={2} ry={1} fill="none" stroke="rgba(220,235,255,0.5)" strokeWidth={1.4}
          className="wx-svg-ripple" style={{ animationDuration: `${r.dur}s`, animationDelay: `${r.delay}s` }} />
      ))}
    </g>
  );
}

export function Snow({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <g className="wx-svg-snow">
      {SNOW.map((s, i) => (
        <circle key={i} cx={s.x} cy={-6} r={s.r} fill="#fff" opacity={s.o} className="wx-svg-flake"
          style={{ ['--drift' as string]: `${s.drift}px`, ['--sway' as string]: `${s.sway}s`, animationDuration: `${s.dur}s`, animationDelay: `${s.delay}s` }} />
      ))}
    </g>
  );
}

export function Fog({ show }: { show: boolean }) {
  if (!show) return null;
  const bands = [
    { y: 200, dur: 30, op: 0.16, dir: 1 },
    { y: 320, dur: 38, op: 0.2, dir: -1 },
    { y: 440, dur: 26, op: 0.24, dir: 1 },
    { y: 540, dur: 44, op: 0.28, dir: -1 },
  ];
  return (
    <g className="wx-svg-fog">
      {bands.map((b, i) => (
        <rect key={i} x={-200} y={b.y} width={W + 400} height={90} rx={45} fill="#fff" opacity={b.op} filter="url(#wxSoft)"
          className={b.dir > 0 ? 'wx-svg-fogband' : 'wx-svg-fogband rev'} style={{ animationDuration: `${b.dur}s` }} />
      ))}
    </g>
  );
}

export function Lightning({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <g className="wx-svg-thunder">
      <rect x={0} y={0} width={W} height={H} fill="#fff" className="wx-svg-flash" />
      {BOLTS.map((d, i) => (
        <path key={i} d={d} fill="rgba(255,250,210,0.95)" className={i === 0 ? 'wx-svg-bolt' : 'wx-svg-bolt b2'} />
      ))}
    </g>
  );
}
