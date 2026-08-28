// 封面:按体裁的"出版物"式排版(雅致路线)。竖排/横排书名取前几字,由 CSS 决定摆法。
import type { Genre } from '../lib/types';

export function CoverArt({ genre, title }: { genre: Genre; title: string }) {
  const t = Array.from(title).slice(0, 7).join('');
  switch (genre) {
    case 'cyberpunk': // 深蓝夜卡 + 粉霓虹细线
      return (
        <span className="cover cv-cyber">
          <span className="neon" aria-hidden="true" />
          <span className="vt">{t}</span>
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        </span>
      );
    case 'wuxia': // 米白 + 朱线 + 墨色小块
      return (
        <span className="cover cv-wuxia">
          <span className="rule" aria-hidden="true" />
          <span className="vt">{t}</span>
          <span className="blk" aria-hidden="true" />
        </span>
      );
    case 'apocalypse': // 暖沙 + 半轮落日
      return (
        <span className="cover cv-apoc">
          <span className="sun" aria-hidden="true" />
          <span className="horizon" aria-hidden="true" />
          <span className="ht">{t}</span>
        </span>
      );
    case 'gothic': // 灰紫 + 尖拱
      return (
        <span className="cover cv-gothic">
          <span className="arch" aria-hidden="true" />
          <span className="vt">{t}</span>
        </span>
      );
    case 'scifi': // 浅蓝灰 + 行星轨道
      return (
        <span className="cover cv-scifi">
          <span className="orbit" aria-hidden="true" />
          <span className="planet" aria-hidden="true" />
          <span className="ht">{t}</span>
        </span>
      );
    case 'fantasy': // 浅绿 + 金月与丘线
      return (
        <span className="cover cv-fantasy">
          <span className="moon" aria-hidden="true" />
          <span className="hill" aria-hidden="true" />
          <span className="ht">{t}</span>
        </span>
      );
    default: // classic:细框 + 菱形
      return (
        <span className="cover cv-classic">
          <span className="frame" aria-hidden="true" />
          <span className="vt">{t}</span>
          <span className="diamond" aria-hidden="true" />
        </span>
      );
  }
}
