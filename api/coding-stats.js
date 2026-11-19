import { getCodingStats } from '../lib/coding-stats.js';

// Fixed public profile handles only: this endpoint cannot proxy arbitrary URLs.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const data = await getCodingStats();
  const healthy = data.leetcode && !data.leetcode.stale && data.codeforces && !data.codeforces.stale;
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Vercel-CDN-Cache-Control', healthy ? 'public, s-maxage=300, stale-while-revalidate=3600' : 'public, s-maxage=30');
  if (req.method === 'HEAD') return res.status(200).end();
  return res.status(200).json(data);
}
