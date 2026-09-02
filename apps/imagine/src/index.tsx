import { useState } from 'react';
import { ProjectList } from './ProjectList';
import Canvas from './Canvas';
import './style.css';

// Imagine — a creative-branching canvas. Two views inside the window: project list <-> canvas (no router library).
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
