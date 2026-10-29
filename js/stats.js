/**
 * Obsidian Monolith — Animated Statistics Engine
 * Smooth requestAnimationFrame interpolation with IntersectionObserver.
 * Animates key metrics from 0 to verified targets over 1.2s with easeOutExpo.
 */

function easeOutExpo(x) {
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

export function animateCounter(element, target, duration = 1200, decimals = 0, suffix = '') {
  if (!element) return;
  const startTime = performance.now();
  const startVal = 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutExpo(progress);
    const currentVal = startVal + (target - startVal) * easedProgress;

    element.textContent = currentVal.toFixed(decimals) + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target.toFixed(decimals) + suffix;
    }
  }

  requestAnimationFrame(update);
}

export function initAnimatedStats() {
  const statElements = document.querySelectorAll('[data-counter-target]');
  if (!statElements || statElements.length === 0) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-counter-target'));
        const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
        const suffix = el.getAttribute('data-counter-suffix') || '';

        if (!isNaN(target) && !el.dataset.animated) {
          el.dataset.animated = 'true';
          animateCounter(el, target, 1200, decimals, suffix);
        }
        obs.unobserve(el);
      }
    });
  }, observerOptions);

  statElements.forEach(el => observer.observe(el));
}
