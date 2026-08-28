import * as THREE from 'three';
import type { Particle, ParticlePool } from './types';

const SKID_COUNT = 320;

function radialTexture(inner: string, outer: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 64;
  const context = canvas.getContext('2d')!;
  const gradient = context.createRadialGradient(32, 32, 2, 32, 32, 30);
  gradient.addColorStop(0, inner);
  gradient.addColorStop(1, outer);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

function createParticlePool(
  scene: THREE.Scene,
  count: number,
  texture: THREE.Texture,
  blending: THREE.Blending,
  color: number,
): ParticlePool {
  const items: Particle[] = [];
  for (let i = 0; i < count; i += 1) {
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: texture,
      blending,
      color,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    }));
    sprite.visible = false;
    scene.add(sprite);
    items.push({ sp: sprite, life: 0, max: 1, vel: new THREE.Vector3(), grow: 1, op0: 0.5 });
  }

  let cursor = 0;
  return {
    items,
    spawn(position, velocity, life, scale, grow, opacity) {
      const item = items[cursor];
      cursor = (cursor + 1) % count;
      item.sp.visible = true;
      item.life = item.max = life;
      item.sp.position.copy(position);
      item.vel.copy(velocity);
      item.sp.scale.setScalar(scale);
      item.grow = grow;
      item.op0 = opacity;
      item.sp.material.opacity = opacity;
    },
    update(dt) {
      for (const item of items) {
        if (!item.sp.visible) continue;
        item.life -= dt;
        if (item.life <= 0) {
          item.sp.visible = false;
          continue;
        }
        const remaining = item.life / item.max;
        item.sp.position.addScaledVector(item.vel, dt);
        item.sp.scale.multiplyScalar(1 + item.grow * dt);
        item.sp.material.opacity = item.op0 * remaining;
      }
    },
  };
}

export function createEffects(scene: THREE.Scene) {
  const smoke = createParticlePool(
    scene,
    56,
    radialTexture('rgba(230,230,235,0.85)', 'rgba(230,230,235,0)'),
    THREE.NormalBlending,
    0xcfd0d6,
  );
  const flame = createParticlePool(
    scene,
    28,
    radialTexture('rgba(255,255,255,1)', 'rgba(80,180,255,0)'),
    THREE.AdditiveBlending,
    0x7fd0ff,
  );

  const geometry = new THREE.PlaneGeometry(0.30, 0.78);
  geometry.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    color: 0x0b0b0d,
    transparent: true,
    opacity: 0.42,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  });
  const skids = new THREE.InstancedMesh(geometry, material, SKID_COUNT);
  const zeroMatrix = new THREE.Matrix4().makeScale(0, 0, 0);
  for (let i = 0; i < SKID_COUNT; i += 1) skids.setMatrixAt(i, zeroMatrix);
  skids.instanceMatrix.needsUpdate = true;
  scene.add(skids);

  let skidCursor = 0;
  const matrix = new THREE.Matrix4();
  const quaternion = new THREE.Quaternion();
  const euler = new THREE.Euler();

  return {
    smoke,
    flame,
    skids,
    skidCount: SKID_COUNT,
    zeroMatrix,
    laySkid(x: number, z: number, heading: number) {
      euler.set(0, heading, 0);
      quaternion.setFromEuler(euler);
      matrix.compose(new THREE.Vector3(x, 0.025, z), quaternion, new THREE.Vector3(1, 1, 1));
      skids.setMatrixAt(skidCursor, matrix);
      skidCursor = (skidCursor + 1) % SKID_COUNT;
      skids.instanceMatrix.needsUpdate = true;
    },
    resetSkids() {
      for (let i = 0; i < SKID_COUNT; i += 1) skids.setMatrixAt(i, zeroMatrix);
      skids.instanceMatrix.needsUpdate = true;
      skidCursor = 0;
    },
  };
}
