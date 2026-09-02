// 阅读 — 全部状态与操作收进这个 hook;index 只切视图,视图组件读 ReaderCtx。
import { useEffect, useMemo, useRef, useState } from 'react';
import { agent } from '../wandesk/agent';
import * as data from '../db';
import { GM, TURN_SCHEMA, buildRecap, detectGenre, extractTurn } from './story';
import type { BookRow, Genre, Page, Turn } from './types';

export function useReader(appId: string) {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({}); // 每本书已有的页数
  const [view, setView] = useState<'shelf' | 'reader'>('shelf');
  const [composing, setComposing] = useState(false); // 添加位打开的自定义设定纸页

  // 当前打开的书
  const [book, setBook] = useState<BookRow | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [convId, setConvId] = useState<string | null>(null); // 活会话:有则原生续写

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [custom, setCustom] = useState('');
  const [premise, setPremise] = useState('');
  const idxOfNew = useRef(0); // 给新落地的一页一个递增 key,确保过渡动画重新触发

  // 阅读器控件:字号档位 + 日夜纸色(不持久化,重开归零)
  const [fontStep, setFontStep] = useState(1);
  const [theme, setTheme] = useState<'day' | 'night'>('day');
  const lastPageRef = useRef<HTMLDivElement>(null);

  const genre = useMemo<Genre>(() => (book ? detectGenre(book.premise || premise) : detectGenre(premise)), [book, premise]);

  async function loadShelf() {
    setBooks(await data.loadBooks(appId));
    setCounts(await data.loadCounts(appId));
  }
  useEffect(() => {
    void loadShelf();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 新一页落地后,滚到这一页的开头,从新章节读起
  useEffect(() => {
    if (view === 'reader') lastPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pages.length, view]);

  // ── 跑一轮引擎:优先原生续写,会话失效则用 pages 重建一个新会话 ──
  async function runTurn(prompt: string, useConv: string | null, recap: string | null): Promise<{ turn: Turn; conversationId: string | null } | null> {
    let r = useConv
      ? await agent(appId, prompt, { conversationId: useConv, schema: TURN_SCHEMA })
      : await agent(appId, recap ? `${recap}\n\n${prompt}` : prompt, { system: GM, schema: TURN_SCHEMA });
    let turn = extractTurn(r);
    if (!turn && useConv) { // 会话失效 / 解析失败 → 用 recap 重建全新会话再试一次
      r = await agent(appId, recap ? `${recap}\n\n${prompt}` : prompt, { system: GM, schema: TURN_SCHEMA });
      turn = extractTurn(r);
    }
    if (!turn) return null;
    return { turn, conversationId: r.conversationId ?? useConv ?? null };
  }

  // ── 开新书(预置书 / 自定义设定都走这里)。forcedTitle:预置书用固定书名。 ──
  async function startBook(p: string, forcedTitle?: string) {
    const text = p.trim();
    if (!text || busy) return;
    setError(''); setBusy(true); setComposing(false); setView('reader');
    setBook(null); setPages([]); setChoices([]); setConvId(null); setPremise(text);
    setFontStep(1); setTheme('day');
    idxOfNew.current = 0;

    const prompt = `请为下面的设定开启一个互动故事,写出引人入胜的开场第一页,并给出 2–4 个抉择。\n设定:${text}`;
    const out = await runTurn(prompt, null, null);
    if (!out) { setError('故事没能展开,请再试一次。'); setBusy(false); setView('shelf'); return; }
    const { turn, conversationId } = out;
    const title = (forcedTitle || turn.title || '无题').slice(0, 24);
    const status = turn.choices.length ? 'ongoing' : 'ended';

    const bookId = await data.insertBook(appId, title, text, conversationId, status);
    await data.insertPage(appId, bookId, 0, turn.narrative, '', turn.choices); // 开场页连同待选项一起存

    setBook({ id: bookId, title, premise: text, conversation_id: conversationId, status, updated_at: '' });
    setPages([{ idx: 0, narrative: turn.narrative, chosen: '', choices: turn.choices }]);
    setConvId(conversationId);
    setChoices(turn.choices);
    setBusy(false);
    loadShelf();
  }

  // ── 推进一页(点选项 / 自定义行动) ──
  async function advance(action: string) {
    const act = action.trim();
    if (!act || busy || !book) return;
    setError(''); setCustom(''); setBusy(true);

    // 把行动写到"当前最后一页"的 chosen 上,并清掉它的待选项。
    const cur = pages[pages.length - 1];
    setPages((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, chosen: act, choices: [] } : x)));
    await data.setPageChoice(appId, book.id, cur.idx, act, []);
    setChoices([]);

    const pagesWithChoice = pages.map((x, i) => (i === pages.length - 1 ? { ...x, chosen: act } : x));
    const recap = buildRecap(book.premise || premise, pagesWithChoice);
    const prompt = `玩家选择的行动:${act}\n\n请承接上文,写出接下来发生的这一页,并给出 2–4 个新的抉择(若故事到了有力的结局可结束)。`;

    const out = await runTurn(prompt, convId, recap);
    if (!out) {
      // 失败:把刚才的选择回滚为未选,恢复原待选项让玩家重试
      setError('这一步没能继续,请重试,或换一个行动。');
      setPages((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, chosen: '', choices: cur.choices } : x)));
      await data.setPageChoice(appId, book.id, cur.idx, '', cur.choices);
      setChoices((c) => (c.length ? c : cur.choices.length ? cur.choices : [act]));
      setBusy(false);
      return;
    }
    const { turn, conversationId } = out;
    const nextIdx = cur.idx + 1;
    const ended = turn.choices.length === 0;

    await data.insertPage(appId, book.id, nextIdx, turn.narrative, '', turn.choices); // 新一页连同待选项存
    await data.setBookState(appId, book.id, conversationId, ended ? 'ended' : 'ongoing');

    idxOfNew.current = nextIdx;
    setPages((s) => [...s, { idx: nextIdx, narrative: turn.narrative, chosen: '', choices: turn.choices }]);
    setConvId(conversationId);
    setBook((st) => (st ? { ...st, conversation_id: conversationId, status: ended ? 'ended' : 'ongoing' } : st));
    setChoices(turn.choices);
    setBusy(false);
    loadShelf();
  }

  // ── 重开一本已存的书:整篇载入 + 恢复会话 + 恢复停在抉择点的待选项 ──
  async function openBook(s: BookRow) {
    setError(''); setComposing(false); setView('reader'); setBusy(false); setCustom('');
    setBook(s); setPremise(s.premise); setConvId(s.conversation_id); setPages([]); setChoices([]);
    setFontStep(1); setTheme('day');
    idxOfNew.current = -1; // 载入旧书不触发"新落地"动画

    const sc = await data.loadPages(appId, s.id);
    setPages(sc);
    // 若停在抉择点(末页还没选),直接把存下来的待选项显示出来。
    const last = sc[sc.length - 1];
    setChoices(last && !last.chosen && s.status !== 'ended' ? last.choices : []);
  }

  // 停在抉择点但没有持久化的待选项(老库或异常)→ 让引擎基于现状重新给出抉择。
  async function resumeChoices() {
    if (!book || busy) return;
    setError(''); setBusy(true);
    const recap = buildRecap(book.premise || premise, pages);
    const prompt = '请承接上文,基于当前局面给出接下来 2–4 个可行的抉择(并用一两句话把镜头稳稳停在此刻,不要跳进新的剧情)。';
    const out = await runTurn(prompt, convId, recap);
    if (!out) { setError('没能取回选项,请重试。'); setBusy(false); return; }
    const { turn, conversationId } = out;
    setConvId(conversationId);
    if (conversationId && conversationId !== book.conversation_id) {
      await data.setBookConv(appId, book.id, conversationId);
      setBook((st) => (st ? { ...st, conversation_id: conversationId } : st));
    }
    const last = pages[pages.length - 1];
    if (last) {
      setPages((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, choices: turn.choices } : x)));
      await data.setPageChoices(appId, book.id, last.idx, turn.choices);
    }
    setChoices(turn.choices);
    setBusy(false);
  }

  async function deleteBook(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('删除这个故事?此操作不可撤销。')) return;
    await data.deleteBook(appId, id);
    loadShelf();
  }

  const ended = book?.status === 'ended';
  const lastChosen = pages.length ? pages[pages.length - 1].chosen : '';
  const awaitingResume = view === 'reader' && !!book && !busy && !ended && choices.length === 0 && !lastChosen;
  const showChoiceBlock = view === 'reader' && !ended && !busy && (choices.length > 0 || awaitingResume);

  return {
    books, counts, view, setView, composing, setComposing,
    book, pages, choices, busy, error, setError, custom, setCustom, premise, setPremise,
    idxOfNew, fontStep, setFontStep, theme, setTheme, lastPageRef, genre,
    startBook, advance, openBook, resumeChoices, deleteBook,
    ended, awaitingResume, showChoiceBlock,
  };
}

export type ReaderCtx = ReturnType<typeof useReader>;
