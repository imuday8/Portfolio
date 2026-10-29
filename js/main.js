/**
 * Obsidian Monolith — Main Application Orchestrator
 * Coordinates the 4.5s Monolith Portal intro, Web Audio API soundscape & equalizer,
 * 3D spatial pointer parallax, requestAnimationFrame animated stats,
 * dynamic telemetry renderers, and responsive navigation.
 * Guaranteed safe bootstrap pattern.
 */

import { initPreloader, dismissIntro } from './preloader.js';
import { initAudio } from './audio.js';
import { initMonolith3D } from './monolith3d.js';
import { initAnimatedStats } from './stats.js';
import { renderCompetitiveTelemetry, renderCaseStudy, renderCapabilitiesMatrix, initContactAndDispatch } from './renderer.js';
import { initNavigation } from './navigation.js';
import { initSectionTransitions } from './transitions.js';

if (typeof window !== 'undefined') {
  if (typeof history !== 'undefined' && 'scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  if (typeof window.scrollTo === 'function') {
    window.scrollTo(0, 0);
  }
}

function bootstrap() {
  try {
    // Enforce top landing viewport
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }

    // 1. Cinematic 4.5s Monolith Portal Sequence
    initPreloader();

    // 2. Synchronized Web Audio API Engine
    initAudio();

    // 3. 3D Spatial Monolith Parallax & Kinetic Scroll System
    initMonolith3D();

    // 4. Kinetic Section Transitions & Spring Reveal
    initSectionTransitions();

    // 5. Render Architectural Specification Ledgers
    renderCompetitiveTelemetry();
    renderCaseStudy();
    renderCapabilitiesMatrix();
    initContactAndDispatch();

    // 6. Animated Statistics (IntersectionObserver + requestAnimationFrame)
    initAnimatedStats();

    // 7. Navigation, Mobile Drawer & Replay Intro Handlers
    initNavigation();

    // 8. Magnetic Section Snap Keyboard Navigation (Arrow Keys / PageUp / PageDown)
    initMagneticKeyboardNav();

    // 9. Interactive Cursor Glow Follower for Liquid Glass Cards
    initCursorGlow();

    console.log(
      '%c UDAY SAHA %c OBSIDIAN MONOLITH 3.0 %c 98.93%ile JEE MAIN ',
      'background: #FF623E; color: #030305; font-weight: 800; padding: 4px 8px; border-radius: 2px;',
      'background: #0D111D; color: #F5F3EE; font-weight: 600; padding: 4px 8px; border-radius: 2px; border: 1px solid rgba(255,98,62,0.3);',
      'background: #F3B17A; color: #030305; font-weight: 800; padding: 4px 8px; border-radius: 2px;'
    );
  } catch (err) {
    console.error('Obsidian Monolith bootstrap exception (failsafe engaged):', err);
    dismissIntro(true);
  }
}

function initMagneticKeyboardNav() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  const sections = Array.from(document.querySelectorAll('section, .hero-section, .monolith-section'));
  if (!sections.length) return;

  let isNavigating = false;

  window.addEventListener('keydown', (e) => {
    if (isNavigating) return;
    const activeEl = document.activeElement;
    const tag = activeEl ? (activeEl.tagName ? activeEl.tagName.toLowerCase() : '') : '';
    if (tag === 'input' || tag === 'textarea' || tag === 'select' || activeEl?.isContentEditable) return;

    const portal = document.getElementById('monolith-portal');
    if (portal && !portal.classList.contains('dismissed') && portal.style.display !== 'none') return;

    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      const scrollY = window.pageYOffset || (document.documentElement ? document.documentElement.scrollTop : 0) || 0;
      const nextSection = sections.find(sec => (sec.offsetTop || 0) > scrollY + 40);
      if (nextSection) {
        e.preventDefault();
        isNavigating = true;
        if (typeof nextSection.scrollIntoView === 'function') {
          nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => { isNavigating = false; }, 600);
      }
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      const scrollY = window.pageYOffset || (document.documentElement ? document.documentElement.scrollTop : 0) || 0;
      const prevSections = sections.filter(sec => (sec.offsetTop || 0) < scrollY - 40);
      if (prevSections.length) {
        const prevSection = prevSections[prevSections.length - 1];
        e.preventDefault();
        isNavigating = true;
        if (typeof prevSection.scrollIntoView === 'function') {
          prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setTimeout(() => { isNavigating = false; }, 600);
      }
    }
  });
}

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;
  let mouseX = -1000, mouseY = -1000;
  let curX = -1000, curY = -1000;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!isMoving) {
      isMoving = true;
      glow.style.opacity = '1';
    }
  });

  window.addEventListener('mouseout', () => {
    glow.style.opacity = '0';
    isMoving = false;
  });

  function stepGlow() {
    curX += (mouseX - curX) * 0.12;
    curY += (mouseY - curY) * 0.12;
    glow.style.transform = `translate3d(${curX}px, ${curY}px, 0) translate(-50%, -50%)`;
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(stepGlow);
    }
  }
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(stepGlow);
  }
}

// Immediate execution guard: DOM ready vs DOM loading
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
