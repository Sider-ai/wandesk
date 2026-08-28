import { useState } from 'react';
import { ProjectList } from './ProjectList';
import Canvas from './Canvas';
import './style.css';

// 想象 — 创意发散画布。窗口内两态切换:项目列表 ↔ 画布(不引路由库)。
type View = { mode: 'list' } | { mode: 'canvas'; projectId: string };

export default function Imagine() {
  const [view, setView] = useState<View>({ mode: 'list' });
  return (
    <div className="im-root">
      {view.mode === 'list'
        ? <ProjectList onOpen={(projectId) => setView({ mode: 'canvas', projectId })} />
        : <Canvas projectId={view.projectId} onBack={() => setView({ mode: 'list' })} />}
    </div>
  );
}
