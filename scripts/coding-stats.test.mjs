import test from 'node:test';
import assert from 'node:assert/strict';
import { currentStreak, fetchLeetCode, fetchCodeforces, getCodingStats } from '../lib/coding-stats.js';
import handler from '../api/coding-stats.js';

const day = date => Date.parse(`${date}T00:00:00Z`) / 1000;
test('current streak includes today or yesterday, but stops at a gap', () => {
  const now = Date.parse('2026-11-19T12:00:00Z');
  assert.equal(currentStreak({ [day('2026-11-19')]: 2, [day('2026-11-18')]: 1 }, now), 2);
  assert.equal(currentStreak({ [day('2026-11-18')]: 1, [day('2026-11-17')]: 3 }, now), 2);
  assert.equal(currentStreak({ [day('2026-11-17')]: 1 }, now), 0);
  assert.equal(currentStreak({ [day('2026-11-19')]: 0 }, now), 0);
  assert.equal(currentStreak({ [day('2027-01-01')]: 1, [day('2026-12-31')]: 1 }, Date.parse('2027-01-01T12:00:00Z')), 2);
});

const leetcodeResponse = () => ({ data: { matchedUser: {
  username: 'Imuday08__',
  submitStatsGlobal: { acSubmissionNum: [{ difficulty: 'All', count: 414 }, { difficulty: 'Easy', count: 121 }, { difficulty: 'Medium', count: 239 }, { difficulty: 'Hard', count: 54 }] },
  userCalendar: { streak: 56, totalActiveDays: 116, submissionCalendar: '{}' },
  previousCalendar: { submissionCalendar: '{}' },
} } });
const realFetch = globalThis.fetch;
test('LeetCode reads public solved counts and does not confuse longest with current streak', async () => {
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://leetcode.com/graphql/');
    assert.equal(JSON.parse(options.body).variables.username, 'Imuday08__');
    return Response.json(leetcodeResponse());
  };
  try {
    const result = await fetchLeetCode();
    assert.equal(result.totalSolved, 414);
    assert.equal(result.longestStreak, 56);
    assert.equal(result.currentStreak, 0);
  } finally { globalThis.fetch = realFetch; }
});
test('partial LeetCode data is rejected rather than displaying false counts', async () => {
  const body = leetcodeResponse();
  body.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count = 999;
  globalThis.fetch = async () => Response.json(body);
  try { await assert.rejects(fetchLeetCode, /Incomplete/); }
  finally { globalThis.fetch = realFetch; }
});
test('Codeforces rating survives unavailable contest history', async () => {
  globalThis.fetch = async url => {
    if (url.includes('user.rating')) throw new Error('Unavailable');
    return Response.json({ status: 'OK', result: [{ handle: 'Imuday08_', rating: 1096, maxRating: 1096, rank: 'newbie' }] });
  };
  try {
    const result = await fetchCodeforces();
    assert.equal(result.rating, 1096);
    assert.equal(result.ratedContests, null);
  } finally { globalThis.fetch = realFetch; }
});
test('one profile outage does not discard the other profile and successful values are cached', async () => {
  let calls = 0;
  globalThis.fetch = async url => {
    calls++;
    if (url.includes('leetcode')) throw new Error('Unavailable');
    return Response.json(url.includes('user.info')
      ? { status: 'OK', result: [{ handle: 'Imuday08_', rating: 1096, maxRating: 1096, rank: 'newbie' }] }
      : { status: 'OK', result: Array.from({ length: 10 }, () => ({})) });
  };
  try {
    const first = await getCodingStats();
    assert.equal(first.leetcode, null);
    assert.equal(first.codeforces.rating, 1096);
    assert.equal(first.codeforces.ratedContests, 10);
    const before = calls;
    await getCodingStats();
    assert.equal(calls - before, 1, 'only the failed LeetCode source should retry');
  } finally { globalThis.fetch = realFetch; }
});
test('public endpoint refuses mutations without contacting upstreams', async () => {
  const headers = {};
  const res = { setHeader: (key, value) => { headers[key] = value; }, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; } };
  await handler({ method: 'POST' }, res);
  assert.equal(res.statusCode, 405);
  assert.equal(headers.Allow, 'GET, HEAD');
});
