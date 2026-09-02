import { memo } from 'react';
import type { SkyKind } from './lib/types';
import {
  CLOUDS_FEW, CLOUDS_MANY, W, H,
  Clouds, Defs, Fog, Lightning, Moon, Rain, Snow, Stars, Sun,
} from './scene/layers';

// ──────────────────────────────────────────────────────────────
// WeatherScene — the animated sky behind the weather UI. One SVG canvas
// (1000×640, slice), layered by condition: a glowing sun with rays, drifting
// clouds, falling rain + ground ripples, falling snow, a starfield + cratered
// moon, a rolling fog band, thunderstorm lightning. Everything is
// deterministic, memoized on (sky, isDay) — it only rebuilds when the
// condition actually changes; the transition on city switch is left to a
// CSS cross-fade.
// ──────────────────────────────────────────────────────────────

export type { SkyKind };

function WeatherSceneInner({ sky, isDay }: { sky: SkyKind; isDay: boolean }) {
  const night = !isDay;
  const showStars = night && (sky === 'clear' || sky === 'cloud');
  const showMoon = night && (sky === 'clear' || sky === 'cloud');
  const showSun = isDay && sky === 'clear';
  const showClouds = sky === 'clear' || sky === 'cloud' || sky === 'rain' || sky === 'thunder';
  const darkClouds = sky === 'rain' || sky === 'thunder' || (sky === 'cloud' && night);
  const cloudDefs = sky === 'clear' ? CLOUDS_FEW : CLOUDS_MANY;

  return (
    <svg className="wx-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <Defs />
      <Stars show={showStars} />
      <Sun night={!showSun} />
      <Moon show={showMoon} />
      {showClouds && <Clouds defs={cloudDefs} dark={darkClouds} />}
      <Rain show={sky === 'rain' || sky === 'thunder'} />
      <Snow show={sky === 'snow'} />
      <Fog show={sky === 'fog'} />
      <Lightning show={sky === 'thunder'} />
    </svg>
  );
}

// memo so the SVG only rebuilds when the condition (sky/day) changes.
export const WeatherScene = memo(WeatherSceneInner);
export default WeatherScene;
