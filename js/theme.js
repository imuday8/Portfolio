/**
 * Tectonic Light — Theme Controller
 * Dual Mode: Signature Warm Ivory Editorial ("Light") & Charcoal Ink ("Dark").
 * Guards against storage exceptions & synchronizes with UI telemetry.
 */

const THEME_STORAGE_KEY = 'tectonic_light_theme_mode';

export function getPreferredTheme() {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch (e) {}

  try {
    // Default to signature light editorial presentation
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    return 'light';
  }
}

export function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (e) {}

  const toggleButtons = document.querySelectorAll('.theme-toggle-btn, .theme-switcher-btn');
  toggleButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    const label = btn.querySelector('.theme-label');
    if (label) {
      label.textContent = theme === 'dark' ? 'Light' : 'Dark';
    }
  });
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}

export function initTheme() {
  const initial = getPreferredTheme();
  applyTheme(initial);

  const toggleButtons = document.querySelectorAll('.theme-toggle-btn, .theme-switcher-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleTheme();
    });
  });

  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      try {
        if (!localStorage.getItem(THEME_STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    });
  } catch (e) {}
}
