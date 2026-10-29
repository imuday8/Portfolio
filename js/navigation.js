/**
 * Navigation Manager
 * Handles sticky header states, active section scroll-spy,
 * accessible mobile drawer with keyboard focus trap, replay intro trigger,
 * and smooth anchor navigation with header offset.
 */

import { replayIntro } from './preloader.js';
import { triggerWarpPulse } from './warptunnel.js';
import { playStarlightChime } from './audio.js';

export function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-drawer-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav-links .nav-link, .header-nav-links .nav-link-item');
  const backToTopBtn = document.querySelector('.back-to-top-btn, #btn-return-datum');
  const replayButtons = document.querySelectorAll('.btn-replay-intro, #btn-replay-intro');

  // --------------------------------------------------------------------------
  // 1. Mobile Drawer & Keyboard Focus Trap
  // --------------------------------------------------------------------------
  let lastFocusedElement = null;

  function openMobileMenu() {
    if (!mobileDrawer) return;
    lastFocusedElement = document.activeElement;
    mobileDrawer.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'true');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const firstFocusable = mobileDrawer.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.onclick = () => {
      const isOpen = mobileDrawer.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    };

    if (mobileCloseBtn) {
      mobileCloseBtn.onclick = closeMobileMenu;
    }

    if (mobileOverlay) {
      mobileOverlay.onclick = closeMobileMenu;
    }

    mobileNavLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
      if (!mobileDrawer.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeMobileMenu();
        return;
      }

      if (e.key === 'Tab') {
        const focusables = Array.from(
          mobileDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
        );
        if (focusables.length === 0) return;

        const firstEl = focusables[0];
        const lastEl = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 2. Smooth Scrolling with Fixed Header Offset
  // --------------------------------------------------------------------------
  const allAnchors = document.querySelectorAll('a[href^="#"]');
  allAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        if (typeof targetEl.scrollIntoView === 'function') {
          targetEl.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        } else if (typeof window.scrollTo === 'function') {
          const headerOffset = 76;
          const elementPosition = typeof targetEl.getBoundingClientRect === 'function' ? targetEl.getBoundingClientRect().top : 0;
          const offsetPosition = elementPosition + (window.pageYOffset || 0) - headerOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }

        try {
          triggerWarpPulse(600);
          playStarlightChime(523.25, 659.25);
        } catch (e) {}
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. Active Section Scroll-Spy via IntersectionObserver
  // --------------------------------------------------------------------------
  const observedSections = document.querySelectorAll('section[id]');
  const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

  if ('IntersectionObserver' in window && observedSections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.getAttribute('id');
          allNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentId}`) {
              link.classList.add('active');
              link.setAttribute('aria-current', 'page');
            } else {
              link.classList.remove('active');
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, observerOptions);

    observedSections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 4. Replay Intro Action Handlers
  // --------------------------------------------------------------------------
  replayButtons.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      replayIntro();
    };
  });

  // --------------------------------------------------------------------------
  // 5. Back-to-Top Button
  // --------------------------------------------------------------------------
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.onclick = (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
  }
}
