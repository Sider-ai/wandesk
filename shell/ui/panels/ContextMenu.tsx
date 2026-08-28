import './ContextMenu.css';
// 桌面右键菜单 —— Aero 玻璃菜单,分组 + 图标,像 Vista 的桌面菜单。
export function ContextMenu({ x, y, onSelect }: { x: number; y: number; onSelect: (key: string) => void }) {
  const item = (key: string, ico: string, label: string) => (
    <button onClick={() => onSelect(key)}>
      <span className="ctx-ico" aria-hidden="true">{ico}</span>
      <span>{label}</span>
    </button>
  );
  return (
    <div className="ctx-menu" style={{ left: x, top: y }} onClick={(e) => e.stopPropagation()}>
      {item('assistant', '✧', '打开助理')}
      {item('create', '✦', '新建应用…')}
      <div className="ctx-line" />
      {item('refresh', '↻', '刷新桌面')}
      <div className="ctx-line" />
      {item('wallpaper', '▧', '个性化…')}
      {item('about', 'ⓘ', '关于')}
    </div>
  );
}
