// 右半:她的动态(说说)——列表 + 点赞 + 评论输入。纯展示,数据与回评逻辑在 index。
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
  const todayCnt = moments.filter((m) => momentTime(m.created_at).startsWith('今天')).length;

  return (
    <div className="lw-space">
      <div className="lw-space-title">📢 她的动态 {todayCnt > 0 && <span className="lw-cnt">今天 {todayCnt} 条</span>}</div>
      <div className="lw-space-body">
        {moments.length === 0 && <div className="lw-space-empty">她还没发过动态,聊几句再来看看?</div>}
        {moments.map((mo) => (
          <div key={mo.id} className="lw-feed-item">
            <div className="lw-ftxt"><span className="lw-fem">{mo.emoji}</span> {mo.content}</div>
            <div className="lw-fmeta">
              {momentTime(mo.created_at)} ·
              <span className={`lw-like ${mo.liked ? 'on' : ''}`} onClick={() => onToggleLike(mo)}>
                {mo.liked ? `❤ 已赞(${mo.likes + 1})` : `赞(${mo.likes})`}
              </span>
              <span className="lw-cmt" onClick={() => { setCmtFor(cmtFor === mo.id ? null : mo.id); setCmtText(''); }}>
                评论{mo.comments.length > 0 ? `(${mo.comments.length})` : ''}
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
                  placeholder="回复她…"
                  onChange={(e) => setCmtText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing) onSubmitComment(mo); }}
                />
                <button onClick={() => onSubmitComment(mo)}>回复</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
