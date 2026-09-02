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
   恋爱屋 (lovehouse) — 2008 复古聊天软件风格。左边和苏晚聊天,右边是"她的
   动态"(AI 以她的身份发的空间说说,可赞可评)。好感度/心情/记忆全部
   保留为内部机制:驱动她的态度,但不在界面上展示。
   本文件只做:状态 + 事件处理 + 组装;展示在 components/,数据在 db.ts,
   人设/格式/提示词在 lib/。
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
  const [cmtFor, setCmtFor] = useState<number | null>(null); // 正在评论哪条动态
  const [cmtText, setCmtText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 开屏:最新动态超过 6 小时(或还没有),她就顺手发一条(带上记忆和最近聊天,静默失败)
  const freshenMoments = useCallback(async (list: Moment[], memories: string[], history: Msg[]) => {
    const newest = list[0];
    if (newest && Date.now() - toDate(newest.created_at).getTime() < MOMENT_STALE_MS) return;
    const mem = memories.length ? memories.map((m) => '· ' + m).join('\n') : '(还没记下什么)';
    const hist = history.filter((m) => m.role !== 'sys').slice(-8)
      .map((m) => (m.role === 'user' ? '他:' : '苏晚:') + m.content).join('\n') || '(还没聊过)';
    const old = list.slice(0, 5).map((m) => '· ' + m.content).join('\n') || '(还没发过)';
    const prompt =
      `【你记得的事】\n${mem}\n\n【最近对话】\n${hist}\n\n【你最近发过的动态】\n${old}\n\n` +
      `现在以苏晚的身份,在自己的空间里发一条新动态(说说):生活碎片、心情、吐槽或含蓄地提到"某人"都行,` +
      `不要和发过的重复,不超过 50 个字,像真人随手发的。输出 JSON:emoji 是一个最贴合内容的 emoji,content 是动态正文(不含 emoji)。`;
    try {
      const r = await agent(appId, prompt, { system: MOMENT_PERSONA, schema: MOMENT_SCHEMA });
      const j = (r.ok && r.json) as { emoji?: string; content?: string } | false;
      const content = j && String(j.content || '').trim();
      if (!content) return;
      const emoji = (j && String(j.emoji || '').trim()) || '💭';
      await data.insertMoment(appId, emoji, content, 1 + Math.floor(Math.random() * 4));
      setMoments(await data.loadMoments(appId));
    } catch { /* 发不出去就算了,下次开屏再试 */ }
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

    let reply = r.ok ? r.result || '…' : '(信号不太好,再跟我说一次)';
    const memM = reply.match(/<mem>([\s\S]*?)<\/mem>/i);
    const affM = reply.match(/<好感>\s*([+-]?\d+)\s*<\/好感>/);
    reply = reply.replace(/<mem>[\s\S]*?<\/mem>/gi, '').replace(/<好感>[\s\S]*?<\/好感>/g, '').replace(/<心情>[\s\S]*?<\/心情>/g, '').trim() || '…';

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

  // ── 动态:点赞 / 评论 ──
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
    const mine = [...mo.comments, { who: '我', text: t }];
    setMoments((list) => list.map((x) => (x.id === mo.id ? { ...x, comments: mine } : x)));
    await data.updateMomentComments(appId, mo.id, mine);
    // 她通常会回一句(一次性调用,失败就静默)
    try {
      const r = await agent(
        appId,
        `你发了一条动态:「${mo.content}」。他在下面评论:「${t}」。以苏晚的身份回他一句评论,不超过 25 个字,口吻俏皮真实,只输出这句话本身。`,
        { system: MOMENT_PERSONA },
      );
      const reply = r.ok ? (r.result || '').replace(/<[^>]*>/g, '').trim().slice(0, 60) : '';
      if (!reply) return;
      const withHer = [...mine, { who: '苏晚', text: reply }];
      setMoments((list) => list.map((x) => (x.id === mo.id ? { ...x, comments: withHer } : x)));
      await data.updateMomentComments(appId, mo.id, withHer);
    } catch { /* 她没回,就当没看见 */ }
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
