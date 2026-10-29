# Uday Saha — Personal Developer Portfolio

A production-ready, highly accessible, cinematic personal developer portfolio engineered with modern web standards, zero-dependency performance, and responsive design.

---

## ⚡ Key Highlights & Architecture

- **Visual Theme:** "Midnight Cyber × Editorial Tech" — Deep dark mode canvas (`#080C14`), crisp borders (`rgba(255, 255, 255, 0.08)`), vibrant electric cyan (`#00F2FE`) & ice blue accents, paired with a high-contrast paper-white light theme.
- **Zero FOUT (Flash of Unstyled Theme):** Synchronous theme resolution in `<head>` inspecting `localStorage` and `prefers-color-scheme` before first paint.
- **Cinematic Curtain Reveal:** JetBrains Mono counter with SVG architectural stroke animation that slides upward, with complete safeguards (runs once per session via `sessionStorage`, instant skip with visible button, `Esc`, or `Space`, and full `prefers-reduced-motion` compliance).
- **Browser-Compliant Ambient Audio:** Procedural Web Audio API synthesizer with soft harmonic drone. Zero autoplay; exclusively initiates on explicit user click, accompanied by an animated 4-bar equalizer pill with graceful error handling and cleanup.
- **Authentic Metrics:**
  - **Academic Distinction:** ⚡ 98.93%ile in JEE Main
  - **Competitive Programming:** Codeforces Max `1045` / Current `1016`; LeetCode `450+ Total Submissions`, `102-Day Streak`.
  - **Case Study:** MedMatch AI — Smart Emergency Hospital Bed & ICU Router (Team Hexamind).
  - **Skills Hierarchy:** Categorized domains without manufactured percentage meters.

---

## 📁 Project Structure

```
uday-saha-portfolio/
├── index.html               # Semantic HTML5 with SEO, Open Graph, and preloader
├── vercel.json              # Vercel deployment configuration with security headers & caching
├── package.json             # Project metadata & convenience scripts
├── types.ts                 # Full TypeScript type definitions for the data model
├── README.md                # Documentation & setup guide
├── css/
│   └── styles.css           # Complete design system & custom property tokens
├── js/
│   ├── data.js              # Central source of truth for portfolio data
│   ├── theme.js             # Persistent dark/light theme controller
│   ├── preloader.js         # Cinematic curtain reveal & session manager
│   ├── audio.js             # Web Audio API ambient synthesizer & equalizer
│   ├── navigation.js        # Scroll-spy, mobile drawer with focus trap, back-to-top
│   ├── renderer.js          # Dynamic DOM renderer for cards, skills, and projects
│   ├── toast.js             # Accessible clipboard copy & toast notifications
│   └── main.js              # Entry orchestrator & metric animations
└── assets/
    ├── favicon.svg          # Crisp developer monogram favicon (US)
    └── og-preview.svg       # 1200x630 social share preview card
```

---

## 🚀 Running Locally

You can run the portfolio locally with any local static server:

### Option 1: Python 3 (Installed by default on macOS & Linux)
```bash
cd uday-saha-portfolio
python3 -m http.server 3000
```
Then visit [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Node.js (npx serve)
```bash
cd uday-saha-portfolio
npx serve .
```

---

## 🌐 Deploying to Vercel

### Option 1: Vercel CLI (1-command)
```bash
npm install -g vercel
vercel deploy --prod
```

### Option 2: Git Integration (Recommended)
1. Push this directory to your GitHub account:
   ```bash
   git init
   git add .
   git commit -m "feat: initial portfolio release"
   git branch -M main
   git remote add origin https://github.com/imuday8/portfolio.git
   git push -u origin main
   ```
2. Navigate to [vercel.com/new](https://vercel.com/new).
3. Import your repository. Vercel automatically detects the static HTML project and applies `vercel.json` configurations.
4. Click **Deploy**.

---

## 🛠️ Updating Data

All portfolio content is structured in `js/data.js`:
- To update competitive programming ratings, modify `cpProfiles` in `js/data.js`.
- To add a project, append an entry to `projectsData` in `js/data.js`.
- To update skills, adjust `skillsData` in `js/data.js`.

The dynamic renderer automatically renders all updates without requiring changes to `index.html`.
