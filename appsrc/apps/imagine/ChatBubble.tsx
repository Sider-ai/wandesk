import { useEffect, useRef, useState } from 'react';
import type { TreeNode } from './lib/types';
import { CountPicker } from './CountPicker';
import type { Pos } from './lib/layout';

// 发散气泡:挂在节点右上角,输入指令 + 选数量,生成子节点。
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
      <div className="cb-head">基于 <b>{isRoot ? '原始需求' : `「${node.title ?? '该版本'}」`}</b> 继续发散</div>
      <textarea
        ref={ref}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isRoot ? '给一个创意方向,例如:温暖手作风,陶土橙主色…' : '对这个版本说点什么,例如:保留布局,换成深色背景'}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
          if (e.key === 'Escape') onClose();
        }}
      />
      <div className="cb-foot">
        <CountPicker value={count} onChange={setCount} />
        <button className="cvbtn cvbtn-primary" onClick={submit}>{count > 1 ? `生成 ${count} 个` : '生成'}</button>
      </div>
    </div>
  );
}
