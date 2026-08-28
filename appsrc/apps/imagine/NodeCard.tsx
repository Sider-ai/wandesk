import { memo, useEffect, useState } from 'react';
import type { TreeNode } from './lib/types';
import type { Pos } from './lib/layout';
import { getNodeHtml } from './lib/data';

// 缩略图 html 懒加载缓存:tree 查询不含 html,只有真正被渲染(视口内 + 够放大)的节点才拉一次。
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

  // 根 = 原始需求:一个圆角胶囊,需求文本 + 发散按钮,无缩略图、不可删。
  if (isRoot) {
    return (
      <div
        className={`cv-node root-pill${selected ? ' selected' : ''}`}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`, position: 'absolute' }}
        onClick={(e) => { e.stopPropagation(); onClick(node.id); }}
      >
        <button className="cv-node-branch" title="基于需求继续发散" onClick={(e) => { e.stopPropagation(); onBranch(node.id); }}>
          <span className="branch-ico" aria-hidden="true">💭</span>
        </button>
        {hasChildren && (
          <button className={`cv-collapse${collapsed ? ' is-collapsed' : ''}`} title={collapsed ? `展开 ${hiddenCount} 个后代节点` : '收起子树'} onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}>{collapsed ? hiddenCount : '−'}</button>
        )}
        <span className="root-tag">需求</span>
        <span className="root-text">{node.instruction || '(空)'}</span>
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
        <button className="cv-node-branch" title="基于该节点继续发散" onClick={(e) => { e.stopPropagation(); onBranch(node.id); }}>
          <span className="branch-ico" aria-hidden="true">💭</span>
        </button>
      )}
      {hasChildren && (
        <button
          className={`cv-collapse${collapsed ? ' is-collapsed' : ''}`}
          title={collapsed ? `展开 ${hiddenCount} 个后代节点` : '收起子树'}
          onClick={(e) => { e.stopPropagation(); onToggle(node.id); }}
        >{collapsed ? hiddenCount : '−'}</button>
      )}
      <div className="thumb">
        {wantThumb && thumbHtml ? (
          <>
            {/* 缩略图不跑脚本:N 个动画页同时全速渲染会拖死画布;动效去新窗口看 */}
            <iframe srcDoc={thumbHtml} sandbox="" scrolling="no" tabIndex={-1} title={node.title ?? node.id} />
            <div className="veil" />
          </>
        ) : node.status === 'done' && node.has_content ? (
          <div className="thumb-sleep" aria-hidden="true"><i /><i /><i /><i /></div>
        ) : node.status === 'generating' ? (
          <div className="center">
            <div className="pixel-loader"><i /><i /><i /></div>
            <div className="gen-label">生成中…</div>
          </div>
        ) : (
          <div className="center">
            <div className="err-label">{node.error || '生成失败'}</div>
            <button className="retry-btn" onClick={(e) => { e.stopPropagation(); onRetry(node.id); }}>重试</button>
          </div>
        )}
      </div>
      <div className="vinfo">
        <div className="vtitle">{node.title ?? (node.status === 'generating' ? '新变体' : '未命名')}</div>
        <div className="vdesc">{`“${node.instruction}”`}</div>
      </div>
    </div>
  );
});
