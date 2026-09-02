export function RacingHud() {
  return (
    <div id="hud" className="hidden">
      <div id="raceInfo">
        <div className="pos"><b id="posN">4</b><span id="posT">/4</span><em>名次</em></div>
        <div className="rows">
          <label>圈数 LAP</label><b id="lapTxt">1/3</b>
          <label>用时 TIME</label><b id="timeTxt">0:00.00</b>
          <label>上圈 LAST</label><b id="lastTxt">-:--.--</b>
          <label>最快 BEST</label><b id="bestTxt" className="gold">-:--.--</b>
        </div>
      </div>
      <div id="minimapWrap"><canvas id="minimap" /></div>
      <div id="speedo">
        <div className="dial">
          <svg viewBox="0 0 212 212">
            <defs><linearGradient id="spdGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#ffb000" />
              <stop offset=".62" stopColor="#ff7a00" />
              <stop offset="1" stopColor="#ff2e4d" />
            </linearGradient></defs>
            <circle className="arcBg" cx="106" cy="106" r="84" pathLength="360" strokeDasharray="250 360" transform="rotate(145 106 106)" />
            <circle id="arcFill" className="arcFill" cx="106" cy="106" r="84" pathLength="360" strokeDasharray="250 360" strokeDashoffset="250" transform="rotate(145 106 106)" />
            <line id="needle" className="needle" x1="106" y1="106" x2="106" y2="34" transform="rotate(-125 106 106)" />
          </svg>
          <div className="core">
            <b id="spdN">0</b><span>KM/H</span>
            <div className="gear"><i>挡位</i><span id="gearN">1</span></div>
          </div>
        </div>
        <div id="nitroRow"><label>⚡ 氮气</label><div id="nitroSegs" /></div>
      </div>
      <div id="driftTag">DRIFT<small>漂移回充氮气</small></div>
      <div id="hints">
        <div><kbd>W</kbd><kbd>↑</kbd> 油门</div>
        <div><kbd>S</kbd><kbd>↓</kbd> 刹车 / 倒车</div>
        <div><kbd>A</kbd><kbd>D</kbd> 转向</div>
        <div><kbd>SPACE</kbd> 手刹漂移</div>
        <div><kbd>SHIFT</kbd> 氮气加速</div>
        <div><kbd>ESC</kbd> 暂停&nbsp;<kbd>R</kbd> 重新开始</div>
      </div>
      <div id="center">
        <div id="countNum" className="hidden" />
        <div id="lapToast"><b /><p /></div>
        <div id="wrongWay">⚠ 逆行 — 请调头</div>
      </div>
    </div>
  );
}
