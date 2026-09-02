import { useEffect, useRef, useState } from 'react';
import type { TreeNode } from './lib/types';
import { CountPicker } from './CountPicker';
import type { Pos } from './lib/layout';

// Branch bubble: anchored at the node's top-right corner, takes an instruction + a count, then generates child nodes.
export function ChatBubble({ node, pos, onSubmit, onClose }: {
  node: TreeNode;
  pos: Pos;
  onSubmit: (instruction: string, count: number) => void;
  onClose: () => void;
}) {
  const [text, setText] = useState('');
  const [count, setCount] = useState(3);
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const t = setTimeout(() => ref.current?.focus(), 60); return () => clearTimeout(t); }, [node.id]);

  const isRoot = node.parent_id === null;
  const submit = () => { if (text.trim()) onSubmit(text.trim(), count); };
  const arrowTop = 44;
  const bubblePos = { left: pos.x + pos.w / 2 + 3 + 24, top: pos.y - pos.h / 2 + 1 - arrowTop };

  return (
    <div
      className="cv-bubble"
      style={{ ...bubblePos, width: 280, ['--arrow-top' as string]: `${arrowTop}px` }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="cb-head">Branch from <b>{isRoot ? 'the original requirement' : `"${node.title ?? 'this version'}"`}</b></div>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isRoot ? 'Give a creative direction, e.g.: warm handcrafted style, terracotta orange…' : 'Say something about this version, e.g.: keep the layout, switch to a dark background'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
          if (e.key === 'Escape') onClose();
        }}
      />
      <div className="cb-foot">
        <CountPicker value={count} onChange={setCount} />
        <button className="cvbtn cvbtn-primary" onClick={submit}>{count > 1 ? `Generate ${count}` : 'Generate'}</button>
      </div>
    </div>
  );
}
