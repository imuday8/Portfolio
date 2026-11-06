# Uday Saha — Beyond the ordinary

A cinematic, editorial portfolio for the One Who Codes challenge. It puts verified coding profiles and credited team projects ahead of the decorative 3D scene.

## Run locally

```sh
npm install
npm run dev
```

Build the static GitHub Pages release with `npm run build`. Vite writes to `dist/`; `scripts/sync-build.mjs` copies its entry point and hashed assets to the publishing root.

## Verified profiles

- LeetCode `Imuday08__`: 139 solved (45 Easy, 65 Medium, 29 Hard), 43-day current streak, 103 active days in 2026, global rank 1,284,422. Snapshot checked 7 November 2026 through LeetCode's public GraphQL profile.
- Codeforces `Imuday08_`: 1,016 rating, 1,025 max rating, Newbie rank, 8 rated contests. Initial snapshot checked 7 November 2026; the page refreshes from Codeforces' public API and caches successful results for six hours.
- GitHub `imuday8`: 7 public repositories and 1 follower. Initial snapshot checked 7 November 2026; the page refreshes from GitHub's public API and caches successful results for six hours.

No CodeChef or GeeksforGeeks card is shown because no username was supplied. The previously supplied 110+ LeetCode streak conflicts with the current public profile value of 43, so the page uses the current value.

## Projects

- PyReach is credited to Team CodeSins. Uday’s contribution: frontend and platform work, dashboard, CLI reporter, fixtures, sample projects, and GitHub Actions CI. The visual is an explanatory sample, not a live scan; PyReach analyzes source statically and does not execute scanned code.
- MedMatch AI is a Team Hexamind concept prototype. It is not connected to live hospitals and is not medical guidance.

## Implementation

React, Vite, Three.js / React Three Fiber, a custom GLSL iridescence shader, GSAP ScrollTrigger, Lenis, Tailwind CSS integration, Simple Icons brand marks, and local fonts. The sculpture uses a capped device pixel ratio, lower mobile geometry, no continuous sparkle field or planar reflection render pass, and a WebGL fallback. Intro and scroll reveals honor reduced motion. Profile cards show cached verified snapshots if public API refresh fails.

## Quality checks

`npm run build` creates and syncs the production static build. `npm run test:responsive` uses the installed Google Chrome executable to check 320, 375, 768, 1024, 1440, and 1920px widths, horizontal overflow, heading bounds, profile links and logos, navigation, reduced motion, and intro skip/revisit behavior.

## Links

- Live: https://imuday8.github.io/Portfolio/
- Source: https://github.com/imuday8/Portfolio
