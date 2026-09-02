// Notebook — all state, side effects, and actions are collected in this hook; index.tsx only assembles the view.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { agent } from '../wandesk/agent';
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
  const [saving, setSaving] = useState(false); // "ink still wet"
  const [savedPulse, setSavedPulse] = useState(false); // brief "saved" glow the instant it hits the database
  const [dirty, setDirty] = useState(false);
  const [flip, setFlip] = useState<'next' | 'prev' | ''>(''); // page-flip direction
  const [opened, setOpened] = useState(false); // opening: cover flips open
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Bottom command bar: a single instruction lets AI rewrite this page directly
  const [cmd, setCmd] = useState('');
  const [busy, setBusy] = useState(false);
  const [cmdErr, setCmdErr] = useState('');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pulseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  // One conversation per page: instructions for the same page continue in the same conversation, so the AI remembers earlier edits
  const convMap = useRef<Map<number, string>>(new Map());

  // Both title and body are auto-height textareas
  const fit = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(() => fit(titleRef.current), [title, activeId]);
  useEffect(() => fit(taRef.current), [body, activeId]);

  const active = useMemo(() => pages.find((p) => p.id === activeId) || null, [pages, activeId]);

  const applyPage = (p: Page) => { setTitle(p.title); setBody(p.body); setPaper(p.paper); setPinned(p.pinned); };

  // ── Load ──
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
  // Opening: cover slowly flips open
  useEffect(() => { const t = setTimeout(() => setOpened(true), 180); return () => clearTimeout(t); }, []);

  // Briefly light up "saved" the instant it hits the database
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

  // ── Save ──
  const persist = useCallback(async (id: number, t: string, b: string, pp: number, pin: number) => {
    setSaving(true);
    await data.updatePage(appId, id, t, b, pp, pin);
    setSaving(false);
    setDirty(false);
  }, [appId]);

  const syncPreview = useCallback((id: number, t: string, b: string, pp: number, pin: number) => {
    setPages((prev) => prev.map((p) => (p.id === id ? { ...p, title: t, body: b, paper: pp, pinned: pin, updated_at: new Date().toISOString() } : p)));
  }, []);

  // Persist immediately (before switching pages / creating / unmounting)
  const flushSave = useCallback(async () => {
    if (saveTimer.current) { clearTimeout(saveTimer.current); saveTimer.current = null; }
    if (activeId == null || !dirty) return;
    await persist(activeId, title, body, paper, pinned);
    syncPreview(activeId, title, body, paper, pinned);
  }, [activeId, dirty, title, body, paper, pinned, persist, syncPreview]);

  // Debounced autosave: persist 1.1s after content changes
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

  // Write back any unsaved changes on unmount
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

  // ── Select page / create / delete ──
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

  // ── Command: a single input lets AI rewrite the current page directly ──
  async function runCommand() {
    const instruction = cmd.trim();
    if (!instruction || busy || activeId == null) return;
    setBusy(true);
    setCmdErr('');
    const head = title.trim();
    const system =
      'You are a writing assistant embedded in a notebook. The user will give an instruction targeting "the current notebook page" ' +
      '(e.g. continue writing, summarize, polish, change the tone, translate, list key points, etc.). ' +
      "Rewrite this page's body accordingly, and output only the rewritten [complete body] itself: no explanations, no prefixes or suffixes, no markdown code blocks, no quotes.";
    const prompt = `Instruction: ${instruction}\n\nRewrite the body of the following notebook page${head ? ` (title: "${head}")` : ''} accordingly, and output the rewritten complete body.`;
    const payload = body.trim() || '(this page is still blank)';
    const conv = convMap.current.get(activeId);
    let r = await agent(appId, prompt, { data: payload, system, conversationId: conv });
    if (!r.ok && conv) {
      convMap.current.delete(activeId);
      r = await agent(appId, prompt, { data: payload, system });
    }
    if (r.ok && r.conversationId) convMap.current.set(activeId, r.conversationId);
    if (!r.ok) { setCmdErr('AI processing failed, please try again'); setBusy(false); return; }
    const out = (r.result || '').trim();
    if (!out) { setCmdErr('AI returned no content'); setBusy(false); return; }
    edit({ body: out });
    setCmd('');
    setBusy(false);
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (ta) { ta.focus(); ta.setSelectionRange(0, 0); }
      scrollRef.current?.scrollTo(0, 0); // back to the top after AI rewrite
    });
  }

  return {
    pages, activeId, title, body, paper, pinned, loaded, saving, savedPulse, dirty,
    flip, opened, deleteId, setDeleteId, cmd, setCmd, busy, cmdErr, setCmdErr, active,
    taRef, titleRef, scrollRef, openPage, addPage, deletePage, edit, runCommand,
  };
}
