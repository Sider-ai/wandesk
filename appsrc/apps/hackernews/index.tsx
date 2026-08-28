import { useEffect, useState } from 'react';
import { proxy } from '../../system/lib/http';
import { agent } from '../../system/lib/agent';
import { Md } from './md';
import * as data from './db';
import type { Hit, HistoryRow } from './db';
import './style.css';

// Hacker News — 头条阅读器。逐条 AI 解读(agentic + 缓存)+ 收藏 + 解读历史。
const APP = 'hackernews';
type View = 'list' | 'fav' | 'history';

const SOURCES = [
  ['热门', 'search?tags=front_page'],
  ['最新', 'search_by_date?tags=story'],
  ['Ask', 'search?tags=ask_hn'],
] as const;

const HN_ITEM = (id: string) => `https://news.ycombinator.com/item?id=${id}`;
const domainOf = (url: string | null) => { try { return url ? new URL(url).hostname.replace(/^www\./, '') : ''; } catch { return ''; } };
function ago(iso: string) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)} 分钟前`;
  if (s < 86400) return `${Math.floor(s / 3600)} 小时前`;
  return `${Math.floor(s / 86400)} 天前`;
}

const analyzePrompt = (h: Hit) =>
  `用中文解读这条 Hacker News 头条。\n\n在下结论前先调研:\n` +
  `1. 用联网/shell 打开这条内容的原文链接读一读(如果有 url)。\n2. 有必要就看看 HN 上的讨论(${HN_ITEM(h.objectID)})。\n3. 再写解读。\n\n` +
  `解读要覆盖:这条讲的是什么、为什么值得关注、HN 社区大致在讨论什么/有哪些观点、给读者一句话 takeaway。\n只返回解读正文(中文,markdown)。\n\n` +
  `标题:${h.title}\n链接:${h.url || '(无外链,是 HN 讨论帖本身)'}\n分数:${h.points} · 评论:${h.num_comments}`;

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
        if (!r.ok || !r.body) throw new Error(r.error || '请求失败');
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
      const text = res.ok ? (res.result || '').trim() : `(解读失败:${res.error || '引擎没响应'})`;
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
                {busy ? '⟳ 解读中…' : done ? '✓ 已解读' : '✦ AI 解读'}
              </button>
            </div>
          </div>
          <button className={`hn-fav${fav ? ' on' : ''}`} title={fav ? '取消收藏' : '收藏'} onClick={() => toggleFav(h)}>{fav ? '★' : '☆'}</button>
        </div>
        {busy && <div className="hn-analysis hn-mini">⟳ AI 正在读原文和讨论…</div>}
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
          <button className={view === 'list' ? 'on' : ''} onClick={() => setView('list')}>头条</button>
          <button className={view === 'fav' ? 'on' : ''} onClick={() => setView('fav')}>收藏</button>
          <button className={view === 'history' ? 'on' : ''} onClick={() => setView('history')}>解读历史</button>
        </div>
      </header>

      {view === 'list' && (
        <div className="hn-src">
          {SOURCES.map(([label], i) => <button key={label} className={src === i ? 'on' : ''} onClick={() => setSrc(i)}>{label}</button>)}
        </div>
      )}

      <div className="hn-list">
        {view === 'list' ? (
          loading ? <div className="hn-state">加载中…</div>
            : err ? <div className="hn-state hn-err">出错了:{err}</div>
            : hits.map(card)
        ) : view === 'fav' ? (
          favHits.length === 0 ? <div className="hn-state">还没有收藏 —— 在头条里点 ☆ 收藏</div> : favHits.map(card)
        ) : (
          history.length === 0 ? <div className="hn-state">还没有 AI 解读记录 —— 在头条上点「✦ AI 解读」</div> : history.map((h) => (
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
