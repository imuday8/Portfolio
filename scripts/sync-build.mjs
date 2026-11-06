import { cp, mkdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const projectRoot = resolve(import.meta.dirname, '..');
const buildDir = resolve(projectRoot, 'dist');
const publicDir = resolve(projectRoot, 'build-assets');

await mkdir(projectRoot, { recursive: true });
await cp(resolve(buildDir, 'index.html'), resolve(projectRoot, 'index.html'));
await rm(publicDir, { recursive: true, force: true });
await cp(resolve(buildDir, 'build-assets'), publicDir, { recursive: true });
console.log('Synced the production entry and assets to the GitHub Pages root.');
