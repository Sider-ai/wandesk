// Chip stack + expressive avatar (purely decorative).
import type { Mood } from '../lib/game';

export function ChipStack({ amount, variant }: { amount: number; variant: 'pot' | 'seat' }) {
  if (amount <= 0) return null;
  const max = variant === 'pot' ? 7 : 4;
  const n = Math.max(1, Math.min(max, Math.round(Math.log2(amount / 8 + 1)) + 1));
  const tiers = ['t-red', 't-blue', 't-green', 't-gold', 't-black'];
  return (
    <span className={`pk-chipstack ${variant}`} aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i} className={`pk-chip ${tiers[i % tiers.length]}`} style={{ bottom: `${i * (variant === 'pot' ? 5 : 3.5)}px` }} />
      ))}
    </span>
  );
}

export function Avatar({ emoji, mood, active, hero }: { emoji: string; mood: Mood; active?: boolean; hero?: boolean }) {
  return (
    <span className={`pk-avatar mood-${mood} ${active ? 'is-active' : ''} ${hero ? 'hero' : ''}`}>
      <span className="pk-avatar-glow" aria-hidden />
      <span className="pk-avatar-face">{emoji}</span>
    </span>
  );
}
