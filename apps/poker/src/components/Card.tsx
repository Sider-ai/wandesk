// A single playing card (front + back, plus the deal animation).
import { RANK_LABEL, type Card } from '../lib/cards';

function CardBody({ card }: { card: Card }) {
  // A clean, clear rank + suit, centered (a pip layout would collide with the corner labels at this size).
  return (
    <span className="pk-figure">
      <b className="pk-fig-rank">{RANK_LABEL[card.rank]}</b>
      <i className="pk-fig-suit">{card.suit}</i>
    </span>
  );
}

export function CardView({
  card, faceUp, idx, dealing, big,
}: {
  card: Card; faceUp: boolean; idx: number; dealing?: boolean; big?: boolean;
}) {
  const red = card.suit === '♥' || card.suit === '♦';
  return (
    <div
      className={`pk-card ${big ? 'big' : ''} ${faceUp ? 'up' : 'down'} ${dealing ? 'deal' : ''}`}
      style={{ animationDelay: dealing ? `${idx * 0.13}s` : undefined }}
    >
      <div className="pk-card-inner">
        <div className={`pk-face ${red ? 'red' : 'black'}`}>
          <span className="pk-corner tl"><b>{RANK_LABEL[card.rank]}</b><i>{card.suit}</i></span>
          <CardBody card={card} />
          <span className="pk-corner br"><b>{RANK_LABEL[card.rank]}</b><i>{card.suit}</i></span>
        </div>
        <div className="pk-back">
          <div className="pk-back-frame">
            <div className="pk-back-pat" />
            <div className="pk-back-medallion">♣</div>
          </div>
        </div>
      </div>
    </div>
  );
}
