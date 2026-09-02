// Reader — all state and actions live in this hook; index just switches views, view components read ReaderCtx.
import { useEffect, useMemo, useRef, useState } from 'react';
import { agent } from '../wandesk/agent';
import * as data from '../db';
import { GM, TURN_SCHEMA, buildRecap, detectGenre, extractTurn } from './story';
import type { BookRow, Genre, Page, Turn } from './types';

export function useReader(appId: string) {
  const [books, setBooks] = useState<BookRow[]>([]);
  const [counts, setCounts] = useState<Record<number, number>>({}); // number of pages each book already has
  const [view, setView] = useState<'shelf' | 'reader'>('shelf');
  const [composing, setComposing] = useState(false); // the custom-setup sheet opened by the add slot

  // the currently open book
  const [book, setBook] = useState<BookRow | null>(null);
  const [pages, setPages] = useState<Page[]>([]);
  const [choices, setChoices] = useState<string[]>([]);
  const [convId, setConvId] = useState<string | null>(null); // live session: if present, continue natively

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [custom, setCustom] = useState('');
  const [premise, setPremise] = useState('');
  const idxOfNew = useRef(0); // gives each newly landed page an incrementing key, ensuring the transition animation re-fires

  // Reader controls: font-size step + day/night paper tone (not persisted, resets on reopen)
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

  // once a new page lands, scroll to its start so the new chapter reads from the top
  useEffect(() => {
    if (view === 'reader') lastPageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pages.length, view]);

  // ── Run one engine turn: prefer native continuation; if the session is invalid, rebuild a new one from pages ──
  async function runTurn(prompt: string, useConv: string | null, recap: string | null): Promise<{ turn: Turn; conversationId: string | null } | null> {
    let r = useConv
      ? await agent(appId, prompt, { conversationId: useConv, schema: TURN_SCHEMA })
      : await agent(appId, recap ? `${recap}\n\n${prompt}` : prompt, { system: GM, schema: TURN_SCHEMA });
    let turn = extractTurn(r);
    if (!turn && useConv) { // session invalid / parse failed → rebuild a fresh session from the recap and try once more
      r = await agent(appId, recap ? `${recap}\n\n${prompt}` : prompt, { system: GM, schema: TURN_SCHEMA });
      turn = extractTurn(r);
    }
    if (!turn) return null;
    return { turn, conversationId: r.conversationId ?? useConv ?? null };
  }

  // ── Start a new book (both preset books and custom setups go through here). forcedTitle: presets use a fixed title. ──
  async function startBook(p: string, forcedTitle?: string) {
    const text = p.trim();
    if (!text || busy) return;
    setError(''); setBusy(true); setComposing(false); setView('reader');
    setBook(null); setPages([]); setChoices([]); setConvId(null); setPremise(text);
    setFontStep(1); setTheme('day');
    idxOfNew.current = 0;

    const prompt = `Begin an interactive story from the setup below. Write a gripping opening page and offer 2–4 choices.\nSetup: ${text}`;
    const out = await runTurn(prompt, null, null);
    if (!out) { setError('The story failed to start. Please try again.'); setBusy(false); setView('shelf'); return; }
    const { turn, conversationId } = out;
    const title = (forcedTitle || turn.title || 'Untitled').slice(0, 24);
    const status = turn.choices.length ? 'ongoing' : 'ended';

    const bookId = await data.insertBook(appId, title, text, conversationId, status);
    await data.insertPage(appId, bookId, 0, turn.narrative, '', turn.choices); // store the opening page along with its pending choices

    setBook({ id: bookId, title, premise: text, conversation_id: conversationId, status, updated_at: '' });
    setPages([{ idx: 0, narrative: turn.narrative, chosen: '', choices: turn.choices }]);
    setConvId(conversationId);
    setChoices(turn.choices);
    setBusy(false);
    loadShelf();
  }

  // ── Advance one page (choice click / custom action) ──
  async function advance(action: string) {
    const act = action.trim();
    if (!act || busy || !book) return;
    setError(''); setCustom(''); setBusy(true);

    // Write the action onto the "current last page"'s chosen field, and clear its pending choices.
    const cur = pages[pages.length - 1];
    setPages((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, chosen: act, choices: [] } : x)));
    await data.setPageChoice(appId, book.id, cur.idx, act, []);
    setChoices([]);

    const pagesWithChoice = pages.map((x, i) => (i === pages.length - 1 ? { ...x, chosen: act } : x));
    const recap = buildRecap(book.premise || premise, pagesWithChoice);
    const prompt = `The player's chosen action: ${act}\n\nContinue from here — write the page that follows, and offer 2–4 new choices (or end the story if it has reached a strong conclusion).`;

    const out = await runTurn(prompt, convId, recap);
    if (!out) {
      // failure: roll the just-made choice back to unselected, restoring the original pending choices so the player can retry
      setError('This step failed to continue. Please retry, or try a different action.');
      setPages((s) => s.map((x, i) => (i === s.length - 1 ? { ...x, chosen: '', choices: cur.choices } : x)));
      await data.setPageChoice(appId, book.id, cur.idx, '', cur.choices);
      setChoices((c) => (c.length ? c : cur.choices.length ? cur.choices : [act]));
      setBusy(false);
      return;
    }
    const { turn, conversationId } = out;
    const nextIdx = cur.idx + 1;
    const ended = turn.choices.length === 0;

    await data.insertPage(appId, book.id, nextIdx, turn.narrative, '', turn.choices); // store the new page along with its pending choices
    await data.setBookState(appId, book.id, conversationId, ended ? 'ended' : 'ongoing');

    idxOfNew.current = nextIdx;
    setPages((s) => [...s, { idx: nextIdx, narrative: turn.narrative, chosen: '', choices: turn.choices }]);
    setConvId(conversationId);
    setBook((st) => (st ? { ...st, conversation_id: conversationId, status: ended ? 'ended' : 'ongoing' } : st));
    setChoices(turn.choices);
    setBusy(false);
    loadShelf();
  }

  // ── Reopen an existing book: load the whole thing + restore the session + restore any pending choices at the decision point ──
  async function openBook(s: BookRow) {
    setError(''); setComposing(false); setView('reader'); setBusy(false); setCustom('');
    setBook(s); setPremise(s.premise); setConvId(s.conversation_id); setPages([]); setChoices([]);
    setFontStep(1); setTheme('day');
    idxOfNew.current = -1; // loading an old book should not trigger the "freshly landed" animation

    const sc = await data.loadPages(appId, s.id);
    setPages(sc);
    // If stopped at a decision point (the last page has no chosen action yet), just show the stored pending choices.
    const last = sc[sc.length - 1];
    setChoices(last && !last.chosen && s.status !== 'ended' ? last.choices : []);
  }

  // Stopped at a decision point but with no persisted pending choices (legacy data or an anomaly) → have the engine give fresh choices based on the current state.
  async function resumeChoices() {
    if (!book || busy) return;
    setError(''); setBusy(true);
    const recap = buildRecap(book.premise || premise, pages);
    const prompt = 'Continue from here, and based on the current situation offer 2–4 viable choices (hold the camera steady on this moment in a sentence or two — do not jump into new plot).';
    const out = await runTurn(prompt, convId, recap);
    if (!out) { setError('Failed to retrieve choices. Please try again.'); setBusy(false); return; }
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
    if (!confirm('Delete this story? This cannot be undone.')) return;
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
