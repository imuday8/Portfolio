import { writeFile } from 'node:fs/promises';
import { getCodingStats } from '../lib/coding-stats.js';

const data = await getCodingStats();
if (!data.leetcode || !data.codeforces) throw new Error('Both profiles must load before replacing the saved snapshot');
await writeFile(new URL('../app/data/coding-stats.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(`Saved LeetCode ${data.leetcode.totalSolved} solved and Codeforces ${data.codeforces.rating} rating.`);
