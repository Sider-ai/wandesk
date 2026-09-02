import { useEffect, useState } from 'react';
import { allWallpapers, loadCustomWallpapers, saveCustomWallpapers, cssToStyle, wallpaperName, type Wallpaper } from '../lib/wallpapers';
import { t } from '../lib/i18n';
import './Wallpaper.css';

// The "壁纸生成器" device: a graphite panel of recessed wallpaper wells + a bottom bay
// that describes a wallpaper and generates it (one AI turn), with a looping rainbow scan.
const SCAN_WORD_KEYS = ["wallpaper.scan.gen", "wallpaper.scan.draw", "wallpaper.scan.soon"];

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
  const [word, setWord] = useState(t(SCAN_WORD_KEYS[0]));

  // cycle the scan status word while the (variable-length) generation is in flight
  useEffect(() => {
    if (!busy) return;
    let i = 0;
    setWord(t(SCAN_WORD_KEYS[0]));
    const timer = setInterval(() => { i = (i + 1) % SCAN_WORD_KEYS.length; setWord(t(SCAN_WORD_KEYS[i])); }, 900);
    return () => clearInterval(timer);
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
      if (!r?.ok || !r.id || !r.css) throw new Error(r?.error || t("wallpaper.fail"));
      const wp: Wallpaper = { id: r.id, name: desc.slice(0, 8), css: r.css };
      saveCustomWallpapers([...loadCustomWallpapers(), wp]);
      setList((l) => [...l, wp]);
      onPick(wp.id); // apply + close
    } catch (e) {
      setError((e as Error)?.message || t("wallpaper.fail"));
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
                title={wallpaperName(wp)}
              >
                <div className="wpk-tile">
                  <div className="wpk-scene" style={cssToStyle(wp.css)} />
                  <div className="wpk-cap">{wallpaperName(wp)}</div>
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
                placeholder={t("wallpaper.placeholder")}
                maxLength={40}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) create(); }}
              />
              <button className="wpk-genbtn" onClick={create} disabled={!prompt.trim()}>{t("wallpaper.generate")}</button>
            </div>
          )}
        </div>

        {error && <div className="wpk-err">{error}</div>}
    </div>
  );
}
