import type { RacingRoot } from './types';

export type DrivingInput = {
  throttle: number;
  brake: number;
  steer: number;
  handbrake: boolean;
  nitro: boolean;
};

const GAME_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'ShiftLeft', 'ShiftRight'];

export function createInput(
  root: RacingRoot,
  signal: AbortSignal,
  getState: () => string,
  setPaused: (paused: boolean) => void,
  restart: () => void,
) {
  const keys = new Set<string>();
  const testKeys = new Set<string>();
  const isDown = (code: string) => keys.has(code) || testKeys.has(code);

  root.addEventListener('keydown', (event) => {
    if (GAME_KEYS.includes(event.code)) event.preventDefault();
    keys.add(event.code);
    const state = getState();
    if (event.code === 'Escape' || event.code === 'KeyP') {
      if (state === 'racing') setPaused(true);
      else if (state === 'paused') setPaused(false);
    }
    if (event.code === 'KeyR' && ['racing', 'paused', 'finished'].includes(state)) restart();
    if (event.code === 'Enter' && state === 'title') restart();
  }, { signal });
  root.addEventListener('keyup', (event) => keys.delete(event.code), { signal });
  root.addEventListener('blur', () => keys.clear(), { signal });

  return {
    isDown,
    read(): DrivingInput {
      return {
        throttle: isDown('KeyW') || isDown('ArrowUp') ? 1 : 0,
        brake: isDown('KeyS') || isDown('ArrowDown') ? 1 : 0,
        steer: (isDown('KeyA') || isDown('ArrowLeft') ? 1 : 0) -
          (isDown('KeyD') || isDown('ArrowRight') ? 1 : 0),
        handbrake: isDown('Space'),
        nitro: isDown('ShiftLeft') || isDown('ShiftRight'),
      };
    },
    press(code: string) { testKeys.add(code); },
    release(code?: string) { code ? testKeys.delete(code) : testKeys.clear(); },
    clear() { keys.clear(); testKeys.clear(); },
  };
}

export type RacingInput = ReturnType<typeof createInput>;
