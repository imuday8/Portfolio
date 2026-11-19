export const HANDLES = { leetcode: 'Imuday08__', codeforces: 'Imuday08_' };
const DAY = 86400000;

// LeetCode's calendar uses UTC midnight timestamps. Allow today to be unfinished.
export function currentStreak(calendar, now = Date.now()) {
  const active = new Set(Object.entries(calendar).filter(([, count]) => count > 0).map(([time]) => Math.floor(Number(time) * 1000 / DAY)));
  let day = Math.floor(now / DAY);
  if (!active.has(day)) day--;
  let streak = 0;
  while (active.has(day--)) streak++;
  return streak;
}

async function requestJSON(url, options = {}) {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`Upstream HTTP ${response.status}`);
  return response.json();
}

export async function fetchLeetCode() {
  const query = `query PortfolioStats($username: String!, $previousYear: Int!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal { acSubmissionNum { difficulty count } }
      userCalendar { streak totalActiveDays submissionCalendar }
      previousCalendar: userCalendar(year: $previousYear) { submissionCalendar }
    }
  }`;
  const body = await requestJSON('https://leetcode.com/graphql/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Referer': `https://leetcode.com/u/${HANDLES.leetcode}/`, 'User-Agent': 'UdayPortfolio/1.0' },
    body: JSON.stringify({ query, variables: { username: HANDLES.leetcode, previousYear: new Date().getUTCFullYear() - 1 } }),
  });
  const user = body.data?.matchedUser;
  if (body.errors?.length || !user?.submitStatsGlobal?.acSubmissionNum) throw new Error('LeetCode profile unavailable');
  const counts = Object.fromEntries(user.submitStatsGlobal.acSubmissionNum.map(row => [row.difficulty, row.count]));
  if (!['All', 'Easy', 'Medium', 'Hard'].every(key => Number.isInteger(counts[key]) && counts[key] >= 0)) throw new Error('Invalid LeetCode counts');
  if (counts.All !== counts.Easy + counts.Medium + counts.Hard) throw new Error('Incomplete LeetCode counts');
  let calendar = null;
  try {
    const current = JSON.parse(user.userCalendar?.submissionCalendar);
    if (current && typeof current === 'object' && !Array.isArray(current)) calendar = current;
    const previous = JSON.parse(user.previousCalendar?.submissionCalendar || '{}');
    if (calendar && previous && typeof previous === 'object') calendar = { ...previous, ...calendar };
  } catch { /* Keep counts if the calendar is unavailable. */ }
  return {
    username: user.username, totalSolved: counts.All, easy: counts.Easy, medium: counts.Medium, hard: counts.Hard,
    currentStreak: calendar && typeof calendar === 'object' ? currentStreak(calendar) : null,
    longestStreak: user.userCalendar?.streak ?? null,
    totalActiveDays: user.userCalendar?.totalActiveDays ?? null,
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchCodeforces() {
  const info = await requestJSON(`https://codeforces.com/api/user.info?handles=${HANDLES.codeforces}`);
  const user = info.result?.[0];
  if (info.status !== 'OK' || !user || !Number.isInteger(user.rating)) throw new Error('Codeforces profile unavailable');
  // Respect the public API's request frequency, even when fetching contest history.
  await new Promise(resolve => setTimeout(resolve, 2100));
  let ratedContests = null;
  try {
    const history = await requestJSON(`https://codeforces.com/api/user.rating?handle=${HANDLES.codeforces}`);
    if (history.status === 'OK' && Array.isArray(history.result)) ratedContests = history.result.length;
  } catch { /* A failed history request must not discard a fresh rating. */ }
  return { username: user.handle, rating: user.rating, maxRating: user.maxRating ?? user.rating, rank: user.rank || 'unrated', ratedContests, updatedAt: new Date().toISOString() };
}

const saved = new Map();
const pending = new Map();
const sources = { leetcode: fetchLeetCode, codeforces: fetchCodeforces };

async function loadPlatform(name) {
  const cached = saved.get(name);
  if (cached && Date.now() - Date.parse(cached.updatedAt) < 300000) return cached;
  if (pending.has(name)) return pending.get(name);
  const work = sources[name]().then(value => {
    saved.set(name, value);
    return value;
  }).catch(() => cached ? { ...cached, stale: true } : null).finally(() => pending.delete(name));
  pending.set(name, work);
  return work;
}

export async function getCodingStats() {
  const [leetcode, codeforces] = await Promise.all([loadPlatform('leetcode'), loadPlatform('codeforces')]);
  return { leetcode, codeforces };
}
