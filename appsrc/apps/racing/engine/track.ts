import * as THREE from 'three';
import type { Tuning } from '../lib/config';
import { clamp, random } from '../lib/math';

export type TrackSample = {
  p: THREE.Vector3;
  f: THREE.Vector3;
  r: THREE.Vector3;
  kappa: number;
};

export type TrackPose = Pick<TrackSample, 'p' | 'f' | 'r'>;

export type Track = {
  sampleCount: number;
  samples: TrackSample[];
  length: number;
  spacing: number;
  speedProfile: Float32Array;
  sampleAt: (distance: number) => TrackPose;
  nearestIndex: (position: THREE.Vector3, hint: number) => number;
};

export function createTrack(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  tuning: Tuning,
): Track {
  const T = tuning;
  const rnd = random;
/* ════════════════════ 赛道 ════════════════════ */
/* 起点设在长直道中段(前后控制点共线,保证起跑区笔直) */
const CTRL = [
  [-10,-80],[-10,60],[30,150],[120,205],[225,195],[290,120],
  [285,20],[215,-25],[150,-5],[95,-60],[105,-150],[170,-195],
  [120,-270],[10,-285],[-70,-240],[-10,-200],
];
const curve = new THREE.CatmullRomCurve3(CTRL.map(p=>new THREE.Vector3(p[0],0,p[1])), true, 'centripetal');
const N = 1000;
const SMP: TrackSample[] = [];        // {p, f(切线), r(右向), kappa}
{
  for(let i=0;i<N;i++){
    const t = i/N;
    const p = curve.getPointAt(t);
    const f = curve.getTangentAt(t).normalize();
    SMP.push({ p, f, r: new THREE.Vector3(f.z,0,-f.x), kappa:0 });
  }
}
const LEN = curve.getLength();
const DS = LEN/N;
// 曲率 + AI 速度剖面
const PROFILE = new Float32Array(N);
{
  for(let i=0;i<N;i++){
    const a = SMP[i].f, b = SMP[(i+1)%N].f;
    SMP[i].kappa = Math.acos(clamp(a.dot(b),-1,1))/DS;
  }
  for(let i=0;i<N;i++){ // 平滑曲率
    let k=0; for(let j=-3;j<=3;j++) k += SMP[(i+j+N)%N].kappa;
    PROFILE[i] = Math.min(T.aiVMax, Math.sqrt(T.aiLatAcc/Math.max(k/7, 1e-4)));
  }
  for(let r=0;r<3;r++) for(let i=N-1;i>=0;i--){ // 倒推刹车点
    const nx = PROFILE[(i+1)%N];
    PROFILE[i] = Math.min(PROFILE[i], Math.sqrt(nx*nx + 2*T.aiBrake*DS));
  }
}
function sampleAt(s: number): TrackPose {
  // 相邻采样点间线性插值。不可量化取整:AI 位置直接取自这里,
  // 取整会让车在 1.56m 格点间瞬移,朝向追踪被横向残差带偏(车身横着跑)
  const u = ((s/DS)%N+N)%N;
  const i = Math.floor(u)%N, t = u-i, a = SMP[i], b = SMP[(i+1)%N];
  return {
    p: new THREE.Vector3().lerpVectors(a.p, b.p, t),
    f: new THREE.Vector3().lerpVectors(a.f, b.f, t).normalize(),
    r: new THREE.Vector3().lerpVectors(a.r, b.r, t).normalize(),
  };
}
function nearestIdx(pos: THREE.Vector3, hint: number): number {
  let best = hint, bd = Infinity;
  for(let j=-36;j<=60;j++){
    const i = ((hint+j)%N+N)%N;
    const d = pos.distanceToSquared(SMP[i].p);
    if(d<bd){ bd=d; best=i; }
  }
  return best;
}

/* 路面贴图(程序化沥青) */
function roadTexture(){
  const c = document.createElement('canvas'); c.width=512; c.height=1024;
  const g = c.getContext('2d')!;
  g.fillStyle='#33343a'; g.fillRect(0,0,512,1024);
  const img = g.getImageData(0,0,512,1024), d = img.data;   // 颗粒噪声
  for(let i=0;i<d.length;i+=4){ const n=(Math.random()-0.5)*22; d[i]+=n; d[i+1]+=n; d[i+2]+=n; }
  g.putImageData(img,0,0);
  // 车道磨亮痕
  for(const x of [128, 384]){
    const lg = g.createLinearGradient(x-70,0,x+70,0);
    lg.addColorStop(0,'rgba(0,0,0,0)'); lg.addColorStop(.5,'rgba(16,16,18,0.35)'); lg.addColorStop(1,'rgba(0,0,0,0)');
    g.fillStyle=lg; g.fillRect(x-70,0,140,1024);
  }
  // 红白路缘
  for(let y=0;y<1024;y+=128){
    g.fillStyle = (y/128)%2 ? '#c8332e' : '#e8e4da';
    g.fillRect(0,y,14,128); g.fillRect(498,y,14,128);
  }
  // 白边线 + 中央双黄虚线
  g.fillStyle='#dcd8cc'; g.fillRect(22,0,7,1024); g.fillRect(483,0,7,1024);
  g.fillStyle='#d8a93c';
  for(let y=0;y<1024;y+=96){ g.fillRect(249,y,5,58); g.fillRect(258,y,5,58); }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}
{ // 路面网格:沿样条扫掠的带状几何
  const pos: number[] = [], uv: number[] = [], idx: number[] = [];
  const w = T.roadHalf;
  for(let i=0;i<=N;i++){
    const sm = SMP[i%N];
    const L = sm.p.clone().addScaledVector(sm.r,-w);
    const R = sm.p.clone().addScaledVector(sm.r, w);
    pos.push(L.x,0.012,L.z, R.x,0.012,R.z);
    const v = i*DS/14;
    uv.push(0,v, 1,v);
    if(i<N){ const a=i*2; idx.push(a,a+2,a+1, a+1,a+2,a+3); } // 逆时针绕序,法线朝上
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv,2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const road = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
    map: roadTexture(), roughness:0.88, metalness:0.04 }));
  road.receiveShadow = true;
  scene.add(road);
}
{ // 护栏:连续低墙 + 立柱
  for(const side of [-1,1]){
    const off = T.roadHalf + 1.5;
    const pos=[], idx=[];
    for(let i=0;i<=N;i++){
      const sm = SMP[i%N];
      const b = sm.p.clone().addScaledVector(sm.r, side*off);
      pos.push(b.x,0,b.z, b.x,0.85,b.z);
      if(i<N){ const a=i*2; idx.push(a,a+2,a+1, a+1,a+2,a+3); }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    geo.setIndex(idx); geo.computeVertexNormals();
    const rail = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      color:0x9aa0a8, metalness:0.85, roughness:0.42, side:THREE.DoubleSide }));
    scene.add(rail);
  }
  const postGeo = new THREE.CylinderGeometry(0.07,0.07,0.85,6);
  const postMat = new THREE.MeshStandardMaterial({ color:0x5a5f66, metalness:0.7, roughness:0.5 });
  const count = Math.floor(N/7)*2;
  const posts = new THREE.InstancedMesh(postGeo, postMat, count);
  const M = new THREE.Matrix4(); let pi=0;
  for(let i=0;i<N;i+=7) for(const side of [-1,1]){
    const sm = SMP[i];
    const b = sm.p.clone().addScaledVector(sm.r, side*(T.roadHalf+1.5));
    M.makeTranslation(b.x, 0.42, b.z);
    posts.setMatrixAt(pi++, M);
  }
  posts.count = pi; scene.add(posts);
}

/* 地面 / 群山 / 树木 / 灯柱 / 广告牌 / 起点门架 */
{
  const c = document.createElement('canvas'); c.width=c.height=256;
  const g = c.getContext('2d')!;
  g.fillStyle='#37502c'; g.fillRect(0,0,256,256);
  for(let i=0;i<3800;i++){ g.fillStyle=`rgba(${20+rnd(30)|0},${50+rnd(40)|0},${18+rnd(25)|0},.5)`;
    g.fillRect(rnd(256)|0, rnd(256)|0, 2, 2); }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS=tex.wrapT=THREE.RepeatWrapping; tex.repeat.set(190,190); tex.colorSpace=THREE.SRGBColorSpace;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(2600,2600),
    new THREE.MeshStandardMaterial({ map:tex, roughness:1 }));
  ground.rotation.x = -Math.PI/2; ground.position.y = -0.02; ground.receiveShadow = true;
  scene.add(ground);

  const mtnMat = new THREE.MeshStandardMaterial({ color:0x584f63, roughness:1, flatShading:true });
  for(let i=0;i<22;i++){
    const a = i/22*Math.PI*2 + rnd(0.28);
    const r = rnd(820,1080), h = rnd(55,150);
    const m = new THREE.Mesh(new THREE.ConeGeometry(rnd(110,200), h, 7), mtnMat);
    m.position.set(Math.sin(a)*r + 120, h/2-8, Math.cos(a)*r - 40);
    m.rotation.y = rnd(Math.PI*2);
    m.scale.x = rnd(1.2, 2.4);   // 拉宽,弱化「金字塔感」
    scene.add(m);
  }

  // 树:避开赛道随机散布
  const spots: Array<[number, number, number]> = [];
  let guard = 0;
  while(spots.length < 230 && guard++ < 4000){
    const x = rnd(-360,560), z = rnd(-500,420);
    let ok = true;
    for(let i=0;i<N;i+=6){ const dx=SMP[i].p.x-x, dz=SMP[i].p.z-z;
      if(dx*dx+dz*dz < 19*19){ ok=false; break; } }
    if(ok) spots.push([x,z,rnd(0.75,1.5)]);
  }
  const trunkG = new THREE.CylinderGeometry(0.22,0.3,1.6,6);
  const crownG = new THREE.ConeGeometry(1.9,4.6,7);
  const trunkM = new THREE.MeshStandardMaterial({ color:0x4a3522, roughness:1 });
  const crownM = new THREE.MeshStandardMaterial({ color:0x2c4a22, roughness:1 });
  const trunks = new THREE.InstancedMesh(trunkG, trunkM, spots.length);
  const crowns = new THREE.InstancedMesh(crownG, crownM, spots.length);
  crowns.castShadow = true;
  const M = new THREE.Matrix4(), S = new THREE.Vector3(), Q = new THREE.Quaternion();
  spots.forEach(([x,z,s],i)=>{
    M.compose(new THREE.Vector3(x,0.8*s,z), Q, S.set(s,s,s)); trunks.setMatrixAt(i,M);
    M.compose(new THREE.Vector3(x,(1.6+2.3)*s,z), Q, S.set(s,s,s)); crowns.setMatrixAt(i,M);
  });
  scene.add(trunks, crowns);

  // 路灯(发光头,无实灯,靠 bloom)
  const poleG = new THREE.CylinderGeometry(0.09,0.12,6.4,6);
  const poleM = new THREE.MeshStandardMaterial({ color:0x3c4046, metalness:0.8, roughness:0.5 });
  const headG = new THREE.BoxGeometry(0.95,0.14,0.3);
  const headM = new THREE.MeshStandardMaterial({ color:0x222222,
    emissive:0xffd9a0, emissiveIntensity:2.4 });
  const nP = Math.floor(N/50);
  const poles = new THREE.InstancedMesh(poleG, poleM, nP);
  const heads = new THREE.InstancedMesh(headG, headM, nP);
  let k=0;
  for(let i=0;i<N;i+=50){
    const sm = SMP[i], side = (k%2)?1:-1;
    const b = sm.p.clone().addScaledVector(sm.r, side*(T.roadHalf+2.6));
    M.makeTranslation(b.x,3.2,b.z); poles.setMatrixAt(k,M);
    const h = b.clone().addScaledVector(sm.r, -side*0.85);
    M.makeRotationY(Math.atan2(sm.r.x,sm.r.z)).setPosition(h.x,6.32,h.z);
    heads.setMatrixAt(k,M);
    k++;
  }
  poles.count = heads.count = k;
  scene.add(poles, heads);

  // 广告牌
  function board(text: string, sub: string, idx: number, side: number){
    const c = document.createElement('canvas'); c.width=512; c.height=224;
    const g = c.getContext('2d')!;
    g.fillStyle='#101218'; g.fillRect(0,0,512,224);
    g.strokeStyle='#ffb000'; g.lineWidth=10; g.strokeRect(8,8,496,208);
    g.fillStyle='#ffb000'; g.font='italic 900 86px Arial'; g.textAlign='center';
    g.fillText(text, 256, 112);
    g.fillStyle='rgba(255,255,255,.75)'; g.font='600 34px Arial';
    g.fillText(sub, 256, 174);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const sm = SMP[idx];
    const pos = sm.p.clone().addScaledVector(sm.r, side*(T.roadHalf+8));
    const grp = new THREE.Group();
    const face = new THREE.Mesh(new THREE.PlaneGeometry(11,4.8),
      new THREE.MeshStandardMaterial({ map:tex, roughness:0.7, side:THREE.DoubleSide,
        emissive:0xffffff, emissiveMap:tex, emissiveIntensity:0.35 }));
    face.position.y = 5.4;
    for(const lx of [-4.6,4.6]){
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.16,0.16,5.4,6),
        new THREE.MeshStandardMaterial({ color:0x33363c, metalness:0.8, roughness:0.5 }));
      leg.position.set(lx,2.7,-0.1); grp.add(leg);
    }
    grp.add(face);
    grp.position.copy(pos);
    grp.lookAt(sm.p.x, 5.4, sm.p.z);
    scene.add(grp);
  }
  board('APEX RUSH','黄昏赛道 · NITRO CIRCUIT', 60, 1);
  board('TURN 4','减速 · 弯道见真章', 310, -1);
  board('NITRO ⚡','按住 SHIFT 点燃氮气', 560, 1);
  board('DRIFT','空格漂移 · 回充氮气', 800, -1);

  // 起点门架 + 格纹线
  const sm0 = SMP[0];
  const gantry = new THREE.Group();
  const pilM = new THREE.MeshStandardMaterial({ color:0x2a2d33, metalness:0.85, roughness:0.4 });
  for(const side of [-1,1]){
    const pil = new THREE.Mesh(new THREE.BoxGeometry(0.55,7,0.55), pilM);
    pil.position.copy(sm0.p).addScaledVector(sm0.r, side*(T.roadHalf+1.2)); pil.position.y=3.5;
    gantry.add(pil);
  }
  const span = new THREE.Mesh(new THREE.BoxGeometry((T.roadHalf+1.2)*2+0.5, 1.15, 0.8), pilM);
  span.position.copy(sm0.p); span.position.y = 6.6;
  span.rotation.y = Math.atan2(sm0.r.x, sm0.r.z);
  gantry.add(span);
  const bc = document.createElement('canvas'); bc.width=512; bc.height=64;
  const bg = bc.getContext('2d')!;
  for(let x=0;x<16;x++) for(let y=0;y<2;y++){ bg.fillStyle=(x+y)%2?'#0d0d0f':'#f2efe6'; bg.fillRect(x*32,y*32,32,32); }
  bg.fillStyle='#ffb000'; bg.font='italic 900 40px Arial'; bg.textAlign='center'; bg.fillText('START · FINISH',256,46);
  const bt = new THREE.CanvasTexture(bc); bt.colorSpace=THREE.SRGBColorSpace;
  const banner = new THREE.Mesh(new THREE.PlaneGeometry((T.roadHalf+1.2)*2, 1.05),
    new THREE.MeshStandardMaterial({ map:bt, side:THREE.DoubleSide, emissive:0xffffff, emissiveMap:bt, emissiveIntensity:0.3 }));
  banner.position.copy(sm0.p); banner.position.y=6.6;
  banner.rotation.y = Math.atan2(sm0.f.x, sm0.f.z) + Math.PI/2;
  gantry.add(banner);
  scene.add(gantry);
  // 地面格纹
  const lc = document.createElement('canvas'); lc.width=448; lc.height=64;
  const lg = lc.getContext('2d')!;
  for(let x=0;x<28;x++) for(let y=0;y<4;y++){ lg.fillStyle=(x+y)%2?'#111':'#eee'; lg.fillRect(x*16,y*16,16,16); }
  const lt = new THREE.CanvasTexture(lc); lt.colorSpace=THREE.SRGBColorSpace;
  const lineMesh = new THREE.Mesh(new THREE.PlaneGeometry(T.roadHalf*2, 1.6),
    new THREE.MeshBasicMaterial({ map:lt }));
  lineMesh.rotation.x = -Math.PI/2;
  lineMesh.rotation.z = -Math.atan2(sm0.f.x, sm0.f.z);
  lineMesh.position.copy(sm0.p); lineMesh.position.y = 0.022;
  scene.add(lineMesh);
}

  return {
    sampleCount: N,
    samples: SMP,
    length: LEN,
    spacing: DS,
    speedProfile: PROFILE,
    sampleAt,
    nearestIndex: nearestIdx,
  };
}
