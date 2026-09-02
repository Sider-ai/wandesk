import { memo, useEffect, useState } from 'react';
import type { TreeNode } from './lib/types';
import type { Pos } from './lib/layout';
import { getNodeHtml } from './lib/data';

// Lazy-load cache for thumbnail html: the tree query doesn't include html; only nodes that actually
// render (in-viewport + zoomed in enough) fetch it, once each.
const htmlCache = new Map<string, string>();
export function bustHtmlCache(id: string) { htmlCache.delete(id); }

function useThumbHtml(id: string, enabled: boolean): string | null {
  const [html, setHtml] = useState<string | null>(() => htmlCache.get(id) ?? null);
  useEffect(() => {
    if (!enabled || htmlCache.has(id)) return;
    let live = true;
    getNodeHtml(id).then((h) => { if (h) htmlCache.set(id, h); if (live && h) setHtml(h); });
    return () => { live = false; };
  }, [id, enabled]);
  return htmlCache.get(id) ?? html;
}

type Props = {
  node: TreeNode;
  pos: Pos;
  selected: boolean;
  collapsed: boolean;
  hiddenCount: number;
  hasChildren: boolean;
  renderPreview: boolean;
  onClick: (id: string) => void;
  onBranch: (id: string) => void;
  onToggle: (id: string) => void;
  onRetry: (id: string) => void;
};

export const NodeCard = memo(function NodeCard({
  node, pos, selected, collapsed, hiddenCount, hasChildren, renderPreview, onClick, onBranch, onToggle, onRetry,
}: Props) {
  const isRoot = node.parent_id === null;
  const wantThumb = node.status === 'done' && !!node.has_content && renderPreview;
  const thumbHtml = useThumbHtml(node.id, wantThumb && !isRoot);

  // Root = the original requirement: a rounded pill with the requirement text + a branch button,
  // no thumbnail, can't be deleted.
  if (isRoot) {
    return (
      <div
        className={`cv-node root-pill${selected ? ' selected' : ''}`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`, position: 'absolute' }}
        onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
      >
        <button className="cv-node-branch" title="Branch from the requirement" onClick={(e) => { e.stopPropagation(); onBranch(node.id); }}>
          <span className="branch-ico" aria-hidden="true">💭</span>
        </button>
        {hasChildren && (
          <button className={`cv-collapse${collapsed ? ' is-collapsed' : ''}`} title={collapsed ? `Expand ${hiddenCount} descendant nodes` : 'Collapse subtree'} onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}>{collapsed ? hiddenCount : '−'}</button>
        )}
        <span className="root-tag">Requirement</span>
        <span className="root-text">{node.instruction || '(empty)'}</span>
      </div>
    );
  }

  const cls = ['cv-node', 'variant', node.status === 'generating' ? 'generating' : '', node.status === 'error' ? 'error' : '', selected ? 'selected' : '']
    .filter(Boolean).join(' ');

  return (
    <div
      className={cls}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`, position: 'absolute' }}
      onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
    >
      {node.status === 'done' && (
        <button className="cv-node-branch" title="Branch from this node" onClick={(e) => { e.stopPropagation(); onBranch(node.id); }}>
          <span className="branch-ico" aria-hidden="true">💭</span>
        </button>
      )}
      {hasChildren && (
        <button
          className={`cv-collapse${collapsed ? ' is-collapsed' : ''}`}
          title={collapsed ? `Expand ${hiddenCount} descendant nodes` : 'Collapse subtree'}
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
        >{collapsed ? hiddenCount : '−'}</button>
      )}
      <div className="thumb">
        {wantThumb && thumbHtml ? (
          <>
            {/* Thumbnails don't run scripts: N animated pages all rendering at full speed at once would choke the canvas; view motion in the new window instead */}
            <iframe srcDoc={thumbHtml} sandbox="" scrolling="no" tabIndex={-1} title={node.title ?? node.id} />
            <div className="veil" />
          </>
        ) : node.status === 'done' && node.has_content ? (
          <div className="thumb-sleep" aria-hidden="true"><i /><i /><i /><i /></div>
        ) : node.status === 'generating' ? (
          <div className="center">
            <div className="pixel-loader"><i /><i /><i /></div>
            <div className="gen-label">Generating…</div>
          </div>
        ) : (
          <div className="center">
            <div className="err-label">{node.error || 'Generation failed'}</div>
            <button className="retry-btn" onClick={(e) => { e.stopPropagation(); onRetry(node.id); }}>Retry</button>
          </div>
        )}
      </div>
      <div className="vinfo">
        <div className="vtitle">{node.title ?? (node.status === 'generating' ? 'New variant' : 'Untitled')}</div>
        <div className="vdesc">{`"${node.instruction}"`}</div>
      </div>
    </div>
  );
});
