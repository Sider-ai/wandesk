// 左页:目录(新一页、页签列表、共 N 页 + 保存状态)。纯展示。
import { type CSSProperties } from 'react';
import { fmtTime, paperOf, type Page } from '../lib/paper';

export function IndexPane({
  pages, activeId, title, body, paper, loaded, empty, saving, savedPulse, dirty,
  onOpen, onAdd, onDelete,
}: {
  pages: Page[];
  activeId: number | null;
  title: string;
  body: string;
  paper: number;
  loaded: boolean;
  empty: boolean;
  saving: boolean;
  savedPulse: boolean;
  dirty: boolean;
  onOpen: (p: Page) => void;
  onAdd: () => void;
  onDelete: (id: number) => void;
}) {
  return (
    <aside className="nb-index">
      <div className="nb-index-head">
        <div className="nb-index-title">目录</div>
        <button className="nb-new" onClick={onAdd} title="新一页">
          <span className="nb-new-plus">＋</span> 新一页
        </button>
      </div>

      <div className="nb-index-list">
        {!loaded && (
          <div className="nb-index-empty">
            <span className="nb-quill nb-quill-load">✒</span>
            <span>正在翻开本子…</span>
          </div>
        )}
        {empty && (
          <div className="nb-index-empty nb-index-empty-cta">
            <div className="nb-empty-quill">✑</div>
            <div className="nb-empty-l1">还没有任何一页。</div>
            <div className="nb-empty-l2">点上面的「＋ 新一页」开始。</div>
          </div>
        )}
        {pages.map((p) => {
          const on = p.id === activeId;
          const t = (on ? title : p.title).trim() || '无标题';
          const prev = (on ? body : p.body).trim().replace(/\s+/g, ' ');
          const tab = paperOf(on ? paper : p.paper).tab;
          return (
            <div key={p.id} className={`nb-entry ${on ? 'on' : ''}`} style={{ '--tab': tab } as CSSProperties}>
              <button className="nb-entry-open" onClick={() => onOpen(p)}>
                <span className="nb-entry-tab" style={{ background: tab }} />
                <span className="nb-entry-main">
                  <span className="nb-entry-title">{t}</span>
                  <span className="nb-entry-prev">{prev || '（空白页）'}</span>
                </span>
                <span className="nb-entry-time">{fmtTime(p.updated_at) || '刚刚'}</span>
              </button>
              {on && (
                <button className="nb-entry-delete" onClick={() => onDelete(p.id)} title="撕掉这一页" aria-label="撕掉这一页">×</button>
              )}
            </div>
          );
        })}
      </div>

      <div className="nb-index-foot">
        <span className="nb-foot-count">共 {pages.length} 页</span>
        <span className={`nb-foot-status ${saving ? 'is-saving' : savedPulse ? 'is-saved' : dirty ? 'is-dirty' : ''}`}>
          <span className="nb-foot-dot" />
          {saving ? ' · 墨迹未干…' : dirty ? ' · 待保存' : ' · 已保存'}
        </span>
      </div>
    </aside>
  );
}
