# Uday Saha — Beyond the ordinary

A cinematic, interactive portfolio built for the One Who Codes portfolio challenge. The page pairs a custom procedural Three.js sculpture with a clear story about Uday’s work, contributions, and learning.

## Run locally

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. To create the static GitHub Pages build:

```sh
npm run build
```

Vite builds to `dist/`, then `scripts/sync-build.mjs` copies the entry page and hashed assets into the repository root, which is the publishing source for GitHub Pages.

## Stack

- React + Vite
- Three.js with React Three Fiber and a custom GLSL shader
- GSAP ScrollTrigger + Lenis
- Tailwind CSS v4 build integration and custom responsive styles
- Lucide icons and locally bundled fonts

## Accessibility and performance

- Semantic sections, skip link, accessible mobile navigation, keyboard-operable skill tabs, and visible focus outlines
- Honors `prefers-reduced-motion`; the decorative WebGL canvas pauses when the tab is hidden
- WebGL remains in a lazy-loaded chunk and uses capped device pixel ratio, reduced mobile geometry cost, and a CSS fallback
- No external runtime font or tracker requests

## Project notes

- PyReach team work is credited to Team CodeSins. Uday’s contribution includes the frontend and platform work, dashboard, CLI reporter, fixtures, sample projects, and GitHub Actions CI. The showcased trace is an explanatory fixture, not a live scan; PyReach statically parses code and does not execute scanned code.
- MedMatch AI is a Team Hexamind concept prototype. It is not connected to live hospitals and is not medical guidance.
- Education, JEE Main percentile, skills, and public profile links are carried over from Uday’s existing public portfolio.

## Links

- Live site: https://imuday8.github.io/Portfolio/
- Source: https://github.com/imuday8/Portfolio
