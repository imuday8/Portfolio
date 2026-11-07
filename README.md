# Uday Saha — Developer Portfolio

A violet-lit, interactive portfolio shaped by a cinematic product landing page: an immediate introduction, a glass dashboard with verified public stats, featured work, capability cards, and a softly illuminated 3D Earth.

## Run locally

```sh
npm install
npm run dev
```

Build the GitHub Pages release with `npm run build`. Vite writes to `dist/`, then `scripts/sync-build.mjs` mirrors the entry and hashed assets into the publishing root.

## The visual experience

- The portfolio opens directly on the hero. A glass dashboard summarizes genuine coding and GitHub data and links to three featured projects. The following sections carry the violet light, soft beams, restrained motion, and rounded capability cards through the page.
- The ambient 3D Earth uses NASA Earth Observatory's 3600 × 1800 Black Marble 2016 global map as an equirectangular texture. Three.js draws it on a rotating sphere with procedural clouds and an atmospheric rim. The map is under 800 KB.
- The bundled texture is NASA Earth Observatory imagery by Joshua Stevens, using Suomi NPP VIIRS data from Miguel Román, NASA GSFC. The [NASA source page](https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/) documents the map, resolutions, and underlying observations.
- Unsupported WebGL gets a labeled static Earth texture fallback. Reduced-motion settings stop automatic globe and cloud motion.

## Featured projects

Exactly three projects are featured, in the requested order:

1. **PyReach** — Team CodeSins' Python static call-path analysis tool. The sample interface is illustrative; the source parser does not execute scanned projects. Uday's contribution and both the team repository and his public fork are linked.
2. **Portfolio** — this React, Three.js, GSAP, and Lenis experience. The project artwork is labeled as an editorial study rather than a screenshot.
3. **Hexamind** — the team's multi-page emergency-care discovery prototype. Its live prototype and public source are linked. Hospital availability counts are simulated, and demo performance/usage claims are not independently verified; it is not a live care service.

The separate searchable GitHub archive is an account view, not a fourth featured project. It displays the verified seven-repository public snapshot when GitHub's unauthenticated API is rate-limited.

## Verified details

- LeetCode `Imuday08__`: 139 solved (45 Easy, 65 Medium, 29 Hard), 43-day current streak, 103 active days in 2026, global rank 1,284,422. Snapshot checked 7 November 2026. The public profile's current streak differed from the earlier user note of 110+ days, so the page uses the verified snapshot.
- Codeforces `Imuday08_`: rating 1,016, max rating 1,025, Newbie rank, eight rated contests. The page uses the public API when available and a dated verified history otherwise.
- GitHub `imuday8`: seven public repositories and one follower in the 7 November 2026 snapshot. The repository list can refresh from GitHub; follower count remains explicitly dated.
- JEE Main percentile: 98.93. The project data has no verified JEE rank or exam year; those are omitted rather than inferred.
- Education: B.Tech, Computer Science & Artificial Intelligence, Newton School of Technology, Rishihood University, 2026–2030.
- CodeChef and GeeksforGeeks are omitted because no handles were supplied.

## Quality checks

`npm run build` creates and syncs the static release. `npm run test:responsive` uses installed Google Chrome to check 320, 375, 768, 1024, 1440, and 1920 px, overflow, navigation, the project count/order, archive filters, profile links, reduced motion, scrolling, reduced motion, and the WebGL fallback.

## Links

- Live: <https://imuday8.github.io/Portfolio/>
- Source: <https://github.com/imuday8/Portfolio>
- NASA Black Marble source: <https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/>
