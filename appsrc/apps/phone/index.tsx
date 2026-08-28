import { useCallback, useEffect, useRef, useState } from 'react';
import { agent } from '../../system/lib/agent';
import { PhoneShell } from './components/PhoneShell';
import {
  BOOT_PROMPT, FALLBACK_HOME, SCREEN_SCHEMA, SYSTEM,
  parseScreen, stripTags, type Screen,
} from './lib/screen';
import * as data from './db';
import './style.css';

/* ════════════════════════════════════════════════════════════════════
   手机 · Phone — 一台 AI 现场生成的复古功能机。手机外壳固定,每一「屏」
   都由 AI 即兴生成为实时 HTML;整部手机 = 一个持久对话(conversationId
   落库,跨窗口/重启接着同一段生活)。本文件只做:状态 + 引擎调用 + 组装;
   屏幕契约/解析在 lib/screen.ts,落库在 db.ts,外壳在 components/。
   ════════════════════════════════════════════════════════════════════ */

export default function Phone({ appId }: { appId: string }) {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('开机中…');
  const [clock, setClock] = useState('');
  const convId = useRef<string | undefined>(undefined); // native continuity for the session
  const screenRef = useRef<Screen | null>(null);
  const lcdRef = useRef<HTMLDivElement>(null);
  screenRef.current = screen;

  // live clock in the status bar
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
    };
    tick();
    const t = window.setInterval(tick, 20000);
    return () => window.clearInterval(t);
  }, []);

  // every new screen scrolls the LCD back to the top
  useEffect(() => { lcdRef.current?.scrollTo({ top: 0 }); }, [screen]);

  // ask the agent for a screen. Warm path → continue the session natively; cold path → fresh persona.
  const ask = useCallback(async (userPrompt: string): Promise<Screen | null> => {
    const opts = convId.current
      ? { conversationId: convId.current, schema: SCREEN_SCHEMA }
      : { system: SYSTEM, schema: SCREEN_SCHEMA };
    let r;
    try { r = await agent(appId, userPrompt, opts); } catch { return null; }
    if (r.conversationId && r.conversationId !== convId.current) {
      convId.current = r.conversationId;
      void data.persistConv(appId, r.conversationId).catch(() => {});
    }
    return parseScreen(r);
  }, [appId]);

  // boot: restore the persistent conversation + the last screen from db, else power on fresh
  const boot = useCallback(async () => {
    setLoading(true);
    setToast('开机中…');
    convId.current = undefined;
    try {
      await data.ensureStateTable(appId);
      convId.current = await data.loadConv(appId);
    } catch { /* 没有会话就冷启动 */ }
    try {
      const last = await data.loadLastScreen(appId);
      if (last) { setScreen(last); setLoading(false); return; }
    } catch { /* fall through to a fresh boot */ }

    const s = (await ask(BOOT_PROMPT)) || FALLBACK_HOME;
    setScreen(s);
    if (s !== FALLBACK_HOME) await data.saveScreen(appId, s).catch(() => {});
    setLoading(false);
  }, [appId, ask]);

  useEffect(() => { void boot(); }, [boot]);

  // user picks an option (or types one) → generate the next screen
  const choose = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setBusy(true);
    setLoading(true);
    setToast(text.length > 14 ? text.slice(0, 14) + '…' : text);

    // cold path: the agent has no session memory yet, so hand it the current screen
    const ctx = () => `当前屏幕内容:${stripTags(screenRef.current?.content || '').slice(0, 240)}。\n`;
    const hadConv = !!convId.current;
    const prompt = `${hadConv ? '' : ctx()}用户选择了:「${text}」。请生成进入后的下一屏界面内容,并给出 3 个后续选项。`;

    let s = await ask(prompt);
    if (!s && hadConv) {
      // 持久会话可能已失效(引擎切换/清理):重开一个,带上当前屏幕做上下文再试一次
      convId.current = undefined;
      s = await ask(`${ctx()}用户选择了:「${text}」。请生成进入后的下一屏界面内容,并给出 3 个后续选项。`);
    }
    if (s) { setScreen(s); await data.saveScreen(appId, s).catch(() => {}); }
    else setToast('信号中断,再按一次试试');
    setCustom('');
    setBusy(false);
    setLoading(false);
  }, [appId, busy, ask]);

  return (
    <PhoneShell
      screen={screen} loading={loading} busy={busy} toast={toast} clock={clock}
      custom={custom} setCustom={setCustom} onChoose={(raw) => void choose(raw)} lcdRef={lcdRef}
    />
  );
}
