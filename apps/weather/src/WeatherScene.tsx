import { memo } from 'react';
import type { SkyKind } from './lib/types';
import {
  CLOUDS_FEW, CLOUDS_MANY, W, H,
  Clouds, Defs, Fog, Lightning, Moon, Rain, Snow, Stars, Sun,
} from './scene/layers';

// ──────────────────────────────────────────────────────────────
// WeatherScene — 天气 UI 背后会动的天空。一张 SVG 画布(1000×640, slice),
// 按天况叠加:发光的太阳 + 光芒、飘动的云、落雨 + 地面涟漪、飘雪、繁星 +
// 环形山的月亮、翻滚的雾带、雷暴的闪电。全部确定式,按 (sky, isDay) memo,
// 只有天况真正变化时才重建 —— 切城市的过渡交给 CSS 交叉淡入。
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
