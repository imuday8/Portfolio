import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import earthNightMap from "../assets/earth-night-black-marble.jpg";
import { sceneMotion } from "../sceneState.js";

const earthVertex = `
varying vec2 vUv;
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vUv = uv;
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPositionWorld = worldPosition.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;

const earthFragment = `
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
}`;

const cloudVertex = `
varying vec3 vPosition;
varying vec3 vPositionWorld;
varying vec3 vNormalWorld;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPosition = position;
  vPositionWorld = worldPosition.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;

const cloudFragment = `
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
}`;

const atmosphereVertex = `
varying vec3 vNormalWorld;
varying vec3 vPositionWorld;
void main() {
  vec4 worldPosition = modelMatrix * vec4(position, 1.0);
  vPositionWorld = worldPosition.xyz;
  vNormalWorld = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * worldPosition;
}`;

const atmosphereFragment = `
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
}`;

const diskVertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const diskFragment = `
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
}`;

function makeStars(count) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  let seed = 127;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let index = 0; index < count; index += 1) {
    const radius = 7 + random() * 16;
    const theta = random() * Math.PI * 2;
    const y = (random() * 2 - 1) * 9;
    positions[index * 3] = Math.cos(theta) * radius;
    positions[index * 3 + 1] = y;
    positions[index * 3 + 2] = Math.sin(theta) * radius - 8;
    sizes[index] = 0.55 + random() * 1.5;
  }
  return { positions, sizes };
}

function Starfield() {
  const points = useRef(null);
  const { positions, sizes } = useMemo(
    () => makeStars(window.innerWidth <= 680 ? 480 : 980),
    [],
  );
  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y = THREE.MathUtils.damp(
      points.current.rotation.y,
      state.clock.elapsedTime * 0.0018 + sceneMotion.scroll * 0.028,
      0.35,
      delta,
    );
    points.current.position.x = THREE.MathUtils.damp(
      points.current.position.x,
      -sceneMotion.pointerX * 0.08,
      0.35,
      delta,
    );
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        color="#c9d7ee"
        size={1.05}
        sizeAttenuation={false}
        transparent
        opacity={0.62}
        depthWrite={false}
      />
    </points>
  );
}

function BlackHole() {
  const group = useRef(null);
  const disk = useRef(null);
  const glow = useRef(null);
  const core = useRef(null);
  const particleGeometry = useMemo(() => {
    const count = window.innerWidth <= 680 ? 220 : 460;
    const points = new Float32Array(count * 3);
    let seed = 409;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let index = 0; index < count; index += 1) {
      const angle = random() * Math.PI * 2;
      const radius = 1.12 + random() * 1.03;
      points[index * 3] = Math.cos(angle) * radius;
      points[index * 3 + 1] = (random() - 0.5) * 0.16;
      points[index * 3 + 2] = Math.sin(angle) * radius;
    }
    return new THREE.BufferGeometry().setAttribute(
      "position",
      new THREE.BufferAttribute(points, 3),
    );
  }, []);

  useFrame((state, delta) => {
    const progress = sceneMotion.introActive ? sceneMotion.introProgress : 1;
    const visible = sceneMotion.introActive
      ? 1 - THREE.MathUtils.smoothstep(progress, 0.48, 0.78)
      : 0;
    if (group.current) {
      group.current.visible = visible > 0.008;
      group.current.scale.setScalar(
        THREE.MathUtils.damp(
          group.current.scale.x,
          0.9 + (1 - visible) * 0.25,
          1.8,
          delta,
        ),
      );
      group.current.rotation.z = state.clock.elapsedTime * 0.018;
    }
    if (disk.current) {
      disk.current.uniforms.uTime.value = state.clock.elapsedTime;
      disk.current.uniforms.uVisibility.value = visible;
    }
    if (glow.current) glow.current.opacity = visible * 0.28;
    if (core.current) core.current.opacity = visible;
  });

  return (
    <group ref={group} position={[0, 0.12, 0.25]}>
      <mesh rotation={[0.8, 0, -0.32]}>
        <ringGeometry args={[0.64, 2.05, 144, 32]} />
        <shaderMaterial
          ref={disk}
          vertexShader={diskVertex}
          fragmentShader={diskFragment}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={{
            uTime: { value: 0 },
            uVisibility: { value: 1 },
          }}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.63, 48, 48]} />
        <meshBasicMaterial ref={core} color="#010205" transparent />
      </mesh>
      <mesh ref={glow}>
        <torusGeometry args={[0.78, 0.018, 8, 128]} />
        <meshBasicMaterial
          color="#d9e8ff"
          transparent
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <points geometry={particleGeometry} rotation={[0.8, 0, -0.32]}>
        <pointsMaterial
          color="#ffd9a6"
          size={1.25}
          sizeAttenuation={false}
          transparent
          opacity={0.66}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function Earth({ onReady }) {
  const texture = useLoader(THREE.TextureLoader, earthNightMap);
  const group = useRef(null);
  const cloudLayer = useRef(null);
  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(
      8,
      2 ** Math.floor(Math.log2(Math.max(1, window.devicePixelRatio))),
    );
    texture.needsUpdate = true;
    onReady();
  }, [onReady, texture]);

  useFrame((state, delta) => {
    if (!group.current || !sceneMotion.visible) return;
    const progress = sceneMotion.introActive ? sceneMotion.introProgress : 1;
    const reveal = sceneMotion.introActive
      ? THREE.MathUtils.smoothstep(progress, 0.68, 1)
      : 1;
    const isMobile = window.innerWidth <= 680;
    const scroll = sceneMotion.scroll;
    const startX = isMobile ? 1.32 : 2.45;
    const lateScroll = THREE.MathUtils.smoothstep(scroll, 0.015, 0.48);
    const targetX = sceneMotion.introActive
      ? THREE.MathUtils.lerp(0.1, startX, reveal)
      : startX - lateScroll * (isMobile ? 0.35 : 1.15);
    const targetY = sceneMotion.introActive
      ? -0.16 - (1 - reveal) * 0.18
      : -0.08 - lateScroll * 0.35;
    const targetScale = sceneMotion.introActive
      ? 0.015 + reveal * (isMobile ? 1.12 : 1.42)
      : (isMobile ? 1.12 : 1.42) - scroll * (isMobile ? 0.16 : 0.23);
    group.current.position.x = THREE.MathUtils.damp(
      group.current.position.x,
      targetX,
      0.9,
      delta,
    );
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      targetY,
      0.8,
      delta,
    );
    const scale = THREE.MathUtils.damp(
      group.current.scale.x,
      targetScale,
      0.82,
      delta,
    );
    group.current.scale.setScalar(scale);
    if (!sceneMotion.reducedMotion) {
      const targetRotation = state.clock.elapsedTime * 0.012 + scroll * 2.1;
      group.current.rotation.y = THREE.MathUtils.damp(
        group.current.rotation.y,
        targetRotation,
        0.55,
        delta,
      );
      group.current.rotation.x = THREE.MathUtils.damp(
        group.current.rotation.x,
        0.015 + sceneMotion.pointerY * 0.025 + scroll * 0.035,
        0.5,
        delta,
      );
    } else {
      group.current.rotation.y = scroll * 1.65;
    }
    if (cloudLayer.current?.material?.uniforms?.uTime)
      cloudLayer.current.material.uniforms.uTime.value =
        sceneMotion.reducedMotion ? 0 : state.clock.elapsedTime;
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry
          args={[
            1,
            window.innerWidth <= 680 ? 72 : 112,
            window.innerWidth <= 680 ? 48 : 80,
          ]}
        />
        <shaderMaterial
          vertexShader={earthVertex}
          fragmentShader={earthFragment}
          uniforms={{ uNightMap: { value: texture } }}
        />
      </mesh>
      <mesh ref={cloudLayer} scale={1.007}>
        <sphereGeometry
          args={[
            1,
            window.innerWidth <= 680 ? 64 : 96,
            window.innerWidth <= 680 ? 40 : 64,
          ]}
        />
        <shaderMaterial
          vertexShader={cloudVertex}
          fragmentShader={cloudFragment}
          transparent
          depthWrite={false}
          uniforms={{ uTime: { value: 0 } }}
        />
      </mesh>
      <mesh scale={1.045}>
        <sphereGeometry args={[1, 64, 48]} />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          transparent
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

function Scene({ onReady }) {
  const stars = useRef(null);
  useFrame((state, delta) => {
    if (!sceneMotion.visible) return;
    const progress = sceneMotion.scroll;
    const intro = sceneMotion.introActive ? sceneMotion.introProgress : 1;
    const mobile = window.innerWidth <= 680;
    const targetZ =
      8.5 -
      THREE.MathUtils.smoothstep(progress, 0.01, 0.46) * 0.9 -
      (sceneMotion.introActive ? Math.sin(intro * Math.PI) * 0.48 : 0);
    const targetX =
      Math.sin(progress * Math.PI * 1.1) * 0.25 +
      (sceneMotion.introActive ? Math.sin(intro * Math.PI * 2) * 0.17 : 0);
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      targetX + (mobile ? 0.05 : 0),
      0.42,
      delta,
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      0.13 + Math.sin(progress * Math.PI) * 0.12,
      0.42,
      delta,
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      0.42,
      delta,
    );
    state.camera.lookAt(0, 0, 0);
    if (stars.current) {
      stars.current.rotation.x = THREE.MathUtils.damp(
        stars.current.rotation.x,
        progress * 0.035,
        0.3,
        delta,
      );
    }
  });
  return (
    <>
      <color attach="background" args={["#030509"]} />
      <fog attach="fog" args={["#030509", 16, 35]} />
      <ambientLight intensity={0.2} color="#7894bd" />
      <directionalLight
        position={[-4, 2.4, 5]}
        intensity={0.38}
        color="#b6d2ff"
      />
      <group ref={stars}>
        <Starfield />
      </group>
      <BlackHole />
      <Earth onReady={onReady} />
    </>
  );
}

function SceneLoading() {
  return (
    <>
      <color attach="background" args={["#030509"]} />
      <ambientLight intensity={0.18} />
      <Starfield />
      <BlackHole />
      <mesh position={[2.3, -0.12, 0]}>
        <sphereGeometry args={[1.35, 48, 32]} />
        <meshBasicMaterial color="#091729" />
      </mesh>
    </>
  );
}

export default function SceneEnvironment({ onReady, onUnavailable }) {
  const [webglSupported] = useState(() => {
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2", {
        failIfMajorPerformanceCaveat: true,
      });
      context?.getExtension("WEBGL_lose_context")?.loseContext();
      return Boolean(context);
    } catch {
      return false;
    }
  });
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const reportReady = useCallback(() => {
    setSceneLoaded(true);
    setShowFallback(false);
    onReady();
  }, [onReady]);
  useEffect(() => {
    if (!webglSupported) {
      setShowFallback(true);
      onUnavailable();
      return undefined;
    }
    const timeout = window.setTimeout(() => {
      if (sceneLoaded) return;
      setShowFallback(true);
      onUnavailable();
    }, 7000);
    return () => window.clearTimeout(timeout);
  }, [onUnavailable, sceneLoaded, webglSupported]);
  return (
    <>
      {webglSupported && (
        <Canvas
          dpr={window.innerWidth < 720 ? 1 : [1, 1.25]}
          camera={{ position: [0, 0.12, 8.5], fov: 40, near: 0.1, far: 70 }}
          gl={{
            alpha: false,
            antialias: window.innerWidth > 720,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          shadows={false}
        >
          <Suspense fallback={<SceneLoading />}>
            <Scene onReady={reportReady} />
          </Suspense>
        </Canvas>
      )}
      {showFallback && (
        <div
          className="earth-fallback"
          role="img"
          aria-label="Static Earth-at-night image from NASA Black Marble. The interactive 3D globe is unavailable in this browser."
          style={{ backgroundImage: `url(${earthNightMap})` }}
        />
      )}
    </>
  );
}
