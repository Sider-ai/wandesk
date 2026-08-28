// 笔记本 — 全部状态、副作用与操作收进这个 hook,index.tsx 只负责组装视图。
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { agent } from '../../../system/lib/agent';
import * as data from '../db';
import { PAPERS, type Page } from './paper';

export function useNotebook(appId: string) {
  const [pages, setPages] = useState<Page[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [paper, setPaper] = useState(0);
  const [pinned, setPinned] = useState(0);

  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false); // “墨迹未干”
  const [savedPulse, setSavedPulse] = useState(false); // 落库瞬间的“已保存”微光
  const [dirty, setDirty] = useState(false);
  const [flip, setFlip] = useState<'next' | 'prev' | ''>(''); // 翻页方向
  const [opened, setOpened] = useState(false); // 开场:封面翻开
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // 底部指令栏:一条指令让 AI 直接改写本页
  const [cmd, setCmd] = useState('');
  const [busy, setBusy] = useState(false);
  const [cmdErr, setCmdErr] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // 每页笔记一个对话:同一页的指令续在同一个对话里,AI 记得之前改过什么
  const convMap = useRef<Map<number, string>>(new Map());

  // 标题/正文都是自适应高度的 textarea
  const fit = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(() => fit(titleRef.current), [title, activeId]);
  useEffect(() => fit(taRef.current), [body, activeId]);

  const active = useMemo(() => pages.find((p) => p.id === activeId) || null, [pages, activeId]);

  const applyPage = (p: Page) => { setTitle(p.title); setBody(p.body); setPaper(p.paper); setPinned(p.pinned); };

  // ── 加载 ──
  const load = useCallback(async (selectId?: number) => {
    const rows = await data.loadPages(appId);
    setPages(rows);
    setLoaded(true);
    let pick: Page | undefined;
    if (selectId != null) pick = rows.find((p) => p.id === selectId);
    if (!pick && activeId != null) pick = rows.find((p) => p.id === activeId);
    if (!pick) pick = rows[0];
    if (pick) { setActiveId(pick.id); applyPage(pick); } else setActiveId(null);
    return rows;
  }, [appId, activeId]);

  useEffect(() => { load(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);
  // 开场:封面缓缓翻开
  useEffect(() => { const t = setTimeout(() => setOpened(true), 180); return () => clearTimeout(t); }, []);

  // 落库瞬间亮一下“已保存”
  useEffect(() => {
    if (saving) { setSavedPulse(false); return; }
    if (!loaded) return;
    setSavedPulse(true);
    if (pulseTimer.current) clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setSavedPulse(false), 1400);
    return () => { if (pulseTimer.current) clearTimeout(pulseTimer.current); };
  }, [saving, loaded]);

  function runFlip(dir: 'next' | 'prev') {
    if (flipTimer.current) clearTimeout(flipTimer.current);
    setFlip(dir);
    flipTimer.current = setTimeout(() => setFlip(''), 540);
  }

  // ── 保存 ──
  const persist = useCallback(async (id: number, t: string, b: string, pp: number, pin: number) => {
    setSaving(true);
    await data.updatePage(appId, id, t, b, pp, pin);
    setSaving(false);
    setDirty(false);
  }, [appId]);

  const syncPreview = useCallback((id: number, t: string, b: string, pp: number, pin: number) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, title: t, body: b, paper: pp, pinned: pin, updated_at: new Date().toISOString() } : p)));
  }, []);

  // 立即落库(切页/新建/卸载前)
  const flushSave = useCallback(async () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    if (activeId == null || !dirty) return;
    await persist(activeId, title, body, paper, pinned);
    syncPreview(activeId, title, body, paper, pinned);
  }, [activeId, dirty, title, body, paper, pinned, persist, syncPreview]);

  // 防抖自动保存:内容变了 1.1s 后落库
  useEffect(() => {
    if (activeId == null || !dirty) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void persist(activeId, title, body, paper, pinned);
      syncPreview(activeId, title, body, paper, pinned);
    }, 1100);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body, paper, pinned, dirty, activeId]);

  // 卸载时把尚未保存的写回
  useEffect(() => () => {
    if (activeId != null && dirty) void persist(activeId, title, body, paper, pinned);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function edit(next: Partial<{ title: string; body: string; paper: number; pinned: number }>) {
    if (activeId == null) return;
    if (next.title !== undefined) setTitle(next.title);
    if (next.body !== undefined) setBody(next.body);
    if (next.paper !== undefined) setPaper(next.paper);
    if (next.pinned !== undefined) setPinned(next.pinned);
    setDirty(true);
  }

  const resetEditingFlags = () => { setDirty(false); setCmd(''); setCmdErr(''); };

  // ── 选页 / 新建 / 删除 ──
  function openPage(p: Page) {
    if (p.id === activeId) return;
    const from = pages.findIndex((x) => x.id === activeId);
    const to = pages.findIndex((x) => x.id === p.id);
    void flushSave();
    runFlip(to >= from ? 'next' : 'prev');
    setActiveId(p.id);
    applyPage(p);
    resetEditingFlags();
    requestAnimationFrame(() => taRef.current?.focus());
  }

  async function addPage() {
    await flushSave();
    const newId = await data.insertPage(appId, Math.floor(Math.random() * PAPERS.length));
    runFlip('next');
    const rows = await load(newId);
    const created = rows.find((p) => p.id === newId);
    if (created) { setActiveId(created.id); setTitle(''); setBody(''); setPaper(created.paper); setPinned(0); }
    resetEditingFlags();
    requestAnimationFrame(() => taRef.current?.focus());
  }

  async function deletePage() {
    if (deleteId == null) return;
    await flushSave();
    const deletingActive = deleteId === activeId;
    const idx = pages.findIndex((p) => p.id === deleteId);
    const nextPick = pages[idx + 1] || pages[idx - 1];
    await data.deletePageRow(appId, deleteId);
    convMap.current.delete(deleteId);
    setDeleteId(null);
    if (deletingActive) resetEditingFlags();
    await load(nextPick?.id);
  }

  // ── 指令:一条输入,让 AI 直接改写当前这页 ──
  async function runCommand() {
    const instruction = cmd.trim();
    if (!instruction || busy || activeId == null) return;
    setBusy(true);
    setCmdErr('');
    const head = title.trim();
    const system =
      '你是一位中文写作助手,嵌在一本笔记里。用户会给出一条针对“当前这页笔记”的指令(比如续写、总结、润色、改写语气、翻译、列要点等)。' +
      '请据此改写这页笔记的正文,并只输出改写后的【完整正文】本身:不要解释、不要前后缀、不要 markdown 代码块、不要加引号。';
    const prompt = `指令:${instruction}\n\n请据此改写下面这页笔记${head ? `(标题:「${head}」)` : ''}的正文,输出改写后的完整正文。`;
    const payload = body.trim() || '(这页还是空白)';
    const conv = convMap.current.get(activeId);
    let r = await agent(appId, prompt, { data: payload, system, conversationId: conv });
    if (!r.ok && conv) {
      convMap.current.delete(activeId);
      r = await agent(appId, prompt, { data: payload, system });
    }
    if (r.ok && r.conversationId) convMap.current.set(activeId, r.conversationId);
    if (!r.ok) { setCmdErr('AI 处理失败，请重试'); setBusy(false); return; }
    const out = (r.result || '').trim();
    if (!out) { setCmdErr('AI 没有返回内容'); setBusy(false); return; }
    edit({ body: out });
    setCmd('');
    setBusy(false);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) { ta.focus(); ta.setSelectionRange(0, 0); }
      scrollRef.current?.scrollTo(0, 0); // AI 改写后回到开头
    });
  }

  return {
    pages, activeId, title, body, paper, pinned, loaded, saving, savedPulse, dirty,
    flip, opened, deleteId, setDeleteId, cmd, setCmd, busy, cmdErr, setCmdErr, active,
    taRef, titleRef, scrollRef, openPage, addPage, deletePage, edit, runCommand,
  };
}
