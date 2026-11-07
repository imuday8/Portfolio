import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{r as t,t as n}from"./three-runtime~index-DqlbP2cJ.js";import{t as r}from"./three-runtime~SceneEnvironment-BfBxogXU.js";import{tr as i}from"./three-runtime~SceneEnvironment-BF58tRDi.js";import{c as a}from"./three-runtime~SceneEnvironment-CnlKxpe2.js";import{t as o}from"./index-CYfdDLmz.js";var s=e(t(),1),c=n(),l=`
uniform float uTime;
varying vec3 vNormalView;
varying vec3 vViewPosition;
varying vec3 vObjectPosition;
float hash(vec3 p){p=fract(p*0.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
float noise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){
  vec3 p=position;
  float swell=sin(position.x*3.4+uTime*.3)*sin(position.y*2.7-uTime*.21)*cos(position.z*3.1+uTime*.18);
  p+=normal*(swell*.018+noise(position*2.0+uTime*.12)*.012);
  vec4 mv=modelViewMatrix*vec4(p,1.0);
  vNormalView=normalize(normalMatrix*normal);
  vViewPosition=-mv.xyz;
  vObjectPosition=position;
  gl_Position=projectionMatrix*mv;
}`,u=`
uniform float uTime;
uniform float uPalette;
uniform float uScroll;
varying vec3 vNormalView;
varying vec3 vViewPosition;
varying vec3 vObjectPosition;
float hash(vec3 p){p=fract(p*0.1031);p+=dot(p,p.yxz+33.33);return fract((p.x+p.y)*p.z);}
float noise(vec3 p){vec3 i=floor(p);vec3 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}
void main(){
  vec3 n=normalize(vNormalView);
  vec3 v=normalize(vViewPosition);
  float field=noise(vObjectPosition*3.0+vec3(uTime*.1, -uTime*.08, uScroll*2.0));
  float bands=sin(vObjectPosition.y*4.4+vObjectPosition.x*2.1+field*5.2+uTime*.15+uScroll*3.5);
  float fresnel=pow(1.0-max(dot(n,v),0.0),2.4);
  vec3 violet=vec3(.50,.38,.76);
  vec3 cyan=vec3(.58,.84,.83);
  vec3 rose=vec3(.66,.57,.62);
  vec3 silver=vec3(.78,.80,.84);
  vec3 deep=vec3(.055,.048,.075);
  vec3 tidal=mix(vec3(.10,.22,.27),cyan,smoothstep(-.2,.9,bands+field*.28));
  vec3 solar=mix(vec3(.30,.15,.13),vec3(.88,.61,.43),smoothstep(-.1,1.0,bands+field*.32));
  vec3 dream=mix(violet,cyan,smoothstep(-.7,.9,bands));
  dream=mix(dream,rose,smoothstep(.38,.94,field)*.28);
  dream=mix(dream,silver,smoothstep(.74,1.0,fresnel)*.72);
  vec3 color=mix(dream,tidal,step(.5,uPalette));
  color=mix(color,solar,step(1.5,uPalette));
  vec3 lightA=normalize(vec3(-.55,.8,1.0));
  vec3 lightB=normalize(vec3(.75,-.35,.9));
  float diffuse=max(dot(n,lightA),0.0)*.2+max(dot(n,lightB),0.0)*.12;
  float spec=pow(max(dot(reflect(-lightA,n),v),0.0),44.0)*.78+pow(max(dot(reflect(-lightB,n),v),0.0),24.0)*.2;
  color=mix(deep,color,.38+fresnel*.72+diffuse);
  color+=silver*spec;
  color+=mix(violet,cyan,fresnel)*fresnel*.32;
  gl_FragColor=vec4(color,1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;function d(){let e=(0,s.useRef)(null),t=(0,s.useRef)(null),n=(0,s.useRef)(null),r=(0,s.useRef)(!1);return a((a,s)=>{if(!o.visible)return;let c=a.clock.elapsedTime,l=o.scroll,u=window.innerWidth<=680,d=window.innerWidth<=390,f=u?d?1.4:1.7:2.55-.35*Math.sin(Math.min(l,1)*Math.PI*.72);if(e.current){if(!o.introActive&&!r.current){let t=u?d?.3:.52:.84;e.current.position.set(f,.06,0),e.current.scale.setScalar(t),r.current=!0}e.current.position.x=i.damp(e.current.position.x,f,1.25,s),e.current.position.y=i.damp(e.current.position.y,.06+Math.sin(c*.48)*.12-l*.1,1.1,s);let t=o.introActive?.24+o.introProgress*.76:1,n=(u?d?.3:.52:.84-l*.12)*t,a=i.damp(e.current.scale.x,n,1,s);e.current.scale.setScalar(a),o.reducedMotion||(e.current.rotation.y=i.damp(e.current.rotation.y,c*.14+o.pointerX*.16,1.2,s),e.current.rotation.x=i.damp(e.current.rotation.x,o.pointerY*.12+Math.sin(c*.2)*.05,1.2,s))}t.current&&(t.current.uniforms.uTime.value=o.reducedMotion?0:c,t.current.uniforms.uPalette.value=i.damp(t.current.uniforms.uPalette.value,o.palette,1.8,s),t.current.uniforms.uScroll.value=l),n.current&&!o.reducedMotion&&(n.current.rotation.z=i.damp(n.current.rotation.z,c*.055,.8,s))}),(0,c.jsxs)(`group`,{ref:e,children:[(0,c.jsxs)(`mesh`,{castShadow:!0,children:[(0,c.jsx)(`sphereGeometry`,{args:[1.33,window.innerWidth<=680?52:88,window.innerWidth<=680?52:88]}),(0,c.jsx)(`shaderMaterial`,{ref:t,vertexShader:l,fragmentShader:u,uniforms:{uTime:{value:0},uPalette:{value:0},uScroll:{value:0}}})]}),(0,c.jsxs)(`mesh`,{ref:n,rotation:[.88,.2,-.5],children:[(0,c.jsx)(`torusGeometry`,{args:[1.56,.006,5,180]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#c6f4f1`,transparent:!0,opacity:.58})]}),(0,c.jsxs)(`mesh`,{rotation:[-.55,.25,.78],children:[(0,c.jsx)(`torusGeometry`,{args:[1.73,.003,5,180]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#bba8f7`,transparent:!0,opacity:.45})]}),(0,c.jsxs)(`mesh`,{rotation:[.16,.85,.2],children:[(0,c.jsx)(`torusGeometry`,{args:[1.91,.002,4,180]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#f4f4f0`,transparent:!0,opacity:.2})]}),(0,c.jsxs)(`mesh`,{position:[1.45,.78,.15],children:[(0,c.jsx)(`sphereGeometry`,{args:[.035,12,12]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#e7dcff`})]}),(0,c.jsxs)(`mesh`,{position:[-1.34,-.72,.4],children:[(0,c.jsx)(`sphereGeometry`,{args:[.022,10,10]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#c6f4f1`})]})]})}function f(){return(0,c.jsxs)(`mesh`,{rotation:[-Math.PI/2,0,0],position:[0,-2.02,0],receiveShadow:!0,children:[(0,c.jsx)(`planeGeometry`,{args:[48,48]}),(0,c.jsx)(`meshBasicMaterial`,{color:`#17151c`,transparent:!0,opacity:.28,depthWrite:!1})]})}function p(){return a((e,t)=>{if(!o.introActive||o.reducedMotion)return;let n=Math.sin(o.introProgress*Math.PI);e.camera.position.x=i.damp(e.camera.position.x,Math.sin(o.introProgress*Math.PI*2)*.34,1.35,t),e.camera.position.z=i.damp(e.camera.position.z,8.8-n*1.8,1.2,t),e.camera.lookAt(0,.1,0)}),(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(`ambientLight`,{intensity:.48}),(0,c.jsx)(`pointLight`,{position:[-3.5,3.6,4.5],intensity:32,color:`#c5b4ff`,distance:12}),(0,c.jsx)(`pointLight`,{position:[3.4,-.4,2.7],intensity:18,color:`#a8ece7`,distance:9}),(0,c.jsx)(`spotLight`,{position:[0,5,-2],angle:.42,penumbra:.8,intensity:22,color:`#f5efff`}),(0,c.jsx)(d,{}),(0,c.jsx)(f,{})]})}function m({onFallback:e}){return(0,s.useEffect)(()=>{e()},[e]),(0,c.jsx)(`div`,{className:`orb-fallback scene-loading-fallback`,role:`img`,"aria-label":`An abstract holographic sculpture; 3D preview is unavailable in this browser.`})}function h({onReady:e,onFallback:t}){return(0,c.jsx)(r,{dpr:window.innerWidth<720?1:[1,1.3],camera:{position:[0,.42,8.8],fov:34,near:.1,far:60},gl:{alpha:!0,antialias:window.innerWidth>720,powerPreference:`high-performance`,stencil:!1,depth:!0},shadows:!1,fallback:(0,c.jsx)(m,{onFallback:t}),onCreated:()=>e(),children:(0,c.jsx)(p,{})})}export{h as default};