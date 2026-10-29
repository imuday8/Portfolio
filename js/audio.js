/**
 * Uday Saha Portfolio — Authentic Deep Space & Cosmic Starlight Soundscape
 *
 * Sound Architecture (Luxury Web Audio API Synthesizer):
 * - Zero motor/car rumble & zero harsh pink noise.
 * - Dreamy Celestial Chord Cluster:
 *     Root: 130.81Hz (C3, pure sine)
 *     Fifth: 196.00Hz (G3, pure sine)
 *     Octave: 261.63Hz (C4, soft triangle)
 *     Shimmering Major Third: 329.63Hz (E4, pure sine)
 * - Routed through gentle 450Hz low-pass filter with long, lush 2.2s attack / 3.5s release envelopes.
 * - Starlight Chime Accents: high-frequency 523.25Hz (C5) and 659.25Hz (E5) with exponential decay.
 * - Auto-Unlock Gesture: Automatically initializes and unlocks on first interaction.
 */

export class SoundEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.filter = null;
    this.isMuted = true; // Initial uncalibrated state until first gesture / toggle
    this.voices = [];
    this.voiceGains = [];
    this.isInitialized = false;
    this.ambientRunning = false;
  }

  initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return null;

      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      const initialGain = this.isMuted ? 0.0001 : 0.14;
      this.masterGain.gain.setValueAtTime(initialGain, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Master Celestial Lowpass Filter (450Hz)
      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.setValueAtTime(450, this.ctx.currentTime);
      this.filter.Q.setValueAtTime(1.2, this.ctx.currentTime);
      this.filter.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === "suspended") {
      try {
        const p = this.ctx.resume();
        if (p && typeof p.catch === "function") p.catch(() => {});
      } catch (e) {}
    }

    if (!this.isMuted) {
      this.masterGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
      this.startAmbientPad();
    } else {
      this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    }

    return this.ctx;
  }

  toggle() {
    this.isMuted = !this.isMuted;

    if (!this.ctx) {
      this.initContext();
    } else {
      if (this.ctx.state === "suspended") {
        try {
          const p = this.ctx.resume();
          if (p && typeof p.catch === "function") p.catch(() => {});
        } catch (e) {}
      }
    }

    const now = this.ctx ? this.ctx.currentTime : 0;
    if (!this.isMuted) {
      if (this.masterGain) {
        if (typeof this.masterGain.gain.linearRampToValueAtTime === "function") {
          this.masterGain.gain.linearRampToValueAtTime(0.14, now + 0.3);
        } else {
          this.masterGain.gain.setValueAtTime(0.14, now);
        }
      }
      this.startAmbientPad();
      this.updateUI(true);
      return true;
    } else {
      if (this.masterGain) {
        if (typeof this.masterGain.gain.linearRampToValueAtTime === "function") {
          this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.3);
        } else {
          this.masterGain.gain.setValueAtTime(0.0001, now);
        }
      }
      this.stopAmbientPad();
      this.updateUI(false);
      return false;
    }
  }

  startAmbientPad() {
    if (this.ambientRunning || !this.ctx) return;
    this.ambientRunning = true;
    const now = this.ctx.currentTime;

    // Peaceful celestial chord frequencies: C3, G3, C4, E4
    const chordVoices = [
      { freq: 130.81, type: "sine", gain: 0.045 },
      { freq: 196.00, type: "sine", gain: 0.038 },
      { freq: 261.63, type: "triangle", gain: 0.028 },
      { freq: 329.63, type: "sine", gain: 0.032 }
    ];

    this.voices = [];
    this.voiceGains = [];

    chordVoices.forEach(({ freq, type, gain }) => {
      const osc = this.ctx.createOscillator();
      const vGain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      vGain.gain.setValueAtTime(0.0001, now);
      if (typeof vGain.gain.linearRampToValueAtTime === "function") {
        vGain.gain.linearRampToValueAtTime(gain, now + 2.2); // 2.2s lush attack
      } else {
        vGain.gain.setValueAtTime(gain, now);
      }

      osc.connect(vGain);
      vGain.connect(this.filter || this.masterGain);
      osc.start(now);

      this.voices.push(osc);
      this.voiceGains.push(vGain);
    });
  }

  stopAmbientPad() {
    if (!this.ambientRunning || !this.ctx) return;
    const now = this.ctx.currentTime;

    this.voiceGains.forEach(vGain => {
      if (typeof vGain.gain.linearRampToValueAtTime === "function") {
        vGain.gain.linearRampToValueAtTime(0.0001, now + 0.6); // smooth decay
      } else {
        vGain.gain.setValueAtTime(0.0001, now);
      }
    });

    const oldVoices = [...this.voices];
    setTimeout(() => {
      oldVoices.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
    }, 700);

    this.voices = [];
    this.voiceGains = [];
    this.ambientRunning = false;
  }

  playChime(f1 = 523.25, f2 = 659.25) {
    if (this.isMuted || !this.ctx) return;
    try {
      if (this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;
      const chimeGain = this.ctx.createGain();
      chimeGain.gain.setValueAtTime(0.0001, now);
      if (typeof chimeGain.gain.linearRampToValueAtTime === "function") {
        chimeGain.gain.linearRampToValueAtTime(0.045, now + 0.02);
        if (typeof chimeGain.gain.exponentialRampToValueAtTime === "function") {
          chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        }
      } else {
        chimeGain.gain.setValueAtTime(0.045, now);
      }
      chimeGain.connect(this.masterGain);

      const osc1 = this.ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(f1, now);
      osc1.connect(chimeGain);

      const osc2 = this.ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(f2, now);
      osc2.connect(chimeGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.3);
      osc2.stop(now + 1.3);
    } catch (e) {}
  }

  updateScrollReactive(scrollVelocity, currentProgress) {
    if (this.isMuted || !this.ctx || !this.filter) return;
    try {
      const now = this.ctx.currentTime;
      const absVel = Math.abs(scrollVelocity);
      // Breathing cutoff frequency (450Hz -> 850Hz with velocity)
      const targetCutoff = Math.min(450 + absVel * 900 + currentProgress * 200, 950);
      if (typeof this.filter.frequency.setTargetAtTime === "function") {
        this.filter.frequency.setTargetAtTime(targetCutoff, now, 0.08);
      } else if (typeof this.filter.frequency.setValueAtTime === "function") {
        this.filter.frequency.setValueAtTime(targetCutoff, now);
      }
    } catch (e) {}
  }

  updateUI(active) {
    const buttons = document.querySelectorAll(".audio-telemetry-toggle, .sound-toggle-btn");
    buttons.forEach(btn => {
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
      const label = btn.querySelector(".sound-label, .audio-label");
      if (label) {
        label.textContent = active ? "SOUND ON" : "SOUND OFF";
      }
      const eqBars = btn.querySelectorAll(".eq-bar");
      eqBars.forEach(bar => {
        bar.classList.toggle("playing", active);
      });
      btn.setAttribute("aria-label", active ? "Mute ambient sound (M)" : "Enable sound (M)");
    });
  }
}

export const soundEngine = new SoundEngine();

export function getAudioContext() {
  if (!soundEngine.ctx) {
    soundEngine.initContext();
  }
  return soundEngine.ctx;
}

export function isSoundActive() {
  return !soundEngine.isMuted;
}

export function setAudioActive(active) {
  if (active === soundEngine.isMuted) {
    soundEngine.toggle();
  }
}

export function toggleAudio() {
  return soundEngine.toggle();
}

export function updateAudioUI(active) {
  soundEngine.updateUI(active);
}

export function updateScrollSynth(scrollVelocity, currentProgress) {
  soundEngine.updateScrollReactive(scrollVelocity, currentProgress);
}

export function playStarlightChime(f1 = 523.25, f2 = 659.25) {
  soundEngine.playChime(f1, f2);
}

export function playMonolithAtmosphere() {
  soundEngine.playChime(261.63, 392.00);
}

export function playTypographicShimmer() {
  soundEngine.playChime(523.25, 659.25);
}

export function playPortalExpansion() {
  soundEngine.playChime(659.25, 783.99);
}

export function initAudio() {
  soundEngine.updateUI(!soundEngine.isMuted);

  // Seamless auto-unlock on first physical interaction
  const unlockAudio = async () => {
    if (soundEngine.isMuted) {
      await soundEngine.toggle();
    } else {
      await soundEngine.initContext();
    }

    window.removeEventListener("wheel", unlockAudio);
    window.removeEventListener("mousemove", unlockAudio);
    window.removeEventListener("touchstart", unlockAudio);
    window.removeEventListener("pointerdown", unlockAudio);
    window.removeEventListener("keydown", unlockAudio);
  };

  window.addEventListener("wheel", unlockAudio, { passive: true, once: true });
  window.addEventListener("mousemove", unlockAudio, { passive: true, once: true });
  window.addEventListener("touchstart", unlockAudio, { passive: true, once: true });
  window.addEventListener("pointerdown", unlockAudio, { passive: true, once: true });
  window.addEventListener("keydown", unlockAudio, { passive: true, once: true });

  // Sound toggle button click listeners
  const buttons = document.querySelectorAll(".audio-telemetry-toggle, .sound-toggle-btn");
  buttons.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      soundEngine.toggle();
    };
  });
}


