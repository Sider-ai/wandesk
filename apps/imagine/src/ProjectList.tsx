import { useEffect, useState } from 'react';
import type { Project } from './lib/types';
import { listProjects, createProject, deleteProject } from './lib/data';
import { CountPicker } from './CountPicker';

// Home page — a command-bar workbench (native-app paradigm): a mini title bar + a prominent command
// console + a recent-projects list.
export function ProjectList({ onOpen }: { onOpen: (projectId: string) => void }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [prompt, setPrompt] = useState('');
  const [count, setCount] = useState(3);
  const [creating, setCreating] = useState(false);

  const load = () => listProjects().then(setProjects).catch(console.error);
  useEffect(() => { load(); const t = setInterval(load, 3000); return () => clearInterval(t); }, []);

  async function create() {
    const p = prompt.trim();
    if (!p || creating) return;
    setCreating(true);
    try { const id = await createProject(p, count); onOpen(id); }
    catch (e) { alert(String(e)); } finally { setCreating(false); }
  }
  async function remove(e: React.MouseEvent, id: string) {
    e.stopPropagation();
    if (!confirm('Delete this project and all its versions?')) return;
    await deleteProject(id); load();
  }

  // "versions" = number of design drafts (excludes the requirement root)
  const versionsOf = (p: Project) => Math.max(0, (p.node_count ?? 1) - 1);

  return (
    <div className="pj-app">
      <div className="pj-scroll">
        <div className="pj-hero">
          <div className="pj-hero-emoji">💭</div>
          <h1 className="pj-hero-title">Turn one idea into a spread of possibilities</h1>
          <p className="pj-hero-desc">Write a sentence, and the AI gives you <b>several design drafts in different directions</b> at once — every one a self-contained page you can open directly. Pick the one you like and <b>keep branching</b>, growing a tree that gets finer and finer until it's just right.</p>
        </div>

        <div className="pj-omni">
          <div className="pj-omni-top">
            <span className="pj-q">💭</span>
            <textarea
              value={prompt}
              placeholder="What do you want to make? Describe it, e.g. &quot;A landing page for pour-over coffee beans, warm handcrafted style, terracotta orange&quot;…"
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); create(); } }}
            />
          </div>
          <div className="pj-omni-foot">
            <CountPicker value={count} onChange={setCount} />
            <span className="pj-lab">versions</span>
            <button className="pj-go" style={{ marginLeft: 'auto' }} disabled={!prompt.trim() || creating} onClick={create}>
              {creating ? 'Creating…' : `Generate ${count}`}
            </button>
          </div>
        </div>

        <div className="pj-list">
          <div className="pj-sec"><h2>Recent projects</h2><span>{projects.length}</span></div>
          {projects.length === 0 ? (
            <div className="pj-empty">No projects yet — write a sentence above to start your first branching tree</div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="pj-row" onClick={() => onOpen(p.id)}>
                <div className="pj-th"><div className="pj-thbar" /><i /><i /></div>
                <div className="pj-rbody">
                  <h3>{p.title || 'Untitled project'}</h3>
                  <p>{p.prompt}{(p.generating_count ?? 0) > 0 && <> · <span className="pj-gen">{p.generating_count} generating</span></>}</p>
                </div>
                <div className="pj-rc"><b>{versionsOf(p)}</b>versions</div>
                <button className="pj-del" title="Delete project" onClick={(e) => remove(e, p.id)}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
