import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{r as t,t as n}from"./three-runtime~index-DqlbP2cJ.js";import{t as r}from"./three-runtime~SceneEnvironment-DBQlhKjl.js";import{A as i,Ma as a,Qi as o,j as s,tr as c}from"./three-runtime~SceneEnvironment-BF58tRDi.js";import{c as l,d as u}from"./three-runtime~SceneEnvironment-BPllWKf8.js";import{t as d}from"./index-BKxrFGa4.js";var f=e(t(),1),p=new URL(`earth-night-black-marble-NjS93Ed1.jpg`,import.meta.url).href,m=n(),h=`
varying vec2 vUv;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPositionWorld = worldPosition.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,g=`
uniform sampler2D uNightMap;
varying vec2 vUv;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vec3 sampleColor = texture2D(uNightMap, vUv).rgb;
  float brightness = max(max(sampleColor.r, sampleColor.g), sampleColor.b);
  float cityLight = smoothstep(0.10, 0.34, brightness);
  vec3 landAndOcean = sampleColor * vec3(0.44, 0.62, 0.86);
  vec3 cityGlow = max(sampleColor - vec3(0.11, 0.12, 0.14), vec3(0.0));
  vec3 viewDirection = normalize(cameraPosition - vPositionWorld);
  float limb = pow(1.0 - max(dot(normalize(vNormalWorld), viewDirection), 0.0), 2.0);
  vec3 nightColor = landAndOcean * 0.78 + cityGlow * cityLight * 2.7;
  nightColor += vec3(0.025, 0.072, 0.15) * limb;
  gl_FragColor = vec4(nightColor, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`,_=`
varying vec3 vPosition;
varying vec3 vPositionWorld;
varying vec3 vNormalWorld;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPosition = position;
  vPositionWorld = worldPosition.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,v=`
uniform float uTime;
varying vec3 vPosition;
varying vec3 vPositionWorld;
varying vec3 vNormalWorld;
float hash(vec3 p) {
  p = fract(p * 0.3183099 + vec3(0.1, 0.2, 0.3));
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}
float noise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y),
    f.z
  );
}
void main() {
  vec3 n = normalize(vNormalWorld);
  vec3 viewDirection = normalize(cameraPosition - vPositionWorld);
  float field = noise(vPosition * 5.1 + vec3(uTime * 0.018, 0.0, -uTime * 0.012));
  field = field * 0.68 + noise(vPosition * 10.3) * 0.32;
  float cloud = smoothstep(0.57, 0.73, field);
  float rim = pow(1.0 - max(dot(n, viewDirection), 0.0), 1.8);
  float daylight = smoothstep(-0.25, 0.65, dot(n, normalize(vec3(-0.48, 0.12, 0.86))));
  float alpha = cloud * (0.018 + daylight * 0.09 + rim * 0.18);
  gl_FragColor = vec4(vec3(0.63, 0.76, 0.93), alpha);
}`,y=`
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPositionWorld = worldPosition.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`,b=`
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vec3 n = normalize(vNormalWorld);
  vec3 v = normalize(cameraPosition - vPositionWorld);
  float rim = pow(1.0 - max(dot(n, v), 0.0), 3.2);
  float day = max(dot(n, normalize(vec3(-0.48, 0.12, 0.86))), 0.0);
  vec3 blue = vec3(0.19, 0.43, 0.78);
  vec3 gold = vec3(0.93, 0.64, 0.36);
  vec3 tint = mix(blue, gold, pow(1.0 - day, 3.0) * 0.58);
  gl_FragColor = vec4(tint, rim * (0.35 + day * 0.36));
}`,x=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`,S=`
uniform float uTime;
uniform float uVisibility;
varying vec2 vUv;
void main() {
  float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
  float radius = length(vUv - 0.5) * 2.0;
  float turbulence = sin(angle * 18.0 - uTime * 0.48) * 0.5 + sin(angle * 37.0 + radius * 24.0 - uTime * 0.28) * 0.25;
  float band = smoothstep(-0.35, 0.72, turbulence + (1.0 - radius) * 0.45);
  float edge = smoothstep(0.0, 0.12, radius) * (1.0 - smoothstep(0.82, 1.0, radius));
  vec3 amber = vec3(0.93, 0.46, 0.2);
  vec3 ice = vec3(0.52, 0.75, 0.98);
  vec3 color = mix(amber, ice, smoothstep(0.48, 0.9, band + radius * 0.12));
  float alpha = edge * (0.18 + band * 0.7) * uVisibility;
  gl_FragColor = vec4(color, alpha);
}`;function C(e){let t=new Float32Array(e*3),n=new Float32Array(e),r=127,i=()=>(r=r*16807%2147483647,(r-1)/2147483646);for(let r=0;r<e;r+=1){let e=7+i()*16,a=i()*Math.PI*2,o=(i()*2-1)*9;t[r*3]=Math.cos(a)*e,t[r*3+1]=o,t[r*3+2]=Math.sin(a)*e-8,n[r]=.55+i()*1.5}return{positions:t,sizes:n}}function w(){let e=(0,f.useRef)(null),{positions:t,sizes:n}=(0,f.useMemo)(()=>C(window.innerWidth<=680?480:980),[]);return l((t,n)=>{e.current&&(e.current.rotation.y=c.damp(e.current.rotation.y,t.clock.elapsedTime*.0018+d.scroll*.028,.35,n),e.current.position.x=c.damp(e.current.position.x,-d.pointerX*.08,.35,n))}),(0,m.jsxs)(`points`,{ref:e,children:[(0,m.jsxs)(`bufferGeometry`,{children:[(0,m.jsx)(`bufferAttribute`,{attach:`attributes-position`,args:[t,3]}),(0,m.jsx)(`bufferAttribute`,{attach:`attributes-size`,args:[n,1]})]}),(0,m.jsx)(`pointsMaterial`,{color:`#c9d7ee`,size:1.05,sizeAttenuation:!1,transparent:!0,opacity:.62,depthWrite:!1})]})}function T(){let e=(0,f.useRef)(null),t=(0,f.useRef)(null),n=(0,f.useRef)(null),r=(0,f.useRef)(null),a=(0,f.useMemo)(()=>{let e=window.innerWidth<=680?220:460,t=new Float32Array(e*3),n=409,r=()=>(n=n*16807%2147483647,(n-1)/2147483646);for(let n=0;n<e;n+=1){let e=r()*Math.PI*2,i=1.12+r()*1.03;t[n*3]=Math.cos(e)*i,t[n*3+1]=(r()-.5)*.16,t[n*3+2]=Math.sin(e)*i}return new s().setAttribute(`position`,new i(t,3))},[]);return l((i,a)=>{let o=d.introActive?d.introProgress:1,s=d.introActive?1-c.smoothstep(o,.48,.78):0;s<.008?e.current&&(e.current.visible=!1):(e.current&&(e.current.visible=s>.008,e.current.scale.setScalar(c.damp(e.current.scale.x,.9+(1-s)*.25,1.8,a)),e.current.rotation.z=i.clock.elapsedTime*.018),t.current&&(t.current.uniforms.uTime.value=i.clock.elapsedTime,t.current.uniforms.uVisibility.value=s),n.current&&(n.current.opacity=s*.28),r.current&&(r.current.opacity=s))}),(0,m.jsxs)(`group`,{ref:e,position:[0,.12,.25],children:[(0,m.jsxs)(`mesh`,{rotation:[.8,0,-.32],children:[(0,m.jsx)(`ringGeometry`,{args:[.64,2.05,144,32]}),(0,m.jsx)(`shaderMaterial`,{ref:t,vertexShader:x,fragmentShader:S,transparent:!0,depthWrite:!1,side:2,blending:2,uniforms:{uTime:{value:0},uVisibility:{value:1}}})]}),(0,m.jsxs)(`mesh`,{children:[(0,m.jsx)(`sphereGeometry`,{args:[.63,48,48]}),(0,m.jsx)(`meshBasicMaterial`,{ref:r,color:`#010205`,transparent:!0})]}),(0,m.jsxs)(`mesh`,{ref:n,children:[(0,m.jsx)(`torusGeometry`,{args:[.78,.018,8,128]}),(0,m.jsx)(`meshBasicMaterial`,{color:`#d9e8ff`,transparent:!0,blending:2,depthWrite:!1})]}),(0,m.jsx)(`points`,{geometry:a,rotation:[.8,0,-.32],children:(0,m.jsx)(`pointsMaterial`,{color:`#ffd9a6`,size:1.25,sizeAttenuation:!1,transparent:!0,opacity:.66,depthWrite:!1})})]})}function E({onReady:e}){let t=u(a,p),n=(0,f.useRef)(null),r=(0,f.useRef)(null);return(0,f.useEffect)(()=>{t.colorSpace=o,t.anisotropy=Math.min(8,2**Math.floor(Math.log2(Math.max(1,window.devicePixelRatio)))),t.needsUpdate=!0,e()},[e,t]),l((e,t)=>{if(!n.current||!d.visible)return;let i=d.introActive?d.introProgress:1,a=d.introActive?c.smoothstep(i,.68,1):1,o=window.innerWidth<=680,s=d.scroll,l=o?1.32:2.45,u=c.smoothstep(s,.015,.48),f=d.introActive?c.lerp(.1,l,a):l-u*(o?.35:1.15),p=d.introActive?-.16-(1-a)*.18:-.08-u*.35,m=d.introActive?.015+a*(o?1.12:1.42):(o?1.12:1.42)-s*(o?.16:.23);n.current.position.x=c.damp(n.current.position.x,f,.9,t),n.current.position.y=c.damp(n.current.position.y,p,.8,t);let h=c.damp(n.current.scale.x,m,.82,t);if(n.current.scale.setScalar(h),d.reducedMotion)n.current.rotation.y=s*1.65;else{let r=e.clock.elapsedTime*.012+s*2.1;n.current.rotation.y=c.damp(n.current.rotation.y,r,.55,t),n.current.rotation.x=c.damp(n.current.rotation.x,.015+d.pointerY*.025+s*.035,.5,t)}r.current?.material?.uniforms?.uTime&&(r.current.material.uniforms.uTime.value=d.reducedMotion?0:e.clock.elapsedTime)}),(0,m.jsxs)(`group`,{ref:n,children:[(0,m.jsxs)(`mesh`,{children:[(0,m.jsx)(`sphereGeometry`,{args:[1,window.innerWidth<=680?72:112,window.innerWidth<=680?48:80]}),(0,m.jsx)(`shaderMaterial`,{vertexShader:h,fragmentShader:g,uniforms:{uNightMap:{value:t}}})]}),(0,m.jsxs)(`mesh`,{ref:r,scale:1.007,children:[(0,m.jsx)(`sphereGeometry`,{args:[1,window.innerWidth<=680?64:96,window.innerWidth<=680?40:64]}),(0,m.jsx)(`shaderMaterial`,{vertexShader:_,fragmentShader:v,transparent:!0,depthWrite:!1,uniforms:{uTime:{value:0}}})]}),(0,m.jsxs)(`mesh`,{scale:1.045,children:[(0,m.jsx)(`sphereGeometry`,{args:[1,64,48]}),(0,m.jsx)(`shaderMaterial`,{vertexShader:y,fragmentShader:b,transparent:!0,side:1,blending:2,depthWrite:!1})]}),(0,m.jsxs)(`mesh`,{rotation:[.94,.12,-.28],scale:1.02,children:[(0,m.jsx)(`torusGeometry`,{args:[1.2,.004,8,192]}),(0,m.jsx)(`meshBasicMaterial`,{color:`#a99aff`,transparent:!0,opacity:.46,blending:2,depthWrite:!1})]}),(0,m.jsxs)(`mesh`,{rotation:[.6,-.62,.54],scale:1.02,children:[(0,m.jsx)(`torusGeometry`,{args:[1.27,.0025,6,160]}),(0,m.jsx)(`meshBasicMaterial`,{color:`#78bfff`,transparent:!0,opacity:.3,blending:2,depthWrite:!1})]})]})}function D({onReady:e}){let t=(0,f.useRef)(null);return l((e,n)=>{if(!d.visible)return;let r=d.scroll,i=d.introActive?d.introProgress:1,a=window.innerWidth<=680,o=8.5-c.smoothstep(r,.01,.46)*.9-(d.introActive?Math.sin(i*Math.PI)*.48:0),s=Math.sin(r*Math.PI*1.1)*.25+(d.introActive?Math.sin(i*Math.PI*2)*.17:0);e.camera.position.x=c.damp(e.camera.position.x,s+(a?.05:0),.42,n),e.camera.position.y=c.damp(e.camera.position.y,.13+Math.sin(r*Math.PI)*.12,.42,n),e.camera.position.z=c.damp(e.camera.position.z,o,.42,n),e.camera.lookAt(0,0,0),t.current&&(t.current.rotation.x=c.damp(t.current.rotation.x,r*.035,.3,n))}),(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`color`,{attach:`background`,args:[`#030509`]}),(0,m.jsx)(`fog`,{attach:`fog`,args:[`#030509`,16,35]}),(0,m.jsx)(`ambientLight`,{intensity:.2,color:`#7894bd`}),(0,m.jsx)(`directionalLight`,{position:[-4,2.4,5],intensity:.38,color:`#b6d2ff`}),(0,m.jsx)(`group`,{ref:t,children:(0,m.jsx)(w,{})}),(0,m.jsx)(T,{}),(0,m.jsx)(E,{onReady:e})]})}function O(){return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(`color`,{attach:`background`,args:[`#030509`]}),(0,m.jsx)(`ambientLight`,{intensity:.18}),(0,m.jsx)(w,{}),(0,m.jsx)(T,{}),(0,m.jsxs)(`mesh`,{position:[2.3,-.12,0],children:[(0,m.jsx)(`sphereGeometry`,{args:[1.35,48,32]}),(0,m.jsx)(`meshBasicMaterial`,{color:`#091729`})]})]})}function k({onReady:e,onUnavailable:t}){let[n]=(0,f.useState)(()=>{try{let e=document.createElement(`canvas`).getContext(`webgl2`,{failIfMajorPerformanceCaveat:!0});return e?.getExtension(`WEBGL_lose_context`)?.loseContext(),!!e}catch{return!1}}),[i,a]=(0,f.useState)(!1),[o,s]=(0,f.useState)(!1),c=(0,f.useCallback)(()=>{a(!0),s(!1),e()},[e]);return(0,f.useEffect)(()=>{if(!n){s(!0),t();return}let e=window.setTimeout(()=>{i||(s(!0),t())},7e3);return()=>window.clearTimeout(e)},[t,i,n]),(0,m.jsxs)(m.Fragment,{children:[n&&(0,m.jsx)(r,{dpr:window.innerWidth<720?1:[1,1.2],camera:{position:[0,.12,8.5],fov:40,near:.1,far:70},gl:{alpha:!1,antialias:window.innerWidth>720,powerPreference:`high-performance`,stencil:!1,depth:!0},shadows:!1,children:(0,m.jsx)(f.Suspense,{fallback:(0,m.jsx)(O,{}),children:(0,m.jsx)(D,{onReady:c})})}),o&&(0,m.jsx)(`div`,{className:`earth-fallback`,role:`img`,"aria-label":`Static Earth-at-night image from NASA Black Marble. The interactive 3D globe is unavailable in this browser.`,style:{backgroundImage:`url(${p})`}})]})}export{k as default};