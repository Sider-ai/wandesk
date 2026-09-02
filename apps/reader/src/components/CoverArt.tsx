// Cover: genre-based "publication" style layout (an elegant route). Vertical/horizontal title takes the first few characters, layout decided by CSS.
import type { Genre } from '../lib/types';

export function CoverArt({ genre, title }: { genre: Genre; title: string }) {
  const t = Array.from(title).slice(0, 7).join('');
  switch (genre) {
    case 'cyberpunk': // deep-blue night card + thin pink neon lines
      return (
        <span className="cover cv-cyber">
          <span className="neon" aria-hidden="true" />
          <span className="vt">{t}</span>
          <span className="dots" aria-hidden="true"><i /><i /><i /></span>
        </span>
      );
    case 'wuxia': // off-white + vermilion rule + ink block
      return (
        <span className="cover cv-wuxia">
          <span className="rule" aria-hidden="true" />
          <span className="vt">{t}</span>
          <span className="blk" aria-hidden="true" />
        </span>
      );
    case 'apocalypse': // warm sand + half a setting sun
      return (
        <span className="cover cv-apoc">
          <span className="sun" aria-hidden="true" />
          <span className="horizon" aria-hidden="true" />
          <span className="ht">{t}</span>
        </span>
      );
    case 'gothic': // grey-violet + pointed arch
      return (
        <span className="cover cv-gothic">
          <span className="arch" aria-hidden="true" />
          <span className="vt">{t}</span>
        </span>
      );
    case 'scifi': // pale blue-grey + planetary orbit
      return (
        <span className="cover cv-scifi">
          <span className="orbit" aria-hidden="true" />
          <span className="planet" aria-hidden="true" />
          <span className="ht">{t}</span>
        </span>
      );
    case 'fantasy': // pale green + gold moon and hill line
      return (
        <span className="cover cv-fantasy">
          <span className="moon" aria-hidden="true" />
          <span className="hill" aria-hidden="true" />
          <span className="ht">{t}</span>
        </span>
      );
    default: // classic: thin frame + diamond
      return (
        <span className="cover cv-classic">
          <span className="frame" aria-hidden="true" />
          <span className="vt">{t}</span>
          <span className="diamond" aria-hidden="true" />
        </span>
      );
  }
}
