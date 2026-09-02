// Su Wan — cherry-blossom avatar (breathes gently while thinking).
export function Portrait({ thinking }: { thinking?: boolean }) {
  return (
    <span className={`lw-portrait ${thinking ? 'thinking' : ''}`} role="img" aria-label="Su Wan">🌸</span>
  );
}
