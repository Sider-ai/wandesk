import { useEffect, useState } from 'react';
import type { Project } from './lib/types';
import { listProjects, createProject, deleteProject } from './lib/data';
import { CountPicker } from './CountPicker';

// 主页 —— 命令栏工作台(原生应用范式):迷你标题条 + 醒目命令台 + 最近项目列表。
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
    if (!confirm('删除该项目及其所有方案?')) return;
    await deleteProject(id); load();
  }

  // "版" = 设计稿数(不含需求根)
  const versionsOf = (p: Project) => Math.max(0, (p.node_count ?? 1) - 1);

  return (
    <div className="pj-app">
      <div className="pj-scroll">
        <div className="pj-hero">
          <div className="pj-hero-emoji">💭</div>
          <h1 className="pj-hero-title">把一个想法,展开成一片可能</h1>
          <p className="pj-hero-desc">写一句话,AI 就同时给你<b>好几版不同方向</b>的设计稿——都是能直接打开的自包含网页。挑中意的那版<b>继续发散</b>,像一棵树越长越细,直到刚刚好。</p>
        </div>

        <div className="pj-omni">
          <div className="pj-omni-top">
            <span className="pj-q">💭</span>
            <textarea
              value={prompt}
              placeholder="想做点什么?描述你想要的东西,例如「一个手冲咖啡豆的落地页,温暖手作风,陶土橙主色」…"
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); create(); } }}
            />
          </div>
          <div className="pj-omni-foot">
            <CountPicker value={count} onChange={setCount} />
            <span className="pj-lab">个版本</span>
            <button className="pj-go" style={{ marginLeft: 'auto' }} disabled={!prompt.trim() || creating} onClick={create}>
              {creating ? '创建中…' : `生成 ${count} 版`}
            </button>
          </div>
        </div>

        <div className="pj-list">
          <div className="pj-sec"><h2>最近项目</h2><span>{projects.length} 个</span></div>
          {projects.length === 0 ? (
            <div className="pj-empty">还没有项目 — 上面写一句,开始你的第一棵发散树</div>
          ) : (
            projects.map((p) => (
              <div key={p.id} className="pj-row" onClick={() => onOpen(p.id)}>
                <div className="pj-th"><div className="pj-thbar" /><i /><i /></div>
                <div className="pj-rbody">
                  <h3>{p.title || '未命名项目'}</h3>
                  <p>{p.prompt}{(p.generating_count ?? 0) > 0 && <> · <span className="pj-gen">{p.generating_count} 生成中</span></>}</p>
                </div>
                <div className="pj-rc"><b>{versionsOf(p)}</b>版</div>
                <button className="pj-del" title="删除项目" onClick={(e) => remove(e, p.id)}>✕</button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
