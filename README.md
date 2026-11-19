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
- LeetCode: solved total, difficulty breakdown, and current daily streak refresh from the public profile API.
- Codeforces: current rating, peak rating, rank, and rated contest count refresh from the official public API.
- GitHub snapshot: seven public repositories.
- Education: B.Tech in CS & AI at Newton School of Technology, Rishihood University, Delhi NCR.

LeetCode and Codeforces refresh when the page opens and every five minutes while visible. The Vercel function at `/api/coding-stats` fetches only the configured public handles, with no login or API key. It caches successful responses for five minutes, isolates upstream failures, and keeps previously fetched data when possible. Static GitHub Pages uses the same public Vercel endpoint.

The browser keeps the latest successful values in local storage. If an API is unavailable, the card shows saved data with its timestamp instead of resetting to zero. The bundled fallback was fetched on 19 November 2026: 415 LeetCode problems and Codeforces rating 1096. Refresh this optional fallback using `node scripts/update-coding-snapshot.mjs`; normal live updates do not require commits.

JEE Main is an academic milestone; GitHub figures retain their labeled 7 November 2026 snapshot.

The intro has no sound toggle. Its synthesized audio cues are enabled by default and start after the browser permits audio through a visitor interaction. The intro can be skipped, and motion respects the visitor's reduced-motion preference.

The public LeetCode calendar also supplies the rolling 365-day submission total. The daily-challenge streak (123 days in the supplied 19 November screenshot) is separately labeled with that date: the public GraphQL API does not expose another user’s signed-in `streakCounter`. It is not advanced by elapsed time. The public submission streak continues to refresh automatically.
