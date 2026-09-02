export function TitleScreen() {
  return (
    <div id="title" className="overlay hidden">
      <div className="stripes" />
      <div className="inner">
        <div className="kicker">NITRO CIRCUIT · 黄昏赛道</div>
        <h1>极速狂飙<span className="en">APEX RUSH</span></h1>
        <p className="tag">三圈决胜 · 氮气全开 · 弯道见真章</p>
        <button id="btnStart" className="btn"><span>开始比赛&nbsp;▸</span></button>
        <div className="keys">
          <div><kbd>W</kbd>油门</div><div><kbd>S</kbd>刹车</div><div><kbd>A</kbd><kbd>D</kbd>转向</div>
          <div><kbd>SPACE</kbd>漂移</div><div><kbd>SHIFT</kbd>氮气</div><div><kbd>ENTER</kbd>直接发车</div>
        </div>
      </div>
      <div className="foot">THREE.JS 程序化建模 · WEBAUDIO 合成引擎声浪</div>
    </div>
  );
}

export function PauseScreen() {
  return (
    <div id="pause" className="overlay hidden">
      <div className="stripes" />
      <h2 className="skew">已暂停</h2>
      <p>PAUSED — 按 ESC 继续</p>
      <div className="actions">
        <button id="btnResume" className="btn"><span>继续 ▸</span></button>
        <button id="btnRestart" className="btn ghost"><span>重新比赛</span></button>
        <button id="btnPauseTitle" className="btn ghost"><span>回到标题</span></button>
      </div>
    </div>
  );
}

export function ResultsScreen() {
  return (
    <div id="results" className="overlay hidden">
      <div className="stripes" />
      <div className="head">RACE COMPLETE · 完赛</div>
      <h2>第 <i id="resPos">1</i> 名</h2>
      <div className="stats">
        <span>总时间<b id="resTime">-</b></span>
        <span>最快圈<b id="resBest">-</b></span>
      </div>
      <div id="board" />
      <div className="actions">
        <button id="btnAgain" className="btn"><span>再来一局 ▸</span></button>
        <button id="btnToTitle" className="btn ghost"><span>回到标题</span></button>
      </div>
    </div>
  );
}

export function LoadingScreen({ error, onRetry }: { error: string; onRetry: () => void }) {
  return (
    <>
      <div id="loading">
        <div className="logo skew">APEX RUSH</div>
        <div className="bar"><i /></div>
        <p>正在初始化渲染引擎…</p>
      </div>
      <div id="errbox" className={error ? '' : 'hidden'}>
        <div className="card">
          <h2>⚠ 加载失败</h2>
          <p id="errMsg">{error || '当前浏览器无法初始化 3D 游戏。'}</p>
          <button className="btn" onClick={onRetry}><span>重新加载</span></button>
        </div>
      </div>
    </>
  );
}
