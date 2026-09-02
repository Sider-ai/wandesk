import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Tree } from './lib/types';
import { boundsOf, edgePath, layoutTree } from './lib/layout';
import { NodeCard, bustHtmlCache } from './NodeCard';
import { ChatBubble } from './ChatBubble';
import { Minimap } from './Minimap';
import { getTree, branch, retryNode, openNodeWindow } from './lib/data';

type View = { x: number; y: number; k: number };
type BubbleMode = 'branch' | null;

const RENDER_OVERSCAN_PX = 700;
const PREVIEW_MIN_ZOOM = 0.3;

function intersectsViewport(p: { x: number; y: number; w: number; h: number }, r: { x1: number; y1: number; x2: number; y2: number }) {
  const x1 = p.x - p.w / 2, x2 = p.x + p.w / 2, y1 = p.y - p.h / 2, y2 = p.y + p.h / 2;
  return x2 >= r.x1 && x1 <= r.x2 && y2 >= r.y1 && y1 <= r.y2;
}

export default function Canvas({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const [tree, setTree] = useState<Tree | null>(null);
  const [view, setView] = useState<View>({ x: 160, y: 300, k: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [bubbleMode, setBubbleMode] = useState<BubbleMode>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 800, h: 600 });
  const [toast, setToast] = useState<string | null>(null);
  const fitted = useRef(false);

  const load = useCallback(() => { getTree(projectId).then(setTree).catch(console.error); }, [projectId]);
  useEffect(() => { load(); const t = setInterval(load, 2000); return () => clearInterval(t); }, [load]);

  const nodes = tree?.nodes ?? [];
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);

  const collapseKey = `imagine-collapsed-${projectId}`;
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(collapseKey) ?? '[]')); } catch { return new Set(); }
  });
  function toggleCollapse(id: string) {
    setCollapsed((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      localStorage.setItem(collapseKey, JSON.stringify([...s]));
      return s;
    });
  }

  const childrenMap = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const n of nodes) { if (!n.parent_id) continue; if (!m.has(n.parent_id)) m.set(n.parent_id, []); m.get(n.parent_id)!.push(n.id); }
    return m;
  }, [nodes]);

  // Descendants of a collapsed node don't take part in layout or rendering
  const visibleNodes = useMemo(() => {
    const root = nodes.find((n) => n.parent_id === null);
    if (!root) return [];
    const out: typeof nodes = [];
    const walk = (id: string) => { const n = byId.get(id); if (!n) return; out.push(n); if (!collapsed.has(id)) (childrenMap.get(id) ?? []).forEach(walk); };
    walk(root.id);
    return out;
  }, [nodes, byId, childrenMap, collapsed]);

  const descendantCount = useCallback((id: string): number => {
    const kids = childrenMap.get(id) ?? [];
    return kids.length + kids.reduce((s, k) => s + descendantCount(k), 0);
  }, [childrenMap]);

  const positions = useMemo(() => layoutTree(visibleNodes), [visibleNodes]);

  const renderRect = useMemo(() => {
    const pad = RENDER_OVERSCAN_PX / view.k;
    return {
      x1: (0 - view.x) / view.k - pad, y1: (0 - view.y) / view.k - pad,
      x2: (canvasSize.w - view.x) / view.k + pad, y2: (canvasSize.h - view.y) / view.k + pad,
    };
  }, [view, canvasSize]);

  const renderNodes = useMemo(() => visibleNodes.filter((n) => { const p = positions.get(n.id); return p ? intersectsViewport(p, renderRect) : false; }), [visibleNodes, positions, renderRect]);
  const renderNodeIds = useMemo(() => new Set(renderNodes.map((n) => n.id)), [renderNodes]);

  useEffect(() => { if (selectedId && !positions.has(selectedId)) setSelectedId(null); }, [positions, selectedId]);

  /* Canvas size */
  const vpRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = vpRef.current; if (!el) return;
    const ro = new ResizeObserver(() => { const r = el.getBoundingClientRect(); setCanvasSize({ w: r.width, h: r.height }); });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* fit / pan / zoom */
  const fitView = useCallback(() => {
    if (!positions.size) return;
    const b = boundsOf(positions); const pad = 90; const { w, h } = canvasSize;
    const k = Math.min(1.2, w / (b.x2 - b.x1 + pad * 2), h / (b.y2 - b.y1 + pad * 2));
    setView({ k: Math.max(0.18, k), x: w / 2 - ((b.x1 + b.x2) / 2) * k, y: h / 2 - ((b.y1 + b.y2) / 2) * k });
  }, [positions, canvasSize]);
  useEffect(() => { if (!fitted.current && positions.size && canvasSize.w > 1) { fitted.current = true; fitView(); } }, [positions, canvasSize, fitView]);

  const panRef = useRef({ active: false, sx: 0, sy: 0, vx: 0, vy: 0 });
  const viewRef = useRef(view); viewRef.current = view;

  function onPointerDown(e: React.PointerEvent) {
    const t = e.target as HTMLElement;
    if (t.closest('.cv-node, .cv-bubble, .cv-minimap, .cv-topbar, .cv-zoom, a, button, input, textarea')) return;
    panRef.current = { active: true, sx: e.clientX, sy: e.clientY, vx: view.x, vy: view.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    vpRef.current?.classList.add('panning');
    setSelectedId(null); setBubbleMode(null);
  }
  function onPointerMove(e: React.PointerEvent) {
    const p = panRef.current; if (!p.active) return;
    setView((v) => ({ ...v, x: p.vx + e.clientX - p.sx, y: p.vy + e.clientY - p.sy }));
  }
  function onPointerUp() { panRef.current.active = false; vpRef.current?.classList.remove('panning'); }

  const zoomAt = useCallback((cx: number, cy: number, k: number) => {
    setView((v) => { const k2 = Math.max(0.18, Math.min(2.6, k)); const r = k2 / v.k; return { k: k2, x: cx - (cx - v.x) * r, y: cy - (cy - v.y) * r }; });
  }, []);
  useEffect(() => {
    const el = vpRef.current; if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, viewRef.current.k * Math.exp(-e.deltaY * 0.0016));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [zoomAt]);

  /* Interaction */
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast((t) => (t === msg ? null : t)), 2400); }

  function onNodeClick(id: string) {
    const n = byId.get(id); if (!n) return;
    if (n.parent_id === null) { setSelectedId(id); setBubbleMode('branch'); return; } // Root = requirement: click branches immediately
    if (n.status === 'generating') { showToast('This version is still generating…'); return; }
    if (n.status === 'error') { showToast(n.error || 'This version failed to generate — you can retry'); return; }
    setSelectedId(id);
    void openNodeWindow(id); // Click = open full-size in a new window
  }
  function onNodeBranch(id: string) {
    const n = byId.get(id); if (!n || n.status !== 'done') { showToast('This version hasn\'t finished generating yet'); return; }
    setSelectedId(id); setBubbleMode('branch');
  }

  async function submitBranch(instruction: string, count: number) {
    if (!selectedId) return;
    const parent = byId.get(selectedId);
    setBubbleMode(null);
    try { await branch(projectId, selectedId, instruction, count); showToast(`Generating ${count} new branches from "${parent?.title ?? 'requirement'}"…`); load(); }
    catch (e) { showToast(String(e)); }
  }
  async function retry(id: string) { bustHtmlCache(id); try { await retryNode(id); load(); } catch (e) { showToast(String(e)); } }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      if (bubbleMode) setBubbleMode(null); else setSelectedId(null);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [bubbleMode]);

  const hlEdges = useMemo(() => {
    const set = new Set<string>();
    let cur = selectedId ? byId.get(selectedId) : undefined;
    while (cur?.parent_id) { set.add(cur.id); cur = byId.get(cur.parent_id); }
    return set;
  }, [selectedId, byId]);

  const selectedNode = selectedId ? byId.get(selectedId) : undefined;
  const selectedPos = selectedId ? positions.get(selectedId) : undefined;
  const doneCount = nodes.filter((n) => n.parent_id && n.status === 'done').length;
  const genCount = nodes.filter((n) => n.status === 'generating').length;

  return (
    <div className="cv-layout">
      <div ref={vpRef} className="cv-viewport" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <div className="cv-world" style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}>
          <svg className="cv-edges">
            {visibleNodes.map((n) => {
              if (!n.parent_id) return null;
              const p = positions.get(n.parent_id), c = positions.get(n.id);
              if (!p || !c) return null;
              if (!renderNodeIds.has(n.parent_id) && !renderNodeIds.has(n.id)) return null;
              return <path key={n.id} className={`cv-edge${hlEdges.has(n.id) ? ' hl' : ''}`} d={edgePath(p, c)} />;
            })}
          </svg>
          {renderNodes.map((n) => {
            const p = positions.get(n.id); if (!p) return null;
            return (
              <NodeCard
                key={n.id} node={n} pos={p}
                selected={n.id === selectedId}
                collapsed={collapsed.has(n.id)}
                hiddenCount={collapsed.has(n.id) ? descendantCount(n.id) : 0}
                hasChildren={(childrenMap.get(n.id) ?? []).length > 0}
                renderPreview={view.k >= PREVIEW_MIN_ZOOM}
                onClick={onNodeClick} onBranch={onNodeBranch} onToggle={toggleCollapse} onRetry={retry}
              />
            );
          })}
          {bubbleMode === 'branch' && selectedNode && selectedPos && selectedNode.status === 'done' && (
            <ChatBubble node={selectedNode} pos={selectedPos} onSubmit={submitBranch} onClose={() => setBubbleMode(null)} />
          )}
        </div>

        <div className="cv-topbar">
          <div className="cv-project-card">
            <button className="cv-back" title="Back to project list" onClick={onBack}>←</button>
            <div>
              <div className="pj-name">{tree?.project.title ?? '…'}</div>
              <div className="pj-sub">Imagine · click to view full-size · branch from the top-right</div>
            </div>
            <div className="cv-stat"><b>{doneCount}</b>versions</div>
            {genCount > 0 && <div className="cv-stat"><b style={{ color: 'var(--accent)' }}>{genCount}</b>generating</div>}
          </div>
        </div>

        <div className="cv-zoom">
          <button onClick={() => zoomAt(canvasSize.w / 2, canvasSize.h / 2, view.k / 1.25)}>−</button>
          <span className="val">{Math.round(view.k * 100)}%</span>
          <button onClick={() => zoomAt(canvasSize.w / 2, canvasSize.h / 2, view.k * 1.25)}>＋</button>
          <button className="fit" onClick={fitView}>Fit</button>
        </div>

        {positions.size > 0 && (
          <Minimap
            nodes={visibleNodes} positions={positions} view={view} canvasSize={canvasSize}
            onNavigate={(wx, wy) => setView((v) => ({ ...v, x: canvasSize.w / 2 - wx * v.k, y: canvasSize.h / 2 - wy * v.k }))}
          />
        )}
        <div className="cv-hint">Drag empty space to pan · scroll to zoom · click a node to open a new window · branch from the top-right</div>
      </div>
      {toast && <div className="cv-toast">{toast}</div>}
    </div>
  );
}
