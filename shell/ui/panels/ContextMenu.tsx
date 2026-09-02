import './ContextMenu.css';
import { t } from '../lib/i18n';
// 桌面右键菜单 —— Aero 玻璃菜单,分组 + 图标,像 Vista 的桌面菜单。
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
      {item('create', '✦', 'ctx.create')}
      <div className="ctx-line" />
      {item('refresh', '↻', 'ctx.refresh')}
      <div className="ctx-line" />
      {item('wallpaper', '▧', 'ctx.wallpaper')}
      {item('about', 'ⓘ', 'ctx.about')}
    </div>
  );
}
