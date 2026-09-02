// Data layer — frontend-only: db() stores the tree, agent() generates, window.open shows the draft. No backend.
import { db } from '../wandesk/db';
import { agent } from '../wandesk/agent';
import type { Project, Tree, TreeNode } from './types';

const APP = 'imagine';
const uid = () => crypto.randomUUID().slice(0, 8);

const SYSTEM =
  'You are a senior designer and frontend engineer producing a single-file, self-contained HTML document: ' +
  'inline CSS and JS, no external links of any kind (no external fonts/images/scripts/stylesheets). ' +
  'Important: do not use any tools, do not write files, do not run commands — your entire reply IS the HTML document itself. ' +
  'The first line of your reply must be `<!--TITLE:short English title (no more than 5 words)-->`, immediately followed by the complete HTML, ' +
  'with no extra text before or after and no markdown code fences. ' +
  'All copy must be in English, the content should feel real and credible, and both the layout and visuals should be polished.';

const rootPrompt = (p: string) => `Following this creative direction, create a complete HTML page:\n\n${p}`;
const branchPrompt = (parentHtml: string, instruction: string) =>
  `Here is the complete HTML of the previous design version:\n\n${parentHtml}\n\nBased on this, create a new version following the instruction below (it may be a major overhaul or a small tweak, depending on the instruction):\n${instruction}`;

function parseArtifact(text: string): { title: string | null; html: string } {
  let s = (text || '').trim();
  s = s.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '').trim(); // fallback: strip any markdown fence, just in case
  let title: string | null = null;
  const m = s.match(/^<!--\s*TITLE:\s*([\s\S]+?)\s*-->/i);
  if (m) { title = m[1].trim().slice(0, 16); s = s.slice(m[0].length).trim(); }
  return { title, html: s };
}

// ── read ──
export async function listProjects(): Promise<Project[]> {
  const r = await db(APP, `SELECT p.id, p.title, p.prompt, p.created_at,
    (SELECT COUNT(*) FROM app_imagine_nodes n WHERE n.project_id = p.id) AS node_count,
    (SELECT COUNT(*) FROM app_imagine_nodes n WHERE n.project_id = p.id AND n.status = 'generating') AS generating_count
    FROM app_imagine_projects p ORDER BY p.created_at DESC`);
  return (r.rows as Project[]) || [];
}

export async function getTree(projectId: string): Promise<Tree | null> {
  const p = await db(APP, 'SELECT id, title, prompt, created_at FROM app_imagine_projects WHERE id = ?', [projectId]);
  const project = (p.rows?.[0] as Project) || null;
  if (!project) return null;
  const n = await db(APP, `SELECT id, project_id, parent_id, instruction, title, status, error, created_at,
    (CASE WHEN length(html) > 0 THEN 1 ELSE 0 END) AS has_content
    FROM app_imagine_nodes WHERE project_id = ? ORDER BY created_at ASC`, [projectId]);
  return { project, nodes: (n.rows as TreeNode[]) || [] };
}

export async function getNodeHtml(id: string): Promise<string> {
  const r = await db(APP, 'SELECT html FROM app_imagine_nodes WHERE id = ?', [id]);
  return String((r.rows?.[0] as { html?: string })?.html || '');
}

// ── generate (fire-and-forget: update db, the canvas polls and reflects it) ──
// The root node is the "original requirement" (no html, never generated). If the parent is the
// requirement root -> generate from the requirement; if the parent is an actual design (has html) -> edit on top of it.
async function generate(nodeId: string) {
  const nr = await db(APP, 'SELECT parent_id, instruction FROM app_imagine_nodes WHERE id = ?', [nodeId]);
  const node = nr.rows?.[0] as { parent_id: string | null; instruction: string } | undefined;
  if (!node || !node.parent_id) return; // the requirement root is never generated
  const pr = await db(APP, 'SELECT instruction, html FROM app_imagine_nodes WHERE id = ?', [node.parent_id]);
  const parent = (pr.rows?.[0] as { instruction?: string; html?: string }) || {};
  const parentHtml = String(parent.html || '');
  let prompt: string;
  if (parentHtml) {
    prompt = branchPrompt(parentHtml, node.instruction);
  } else {
    const requirement = String(parent.instruction || '');
    const extra = node.instruction
      ? `\n\nAdditional requirement: ${node.instruction}`
      : '\n\nGive it a distinct direction: make the style, structure, and mood clearly defined, and as different as possible from the other versions.';
    prompt = rootPrompt(requirement + extra);
  }
  const res = await agent(APP, prompt, { system: SYSTEM }).catch((e) => ({ ok: false, error: String(e), result: '' }));
  if (res.ok && res.result) {
    const { title, html } = parseArtifact(res.result);
    if (html) {
      await db(APP, "UPDATE app_imagine_nodes SET html = ?, title = ?, status = 'done', error = '' WHERE id = ?", [html, title, nodeId]);
      return;
    }
  }
  await db(APP, "UPDATE app_imagine_nodes SET status = 'error', error = ? WHERE id = ?", [String(res.error || 'Generation failed').slice(0, 200), nodeId]);
}

// ── write ──
export async function createProject(prompt: string, count = 3, title?: string): Promise<string> {
  const pid = uid();
  await db(APP, 'INSERT INTO app_imagine_projects (id, title, prompt) VALUES (?, ?, ?)', [pid, (title || prompt).slice(0, 40), prompt]);
  // Root = the original requirement (no html, status done, never generated); branch out count first versions from it
  const rootId = uid();
  await db(APP, "INSERT INTO app_imagine_nodes (id, project_id, parent_id, instruction, title, status) VALUES (?, ?, NULL, ?, 'Original requirement', 'done')", [rootId, pid, prompt]);
  const ids: string[] = [];
  for (let i = 0; i < Math.max(1, count); i++) {
    const cid = uid();
    await db(APP, "INSERT INTO app_imagine_nodes (id, project_id, parent_id, instruction, status) VALUES (?, ?, ?, '', 'generating')", [cid, pid, rootId]);
    ids.push(cid);
  }
  ids.forEach((id) => void generate(id));
  return pid;
}

export async function branch(projectId: string, parentId: string, instruction: string, count: number): Promise<string[]> {
  const ids: string[] = [];
  for (let i = 0; i < Math.max(1, count); i++) {
    const nid = uid();
    await db(APP, "INSERT INTO app_imagine_nodes (id, project_id, parent_id, instruction, status) VALUES (?, ?, ?, ?, 'generating')", [nid, projectId, parentId, instruction]);
    ids.push(nid);
  }
  ids.forEach((id) => void generate(id));
  return ids;
}

export async function retryNode(nodeId: string) {
  await db(APP, "UPDATE app_imagine_nodes SET status = 'generating', error = '' WHERE id = ?", [nodeId]);
  void generate(nodeId);
}

export async function deleteProject(id: string) {
  await db(APP, 'DELETE FROM app_imagine_nodes WHERE project_id = ?', [id]);
  await db(APP, 'DELETE FROM app_imagine_projects WHERE id = ?', [id]);
}

// Clicking a node: turn its HTML into a blob and open it in a new window
export async function openNodeWindow(id: string) {
  const html = await getNodeHtml(id);
  if (!html) return;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
