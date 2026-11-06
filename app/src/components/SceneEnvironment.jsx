import { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { sceneMotion } from '../sceneState.js';

const vertexShader = `
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
}`;

const fragmentShader = `
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
}`;

function HolographicSculpture() {
  const root = useRef(null);
  const shader = useRef(null);
  const rings = useRef(null);
  const { viewport } = useThree();

  useFrame((state, delta) => {
    if (!sceneMotion.visible) return;
    const t = state.clock.elapsedTime;
    const scroll = sceneMotion.scroll;
    const mobile = viewport.width < 7.2;
    const targetX = mobile ? 0.48 : 1.28 * Math.sin(Math.min(scroll, 1) * Math.PI * .82);
    if (root.current) {
      root.current.position.x = THREE.MathUtils.damp(root.current.position.x, targetX, 1.25, delta);
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, .06 + Math.sin(t * .48) * .12 - scroll * .1, 1.1, delta);
      const scale = THREE.MathUtils.damp(root.current.scale.x, 1.0 - scroll * .22, 1.0, delta);
      root.current.scale.setScalar(scale);
      if (!sceneMotion.reducedMotion) {
        root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, t * .14 + sceneMotion.pointerX * .16, 1.2, delta);
        root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, sceneMotion.pointerY * .12 + Math.sin(t * .2) * .05, 1.2, delta);
      }
    }
    if (shader.current) {
      shader.current.uniforms.uTime.value = sceneMotion.reducedMotion ? 0 : t;
      shader.current.uniforms.uPalette.value = THREE.MathUtils.damp(shader.current.uniforms.uPalette.value, sceneMotion.palette, 1.8, delta);
      shader.current.uniforms.uScroll.value = scroll;
    }
    if (rings.current && !sceneMotion.reducedMotion) rings.current.rotation.z = THREE.MathUtils.damp(rings.current.rotation.z, t * .055, .8, delta);
  });

  return (
    <group ref={root}>
      <mesh castShadow>
        <sphereGeometry args={[1.33, 112, 112]} />
        <shaderMaterial ref={shader} vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={{ uTime: { value: 0 }, uPalette: { value: 0 }, uScroll: { value: 0 }, uPointer: { value: new THREE.Vector2() } }} />
      </mesh>
      <mesh ref={rings} rotation={[.88,.2,-.5]}>
        <torusGeometry args={[1.56,.006,5,180]} />
        <meshBasicMaterial color="#c6f4f1" transparent opacity={.58} />
      </mesh>
      <mesh rotation={[-.55,.25,.78]}>
        <torusGeometry args={[1.73,.003,5,180]} />
        <meshBasicMaterial color="#bba8f7" transparent opacity={.45} />
      </mesh>
      <mesh rotation={[.16,.85,.2]}>
        <torusGeometry args={[1.91,.002,4,180]} />
        <meshBasicMaterial color="#f4f4f0" transparent opacity={.2} />
      </mesh>
      <mesh position={[1.45,.78,.15]}>
        <sphereGeometry args={[.035,12,12]} />
        <meshBasicMaterial color="#e7dcff" />
      </mesh>
      <mesh position={[-1.34,-.72,.4]}>
        <sphereGeometry args={[.022,10,10]} />
        <meshBasicMaterial color="#c6f4f1" />
      </mesh>
    </group>
  );
}

function GalleryGround() {
  return <mesh rotation={[-Math.PI/2,0,0]} position={[0,-2.02,0]} receiveShadow>
    <planeGeometry args={[48,48]} />
    <MeshReflectorMaterial
      blur={[260,70]}
      resolution={256}
      mixBlur={1}
      mixStrength={.72}
      roughness={.42}
      metalness={.72}
      color="#19171e"
      mirror={.45}
      depthScale={1.2}
      minDepthThreshold={.28}
      maxDepthThreshold={1.2}
      transparent
      opacity={.62}
    />
  </mesh>;
}

function Scene() {
  return <>
    <ambientLight intensity={.48} />
    <pointLight position={[-3.5,3.6,4.5]} intensity={32} color="#c5b4ff" distance={12} />
    <pointLight position={[3.4,-.4,2.7]} intensity={18} color="#a8ece7" distance={9} />
    <spotLight position={[0,5,-2]} angle={.42} penumbra={.8} intensity={45} color="#f5efff" castShadow />
    <HolographicSculpture />
    <GalleryGround />
    <Sparkles count={82} scale={[11,6,8]} size={1.25} speed={.1} opacity={.5} color="#bca9f7" />
  </>;
}

export default function SceneEnvironment({ onReady }) {
  const ready = useRef(false);
  useEffect(() => {
    if (ready.current) return;
    ready.current = true;
    const handle = window.setTimeout(onReady, 140);
    return () => window.clearTimeout(handle);
  }, [onReady]);

  return (
    <Canvas
      dpr={window.innerWidth < 720 ? 1 : [1,1.45]}
      camera={{ position: [0,.42,8.8], fov: 34, near: .1, far: 60 }}
      gl={{ alpha: true, antialias: window.innerWidth > 720, powerPreference: 'high-performance', stencil: false, depth: true }}
      shadows={window.innerWidth > 720}
      fallback={<div className="orb-fallback" role="img" aria-label="An abstract holographic sculpture; 3D preview is unavailable in this browser." />}
      onCreated={() => onReady()}
    >
      <Scene />
    </Canvas>
  );
}

