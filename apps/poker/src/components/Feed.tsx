// One row of the right-hand live feed (system / result / speech bubble / action).
import { ACTION_LABEL, type FeedLine } from '../lib/game';

export function FeedRow({ line, botEmoji }: { line: FeedLine; botEmoji: string }) {
  if (line.kind === 'sys') return <div className="pk-feed-sysline">{line.text}</div>;
  if (line.kind === 'result') return <div className="pk-feed-result">{line.text}</div>;
  if (line.kind === 'say') {
    // the AI's table-talk — a chat bubble
    return (
      <div className="pk-msg ai say">
        <span className="pk-msg-ava" aria-hidden>{botEmoji}</span>
        <div className="pk-msg-body">
          <div className="pk-msg-who">{line.who}</div>
          <div className="pk-msg-bubble">{line.text}</div>
        </div>
      </div>
    );
  }
  // an action line (ai or you)
  const mine = line.kind === 'you';
  return (
    <div className={`pk-msg ${mine ? 'you' : 'ai'} act`}>
      {!mine && <span className="pk-msg-ava" aria-hidden>{botEmoji}</span>}
      <div className="pk-msg-body">
        <div className="pk-msg-who">
          {line.who}
          {line.action && <span className={`pk-act-pill ${line.action === 'allin' ? 'call' : line.action}`}>{ACTION_LABEL[line.action] || ''}</span>}
        </div>
        <div className="pk-msg-line">{line.text}</div>
      </div>
      {mine && <span className="pk-msg-ava you-ava" aria-hidden>🧑</span>}
    </div>
  );
}
