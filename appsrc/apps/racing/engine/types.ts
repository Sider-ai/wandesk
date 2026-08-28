import * as THREE from 'three';
import type { CarModel } from './car-model';

export type CarState = {
  name: string;
  color: number;
  rim?: number;
  isPlayer: boolean;
  model: CarModel;
  idx: number;
  pos: THREE.Vector3;
  h: number;
  vel: THREE.Vector3;
  vf: number;
  vlat: number;
  steer: number;
  steerVis: number;
  s: number;
  lastIdx: number;
  lap: number;
  wraps: number;
  progress: number;
  finished: boolean;
  finishTime: number;
  v: number;
  laneBase: number;
  lanePhase: number;
  nudge: number;
  spin: number;
  drifting: boolean;
  onGrass: boolean;
  roll: number;
  pitch: number;
  acc: number;
  _th: number;
  _br: number;
  _st: number;
  _nitro: boolean;
};

export type Particle = {
  sp: THREE.Sprite;
  life: number;
  max: number;
  vel: THREE.Vector3;
  grow: number;
  op0: number;
};

export type ParticlePool = {
  items: Particle[];
  spawn: (
    position: THREE.Vector3,
    velocity: THREE.Vector3,
    life: number,
    scale: number,
    grow: number,
    opacity: number,
  ) => void;
  update: (dt: number) => void;
};

export type RacingDebugApi = {
  readonly state: string;
  readonly player: CarState;
  readonly raceTime: number;
  readonly nitro: number;
  startRace: () => void;
  setDemo: (enabled: boolean) => void;
  rankCars: () => CarState[];
  LEN: number;
  cars: CarState[];
  camera: THREE.PerspectiveCamera;
  setFreeCam: (enabled: boolean) => void;
  press: (code: string) => void;
  release: (code?: string) => void;
  shot: (quality?: number) => string;
};

export type RacingRoot = HTMLElement & { __game?: RacingDebugApi };
