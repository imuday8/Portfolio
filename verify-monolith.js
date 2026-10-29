import fs from 'fs';

console.log('--- STARTING COMPREHENSIVE OBSIDIAN MONOLITH 3.0 VERIFICATION ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
  }
}

// 1. Check index.html existence and essential DOM nodes
const htmlContent = fs.readFileSync('./index.html', 'utf8');

assert(htmlContent.includes('id="monolith-portal"'), 'Intro portal element #monolith-portal exists');
assert(!htmlContent.includes('id="btn-enter-sound"'), 'Entry buttons removed in favor of auto-audio intro');
assert(!htmlContent.includes('id="btn-enter-silent"'), 'Silent button removed in favor of auto-audio intro');
assert(htmlContent.includes('id="btn-skip-intro"'), 'Skip button #btn-skip-intro exists');
assert(htmlContent.includes('id="btn-replay-intro"'), 'Replay button #btn-replay-intro exists');
assert(htmlContent.includes('monolith-3d-scene') || htmlContent.includes('orbital-astrolabe-scene'), '3D Monolith scene container exists');
assert(htmlContent.includes('monolith-core-mesh') || htmlContent.includes('orbital-core-mesh'), '3D Monolith core mesh exists');
assert(htmlContent.includes('stellar-nucleus'), '3D Holographic stellar nucleus exists');
assert(htmlContent.includes('orbital-ring ring-1'), '3D concentric gyroscopic rings exist');
assert(htmlContent.includes('orbital-hud-pill'), '3D floating glass HUD pills exist');
assert(htmlContent.includes('id="telemetry-ledger-container"'), 'Container #telemetry-ledger-container exists');
assert(htmlContent.includes('id="case-study-container"'), 'Container #case-study-container exists');
assert(htmlContent.includes('id="capabilities-matrix-container"'), 'Container #capabilities-matrix-container exists');
assert(htmlContent.includes('id="btn-copy-email"'), 'Copy email button #btn-copy-email exists');
assert(htmlContent.includes('id="btn-return-datum"'), 'Return to top button #btn-return-datum exists');
assert(htmlContent.includes('sound-toggle-btn'), 'Sound toggle button exists');
assert(htmlContent.includes('eq-bar'), 'Animated equalizer bars exist in markup');
assert(htmlContent.includes('Space+Grotesk'), 'Google Fonts link includes Space Grotesk');
assert(htmlContent.includes('data-counter-target="1016"'), 'Codeforces counter hook exists');
assert(htmlContent.includes('data-counter-target="450"'), 'LeetCode submissions counter hook exists');
assert(htmlContent.includes('ambient-glow-layer'), 'Ambient glow layer exists in HTML for frosted glass depth bleed');
assert(htmlContent.includes('ambient-glow-orb'), 'Ambient glow orbs exist in HTML');
assert(htmlContent.includes('data-counter-target="98.93"'), 'JEE Main counter hook exists');
assert(htmlContent.includes('2026 – 2030') || htmlContent.includes('2026 — 2030'), 'Academic timeline 2026–2030 updated in HTML');

// 2. Check watchdog timer & failsafe logic
assert(htmlContent.includes('setTimeout(forceDismiss, 17000)') || htmlContent.includes('setTimeout(forceDismiss, 7000)'), 'Inline emergency watchdog timer is present in HTML');
assert(htmlContent.includes('sessionStorage.getItem(\'obsidian_monolith_intro_v3\')'), 'Inline check for session calibration bypass exists');
assert(htmlContent.includes('e.key === \'Escape\''), 'Inline Escape key listener exists in HTML guard');
assert(htmlContent.includes('params.get(\'intro\') === \'1\''), 'URL parameter ?intro=1 override check exists in HTML guard');

assert(htmlContent.includes('warp-tunnel-canvas'), '3D Cosmic Warp Tunnel canvas exists in HTML');
assert(!htmlContent.includes('portal-audio-pill'), 'Spatial audio toggle pill removed in favor of seamless gesture auto-unlock');
assert(htmlContent.includes('warp-singularity-flash'), 'Singularity flash gateway element exists');
assert(htmlContent.includes('cosmic-bg-canvas'), 'Persistent cosmic background canvas exists');

// 3. Check CSS for Obsidian Monolith design tokens & responsive breakpoints
const cssContent = fs.readFileSync('./css/styles.css', 'utf8');

assert(cssContent.includes('--bg-primary: #000000;') || cssContent.includes('--bg-primary: #030305;'), 'Primary background token is pure deep space black (#000000)');
assert(cssContent.includes('--bg-secondary: #0A0D16;'), 'Secondary background token is #0A0D16');
assert(cssContent.includes('--bg-surface: #0D111D;'), 'Surface background token is #0D111D');
assert(cssContent.includes('--bg-glass: rgba(10, 12, 18, 0.55);') || cssContent.includes('--bg-glass: linear-gradient') || cssContent.includes('--bg-glass: rgba(255, 255, 255, 0.03);') || cssContent.includes('--bg-glass: rgba(13, 17, 29, 0.65);'), 'Liquid frosted glass token is defined');
assert(cssContent.includes('blur(24px)') || cssContent.includes('blur(20px)'), 'Frosted glass blur token is defined');
assert(cssContent.includes('--bg-nebula-indigo: #08041a;'), 'Deep nebula indigo token is #08041a');
assert(cssContent.includes('--bg-nebula-wine: #1f0c2e;'), 'Deep nebula wine token is #1f0c2e');
assert(cssContent.includes('--accent-orange: #FFFFFF;') || cssContent.includes('--accent-orange: #FF623E;'), 'White Dwarf starlight accent token is defined');
assert(cssContent.includes('--accent-amber: #F3B17A;'), 'Accent amber token is #F3B17A');
assert(cssContent.includes('translateY(30px) scale(0.98)'), 'Kinetic slide and scale initial state defined');
assert(cssContent.includes('cubic-bezier(0.16, 1, 0.3, 1)'), 'Organic spring transition easing defined');
assert(cssContent.includes('overflow-x: hidden;'), 'Body prevents horizontal overflow');
assert(cssContent.includes(':focus-visible'), 'Focus visible accessible styles defined');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion accessibility query defined');
assert(cssContent.includes('@media (min-width: 600px)'), 'Mobile/tablet responsive breakpoint exists');
assert(cssContent.includes('@media (min-width: 768px)') || cssContent.includes('@media (min-width: 860px)'), 'Tablet breakpoint exists');
assert(cssContent.includes('@media (min-width: 960px)'), 'Desktop breakpoint exists');
assert(cssContent.includes('@media (min-width: 1024px)'), 'Wide desktop breakpoint exists');
assert(cssContent.includes('@keyframes eqBounce'), 'Equalizer bounce animation keyframes exist');
assert(cssContent.includes('transform-style: preserve-3d;'), '3D perspective preserve-3d defined');

// 4. Verify authentic personal & technical parameters in data.js
const dataContent = fs.readFileSync('./js/data.js', 'utf8');

assert(dataContent.includes('Uday Saha'), 'data.js: Name is Uday Saha');
assert(dataContent.includes('98.93%ile in JEE Main') || dataContent.includes('98.93 percentile'), 'data.js: JEE Main 98.93 percentile accurate');
assert(dataContent.includes('Newton School of Technology / Rishihood University'), 'data.js: Institution is Newton School of Technology / Rishihood University');
assert(dataContent.includes('1016') && dataContent.includes('1045'), 'data.js: Codeforces 1016 current / 1045 max accurate');
assert(dataContent.includes('Imuday08_'), 'data.js: Codeforces handle Imuday08_ accurate');
assert(dataContent.includes('450') && dataContent.includes('102'), 'data.js: LeetCode 450+ submissions and 102-day streak accurate');
assert(dataContent.includes('Imuday08__'), 'data.js: LeetCode handle Imuday08__ accurate');
assert(dataContent.includes('https://hexamind-ai-neon.vercel.app/'), 'data.js: MedMatch AI live URL accurate');
assert(dataContent.includes('us8.dev@gmail.com'), 'data.js: Contact email is us8.dev@gmail.com');
assert(dataContent.includes('https://github.com/imuday8'), 'data.js: GitHub profile accurate');
assert(dataContent.includes('https://www.linkedin.com/in/imuday08/'), 'data.js: LinkedIn profile accurate');

console.log(`\n--- TEST SUMMARY: ${passedTests}/${totalTests} PASSED ---`);
process.exit(passedTests === totalTests ? 0 : 1);
