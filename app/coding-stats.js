import snapshot from './data/coding-stats.json';

const CACHE_KEY = 'uday-coding-stats-v1';
const REFRESH_MS = 5 * 60 * 1000;
const format = new Intl.NumberFormat('en-IN');
const nonnegative = value => Number.isInteger(value) && value >= 0;
const valid = (name, value) => value && Number.isFinite(Date.parse(value.updatedAt)) && (name === 'leetcode'
  ? ['totalSolved', 'easy', 'medium', 'hard'].every(key => nonnegative(value[key])) && value.totalSolved === value.easy + value.medium + value.hard
  : nonnegative(value.rating) && nonnegative(value.maxRating));
const cards = { leetcode: document.querySelector('.metric-leetcode'), codeforces: document.querySelector('.metric-codeforces') };
const values = { ...snapshot };

function setText(card, field, value) {
  const element = card.querySelector(`[data-stat="${field}"]`);
  if (element) element.textContent = value;
}

function render(name, value, saved = false) {
  if (!valid(name, value)) return;
  const card = cards[name];
  if (!card) return;
  values[name] = value;
  if (name === 'leetcode') {
    setText(card, 'solved', format.format(value.totalSolved));
    for (const key of ['easy', 'medium', 'hard']) setText(card, key, format.format(value[key]));
    const breakdown = card.querySelector('.solve-breakdown');
    breakdown.style.gridTemplateColumns = [value.easy, value.medium, value.hard].map(count => `${Math.max(count, 0.001)}fr`).join(' ');
    breakdown.setAttribute('aria-label', `${value.easy} easy, ${value.medium} medium, and ${value.hard} hard problems solved`);
    const streak = card.querySelector('[data-current-streak]');
    streak.hidden = !nonnegative(value.currentStreak);
    if (!streak.hidden) setText(card, 'streak', `${value.currentStreak}-day`);
  } else {
    setText(card, 'rating', format.format(value.rating));
    setText(card, 'peak', format.format(value.maxRating));
    const rank = typeof value.rank === 'string' ? value.rank : 'unrated';
    setText(card, 'rank', rank.charAt(0).toUpperCase() + rank.slice(1));
    const contests = card.querySelector('[data-contest-count]');
    contests.hidden = !nonnegative(value.ratedContests);
    if (!contests.hidden) setText(card, 'contests', format.format(value.ratedContests));
  }
  const status = card.querySelector('[data-sync-status]');
  const date = new Date(value.updatedAt);
  const stamp = date.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
  status.textContent = `${saved || value.stale ? 'Saved' : 'Updated'} ${stamp}${value.stale ? ' · retrying soon' : ''}`;
  status.title = `Last successful API response: ${date.toISOString()}. Refreshes every five minutes while this page is visible.`;
  status.dataset.state = saved || value.stale ? 'saved' : 'updated';
}

for (const name of Object.keys(cards)) render(name, snapshot[name], true);
try {
  const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
  for (const name of Object.keys(cards)) {
    if (valid(name, cached?.[name]) && Date.parse(cached[name].updatedAt) > Date.parse(values[name].updatedAt)) render(name, cached[name], true);
  }
} catch { /* Storage is optional, including in private browsing. */ }

let loading = false;
let lastAttempt = 0;
async function refresh() {
  if (loading || document.hidden) return;
  loading = true;
  lastAttempt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 22000);
  try {
    // Static GitHub Pages and file previews use the public Vercel API.
    const endpoint = location.hostname.endsWith('vercel.app') || location.hostname === 'localhost' || location.hostname === '127.0.0.1'
      ? '/api/coding-stats' : 'https://portfolio-imuday08-git.vercel.app/api/coding-stats';
    const response = await fetch(endpoint, { signal: controller.signal });
    if (!response.ok) throw new Error('Stats temporarily unavailable');
    const data = await response.json();
    for (const name of Object.keys(cards)) {
      if (valid(name, data[name])) render(name, data[name]);
      else render(name, { ...values[name], stale: true }, true);
    }
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(values)); } catch { /* Optional cache. */ }
  } catch {
    for (const name of Object.keys(cards)) render(name, { ...values[name], stale: true }, true);
  } finally {
    clearTimeout(timer);
    loading = false;
  }
}
refresh();
setInterval(refresh, REFRESH_MS);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden && Date.now() - lastAttempt >= REFRESH_MS) refresh();
});
