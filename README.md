# Uday Saha — Portfolio

A lightweight portfolio for the One Who Codes challenge, centered on software security, problem solving, and thoughtful interfaces.

## Run locally

Open `index.html`, or serve the folder with Python:

```sh
python3 -m http.server 3000
```

Then open `http://localhost:3000`.

## Project details

- PyReach's team README credits Uday with frontend and platform work, the CLI reporter, fixtures, sample projects, and GitHub Actions CI.
- MedMatch AI is a concept prototype built with Team Hexamind. It is described as a prototype and is not connected to live hospitals or medical guidance.
- The PyReach trace is based on an explanatory sample fixture. It does not scan files or execute code.
- The B.Tech program, JEE Main percentile, skills, and public profile links are taken from the existing public portfolio repository.

## Implementation

- Semantic HTML, responsive CSS, vanilla JavaScript, and inline SVG.
- No external fonts, trackers, packages, or runtime services.
- Honors `prefers-reduced-motion`; the interactive evidence explainer works with button controls.
- Styles and behavior live in `css/styles.css` and `js/portfolio.js`; the social preview is `assets/og-card.svg`.

## Deployment

The existing production site is `https://portfolio-hexamindhealth.vercel.app`. When this source is pushed to the connected public GitHub repository, Vercel can build it as a static site.
