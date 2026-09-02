import { useEffect, useState } from 'react';
import { proxy } from './wandesk/http';
import { agent } from './wandesk/agent';
import { Md } from './md';
import * as data from './db';
import type { Hit, HistoryRow } from './db';
import './style.css';

// Hacker News — headline reader. Per-story AI analysis (agentic + cached) + favorites + analysis history.
const APP = 'hackernews';
type View = 'list' | 'fav' | 'history';

const SOURCES = [
  ['Top', 'search?tags=front_page'],
  ['New', 'search_by_date?tags=story'],
  ['Ask', 'search?tags=ask_hn'],
] as const;

const HN_ITEM = (id: string) => `https://news.ycombinator.com/item?id=${id}`;
const domainOf = (url: string | null) => { try { return url ? new URL(url).hostname.replace(/^www\./, '') : ''; } catch { return ''; } };
function ago(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)} minutes ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} hours ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

const analyzePrompt = (h: Hit) =>
  `Analyze this Hacker News headline in English.\n\nResearch before drawing conclusions:\n` +
  `1. Use internet/shell access to open and read the original link (if it has a url).\n2. If needed, check the HN discussion (${HN_ITEM(h.objectID)}).\n3. Then write the analysis.\n\n` +
  `The analysis should cover: what this is about, why it's worth attention, roughly what the HN community is discussing / what viewpoints exist, and a one-sentence takeaway for the reader.\nReturn only the analysis body (English, markdown).\n\n` +
  `Title: ${h.title}\nLink: ${h.url || '(no external link, this is the HN discussion post itself)'}\nPoints: ${h.points} · Comments: ${h.num_comments}`;

export default function HackerNews({ appId }: { appId: string }) {
  const [view, setView] = useState<View>('list');
  const [src, setSrc] = useState(0);
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [analyses, setAnalyses] = useState<Record<string, string>>({});
  const [analyzing, setAnalyzing] = useState<Set<string>>(new Set());
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [favHits, setFavHits] = useState<Hit[]>([]);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const [openHist, setOpenHist] = useState<string | null>(null);

  useEffect(() => { data.favSet().then(setFavs).catch(() => {}); }, []);

  useEffect(() => {
    if (view !== 'list') return;
    let cancelled = false;
    setLoading(true); setErr('');
    const url = `https://hn.algolia.com/api/v1/${SOURCES[src][1]}&hitsPerPage=30`;
    proxy(appId, url)
      .then(async (r) => {
        if (cancelled) return;
        if (!r.ok || !r.body) throw new Error(r.error || 'Request failed');
        const list = (JSON.parse(r.body).hits as Hit[]).filter((h) => h.title);
        setHits(list);
        setAnalyses(await data.cachedAnalyses(list.map((x) => x.objectID)));
      })
      .catch((e) => !cancelled && setErr(String(e.message || e)))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [appId, src, view]);

  useEffect(() => {
    if (view !== 'fav') return;
    data.listFavs().then(async (list) => {
      setFavHits(list);
      const cached = await data.cachedAnalyses(list.map((x) => x.objectID));
      setAnalyses((a) => ({ ...a, ...cached }));
    }).catch(() => {});
  }, [view]);

  useEffect(() => { if (view === 'history') data.listHistory().then(setHistory).catch(() => {}); }, [view]);

  const open = (u: string) => window.open(u, '_blank', 'noopener');

  async function analyzeStory(h: Hit) {
    if (analyses[h.objectID] || analyzing.has(h.objectID)) return;
    setAnalyzing((s) => new Set(s).add(h.objectID));
    try {
      const res = await agent(APP, analyzePrompt(h));
      const text = res.ok ? (res.result || '').trim() : `(Analysis failed: ${res.error || 'no response from engine'})`;
      setAnalyses((a) => ({ ...a, [h.objectID]: text }));
      if (res.ok && text) await data.saveAnalysis(h.objectID, h.title, text);
    } finally {
      setAnalyzing((s) => { const n = new Set(s); n.delete(h.objectID); return n; });
    }
  }

  async function toggleFav(h: Hit) {
    const has = favs.has(h.objectID);
    setFavs((s) => { const n = new Set(s); has ? n.delete(h.objectID) : n.add(h.objectID); return n; });
    if (has) { await data.removeFav(h.objectID); if (view === 'fav') setFavHits((l) => l.filter((x) => x.objectID !== h.objectID)); }
    else await data.addFav(h);
  }

  const card = (h: Hit, i: number) => {
    const dom = domainOf(h.url);
    const done = !!analyses[h.objectID];
    const busy = analyzing.has(h.objectID);
    const fav = favs.has(h.objectID);
    return (
      <div className="hn-item" key={h.objectID}>
        <div className="hn-row">
          {view === 'list' && <span className="hn-rank">{i + 1}</span>}
          <div className="hn-body">
            <div className="hn-titline">
              <span className="hn-t" onClick={() => open(h.url || HN_ITEM(h.objectID))}>{h.title}</span>
              {dom && <span className="hn-dom">({dom})</span>}
            </div>
            <div className="hn-meta">
              <span className="hn-pts">▲ {h.points}</span>
              <span>{h.author}</span>
              {h.created_at && <span>{ago(h.created_at)}</span>}
              <span className="hn-cmt" onClick={() => open(HN_ITEM(h.objectID))}>💬 {h.num_comments}</span>
              <button className={`hn-ai${done ? ' done' : ''}`} disabled={busy || done} onClick={() => analyzeStory(h)}>
                {busy ? '⟳ Analyzing…' : done ? '✓ Analyzed' : '✦ AI Analyze'}
              </button>
            </div>
          </div>
          <button className={`hn-fav${fav ? ' on' : ''}`} title={fav ? 'Remove from favorites' : 'Favorite'} onClick={() => toggleFav(h)}>{fav ? '★' : '☆'}</button>
        </div>
        {busy && <div className="hn-analysis hn-mini">⟳ AI is reading the article and discussion…</div>}
        {done && <div className="hn-analysis"><Md src={analyses[h.objectID]} /></div>}
      </div>
    );
  };

  return (
    <div className="hn-root">
      <header className="hn-bar">
        <span className="hn-logo">Y</span>
        <span className="hn-brand">Hacker News</span>
        <div className="hn-seg">
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>Top</button>
          <button className={view === 'fav' ? 'on' : ''} onClick={() => setView('fav')}>Favorites</button>
          <button className={view === 'history' ? 'on' : ''} onClick={() => setView('history')}>Analysis History</button>
        </div>
      </header>

      {view === 'list' && (
        <div className="hn-src">
          {SOURCES.map(([label], i) => <button key={label} className={src === i ? 'on' : ''} onClick={() => setSrc(i)}>{label}</button>)}
        </div>
      )}

      <div className="hn-list">
        {view === 'list' ? (
          loading ? <div className="hn-state">Loading…</div>
            : err ? <div className="hn-state hn-err">Something went wrong: {err}</div>
            : hits.map(card)
        ) : view === 'fav' ? (
          favHits.length === 0 ? <div className="hn-state">No favorites yet — click ☆ on a headline to favorite it</div> : favHits.map(card)
        ) : (
          history.length === 0 ? <div className="hn-state">No AI analysis yet — click "✦ AI Analyze" on a headline</div> : history.map((h) => (
            <div key={h.story_id} className="hn-hist">
              <button className="hn-hist-head" onClick={() => setOpenHist(openHist === h.story_id ? null : h.story_id)}>
                <span className="hn-hist-name">{h.title}</span>
                <span className="hn-hist-date">{h.created_at.slice(0, 10)}</span>
                <span className="hn-hist-caret">{openHist === h.story_id ? '▾' : '▸'}</span>
              </button>
              {openHist === h.story_id && <div className="hn-analysis"><Md src={h.analysis} /></div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
