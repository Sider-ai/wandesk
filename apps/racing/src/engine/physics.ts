import type { Tuning } from '../lib/config';
import { clamp, damp, moveToward } from '../lib/math';
import type { RacingAudio } from './audio';
import type { RacingInput } from './input';
import type { Track } from './track';
import type { CarState } from './types';

export type DrivingDynamics = {
  nitroBar: number;
  nitroActive: boolean;
  railHitCool: number;
  wrongWayTime: number;
  shake: number;
  demoMode: boolean;
};

export function createPlayerPhysics({
  player,
  track,
  tuning,
  input,
  audio,
  dynamics,
  getRaceState,
  addRaceTime,
  onLapCross,
  drivePlayer,
}: {
  player: CarState;
  track: Track;
  tuning: Tuning;
  input: RacingInput;
  audio: RacingAudio;
  dynamics: DrivingDynamics;
  getRaceState: () => string;
  addRaceTime: (dt: number) => void;
  onLapCross: (car: CarState) => void;
  drivePlayer: (car: CarState) => void;
}) {
  return {
    step(dt: number): void {
      const driving = input.read();
      let throttle = driving.throttle;
      let brake = driving.brake;
      let steer = driving.steer;
      let handbrake = driving.handbrake;
      const state = getRaceState();
      if (dynamics.demoMode) {
        drivePlayer(player);
        throttle = player._th;
        brake = player._br;
        steer = player._st;
        handbrake = false;
      }
      if (state !== 'racing' || player.finished) {
        throttle = 0;
        brake = state === 'countdown' ? 0 : 0.6;
        steer = 0;
        handbrake = false;
      }

      const steeringRate = (Math.sign(steer - player.steer) === Math.sign(player.steer) || steer === 0)
        ? tuning.steerFall : tuning.steerRise;
      player.steer = moveToward(player.steer, steer, steeringRate * dt);
      player.steerVis = damp(player.steerVis, player.steer, 12, dt);

      const forward = { x: Math.sin(player.h), z: Math.cos(player.h) };
      const right = { x: forward.z, z: -forward.x };
      let forwardVelocity = player.vel.x * forward.x + player.vel.z * forward.z;
      let lateralVelocity = player.vel.x * right.x + player.vel.z * right.z;

      dynamics.nitroActive = driving.nitro && dynamics.nitroBar > 0 && throttle > 0 &&
        forwardVelocity > 1 && state === 'racing' && !player.finished && !dynamics.demoMode
        ? true : dynamics.demoMode && player._nitro && dynamics.nitroBar > 0;
      if (dynamics.nitroActive) dynamics.nitroBar = Math.max(0, dynamics.nitroBar - tuning.nitroUse * dt);
      else dynamics.nitroBar = Math.min(100, dynamics.nitroBar +
        (player.drifting ? tuning.nitroDriftRegen : tuning.nitroRegen) * dt);

      const dragMultiplier = player.onGrass ? tuning.grassDragMult : 1;
      const rollingForce = tuning.roll + (player.onGrass ? tuning.grassRoll : 0);
      let acceleration = 0;
      if (throttle) acceleration += tuning.engine * (dynamics.nitroActive ? tuning.nitroMult : 1) *
        (forwardVelocity < 3 ? 1.25 : 1);
      if (brake) {
        if (forwardVelocity > 0.5) acceleration -= tuning.brake;
        else if (forwardVelocity > tuning.revMax) acceleration -= tuning.revForce;
      }
      if (handbrake) acceleration -= 5.5 * Math.sign(forwardVelocity);
      acceleration -= tuning.drag * dragMultiplier * forwardVelocity * Math.abs(forwardVelocity) +
        rollingForce * clamp(forwardVelocity / 2, -1, 1);
      player.acc = acceleration;
      forwardVelocity += acceleration * dt;

      player.drifting = (handbrake && Math.abs(forwardVelocity) > 6) ||
        Math.abs(lateralVelocity) > tuning.driftLatTh;
      const grip = handbrake ? tuning.gripHand : (player.drifting ? tuning.gripDrift : tuning.gripNormal);
      lateralVelocity *= Math.exp(-grip * dt);
      const steeringFactor = clamp(Math.abs(forwardVelocity) / 9, 0, 1) /
        (1 + Math.abs(forwardVelocity) * tuning.steerHiDamp);
      const yaw = player.steer * tuning.steerMax * steeringFactor *
        (player.drifting ? tuning.driftYawBoost : 1) * (forwardVelocity < -0.5 ? -1 : 1);
      player.h += yaw * dt;

      const nextForward = { x: Math.sin(player.h), z: Math.cos(player.h) };
      const nextRight = { x: nextForward.z, z: -nextForward.x };
      player.vel.set(
        nextForward.x * forwardVelocity + nextRight.x * lateralVelocity,
        0,
        nextForward.z * forwardVelocity + nextRight.z * lateralVelocity,
      );
      player.pos.addScaledVector(player.vel, dt);
      player.vf = forwardVelocity;
      player.vlat = lateralVelocity;

      player.lastIdx = track.nearestIndex(player.pos, player.lastIdx);
      const sample = track.samples[player.lastIdx];
      const dx = player.pos.x - sample.p.x;
      const dz = player.pos.z - sample.p.z;
      const distance = dx * sample.r.x + dz * sample.r.z;
      player.onGrass = Math.abs(distance) > tuning.roadHalf - 0.6;
      if (Math.abs(distance) > tuning.railClamp) {
        const over = Math.abs(distance) - tuning.railClamp;
        player.pos.x -= sample.r.x * over * Math.sign(distance);
        player.pos.z -= sample.r.z * over * Math.sign(distance);
        const railVelocity = player.vel.x * sample.r.x + player.vel.z * sample.r.z;
        if (Math.sign(railVelocity) === Math.sign(distance)) {
          player.vel.x -= sample.r.x * railVelocity * 1.3;
          player.vel.z -= sample.r.z * railVelocity * 1.3;
          player.vel.multiplyScalar(0.92);
          player.vf *= 0.92;
          if (dynamics.railHitCool <= 0 && Math.abs(railVelocity) > 3) {
            audio.thud();
            dynamics.shake = Math.min(1, Math.abs(railVelocity) * 0.09);
            dynamics.railHitCool = 0.5;
          }
        }
      }
      dynamics.railHitCool -= dt;

      const previousDistance = player.s;
      player.s = player.lastIdx * track.spacing;
      let progress = player.s - previousDistance;
      if (progress < -track.length / 2) {
        progress += track.length;
        onLapCross(player);
      } else if (progress > track.length / 2) {
        progress -= track.length;
        player.wraps = Math.max(0, player.wraps - 1);
        player.lap = Math.max(1, player.lap - 1);
      }
      player.progress = player.wraps * track.length + player.s;
      dynamics.wrongWayTime = state === 'racing' && !player.finished && Math.abs(forwardVelocity) > 4
        ? (progress < -0.005 ? dynamics.wrongWayTime + dt : 0)
        : 0;
      if (state === 'racing' && !player.finished) addRaceTime(dt);
    },
  };
}

export function resolveCarCollisions(
  cars: CarState[],
  track: Track,
  onImpact: () => void,
): void {
  const player = cars[0];
  for (let i = 1; i < cars.length; i += 1) {
    const opponent = cars[i];
    const dx = opponent.pos.x - player.pos.x;
    const dz = opponent.pos.z - player.pos.z;
    const distanceSquared = dx * dx + dz * dz;
    if (distanceSquared >= 4.6 || distanceSquared <= 1e-4) continue;

    const distance = Math.sqrt(distanceSquared);
    const normalX = dx / distance;
    const normalZ = dz / distance;
    const push = (2.15 - distance) * 0.5;
    player.pos.x -= normalX * push;
    player.pos.z -= normalZ * push;

    const hint = Math.round(opponent.s / track.spacing);
    const sample = track.samples[track.nearestIndex(opponent.pos, hint)];
    opponent.nudge += (normalX * sample.r.x + normalZ * sample.r.z) * push * 2;
    player.vel.multiplyScalar(0.985);
    onImpact();
  }
}
