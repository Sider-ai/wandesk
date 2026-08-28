import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RacingAudio } from './audio';
import { createAiController } from './ai';
import { createCameraController } from './camera';
import { buildCar } from './car-model';
import { createEffects } from './effects';
import { createInput } from './input';
import { createPlayerPhysics, resolveCarCollisions, type DrivingDynamics } from './physics';
import { createTrack } from './track';
import type { CarState, RacingRoot } from './types';
import { GEARS, RACERS, TUNING } from '../lib/config';
import { clamp, damp, formatRaceTime, moveToward, random } from '../lib/math';

// The original game is an imperative realtime engine. React owns the interface tree;
// this module owns Three.js, physics, audio and the frame loop for one mounted window.
export function mountRacing(root: RacingRoot): () => void {

  const abort = new AbortController();
  let active = true;
  let bootOK = false;
  let raf = 0;
  const timers = new Set<number>();
  const later = (fn: () => void, ms: number): number => {
    const id = window.setTimeout(() => {
      timers.delete(id);
      if (active) fn();
    }, ms);
    timers.add(id);
    return id;
  };
  const viewW = () => Math.max(1, root.clientWidth);
  const viewH = () => Math.max(1, root.clientHeight);
  const $ = <T extends Element = HTMLElement>(selector: string): T => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`赛车界面缺少节点: ${selector}`);
    return element;
  };
  function showError(message: string): void {
    $('#errMsg').textContent = message;
    $('#errbox').classList.remove('hidden');
    $('#loading').classList.add('hidden');
  }
  window.addEventListener('error', e => { if(!bootOK) showError('初始化出错:' + (e.message||'未知错误')); }, { signal: abort.signal });

  const T = TUNING;
  const fmtT = formatRaceTime;
  const rnd = random;

  /* ════════════════════ 渲染器 / 场景 ════════════════════ */
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias:true, powerPreference:'high-performance' });
  } catch(e){ showError('当前浏览器无法启用 WebGL。请改用最新版 Chrome / Safari。'); throw e; }
  // 软件渲染(SwiftShader 等无 GPU 环境)自动降质,保证能玩
  const GL_INFO = (()=>{ try{ const gl=renderer.getContext();
    const ext=gl.getExtension('WEBGL_debug_renderer_info');
    return ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : ''; }catch(e){ return ''; } })();
  const SOFT_GL = /swiftshader|software|llvmpipe/i.test(GL_INFO);
  const DPR = SOFT_GL ? 1 : Math.min(window.devicePixelRatio||1, 2);
  renderer.setPixelRatio(DPR);
  renderer.setSize(viewW(), viewH());
  renderer.shadowMap.enabled = !SOFT_GL;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.06;
  const appMount = $('#app');
  appMount.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xd5915a, 140, 950);
  const camera = new THREE.PerspectiveCamera(T.fovBase, viewW()/viewH(), 0.1, 2200);
  camera.position.set(0, 3, -10);

  /* 黄昏天空(也用作环境反射) */
  const SUN_DIR = new THREE.Vector3(-0.55, 0.30, -0.78).normalize();
  function makeSky(): THREE.Mesh {
    const geo = new THREE.SphereGeometry(1000, 32, 18);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, fog: false, depthWrite: false,
      uniforms: { sunDir: { value: SUN_DIR } },
      vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec3 vDir; uniform vec3 sunDir;
        void main(){
          float h = vDir.y;
          vec3 zen = vec3(0.16,0.26,0.52)*1.25;
          vec3 hor = vec3(2.5,1.15,0.45);
          vec3 col = mix(hor, zen, smoothstep(-0.02,0.42,h));
          col = mix(vec3(1.4,0.62,0.30), col, smoothstep(-0.25,0.02,h));
          float sd = max(dot(vDir,sunDir),0.0);
          col += vec3(3.2,1.9,0.9)*pow(sd,420.0)*3.0;   // 日轮
          col += vec3(1.6,0.85,0.35)*pow(sd,18.0)*0.55; // 霞光
          gl_FragColor = vec4(col,1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    });
    return new THREE.Mesh(geo, mat);
  }
  const sky = makeSky();
  scene.add(sky);

  // 环境反射:用同一个天空生成 PMREM,车漆反射与天色一致
  {
    const envScene = new THREE.Scene();
    envScene.add(makeSky());
    const gnd = new THREE.Mesh(new THREE.CircleGeometry(900, 32),
      new THREE.MeshBasicMaterial({ color: 0x33271c }));
    gnd.rotation.x = -Math.PI/2; gnd.position.y = -2;
    envScene.add(gnd);
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(envScene).texture;
    pmrem.dispose();
  }

  /* 光照 */
  const sun = new THREE.DirectionalLight(0xffd9a0, 2.9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -60; sun.shadow.camera.right = 60;
  sun.shadow.camera.top = 60;   sun.shadow.camera.bottom = -60;
  sun.shadow.camera.near = 10;  sun.shadow.camera.far = 320;
  sun.shadow.bias = -0.0012;
  scene.add(sun, sun.target);
  scene.add(new THREE.HemisphereLight(0x90b2e8, 0x4a3826, 0.55));

  /* 后期:Bloom */
  const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(
    viewW()*DPR, viewH()*DPR, { type: THREE.HalfFloatType, samples: SOFT_GL ? 0 : 4 }));
  composer.setPixelRatio(DPR);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(viewW(), viewH()), 0.5, 0.55, 0.85);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const track = createTrack(scene, renderer, T);
  const SMP = track.samples;
  const LEN = track.length;
  const DS = track.spacing;
  const sampleAt = track.sampleAt;
  const nearestIdx = track.nearestIndex;



  /* ════════════════════ 车辆状态 ════════════════════ */
  const cars: CarState[] = RACERS.map((r, i) => {
    const model = buildCar(r.color, { rim: 'rim' in r ? r.rim : undefined });
    scene.add(model.grp);
    return {
      name: r.name, color: r.color, rim: 'rim' in r ? r.rim : undefined,
      isPlayer: 'isPlayer' in r && r.isPlayer, model, idx:i,
      pos: new THREE.Vector3(), h: 0, vel: new THREE.Vector3(),
      vf: 0, vlat: 0, steer: 0, steerVis: 0,
      s: 0, lastIdx: 0, lap: 1, wraps: 0, progress: 0,
      finished: false, finishTime: 0, v: 0,
      laneBase: 0, lanePhase: rnd(Math.PI*2), nudge: 0,
      spin: 0, drifting: false, onGrass: false,
      roll: 0, pitch: 0, acc: 0,
      _th: 0, _br: 0, _st: 0, _nitro: false,
    };
  });
  const player = cars[0];

  function placeOnGrid(): void {
    // 发车排位:玩家 P4 在最后;整体离起点门架留出距离,标题环绕镜头不穿模
    const slots = [24, 18, 12, 6]; // P1..P4 的 s 值
    const order = [cars[1], cars[2], cars[3], player]; // AI 前三,玩家 P4
    order.forEach((c, i)=>{
      const sVal = slots[i];
      const sm = sampleAt(sVal);
      const side = (i%2 ? -1 : 1) * 2.6;
      c.s = sVal;
      c.pos.copy(sm.p).addScaledVector(sm.r, side);
      c.h = Math.atan2(sm.f.x, sm.f.z);
      c.vel.set(0,0,0); c.vf = 0; c.vlat = 0; c.v = 0; c.steer = 0;
      c.lap = 1; c.wraps = 0; c.finished = false; c.finishTime = 0;
      c.lastIdx = Math.round(sVal/DS); c.nudge = 0;
      c.laneBase = side * 0.8;
      syncModel(c, 0);
    });
  }

  function syncModel(c: CarState, dt: number): void {
    const m = c.model;
    m.grp.position.copy(c.pos);
    m.grp.rotation.y = c.h;
    // 车身姿态:俯仰 + 侧倾
    const latA = c.isPlayer ? c.vlat : 0;
    const tgtRoll = clamp(-latA*0.016 - c.steer*Math.min(Math.abs(c.vf??c.v),30)*0.0035, -0.085, 0.085);
    const tgtPitch = clamp(-(c.acc||0)*0.0045, -0.05, 0.06);
    c.roll = damp(c.roll, tgtRoll, 8, dt||0.016);
    c.pitch = damp(c.pitch, tgtPitch, 6, dt||0.016);
    m.body.rotation.z = c.roll; m.body.rotation.x = c.pitch;
    // 车轮
    const speed = c.isPlayer ? c.vf : c.v;
    c.spin += speed/0.34 * (dt||0);
    m.wheels.forEach((wheel) => { wheel.rotation.x = c.spin; });
    m.pivots.forEach((pivot) => { pivot.rotation.y = c.isPlayer ? c.steerVis * 0.42 : 0; });
  }

  const effects = createEffects(scene);
  const { smoke, flame, skids, laySkid } = effects;
  let skidAcc = 0;


  const AU = new RacingAudio();

  const input = createInput(root, abort.signal, () => state, setPause, startRace);


  /* ════════════════════ 比赛状态 ════════════════════ */
  let state = 'loading';        // loading|title|countdown|racing|paused|finished
  let raceTime = 0, countT = 0, lapStart = 0, lastLap = -1, bestLap = -1;
  const dynamics: DrivingDynamics = {
    nitroBar: 100,
    nitroActive: false,
    railHitCool: 0,
    wrongWayTime: 0,
    shake: 0,
    demoMode: false,
  };


  function onLapCross(c: CarState): void {
    c.wraps++;
    if(c.isPlayer){
      if(c.wraps >= 1){
        const t = raceTime - lapStart;
        if(c.wraps <= 3 && t > 5){
          lastLap = t;
          const isBest = bestLap<0 || t<bestLap;
          if(isBest) bestLap = t;
          if(c.wraps < 3) lapToast(`LAP <em>${c.wraps+1}/3</em>`, `上圈 ${fmtT(t)}${isBest?' ★ 最快':''}`, isBest);
        }
        lapStart = raceTime;
      }
      c.lap = c.wraps + 1;
      if(c.wraps >= 3 && !c.finished){
        c.finished = true; c.finishTime = raceTime;
        finishRace();
      }
    } else {
      c.lap = c.wraps + 1;
      if(c.wraps >= 3 && !c.finished){ c.finished = true; c.finishTime = raceTime; }
    }
  }

  const ai = createAiController({
    tuning: T,
    track,
    player,
    getRaceState: () => state,
    getNitro: () => dynamics.nitroBar,
    onLapCross,
  });
  const physics = createPlayerPhysics({
    player,
    track,
    tuning: T,
    input,
    audio: AU,
    dynamics,
    getRaceState: () => state,
    addRaceTime: (dt) => { raceTime += dt; },
    onLapCross,
    drivePlayer: ai.drivePlayer,
  });
  const cameraController = createCameraController({
    camera,
    player,
    track,
    tuning: T,
    getRaceState: () => state,
    getCountdown: () => countT,
    getNitroActive: () => dynamics.nitroActive,
    getShake: () => dynamics.shake,
    setShake: (value) => { dynamics.shake = value; },
  });


  /* 太阳跟随玩家(阴影范围有限) */
  function updateSun(): void {
    sun.position.copy(player.pos).addScaledVector(SUN_DIR, 150);
    sun.target.position.copy(player.pos);
    sun.target.updateMatrixWorld();
  }

  /* ════════════════════ HUD ════════════════════ */
  const segs: HTMLElement[] = [];
  { const wrap = $('#nitroSegs'); for(let i=0;i<12;i++){ const el=document.createElement('i'); wrap.appendChild(el); segs.push(el); } }
  const E = {
    hud:$('#hud'), posN:$('#posN'), posT:$('#posT'), lapTxt:$('#lapTxt'), timeTxt:$('#timeTxt'),
    lastTxt:$('#lastTxt'), bestTxt:$('#bestTxt'), spdN:$('#spdN'), gearN:$('#gearN'),
    arcFill:$('#arcFill'), needle:$('#needle'), driftTag:$('#driftTag'), wrongWay:$('#wrongWay'),
    countNum:$('#countNum'), lapToast:$('#lapToast'), nitroVig:$('#nitroVig'), hints:$('#hints'),
    title:$('#title'), pause:$('#pause'), results:$('#results'), loading:$('#loading'),
    minimap:$<HTMLCanvasElement>('#minimap'),
  };
  let lastPosShown = 4, hintTimer: number | null = null;
  function gearOf(v: number): { g: number; r: number } {
    const a = Math.abs(v);
    for(let g=GEARS.length-2; g>=1; g--) if(a >= GEARS[g]) return { g:g+1, r:(a-GEARS[g])/(GEARS[g+1]-GEARS[g]) };
    return { g:1, r:a/GEARS[1] };
  }
  function rankCars(): CarState[] {
    const arr = [...cars].sort((a,b)=>{
      if(a.finished&&b.finished) return a.finishTime-b.finishTime;
      if(a.finished!==b.finished) return a.finished?-1:1;
      return b.progress-a.progress;
    });
    return arr;
  }
  function hudUpdate(): void {
    if(state!=='racing' && state!=='countdown' && state!=='finished') return;
    const c = player;
    const kmh = Math.abs(c.vf)*3.6;
    E.spdN.textContent = String(Math.round(kmh));
    const v01 = clamp(Math.abs(c.vf)/T.vMax, 0, 1);
    E.arcFill.style.strokeDashoffset = (250*(1-v01)).toFixed(1);
    E.needle.style.transform = `rotate(${(-125+250*v01).toFixed(1)}deg)`;
    const { g, r } = gearOf(c.vf);
    E.gearN.textContent = c.vf < -0.5 ? 'R' : String(g);
    const onSegs = Math.round(dynamics.nitroBar/100*12);
    segs.forEach((el,i)=>el.classList.toggle('on', i<onSegs));
    E.driftTag.classList.toggle('on', c.drifting && Math.abs(c.vf)>8);
    E.nitroVig.classList.toggle('on', dynamics.nitroActive);
    E.wrongWay.classList.toggle('show', dynamics.wrongWayTime > 1.1);

    const rank = rankCars();
    const pos = rank.indexOf(c)+1;
    E.posN.textContent = String(pos);
    E.posN.classList.toggle('first', pos===1);
    if(pos !== lastPosShown){
      E.posN.classList.remove('pulse'); void E.posN.offsetWidth; E.posN.classList.add('pulse');
      if(pos < lastPosShown) AU.beep(880, 0.1, 0.14, 'sine');
      lastPosShown = pos;
    }
    E.lapTxt.textContent = `${Math.min(c.lap,3)}/3`;
    E.timeTxt.textContent = fmtT(raceTime);
    E.lastTxt.textContent = fmtT(lastLap);
    E.bestTxt.textContent = fmtT(bestLap);
    drawMinimap(rank);
  }
  /* 小地图 */
  const mapCtx = E.minimap.getContext('2d')!;
  let mapPts: Array<[number, number]> | null = null, mapScale = 1, mapOff: [number, number] = [0,0];
  function buildMap(): void {
    const W = 152*2; E.minimap.width = W; E.minimap.height = W;
    let mnx=1e9,mxx=-1e9,mnz=1e9,mxz=-1e9;
    for(const sm of SMP){ mnx=Math.min(mnx,sm.p.x); mxx=Math.max(mxx,sm.p.x);
      mnz=Math.min(mnz,sm.p.z); mxz=Math.max(mxz,sm.p.z); }
    const pad = 26;
    mapScale = Math.min((W-pad*2)/(mxx-mnx), (W-pad*2)/(mxz-mnz));
    mapOff = [ (W-(mxx-mnx)*mapScale)/2 - mnx*mapScale, (W-(mxz-mnz)*mapScale)/2 - mnz*mapScale ];
    mapPts = SMP.filter((_,i)=>i%5===0).map(sm=>[ sm.p.x*mapScale+mapOff[0], W-(sm.p.z*mapScale+mapOff[1]) ]);
  }
  function drawMinimap(rank: CarState[]): void {
    if(!mapPts) buildMap();
    const points = mapPts!;
    const g = mapCtx, W = E.minimap.width;
    g.clearRect(0,0,W,W);
    g.beginPath();
    points.forEach((p,i)=> i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));
    g.closePath();
    g.lineWidth = 9; g.strokeStyle = 'rgba(255,255,255,.16)'; g.stroke();
    g.lineWidth = 3.5; g.strokeStyle = 'rgba(255,255,255,.5)'; g.stroke();
    // 起点
    const s0 = SMP[0];
    g.save();
    g.translate(s0.p.x*mapScale+mapOff[0], W-(s0.p.z*mapScale+mapOff[1]));
    g.rotate(-Math.atan2(s0.f.x, s0.f.z));
    g.fillStyle = '#ffb000'; g.fillRect(-7,-1.6,14,3.2);
    g.restore();
    for(const c of [...cars].reverse()){
      const x = c.pos.x*mapScale+mapOff[0], y = W-(c.pos.z*mapScale+mapOff[1]);
      g.beginPath();
      g.arc(x,y, c.isPlayer?7:5.5, 0, Math.PI*2);
      g.fillStyle = c.isPlayer ? '#35d6ff' : '#'+c.color.toString(16).padStart(6,'0');
      g.fill();
      if(c.isPlayer){ g.lineWidth=2.4; g.strokeStyle='#fff'; g.stroke(); }
    }
  }
  function lapToast(big: string, small: string, best: boolean): void {
    E.lapToast.querySelector('b')!.innerHTML = big;
    const p = E.lapToast.querySelector('p')!;
    p.textContent = small; p.classList.toggle('best', !!best);
    E.lapToast.classList.add('show');
    later(()=>E.lapToast.classList.remove('show'), 2400);
  }

  /* ════════════════════ 状态切换 ════════════════════ */
  function show(el: Element, on: boolean): void { el.classList.toggle('hidden', !on); }
  function toTitle(): void {
    state = 'title';
    placeOnGrid();
    dynamics.nitroBar = 100; raceTime = 0; lastLap = bestLap = -1; dynamics.wrongWayTime = 0;
    show(E.title,true); show(E.pause,false); show(E.results,false); show(E.hud,false);
    AU.idle();
  }
  function startRace(): void {
    AU.init(); AU.resume();
    placeOnGrid();
    raceTime = 0; lapStart = 0; lastLap = bestLap = -1;
    dynamics.nitroBar = 100; dynamics.wrongWayTime = 0; lastPosShown = 4; dynamics.shake = 0;
    effects.resetSkids();
    state = 'countdown'; countT = 3.9;
    show(E.title,false); show(E.pause,false); show(E.results,false); show(E.hud,true);
    E.hints.classList.remove('fade');
    if (hintTimer !== null) clearTimeout(hintTimer);
    hintTimer = later(()=>E.hints.classList.add('fade'), 9000);
    E.countNum.classList.add('hidden');
    countShown = 4;
  }
  let countShown = 4;
  function stepCountdown(dt: number): void {
    countT -= dt;
    const n = Math.ceil(countT);
    if(n < countShown && n >= 1){
      countShown = n;
      E.countNum.textContent = String(n);
      E.countNum.classList.remove('hidden','go','anim'); void E.countNum.offsetWidth;
      E.countNum.classList.add('anim');
      AU.beep(440, 0.16, 0.25);
    }
    if(countT <= 0){
      state = 'racing';
      E.countNum.textContent = 'GO!';
      E.countNum.classList.remove('anim','hidden'); void E.countNum.offsetWidth;
      E.countNum.classList.add('go','anim');
      AU.beep(880, 0.5, 0.3);
      later(()=>E.countNum.classList.add('hidden'), 1000);
    }
  }
  function setPause(on: boolean): void {
    if(on && state==='racing'){ state='paused'; show(E.pause,true); AU.suspend(); }
    else if(!on && state==='paused'){ state='racing'; show(E.pause,false); AU.resume(); }
  }
  function finishRace(): void {
    later(()=>{
      state = 'finished';
      const rank = rankCars();
      const pos = rank.indexOf(player)+1;
      $('#resPos').textContent = String(pos);
      $('#resTime').textContent = fmtT(player.finishTime);
      $('#resBest').textContent = fmtT(bestLap);
      const board = $('#board'); board.innerHTML = '';
      const t0 = rank[0].finished ? rank[0].finishTime : estFinish(rank[0]);
      rank.forEach((c,i)=>{
        const t = c.finished ? c.finishTime : estFinish(c);
        const row = document.createElement('div');
        row.className = 'row' + (c.isPlayer?' me':'');
        row.innerHTML = `<span class="rk">${i+1}</span>
          <span class="chip" style="background:#${c.color.toString(16).padStart(6,'0')}"></span>
          <span class="nm">${c.name}</span>
          <span class="tm">${fmtT(t)}</span>
          <span class="gap">${i===0?'WINNER':'+'+(t-t0).toFixed(2)+'s'}</span>`;
        board.appendChild(row);
      });
      show(E.results,true);
      AU.beep(660,0.14,0.2,'sine'); later(()=>AU.beep(880,0.3,0.2,'sine'),150);
    }, 1300);
  }
  function estFinish(c: CarState): number {
    if(c.finished) return c.finishTime;
    const remain = 3*LEN - c.progress;
    return raceTime + remain/Math.max(c.isPlayer?Math.abs(c.vf):c.v, 15);
  }
  $('#btnStart').onclick = startRace;
  $('#btnResume').onclick = ()=>setPause(false);
  $('#btnRestart').onclick = ()=>{ startRace(); };
  $('#btnPauseTitle').onclick = toTitle;
  $('#btnAgain').onclick = startRace;
  $('#btnToTitle').onclick = toTitle;

  /* ════════════════════ 特效更新 ════════════════════ */
  let fxAcc = 0;
  const _wp = new THREE.Vector3();
  function updateFX(dt: number): void {
    fxAcc += dt;
    const c = player;
    const every = 0.028;
    while(fxAcc > every){
      fxAcc -= every;
      if(state!=='racing') break;
      // 氮气尾焰粒子
      if(dynamics.nitroActive){
        for(const off of c.model.exhaust){
          _wp.copy(off).applyMatrix4(c.model.grp.matrixWorld);
          const back = new THREE.Vector3(-Math.sin(c.h),0,-Math.cos(c.h));
          flame.spawn(_wp, back.multiplyScalar(15).add(new THREE.Vector3(rnd(-1.2,1.2),rnd(0.8),rnd(-1.2,1.2))),
            0.22, rnd(0.5,0.75), 3, 1.0);
        }
      }
      // 漂移烟 + 草地尘
      if((c.drifting && Math.abs(c.vf)>8) || (c.onGrass && Math.abs(c.vf)>10)){
        for(const off of c.model.rearWheels){
          _wp.copy(off).applyMatrix4(c.model.grp.matrixWorld);
          smoke.spawn(_wp, new THREE.Vector3(rnd(-1.6,1.6), rnd(1.2,2.4), rnd(-1.6,1.6)),
            rnd(0.5,0.8), rnd(0.5,0.8), 2.2, c.onGrass?0.30:0.38);
        }
      }
    }
    // 胎痕(按行驶距离铺设)
    if(c.drifting && Math.abs(c.vf)>8 && !c.onGrass){
      skidAcc += Math.abs(c.vf)*dt;
      if(skidAcc > 0.55){
        skidAcc = 0;
        for(const off of c.model.rearWheels){
          _wp.copy(off).applyMatrix4(c.model.grp.matrixWorld);
          laySkid(_wp.x, _wp.z, c.h);
        }
      }
    }
    smoke.update(dt); flame.update(dt);
    // 氮气火焰锥(常显核心,粒子之外的保底视觉)
    for(const fl of player.model.flames){
      fl.visible = dynamics.nitroActive;
      if(dynamics.nitroActive){ const k = rnd(0.7,1.35); fl.scale.set(1,k,1); fl.material.opacity = rnd(0.7,1); }
    }
    // 刹车灯
    const braking = (input.isDown('KeyS')||input.isDown('ArrowDown')) && state==='racing';
    player.model.tailMat.emissiveIntensity = braking ? 4.2 : 1.5;
  }

  /* ════════════════════ 主循环 ════════════════════ */
  let last = performance.now(), accum = 0;
  let fpsAcc = 0, fpsN = 0, fpsGuarded = false, uptime = 0;
  function frame(now: number): void {
    if (!active) return;
    raf = requestAnimationFrame(frame);
    tick(now, true);
  }
  // rAF 被浏览器节流(窗口被完全遮挡)时,用定时器只推进模拟、不渲染,避免游戏"冻住"
  const simTimer = window.setInterval(()=>{ const n = performance.now(); if(active && n - last > 400) tick(n, false); }, 150);
  function tick(now: number, render: boolean): void {
    let dt = (now-last)/1000; last = now;
    if(dt > 0.1) dt = 0.1;

    if(state==='countdown') stepCountdown(dt);
    if(state==='racing' || state==='countdown'){
      accum += dt;
      let guard = 0;
      while(accum >= T.step && guard++ < 10){
        physics.step(T.step);
        for(let i=1;i<cars.length;i++) ai.step(cars[i], T.step);
        resolveCarCollisions(cars, track, () => {
          if (dynamics.railHitCool <= 0) { AU.thud(); dynamics.shake = 0.32; dynamics.railHitCool = 0.55; }
        });
        accum -= T.step;
      }
    }
    if(state==='finished'){ // 完赛后缓滑
      physics.step(Math.min(dt,0.033));
      for(let i=1;i<cars.length;i++) ai.step(cars[i], Math.min(dt,0.033));
    }

    for(const c of cars) syncModel(c, dt);
    updateFX(dt);
    cameraController.update(dt);
    updateSun();
    hudUpdate();

    // 引擎声
    if(AU.started && (state==='racing'||state==='countdown'||state==='finished')){
      const { g, r } = gearOf(player.vf);
      const th = (input.isDown('KeyW')||input.isDown('ArrowUp')) && state!=='countdown' ? 1 : 0;
      const revving = state==='countdown' && (input.isDown('KeyW')||input.isDown('ArrowUp'));
      AU.set(revving ? 0.75+Math.sin(now*0.01)*0.1 : clamp(0.12+r*0.88,0,1),
        th||revving?1:0, clamp(Math.abs(player.vf)/T.vMax,0,1),
        player.drifting&&Math.abs(player.vf)>8 ? 0.8 : 0, dynamics.nitroActive);
    } else if(AU.started) AU.idle();

    // 帧率保护:开赛后持续低于 42fps 则降采样一次(跳过启动期的着色器编译卡顿)
    uptime += dt;
    if(render && state==='racing' && uptime > 10){
      fpsAcc += dt; fpsN++;
      if(fpsAcc > 4){
        const avg = fpsN/fpsAcc;
        if(avg < 42 && !fpsGuarded){
          fpsGuarded = true;
          renderer.setPixelRatio(1); composer.setPixelRatio(1);
          console.info('[perf] 帧率偏低,已降低渲染分辨率');
        }
        fpsAcc = 0; fpsN = 0;
      }
    }
    if(render) composer.render();
  }

  const resizeObserver = new ResizeObserver(() => {
    camera.aspect = viewW()/viewH();
    camera.updateProjectionMatrix();
    renderer.setSize(viewW(), viewH());
    composer.setSize(viewW(), viewH());
  });
  resizeObserver.observe(root);

  /* 启动 */
  placeOnGrid();
  buildMap();
  show(E.loading,false);
  toTitle();
  bootOK = true;
  root.__game = {
    get state(){ return state; }, get player(){ return player; },
    get raceTime(){ return raceTime; }, get nitro(){ return dynamics.nitroBar; },
    startRace, setDemo(b){ dynamics.demoMode = b; }, rankCars, LEN, cars,
    camera, setFreeCam(b){ cameraController.setFree(b); },
    press(c){ input.press(c); }, release(c){ input.release(c); },
    shot(q=0.6){ composer.render(); return renderer.domElement.toDataURL('image/jpeg', q); },
  };
  raf = requestAnimationFrame(frame);
  root.focus();
  if(dynamics.demoMode) later(startRace, 600);

  return () => {
    active = false;
    abort.abort();
    cancelAnimationFrame(raf);
    clearInterval(simTimer);
    resizeObserver.disconnect();
    for (const id of timers) clearTimeout(id);
    timers.clear();
    input.clear();
    AU.suspend();
    composer.dispose?.();
    renderer.dispose();
    appMount.replaceChildren();
    delete root.__game;
  };
}
