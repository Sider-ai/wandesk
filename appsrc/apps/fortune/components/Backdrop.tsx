// 天象背景:星野 + 星云 + 月 + 八卦环 + 云雾 + 火星子(纯装饰)。
import { type CSSProperties } from 'react';
import { RING_GLYPHS, STARS } from '../lib/yijing';

export function Backdrop() {
  return (
    <>
      <div className="fo-stars" style={{ '--fortune-stars': STARS } as CSSProperties} />
      <div className="fo-nebula" />
      <div className="fo-moon" />
      <div className="fo-trigram-ring" aria-hidden>
        {RING_GLYPHS.map((g, i) => (
          <span key={i} className="fo-tg" style={{ transform: `rotate(${i * 45}deg) translateY(-164px)` }}>
            <span style={{ transform: `rotate(${-i * 45}deg)`, display: 'inline-block' }}>{g}</span>
          </span>
        ))}
      </div>
      <div className="fo-mist" />
      <div className="fo-ember-field" aria-hidden>
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="fo-ember" style={{ '--i': i } as CSSProperties} />
        ))}
      </div>
    </>
  );
}
