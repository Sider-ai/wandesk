// Tear-page confirmation overlay.
export function DeleteModal({ onCancel, onConfirm }: { onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="nb-modal" role="dialog" aria-modal="true" aria-label="Tear out this page">
      <div className="nb-modal-card">
        <div className="nb-modal-mark">✂</div>
        <div className="nb-modal-text">Tear out this page? Once torn out, it can't be recovered.</div>
        <div className="nb-modal-btns">
          <button className="nb-modal-cancel" onClick={onCancel}>Keep it</button>
          <button className="nb-modal-ok" onClick={onConfirm}>Tear out</button>
        </div>
      </div>
    </div>
  );
}
