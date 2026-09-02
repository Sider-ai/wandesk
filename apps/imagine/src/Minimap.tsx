import { useEffect, useRef } from 'react';
import type { TreeNode } from './lib/types';
import { boundsOf, type Pos } from './lib/layout';

const W = 188, H = 128;
type View = { x: number; y: number; k: number };

export function Minimap({ nodes, positions, view, canvasSize, onNavigate }: {
  nodes: TreeNode[];
  positions: Map<string, Pos>;
  view: View;
  canvasSize: { w: number; h: number };
  onNavigate: (wx: number, wy: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tRef = useRef({ s: 1, ox: 0, oy: 0 });

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = W * dpr; cv.height = H * dpr;
    cv.style.width = `${W}px`; cv.style.height = `${H}px`;
    const ctx = cv.getContext('2d')!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const b = boundsOf(positions);
    const pad = 60;
    const s = Math.min(W / (b.x2 - b.x1 + pad * 2), H / (b.y2 - b.y1 + pad * 2));
    const ox = W / 2 - ((b.x1 + b.x2) / 2) * s;
    const oy = H / 2 - ((b.y1 + b.y2) / 2) * s;
    tRef.current = { s, ox, oy };

    ctx.strokeStyle = '#d3d7de'; ctx.lineWidth = 1;
    for (const n of nodes) {
      if (!n.parent_id) continue;
      const p = positions.get(n.parent_id), c = positions.get(n.id);
      if (!p || !c) continue;
      ctx.beginPath();
      ctx.moveTo(p.x * s + ox, p.y * s + oy);
      ctx.lineTo(c.x * s + ox, c.y * s + oy);
      ctx.stroke();
    }
    for (const n of nodes) {
      const p = positions.get(n.id);
      if (!p) continue;
      ctx.fillStyle = n.parent_id === null ? '#1c2026'
        : n.status === 'generating' ? '#3b5bfd'
        : n.status === 'error' ? '#d05050' : '#aab1bc';
      ctx.fillRect(p.x * s + ox - (p.w * s) / 2, p.y * s + oy - (p.h * s) / 2, Math.max(3, p.w * s), Math.max(3, p.h * s));
    }
    const vx = (-view.x / view.k) * s + ox, vy = (-view.y / view.k) * s + oy;
    const vw = (canvasSize.w / view.k) * s, vh = (canvasSize.h / view.k) * s;
    ctx.strokeStyle = '#3b5bfd'; ctx.lineWidth = 1.5;
    ctx.strokeRect(vx, vy, vw, vh);
    ctx.fillStyle = 'rgba(59,91,253,.07)';
    ctx.fillRect(vx, vy, vw, vh);
  }, [nodes, positions, view, canvasSize]);

  function navigate(e: React.PointerEvent) {
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const { s, ox, oy } = tRef.current;
    onNavigate((e.clientX - r.left - ox) / s, (e.clientY - r.top - oy) / s);
  }

  return (
    <div className="cv-minimap" onPointerDown={(e) => { e.stopPropagation(); navigate(e); }} onPointerMove={(e) => { if (e.buttons === 1) navigate(e); }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
