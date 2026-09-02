import { useEffect, useRef, useState } from 'react';
import { agent } from './wandesk/agent';
import { Backdrop } from './components/Backdrop';
import { Altar } from './components/Altar';
import { ReadingScroll } from './components/ReadingScroll';
import {
  CACHE_KEY, DIVINER, type Phase, type Reading,
  lookupHexagram, parseReading, shakeOnce, six, sleep, toneOf, trigramPair,
} from './lib/yijing';
import './style.css';

/* 算一卦 (fortune) — 摇铜钱起六爻,得一卦,再请卦师解读。
   本文件只做:状态 + 起卦/解卦流程 + 组装;卦表与纯逻辑在 lib/yijing.ts,
   天象背景/卦坛/解读卷轴在 components/。 */

export default function Fortune({ appId }: { appId: string }) {
  const [question, setQuestion] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [hexName, setHexName] = useState('');
  const [yaos, setYaos] = useState<(number | null)[]>(six<number | null>(null));
  const [coins, setCoins] = useState<number[][]>([[], [], [], [], [], []]);
  const [changing, setChanging] = useState<boolean[]>(six(false));
  const [castIdx, setCastIdx] = useState(-1);
  const [pair, setPair] = useState<{ upper: number; lower: number } | null>(null);
  const [reading, setReading] = useState<Reading | null>(null);
  const askedRef = useRef('');

  // restore last cached cast (single, not history)
  useEffect(() => {
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (c && c.reading && Array.isArray(c.yaos)) {
        askedRef.current = c.question || '';
        setHexName(c.hexName || '');
        setYaos(c.yaos);
        setChanging(Array.isArray(c.changing) ? c.changing : six(false));
        setPair(c.pair || null);
        setReading(c.reading);
        setPhase('done');
      }
    } catch { /* ignore bad cache */ }
  }, []);

  const busy = phase === 'shaking' || phase === 'reading';

  async function divine() {
    const q = question.trim();
    if (!q || busy) return;
    askedRef.current = q;

    setReading(null); setHexName(''); setPair(null);
    setYaos(six<number | null>(null)); setCoins([[], [], [], [], [], []]);
    setChanging(six(false)); setCastIdx(-1);
    setPhase('shaking');
    await sleep(520);

    const all: number[] = [];
    const dispYaos: (number | null)[] = six<number | null>(null);
    const dispChg: boolean[] = six(false);
    for (let i = 0; i < 6; i += 1) {
      const { coins: c, yao, changing: ch } = shakeOnce();
      all.push(yao);
      const displayIdx = 5 - i;
      dispYaos[displayIdx] = yao; dispChg[displayIdx] = ch;
      setCastIdx(displayIdx);
      setCoins((prev) => { const next = prev.map((x) => x.slice()); next[displayIdx] = c; return next; });
      await sleep(560);
      setYaos((prev) => { const next = prev.slice(); next[displayIdx] = yao; return next; });
      setChanging((prev) => { const next = prev.slice(); next[displayIdx] = ch; return next; });
      await sleep(360);
    }
    setCastIdx(-1);

    const name = lookupHexagram(all);
    const pr = trigramPair(all);
    setPair(pr);
    await sleep(260);
    setHexName(name);
    await sleep(620);

    setPhase('reading');
    const yaoDesc = all.map((y, i) => `${['初', '二', '三', '四', '五', '上'][i]}爻:${y ? '阳' : '阴'}`).join('，');
    const prompt = `求问者所问:${q}\n所得卦象:${name}\n六爻(初爻至上爻):${yaoDesc}\n\n请只就此卦"${name}"为其解卦,按要求输出 JSON。`;

    const r = await agent(appId, prompt, { system: DIVINER });
    const rd: Reading = parseReading(r.ok ? r.result || '' : '');
    setReading(rd);
    setPhase('done');

    // cache ONLY the last cast
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ question: q, hexName: name, yaos: dispYaos, changing: dispChg, pair: pr, reading: rd }));
    } catch { /* storage full / disabled — fine, it's just a cache */ }
  }

  function restart() {
    setPhase('idle');
    setReading(null); setHexName(''); setPair(null);
    setYaos(six<number | null>(null)); setCoins([[], [], [], [], [], []]);
    setChanging(six(false)); setCastIdx(-1);
    setQuestion('');
    askedRef.current = '';
    try { localStorage.removeItem(CACHE_KEY); } catch { /* ignore */ }
  }

  const tone = reading ? toneOf(reading.signName) : 'dim';
  const casting = phase === 'shaking';

  return (
    <div className={`fo-root ${casting ? 'fo-casting' : ''} fo-tone-${tone}`}>
      <Backdrop />

      {/* ── one scrollable, centered column ── */}
      <div className={`fo-body ${phase === 'idle' ? 'fo-centered' : ''}`}>
        <div className="fo-col">
          <header className="fo-head2">
            <div className="fo-seal">卜</div>
            <h1 className="fo-title">算一卦</h1>
            <div className="fo-sub">周易六爻 · 心诚则灵</div>
          </header>

          {phase === 'idle' ? (
            <div className="fo-ask">
              <textarea
                className="fo-input"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); divine(); } }}
                rows={2}
                placeholder="把心中所问写在这里…（事业、姻缘、得失、去留）"
              />
              <button className="fo-cast" onClick={divine} disabled={!question.trim()}>
                <span className="fo-cast-coin">☯</span>摇卦起卦
              </button>
            </div>
          ) : (
            <>
              <div className="fo-asked">所问 · {askedRef.current || '—'}</div>

              <Altar
                tone={tone} casting={casting} phase={phase} hexName={hexName} pair={pair}
                yaos={yaos} coins={coins} changing={changing} castIdx={castIdx}
              />

              {phase === 'reading' && (
                <div className="fo-divining">
                  <span className="fo-div-ico">☯</span>
                  <span>卦师正在凝神解卦…</span>
                  <span className="fo-div-dots"><i /><i /><i /></span>
                </div>
              )}

              {reading && phase !== 'reading' && <ReadingScroll reading={reading} tone={tone} />}

              <div className="fo-foot">古卦今观 · 仅供娱乐参考 — 尽人事 · 听天命</div>
              <button className="fo-restart" onClick={restart} disabled={busy}>↻ 重新起卦</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
