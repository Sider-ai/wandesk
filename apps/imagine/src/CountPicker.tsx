// 一次发散几个变体(1–3)。
export function CountPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="cv-count" title="一次生成几个变体">
      {[1, 3, 5].map((n) => (
        <button key={n} className={value === n ? 'on' : ''} onClick={() => onChange(n)}>{n}</button>
      ))}
    </div>
  );
}
