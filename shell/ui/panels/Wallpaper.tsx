import { useEffect, useState } from 'react';
import { allWallpapers, loadCustomWallpapers, saveCustomWallpapers, cssToStyle, type Wallpaper } from '../lib/wallpapers';
import './Wallpaper.css';

// The "壁纸生成器" device: a graphite panel of recessed wallpaper wells + a bottom bay
// that describes a wallpaper and generates it (one AI turn), with a looping rainbow scan.
const SCAN_WORDS = ["正在生成…", "正在绘制…", "马上就好…"];

export function Wallpaper({
  current,
  onPick,
}: {
  current: string;
  onPick: (id: string) => void;
}) {
  const [list, setList] = useState<Wallpaper[]>(() => allWallpapers());
  const [prompt, setPrompt] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [word, setWord] = useState(SCAN_WORDS[0]);

  // cycle the scan status word while the (variable-length) generation is in flight
  useEffect(() => {
    if (!busy) return;
    let i = 0;
    setWord(SCAN_WORDS[0]);
    const t = setInterval(() => { i = (i + 1) % SCAN_WORDS.length; setWord(SCAN_WORDS[i]); }, 900);
    return () => clearInterval(t);
  }, [busy]);

  async function create() {
    const desc = prompt.trim();
    if (!desc || busy) return;
    setBusy(true);
    setError('');
    try {
      const r = await fetch('/api/wallpaper/create', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ prompt: desc }),
      }).then((x) => x.json());
      if (!r?.ok || !r.id || !r.css) throw new Error(r?.error || "生成失败");
      const wp: Wallpaper = { id: r.id, name: desc.slice(0, 8), css: r.css };
      saveCustomWallpapers([...loadCustomWallpapers(), wp]);
      setList((l) => [...l, wp]);
      onPick(wp.id); // apply + close
    } catch (e) {
      setError((e as Error)?.message || "生成失败");
      setBusy(false);
    }
  }

  return (
    <div className="wpk-dev">
        <div className="wpk-screen">
          <div className="wpk-cells">
            {list.map((wp) => (
              <button
                key={wp.id}
                className={`wpk-cell${current === wp.id ? ' sel' : ''}`}
                onClick={() => onPick(wp.id)}
                title={wp.name}
              >
                <div className="wpk-tile">
                  <div className="wpk-scene" style={cssToStyle(wp.css)} />
                  <div className="wpk-cap">{wp.name}</div>
                </div>
                <span className="wpk-chk">✓</span>
              </button>
            ))}
          </div>
        </div>

        <div className="wpk-bay">
          {busy ? (
            <div className="wpk-scan">
              <div className="wpk-grid2" />
              <div className="wpk-wash" />
              <div className="wpk-beam" />
              <div className="wpk-st">{word}</div>
            </div>
          ) : (
            <div className="wpk-form">
              <input
                value={prompt}
                placeholder={"描述你想要的壁纸,点生成…(例如:星空 / 沙丘 / 竹林)"}
                maxLength={40}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) create(); }}
              />
              <button className="wpk-genbtn" onClick={create} disabled={!prompt.trim()}>{"生成"}</button>
            </div>
          )}
        </div>

        {error && <div className="wpk-err">{error}</div>}
    </div>
  );
}
