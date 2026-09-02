import * as THREE from 'three';
import type { Tuning } from '../lib/config';
import { clamp, damp, random } from '../lib/math';
import type { Track } from './track';
import type { CarState } from './types';

export function createCameraController({
  camera,
  player,
  track,
  tuning,
  getRaceState,
  getCountdown,
  getNitroActive,
  getShake,
  setShake,
}: {
  camera: THREE.PerspectiveCamera;
  player: CarState;
  track: Track;
  tuning: Tuning;
  getRaceState: () => string;
  getCountdown: () => number;
  getNitroActive: () => boolean;
  getShake: () => number;
  setShake: (value: number) => void;
}) {
  const position = new THREE.Vector3(0, 3, -10);
  const lookAt = new THREE.Vector3();
  const introStart = new THREE.Vector3();
  const introEnd = new THREE.Vector3();
  let fov = tuning.fovBase as number;
  let roll = 0;
  let titleOrbit = 0;
  let free = false;

  return {
    setFree(enabled: boolean) { free = enabled; },
    update(dt: number): void {
      if (free) return;
      const forward = new THREE.Vector3(Math.sin(player.h), 0, Math.cos(player.h));
      const state = getRaceState();
      if (state === 'title') {
        titleOrbit += dt * 0.20;
        const radius = 8.4;
        const x = player.pos.x + Math.sin(titleOrbit) * radius;
        const z = player.pos.z + Math.cos(titleOrbit) * radius;
        position.set(damp(position.x, x, 3, dt), damp(position.y, player.pos.y + 2.3, 3, dt), damp(position.z, z, 3, dt));
        camera.position.copy(position);
        camera.lookAt(player.pos.x, player.pos.y + 0.55, player.pos.z);
        camera.fov = damp(camera.fov, 50, 3, dt);
        camera.updateProjectionMatrix();
        return;
      }
      if (state === 'countdown') {
        const amount = clamp(1 - getCountdown() / 3.9, 0, 1);
        const eased = amount * amount * (3 - 2 * amount);
        const sample = track.sampleAt(player.s);
        introStart.copy(player.pos).addScaledVector(new THREE.Vector3(sample.r.x, 0, sample.r.z), 7.5)
          .addScaledVector(forward, 6).setY(1.3);
        introEnd.copy(player.pos).addScaledVector(forward, -tuning.camDist).setY(tuning.camH);
        position.lerpVectors(introStart, introEnd, eased);
        camera.position.copy(position);
        lookAt.copy(player.pos).setY(player.pos.y + 0.7);
        camera.lookAt(lookAt);
        camera.fov = damp(camera.fov, tuning.fovBase, 5, dt);
        camera.updateProjectionMatrix();
        return;
      }

      const speed = Math.abs(player.vf);
      const velocity = player.vel.lengthSq() > 1 ? player.vel.clone().normalize() : forward;
      const direction = forward.clone().lerp(velocity, player.drifting ? 0.42 : 0.12).normalize();
      const distance = tuning.camDist + speed * 0.030;
      const height = tuning.camH + speed * 0.007;
      const desired = player.pos.clone().addScaledVector(direction, -distance)
        .addScaledVector(player.vel, 1 / tuning.camLam).setY(height);
      position.set(
        damp(position.x, desired.x, tuning.camLam, dt),
        damp(position.y, desired.y, tuning.camLam, dt),
        damp(position.z, desired.z, tuning.camLam, dt),
      );
      const desiredLook = player.pos.clone().addScaledVector(direction, tuning.camLook)
        .addScaledVector(player.vel, 0.45 / tuning.camLookLam).setY(player.pos.y + 0.78);
      lookAt.set(
        damp(lookAt.x, desiredLook.x, tuning.camLookLam, dt),
        damp(lookAt.y, desiredLook.y, tuning.camLookLam, dt),
        damp(lookAt.z, desiredLook.z, tuning.camLookLam, dt),
      );

      const shake = Math.max(0, getShake() - dt * 2.2);
      setShake(shake);
      const amplitude = shake * 0.22 + (getNitroActive() ? 0.045 : 0) + (player.onGrass && speed > 8 ? 0.05 : 0);
      camera.position.copy(position);
      if (amplitude > 0.001) {
        camera.position.add(new THREE.Vector3(
          random(-amplitude, amplitude),
          random(-amplitude, amplitude) * 0.6,
          random(-amplitude, amplitude),
        ));
      }
      camera.lookAt(lookAt);
      const targetFov = tuning.fovBase + clamp(speed / tuning.vMax, 0, 1) * tuning.fovSpeed +
        (getNitroActive() ? tuning.fovNitro : 0);
      fov = damp(fov, targetFov, 5, dt);
      camera.fov = fov;
      roll = damp(roll, -player.steer * 0.035 - player.vlat * 0.004, 6, dt);
      camera.rotateZ(roll);
      camera.updateProjectionMatrix();
    },
  };
}
