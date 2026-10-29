/**
 * Obsidian Monolith — Cinematic Video-Style Section Transition Engine
 * - Observes all sections: #hero, #telemetry, #projects, #capabilities, #about, #contact
 * - Triggers 0.6s background starfield warp pulse on every section transition
 * - Plays celestial starlight chime accent on section entrance
 * - Applies luxury holographic entrance classes (.is-visible, .in-view)
 */

import { triggerWarpPulse } from "./warptunnel.js";
import { playStarlightChime } from "./audio.js";

let currentActiveSectionId = "hero";

export function initSectionTransitions() {
  const sections = document.querySelectorAll("section, .monolith-section, .hero-section");
  if (!sections || sections.length === 0) return;

  // Immediate visibility check for sections already in viewport on load
  const checkInitialVisibility = () => {
    const winHeight = typeof window !== "undefined" ? window.innerHeight : 900;
    sections.forEach(section => {
      if (typeof section.getBoundingClientRect === "function") {
        const rect = section.getBoundingClientRect();
        if (rect.top < winHeight * 0.90 || section.id === "hero") {
          section.classList.add("is-visible");
          section.classList.add("in-view");
        }
      } else {
        section.classList.add("is-visible");
        section.classList.add("in-view");
      }
    });
  };

  // Modern IntersectionObserver for buttery-smooth kinetic reveal & warp bursts
  if (typeof window !== "undefined" && "IntersectionObserver" in window) {
    const observerOptions = {
      root: null,
      threshold: 0.18,
      rootMargin: "0px 0px -10% 0px"
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          entry.target.classList.add("in-view");

          const newId = entry.target.id;
          if (newId && newId !== currentActiveSectionId) {
            currentActiveSectionId = newId;

            // Trigger 0.6s starfield warp pulse & starlight chime
            try {
              triggerWarpPulse(600);
              playStarlightChime(523.25, 659.25);
            } catch (e) {}
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => {
      sectionObserver.observe(section);
    });
  } else {
    // Fallback: make all sections visible immediately
    sections.forEach(section => {
      section.classList.add("is-visible");
      section.classList.add("in-view");
    });
  }

  // Trigger initial check
  setTimeout(checkInitialVisibility, 50);
}

