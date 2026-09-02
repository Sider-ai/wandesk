// Left page: index (new page, tab list, N pages total + save status). Presentational only.
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
        <div className="nb-index-title">Index</div>
        <button className="nb-new" onClick={onAdd} title="New page">
          <span className="nb-new-plus">＋</span> New page
        </button>
      </div>

      <div className="nb-index-list">
        {!loaded && (
          <div className="nb-index-empty">
            <span className="nb-quill nb-quill-load">✒</span>
            <span>Opening the notebook…</span>
          </div>
        )}
        {empty && (
          <div className="nb-index-empty nb-index-empty-cta">
            <div className="nb-empty-quill">✑</div>
            <div className="nb-empty-l1">No pages yet.</div>
            <div className="nb-empty-l2">Click "＋ New page" above to start.</div>
          </div>
        )}
        {pages.map((p) => {
          const on = p.id === activeId;
          const t = (on ? title : p.title).trim() || 'Untitled';
          const prev = (on ? body : p.body).trim().replace(/\s+/g, ' ');
          const tab = paperOf(on ? paper : p.paper).tab;
          return (
            <div key={p.id} className={`nb-entry ${on ? 'on' : ''}`} style={{ '--tab': tab } as CSSProperties}>
              <button className="nb-entry-open" onClick={() => onOpen(p)}>
                <span className="nb-entry-tab" style={{ background: tab }} />
                <span className="nb-entry-main">
                  <span className="nb-entry-title">{t}</span>
                  <span className="nb-entry-prev">{prev || '(Blank page)'}</span>
                </span>
                <span className="nb-entry-time">{fmtTime(p.updated_at) || 'just now'}</span>
              </button>
              {on && (
                <button className="nb-entry-delete" onClick={() => onDelete(p.id)} title="Tear out this page" aria-label="Tear out this page">×</button>
              )}
            </div>
          );
        })}
      </div>

      <div className="nb-index-foot">
        <span className="nb-foot-count">{pages.length} page{pages.length === 1 ? '' : 's'}</span>
        <span className={`nb-foot-status ${saving ? 'is-saving' : savedPulse ? 'is-saved' : dirty ? 'is-dirty' : ''}`}>
          <span className="nb-foot-dot" />
          {saving ? ' · Ink still wet…' : dirty ? ' · Unsaved' : ' · Saved'}
        </span>
      </div>
    </aside>
  );
}
