import { useCallback, useEffect, useRef, useState } from 'react';
import { agent } from './wandesk/agent';
import { ChatPane } from './components/ChatPane';
import { MomentsPane } from './components/MomentsPane';
import {
  MOMENT_PERSONA, MOMENT_SCHEMA, MOMENT_STALE_MS, PERSONA,
  clamp, type Moment, type Msg,
} from './lib/persona';
import { buildPrompt, continuePrompt, isDup, toDate } from './lib/format';
import * as data from './db';
import './style.css';

/* ════════════════════════════════════════════════════════════════════
   Love House (lovehouse) — retro 2008 chat-software style. Chat with Su
   Wan on the left; on the right is "her moments" (posts the AI shares
   as her, likeable and commentable). Affection / mood / memory all stay
   internal mechanics: they drive her attitude but aren't shown in the UI.
   This file only handles: state + event handling + composition; display
   lives in components/, data in db.ts, persona/formatting/prompts in lib/.
   ════════════════════════════════════════════════════════════════════ */

export default function LoveHouse({ appId }: { appId: string }) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [mems, setMems] = useState<string[]>([]);
  const [aff, setAff] = useState(0);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [emoOpen, setEmoOpen] = useState(false);
  const [moments, setMoments] = useState<Moment[]>([]);
  const [cmtFor, setCmtFor] = useState<number | null>(null); // which moment is being commented on
  const [cmtText, setCmtText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // On open: if the newest moment is more than 6 hours old (or there isn't one yet), she
  // posts a new one in passing (using memories and recent chat, fails silently)
  const freshenMoments = useCallback(async (list: Moment[], memories: string[], history: Msg[]) => {
    const newest = list[0];
    if (newest && Date.now() - toDate(newest.created_at).getTime() < MOMENT_STALE_MS) return;
    const mem = memories.length ? memories.map((m) => '· ' + m).join('\n') : '(nothing remembered yet)';
    const hist = history.filter((m) => m.role !== 'sys').slice(-8)
      .map((m) => (m.role === 'user' ? 'Him: ' : 'Su Wan: ') + m.content).join('\n') || '(no conversation yet)';
    const old = list.slice(0, 5).map((m) => '· ' + m.content).join('\n') || '(nothing posted yet)';
    const prompt =
      `[What you remember]\n${mem}\n\n[Recent conversation]\n${hist}\n\n[Moments you recently posted]\n${old}\n\n` +
      `Now, as Su Wan, post a new moment on your own feed: a slice of life, a mood, a bit of ` +
      `griping, or an oblique mention of "someone" — any of these work. Don't repeat what ` +
      `you've already posted, keep it under 200 characters, and make it sound like something ` +
      `a real person casually posted. Output JSON: emoji is a single emoji that best fits the ` +
      `content, content is the body of the post (without the emoji).`;
    try {
      const r = await agent(appId, prompt, { system: MOMENT_PERSONA, schema: MOMENT_SCHEMA });
      const j = (r.ok && r.json) as { emoji?: string; content?: string } | false;
      const content = j && String(j.content || '').trim();
      if (!content) return;
      const emoji = (j && String(j.emoji || '').trim()) || '💭';
      await data.insertMoment(appId, emoji, content, 1 + Math.floor(Math.random() * 4));
      setMoments(await data.loadMoments(appId));
    } catch { /* couldn't post it, no big deal — try again next time the app opens */ }
  }, [appId]);

  useEffect(() => {
    (async () => {
      const history = await data.loadMessages(appId);
      setMsgs(history);
      const memories = await data.loadMemories(appId);
      setMems(memories);
      const state = await data.loadState(appId);
      setAff(clamp(Number(state.affection) || 0));
      await data.ensureMomentsTable(appId);
      const list = await data.loadMoments(appId);
      setMoments(list);
      void freshenMoments(list, memories, history);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 1e9, behavior: 'smooth' }); }, [msgs, busy]);

  async function send() {
    const content = text.trim();
    if (!content || busy) return;
    setText('');
    setEmoOpen(false);
    const uid = await data.insertMessage(appId, 'user', content);
    setMsgs((m) => [...m, { id: uid, role: 'user', content }]);
    setBusy(true);

    let r = convId
      ? await agent(appId, continuePrompt(mems, content, aff), { conversationId: convId })
      : await agent(appId, buildPrompt(msgs, mems, content, aff), { system: PERSONA });
    if (!r.ok && convId) r = await agent(appId, buildPrompt(msgs, mems, content, aff), { system: PERSONA });
    if (r.conversationId) setConvId(r.conversationId);

    let reply = r.ok ? r.result || '…' : '(bad signal, say that again?)';
    const memM = reply.match(/<mem>([\s\S]*?)<\/mem>/i);
    const affM = reply.match(/<affection>\s*([+-]?\d+)\s*<\/affection>/i);
    reply = reply.replace(/<mem>[\s\S]*?<\/mem>/gi, '').replace(/<affection>[\s\S]*?<\/affection>/gi, '').replace(/<mood>[\s\S]*?<\/mood>/gi, '').trim() || '…';

    if (affM) {
      const d = Math.max(-3, Math.min(3, parseInt(affM[1], 10) || 0));
      if (d !== 0) { const na = clamp(aff + d); setAff(na); await data.saveState(appId, 'affection', String(na)); }
    }
    if (memM) {
      const memText = memM[1].trim();
      if (memText && !isDup(memText, mems)) {
        await data.addMemory(appId, memText);
        setMems(await data.loadMemories(appId));
      }
    }

    const bid = await data.insertMessage(appId, 'bot', reply);
    setMsgs((m) => [...m, { id: bid + 1, role: 'bot', content: reply }]);
    setBusy(false);
  }

  // ── moments: like / comment ──
  async function toggleLike(mo: Moment) {
    const liked = mo.liked ? 0 : 1;
    setMoments((list) => list.map((x) => (x.id === mo.id ? { ...x, liked } : x)));
    await data.updateMomentLiked(appId, mo.id, liked);
  }
  async function submitComment(mo: Moment) {
    const t = cmtText.trim();
    if (!t) return;
    setCmtText('');
    setCmtFor(null);
    const mine = [...mo.comments, { who: 'Me', text: t }];
    setMoments((list) => list.map((x) => (x.id === mo.id ? { ...x, comments: mine } : x)));
    await data.updateMomentComments(appId, mo.id, mine);
    // She'll usually reply with something (one-off call, fails silently)
    try {
      const r = await agent(
        appId,
        `You posted a moment: "${mo.content}". He commented below it: "${t}". As Su Wan, reply with one comment, no more than 100 characters, playful and genuine in tone, output only that comment itself.`,
        { system: MOMENT_PERSONA },
      );
      const reply = r.ok ? (r.result || '').replace(/<[^>]*>/g, '').trim().slice(0, 60) : '';
      if (!reply) return;
      const withHer = [...mine, { who: 'Su Wan', text: reply }];
      setMoments((list) => list.map((x) => (x.id === mo.id ? { ...x, comments: withHer } : x)));
      await data.updateMomentComments(appId, mo.id, withHer);
    } catch { /* she didn't reply, so it goes unnoticed */ }
  }

  return (
    <div className="lw-app">
      <div className="lw-main">
        <ChatPane
          msgs={msgs} busy={busy} text={text} setText={setText}
          emoOpen={emoOpen} setEmoOpen={setEmoOpen} onSend={() => void send()}
          scrollRef={scrollRef} inputRef={inputRef}
        />
        <MomentsPane
          moments={moments} cmtFor={cmtFor} cmtText={cmtText}
          setCmtFor={setCmtFor} setCmtText={setCmtText}
          onToggleLike={(mo) => void toggleLike(mo)} onSubmitComment={(mo) => void submitComment(mo)}
        />
      </div>
    </div>
  );
}
