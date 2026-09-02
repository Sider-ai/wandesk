// Right half: her moments (posts) — list + like + comment input. Pure display; data and reply logic live in index.
import { momentTime } from '../lib/format';
import type { Moment } from '../lib/persona';

export function MomentsPane({
  moments, cmtFor, cmtText, setCmtFor, setCmtText, onToggleLike, onSubmitComment,
}: {
  moments: Moment[];
  cmtFor: number | null;
  cmtText: string;
  setCmtFor: (id: number | null) => void;
  setCmtText: (v: string) => void;
  onToggleLike: (mo: Moment) => void;
  onSubmitComment: (mo: Moment) => void;
}) {
  const todayCnt = moments.filter((m) => momentTime(m.created_at).startsWith('Today')).length;

  return (
    <div className="lw-space">
      <div className="lw-space-title">📢 Her Moments {todayCnt > 0 && <span className="lw-cnt">{todayCnt} today</span>}</div>
      <div className="lw-space-body">
        {moments.length === 0 && <div className="lw-space-empty">She hasn't posted anything yet — chat a bit and check back?</div>}
        {moments.map((mo) => (
          <div key={mo.id} className="lw-feed-item">
            <div className="lw-ftxt"><span className="lw-fem">{mo.emoji}</span> {mo.content}</div>
            <div className="lw-fmeta">
              {momentTime(mo.created_at)} ·
              <span className={`lw-like ${mo.liked ? 'on' : ''}`} onClick={() => onToggleLike(mo)}>
                {mo.liked ? `❤ Liked (${mo.likes + 1})` : `Like (${mo.likes})`}
              </span>
              <span className="lw-cmt" onClick={() => { setCmtFor(cmtFor === mo.id ? null : mo.id); setCmtText(''); }}>
                Comment{mo.comments.length > 0 ? ` (${mo.comments.length})` : ''}
              </span>
            </div>
            {mo.comments.length > 0 && (
              <div className="lw-fcmts">
                {mo.comments.map((c, i) => (
                  <div key={i} className="lw-fcmt"><b>{c.who}:</b>{c.text}</div>
                ))}
              </div>
            )}
            {cmtFor === mo.id && (
              <div className="lw-cmtrow">
                <input
                  autoFocus
                  value={cmtText}
                  placeholder="Reply to her…"
                  onChange={(e) => setCmtText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSubmitComment(mo); }}
                />
                <button onClick={() => onSubmitComment(mo)}>Reply</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
