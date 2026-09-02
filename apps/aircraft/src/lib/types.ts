// 飞机大战 — 全部游戏状态类型。
export type Particle = {
  x: number; y: number; vx: number; vy: number;
  life: number; ml: number; sz: number;
  r: number; g: number; b: number;
  kind: 'spark' | 'ring' | 'smoke' | 'shard' | 'glow';
  rot?: number; vr?: number; grav?: number;
};
export type Bullet = {
  x: number; y: number; vx: number; vy: number;
  w: number; h: number; dmg: number; own: boolean;
  r: number; g: number; b: number; kind: 'rail' | 'orb' | 'beam';
  t: number;
};
export type EKind = 'scout' | 'fighter' | 'bomber' | 'boss';
export type Enemy = {
  x: number; y: number; w: number; h: number;
  hp: number; mhp: number; spd: number; kind: EKind;
  t: number; fr: number; ph: number; flash: number;
  entering: boolean; ty: number; seed: number;
};
export type DKind = 'spread' | 'rapid' | 'shield' | 'bomb' | 'heal';
export type Drop = { x: number; y: number; vy: number; ph: number; kind: DKind };
export type StarLayer = { x: number; y: number; s: number; b: number; sz: number; r: number; g: number; b2: number };
export type Float = { x: number; y: number; t: string; life: number; ml: number; c: string; sz: number; vy: number };
export type Banner = { big: string; sub: string; life: number; ml: number; c: string };
export type FKind = 'normal' | 'spread' | 'rapid';
export type Player = {
  x: number; y: number; tx: number; ty: number;
  hp: number; mhp: number; inv: number;
  fm: FKind; fmt: number; fcd: number;
  sh: boolean; sht: number; bank: number;
};
export type Status = 'menu' | 'play' | 'pause' | 'over' | 'win';
export type GS = {
  st: Status; p: Player;
  bul: Bullet[]; ene: Enemy[]; par: Particle[]; drp: Drop[];
  sta: StarLayer[]; flt: Float[]; banner: Banner | null;
  sc: number; cmb: number; cmbt: number; maxCmb: number;
  wav: number; wcd: number; tookHit: boolean;
  shk: number; fl: number; flr: number; flg: number; flb: number;
  t: number; slow: number; vig: number; hue: number;
};
