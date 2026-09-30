import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RGBShiftShader } from 'three/addons/shaders/RGBShiftShader.js';
import './styles.css';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const smooth = (t) => t * t * (3 - 2 * t);
const range = (value, start, end) => smooth(clamp((value - start) / (end - start), 0, 1));
const mixV3 = (a, b, t, out = new THREE.Vector3()) => out.set(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t));

const root = document.documentElement;
const canvas = $('#world');
const loaderEl = $('#loader');
const loadFill = $('#loadFill');
const loadCopy = $('#loadCopy');
const soundtrack = $('#soundtrack');
const soundToggle = $('#soundToggle');
const soundLabel = $('#soundLabel');
const musicToast = $('#musicToast');
const menuButton = $('#menuButton');
const mobilePanel = $('#mobilePanel');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarsePointer = matchMedia('(pointer: coarse)').matches;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 760 ? 1.35 : 1.75));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.02;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x080806);
scene.fog = new THREE.FogExp2(0x080806, 0.045);

const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.05, 100);
camera.position.set(0, 1.25, 8.4);

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.42, 0.68, 0.84);
composer.addPass(bloom);
const rgbShift = new ShaderPass(RGBShiftShader);
rgbShift.uniforms.amount.value = 0;
composer.addPass(rgbShift);
composer.addPass(new OutputPass());

const pmrem = new THREE.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room, 0.04).texture;
room.dispose();
pmrem.dispose();

const hemi = new THREE.HemisphereLight(0xf6e7ce, 0x140b08, 1.65);
scene.add(hemi);
const key = new THREE.SpotLight(0xffd7a4, 220, 34, Math.PI / 5, 0.72, 1.4);
key.position.set(5, 8, 7);
key.target.position.set(0, 0, 0);
key.castShadow = true;
key.shadow.mapSize.set(innerWidth < 760 ? 1024 : 2048, innerWidth < 760 ? 1024 : 2048);
key.shadow.camera.near = 0.5;
key.shadow.camera.far = 30;
key.shadow.bias = -0.00035;
key.shadow.normalBias = 0.035;
scene.add(key, key.target);
const redRim = new THREE.SpotLight(0xb3261b, 190, 30, Math.PI / 4, 0.72, 1.8);
redRim.position.set(-6, 3.5, 4);
redRim.target.position.set(0, 0, 0);
scene.add(redRim, redRim.target);
const ovenLight = new THREE.PointLight(0xff6f2e, 0, 18, 1.8);
ovenLight.position.set(0, 0, -4.2);
scene.add(ovenLight);

const maxAniso = renderer.capabilities.getMaxAnisotropy();
const seeded = (seed) => {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
};

const textureResolution = innerWidth < 760 ? 512 : 1024;
function canvasTexture(draw, size = textureResolution, color = true) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d');
  draw(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = maxAniso;
  if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function noiseSurface(base, specks, seed, amount = 2600) {
  return canvasTexture((ctx, s) => {
    const rnd = seeded(seed);
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < amount; i += 1) {
      const x = rnd() * s;
      const y = rnd() * s;
      const r = 0.4 + rnd() * 3.5;
      ctx.globalAlpha = 0.05 + rnd() * 0.18;
      ctx.fillStyle = specks[Math.floor(rnd() * specks.length)];
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    const g = ctx.createRadialGradient(s * 0.5, s * 0.5, 10, s * 0.5, s * 0.5, s * 0.72);
    g.addColorStop(0, 'rgba(255,255,255,.055)');
    g.addColorStop(1, 'rgba(0,0,0,.17)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
}

function bumpSurface(seed, contrast = 1) {
  return canvasTexture((ctx, s) => {
    const rnd = seeded(seed);
    ctx.fillStyle = '#858585';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 6000; i += 1) {
      const v = Math.floor(90 + rnd() * 90 * contrast);
      ctx.globalAlpha = 0.1 + rnd() * 0.24;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(rnd() * s, rnd() * s, 0.7 + rnd() * 2.2, 0.7 + rnd() * 2.2);
    }
    ctx.globalAlpha = 1;
  }, 512, false);
}

function brickTexture() {
  return canvasTexture((ctx, s) => {
    const rnd = seeded(81);
    ctx.fillStyle = '#27120f';
    ctx.fillRect(0, 0, s, s);
    const rows = 8;
    const bh = s / rows;
    const bw = s / 4;
    for (let y = 0; y < rows; y += 1) {
      const off = y % 2 ? -bw / 2 : 0;
      for (let x = -1; x < 6; x += 1) {
        const bx = x * bw + off + 3;
        const by = y * bh + 3;
        const grad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
        const warm = 42 + Math.floor(rnd() * 28);
        grad.addColorStop(0, `rgb(${warm + 30},${warm - 2},${warm - 8})`);
        grad.addColorStop(1, `rgb(${warm + 5},${Math.max(16, warm - 18)},${Math.max(12, warm - 22)})`);
        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, bw - 6, bh - 6);
        ctx.globalAlpha = 0.16;
        for (let i = 0; i < 18; i += 1) {
          ctx.fillStyle = rnd() > 0.5 ? '#f2b079' : '#090605';
          ctx.fillRect(bx + rnd() * (bw - 8), by + rnd() * (bh - 8), 1 + rnd() * 4, 1 + rnd() * 3);
        }
        ctx.globalAlpha = 1;
      }
    }
  });
}

function paperTexture() {
  return canvasTexture((ctx, s) => {
    const rnd = seeded(42);
    ctx.fillStyle = '#b98c59';
    ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 9000; i += 1) {
      const a = 0.015 + rnd() * 0.05;
      ctx.fillStyle = rnd() > 0.5 ? `rgba(255,240,205,${a})` : `rgba(74,46,24,${a})`;
      ctx.fillRect(rnd() * s, rnd() * s, 1 + rnd() * 3, 1 + rnd() * 3);
    }
  });
}

const textures = {
  dough: noiseSurface('#c97f39', ['#efb36a', '#9e5528', '#5a2a17', '#f6cf8d'], 1, 4400),
  doughBump: bumpSurface(2, 1.1),
  cheese: noiseSurface('#eebd5f', ['#ffd987', '#d88d35', '#fff1b8', '#a95a22'], 3, 3200),
  cheeseBump: bumpSurface(4, 0.7),
  sauce: noiseSurface('#8d1f17', ['#b93226', '#5e110d', '#d84a34', '#4c2b16'], 5, 3600),
  sauceBump: bumpSurface(6, 0.6),
  pepperoni: noiseSurface('#8e261f', ['#c24a37', '#5d1714', '#e0714f', '#f3b48f'], 7, 2800),
  brick: brickTexture(),
  brickBump: bumpSurface(18, 1.25),
  paper: paperTexture(),
  paperBump: bumpSurface(19, 0.45),
};
textures.dough.repeat.set(2.2, 2.2);
textures.doughBump.repeat.set(3.2, 3.2);
textures.cheese.repeat.set(1.7, 1.7);
textures.cheeseBump.repeat.set(2.4, 2.4);
textures.sauce.repeat.set(1.5, 1.5);
textures.pepperoni.repeat.set(1.2, 1.2);
textures.brick.repeat.set(2.4, 2.4);
textures.brickBump.repeat.set(3, 3);
textures.paper.repeat.set(2, 2);
textures.paperBump.repeat.set(3, 3);

const mat = {
  dough: new THREE.MeshPhysicalMaterial({ map: textures.dough, bumpMap: textures.doughBump, bumpScale: 0.055, color: 0xd7924d, roughness: 0.68, metalness: 0, clearcoat: 0.08, clearcoatRoughness: 0.72, envMapIntensity: 0.65 }),
  crust: new THREE.MeshPhysicalMaterial({ map: textures.dough, bumpMap: textures.doughBump, bumpScale: 0.08, color: 0xc97932, roughness: 0.62, clearcoat: 0.12, clearcoatRoughness: 0.58, envMapIntensity: 0.72 }),
  sauce: new THREE.MeshPhysicalMaterial({ map: textures.sauce, bumpMap: textures.sauceBump, bumpScale: 0.025, color: 0x8f241c, roughness: 0.48, clearcoat: 0.3, clearcoatRoughness: 0.38, envMapIntensity: 0.72 }),
  cheese: new THREE.MeshPhysicalMaterial({ map: textures.cheese, bumpMap: textures.cheeseBump, bumpScale: 0.035, color: 0xf4c96d, roughness: 0.42, clearcoat: 0.22, clearcoatRoughness: 0.3, sheen: 0.35, sheenColor: new THREE.Color(0xffbf55), envMapIntensity: 0.9 }),
  pepperoni: new THREE.MeshPhysicalMaterial({ map: textures.pepperoni, color: 0x9c3028, roughness: 0.42, clearcoat: 0.28, clearcoatRoughness: 0.35, envMapIntensity: 0.85 }),
  blackOlive: new THREE.MeshPhysicalMaterial({ color: 0x171412, roughness: 0.32, clearcoat: 0.4, envMapIntensity: 1 }),
  greenOlive: new THREE.MeshPhysicalMaterial({ color: 0x6f843d, roughness: 0.44, clearcoat: 0.25, envMapIntensity: 0.8 }),
  mushroom: new THREE.MeshPhysicalMaterial({ color: 0xcbb089, roughness: 0.72, envMapIntensity: 0.5 }),
  basil: new THREE.MeshPhysicalMaterial({ color: 0x2f513a, roughness: 0.58, clearcoat: 0.05, side: THREE.DoubleSide, envMapIntensity: 0.5 }),
  chicken: new THREE.MeshPhysicalMaterial({ color: 0xaa6038, roughness: 0.55, clearcoat: 0.12, envMapIntensity: 0.7 }),
  char: new THREE.MeshStandardMaterial({ color: 0x32160f, roughness: 0.9 }),
  portal: new THREE.MeshBasicMaterial({ color: 0xc6462e, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
  paper: new THREE.MeshPhysicalMaterial({ map: textures.paper, bumpMap: textures.paperBump, bumpScale: 0.03, color: 0xc69b67, roughness: 0.88, envMapIntensity: 0.32 }),
  brick: new THREE.MeshStandardMaterial({ map: textures.brick, bumpMap: textures.brickBump, bumpScale: 0.06, color: 0x653128, roughness: 0.86, metalness: 0, envMapIntensity: 0.25 }),
  darkStone: new THREE.MeshStandardMaterial({ color: 0x18110e, roughness: 0.92, metalness: 0.02 }),
};

const world = new THREE.Group();
scene.add(world);

function mesh(geometry, material, parent = world) {
  const m = new THREE.Mesh(geometry, material);
  const solid = !material.transparent || material.opacity >= 0.98;
  m.castShadow = solid;
  m.receiveShadow = solid;
  parent.add(m);
  return m;
}

function createPizza() {
  const group = new THREE.Group();
  group.name = 'heroPizza';
  world.add(group);

  const base = mesh(new THREE.CylinderGeometry(2.08, 2.14, 0.27, 112, 3), mat.dough, group);
  base.position.y = -0.08;
  const sauce = mesh(new THREE.CylinderGeometry(1.92, 1.94, 0.07, 112, 1), mat.sauce, group);
  sauce.position.y = 0.095;
  const cheese = mesh(new THREE.CylinderGeometry(1.89, 1.91, 0.075, 112, 1), mat.cheese, group);
  cheese.position.y = 0.145;
  const crust = mesh(new THREE.TorusGeometry(1.91, 0.22, 28, 128), mat.crust, group);
  crust.rotation.x = Math.PI / 2;
  crust.position.y = 0.16;

  const rnd = seeded(2026);
  const cheeseBubbles = new THREE.Group();
  group.add(cheeseBubbles);
  for (let i = 0; i < 34; i += 1) {
    const r = 0.18 + rnd() * 1.55;
    const a = rnd() * Math.PI * 2;
    const b = mesh(new THREE.SphereGeometry(0.09 + rnd() * 0.13, 20, 12), mat.cheese, cheeseBubbles);
    b.position.set(Math.cos(a) * r, 0.205 + rnd() * 0.04, Math.sin(a) * r);
    b.scale.y = 0.36 + rnd() * 0.28;
  }
  for (let i = 0; i < 44; i += 1) {
    const r = 0.1 + rnd() * 1.82;
    const a = rnd() * Math.PI * 2;
    const c = mesh(new THREE.CylinderGeometry(0.018 + rnd() * 0.025, 0.018 + rnd() * 0.025, 0.008, 10), mat.char, group);
    c.position.set(Math.cos(a) * r, 0.205, Math.sin(a) * r);
    c.rotation.z = Math.PI / 2;
    c.rotation.y = rnd() * Math.PI;
    c.scale.x = 1 + rnd() * 2;
  }

  const toppingRoot = new THREE.Group();
  toppingRoot.position.y = 0.235;
  group.add(toppingRoot);
  const sets = { pepperoni: [], black: [], green: [], mushroom: [], chicken: [], basil: [], cheese: [] };

  const addPepperoni = (x, z, scale = 1) => {
    const p = mesh(new THREE.CylinderGeometry(0.275 * scale, 0.285 * scale, 0.052, 44), mat.pepperoni, toppingRoot);
    p.position.set(x, 0, z);
    p.rotation.y = rnd() * Math.PI;
    sets.pepperoni.push(p);
    for (let j = 0; j < 5; j += 1) {
      const fat = mesh(new THREE.SphereGeometry(0.022 * scale, 9, 7), new THREE.MeshStandardMaterial({ color: 0xe7a182, roughness: 0.48 }), p);
      const aa = rnd() * Math.PI * 2;
      fat.position.set(Math.cos(aa) * 0.12 * scale, 0.03, Math.sin(aa) * 0.12 * scale);
      fat.scale.y = 0.25;
    }
    return p;
  };
  const addOlive = (x, z, green = false, scale = 1) => {
    const o = mesh(new THREE.TorusGeometry(0.115 * scale, 0.04 * scale, 12, 24), green ? mat.greenOlive : mat.blackOlive, toppingRoot);
    o.rotation.x = Math.PI / 2;
    o.position.set(x, 0.025, z);
    (green ? sets.green : sets.black).push(o);
  };
  const addMushroom = (x, z, scale = 1) => {
    const g = new THREE.Group();
    toppingRoot.add(g);
    g.position.set(x, 0.035, z);
    g.rotation.y = rnd() * Math.PI;
    const cap = mesh(new THREE.SphereGeometry(0.18 * scale, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat.mushroom, g);
    cap.scale.set(1.25, 0.55, 0.9);
    const stem = mesh(new THREE.BoxGeometry(0.08 * scale, 0.04, 0.2 * scale), mat.mushroom, g);
    stem.position.z = 0.11 * scale;
    sets.mushroom.push(g);
  };
  const addChicken = (x, z, scale = 1) => {
    const c = mesh(new THREE.DodecahedronGeometry(0.16 * scale, 1), mat.chicken, toppingRoot);
    c.position.set(x, 0.04, z);
    c.scale.y = 0.58;
    c.rotation.set(rnd(), rnd() * Math.PI, rnd());
    sets.chicken.push(c);
  };
  const addBasil = (x, z, scale = 1) => {
    const g = new THREE.Group();
    toppingRoot.add(g);
    g.position.set(x, 0.055, z);
    g.rotation.y = rnd() * Math.PI;
    const leaf = mesh(new THREE.CircleGeometry(0.16 * scale, 18), mat.basil, g);
    leaf.scale.set(1.6, 0.8, 1);
    leaf.rotation.x = -Math.PI / 2;
    sets.basil.push(g);
  };

  const pepperoniPositions = [[-0.75,-0.7],[0.1,-0.95],[0.8,-0.55],[-0.9,0.15],[-0.2,-0.05],[0.55,0.12],[0.98,0.55],[-0.55,0.75],[0.25,0.88]];
  pepperoniPositions.forEach(([x,z],i)=>addPepperoni(x,z, i % 3 === 0 ? .92 : 1));
  [[-1.1,-.2],[-.25,-1.25],[.55,-1.05],[1.1,.05],[-.65,.35],[.15,.48],[.6,.9],[-.9,.95]].forEach(([x,z],i)=>addOlive(x,z,i%3===0,.9));
  [[-.4,-.55],[.45,-.25],[-1.1,.42],[.2,1.05],[1.05,.65]].forEach(([x,z])=>addMushroom(x,z,.95));
  [[-.85,-.9],[.75,-.9],[-.15,.15],[.88,.2],[-.72,.8],[.35,.72]].forEach(([x,z])=>addChicken(x,z,.92));
  [[-1.05,-.58],[-.35,.93],[.92,-.15],[.4,.25]].forEach(([x,z])=>addBasil(x,z,1));

  sets.black.forEach(m=>m.visible=false);
  sets.green.forEach(m=>m.visible=false);
  sets.mushroom.forEach(m=>m.visible=false);
  sets.chicken.forEach(m=>m.visible=false);
  sets.basil.forEach(m=>m.visible=false);

  const extraCheese = new THREE.Group();
  toppingRoot.add(extraCheese);
  for (let i=0;i<24;i+=1){
    const r=0.1+rnd()*1.6,a=rnd()*Math.PI*2;
    const blob=mesh(new THREE.SphereGeometry(.075+rnd()*.07,16,10),mat.cheese,extraCheese);
    blob.position.set(Math.cos(a)*r,.08,Math.sin(a)*r);blob.scale.y=.35;
    sets.cheese.push(blob);
  }
  extraCheese.visible=false;

  const glowDisc = mesh(new THREE.CircleGeometry(2.8, 96), new THREE.MeshBasicMaterial({ color: 0xc8492f, transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }), group);
  glowDisc.rotation.x = -Math.PI / 2;
  glowDisc.position.y = -0.42;

  group.userData = { sets, extraCheese, toppingRoot, cheese, sauce, glowDisc };
  return group;
}

const pizza = createPizza();

function createDetachedIngredients() {
  const group = new THREE.Group();
  world.add(group);
  const pieces = [];
  const rnd = seeded(77);
  const geometries = [
    new THREE.CylinderGeometry(0.18,0.19,0.04,28),
    new THREE.TorusGeometry(0.11,0.038,10,22),
    new THREE.DodecahedronGeometry(0.15,1),
    new THREE.SphereGeometry(0.14,14,10),
    new THREE.CircleGeometry(0.16,16),
  ];
  const materials = [mat.pepperoni,mat.blackOlive,mat.chicken,mat.mushroom,mat.basil];
  for(let i=0;i<54;i+=1){
    const type=i%5;
    const m=mesh(geometries[type],materials[type],group);
    const angle=rnd()*Math.PI*2;
    m.userData={angle,phase:rnd()*Math.PI*2,radius:2.3+rnd()*2.2,type};
    if(type===0 || type===1) m.rotation.x=Math.PI/2;
    if(type===4){m.rotation.x=-Math.PI/2;m.scale.set(1.5,.72,1);}
    pieces.push(m);
  }
  group.visible=false;
  return {group,pieces};
}
const detached = createDetachedIngredients();

function createSauceRibbon(){
  const points=[];
  for(let i=0;i<130;i+=1){
    const t=i/129;
    const angle=t*Math.PI*9.5;
    const r=.12+t*1.65;
    points.push(new THREE.Vector3(Math.cos(angle)*r,.48+t*.05,Math.sin(angle)*r));
  }
  const curve=new THREE.CatmullRomCurve3(points);
  const geo=new THREE.TubeGeometry(curve,260,.045,10,false);
  const m=new THREE.MeshPhysicalMaterial({color:0xa72a1d,roughness:.38,clearcoat:.38,clearcoatRoughness:.28,transparent:true,opacity:0,envMapIntensity:.8});
  const tube=mesh(geo,m,world);tube.visible=false;return tube;
}
const sauceRibbon=createSauceRibbon();

function createPortalRings(){
  const g=new THREE.Group();world.add(g);const rings=[];
  [2.75,3.25,3.8].forEach((r,i)=>{const ring=mesh(new THREE.TorusGeometry(r,.018+i*.008,10,140),mat.portal.clone(),g);ring.rotation.x=Math.PI/2;ring.userData.base=r;rings.push(ring);});
  g.visible=false;return {group:g,rings};
}
const portals=createPortalRings();

function makeRadialSprite(color){
  const tex=canvasTexture((ctx,s)=>{const gr=ctx.createRadialGradient(s/2,s/2,0,s/2,s/2,s/2);gr.addColorStop(0,color);gr.addColorStop(.3,color.replace('1)','0.42)'));gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,s,s);},256);
  const sm=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.45});
  return new THREE.Sprite(sm);
}
const warmGlow=makeRadialSprite('rgba(255,157,73,1)');warmGlow.position.set(3,1,-5);warmGlow.scale.set(10,10,1);scene.add(warmGlow);
const redGlow=makeRadialSprite('rgba(181,39,26,1)');redGlow.position.set(-4,1,-3);redGlow.scale.set(8,8,1);scene.add(redGlow);

function createParticles(count,color,size,spread){
  const rnd=seeded(count*17);const arr=new Float32Array(count*3);const phase=new Float32Array(count);
  for(let i=0;i<count;i++){arr[i*3]=(rnd()-.5)*spread[0];arr[i*3+1]=(rnd()-.5)*spread[1];arr[i*3+2]=(rnd()-.5)*spread[2];phase[i]=rnd()*Math.PI*2;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(arr,3));
  const material=new THREE.PointsMaterial({color,size,transparent:true,opacity:.35,depthWrite:false,blending:THREE.AdditiveBlending,sizeAttenuation:true});
  const points=new THREE.Points(geo,material);points.userData.phase=phase;world.add(points);return points;
}
const flour=createParticles(innerWidth<760?100:230,0xf3e2c8,.022,[12,7,8]);
const embers=createParticles(innerWidth<760?80:180,0xff6a2a,.035,[7,4,4]);embers.material.opacity=0;embers.position.z=-3.8;

function createOven(){
  const g=new THREE.Group();world.add(g);g.visible=false;
  const back=mesh(new THREE.BoxGeometry(7.4,5.2,.3),mat.brick,g);back.position.set(0,.55,-4.4);
  const floor=mesh(new THREE.BoxGeometry(7.6,.22,8.5),mat.darkStone,g);floor.position.set(0,-1.5,-1.2);
  const left=mesh(new THREE.BoxGeometry(.45,4.8,8.5),mat.brick,g);left.position.set(-3.6,.45,-1.15);
  const right=left.clone();right.position.x=3.6;g.add(right);
  const top=mesh(new THREE.BoxGeometry(7.6,.4,8.5),mat.brick,g);top.position.set(0,2.65,-1.15);
  const mouth=new THREE.Group();g.add(mouth);
  for(let i=0;i<17;i++){
    const a=Math.PI*(i/16);const x=Math.cos(a)*3.35;const y=-1.15+Math.sin(a)*3.3;
    const b=mesh(new THREE.BoxGeometry(.52,.44,.5),i%2?mat.brick:mat.brick.clone(),mouth);b.position.set(x,y,0);b.rotation.z=a-Math.PI/2;
  }
  const fire=makeRadialSprite('rgba(255,87,28,1)');fire.position.set(0,-.7,-4.0);fire.scale.set(6,4,1);fire.material.opacity=.8;g.add(fire);
  const hot=makeRadialSprite('rgba(255,190,84,1)');hot.position.set(0,-.25,-3.8);hot.scale.set(3.4,2.6,1);hot.material.opacity=.45;g.add(hot);
  g.userData={fire,hot};return g;
}
const oven=createOven();

function createBox(){
  const g=new THREE.Group();world.add(g);g.visible=false;
  const base=mesh(new THREE.BoxGeometry(5.15,.28,5.15),mat.paper,g);base.position.y=-.75;
  const lipMat=mat.paper.clone();lipMat.color.setHex(0xb47f47);
  [[0,-.48,-2.48,5.15,.55,.22],[0,-.48,2.48,5.15,.55,.22],[-2.48,-.48,0,.22,.55,5.15],[2.48,-.48,0,.22,.55,5.15]].forEach(([x,y,z,sx,sy,sz])=>{const b=mesh(new THREE.BoxGeometry(sx,sy,sz),lipMat,g);b.position.set(x,y,z);});
  const lid=mesh(new THREE.BoxGeometry(5.15,.18,5.15),mat.paper,g);lid.position.set(0,1.6,-2.3);lid.rotation.x=-1.05;
  const logoTex=canvasTexture((ctx,s)=>{ctx.clearRect(0,0,s,s);ctx.translate(s/2,s/2);ctx.rotate(-.08);ctx.textAlign='center';ctx.fillStyle='#78180f';ctx.font='900 110px Georgia';ctx.fillText('PIZZA',0,-18);ctx.font='900 142px Impact';ctx.fillText('BROS',0,112);ctx.strokeStyle='rgba(120,24,15,.6)';ctx.lineWidth=8;ctx.beginPath();ctx.arc(0,30,200,0,Math.PI*2);ctx.stroke();});
  const logo=mesh(new THREE.PlaneGeometry(3.3,3.3),new THREE.MeshBasicMaterial({map:logoTex,transparent:true,depthWrite:false}),g);logo.position.set(0,1.71,-2.3);logo.rotation.x=-1.05;logo.rotation.z=.02;
  g.userData={lid,logo};return g;
}
const box=createBox();

const ground=mesh(new THREE.CircleGeometry(9,128),new THREE.MeshPhysicalMaterial({color:0x12100d,roughness:.88,metalness:.04,envMapIntensity:.28}),world);
ground.rotation.x=-Math.PI/2;ground.position.y=-1.76;ground.castShadow=false;ground.receiveShadow=true;

let mascot=null;
let mascotWrap=new THREE.Group();
world.add(mascotWrap);
let mixer=null;
let headNode=null;
let actions={};
let currentAction='';

function setAction(name, fade=.28, once=false){
  if(!actions[name] || currentAction===name) return;
  const next=actions[name];
  const prev=actions[currentAction];
  next.enabled=true;
  next.reset();
  next.setEffectiveTimeScale(1);
  next.setEffectiveWeight(1);
  next.setLoop(once?THREE.LoopOnce:THREE.LoopRepeat, once?1:Infinity);
  next.clampWhenFinished=once;
  if(prev) prev.crossFadeTo(next,fade,false); else next.fadeIn(fade);
  next.play();
  currentAction=name;
}

const loadingManager=new THREE.LoadingManager();
loadingManager.onProgress=(_url,loaded,total)=>{
  const pct=Math.round((loaded/Math.max(total,1))*100);
  loadFill.style.transform=`scaleX(${pct/100})`;
  loadCopy.textContent=`WARMING THE WORLD ${pct}%`;
};
loadingManager.onError=(url)=>{console.warn('Asset load failed',url);};
const gltfLoader=new GLTFLoader(loadingManager);

function loadMascot(url,fallback=true){
  gltfLoader.load(url,(gltf)=>{
  mascot=gltf.scene;
  mascotWrap.add(mascot);
  const box3=new THREE.Box3().setFromObject(mascot);
  const size=box3.getSize(new THREE.Vector3());
  const scale=4.7/Math.max(size.y,.001);
  mascot.scale.setScalar(scale);
  box3.setFromObject(mascot);
  const center=box3.getCenter(new THREE.Vector3());
  mascot.position.x-=center.x;
  mascot.position.z-=center.z;
  mascot.position.y-=box3.min.y;
  mascot.traverse((obj)=>{
    if(obj.isMesh){
      obj.frustumCulled=false;
      obj.castShadow=true;
      obj.receiveShadow=true;
      const mats=Array.isArray(obj.material)?obj.material:[obj.material];
      mats.forEach((m)=>{
        if(!m) return;
        if(m.map){m.map.colorSpace=THREE.SRGBColorSpace;m.map.anisotropy=maxAniso;}
        if('roughness' in m) m.roughness=Math.max(.5,m.roughness ?? .6);
        if('metalness' in m) m.metalness=0;
        if('envMapIntensity' in m) m.envMapIntensity=.92;
        if('emissiveIntensity' in m) m.emissiveIntensity=.16;
        m.needsUpdate=true;
      });
    }
  });
  mixer=new THREE.AnimationMixer(mascot);
  gltf.animations.forEach((clip)=>{actions[clip.name]=mixer.clipAction(clip);});
  setAction(actions['rig|idle_motion']?'rig|idle_motion':Object.keys(actions)[0],.01,false);
  headNode=mascot.getObjectByName('head.x_0128') || mascot.getObjectByName('c_head.x_0127');
  loaderEl.classList.add('is-ready');
  setTimeout(()=>loaderEl.classList.add('is-done'),700);
  },undefined,(error)=>{
    console.error(error);
    if(fallback && url !== '/assets/mascot/mascot.gltf'){
      loadCopy.textContent='LOADING MASCOT FALLBACK';
      loadMascot('/assets/mascot/mascot.gltf',false);
      return;
    }
    loadCopy.textContent='MASCOT COULD NOT LOAD';
    setTimeout(()=>loaderEl.classList.add('is-done'),1100);
  });
}
loadMascot('/assets/mascot/pizza-bros-mascot.glb',true);

const pointer={x:0,y:0,tx:0,ty:0,lastX:0,lastY:0,speed:0};
addEventListener('pointermove',(e)=>{
  pointer.tx=(e.clientX/innerWidth)*2-1;
  pointer.ty=-(e.clientY/innerHeight)*2+1;
  const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;
  pointer.speed=Math.min(1,Math.hypot(dx,dy)/90);
  pointer.lastX=e.clientX;pointer.lastY=e.clientY;
},{passive:true});

function startMusic(showToast=true){
  if(!soundtrack.paused) return;
  soundtrack.volume=0;
  soundtrack.play().then(()=>{
    soundToggle.classList.remove('is-muted');
    soundToggle.setAttribute('aria-pressed','true');
    soundToggle.setAttribute('aria-label','Turn soundtrack off');
    soundLabel.textContent='Sound on';
    const start=performance.now();
    const fade=(now)=>{const t=clamp((now-start)/1100,0,1);soundtrack.volume=.34*t;if(t<1)requestAnimationFrame(fade);};
    requestAnimationFrame(fade);
    if(showToast){musicToast.classList.add('show');setTimeout(()=>musicToast.classList.remove('show'),1600);}
  }).catch(()=>{});
}
function stopMusic(){
  soundtrack.pause();
  soundToggle.classList.add('is-muted');
  soundToggle.setAttribute('aria-pressed','false');
  soundToggle.setAttribute('aria-label','Turn soundtrack on');
  soundLabel.textContent='Sound off';
}
soundToggle.addEventListener('click',()=>soundtrack.paused?startMusic(false):stopMusic());
const firstGesture=()=>{startMusic(true);removeEventListener('pointerdown',firstGesture);removeEventListener('keydown',firstGesture);removeEventListener('touchstart',firstGesture);};
addEventListener('pointerdown',firstGesture,{passive:true});
addEventListener('keydown',firstGesture,{passive:true});
addEventListener('touchstart',firstGesture,{passive:true});
soundtrack.play().then(()=>{soundtrack.volume=.26;soundToggle.classList.remove('is-muted');soundToggle.setAttribute('aria-pressed','true');soundLabel.textContent='Sound on';}).catch(()=>{});

menuButton.addEventListener('click',()=>{
  const open=!mobilePanel.classList.contains('open');
  mobilePanel.classList.toggle('open',open);
  mobilePanel.setAttribute('aria-hidden',String(!open));
  menuButton.setAttribute('aria-expanded',String(open));
});
$$('#mobilePanel a').forEach(a=>a.addEventListener('click',()=>{mobilePanel.classList.remove('open');mobilePanel.setAttribute('aria-hidden','true');menuButton.setAttribute('aria-expanded','false');}));

const flavorData={
  pepperoni:{description:'Deep tomato, curled pepperoni, blistered cheese and a toasted edge.',finish:'Tomato and chilli oil',mood:'Classic chaos',color:0xdf4935},
  bbq:{description:'Smoky chicken, caramel depth, cheese gloss and a darker fire finished edge.',finish:'Smoky glaze',mood:'Deep and loud',color:0xd27a3d},
  garden:{description:'Mushroom, olives, basil and green heat against a bright tomato base.',finish:'Basil and chilli',mood:'Fresh fire',color:0x5d7b52},
  cheese:{description:'Four cheese energy with molten pockets, toasted bubbles and a clean stone crust.',finish:'Cheese and black pepper',mood:'Maximum melt',color:0xe4b85c}
};
let activeFlavor='pepperoni';
let flavorKick=0;
let ingredientKick=0;
const selected=new Set();

function setVisible(list,visible){list.forEach(o=>o.visible=visible);}
function applyFlavor(name){
  activeFlavor=name;
  const s=pizza.userData.sets;
  setVisible(s.pepperoni,name==='pepperoni');
  setVisible(s.chicken,name==='bbq');
  setVisible(s.black,name==='garden');
  setVisible(s.green,name==='garden');
  setVisible(s.mushroom,name==='garden');
  setVisible(s.basil,name==='garden');
  pizza.userData.extraCheese.visible=name==='cheese' || selected.has('Extra Cheese');
  mat.cheese.color.setHex(name==='cheese'?0xffd98c:name==='garden'?0xf2c264:0xffd372);
  redRim.color.setHex(flavorData[name].color);
  $('#flavorDescription').textContent=flavorData[name].description;
  $('#flavorFinish').textContent=flavorData[name].finish;
  $('#flavorMood').textContent=flavorData[name].mood;
  $('#orderSummary').textContent=`${$('.flavor-button.active strong')?.textContent || 'Classic Pepperoni'}. Fresh out of the fire.`;
  flavorKick=1;
}
$$('.flavor-button').forEach(btn=>btn.addEventListener('click',()=>{
  $$('.flavor-button').forEach(b=>{b.classList.toggle('active',b===btn);b.setAttribute('aria-pressed',String(b===btn));});
  applyFlavor(btn.dataset.flavor);
}));

function syncCustom(){
  const s=pizza.userData.sets;
  const baseGarden=activeFlavor==='garden';
  setVisible(s.black,baseGarden||selected.has('Black Olives'));
  setVisible(s.green,baseGarden||selected.has('Green Olives'));
  setVisible(s.mushroom,baseGarden||selected.has('Mushrooms'));
  setVisible(s.chicken,activeFlavor==='bbq'||selected.has('Extra Meat'));
  setVisible(s.basil,baseGarden||selected.has('Basil'));
  pizza.userData.extraCheese.visible=activeFlavor==='cheese'||selected.has('Extra Cheese');
  $('#selectedToppings').textContent=selected.size?[...selected].join(' · ').toUpperCase():'KEEPING IT CLASSIC';
  ingredientKick=1;
}
$$('.topping-grid button').forEach(btn=>btn.addEventListener('click',()=>{
  const name=btn.dataset.topping;
  if(selected.has(name)) selected.delete(name); else selected.add(name);
  const on=selected.has(name);btn.classList.toggle('active',on);btn.setAttribute('aria-pressed',String(on));syncCustom();
}));

let qty=1;
function setQty(v){qty=clamp(v,1,9);$('#qty').textContent=qty;}
$('#minus').addEventListener('click',()=>setQty(qty-1));
$('#plus').addEventListener('click',()=>setQty(qty+1));
$('#orderButton').addEventListener('click',()=>{
  const label=$('.flavor-button.active strong')?.textContent || 'CLASSIC PEPPERONI';
  const extras=selected.size?` with ${[...selected].join(', ')}`:'';
  $('#orderNote').textContent=`${qty} × ${label}${extras}. Good choice.`;
  $('#orderButton').textContent='ADDED TO ORDER ✓';
  setTimeout(()=>{$('#orderButton').textContent='ORDER NOW →';},2200);
});
applyFlavor('pepperoni');

const cameraStates={
  hero:{p:[0.15,1.35,9.45],t:[.55,.72,0],f:38},
  prep:{p:[0,6.1,1.35],t:[0,-.15,0],f:37},
  orbit:{p:[5.05,3.25,5.05],t:[0,-.05,0],f:41},
  oven:{p:[0,1.0,5.3],t:[0,.4,-2.1],f:46},
  product:{p:[4.45,3.05,5.2],t:[.45,-.05,0],f:39},
  custom:{p:[0.15,6.35,3.35],t:[0,-.62,0],f:31},
  final:{p:[-.25,7.2,2.55],t:[0,-.82,0],f:34}
};
const camPos=new THREE.Vector3(),camTarget=new THREE.Vector3();
function blendCamera(a,b,t){mixV3(a.p,b.p,t,camPos);mixV3(a.t,b.t,t,camTarget);camera.position.copy(camPos);camera.fov=lerp(a.f,b.f,t);camera.updateProjectionMatrix();camera.lookAt(camTarget);}

function updateCamera(p){
  if(p<.12) blendCamera(cameraStates.hero,cameraStates.prep,range(p,.055,.12));
  else if(p<.38) blendCamera(cameraStates.prep,cameraStates.prep,0);
  else if(p<.54) blendCamera(cameraStates.prep,cameraStates.orbit,range(p,.38,.5));
  else if(p<.68) blendCamera(cameraStates.orbit,cameraStates.oven,range(p,.54,.63));
  else if(p<.82) blendCamera(cameraStates.oven,cameraStates.product,range(p,.68,.76));
  else if(p<.93) blendCamera(cameraStates.product,cameraStates.custom,range(p,.82,.9));
  else blendCamera(cameraStates.custom,cameraStates.final,range(p,.93,1));
  if(innerWidth<760){camera.position.x*=.64;camera.position.z+=1.25;camera.fov+=2.8;camera.updateProjectionMatrix();camera.lookAt(camTarget.x*.4,camTarget.y,camTarget.z);}
  if(!reducedMotion){
    const orbitRoll=Math.sin(range(p,.33,.57)*Math.PI)*.023;
    const ovenRoll=Math.sin(range(p,.53,.70)*Math.PI)*-.015;
    camera.rotateZ((orbitRoll+ovenRoll)*(innerWidth<760?.45:1));
  }
}

function setTransform(obj,pos,rot,scale){obj.position.set(...pos);obj.rotation.set(...rot);obj.scale.setScalar(scale);}
function interpolateTransform(obj,a,b,t){obj.position.lerpVectors(new THREE.Vector3(...a.p),new THREE.Vector3(...b.p),t);obj.rotation.set(lerp(a.r[0],b.r[0],t),lerp(a.r[1],b.r[1],t),lerp(a.r[2],b.r[2],t));const s=lerp(a.s,b.s,t);obj.scale.setScalar(s);}

const mascotStates={
  off:{p:[3.2,-1.72,-1.55],r:[.03,-.82,.02],s:.72},
  glance:{p:[2.18,-1.69,.18],r:[.0,-.44,.015],s:.9},
  lean:{p:[1.72,-1.47,.16],r:[-.055,-.1,-.035],s:.98},
  present:{p:[1.92,-1.5,.03],r:[.02,-.28,.035],s:.96},
  release:{p:[3.15,-1.95,-1.65],r:[.08,-.84,.06],s:.7}
};
function updateMascot(p){
  if(!mascot) return;
  mascotWrap.visible=p<.145;
  if(!mascotWrap.visible) return;
  let a=mascotStates.off,b=mascotStates.glance,t=range(p,0,.018);
  if(p>=.018&&p<.045){a=mascotStates.glance;b=mascotStates.lean;t=range(p,.018,.045);}
  else if(p>=.045&&p<.082){a=mascotStates.lean;b=mascotStates.present;t=range(p,.045,.082);}
  else if(p>=.082){a=mascotStates.present;b=mascotStates.release;t=range(p,.082,.13);}
  interpolateTransform(mascotWrap,a,b,t);
  const pointerWeight=coarsePointer?0:1-range(p,.018,.09);
  mascotWrap.rotation.y+=pointer.x*.22*pointerWeight;
  mascotWrap.rotation.x+=-pointer.y*.075*pointerWeight;
  mascotWrap.position.x+=pointer.x*.18*pointerWeight;
  mascotWrap.position.y+=pointer.y*.06*pointerWeight;
  if(Object.keys(actions).length){
    if(p<.022) setAction('rig|idle_motion',.24,false);
    else if(p<.05) setAction('rig|walk',.24,false);
    else if(p<.086) setAction('rig|dash',.18,false);
    else setAction('rig|slide',.16,false);
  }
}

const pizzaStates={
  hand:{p:[.78,.28,1.08],r:[-.74,.28,-.055],s:.74},
  prep:{p:[0,-.62,.12],r:[0,.14,0],s:1.26},
  orbit:{p:[0,-.62,.08],r:[-.1,.5,.02],s:1.32},
  oven:{p:[0,-.62,-3.5],r:[-.3,1.12,0],s:1.0},
  beauty:{p:[1.05,-.62,.18],r:[-.38,.8,.035],s:1.34},
  custom:{p:[0,-.92,.15],r:[-.08,.03,0],s:1.72},
  boxed:{p:[0,-1.34,-.06],r:[0,0,0],s:.98}
};
function updatePizza(p,time){
  let a=pizzaStates.hand,b=pizzaStates.prep,t=range(p,.055,.12);
  if(p>=.12&&p<.38){a=pizzaStates.prep;b=pizzaStates.prep;t=0;}
  else if(p>=.38&&p<.54){a=pizzaStates.prep;b=pizzaStates.orbit;t=range(p,.38,.54);}
  else if(p>=.54&&p<.68){a=pizzaStates.orbit;b=pizzaStates.oven;t=range(p,.54,.68);}
  else if(p>=.68&&p<.82){a=pizzaStates.oven;b=pizzaStates.beauty;t=range(p,.68,.77);}
  else if(p>=.82&&p<.93){a=pizzaStates.beauty;b=pizzaStates.custom;t=range(p,.82,.9);}
  else if(p>=.93){a=pizzaStates.custom;b=pizzaStates.boxed;t=range(p,.93,1);}
  interpolateTransform(pizza,a,b,t);
  if(p>.68&&p<.82){pizza.rotation.y+=Math.sin(time*.00035)*.055+flavorKick*.18;pizza.position.y+=Math.sin(time*.0011)*.045;}
  pizza.userData.glowDisc.material.opacity=(p>.64&&p<.86)?0.045+Math.sin(time*.001)*.018:0;
}

function updateSauce(p,time){
  const t=range(p,.12,.25);
  sauceRibbon.visible=t>0.001&&p<.34;
  if(!sauceRibbon.visible) return;
  sauceRibbon.position.set(0,-.52,.12);
  sauceRibbon.rotation.y=-time*.00012;
  sauceRibbon.scale.setScalar(.08+.92*t);
  sauceRibbon.material.opacity=Math.sin(t*Math.PI)*.84;
}

function updateIngredients(p,time){
  const rain=range(p,.245,.38);
  const orbit=range(p,.38,.54);
  const custom=range(p,.82,.93);
  detached.group.visible=(p>.22&&p<.58)||(p>.81&&p<.94&&ingredientKick>.035);
  if(!detached.group.visible) return;
  detached.group.position.set(0,-.15,.05);
  detached.pieces.forEach((m,i)=>{
    const data=m.userData;
    let radius=data.radius;
    let y=3.8+(i%7)*.24;
    let angle=data.angle;
    if(p<.38){
      y=lerp(3.8+(i%7)*.24,.55+Math.sin(data.phase)*.7,rain);
      radius=lerp(3.8,data.radius*.56,rain);
      angle+=rain*1.4;
    }else if(p<.58){
      radius=lerp(3.2,1.4,orbit);
      angle+=orbit*Math.PI*2.5+time*.00016;
      y=.45+Math.sin(angle*2+data.phase)*.75*(1-orbit*.45);
    }else{
      radius=lerp(.85,1.35,custom);
      angle+=time*.00024+i*.03;
      y=lerp(.45,1.55,custom)+Math.sin(data.phase+time*.0012)*.12;
    }
    const bias=(p>.25&&p<.38&&!coarsePointer)?pointer.x*.16:0;
    m.position.set(Math.cos(angle+bias)*radius,y-ingredientKick*.5,Math.sin(angle+bias)*radius);
    m.rotation.x+=.008;m.rotation.y+=.012+i*.00004;m.rotation.z+=.006;
    const base=.7+(i%5)*.045;const kick=1+ingredientKick*.18;m.scale.setScalar(base*kick);
  });
}

function updatePortals(p,time){
  const t=range(p,.34,.45)*(1-range(p,.52,.6));
  rgbShift.uniforms.amount.value = reducedMotion ? 0 : t * 0.00075;
  rgbShift.uniforms.angle.value = time * 0.00009;
  portals.group.visible=t>.002;
  if(!portals.group.visible) return;
  portals.group.position.set(0,-.62,.12);
  portals.rings.forEach((ring,i)=>{
    ring.material.opacity=t*(.18-i*.035);
    ring.rotation.z=time*.0001*(i%2?1:-1)+i*.55;
    const s=1+Math.sin(time*.0008+i)*.04;
    ring.scale.setScalar(s);
  });
}

function updateOven(p,time){
  const approach=range(p,.54,.61);const engulf=range(p,.61,.68);const recede=range(p,.68,.74);
  oven.visible=p>.49&&p<.76;
  if(!oven.visible){ovenLight.intensity=0;embers.material.opacity=0;root.style.setProperty('--heat','0');return;}
  const hidden={p:[0,-.2,-9.5],s:.76},near={p:[0,-.15,-5.2],s:1.05},full={p:[0,-.08,-2.55],s:1.42},far={p:[0,-.6,-10.8],s:.68};
  let a=hidden,b=near,t=approach;if(p>=.61&&p<.68){a=near;b=full;t=engulf;}else if(p>=.68){a=full;b=far;t=recede;}
  oven.position.set(lerp(a.p[0],b.p[0],t),lerp(a.p[1],b.p[1],t),lerp(a.p[2],b.p[2],t));const s=lerp(a.s,b.s,t);oven.scale.setScalar(s);
  const heat=Math.sin(clamp(range(p,.52,.69),0,1)*Math.PI);
  if(!reducedMotion) rgbShift.uniforms.amount.value = Math.max(rgbShift.uniforms.amount.value, heat * 0.00058);
  ovenLight.intensity=heat*360;
  embers.material.opacity=heat*.8;
  embers.position.y=((time*.00045)%3.8)-1.9;
  oven.userData.fire.material.opacity=.62+heat*.32;
  oven.userData.hot.material.opacity=.28+heat*.52;
  bloom.strength=.42+heat*.42;
  renderer.toneMappingExposure=1.02-heat*.12;
  root.style.setProperty('--heat',heat.toFixed(3));
}

function updateBox(p){
  const t=range(p,.91,1);
  box.visible=p>.885;
  if(!box.visible) return;
  box.position.set(0,lerp(-4.8,-.78,t),lerp(-.7,-.2,t));
  box.rotation.set(-.03,lerp(.18,0,t),0);
  box.scale.setScalar(lerp(.78,1.05,t));
}

function updateAtmosphere(p,time){
  pointer.x=lerp(pointer.x,pointer.tx,.065);pointer.y=lerp(pointer.y,pointer.ty,.065);pointer.speed*=.92;
  flour.rotation.y=time*.000025;flour.position.y=Math.sin(time*.00018)*.25;
  flour.material.opacity=p<.56?lerp(.28,.12,range(p,.2,.56)):.03;
  warmGlow.material.opacity=.24+range(p,.52,.67)*.35;
  redGlow.material.opacity=.18+range(p,.32,.54)*.18;
  const foodStage=range(p,.16,.48)*(1-range(p,.52,.59));
  key.intensity=220+foodStage*65;
  redRim.intensity=155+range(p,.34,.56)*110;
  scene.fog.density=lerp(.045,.065,range(p,.53,.66));
}

function updateMascotHead(p){
  if(!headNode||p>.1||coarsePointer) return;
  headNode.rotation.y+=pointer.x*.24;
  headNode.rotation.x+=-pointer.y*.11;
}

function documentProgress(){
  const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  return clamp(scrollY/max,0,1);
}
let targetProgress=documentProgress();
let progress=targetProgress;
let prevProgress=progress;
let last=performance.now();

function updateDOM(p){
  root.style.setProperty('--progress',p.toFixed(4));
  document.body.dataset.chapter=String(Math.min(7,Math.floor(p*8)));
}

function frame(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  targetProgress=documentProgress();
  const response=reducedMotion?.22:.09;
  progress=lerp(progress,targetProgress,1-Math.pow(1-response,dt*60));
  flavorKick=Math.max(0,flavorKick-dt*2.6);
  ingredientKick=Math.max(0,ingredientKick-dt*3.1);
  if(mixer) mixer.update(dt);
  updateCamera(progress);
  updateMascot(progress);
  updateMascotHead(progress);
  updatePizza(progress,now);
  updateSauce(progress,now);
  updateIngredients(progress,now);
  updatePortals(progress,now);
  updateOven(progress,now);
  updateBox(progress);
  updateAtmosphere(progress,now);
  updateDOM(progress);
  prevProgress=progress;
  composer.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

function resize(){
  const dpr=Math.min(devicePixelRatio,innerWidth<760?1.35:1.75);
  renderer.setPixelRatio(dpr);renderer.setSize(innerWidth,innerHeight,false);
  composer.setPixelRatio(dpr);composer.setSize(innerWidth,innerHeight);
  camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();
}
addEventListener('resize',resize,{passive:true});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden){soundtrack.volume=Math.min(soundtrack.volume,.08);}else if(!soundtrack.paused){soundtrack.volume=.34;}
});