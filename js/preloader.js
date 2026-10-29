/**
 * Obsidian Monolith 3.3 — 8-Second 3D Cosmic Warp Tunnel Controller
 *
 * Core Architecture:
 * - 100vw × 100vh full-screen 3D Canvas / WebGL experience (Zero rectangular monolith boxes!)
 * - True 8-Second Weighted Virtual Scroll Engine (TOTAL_SCROLL_UNITS = 6500, lerp = 0.045)
 * - 5 Choreographed 3D Camera Chapters:
 *   * Chapter 1 (0% - 20%): Ambient nebula dust, pulsing scroll-wheel cue, top-left glass audio pill
 *   * Chapter 2 (20% - 45%): 3D Typography "UDAY SAHA" emerging and flying past camera
 *   * Chapter 3 (45% - 70%): Holographic subtitle "FRONTEND ENGINEER · COMPETITIVE PROGRAMMER · AI EXPLORER"
 *   * Chapter 4 (70% - 92%): Floating glass HUD tags (98.93%ILE JEE MAIN · 1045 CF MAX · MEDMATCH AI)
 *   * Chapter 5 (92% - 100%): Singularity burst & gateway flash into Hero section
 * - 8-second automated camera flight upon clicking [ ENTER WITH SOUND 🔊 ]
 * - Direct scroll-reactive spatial synth tie-in
 */

import { CosmicWarpEngine } from "./warptunnel.js";
import {
  getAudioContext,
  toggleAudio,
  setAudioActive,
  updateScrollSynth,
  playMonolithAtmosphere,
  playTypographicShimmer,
  playPortalExpansion
} from "./audio.js";

const SESSION_KEY = "obsidian_monolith_intro_v3";
const TOTAL_SCROLL_UNITS = 12000;

let isDismissed = false;
let watchdogTimer = null;
let animFrameId = null;
let warpEngine = null;
let bgEngine = null;

// Virtual scroll physics state
let scrollUnits = 0;
let targetProgress = 0;
let currentProgress = 0;
let lastProgress = 0;
let scrollVelocity = 0;

// Auto-flight parameters (for 14-second cinematic flight)
let isAutoFlight = false;
let autoFlightStartTime = 0;
let autoFlightDuration = 14000;

// Sonic chapter triggers (fire once per flight)
let ch1Fired = false;
let ch2Fired = false;
let ch4Fired = false;
let ch5Fired = false;

export function shouldBypassIntro() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("intro") === "1" || urlParams.get("intro") === "true") {
      return false;
    }
    if (sessionStorage.getItem(SESSION_KEY) === "calibrated") {
      return true;
    }
  } catch (e) {}

  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return true;
    }
  } catch (e) {}

  return false;
}

export function dismissIntro(immediate = false) {
  if (isDismissed) return;
  isDismissed = true;

  if (watchdogTimer) {
    clearTimeout(watchdogTimer);
    watchdogTimer = null;
  }

  if (animFrameId) {
    if (typeof cancelAnimationFrame === "function") {
      cancelAnimationFrame(animFrameId);
    } else {
      clearTimeout(animFrameId);
    }
    animFrameId = null;
  }

  try {
    sessionStorage.setItem(SESSION_KEY, "calibrated");
  } catch (e) {}

  // Stop portal warp engine
  if (warpEngine) {
    warpEngine.stop();
  }

  // Start persistent background starfield canvas
  initBackgroundCanvas();

  const portal = document.getElementById("monolith-portal");
  if (portal) {
    portal.setAttribute("aria-hidden", "true");
    portal.classList.add("dismissed");
    portal.style.opacity = "0";
    portal.style.pointerEvents = "none";

    if (immediate) {
      portal.style.display = "none";
    } else {
      setTimeout(() => {
        portal.style.display = "none";
      }, 500);
    }
  }

  document.body.classList.add("portal-unlocked");
  if (typeof window !== "undefined") {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (typeof window.scrollTo === "function") {
      window.scrollTo(0, 0);
    }
  }
  const heroRevealElements = document.querySelectorAll(".hero-fade-in");
  heroRevealElements.forEach(el => el.classList.add("visible"));
}

/**
 * Initialize persistent cosmic background canvas behind main website
 */
function initBackgroundCanvas() {
  const bgCanvas = document.getElementById("cosmic-bg-canvas");
  if (bgCanvas && !bgEngine) {
    bgEngine = new CosmicWarpEngine(bgCanvas, true);
  }
}

/**
 * Start automated 14-second camera flight
 */
export function startAutoFlight(withSound = true, durationMs = 14000) {
  if (withSound) {
    setAudioActive(true);
  }
  isAutoFlight = true;
  autoFlightDuration = durationMs;
  autoFlightStartTime = performance.now();
  targetProgress = 1.0;
}

/**
 * Programmatic sequence execution (compatible with existing tests & buttons)
 */
export function executeSequence(withSound = true) {
  if (isDismissed) return;

  const portal = document.getElementById("monolith-portal");
  if (!portal) {
    dismissIntro(true);
    return;
  }

  try {
    sessionStorage.setItem(SESSION_KEY, "calibrated");
  } catch (e) {}

  portal.classList.add("animating");
  portal.classList.add("phase-atmosphere");

  // Run 14-second cinematic auto-flight
  startAutoFlight(withSound, 14000);
}

/**
 * Reset and replay the 8-second 3D Cosmic Warp Tunnel
 */
export function replayIntro() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (e) {}

  isDismissed = false;
  scrollUnits = 0;
  targetProgress = 0;
  currentProgress = 0;
  lastProgress = 0;
  scrollVelocity = 0;
  isAutoFlight = false;
  ch1Fired = false;
  ch2Fired = false;
  ch4Fired = false;
  ch5Fired = false;

  const portal = document.getElementById("monolith-portal");
  if (portal) {
    portal.classList.remove("dismissed", "animating", "phase-atmosphere", "phase-typography", "phase-tagline", "phase-expansion");
    portal.style.display = "flex";
    portal.style.opacity = "1";
    portal.style.pointerEvents = "auto";
    portal.removeAttribute("aria-hidden");
    document.body.classList.remove("portal-unlocked");

    initPreloader();
  } else {
    window.location.search = "?intro=1";
  }
}

if (typeof window !== "undefined") {
  window.replayIntro = replayIntro;
  window.dismissIntro = dismissIntro;
}

/**
 * Update 3D Camera Chapters during the 8-second scroll flight
 */
function updateChapterVisuals(progress, velocity) {
  // Feed flight state to 3D Canvas Warp Engine
  if (warpEngine) {
    warpEngine.setFlightState(progress, velocity);
  }

  // Feed velocity to Web Audio Synthesizer
  updateScrollSynth(velocity, progress);

  const cueEl = document.getElementById("warp-scroll-cue");
  const ch2El = document.getElementById("warp-chapter-2");
  const ch3El = document.getElementById("warp-chapter-3");
  const ch4El = document.getElementById("warp-chapter-4");
  const flashEl = document.getElementById("warp-singularity-flash");

  // 1. Chapter 1 (0% - 20%): Scroll Cue Icon & Text
  if (cueEl) {
    if (progress < 0.18) {
      const alpha = 1.0 - (progress / 0.18);
      cueEl.style.opacity = alpha.toFixed(3);
      cueEl.style.transform = `translate(-50%, ${(progress * 40).toFixed(1)}px)`;
    } else {
      cueEl.style.opacity = "0";
      cueEl.style.pointerEvents = "none";
    }
  }

  // Chapter 1 Audio Atmosphere
  if (progress > 0.02 && !ch1Fired) {
    ch1Fired = true;
    playMonolithAtmosphere();
  }

  // 2. Chapter 2 (18% - 48%): "UDAY SAHA" 3D Typography
  if (ch2El) {
    if (progress >= 0.16 && progress <= 0.50) {
      const t = (progress - 0.16) / 0.34;
      // Scale from deep background (0.35) toward viewer (2.8)
      const scale = 0.35 + Math.pow(t, 1.4) * 2.6;
      const tz = -600 + t * 950;
      // Fade in quickly, stay bright, then fade out as it flies past
      let opacity = 0;
      if (t < 0.25) opacity = t / 0.25;
      else if (t > 0.75) opacity = (1.0 - t) / 0.25;
      else opacity = 1.0;

      ch2El.style.opacity = opacity.toFixed(3);
      ch2El.style.transform = `perspective(800px) translate3d(0, 0, ${tz.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      ch2El.style.display = "flex";

      if (t > 0.3 && !ch2Fired) {
        ch2Fired = true;
        playTypographicShimmer();
      }
    } else {
      ch2El.style.opacity = "0";
      ch2El.style.display = "none";
    }
  }

  // 3. Chapter 3 (44% - 74%): Holographic Subtitle
  if (ch3El) {
    if (progress >= 0.44 && progress <= 0.74) {
      const t = (progress - 0.44) / 0.30;
      const scale = 0.45 + Math.pow(t, 1.3) * 2.2;
      const tz = -500 + t * 850;
      let opacity = 0;
      if (t < 0.25) opacity = t / 0.25;
      else if (t > 0.75) opacity = (1.0 - t) / 0.25;
      else opacity = 1.0;

      ch3El.style.opacity = opacity.toFixed(3);
      ch3El.style.transform = `perspective(800px) translate3d(0, 0, ${tz.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      ch3El.style.display = "flex";
    } else {
      ch3El.style.opacity = "0";
      ch3El.style.display = "none";
    }
  }

  // 4. Chapter 4 (68% - 94%): Glass HUD Badges
  if (ch4El) {
    if (progress >= 0.68 && progress <= 0.94) {
      const t = (progress - 0.68) / 0.26;
      const scale = 0.5 + t * 1.8;
      const tz = -400 + t * 750;
      let opacity = 0;
      if (t < 0.20) opacity = t / 0.20;
      else if (t > 0.80) opacity = (1.0 - t) / 0.20;
      else opacity = 1.0;

      ch4El.style.opacity = opacity.toFixed(3);
      ch4El.style.transform = `perspective(800px) translate3d(0, 0, ${tz.toFixed(1)}px) scale(${scale.toFixed(3)})`;
      ch4El.style.display = "flex";

      if (t > 0.3 && !ch4Fired) {
        ch4Fired = true;
      }
    } else {
      ch4El.style.opacity = "0";
      ch4El.style.display = "none";
    }
  }

  // 5. Chapter 5 (90% - 100%): Singularity Burst & Gateway
  if (flashEl) {
    if (progress > 0.90) {
      const flashT = (progress - 0.90) / 0.10;
      flashEl.style.opacity = (Math.pow(flashT, 2.0)).toFixed(3);
      flashEl.style.pointerEvents = "auto";
    } else {
      flashEl.style.opacity = "0";
      flashEl.style.pointerEvents = "none";
    }
  }

  // Class synchronization for backward testing assertions
  const portal = document.getElementById("monolith-portal");
  if (portal) {
    if (progress > 0.04) portal.classList.add("phase-atmosphere");
    if (progress > 0.25) portal.classList.add("phase-typography");
    if (progress > 0.50) portal.classList.add("phase-tagline");
    if (progress > 0.80) portal.classList.add("phase-expansion");
  }
}

/**
 * Main physics step loop
 */
function runPhysicsStep() {
  if (isDismissed) return;

  if (isAutoFlight) {
    // 8-Second Cinematic Automated Flight
    const elapsed = performance.now() - autoFlightStartTime;
    const flightT = Math.min(1.0, elapsed / autoFlightDuration);
    targetProgress = flightT;
    currentProgress = flightT;
  } else {
    // True 8-Second Weighted Scroll Physics: Damped virtual scroll (lerp = 0.045)
    currentProgress += (targetProgress - currentProgress) * 0.045;
  }

  scrollVelocity = currentProgress - lastProgress;
  lastProgress = currentProgress;

  updateChapterVisuals(currentProgress, scrollVelocity);

  // Singularity Gateway Resolution at 99.2%+
  if (currentProgress >= 0.992) {
    if (!ch5Fired) {
      ch5Fired = true;
      playPortalExpansion();
    }
    setTimeout(() => {
      dismissIntro(false);
    }, 280);
    return;
  }

  if (typeof requestAnimationFrame === "function") {
    animFrameId = requestAnimationFrame(runPhysicsStep);
  } else {
    animFrameId = setTimeout(runPhysicsStep, 16);
  }
}

export function initPreloader() {
  if (typeof window !== "undefined") {
    if (typeof history !== "undefined" && "scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    if (typeof window.scrollTo === "function") {
      window.scrollTo(0, 0);
    }
  }

  const portal = document.getElementById("monolith-portal");
  if (!portal) {
    dismissIntro(true);
    return;
  }

  if (shouldBypassIntro()) {
    dismissIntro(true);
    return;
  }

  // Reset physics state
  scrollUnits = 0;
  targetProgress = 0;
  currentProgress = 0;
  lastProgress = 0;
  scrollVelocity = 0;
  isAutoFlight = false;
  ch1Fired = false;
  ch2Fired = false;
  ch4Fired = false;
  ch5Fired = false;

  // Initialize 3D Canvas Warp Tunnel Engine
  const canvas = document.getElementById("warp-tunnel-canvas");
  if (canvas) {
    if (!warpEngine) {
      warpEngine = new CosmicWarpEngine(canvas, false);
    } else {
      warpEngine.start();
    }
  }

  updateChapterVisuals(0, 0);

  // Start smooth physics rendering loop
  if (typeof requestAnimationFrame === "function") {
    animFrameId = requestAnimationFrame(runPhysicsStep);
  } else {
    animFrameId = setTimeout(runPhysicsStep, 16);
  }

  // Auto-start 14-second White Dwarf flight with space audio active
  setTimeout(() => {
    if (!isDismissed) {
      executeSequence(true);
    }
  }, 150);

  // --------------------------------------------------------------------------
  // Weighted Virtual Scroll Listener (True 14-Second Cumulative Distance)
  // --------------------------------------------------------------------------
  const wheelHandler = (e) => {
    if (isDismissed) return;
    e.preventDefault();

    if (isAutoFlight) {
      isAutoFlight = false;
      scrollUnits = currentProgress * TOTAL_SCROLL_UNITS;
    }

    // Reset emergency watchdog on active user interaction
    if (watchdogTimer) {
      clearTimeout(watchdogTimer);
      watchdogTimer = setTimeout(() => {
        if (!isDismissed) dismissIntro(false);
      }, 20000);
    }

    // Cap maximum wheel delta per frame to 60 units
    const delta = Math.min(Math.abs(e.deltaY), 60) * Math.sign(e.deltaY);
    scrollUnits = Math.max(0, Math.min(TOTAL_SCROLL_UNITS, scrollUnits + delta));
    targetProgress = scrollUnits / TOTAL_SCROLL_UNITS;
  };
  portal.addEventListener("wheel", wheelHandler, { passive: false });

  // Touch Drag Support (Mobile & Trackpad)
  let touchStartY = 0;
  let isTouching = false;

  const onTouchStart = (e) => {
    if (isDismissed) return;
    if (isAutoFlight) {
      isAutoFlight = false;
      scrollUnits = currentProgress * TOTAL_SCROLL_UNITS;
    }
    isTouching = true;
    touchStartY = e.touches ? e.touches[0].clientY : e.clientY;
  };

  const onTouchMove = (e) => {
    if (!isTouching || isDismissed) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = (touchStartY - clientY) * 2.2;
    touchStartY = clientY;

    const clampedDelta = Math.min(Math.abs(deltaY), 50) * Math.sign(deltaY);
    scrollUnits = Math.max(0, Math.min(TOTAL_SCROLL_UNITS, scrollUnits + clampedDelta));
    targetProgress = scrollUnits / TOTAL_SCROLL_UNITS;
  };

  const onTouchEnd = () => {
    isTouching = false;
  };

  portal.addEventListener("touchstart", onTouchStart, { passive: true });
  window.addEventListener("touchmove", onTouchMove, { passive: true });
  window.addEventListener("touchend", onTouchEnd, { passive: true });

  // Keyboard Arrow Support
  const keyNavHandler = (e) => {
    if (isDismissed) return;
    const tag = document.activeElement?.tagName?.toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select" || document.activeElement?.isContentEditable) return;

    if (isAutoFlight) {
      isAutoFlight = false;
      scrollUnits = currentProgress * TOTAL_SCROLL_UNITS;
    }

    if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      scrollUnits = Math.min(TOTAL_SCROLL_UNITS, scrollUnits + 350);
      targetProgress = scrollUnits / TOTAL_SCROLL_UNITS;
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      scrollUnits = Math.max(0, scrollUnits - 350);
      targetProgress = scrollUnits / TOTAL_SCROLL_UNITS;
    }
  };
  window.addEventListener("keydown", keyNavHandler);

  // Action Buttons
  const btnSound = document.getElementById("btn-enter-sound");
  const btnSkip = document.getElementById("btn-skip-intro");
  const btnSilent = document.getElementById("btn-enter-silent");

  if (btnSound) {
    btnSound.onclick = (e) => {
      e.preventDefault();
      executeSequence(true);
    };
  }

  if (btnSilent) {
    btnSilent.onclick = (e) => {
      e.preventDefault();
      executeSequence(false);
    };
  }

  if (btnSkip) {
    btnSkip.onclick = (e) => {
      e.preventDefault();
      dismissIntro(false);
    };
  }

  // Keyboard Shortcut: Escape immediately dismisses intro
  const escHandler = (e) => {
    if (isDismissed) {
      window.removeEventListener("keydown", escHandler);
      return;
    }
    if (e.key === "Escape") {
      const tag = document.activeElement?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select" || document.activeElement?.isContentEditable) return;
      e.preventDefault();
      dismissIntro(false);
      window.removeEventListener("keydown", escHandler);
    }
  };
  window.addEventListener("keydown", escHandler);

  // 20.0s emergency watchdog timer (extended for 14s cinematic journey)
  watchdogTimer = setTimeout(() => {
    if (!isDismissed) {
      console.warn("Obsidian Monolith: Emergency watchdog timer tripped. Dismissing portal safely.");
      dismissIntro(false);
    }
  }, 20000);
}
