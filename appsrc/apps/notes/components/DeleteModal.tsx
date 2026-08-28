// 撕页确认弹层。
export function DeleteModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="nb-modal" role="dialog" aria-modal="true" aria-label="撕掉这一页">
      <div className="nb-modal-card">
        <div className="nb-modal-mark">✂</div>
        <div className="nb-modal-text">把这一页撕掉？撕掉就找不回来了。</div>
        <div className="nb-modal-btns">
          <button className="nb-modal-cancel" onClick={onCancel}>留着</button>
          <button className="nb-modal-ok" onClick={onConfirm}>撕掉</button>
        </div>
      </div>
    </div>
  );
}
