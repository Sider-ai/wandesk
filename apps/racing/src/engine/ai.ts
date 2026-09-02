import type { Tuning } from '../lib/config';
import { clamp, damp, moveToward } from '../lib/math';
import type { Track } from './track';
import type { CarState } from './types';

export function createAiController({
  tuning,
  track,
  player,
  getRaceState,
  getNitro,
  onLapCross,
}: {
  tuning: Tuning;
  track: Track;
  player: CarState;
  getRaceState: () => string;
  getNitro: () => number;
  onLapCross: (car: CarState) => void;
}) {
  function syncPose(car: CarState, dt: number): void {
    const lane = car.laneBase + Math.sin(car.s * 0.012 + car.lanePhase) * 1.7 + car.nudge;
    car.nudge = damp(car.nudge, 0, 1.6, dt);
    const sample = track.sampleAt(car.s);
    const x = sample.p.x + sample.r.x * lane;
    const z = sample.p.z + sample.r.z * lane;
    const dx = x - car.pos.x;
    const dz = z - car.pos.z;
    if (dx * dx + dz * dz > 1e-6 && car.v > 0.5) {
      const targetHeading = Math.atan2(dx, dz);
      let error = targetHeading - car.h;
      while (error > Math.PI) error -= Math.PI * 2;
      while (error < -Math.PI) error += Math.PI * 2;
      car.h += clamp(error, -2.6 * dt, 2.6 * dt);
    }
    car.pos.set(x, 0, z);
  }

  return {
    drivePlayer(car: CarState): void {
      const look = track.sampleAt(car.s + 14 + Math.abs(car.vf) * 0.45);
      const targetHeading = Math.atan2(look.p.x - car.pos.x, look.p.z - car.pos.z);
      let error = targetHeading - car.h;
      while (error > Math.PI) error -= Math.PI * 2;
      while (error < -Math.PI) error += Math.PI * 2;
      car._st = clamp(error * 2.4, -1, 1);
      const index = ((Math.round(car.s / track.spacing) + 26) % track.sampleCount + track.sampleCount) % track.sampleCount;
      const targetVelocity = track.speedProfile[index];
      car._th = car.vf < targetVelocity ? 1 : 0;
      car._br = car.vf > targetVelocity + 3 ? 1 : 0;
      car._nitro = targetVelocity > 45 && getNitro() > 35;
    },

    step(car: CarState, dt: number): void {
      if (getRaceState() !== 'racing') {
        syncPose(car, dt);
        return;
      }
      const index = ((Math.round(car.s / track.spacing)) % track.sampleCount + track.sampleCount) % track.sampleCount;
      const skill = tuning.aiSkill[car.idx - 1];
      const rubberBand = clamp(1 + (player.progress - car.progress) * 0.0005, 0.90, 1.12);
      const targetVelocity = car.finished ? 18 : track.speedProfile[(index + 22) % track.sampleCount] * skill * rubberBand;
      car.v = moveToward(car.v, targetVelocity, (targetVelocity > car.v ? 12.5 : 15) * dt);
      const previous = car.s;
      car.s = (car.s + car.v * dt) % track.length;
      if (previous > car.s) onLapCross(car);
      car.progress = car.wraps * track.length + car.s;
      syncPose(car, dt);
    },
  };
}

export type AiController = ReturnType<typeof createAiController>;
