import * as THREE from 'three';
import { toCreasedNormals } from 'three/addons/utils/BufferGeometryUtils.js';

export type CarModel = {
  grp: THREE.Group;
  body: THREE.Group;
  wheels: THREE.Group[];
  pivots: THREE.Group[];
  paintMat: THREE.MeshPhysicalMaterial;
  tailMat: THREE.MeshStandardMaterial;
  flames: Array<THREE.Mesh<THREE.ConeGeometry, THREE.MeshBasicMaterial>>;
  exhaust: THREE.Vector3[];
  rearWheels: THREE.Vector3[];
};

export function buildCar(paint: number, opt: { rim?: number } = {}): CarModel {
  const grp = new THREE.Group();
  const body = new THREE.Group();          // car body (pitches/rolls with accel/decel)
  grp.add(body);
  const paintMat = new THREE.MeshPhysicalMaterial({
    color: paint, metalness: 0.42, roughness: 0.38,
    clearcoat: 1.0, clearcoatRoughness: 0.07, envMapIntensity: 1.35 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x05070c, metalness: 0, roughness: 0.05,
    clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.5 });
  const carbonMat = new THREE.MeshStandardMaterial({ color:0x121317, metalness:0.55, roughness:0.55 });
  const rimMat = new THREE.MeshStandardMaterial({ color: opt.rim ?? 0xc9ccd4, metalness:0.95, roughness:0.28 });

  // —— Body: side profile extrusion (with wheel-arch cutouts) ——
  // Constraint: the wheel-arch top (ARC_Y+ARC_R=0.78) must stay below the beltline at that
  // point, otherwise the outline self-intersects and triangulation produces bad geometry
  const AX_F = 1.45, AX_R = -1.45, ARC_R = 0.44, ARC_Y = 0.34, BOT = 0.14;
  const dx = Math.sqrt(ARC_R*ARC_R - (ARC_Y-BOT)**2);   // wheel-arch / bottom-edge intersection
  const a0 = Math.PI + Math.asin((ARC_Y-BOT)/ARC_R), a1 = -Math.asin((ARC_Y-BOT)/ARC_R);
  const s = new THREE.Shape();
  s.moveTo(2.42, BOT);
  s.quadraticCurveTo(2.50, 0.18, 2.50, 0.30);     // bumper face
  s.quadraticCurveTo(2.49, 0.46, 2.34, 0.56);     // nose top edge
  s.quadraticCurveTo(2.05, 0.70, 1.75, 0.795);    // nose slope
  s.quadraticCurveTo(1.30, 0.845, 0.95, 0.86);    // front fender top (front arch ≈0.83)
  s.lineTo(-1.05, 0.875);                          // beltline
  s.quadraticCurveTo(-1.70, 0.89, -2.05, 0.955);  // ducktail
  s.quadraticCurveTo(-2.42, 0.83, -2.38, 0.62);   // rear face
  s.lineTo(-2.30, BOT);
  s.lineTo(AX_R - dx, BOT);
  s.absarc(AX_R, ARC_Y, ARC_R, a0, a1, true);     // rear wheel arch
  s.lineTo(AX_F - dx, BOT);
  s.absarc(AX_F, ARC_Y, ARC_R, a0, a1, true);     // front wheel arch
  s.lineTo(2.42, BOT);
  let bodyGeo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(s, {
    depth: 1.74, bevelEnabled: true, bevelThickness: 0.11, bevelSize: 0.09,
    bevelSegments: 5, curveSegments: 26 });
  bodyGeo.rotateY(-Math.PI/2); bodyGeo.translate(0.87, 0, 0);
  bodyGeo = toCreasedNormals(bodyGeo, 0.85);
  const bodyMesh = new THREE.Mesh(bodyGeo, paintMat);
  bodyMesh.castShadow = true;
  body.add(bodyMesh);

  // —— Cabin glass ——
  const cs = new THREE.Shape();
  cs.moveTo(1.02, 0.80);
  cs.quadraticCurveTo(0.62, 1.06, 0.18, 1.16);    // windshield
  cs.quadraticCurveTo(-0.10, 1.215, -0.45, 1.215);// roof
  cs.quadraticCurveTo(-0.95, 1.17, -1.38, 0.985); // fastback slope
  cs.quadraticCurveTo(-1.58, 0.90, -1.66, 0.82);
  cs.lineTo(-1.60, 0.80);
  cs.lineTo(1.02, 0.80);
  let cabGeo: THREE.BufferGeometry = new THREE.ExtrudeGeometry(cs, {
    depth: 1.10, bevelEnabled: true, bevelThickness: 0.07, bevelSize: 0.06,
    bevelSegments: 4, curveSegments: 20 });
  cabGeo.rotateY(-Math.PI/2); cabGeo.translate(0.55, 0, 0);
  cabGeo = toCreasedNormals(cabGeo, 0.9);
  const cab = new THREE.Mesh(cabGeo, glassMat);
  cab.castShadow = true;
  body.add(cab);

  // —— Inner liner panels (block see-through into the wheel arches) ——
  for(const z of [AX_F, AX_R]){
    const blk = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.55, 1.02),
      new THREE.MeshStandardMaterial({ color:0x0a0a0c, roughness:1 }));
    blk.position.set(0, 0.42, z);
    body.add(blk);
  }
  // Chassis floor plate
  const floor = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.06, 4.2), carbonMat);
  floor.position.set(0, 0.15, 0);
  body.add(floor);

  // —— Detail parts ——
  const addBox = (w: number, h: number, d: number, x: number, y: number, z: number, mat: THREE.Material, rx = 0) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), mat);
    m.position.set(x,y,z); if(rx) m.rotation.x = rx;
    body.add(m); return m;
  };
  addBox(1.90,0.05,0.36, 0,0.125,2.42, carbonMat);            // front splitter
  addBox(1.00,0.17,0.08, 0,0.30,2.45, carbonMat);             // intake grille
  addBox(0.46,0.10,0.06, 0,0.485,2.435, carbonMat);           // upper nose grille
  addBox(1.52,0.12,0.26, 0,0.19,-2.28, carbonMat);            // diffuser
  for(const fx of [-0.45,-0.15,0.15,0.45])
    addBox(0.025,0.15,0.26, fx,0.115,-2.28, carbonMat);       // diffuser fins
  for(const sx of [-0.94,0.94]) addBox(0.07,0.10,1.9, sx,0.15,0, carbonMat); // side skirts

  // Rear wing
  for(const sx of [-0.55,0.55]) addBox(0.06,0.22,0.16, sx,1.10,-2.12, carbonMat);
  const blade = addBox(1.60,0.04,0.38, 0,1.20,-2.16, paintMat, -0.10);
  blade.castShadow = true;
  for(const sx of [-0.81,0.81]) addBox(0.025,0.13,0.36, sx,1.235,-2.16, carbonMat);

  // Mirrors
  for(const sx of [-1.0,1.0]){
    addBox(0.035,0.15,0.05, sx*1.00,0.90,0.66, carbonMat);
    addBox(0.21,0.10,0.08, sx*1.07,0.97,0.64, paintMat);
  }

  // Headlights / taillights
  const headMat = new THREE.MeshStandardMaterial({ color:0x9fb4c4,
    emissive:0xcfe8ff, emissiveIntensity:2.2 });
  for(const sx of [-0.62,0.62]) addBox(0.44,0.05,0.15, sx,0.525,2.45, headMat, -0.25);
  const tailMat = new THREE.MeshStandardMaterial({ color:0x550508,
    emissive:0xff1a2e, emissiveIntensity:1.5 });
  addBox(1.72,0.15,0.05, 0,0.74,-2.475, carbonMat);            // taillight housing (bevel puts rear face at ≈ -2.47)
  const tail = addBox(1.64,0.08,0.05, 0,0.74,-2.50, tailMat);

  // Exhaust + nitro flame cones (hidden by default)
  const exMat = new THREE.MeshStandardMaterial({ color:0x3a3d42, metalness:0.95, roughness:0.35 });
  const flames: Array<THREE.Mesh<THREE.ConeGeometry, THREE.MeshBasicMaterial>> = [];
  for(const sx of [-0.30,0.30]){
    const ex = new THREE.Mesh(new THREE.CylinderGeometry(0.055,0.055,0.24,12), exMat);
    ex.rotation.x = Math.PI/2; ex.position.set(sx,0.30,-2.46);
    body.add(ex);
    const flMat = new THREE.MeshBasicMaterial({ transparent:true, opacity:0.95,
      blending:THREE.AdditiveBlending, depthWrite:false });
    flMat.color.setRGB(1.2, 2.4, 3.6);   // HDR brightness, so it triggers bloom
    const fl = new THREE.Mesh(new THREE.ConeGeometry(0.075,0.72,8), flMat);
    fl.rotation.x = -Math.PI/2;          // cone tip points backward
    fl.position.set(sx,0.30,-2.86);
    fl.visible = false;
    body.add(fl); flames.push(fl);
  }

  // —— Wheels ——
  const wheels: THREE.Group[] = [], pivots: THREE.Group[] = [];
  const tireG = new THREE.CylinderGeometry(0.34,0.34,0.30,28);
  tireG.rotateZ(Math.PI/2);
  const tireM = new THREE.MeshStandardMaterial({ color:0x1e1f22, roughness:0.85 });
  const rimG = new THREE.CylinderGeometry(0.205,0.205,0.245,20);
  rimG.rotateZ(Math.PI/2);
  const discG = new THREE.CylinderGeometry(0.15,0.15,0.03,18);
  discG.rotateZ(Math.PI/2);
  const discM = new THREE.MeshStandardMaterial({ color:0xb8bcc2, metalness:0.85, roughness:0.35 });
  const calM = new THREE.MeshStandardMaterial({ color:0xc1121f, roughness:0.5 });
  function wheel(x: number, z: number, steer: boolean){
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.34, z);
    const w = new THREE.Group();
    const tire = new THREE.Mesh(tireG, tireM); tire.castShadow = true;
    const rim = new THREE.Mesh(rimG, new THREE.MeshStandardMaterial({
      color:0x101114, metalness:0.7, roughness:0.45 }));
    w.add(tire, rim);
    const fx = Math.sign(x)*0.128;   // rim outer face
    const lip = new THREE.Mesh(new THREE.TorusGeometry(0.195, 0.024, 10, 28), rimMat);
    lip.rotation.y = Math.PI/2; lip.position.x = fx;
    w.add(lip);
    for(let i=0;i<7;i++){ // spokes: radiating out from the outer face
      const holder = new THREE.Group();
      const sp = new THREE.Mesh(new THREE.BoxGeometry(0.045,0.175,0.06), rimMat);
      sp.position.set(fx, 0.105, 0);
      holder.add(sp);
      holder.rotation.x = i/7*Math.PI*2;
      w.add(holder);
    }
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.066,0.066,0.27,12).rotateZ(Math.PI/2), rimMat);
    w.add(hub);
    const disc = new THREE.Mesh(discG, discM); disc.position.x = -Math.sign(x)*0.04;
    const cal = new THREE.Mesh(new THREE.BoxGeometry(0.05,0.16,0.10), calM);
    cal.position.set(-Math.sign(x)*0.04, 0.13, Math.sign(z)*0.05||0.05);
    pivot.add(w, disc, cal);
    grp.add(pivot);
    wheels.push(w); if(steer) pivots.push(pivot);
  }
  // Track width pushed outward so hubs sit flush with the body instead of tucked into arch shadow
  wheel(-0.845, AX_F, true); wheel(0.845, AX_F, true);
  wheel(-0.845, AX_R, false); wheel(0.845, AX_R, false);

  return { grp, body, wheels, pivots, paintMat, tailMat, flames,
    exhaust: [new THREE.Vector3(-0.30,0.30,-2.56), new THREE.Vector3(0.30,0.30,-2.56)],
    rearWheels: [new THREE.Vector3(-0.845,0.02,AX_R), new THREE.Vector3(0.845,0.02,AX_R)] };
}
