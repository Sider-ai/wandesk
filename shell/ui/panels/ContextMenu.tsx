import './ContextMenu.css';
import { t } from '../lib/i18n';
// Desktop right-click menu — an Aero glass menu, grouped with icons, like the Vista desktop menu.
export function ContextMenu({ x, y, onSelect }: { x: number; y: number; onSelect: (key: string) => void }) {
  const item = (key: string, ico: string, labelKey: string) => (
    <button onClick={() => onSelect(key)}>
      <span className="ctx-ico" aria-hidden="true">{ico}</span>
      <span>{t(labelKey)}</span>
    </button>
  );
  return (
    <div className="ctx-menu" style={{ left: x, top: y }} onClick={(e) => e.stopPropagation()}>
      {item('assistant', '✧', 'ctx.assistant')}
      <div className="ctx-line" />
      {item('refresh', '↻', 'ctx.refresh')}
      <div className="ctx-line" />
      {item('wallpaper', '▧', 'ctx.wallpaper')}
      {item('settings', '⚙', 'ctx.settings')}
      {item('about', 'ⓘ', 'ctx.about')}
    </div>
  );
}
