# [Portfolio](https://portfolio-imuday08-git.vercel.app/)

**[Open Uday Saha’s live portfolio ↗](https://portfolio-imuday08-git.vercel.app/)**

Uday Saha's portfolio with a cinematic intro, animated project sections, technical skills, and academic and coding profile highlights.

## Live portfolio

- [Portfolio on ONEWHO](https://imuday08.isonewho.codes/)
- [Vercel deployment](https://portfolio-imuday08-git.vercel.app/)
- [GitHub Pages](https://imuday8.github.io/Portfolio/)

## Run locally

```sh
npm ci
npm run dev
```

The current page source is `app/index.html`, with its portrait in `app/uday-photo.jpg`. The page uses HTML, CSS, JavaScript, and GSAP. Earlier React source remains in the repository history and existing source folders.

## Build

```sh
npm run build
```

Vite writes the production site to `dist/`. Then `scripts/sync-build.mjs` copies the generated entry and hashed assets to `index.html` and `build-assets/` at the repository root for GitHub Pages. Edit `app/index.html` and rebuild to update these generated files.

## Included content

- Featured projects: PyReach, Portfolio, and Hexamind.
- JEE Main percentile: 98.93.
- LeetCode snapshot: 140 problems solved and a 111-day streak supplied for the portfolio.
- Codeforces snapshot: rating 1016, peak 1025, and eight rated contests.
- GitHub snapshot: seven public repositories and one follower.
- Education: B.Tech in CS & AI at Newton School of Technology, Rishihood University, Delhi NCR.

Profile figures are the dated 7 November 2026 snapshot displayed on the site.

The intro has no sound toggle. Its synthesized audio cues are enabled by default and start after the browser permits audio through a visitor interaction. The intro can be skipped, and motion respects the visitor's reduced-motion preference.
