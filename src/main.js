(() => {
  'use strict';

  const app = document.querySelector('#app');
  app.innerHTML = `
    <div class="loader" id="loader" aria-live="polite">
      <div class="loader-glow"></div>
      <div class="loader-stamp"><span class="loader-crown">PB</span><strong>Pizza<br>Bros</strong></div>
      <div class="loader-ring"><span id="loaderPercent">0</span></div>
      <p>HEATING THE OVEN</p>
    </div>

    <header class="site-header">
      <a class="brand" href="#hero" aria-label="Pizza Bros home"><span class="brand-crown">PB</span><span>Pizza <b>Bros</b></span></a>
      <nav class="nav-links" aria-label="Main navigation">
        <a href="#hero">HOME</a><a href="#flavors">OUR PIZZAS</a><a href="#custom">BUILD YOUR OWN</a>
      </nav>
      <a class="nav-order" href="#order">ORDER NOW <span>></span></a>
      <button class="menu-button" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
    </header>
    <div class="chapter-progress" aria-hidden="true"><span id="progressFill"></span></div>
    <canvas id="world" aria-label="Interactive 3D Pizza Bros experience"></canvas>

    <main id="story">
      <section class="chapter hero" id="hero" data-chapter="0">
        <div class="copy hero-copy">
          <p class="eyebrow script">More Than Pizza</p>
          <h1>BUILT BY THE <span>BROS.</span><br>FINISHED BY <span>YOU.</span></h1>
          <p class="lede">Meet the Bro. Move your cursor and he moves with you. Then scroll and take the pizza through sauce, toppings, fire and the final box.</p>
          <div class="hero-actions">
            <a class="primary-cta" href="#flavors">EXPLORE OUR PIZZAS <span>></span></a>
            <a class="round-link" href="#sauce" aria-label="Watch the build">PLAY</a>
            <span class="watch-label">WATCH<br>THE BUILD</span>
          </div>
          <div class="trust-row"><span>FRESH INGREDIENTS</span><span>STONE BAKED</span><span>BUILT TO ORDER</span></div>
        </div>
        <div class="scroll-hint"><span>SCROLL</span><i></i></div>
      </section>

      <section class="chapter left" id="sauce" data-chapter="1">
        <div class="copy compact"><span class="chapter-number">01</span><p class="eyebrow">THE FIRST MOVE</p><h2>REAL SAUCE.<br><span>NO SHORTCUTS.</span></h2><p>Bright tomato, slow cooked depth, and enough attitude to cover every inch that matters.</p></div>
        <div class="side-word">SAUCE</div>
      </section>

      <section class="chapter right" id="cheese" data-chapter="2">
        <div class="copy compact"><span class="chapter-number">02</span><p class="eyebrow">LOAD IT UP</p><h2>CHEESE<br><span>IN MOTION.</span></h2><p>Mozzarella drops through the light and lands where it belongs. This is where the pizza starts looking dangerous.</p></div>
        <div class="side-word right-word">CHEESE</div>
      </section>

      <section class="chapter left" id="toppings" data-chapter="3">
        <div class="copy compact"><span class="chapter-number">03</span><p class="eyebrow">THE ORBIT</p><h2>EVERY TOPPING<br><span>EARNS ITS PLACE.</span></h2><p>Pepperoni, olives, mushrooms, peppers and basil. Nothing random. Everything lands with purpose.</p></div>
        <div class="orbit-labels" aria-hidden="true"><span>PEPPERONI</span><span>BASIL</span><span>OLIVES</span><span>MUSHROOM</span></div>
      </section>

      <section class="chapter oven-copy" id="oven" data-chapter="4">
        <div class="copy centered"><span class="chapter-number">04</span><p class="eyebrow">450 C OF GOOD DECISIONS</p><h2>THIS IS WHERE IT<br><span>BECOMES PIZZA BROS.</span></h2><p>Heat. Char. Melt. A few seconds where everything changes.</p></div>
        <div class="heat-meter" aria-hidden="true"><span></span></div>
      </section>

      <section class="chapter flavors" id="flavors" data-chapter="5">
        <div class="copy product-copy"><span class="chapter-number">05</span><p class="eyebrow">OUR SIGNATURES</p><h2>PICK YOUR<br><span>BRO.</span></h2><p id="flavorDescription">Classic pepperoni, real cheese, blistered crust. No introduction needed.</p>
          <div class="flavor-chips" role="group" aria-label="Pizza flavors">
            <button class="flavor active" data-flavor="pepperoni" aria-pressed="true"><b>01</b> CLASSIC PEPPERONI</button>
            <button class="flavor" data-flavor="bbq" aria-pressed="false"><b>02</b> SMOKY BBQ CHICKEN</button>
            <button class="flavor" data-flavor="garden" aria-pressed="false"><b>03</b> GARDEN HEAT</button>
            <button class="flavor" data-flavor="cheese" aria-pressed="false"><b>04</b> FOUR CHEESE</button>
          </div>
          <a class="primary-cta small" href="#custom">MAKE IT YOURS <span>></span></a>
        </div>
        <div class="flavor-name" id="flavorName" aria-hidden="true">PEPPERONI</div>
      </section>

      <section class="chapter custom" id="custom" data-chapter="6">
        <div class="copy custom-copy"><span class="chapter-number">06</span><p class="eyebrow">YOUR PIZZA. YOUR RULES.</p><h2>BUILD YOUR<br><span>OWN.</span></h2><p>Tap your extras. Every choice changes the live 3D pizza.</p>
          <div class="topping-grid" role="group" aria-label="Extra toppings">
            <button data-topping="Black Olives" data-extra="black" aria-pressed="false">BLACK OLIVES</button>
            <button data-topping="Green Olives" data-extra="green" aria-pressed="false">GREEN OLIVES</button>
            <button data-topping="Mushrooms" data-extra="mushroom" aria-pressed="false">MUSHROOMS</button>
            <button data-topping="Extra Meat" data-extra="meat" aria-pressed="false">EXTRA MEAT</button>
            <button data-topping="Extra Cheese" data-extra="cheese" aria-pressed="false">EXTRA CHEESE</button>
          </div>
          <div class="selected-line"><span>ON YOUR PIE</span><strong id="selectedToppings">KEEPING IT CLASSIC</strong></div>
          <a class="primary-cta small" href="#order">BOX THIS ONE <span>></span></a>
        </div>
      </section>

      <section class="chapter order" id="order" data-chapter="7">
        <div class="copy order-copy"><span class="chapter-number">07</span><p class="eyebrow">GOOD CALL.</p><h2>YOUR PIZZA<br><span>IS READY.</span></h2><p id="orderSummary">Classic Pepperoni. Fresh out of the oven.</p>
          <div class="order-controls">
            <div class="quantity" aria-label="Quantity selector"><button id="minus" aria-label="Decrease quantity">-</button><span id="qty" aria-live="polite">1</span><button id="plus" aria-label="Increase quantity">+</button></div>
            <button class="primary-cta button-cta" id="orderButton">ORDER NOW <span>></span></button>
          </div>
          <p class="order-note" id="orderNote">Choose your quantity and your Bro is ready.</p>
        </div>
        <footer class="footer"><span>PIZZA BROS</span><span>GOOD PIZZA. GREATER PEOPLE.</span><a href="#hero">BACK TO TOP ^</a></footer>
      </section>
    </main>
    <div class="mobile-panel" aria-hidden="true"><a href="#hero">HOME</a><a href="#flavors">OUR PIZZAS</a><a href="#custom">BUILD YOUR OWN</a><a href="#order">ORDER NOW</a></div>
    <div class="webgl-warning">This browser could not start WebGL2. Pizza Bros needs a modern browser with hardware acceleration enabled.</div>
  `;

  const canvas = document.querySelector('#world');
  const gl = canvas.getContext('webgl2', { antialias: true, alpha: false, powerPreference: 'high-performance' });
  if (!gl) {
    document.querySelector('.webgl-warning').style.display = 'block';
    document.querySelector('#loader').classList.add('is-done');
    return;
  }

  const VERTEX = `#version 300 es
  precision highp float;
  in vec3 aPosition;
  in vec3 aNormal;
  uniform mat4 uMVP;
  uniform mat4 uModel;
  out vec3 vNormal;
  out vec3 vWorld;
  void main(){
    vec4 world = uModel * vec4(aPosition, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(uModel) * aNormal);
    gl_Position = uMVP * vec4(aPosition, 1.0);
  }`;

  const FRAGMENT = `#version 300 es
  precision highp float;
  in vec3 vNormal;
  in vec3 vWorld;
  uniform vec3 uColor;
  uniform vec3 uEmissive;
  uniform vec3 uCamera;
  uniform vec3 uLightDir;
  uniform vec3 uLightColor;
  uniform vec3 uRimColor;
  uniform vec3 uFogColor;
  uniform float uFogDensity;
  uniform float uGloss;
  uniform float uOpacity;
  out vec4 outColor;
  void main(){
    vec3 N = normalize(vNormal);
    vec3 V = normalize(uCamera - vWorld);
    vec3 L = normalize(-uLightDir);
    float ndl = max(dot(N,L),0.0);
    vec3 H = normalize(L+V);
    float spec = pow(max(dot(N,H),0.0), mix(18.0,96.0,uGloss)) * mix(.08,.7,uGloss);
    float rim = pow(1.0-max(dot(N,V),0.0), 2.6);
    float up = max(N.y*.5+.5,0.0);
    vec3 lit = uColor * (.24 + ndl*.68 + up*.13) * uLightColor;
    lit += vec3(spec);
    lit += uRimColor * rim * .28;
    lit += uEmissive;
    float dist = length(vWorld-uCamera);
    float fog = 1.0-exp(-uFogDensity*uFogDensity*dist*dist);
    vec3 finalColor = mix(lit,uFogColor,clamp(fog,0.0,.92));
    outColor = vec4(finalColor,uOpacity);
  }`;

  function makeShader(type, source){
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }
  function makeProgram(vs, fs){
    const p = gl.createProgram(); gl.attachShader(p, makeShader(gl.VERTEX_SHADER,vs)); gl.attachShader(p, makeShader(gl.FRAGMENT_SHADER,fs)); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    return p;
  }
  const program = makeProgram(VERTEX, FRAGMENT);
  gl.useProgram(program);
  const attrib = { pos: gl.getAttribLocation(program,'aPosition'), normal: gl.getAttribLocation(program,'aNormal') };
  const uni = {
    mvp: gl.getUniformLocation(program,'uMVP'), model: gl.getUniformLocation(program,'uModel'), color: gl.getUniformLocation(program,'uColor'),
    emissive: gl.getUniformLocation(program,'uEmissive'), camera: gl.getUniformLocation(program,'uCamera'), lightDir: gl.getUniformLocation(program,'uLightDir'),
    lightColor: gl.getUniformLocation(program,'uLightColor'), rimColor: gl.getUniformLocation(program,'uRimColor'), fogColor: gl.getUniformLocation(program,'uFogColor'),
    fogDensity: gl.getUniformLocation(program,'uFogDensity'), gloss: gl.getUniformLocation(program,'uGloss'), opacity: gl.getUniformLocation(program,'uOpacity')
  };

  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.enable(gl.CULL_FACE); gl.cullFace(gl.BACK);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  const M = {
    identity(){ return [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]; },
    multiply(a,b){
      const out = new Array(16).fill(0);
      for(let c=0;c<4;c++) for(let r=0;r<4;r++) out[c*4+r] = a[0*4+r]*b[c*4+0]+a[1*4+r]*b[c*4+1]+a[2*4+r]*b[c*4+2]+a[3*4+r]*b[c*4+3];
      return out;
    },
    translate(x,y,z){ return [1,0,0,0, 0,1,0,0, 0,0,1,0, x,y,z,1]; },
    scale(x,y,z){ return [x,0,0,0, 0,y,0,0, 0,0,z,0, 0,0,0,1]; },
    rx(a){ const c=Math.cos(a),s=Math.sin(a); return [1,0,0,0, 0,c,s,0, 0,-s,c,0, 0,0,0,1]; },
    ry(a){ const c=Math.cos(a),s=Math.sin(a); return [c,0,-s,0, 0,1,0,0, s,0,c,0, 0,0,0,1]; },
    rz(a){ const c=Math.cos(a),s=Math.sin(a); return [c,s,0,0, -s,c,0,0, 0,0,1,0, 0,0,0,1]; },
    perspective(fov,aspect,near,far){ const f=1/Math.tan(fov/2), nf=1/(near-far); return [f/aspect,0,0,0, 0,f,0,0, 0,0,(far+near)*nf,-1, 0,0,2*far*near*nf,0]; },
    lookAt(eye,center,up=[0,1,0]){
      let zx=eye[0]-center[0],zy=eye[1]-center[1],zz=eye[2]-center[2]; let zl=Math.hypot(zx,zy,zz)||1; zx/=zl;zy/=zl;zz/=zl;
      let xx=up[1]*zz-up[2]*zy,xy=up[2]*zx-up[0]*zz,xz=up[0]*zy-up[1]*zx; let xl=Math.hypot(xx,xy,xz)||1; xx/=xl;xy/=xl;xz/=xl;
      let yx=zy*xz-zz*xy, yy=zz*xx-zx*xz, yz=zx*xy-zy*xx;
      return [xx,yx,zx,0, xy,yy,zy,0, xz,yz,zz,0, -(xx*eye[0]+xy*eye[1]+xz*eye[2]),-(yx*eye[0]+yy*eye[1]+yz*eye[2]),-(zx*eye[0]+zy*eye[1]+zz*eye[2]),1];
    },
    compose(p,r,s){
      let m=M.translate(p[0],p[1],p[2]); m=M.multiply(m,M.rz(r[2])); m=M.multiply(m,M.ry(r[1])); m=M.multiply(m,M.rx(r[0])); return M.multiply(m,M.scale(s[0],s[1],s[2]));
    }
  };

  const hex = v => [((v>>16)&255)/255,((v>>8)&255)/255,(v&255)/255];
  const materials = {
    skin:{color:hex(0xf3b27e),emissive:[0,0,0],gloss:.26,opacity:1},
    skinDark:{color:hex(0xd98b5c),emissive:[0,0,0],gloss:.2,opacity:1},
    white:{color:hex(0xf5ead6),emissive:[0,0,0],gloss:.2,opacity:1},
    red:{color:hex(0xd9362d),emissive:[.025,.002,.001],gloss:.32,opacity:1},
    redDark:{color:hex(0x8f1915),emissive:[0,0,0],gloss:.2,opacity:1},
    dark:{color:hex(0x1b1210),emissive:[0,0,0],gloss:.16,opacity:1},
    black:{color:hex(0x120c0b),emissive:[0,0,0],gloss:.36,opacity:1},
    cheese:{color:hex(0xf2b84b),emissive:[.018,.008,0],gloss:.5,opacity:1},
    cheese2:{color:hex(0xffd96e),emissive:[.018,.01,0],gloss:.52,opacity:1},
    crust:{color:hex(0xd98c42),emissive:[.012,.004,0],gloss:.25,opacity:1},
    sauce:{color:hex(0xad241d),emissive:[.015,0,0],gloss:.48,opacity:1},
    pepperoni:{color:hex(0xa82720),emissive:[.008,0,0],gloss:.38,opacity:1},
    pepperoniEdge:{color:hex(0x6f1410),emissive:[0,0,0],gloss:.28,opacity:1},
    olive:{color:hex(0x17130f),emissive:[0,0,0],gloss:.45,opacity:1},
    green:{color:hex(0x4d7e3f),emissive:[0,.005,0],gloss:.24,opacity:1},
    green2:{color:hex(0x77a95a),emissive:[0,.008,0],gloss:.22,opacity:1},
    mushroom:{color:hex(0xd4b48c),emissive:[0,0,0],gloss:.2,opacity:1},
    brown:{color:hex(0x7a4c2a),emissive:[0,0,0],gloss:.22,opacity:1},
    brick:{color:hex(0x54261e),emissive:[0,0,0],gloss:.08,opacity:1},
    brick2:{color:hex(0x74352a),emissive:[0,0,0],gloss:.08,opacity:1},
    ember:{color:hex(0xff6a24),emissive:[.75,.13,.01],gloss:.4,opacity:1},
    creamBox:{color:hex(0xd5b78d),emissive:[0,0,0],gloss:.1,opacity:1},
    cardboard:{color:hex(0xa67649),emissive:[0,0,0],gloss:.08,opacity:1}
  };

  function geometry(positions,normals,indices){
    const vao=gl.createVertexArray(); gl.bindVertexArray(vao);
    const pb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,pb); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(positions),gl.STATIC_DRAW); gl.enableVertexAttribArray(attrib.pos); gl.vertexAttribPointer(attrib.pos,3,gl.FLOAT,false,0,0);
    const nb=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,nb); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(normals),gl.STATIC_DRAW); gl.enableVertexAttribArray(attrib.normal); gl.vertexAttribPointer(attrib.normal,3,gl.FLOAT,false,0,0);
    const ib=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,new Uint32Array(indices),gl.STATIC_DRAW);
    gl.bindVertexArray(null); return {vao,count:indices.length};
  }

  function sphereGeom(seg=30,rings=20){
    const p=[],n=[],i=[];
    for(let y=0;y<=rings;y++){ const v=y/rings,phi=v*Math.PI; for(let x=0;x<=seg;x++){ const u=x/seg,th=u*Math.PI*2; const sx=Math.sin(phi)*Math.cos(th), sy=Math.cos(phi), sz=Math.sin(phi)*Math.sin(th); p.push(sx,sy,sz);n.push(sx,sy,sz); } }
    for(let y=0;y<rings;y++) for(let x=0;x<seg;x++){ const a=y*(seg+1)+x,b=a+seg+1; i.push(a,b,a+1,b,b+1,a+1); }
    return geometry(p,n,i);
  }
  function cylinderGeom(radTop=1,radBottom=1,height=1,seg=32){
    const p=[],n=[],i=[]; const h=height/2;
    for(let y=0;y<=1;y++){ const r=y?radTop:radBottom, py=y?h:-h; for(let s=0;s<=seg;s++){ const a=s/seg*Math.PI*2,c=Math.cos(a),z=Math.sin(a); p.push(c*r,py,z*r); n.push(c,0,z); } }
    for(let s=0;s<seg;s++){ const a=s,b=s+seg+1;i.push(a,b,a+1,b,b+1,a+1); }
    const addCap=(top)=>{ const base=p.length/3, py=top?h:-h, norm=top?1:-1; p.push(0,py,0);n.push(0,norm,0); for(let s=0;s<=seg;s++){const a=s/seg*Math.PI*2,c=Math.cos(a),z=Math.sin(a),r=top?radTop:radBottom;p.push(c*r,py,z*r);n.push(0,norm,0);} for(let s=0;s<seg;s++){const c=base,a=base+1+s,b=base+2+s; top?i.push(c,a,b):i.push(c,b,a);} };
    addCap(true);addCap(false);return geometry(p,n,i);
  }
  function torusGeom(R=1,r=.25,seg=44,tube=16){
    const p=[],n=[],i=[];
    for(let a=0;a<=seg;a++){const u=a/seg*Math.PI*2,cu=Math.cos(u),su=Math.sin(u);for(let b=0;b<=tube;b++){const v=b/tube*Math.PI*2,cv=Math.cos(v),sv=Math.sin(v);p.push((R+r*cv)*cu,r*sv,(R+r*cv)*su);n.push(cv*cu,sv,cv*su);}}
    for(let a=0;a<seg;a++)for(let b=0;b<tube;b++){const A=a*(tube+1)+b,B=(a+1)*(tube+1)+b;i.push(A,B,A+1,B,B+1,A+1);}return geometry(p,n,i);
  }
  function boxGeom(){
    const p=[],n=[],i=[]; const faces=[
      [[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1],[0,0,1]],[[1,-1,-1],[-1,-1,-1],[-1,1,-1],[1,1,-1],[0,0,-1]],
      [[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1],[0,1,0]],[[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[0,-1,0]],
      [[1,-1,1],[1,-1,-1],[1,1,-1],[1,1,1],[1,0,0]],[[-1,-1,-1],[-1,-1,1],[-1,1,1],[-1,1,-1],[-1,0,0]]
    ];
    faces.forEach(f=>{const base=p.length/3;for(let k=0;k<4;k++){p.push(...f[k]);n.push(...f[4]);}i.push(base,base+1,base+2,base,base+2,base+3);}); return geometry(p,n,i);
  }

  const G={sphere:sphereGeom(),cylinder:cylinderGeom(),torus:torusGeom(),box:boxGeom()};

  class Node{
    constructor(geo=null,mat=null,name=''){this.geo=geo;this.mat=mat;this.name=name;this.position=[0,0,0];this.rotation=[0,0,0];this.scale=[1,1,1];this.children=[];this.visible=true;this.userData={};this.world=M.identity();}
    add(node){this.children.push(node);return node;}
  }
  const root=new Node();
  function part(parent,geo,mat,p=[0,0,0],r=[0,0,0],s=[1,1,1],name=''){const n=parent.add(new Node(geo,mat,name));n.position=p.slice();n.rotation=r.slice();n.scale=s.slice();return n;}
  const group=(parent,name='')=>{const n=parent.add(new Node(null,null,name));return n;};
  function cloneMat(mat,mods={}){return {...mat,...mods,color:(mods.color||mat.color).slice(),emissive:(mods.emissive||mat.emissive).slice()};}

  const worldRoot=group(root,'world');
  part(worldRoot,G.box,{...materials.dark,color:hex(0x160f0c)},[0,1,-5.2],[0,0,0],[8,3.2,.12],'backwall');
  part(worldRoot,G.box,{...materials.dark,color:hex(0x17100d)},[0,-1.8,0],[0,0,0],[9,.08,8],'floor');
  for(let row=0;row<7;row++){
    for(let col=-8;col<=8;col++){
      const off=(row%2)*.32; const bmat=((row+col)&1)?materials.brick:materials.brick2;
      part(worldRoot,G.box,bmat,[col*.66+off,row*.5-1.0,-5.03],[0,0,0],[.31,.22,.08]);
    }
  }
  part(worldRoot,G.box,{...materials.red,emissive:[.28,.005,.002]},[2.4,2.25,-4.82],[0,0,0],[3.5,.025,.025]);
  part(worldRoot,G.box,{...materials.red,emissive:[.16,.002,.001]},[2.4,1.9,-4.83],[0,0,0],[2.2,.012,.018]);
  for(let x=-3;x<=3;x+=2){ const lamp=group(worldRoot); lamp.position=[x,3.4,-2.6]; part(lamp,G.cylinder,materials.black,[0,.15,0],[0,0,0],[.05,.4,.05]); part(lamp,G.sphere,{...materials.ember,emissive:[.5,.12,.01]},[0,-.33,0],[0,0,0],[.13,.13,.13]); }

  const mascotRoot=group(root,'mascot');
  const mascotBody=group(mascotRoot,'mascotBody');
  const mascotHead=group(mascotBody,'mascotHead');
  part(mascotBody,G.sphere,materials.red,[0,.15,0],[0,0,0],[.72,.88,.48]);
  part(mascotBody,G.box,materials.white,[0,.05,.44],[0,0,0],[.43,.60,.055]);
  part(mascotBody,G.cylinder,materials.skin,[0,.92,0],[0,0,0],[.16,.22,.16]);
  part(mascotHead,G.sphere,materials.skin,[0,1.48,.02],[0,0,0],[.53,.58,.50]);
  part(mascotHead,G.sphere,materials.skinDark,[-.5,1.48,.02],[0,0,0],[.13,.18,.11]);
  part(mascotHead,G.sphere,materials.skinDark,[.5,1.48,.02],[0,0,0],[.13,.18,.11]);
  part(mascotHead,G.cylinder,materials.white,[0,2.02,.01],[0,0,0],[.49,.12,.47]);
  part(mascotHead,G.sphere,materials.white,[-.27,2.27,.01],[0,0,0],[.38,.34,.34]);
  part(mascotHead,G.sphere,materials.white,[.05,2.34,.01],[0,0,0],[.43,.4,.39]);
  part(mascotHead,G.sphere,materials.white,[.34,2.24,.01],[0,0,0],[.34,.32,.32]);
  part(mascotHead,G.sphere,materials.white,[-.19,1.58,.47],[0,0,0],[.12,.095,.07]);
  part(mascotHead,G.sphere,materials.white,[.19,1.58,.47],[0,0,0],[.12,.095,.07]);
  part(mascotHead,G.sphere,materials.black,[-.19,1.58,.53],[0,0,0],[.042,.055,.036]);
  part(mascotHead,G.sphere,materials.black,[.19,1.58,.53],[0,0,0],[.042,.055,.036]);
  part(mascotHead,G.box,materials.dark,[-.19,1.73,.48],[0,0,.15],[.15,.022,.025]);
  part(mascotHead,G.box,materials.dark,[.19,1.73,.48],[0,0,-.15],[.15,.022,.025]);
  part(mascotHead,G.sphere,materials.skinDark,[0,1.39,.54],[0,0,0],[.12,.14,.11]);
  part(mascotHead,G.sphere,materials.dark,[-.13,1.25,.55],[0,0,.22],[.18,.06,.055]);
  part(mascotHead,G.sphere,materials.dark,[.13,1.25,.55],[0,0,-.22],[.18,.06,.055]);
  part(mascotHead,G.sphere,{...materials.redDark,color:hex(0x7f1f1b)},[0,1.12,.50],[0,0,0],[.15,.035,.03]);
  const leftArm=group(mascotBody); leftArm.position=[-.68,.45,.02]; leftArm.rotation=[.08,0,-.76];
  part(leftArm,G.cylinder,materials.white,[0,-.35,0],[0,0,0],[.24,.58,.24]);
  part(leftArm,G.sphere,materials.skin,[0,-.94,.08],[0,0,0],[.26,.24,.26]);
  const rightArm=group(mascotBody); rightArm.position=[.68,.45,.04]; rightArm.rotation=[-.08,0,.76];
  part(rightArm,G.cylinder,materials.white,[0,-.35,0],[0,0,0],[.24,.58,.24]);
  part(rightArm,G.sphere,materials.skin,[0,-.94,.1],[0,0,0],[.26,.24,.26]);
  part(mascotBody,G.cylinder,materials.red,[-.32,-.97,0],[0,0,0],[.25,.66,.26]);
  part(mascotBody,G.cylinder,materials.red,[.32,-.97,0],[0,0,0],[.25,.66,.26]);
  part(mascotBody,G.sphere,materials.black,[-.34,-1.63,.12],[0,0,0],[.36,.18,.48]);
  part(mascotBody,G.sphere,materials.black,[.34,-1.63,.12],[0,0,0],[.36,.18,.48]);
  part(mascotBody,G.cylinder,{...materials.white,color:hex(0xf0d8b2)},[0,.12,.505],[Math.PI/2,0,0],[.17,.025,.17]);
  part(mascotBody,G.cylinder,materials.red,[0,.12,.535],[Math.PI/2,0,0],[.11,.018,.11]);

  const pizzaRoot=group(root,'pizza');
  const pizzaBase=group(pizzaRoot,'pizzaBase');
  part(pizzaBase,G.cylinder,materials.crust,[0,0,0],[0,0,0],[1.54,.18,1.54]);
  part(pizzaBase,G.cylinder,materials.sauce,[0,.13,0],[0,0,0],[1.37,.035,1.37]);
  const cheeseDisc=part(pizzaBase,G.cylinder,cloneMat(materials.cheese),[0,.18,0],[0,0,0],[1.32,.045,1.32]);
  part(pizzaBase,G.torus,materials.crust,[0,.21,0],[0,0,0],[1.18,1.18,1.18]);

  const pepperoniGroup=group(pizzaBase,'pepperoni');
  const oliveGroup=group(pizzaBase,'olives');
  const gardenGroup=group(pizzaBase,'garden');
  const mushroomGroup=group(pizzaBase,'mushrooms');
  const chickenGroup=group(pizzaBase,'chicken');
  const basilGroup=group(pizzaBase,'basil');
  const cheeseBlobGroup=group(pizzaBase,'cheeseBlobs');

  const pizzaSpots=[[-.72,.2,-.62],[.1,.2,-.72],[.72,.2,-.33],[-.45,.2,.05],[.42,.2,.12],[-.1,.2,.61],[.72,.2,.62],[-.78,.2,.58],[.02,.2,.02]];
  pizzaSpots.forEach((q,j)=>{ const d=part(pepperoniGroup,G.cylinder,materials.pepperoni,[q[0],.27,q[2]],[0,j*.31,0],[.19,.028,.19]); part(d,G.sphere,materials.pepperoniEdge,[.05,.62,.02],[0,0,0],[.16,.06,.16]); });
  [[-.65,-.22],[.57,-.65],[.45,.62],[-.15,.78],[-.85,.42]].forEach((q,j)=>part(oliveGroup,G.torus,materials.olive,[q[0],.31,q[1]],[0,j*.4,0],[.12,.12,.12]));
  [[-.65,-.7],[.58,-.5],[-.38,.54],[.72,.36],[.08,.1]].forEach((q,j)=>{ const g=group(mushroomGroup);g.position=[q[0],.28,q[1]];g.rotation=[0,j*.74,0];part(g,G.cylinder,materials.mushroom,[0,.06,0],[0,0,0],[.07,.08,.07]);part(g,G.sphere,materials.brown,[0,.15,0],[0,0,0],[.16,.07,.12]); });
  [[-.84,-.15],[.76,-.08],[-.23,-.74],[.28,.74],[-.62,.63]].forEach((q,j)=>part(gardenGroup,G.box,j%2?materials.green:materials.red,[q[0],.31,q[1]],[.04,j*.8,.35],[.20,.035,.055]));
  [[-.66,-.56],[.5,-.64],[.65,.45],[-.42,.56],[.03,.08]].forEach((q,j)=>part(chickenGroup,G.box,{...materials.brown,color:hex(0xa85e35)},[q[0],.32,q[1]],[.1,j*.7,.14],[.14,.09,.14]));
  [[-.86,.22],[.18,-.82],[.8,.15],[-.3,.78]].forEach((q,j)=>part(basilGroup,G.sphere,materials.green2,[q[0],.34,q[1]],[.2,j*.9,.4],[.16,.025,.28]));
  [[-.55,-.25],[.44,-.27],[-.15,.45],[.58,.48]].forEach(q=>part(cheeseBlobGroup,G.sphere,materials.cheese2,[q[0],.31,q[1]],[0,0,0],[.24,.045,.18]));

  const extras={black:group(pizzaBase,'extraBlack'),green:group(pizzaBase,'extraGreen'),mushroom:group(pizzaBase,'extraMushroom'),meat:group(pizzaBase,'extraMeat'),cheese:group(pizzaBase,'extraCheese')};
  extras.black.visible=extras.green.visible=extras.mushroom.visible=extras.meat.visible=extras.cheese.visible=false;
  [[-.95,-.42],[-.28,-.92],[.88,.12],[.2,.9]].forEach((q,j)=>part(extras.black,G.torus,materials.olive,[q[0],.34,q[1]],[0,j*.6,0],[.11,.11,.11]));
  [[-.78,-.82],[.82,-.66],[-.03,.92],[.92,.55]].forEach((q,j)=>part(extras.green,G.torus,{...materials.green,color:hex(0x587e32)},[q[0],.35,q[1]],[0,j*.5,0],[.11,.11,.11]));
  [[-.92,.02],[.02,-.92],[.9,-.25],[.22,.88]].forEach((q,j)=>{const g=group(extras.mushroom);g.position=[q[0],.32,q[1]];g.rotation=[0,j*.8,0];part(g,G.cylinder,materials.mushroom,[0,.05,0],[0,0,0],[.065,.07,.065]);part(g,G.sphere,materials.brown,[0,.14,0],[0,0,0],[.15,.065,.11]);});
  [[-.92,-.5],[-.52,.85],[.32,-.94],[.92,.34]].forEach((q,j)=>part(extras.meat,G.cylinder,materials.pepperoni,[q[0],.35,q[1]],[0,j*.5,0],[.18,.028,.18]));
  [[-.88,.48],[-.1,-.88],[.72,-.6],[.75,.63],[.02,.05]].forEach(q=>part(extras.cheese,G.sphere,materials.cheese2,[q[0],.34,q[1]],[0,0,0],[.22,.04,.15]));

  const sauceFx=group(pizzaRoot,'sauceFx');
  [0.33,.58,.82,1.05].forEach((r,j)=>{const m=cloneMat(materials.sauce,{opacity:.88-j*.1,emissive:[.05,.001,0]});part(sauceFx,G.torus,m,[0,.55+j*.07,0],[0,0,0],[r,r,r]);});

  const ingredientRoot=group(root,'ingredients');
  const ingredientItems=[];
  const ingDefs=[
    [G.cylinder,materials.pepperoni,[.19,.035,.19]], [G.torus,materials.olive,[.13,.13,.13]], [G.sphere,materials.green2,[.17,.035,.28]],
    [G.box,materials.red,[.22,.04,.06]], [G.box,materials.green,[.22,.04,.06]], [G.sphere,materials.brown,[.16,.07,.12]], [G.box,{...materials.brown,color:hex(0xa85e35)},[.15,.1,.15]]
  ];
  for(let j=0;j<30;j++){ const def=ingDefs[j%ingDefs.length]; const n=part(ingredientRoot,def[0],def[1],[0,0,0],[0,0,0],def[2]); n.userData={angle:j/30*Math.PI*2,phase:(j*1.618)%1,type:j%ingDefs.length}; ingredientItems.push(n); }

  const ovenRoot=group(root,'oven');
  const ovenBack=part(ovenRoot,G.box,{...materials.black,color:hex(0x130a07),emissive:[.05,.008,.002]},[0,.25,-.72],[0,0,0],[3.25,2.55,.22]);
  part(ovenRoot,G.box,{...materials.brick,color:hex(0x3b1b15)},[0,-1.55,-.1],[0,0,0],[3.2,.16,2.35]);
  for(let side of [-1,1]) for(let y=-1.25;y<=1.25;y+=.48) part(ovenRoot,G.box,(Math.round(y*10)%2)?materials.brick:materials.brick2,[side*2.55,y,0],[0,0,0],[.45,.22,.55]);
  for(let j=0;j<15;j++){ const a=Math.PI*j/14, x=Math.cos(a)*2.5, y=Math.sin(a)*2.5-1.15; part(ovenRoot,G.box,j%2?materials.brick2:materials.brick,[x,y,0],[0,0,-(a-Math.PI/2)],[.38,.22,.55]); }
  for(let j=0;j<12;j++){const a=j/12*Math.PI*2;part(ovenRoot,G.sphere,materials.ember,[Math.cos(a)*.85,-1.15,Math.sin(a)*.45-.15],[0,0,0],[.16,.10,.13]);}
  part(ovenRoot,G.cylinder,{...materials.dark,color:hex(0x25130e)},[-.45,-1.15,.2],[Math.PI/2,0,.25],[.14,.85,.14]);
  part(ovenRoot,G.cylinder,{...materials.dark,color:hex(0x25130e)},[.45,-1.15,.2],[Math.PI/2,0,-.3],[.14,.85,.14]);

  const boxRoot=group(root,'box');
  part(boxRoot,G.box,materials.cardboard,[0,0,0],[0,0,0],[1.8,.12,1.8]);
  part(boxRoot,G.box,materials.red,[0,.2,1.72],[0,0,0],[1.8,.17,.08]);
  part(boxRoot,G.box,materials.red,[0,.2,-1.72],[0,0,0],[1.8,.17,.08]);
  part(boxRoot,G.box,materials.red,[1.72,.2,0],[0,0,0],[.08,.17,1.8]);
  part(boxRoot,G.box,materials.red,[-1.72,.2,0],[0,0,0],[.08,.17,1.8]);
  const lid=group(boxRoot,'lid'); lid.position=[0,.55,-2.05]; lid.rotation=[-.85,0,0];
  part(lid,G.box,materials.creamBox,[0,0,0],[0,0,0],[1.82,.08,1.82]);
  part(lid,G.cylinder,materials.red,[0,.11,0],[0,0,0],[.78,.02,.78]);
  part(lid,G.cylinder,materials.creamBox,[0,.14,0],[0,0,0],[.57,.02,.57]);
  part(lid,G.torus,materials.red,[0,.16,0],[0,0,0],[.5,.5,.5]);

  const camera={position:[0,1.0,8.5],target:[0,.7,0],fov:40};
  let projection=M.identity(), view=M.identity(), viewProj=M.identity();
  const lightDir=[-0.5,-1,-.6], lightColor=[1.14,.93,.74], fogColor=hex(0x130d0a), rimBase=hex(0xd9362d);

  function renderNode(node,parentWorld){
    if(!node.visible) return;
    const local=M.compose(node.position,node.rotation,node.scale); const world=M.multiply(parentWorld,local); node.world=world;
    if(node.geo && node.mat){
      const mvp=M.multiply(viewProj,world); gl.uniformMatrix4fv(uni.mvp,false,new Float32Array(mvp)); gl.uniformMatrix4fv(uni.model,false,new Float32Array(world));
      gl.uniform3fv(uni.color,node.mat.color); gl.uniform3fv(uni.emissive,node.mat.emissive||[0,0,0]); gl.uniform1f(uni.gloss,node.mat.gloss||.2); gl.uniform1f(uni.opacity,node.mat.opacity==null?1:node.mat.opacity);
      gl.bindVertexArray(node.geo.vao); gl.drawElements(gl.TRIANGLES,node.geo.count,gl.UNSIGNED_INT,0);
    }
    node.children.forEach(c=>renderNode(c,world));
  }

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,innerWidth<640?1.25:1.6); const w=Math.max(1,Math.floor(innerWidth*dpr)),h=Math.max(1,Math.floor(innerHeight*dpr)); if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,w,h);} projection=M.perspective(camera.fov*Math.PI/180,innerWidth/innerHeight,.05,80);
  }
  addEventListener('resize',resize,{passive:true}); resize();

  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)); const lerp=(a,b,t)=>a+(b-a)*t; const smooth=t=>t*t*(3-2*t); const seg=(p,a,b)=>smooth(clamp((p-a)/(b-a)));
  const lerp3=(a,b,t)=>[lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)];
  const pointer={x:0,y:0,sx:0,sy:0}; let scrollTarget=0,progress=0,reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  addEventListener('pointermove',e=>{pointer.x=e.clientX/innerWidth*2-1;pointer.y=-(e.clientY/innerHeight*2-1);},{passive:true});
  function docProgress(){const max=document.documentElement.scrollHeight-innerHeight;return max>0?clamp(scrollY/max):0;}

  const flavorData={
    pepperoni:{name:'PEPPERONI',desc:'Classic pepperoni, real cheese, blistered crust. No introduction needed.',rim:hex(0xd9362d)},
    bbq:{name:'BBQ CHICKEN',desc:'Smoky chicken, deep sauce, charred edges and a sweet finish.',rim:hex(0xf39a36)},
    garden:{name:'GARDEN HEAT',desc:'Fresh peppers, olives, mushrooms and a clean hit of green heat.',rim:hex(0x5e8d4c)},
    cheese:{name:'FOUR CHEESE',desc:'Four cheeses, molten center and crisp edge. Nothing hiding behind toppings.',rim:hex(0xf3d892)}
  };
  let currentFlavor='pepperoni',rimColor=rimBase.slice(),flavorKick=0,ingredientKick=0;
  function applyFlavor(name){
    currentFlavor=name; pepperoniGroup.visible=name==='pepperoni'; chickenGroup.visible=name==='bbq'; gardenGroup.visible=name==='garden'; mushroomGroup.visible=name==='garden'; oliveGroup.visible=name==='garden'; basilGroup.visible=name==='garden'; cheeseBlobGroup.visible=name==='cheese'||name==='bbq';
    cheeseDisc.mat.color=(name==='cheese'?hex(0xffd96e):hex(0xf2b84b)).slice(); rimColor=flavorData[name].rim.slice(); flavorKick=1;
  }
  applyFlavor('pepperoni');

  document.querySelectorAll('.flavor').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('.flavor').forEach(b=>{const on=b===btn;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on?'true':'false');});
    applyFlavor(btn.dataset.flavor); const data=flavorData[currentFlavor]; document.querySelector('#flavorName').textContent=data.name; document.querySelector('#flavorDescription').textContent=data.desc; document.querySelector('#orderSummary').textContent=`${data.name}. Fresh out of the oven.`;
  }));

  const selected=new Set();
  document.querySelectorAll('.topping-grid button').forEach(btn=>btn.addEventListener('click',()=>{
    const on=btn.getAttribute('aria-pressed')!=='true';btn.setAttribute('aria-pressed',on?'true':'false');btn.classList.toggle('active',on); if(on)selected.add(btn.dataset.topping);else selected.delete(btn.dataset.topping); extras[btn.dataset.extra].visible=on; ingredientKick=1; document.querySelector('#selectedToppings').textContent=selected.size?[...selected].join('  |  '):'KEEPING IT CLASSIC';
  }));

  let qty=1; const qtyEl=document.querySelector('#qty');
  document.querySelector('#minus').addEventListener('click',()=>{qty=Math.max(1,qty-1);qtyEl.textContent=qty;});
  document.querySelector('#plus').addEventListener('click',()=>{qty=Math.min(12,qty+1);qtyEl.textContent=qty;});
  document.querySelector('#orderButton').addEventListener('click',()=>{const t=selected.size?` with ${[...selected].join(', ')}`:'';document.querySelector('#orderNote').textContent=`${qty} ${qty===1?'pizza':'pizzas'} selected${t}. Your Bro has it from here.`;const b=document.querySelector('#orderButton');b.classList.add('confirmed');b.innerHTML='ORDER LOCKED IN <span>OK</span>';});

  const menu=document.querySelector('.menu-button'),panel=document.querySelector('.mobile-panel');
  menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));panel.classList.toggle('open',!open);panel.setAttribute('aria-hidden',String(open));});
  panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{panel.classList.remove('open');panel.setAttribute('aria-hidden','true');menu.setAttribute('aria-expanded','false');}));
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});}}));

  function updateMascot(p){
    const mobile=innerWidth<760; const states=mobile?[
      {at:0,pos:[1.05,-.25,.2],rot:[0,-.35,0],s:.66},{at:.025,pos:[.85,-.12,.45],rot:[-.05,-.05,-.05],s:.74},{at:.07,pos:[1.05,-.22,.35],rot:[.06,-.28,.07],s:.70},{at:.12,pos:[2.8,-1,-1.2],rot:[.14,-.9,.1],s:.45}
    ]:[
      {at:0,pos:[2.15,-.32,.1],rot:[0,-.36,0],s:.92},{at:.025,pos:[1.55,-.16,.58],rot:[-.08,.04,-.05],s:1.04},{at:.07,pos:[1.95,-.27,.38],rot:[.08,-.25,.07],s:.98},{at:.12,pos:[3.4,-1.25,-1.6],rot:[.16,-1.02,.12],s:.64}
    ];
    let a=states[0],b=states[1];for(let j=0;j<states.length-1;j++)if(p>=states[j].at){a=states[j];b=states[j+1];}const t=b.at===a.at?1:seg(p,a.at,b.at);mascotRoot.position=lerp3(a.pos,b.pos,t);mascotRoot.rotation=lerp3(a.rot,b.rot,t);const s=lerp(a.s,b.s,t);mascotRoot.scale=[s,s,s];
    pointer.sx=lerp(pointer.sx,pointer.x,reduced?.3:.08);pointer.sy=lerp(pointer.sy,pointer.y,reduced?.3:.08);const weight=(1-seg(p,.04,.12))*(mobile?0:.9);mascotHead.rotation[1]=pointer.sx*.24*weight;mascotHead.rotation[0]=-pointer.sy*.13*weight;mascotBody.rotation[1]=pointer.sx*.06*weight;mascotRoot.visible=p<.18;
  }

  function updatePizza(p){
    const mobile=innerWidth<760; let pos,rot,sc;
    const hand=mobile?[.72,.45,.72]:[1.1,.58,.95], center=[0,-.08,.1];
    if(p<.12){const t=seg(p,.05,.12);pos=lerp3(hand,center,t);rot=lerp3([-.25,.2,-.08],[0,.24,0],t);sc=lerp(mobile?.52:.68,mobile?.84:1.02,t);}
    else if(p<.54){const t=seg(p,.12,.54);pos=[0,lerp(-.08,-.18,t),0];rot=[lerp(0,-.08,t),lerp(.24,.82,t),0];sc=lerp(mobile?.84:1.02,mobile?.78:.96,t);}
    else if(p<.68){const t=seg(p,.54,.68);pos=lerp3([0,-.18,0],[0,-.34,-3.25],t);rot=lerp3([-.08,.82,0],[-.18,1.18,0],t);sc=lerp(mobile?.78:.96,mobile?.62:.72,t);}
    else if(p<.82){const t=seg(p,.68,.76);pos=lerp3([0,-.34,-3.25],mobile?[.35,.02,0]:[.95,.03,.05],t);rot=lerp3([-.18,1.18,0],[-.22,.92,.03],t);sc=lerp(mobile?.62:.72,mobile?.9:1.05,t);}
    else if(p<.93){const t=seg(p,.82,.9);pos=lerp3(mobile?[.35,.02,0]:[.95,.03,.05],[0,-.22,0],t);rot=lerp3([-.22,.92,.03],[0,0,0],t);sc=lerp(mobile?.9:1.05,mobile?.8:.92,t);}
    else{const t=seg(p,.93,1);pos=lerp3([0,-.22,0],[0,-.43,.08],t);rot=[0,0,0];sc=lerp(mobile?.8:.92,mobile?.64:.76,t);}
    if(flavorKick>0)rot[1]+=Math.sin((1-flavorKick)*Math.PI)*.22; pizzaRoot.position=pos;pizzaRoot.rotation=rot;pizzaRoot.scale=[sc,sc,sc];
  }

  function updateSauce(p){const t=p<.12?0:p<.25?seg(p,.12,.25):1-seg(p,.25,.38);sauceFx.visible=t>.01;sauceFx.scale=[Math.max(.001,t),Math.max(.001,t),Math.max(.001,t)];sauceFx.rotation[1]=p*7.5;sauceFx.children.forEach((c,j)=>{c.position[1]=.52+j*.07+(1-t)*.7;c.mat.opacity=(.82-j*.1)*t;});}

  function updateIngredients(p,time){
    const show=p>.22&&p<.94; ingredientRoot.visible=show;if(!show)return;const rain=seg(p,.24,.38),orbit=seg(p,.38,.54),custom=seg(p,.82,.93);const centerY=p<.54?lerp(2.6,.55,rain):p<.68?lerp(.55,-.8,seg(p,.54,.68)):p<.82?-3:lerp(.2,2.1,custom);ingredientRoot.position=[0,centerY,0];const kick=ingredientKick*.32;
    ingredientItems.forEach((n,j)=>{const a=n.userData.angle+orbit*Math.PI*2+time*.00018*(p>.38&&p<.54?1:.18);let radius=lerp(3.3,1.45,rain*.7+orbit*.3);if(p>.82)radius=lerp(1.5,2.15,custom);const yoff=(1-rain)*((j%6)*.24)+Math.sin(a*2.2+n.userData.phase*6.2)*.5; n.position=[Math.cos(a)*radius,yoff-kick,Math.sin(a)*radius];n.rotation=[a*.35+time*.0002,a*1.4+time*.00012,a*.2];const sc=(.85+Math.sin(j)*.12)*(1+kick);n.scale=[sc,sc,sc];});
  }

  function updateOven(p){ovenRoot.visible=p>.49&&p<.78;if(!ovenRoot.visible)return;let pos=[0,-.25,-8],sc=1; if(p<.61){const t=seg(p,.54,.61);pos=lerp3([0,-.25,-8],[0,-.22,-4.4],t);sc=lerp(.82,1.2,t);}else if(p<.68){const t=seg(p,.61,.68);pos=lerp3([0,-.22,-4.4],[0,-.15,-1.6],t);sc=lerp(1.2,1.65,t);}else{const t=seg(p,.68,.75);pos=lerp3([0,-.15,-1.6],[0,-.7,-9.5],t);sc=lerp(1.65,.72,t);}ovenRoot.position=pos;ovenRoot.scale=[sc,sc,sc];ovenRoot.rotation=[0,Math.sin(p*40)*.015,0];const heat=p>.53&&p<.72?Math.sin(seg(p,.53,.69)*Math.PI):0;ovenBack.mat.emissive=[.04+heat*.38,.006+heat*.055,.002];document.documentElement.style.setProperty('--heat',heat.toFixed(3));}

  function updateBox(p){const t=seg(p,.9,1);boxRoot.visible=p>.87;boxRoot.position=lerp3([0,-4,-.3],[0,-1.08,-.2],t);const s=lerp(.72,1.02,t);boxRoot.scale=[s,s,s];boxRoot.rotation=[-.07,lerp(.12,0,t),0];}

  const cams={hero:{p:[0,1.05,8.5],t:[.15,.72,0],f:40},prep:{p:[0,6.2,1.5],t:[0,0,0],f:38},orbit:{p:[5.1,3.1,5.0],t:[0,.12,0],f:41},oven:{p:[0,1.1,5.5],t:[0,.55,-2.2],f:47},product:{p:[4.4,3.1,5.4],t:[.35,.1,0],f:40},custom:{p:[0,6.6,.8],t:[0,-.1,0],f:36},final:{p:[-.25,7.5,1.9],t:[0,-.3,0],f:38}};
  function camBlend(a,b,t){camera.position=lerp3(a.p,b.p,t);camera.target=lerp3(a.t,b.t,t);camera.fov=lerp(a.f,b.f,t);}
  function updateCamera(p){if(p<.12)camBlend(cams.hero,cams.prep,seg(p,.055,.12));else if(p<.38)camBlend(cams.prep,cams.prep,0);else if(p<.54)camBlend(cams.prep,cams.orbit,seg(p,.38,.49));else if(p<.68)camBlend(cams.orbit,cams.oven,seg(p,.54,.62));else if(p<.82)camBlend(cams.oven,cams.product,seg(p,.68,.75));else if(p<.93)camBlend(cams.product,cams.custom,seg(p,.82,.9));else camBlend(cams.custom,cams.final,seg(p,.93,1));
    if(innerWidth<760){camera.position[0]*=.72;camera.position[2]+=1.2;camera.target[0]*=.4;camera.fov+=3;}
    projection=M.perspective(camera.fov*Math.PI/180,innerWidth/innerHeight,.05,80);view=M.lookAt(camera.position,camera.target);viewProj=M.multiply(projection,view);
  }

  function updateDOM(p){document.querySelector('#progressFill').style.transform=`scaleX(${p})`;document.body.dataset.chapter=String(Math.min(7,Math.floor(p*8)));}
  function updateWorld(p,time){updateCamera(p);updateMascot(p);updatePizza(p);updateSauce(p);updateIngredients(p,time);updateOven(p);updateBox(p);updateDOM(p);}

  gl.uniform3fv(uni.lightDir,new Float32Array(lightDir));gl.uniform3fv(uni.lightColor,new Float32Array(lightColor));gl.uniform3fv(uni.fogColor,new Float32Array(fogColor));gl.uniform1f(uni.fogDensity,.028);
  let last=performance.now();
  function frame(now){
    const dt=Math.min(40,now-last);last=now;scrollTarget=docProgress();const response=reduced?.22:.085;progress=lerp(progress,scrollTarget,1-Math.pow(1-response,dt/16.67));flavorKick=Math.max(0,flavorKick-dt*.0017);ingredientKick=Math.max(0,ingredientKick-dt*.0022);updateWorld(progress,now);
    gl.clearColor(.074,.047,.035,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(program);gl.uniform3fv(uni.camera,new Float32Array(camera.position));gl.uniform3fv(uni.rimColor,new Float32Array(rimColor));renderNode(root,M.identity());requestAnimationFrame(frame);
  }

  let pct=0;const pctEl=document.querySelector('#loaderPercent');
  const loadTimer=setInterval(()=>{pct=Math.min(100,pct+7+Math.floor(Math.random()*11));pctEl.textContent=pct;if(pct>=100){clearInterval(loadTimer);setTimeout(()=>document.querySelector('#loader').classList.add('is-done'),250);}},55);
  requestAnimationFrame(frame);
})();
