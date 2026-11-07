# Uday Saha — Beyond the ordinary

An interactive editorial portfolio with a GSAP 3D entry sequence, a procedural Three.js sculpture, a live public repository archive, and verified coding profile data.

## Run locally

```sh
npm install
npm run dev
```

Build the static GitHub Pages release with `npm run build`. Vite writes to `dist/`; `scripts/sync-build.mjs` mirrors the hashed entry and assets into the publishing root.

## Entry experience

- The first visit in a session presents a name flip, converging particles, a 0–100 visual entry sequence, and a Three.js camera move. Its counter is labeled as an entry sequence; actual WebGL readiness is reported separately.
- The entry can be skipped, entered after the sequence, replayed from navigation, or bypassed on return visits. A WebGL failure switches to the 2D scene fallback and reports that state. Reduced-motion preferences skip the cinematic entry.
- No video, audio, login form, or loading percentage is implied.

## Public GitHub archive

The project fetches `https://api.github.com/users/imuday8/repos?per_page=100&type=owner&sort=updated`, filters out private entries, and presents the full current public list with search, language filters, stars, language, fork/archive labels, update dates, and verified deployment links. It caches successful listings in local storage for up to six hours. If GitHub is unavailable, the page uses the verified 7 November 2026 public-repository snapshot, or a saved listing when one exists. The profile card’s follower count is a dated snapshot; repository counts refresh from the public repository endpoint. It does not substitute invented repositories or profile statistics.

The public API returned these seven repositories on 7 November 2026: `Portfolio`, `pyreach`, `Hexamind`, `login_form_by_uday`, `login_form`, `Saha_LTD`, and `sahalimited`. The prompt-mentioned `College_git_project` was not in the public response, so it is not shown. Any private repositories are outside the public API request.

The Hexamind project notes come from its public `README.txt`. They describe the MedMatch AI multi-page emergency-care prototype and hospital finder. Its hospital bed/ICU counts are simulated; figures on the public demo page are not independently verified, and it is not a live care service. The portfolio’s UI illustration is labeled as a study, not a screenshot.

## Competitive profiles

- LeetCode `Imuday08__`: 139 solved (45 Easy, 65 Medium, 29 Hard), 43-day current streak, 103 active days in 2026, global rank 1,284,422. Snapshot checked 7 November 2026 through LeetCode’s public GraphQL profile. The page marks it as a dated snapshot.
- Codeforces `Imuday08_`: rating 1,016, maximum 1,025, Newbie rank, 8 rated contests. Current rating and contest progression refresh from Codeforces’ public API; rank colors follow the API rank.
- GitHub `imuday8`: 7 public repositories and 1 follower in the 7 November 2026 snapshot. Profile counts refresh from GitHub’s public API.
- The Codeforces/GitHub APIs are cached for six hours. The repository archive has its own six-hour cache and searchable full listing, with a dated public snapshot fallback.
- No CodeChef, GeeksforGeeks, AtCoder, or HackerRank card is shown because no handle was provided. The previously supplied “110+ days” streak differs from LeetCode’s verified 43-day current streak; the portfolio uses 43.

## Academic details

The existing profile configuration contains a JEE Main percentile of 98.93. It has no verified JEE rank or examination year, and the academic chapter marks those fields “Not provided” rather than inferring a year from the university program dates. Education is listed as B.Tech / Computer Science & Artificial Intelligence at Newton School of Technology, Rishihood University (2026–2030).

## Test and verify

```sh
npm run build
npm run test:responsive
```

The responsive browser check uses Google Chrome and covers 320, 375, 768, 1024, 1440, and 1920px widths, repository filters, navigation, the entry sequence and replay, reduced motion, archive completeness, and no horizontal overflow.
