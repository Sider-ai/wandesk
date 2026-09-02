import { useEffect, useRef, useState } from 'react';
import { RacingHud } from './components/Hud';
import { LoadingScreen, PauseScreen, ResultsScreen, TitleScreen } from './components/Screens';
import './style.css';

export default function Racing(_props: { appId: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    setError('');
    void import('./engine/runtime')
      .then(({ mountRacing }) => {
        if (!disposed) cleanup = mountRacing(root);
      })
      .catch((e) => {
        if (!disposed) setError((e as Error)?.message || 'Game failed to initialize');
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, [attempt]);

  return (
    <div ref={rootRef} className="racing-root" tabIndex={0} onPointerDown={() => rootRef.current?.focus()}>
      <div id="app" />
      <div id="vig" />
      <div id="nitroVig" />
      <RacingHud />
      <TitleScreen />
      <PauseScreen />
      <ResultsScreen />
      <LoadingScreen error={error} onRetry={() => setAttempt((n) => n + 1)} />
    </div>
  );
}
