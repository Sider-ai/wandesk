// 单张扑克(正反面 + 发牌动画)。
import { RANK_LABEL, type Card } from '../lib/cards';

function CardBody({ card }: { card: Card }) {
  // 一枚干净、清晰的点数 + 花色,居中(点阵在这个尺寸下会和角标撞车)。
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
