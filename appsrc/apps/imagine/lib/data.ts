// 数据层 —— 纯前端:db() 存树、agent() 生成、window.open 看稿。无后端。
import { db } from '../../../system/lib/db';
import { agent } from '../../../system/lib/agent';
import type { Project, Tree, TreeNode } from './types';

const APP = 'imagine';
const uid = () => crypto.randomUUID().slice(0, 8);

const SYSTEM =
  '你是一位资深设计师兼前端工程师,产出单文件、自包含的 HTML 文档:内联 CSS 与 JS,禁止任何外链资源(不引用外部字体/图片/脚本/样式)。' +
  '重要:不要使用任何工具、不要写文件、不要执行命令——你的整条回复就是这份 HTML 文档本身。' +
  '回复的第一行必须是 `<!--TITLE:中文短标题(不超过8字)-->`,紧接着是完整的 HTML,前后不要有任何多余文字,不要 markdown 代码围栏。' +
  '中文文案,内容真实可信,排版与视觉都要精致。';

const rootPrompt = (p: string) => `请按这个创意方向,创作一个完整的 HTML 页面:\n\n${p}`;
const branchPrompt = (parentHtml: string, instruction: string) =>
  `这是上一版设计的完整 HTML:\n\n${parentHtml}\n\n请在此基础上,按以下要求做一个新版本(可大改也可微调,由指令决定):\n${instruction}`;

function parseArtifact(text: string): { title: string | null; html: string } {
  let s = (text || '').trim();
  s = s.replace(/^```[a-zA-Z]*\s*/, '').replace(/\s*```$/, '').trim(); // 容错:去掉可能的 markdown 围栏
  let title: string | null = null;
  const m = s.match(/^<!--\s*TITLE:\s*([\s\S]+?)\s*-->/i);
  if (m) { title = m[1].trim().slice(0, 16); s = s.slice(m[0].length).trim(); }
  return { title, html: s };
}

// ── 读 ──
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

// ── 生成(fire-and-forget:更新 db,画布轮询反映)──
// 根节点是"原始需求"(无 html,不生成)。父是需求根 → 从需求生成;父是真设计(有 html)→ 在其上改。
async function generate(nodeId: string) {
  const nr = await db(APP, 'SELECT parent_id, instruction FROM app_imagine_nodes WHERE id = ?', [nodeId]);
  const node = nr.rows?.[0] as { parent_id: string | null; instruction: string } | undefined;
  if (!node || !node.parent_id) return; // 需求根不生成
  const pr = await db(APP, 'SELECT instruction, html FROM app_imagine_nodes WHERE id = ?', [node.parent_id]);
  const parent = (pr.rows?.[0] as { instruction?: string; html?: string }) || {};
  const parentHtml = String(parent.html || '');
  let prompt: string;
  if (parentHtml) {
    prompt = branchPrompt(parentHtml, node.instruction);
  } else {
    const requirement = String(parent.instruction || '');
    const extra = node.instruction
      ? `\n\n额外要求:${node.instruction}`
      : '\n\n请给出一个独特的方向:风格、结构、气质都要鲜明,并尽量与其它版本明显不同。';
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
  await db(APP, "UPDATE app_imagine_nodes SET status = 'error', error = ? WHERE id = ?", [String(res.error || '生成失败').slice(0, 200), nodeId]);
}

// ── 写 ──
export async function createProject(prompt: string, count = 3, title?: string): Promise<string> {
  const pid = uid();
  await db(APP, 'INSERT INTO app_imagine_projects (id, title, prompt) VALUES (?, ?, ?)', [pid, (title || prompt).slice(0, 40), prompt]);
  // 根 = 原始需求(无 html,状态 done,不生成);从它发散出 count 个首版
  const rootId = uid();
  await db(APP, "INSERT INTO app_imagine_nodes (id, project_id, parent_id, instruction, title, status) VALUES (?, ?, NULL, ?, '原始需求', 'done')", [rootId, pid, prompt]);
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

// 单击节点:把 HTML 变 blob 在新窗口打开
export async function openNodeWindow(id: string) {
  const html = await getNodeHtml(id);
  if (!html) return;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
