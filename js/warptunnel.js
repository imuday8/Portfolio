/**
 * Real Deep Space, White Dwarf Singularity & Pinpoint Starfield Engine
 *
 * Core Specifications:
 * - 100% Pure Pitch-Black Void (#000000)
 * - 3,200+ Pinpoint Dot Stars (0.4px - 1.8px max, NEVER large cartoon circles)
 * - True Stellar Temperatures: 90% Pure White (#FFFFFF), 8% Ice-White (#E2EEFF), 2% Soft Silver-Blue (#B8D4FF)
 * - Central White Dwarf Star:
 *   * Pure incandescent white (#FFFFFF) compact core
 *   * Soft radial corona (rgba(255,255,255,0.95) -> rgba(220,238,255,0.35) -> transparent)
 *   * Anamorphic lens flare & razor-thin diffraction spikes (1px - 2px thick)
 *   * Gravitational micro-particles spiraling inward
 * - Smooth camera dive into the White Dwarf core at 85% - 100% scroll
 * - Persistent deep space background mode with distant White Dwarf star & parallax
 */

const STAR_COLORS = [
  { r: 255, g: 255, b: 255, weight: 0.90 }, // Pure Brilliant White
  { r: 226, g: 238, b: 255, weight: 0.08 }, // Ice-White
  { r: 184, g: 212, b: 255, weight: 0.02 }  // Soft Silver-Blue
];

function getRandomStarColor() {
  const rand = Math.random();
  if (rand < 0.90) return STAR_COLORS[0];
  if (rand < 0.98) return STAR_COLORS[1];
  return STAR_COLORS[2];
}

const STAR_COUNT = 3200;
const ACCRETION_PARTICLE_COUNT = 140;
const MAX_Z = 2400;
const MIN_Z = 8;
const FOV = 420;
const activeEngines = [];

class PinpointStar {
  constructor(w, h, randomizedZ = true) {
    this.reset(w, h, randomizedZ);
  }

  reset(w, h, randomizedZ = false) {
    // 3D cone/cylinder distribution with central aperture for White Dwarf
    const angle = Math.random() * Math.PI * 2;
    const maxRadius = Math.max(w, h) * 0.95;
    // Core radius: keep small clearance around central star
    const radius = 25 + Math.pow(Math.random(), 1.4) * maxRadius;
    this.x = Math.cos(angle) * radius;
    this.y = Math.sin(angle) * radius;
    this.z = randomizedZ ? MIN_Z + Math.random() * (MAX_Z - MIN_Z) : MAX_Z;
    this.prevZ = this.z;

    this.color = getRandomStarColor();
    // Strictly tiny pinpoint dots: 0.4px to 1.6px
    this.baseRadius = 0.4 + Math.random() * 1.1;
    this.speedMult = 0.85 + Math.random() * 0.35;
    this.twinkleSpeed = 0.02 + Math.random() * 0.04;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  update(speed, w, h, isReversed = false) {
    this.prevZ = this.z;
    this.twinklePhase += this.twinkleSpeed;

    if (isReversed) {
      this.z += speed * this.speedMult;
      if (this.z > MAX_Z) {
        this.reset(w, h, false);
        this.z = MIN_Z;
        this.prevZ = this.z;
      }
    } else {
      this.z -= speed * this.speedMult;
      if (this.z < MIN_Z) {
        this.reset(w, h, false);
        this.z = MAX_Z;
        this.prevZ = this.z;
      }
    }
  }
}

class AccretionMicroParticle {
  constructor() {
    this.reset(true);
  }

  reset(randomize = false) {
    this.angle = Math.random() * Math.PI * 2;
    this.dist = randomize ? 25 + Math.random() * 180 : 180;
    this.speed = 0.015 + Math.random() * 0.025;
    this.decayRate = 0.35 + Math.random() * 0.6;
    this.size = 0.6 + Math.random() * 0.8; // Tiny 1px
    this.alpha = 0.2 + Math.random() * 0.6;
  }

  update(scrollFactor) {
    this.angle += this.speed * (1 + scrollFactor * 2);
    this.dist -= this.decayRate * (1 + scrollFactor * 3);
    if (this.dist < 8) {
      this.reset(false);
    }
  }
}

export class CosmicWarpEngine {
  constructor(canvasElement, isAmbientBackground = false) {
    this.canvas = canvasElement;
    this.ctx = this.canvas ? this.canvas.getContext("2d") : null;
    this.isAmbient = isAmbientBackground;
    this.isRunning = false;
    this.animId = null;

    this.width = 0;
    this.height = 0;
    this.dpr = 1;
    this.centerX = 0;
    this.centerY = 0;

    // Flight state
    this.baseSpeed = this.isAmbient ? 0.8 : 2.5;
    this.currentSpeed = this.baseSpeed;
    this.targetSpeed = this.baseSpeed;
    this.scrollVelocity = 0;
    this.progress = 0;

    // Camera mouse parallax
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;

    // White dwarf flare rotation
    this.flareAngle = 0;

    // Cinematic scroll warp pulse state (0.6s hyper-drive burst)
    this.warpPulseActive = false;
    this.warpPulseStartTime = 0;
    this.warpPulseDuration = 600;

    this.stars = [];
    this.accretionParticles = [];

    activeEngines.push(this);
    this.init();
  }

  triggerWarpPulse(duration = 600) {
    this.warpPulseActive = true;
    this.warpPulseStartTime = performance.now();
    this.warpPulseDuration = duration;
  }

  init() {
    if (!this.canvas || !this.ctx) return;

    this.resize();
    this.handleResize = this.resize.bind(this);
    window.addEventListener("resize", this.handleResize);

    this.handleMouseMove = (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = (e.clientY / window.innerHeight) * 2 - 1;
      this.targetMouseX = normX * 30;
      this.targetMouseY = normY * 20;
    };
    window.addEventListener("mousemove", this.handleMouseMove);

    // Populate stars
    const count = this.isAmbient ? Math.floor(STAR_COUNT * 0.65) : STAR_COUNT;
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push(new PinpointStar(this.width, this.height, true));
    }

    // Populate gravitational accretion micro-particles (only for intro dwarf)
    if (!this.isAmbient) {
      this.accretionParticles = [];
      for (let i = 0; i < ACCRETION_PARTICLE_COUNT; i++) {
        this.accretionParticles.push(new AccretionMicroParticle());
      }
    }

    this.start();
  }

  resize() {
    if (!this.canvas) return;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = this.width + "px";
    this.canvas.style.height = this.height + "px";

    if (this.ctx) {
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
      this.ctx.scale(this.dpr, this.dpr);
    }

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  setFlightState(progress, scrollVelocity) {
    this.progress = progress;
    this.scrollVelocity = scrollVelocity;

    const absVelocity = Math.abs(scrollVelocity);
    const progressBoost = Math.pow(progress, 2.0) * 35;
    const velocityBoost = absVelocity * 110;

    this.targetSpeed = this.baseSpeed + progressBoost + velocityBoost;
    if (this.progress > 0.85) {
      // White Dwarf Singularity Dive acceleration
      this.targetSpeed += 60;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    const render = () => {
      if (!this.isRunning) return;
      this.drawFrame();
      this.animId = requestAnimationFrame(render);
    };
    this.animId = requestAnimationFrame(render);
  }

  stop() {
    this.isRunning = false;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener("resize", this.handleResize);
    window.removeEventListener("mousemove", this.handleMouseMove);
  }

  drawFrame() {
    const ctx = this.ctx;
    if (!ctx) return;

    // Check warp pulse state (0.6s burst)
    let pulseFactor = 0;
    if (this.warpPulseActive) {
      const elapsed = performance.now() - this.warpPulseStartTime;
      if (elapsed < this.warpPulseDuration) {
        const t = elapsed / this.warpPulseDuration;
        pulseFactor = Math.sin(t * Math.PI);
        this.targetSpeed = this.baseSpeed + pulseFactor * 26.0;
      } else {
        this.warpPulseActive = false;
        this.targetSpeed = this.baseSpeed;
      }
    }

    this.currentSpeed += (this.targetSpeed - this.currentSpeed) * 0.075;
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.flareAngle += 0.003 + (this.scrollVelocity * 0.08);

    // 1. Pure Pitch-Black Void (#000000)
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.width, this.height);

    const isReversed = this.scrollVelocity < -0.01;
    const isWarping = this.currentSpeed > 7.0;

    const camX = this.centerX + this.mouseX;
    const camY = this.centerY + this.mouseY;

    // 2. Render 3,000+ Pinpoint Stars (No cartoon circles!)
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.update(this.currentSpeed, this.width, this.height, isReversed);

      const scale = FOV / star.z;
      const screenX = star.x * scale + camX;
      const screenY = star.y * scale + camY;

      if (screenX < -20 || screenX > this.width + 20 || screenY < -20 || screenY > this.height + 20) {
        continue;
      }

      // Depth alpha & subtle twinkling
      const depthRatio = Math.max(0.12, 1.0 - (star.z / MAX_Z));
      const twinkle = 0.65 + Math.sin(star.twinklePhase) * 0.35;
      const alpha = Math.min(1.0, depthRatio * twinkle);
      const col = star.color;

      const isStreaking = (isWarping && !this.isAmbient) || (this.isAmbient && pulseFactor > 0.05);

      if (isStreaking) {
        // High speed starlight streak: razor thin line streaking outward
        const streakDistance = this.isAmbient ? pulseFactor * 3.5 : 1.0;
        const prevScale = FOV / (star.z + this.currentSpeed * streakDistance);
        const prevX = star.x * prevScale + camX;
        const prevY = star.y * prevScale + camY;

        const streakAlpha = this.isAmbient ? Math.min(1.0, alpha * (0.6 + pulseFactor * 0.4)) : alpha * 0.85;
        ctx.strokeStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${streakAlpha.toFixed(2)})`;
        ctx.lineWidth = Math.min(1.5, Math.max(0.6, star.baseRadius * scale));
        ctx.beginPath();
        ctx.moveTo(prevX, prevY);
        ctx.lineTo(screenX, screenY);
        ctx.stroke();
      } else {
        // Crisp pinpoint dot: clamped strictly to 0.4px - 1.8px
        const radius = Math.min(1.8, Math.max(0.4, star.baseRadius * scale));
        ctx.fillStyle = `rgba(${col.r}, ${col.g}, ${col.b}, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3. Render the White Dwarf Star
    if (this.isAmbient) {
      // Ambient Mode: Distant glowing White Dwarf in upper-right with starlight flare & scroll parallax
      const scrollShiftY = (window.scrollY || 0) * 0.15;
      const dwarfX = this.width * 0.76 + this.mouseX * 0.5;
      const dwarfY = this.height * 0.22 + this.mouseY * 0.5 - scrollShiftY;

      const dynamicRadius = 5.5 + pulseFactor * 3.0;
      const dynamicHalo = 95 + pulseFactor * 130;
      const dynamicAlpha = 0.85 + pulseFactor * 0.35;
      const dynamicFlare = 320 + pulseFactor * 200;

      this.renderWhiteDwarfStar(ctx, dwarfX, dwarfY, dynamicRadius, dynamicHalo, dynamicAlpha, dynamicFlare);

      // Soft starlight halo wave flash during warp pulse
      if (pulseFactor > 0.04) {
        ctx.save();
        const haloGrad = ctx.createRadialGradient(dwarfX, dwarfY, 5, dwarfX, dwarfY, dynamicHalo * 1.6);
        haloGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.45 * pulseFactor).toFixed(2)})`);
        haloGrad.addColorStop(0.35, `rgba(245, 208, 138, ${(0.28 * pulseFactor).toFixed(2)})`);
        haloGrad.addColorStop(1, "transparent");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(dwarfX, dwarfY, dynamicHalo * 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else {
      // Intro Mode: Hyper-dense White Dwarf approaching viewer
      // Progress 0.0 -> 1.0 drives the star from distance to camera engulfment
      let starRadius = 3.0;
      let haloRadius = 70;
      let flareLength = 200;
      let coreAlpha = 1.0;

      if (this.progress < 0.25) {
        // Emergence
        const t = this.progress / 0.25;
        starRadius = 2.0 + t * 4.5;
        haloRadius = 40 + t * 75;
        flareLength = 100 + t * 180;
        coreAlpha = 0.5 + t * 0.5;
      } else if (this.progress < 0.55) {
        // Stellar Approach & Identity
        const t = (this.progress - 0.25) / 0.30;
        starRadius = 6.5 + t * 12.0;
        haloRadius = 115 + t * 110;
        flareLength = 280 + t * 240;
      } else if (this.progress < 0.85) {
        // Gravitational Acceleration
        const t = (this.progress - 0.55) / 0.30;
        starRadius = 18.5 + t * 24.0;
        haloRadius = 225 + t * 180;
        flareLength = 520 + t * 300;
      } else {
        // 85% - 100%: Super-Luminosity dive into heart of White Dwarf
        const t = (this.progress - 0.85) / 0.15;
        starRadius = 42.5 + Math.pow(t, 2.2) * (Math.max(this.width, this.height) * 0.75);
        haloRadius = 405 + t * 650;
        flareLength = 820 + t * 800;
      }

      // Draw Gravitational Micro-Particles spiraling into core
      if (this.progress < 0.88) {
        for (let i = 0; i < this.accretionParticles.length; i++) {
          const mp = this.accretionParticles[i];
          mp.update(this.progress + Math.abs(this.scrollVelocity));
          const pX = camX + Math.cos(mp.angle) * mp.dist;
          const pY = camY + Math.sin(mp.angle) * (mp.dist * 0.65); // Elliptical inclination
          const pAlpha = mp.alpha * (1 - (this.progress * 0.5));

          ctx.fillStyle = `rgba(255, 255, 255, ${pAlpha.toFixed(2)})`;
          ctx.beginPath();
          ctx.arc(pX, pY, mp.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      this.renderWhiteDwarfStar(ctx, camX, camY, starRadius, haloRadius, coreAlpha, flareLength);
    }
  }

  /**
   * Render ultra-realistic incandescent White Dwarf core, radial corona, and anamorphic flares
   */
  renderWhiteDwarfStar(ctx, x, y, coreRadius, haloRadius, alpha, flareSpan) {
    if (alpha <= 0.01) return;

    // A. Outer Accretion Corona (Soft radial transition from pure white -> ice-white -> deep black)
    const haloGrad = ctx.createRadialGradient(x, y, coreRadius * 0.5, x, y, haloRadius);
    haloGrad.addColorStop(0, `rgba(255, 255, 255, ${(0.95 * alpha).toFixed(3)})`);
    haloGrad.addColorStop(0.18, `rgba(240, 246, 255, ${(0.70 * alpha).toFixed(3)})`);
    haloGrad.addColorStop(0.42, `rgba(215, 235, 255, ${(0.35 * alpha).toFixed(3)})`);
    haloGrad.addColorStop(0.75, `rgba(180, 215, 255, ${(0.10 * alpha).toFixed(3)})`);
    haloGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(x, y, haloRadius, 0, Math.PI * 2);
    ctx.fill();

    // B. Anamorphic Lens Flare & Diffraction Spikes (Razor-thin 1px - 2px starlight spikes)
    if (flareSpan > 40 && this.progress < 0.90) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(this.flareAngle);

      // Horizontal primary flare
      const hGrad = ctx.createLinearGradient(-flareSpan, 0, flareSpan, 0);
      hGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      hGrad.addColorStop(0.35, `rgba(215, 235, 255, ${(0.35 * alpha).toFixed(2)})`);
      hGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(0.95 * alpha).toFixed(2)})`);
      hGrad.addColorStop(0.65, `rgba(215, 235, 255, ${(0.35 * alpha).toFixed(2)})`);
      hGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = hGrad;
      ctx.fillRect(-flareSpan, -1.0, flareSpan * 2, 2.0);

      // Vertical secondary flare
      const vSpan = flareSpan * 0.65;
      const vGrad = ctx.createLinearGradient(0, -vSpan, 0, vSpan);
      vGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      vGrad.addColorStop(0.35, `rgba(215, 235, 255, ${(0.25 * alpha).toFixed(2)})`);
      vGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(0.85 * alpha).toFixed(2)})`);
      vGrad.addColorStop(0.65, `rgba(215, 235, 255, ${(0.25 * alpha).toFixed(2)})`);
      vGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = vGrad;
      ctx.fillRect(-0.75, -vSpan, 1.5, vSpan * 2);

      // Diagonal subtle 45deg spike
      ctx.rotate(Math.PI / 4);
      const diagSpan = flareSpan * 0.35;
      const dGrad = ctx.createLinearGradient(-diagSpan, 0, diagSpan, 0);
      dGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
      dGrad.addColorStop(0.5, `rgba(255, 255, 255, ${(0.40 * alpha).toFixed(2)})`);
      dGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = dGrad;
      ctx.fillRect(-diagSpan, -0.6, diagSpan * 2, 1.2);

      ctx.restore();
    }

    // C. Hyper-Dense Incandescent White Dwarf Core (#FFFFFF)
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.2, coreRadius), 0, Math.PI * 2);
    ctx.fill();
  }
}

export function triggerWarpPulse(duration = 600) {
  activeEngines.forEach(eng => {
    if (eng && typeof eng.triggerWarpPulse === "function") {
      eng.triggerWarpPulse(duration);
    }
  });
}

if (typeof window !== "undefined") {
  window.triggerWarpPulse = triggerWarpPulse;
}
