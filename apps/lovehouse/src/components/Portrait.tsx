// 苏晚 — 樱花头像(思考时轻轻呼吸)。
export function Portrait({ thinking }: { thinking?: boolean }) {
  return (
    <span className={`lw-portrait ${thinking ? 'thinking' : ''}`} role="img" aria-label="苏晚">🌸</span>
  );
}
