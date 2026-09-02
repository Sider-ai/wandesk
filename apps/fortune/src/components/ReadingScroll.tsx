// 解读卷轴:总评签名 + 签诗 + 宜/忌 + 解读。像庙里抽到的签文那样一轴展开。
import { listItems, poemLines, type Reading } from '../lib/yijing';

export function ReadingScroll({ reading, tone }: { reading: Reading; tone: string }) {
  return (
    <div className={`fo-scroll fo-tone-${tone}`}>
      <div className="fo-scroll-rod fo-scroll-rod-top" aria-hidden />
      <div className="fo-scroll-paper">
        <div className="fo-signrow">
          <span className="fo-signname">{reading.signName}</span>
          <span className="fo-sign-seal" aria-hidden>卜</span>
        </div>

        <div className="fo-sec-label">签 诗</div>
        <div className="fo-poem">
          {poemLines(reading.signPoem).map((ln, i) => (
            <div key={i} className="fo-poem-line" style={{ animationDelay: `${0.15 + i * 0.12}s` }}>{ln}</div>
          ))}
        </div>

        <div className="fo-divider"><span>❖</span></div>

        <div className="fo-gb">
          <div className="fo-gb-col fo-gb-col-good">
            <div className="fo-gb-key fo-gb-good">宜</div>
            <div className="fo-gb-tags">
              {listItems(reading.good).map((t, i) => (<span key={i} className="fo-tag fo-tag-good">{t}</span>))}
            </div>
          </div>
          <div className="fo-gb-sep" />
          <div className="fo-gb-col fo-gb-col-bad">
            <div className="fo-gb-key fo-gb-bad">忌</div>
            <div className="fo-gb-tags">
              {listItems(reading.bad).map((t, i) => (<span key={i} className="fo-tag fo-tag-bad">{t}</span>))}
            </div>
          </div>
        </div>

        <div className="fo-sec-label">解 读</div>
        <div className="fo-advice">{reading.advice}</div>
      </div>
      <div className="fo-scroll-rod fo-scroll-rod-bot" aria-hidden />
    </div>
  );
}
