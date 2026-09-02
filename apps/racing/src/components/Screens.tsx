export function TitleScreen() {
  return (
    <div id="title" className="overlay hidden">
      <div className="stripes" />
      <div className="inner">
        <div className="kicker">NITRO CIRCUIT · TWILIGHT TRACK</div>
        <h1>APEX RUSH<span className="en">APEX RUSH</span></h1>
        <p className="tag">Three laps to glory · Nitro wide open · Won in the corners</p>
        <button id="btnStart" className="btn"><span>Start Race&nbsp;▸</span></button>
        <div className="keys">
          <div><kbd>W</kbd>Throttle</div><div><kbd>S</kbd>Brake</div><div><kbd>A</kbd><kbd>D</kbd>Steer</div>
          <div><kbd>SPACE</kbd>Drift</div><div><kbd>SHIFT</kbd>Nitro</div><div><kbd>ENTER</kbd>Jump straight in</div>
        </div>
      </div>
      <div className="foot">THREE.JS PROCEDURAL MODELING · WEBAUDIO SYNTHESIZED ENGINE SOUND</div>
    </div>
  );
}

export function PauseScreen() {
  return (
    <div id="pause" className="overlay hidden">
      <div className="stripes" />
      <h2 className="skew">Game Paused</h2>
      <p>PAUSED — Press ESC to resume</p>
      <div className="actions">
        <button id="btnResume" className="btn"><span>Resume ▸</span></button>
        <button id="btnRestart" className="btn ghost"><span>Restart Race</span></button>
        <button id="btnPauseTitle" className="btn ghost"><span>Back to Title</span></button>
      </div>
    </div>
  );
}

export function ResultsScreen() {
  return (
    <div id="results" className="overlay hidden">
      <div className="stripes" />
      <div className="head">RACE COMPLETE · FINISHED</div>
      <h2>P<i id="resPos">1</i></h2>
      <div className="stats">
        <span>Total Time<b id="resTime">-</b></span>
        <span>Best Lap<b id="resBest">-</b></span>
      </div>
      <div id="board" />
      <div className="actions">
        <button id="btnAgain" className="btn"><span>Race Again ▸</span></button>
        <button id="btnToTitle" className="btn ghost"><span>Back to Title</span></button>
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
        <p>Initializing render engine…</p>
      </div>
      <div id="errbox" className={error ? '' : 'hidden'}>
        <div className="card">
          <h2>⚠ Failed to Load</h2>
          <p id="errMsg">{error || 'This browser could not initialize the 3D game.'}</p>
          <button className="btn" onClick={onRetry}><span>Reload</span></button>
        </div>
      </div>
    </>
  );
}
