import{r as e}from"./rolldown-runtime-XKyaHtl9.js";import{r as t,t as n}from"./three-runtime~index-DqlbP2cJ.js";import{t as r}from"./three-runtime~SceneEnvironment-BVhiWJC1.js";import{no as i,tr as a}from"./three-runtime~SceneEnvironment-BF58tRDi.js";import{c as o,f as s}from"./three-runtime~SceneEnvironment-B8-8M-f2.js";import{n as c,t as l}from"./three-runtime~SceneEnvironment-D5PDzFep.js";import{t as u}from"./index-dJEVd0VX.js";var d=e(t(),1),f=n(),p=`
uniform float uTime;
uniform vec2 uPointer;
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
}`,m=`
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
  vec3 rose=vec3(.70,.48,.62);
  vec3 silver=vec3(.78,.80,.84);
  vec3 deep=vec3(.055,.048,.075);
  vec3 tidal=mix(vec3(.10,.22,.27),cyan,smoothstep(-.2,.9,bands+field*.28));
  vec3 solar=mix(vec3(.30,.15,.13),vec3(.88,.61,.43),smoothstep(-.1,1.0,bands+field*.32));
  vec3 dream=mix(violet,cyan,smoothstep(-.7,.9,bands));
  dream=mix(dream,rose,smoothstep(.38,.94,field)*.65);
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
}`;function h(){let e=(0,d.useRef)(null),t=(0,d.useRef)(null),n=(0,d.useRef)(null),{viewport:r}=s();return o((i,o)=>{if(!u.visible)return;let s=i.clock.elapsedTime,c=u.scroll,l=r.width<7.2?.48:1.28*Math.sin(Math.min(c,1)*Math.PI*.82);if(e.current){e.current.position.x=a.damp(e.current.position.x,l,1.25,o),e.current.position.y=a.damp(e.current.position.y,.06+Math.sin(s*.48)*.12-c*.1,1.1,o);let t=a.damp(e.current.scale.x,1-c*.22,1,o);e.current.scale.setScalar(t),u.reducedMotion||(e.current.rotation.y=a.damp(e.current.rotation.y,s*.14+u.pointerX*.16,1.2,o),e.current.rotation.x=a.damp(e.current.rotation.x,u.pointerY*.12+Math.sin(s*.2)*.05,1.2,o))}t.current&&(t.current.uniforms.uTime.value=u.reducedMotion?0:s,t.current.uniforms.uPalette.value=a.damp(t.current.uniforms.uPalette.value,u.palette,1.8,o),t.current.uniforms.uScroll.value=c),n.current&&!u.reducedMotion&&(n.current.rotation.z=a.damp(n.current.rotation.z,s*.055,.8,o))}),(0,f.jsxs)(`group`,{ref:e,children:[(0,f.jsxs)(`mesh`,{castShadow:!0,children:[(0,f.jsx)(`sphereGeometry`,{args:[1.33,112,112]}),(0,f.jsx)(`shaderMaterial`,{ref:t,vertexShader:p,fragmentShader:m,uniforms:{uTime:{value:0},uPalette:{value:0},uScroll:{value:0},uPointer:{value:new i}}})]}),(0,f.jsxs)(`mesh`,{ref:n,rotation:[.88,.2,-.5],children:[(0,f.jsx)(`torusGeometry`,{args:[1.56,.006,5,180]}),(0,f.jsx)(`meshBasicMaterial`,{color:`#c6f4f1`,transparent:!0,opacity:.58})]}),(0,f.jsxs)(`mesh`,{rotation:[-.55,.25,.78],children:[(0,f.jsx)(`torusGeometry`,{args:[1.73,.003,5,180]}),(0,f.jsx)(`meshBasicMaterial`,{color:`#bba8f7`,transparent:!0,opacity:.45})]}),(0,f.jsxs)(`mesh`,{rotation:[.16,.85,.2],children:[(0,f.jsx)(`torusGeometry`,{args:[1.91,.002,4,180]}),(0,f.jsx)(`meshBasicMaterial`,{color:`#f4f4f0`,transparent:!0,opacity:.2})]}),(0,f.jsxs)(`mesh`,{position:[1.45,.78,.15],children:[(0,f.jsx)(`sphereGeometry`,{args:[.035,12,12]}),(0,f.jsx)(`meshBasicMaterial`,{color:`#e7dcff`})]}),(0,f.jsxs)(`mesh`,{position:[-1.34,-.72,.4],children:[(0,f.jsx)(`sphereGeometry`,{args:[.022,10,10]}),(0,f.jsx)(`meshBasicMaterial`,{color:`#c6f4f1`})]})]})}function g(){return(0,f.jsxs)(`mesh`,{rotation:[-Math.PI/2,0,0],position:[0,-2.02,0],receiveShadow:!0,children:[(0,f.jsx)(`planeGeometry`,{args:[48,48]}),(0,f.jsx)(c,{blur:[260,70],resolution:256,mixBlur:1,mixStrength:.72,roughness:.42,metalness:.72,color:`#19171e`,mirror:.45,depthScale:1.2,minDepthThreshold:.28,maxDepthThreshold:1.2,transparent:!0,opacity:.62})]})}function _(){return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`ambientLight`,{intensity:.48}),(0,f.jsx)(`pointLight`,{position:[-3.5,3.6,4.5],intensity:32,color:`#c5b4ff`,distance:12}),(0,f.jsx)(`pointLight`,{position:[3.4,-.4,2.7],intensity:18,color:`#a8ece7`,distance:9}),(0,f.jsx)(`spotLight`,{position:[0,5,-2],angle:.42,penumbra:.8,intensity:45,color:`#f5efff`,castShadow:!0}),(0,f.jsx)(h,{}),(0,f.jsx)(g,{}),(0,f.jsx)(l,{count:82,scale:[11,6,8],size:1.25,speed:.1,opacity:.5,color:`#bca9f7`})]})}function v({onReady:e}){let t=(0,d.useRef)(!1);return(0,d.useEffect)(()=>{if(t.current)return;t.current=!0;let n=window.setTimeout(e,140);return()=>window.clearTimeout(n)},[e]),(0,f.jsx)(r,{dpr:window.innerWidth<720?1:[1,1.45],camera:{position:[0,.42,8.8],fov:34,near:.1,far:60},gl:{alpha:!0,antialias:window.innerWidth>720,powerPreference:`high-performance`,stencil:!1,depth:!0},shadows:window.innerWidth>720,fallback:(0,f.jsx)(`div`,{className:`orb-fallback`,role:`img`,"aria-label":`An abstract holographic sculpture; 3D preview is unavailable in this browser.`}),onCreated:()=>e(),children:(0,f.jsx)(_,{})})}export{v as default};