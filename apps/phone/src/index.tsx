import { useCallback, useEffect, useRef, useState } from 'react';
import { agent } from './wandesk/agent';
import { PhoneShell } from './components/PhoneShell';
import {
  BOOT_PROMPT, FALLBACK_HOME, SCREEN_SCHEMA, SYSTEM,
  parseScreen, stripTags, type Screen,
} from './lib/screen';
import * as data from './db';
import './style.css';

/* ════════════════════════════════════════════════════════════════════
   Phone — a retro feature phone generated live by AI. The phone shell
   is fixed; every "screen" is improvised by the AI as live HTML. The
   whole phone is one persistent conversation (conversationId is stored
   in the db, carrying the same unfolding life across windows/restarts).
   This file only handles: state + engine calls + assembly; the screen
   contract/parsing lives in lib/screen.ts, storage in db.ts, the shell
   in components/.
   ════════════════════════════════════════════════════════════════════ */

export default function Phone({ appId }: { appId: string }) {
  const [screen, setScreen] = useState<Screen | null>(null);
  const [custom, setCustom] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('Powering on…');
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
    setToast('Powering on…');
    convId.current = undefined;
    try {
      await data.ensureStateTable(appId);
      convId.current = await data.loadConv(appId);
    } catch { /* no conversation yet, cold-start */ }
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
    const ctx = () => `Current screen content: ${stripTags(screenRef.current?.content || '').slice(0, 240)}.\n`;
    const hadConv = !!convId.current;
    const prompt = `${hadConv ? '' : ctx()}The user chose: "${text}". Generate the next screen's interface content after entering it, and give 3 follow-up options.`;

    let s = await ask(prompt);
    if (!s && hadConv) {
      // the persistent conversation may have gone stale (engine switched/cleaned up): start a new one, with the current screen as context, and retry
      convId.current = undefined;
      s = await ask(`${ctx()}The user chose: "${text}". Generate the next screen's interface content after entering it, and give 3 follow-up options.`);
    }
    if (s) { setScreen(s); await data.saveScreen(appId, s).catch(() => {}); }
    else setToast('Signal lost, try again');
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
