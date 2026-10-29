import fs from 'fs';
import http from 'http';

console.log('--- STARTING COMPREHENSIVE TECTONIC LIGHT VERIFICATION ---');

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

assert(htmlContent.includes('id="calibration-curtain"'), 'Intro curtain element #calibration-curtain exists');
assert(htmlContent.includes('id="btn-enter-sound"'), 'Entry button #btn-enter-sound exists');
assert(htmlContent.includes('id="btn-enter-silent"'), 'Entry button #btn-enter-silent exists');
assert(htmlContent.includes('id="telemetry-ledger-container"'), 'Container #telemetry-ledger-container exists');
assert(htmlContent.includes('id="case-study-container"'), 'Container #case-study-container exists');
assert(htmlContent.includes('id="capabilities-matrix-container"'), 'Container #capabilities-matrix-container exists');
assert(htmlContent.includes('id="btn-copy-email"'), 'Copy email button #btn-copy-email exists');
assert(htmlContent.includes('id="btn-return-datum"'), 'Return to datum button #btn-return-datum exists');
assert(htmlContent.includes('audio-telemetry-toggle'), 'Audio telemetry toggle class exists');
assert(htmlContent.includes('theme-toggle-btn'), 'Theme toggle button class exists');
assert(htmlContent.includes('Instrument+Serif'), 'Google Fonts link includes Instrument Serif');

// 2. Check watchdog timer & failsafe logic
assert(htmlContent.includes('setTimeout(forceDismiss, 2000)'), 'Inline watchdog timer (2000ms max) is present in HTML');
assert(htmlContent.includes('sessionStorage.getItem(\'tectonic_light_intro_calibrated_v2\')'), 'Inline check for session calibration bypass exists');
assert(htmlContent.includes('e.key === \'Escape\''), 'Inline Escape key listener exists in HTML guard');

// 3. Check CSS for Tectonic Light design tokens & responsive breakpoints
const cssContent = fs.readFileSync('./css/styles.css', 'utf8');

assert(cssContent.includes('--bg-canvas: #F4F0E8;'), 'Light theme --bg-canvas is warm ivory (#F4F0E8)');
assert(cssContent.includes('--accent-terracotta: #C65336;'), 'Terracotta accent (#C65336) token exists');
assert(cssContent.includes('--accent-sage: #89917B;'), 'Sage accent (#89917B) token exists');
assert(cssContent.includes('[data-theme="dark"]'), 'Dark theme override exists');
assert(cssContent.includes('overflow-x: hidden;'), 'Body prevents horizontal overflow');
assert(cssContent.includes(':focus-visible'), 'Focus visible accessible styles defined');
assert(cssContent.includes('@media (prefers-reduced-motion: reduce)'), 'Reduced motion accessibility query defined');
assert(cssContent.includes('@media (min-width: 600px)'), 'Mobile/tablet responsive breakpoint exists');
assert(cssContent.includes('@media (min-width: 768px)') || cssContent.includes('@media (min-width: 860px)'), 'Tablet breakpoint exists');
assert(cssContent.includes('@media (min-width: 900px)') || cssContent.includes('@media (min-width: 960px)'), 'Desktop breakpoint exists');
assert(cssContent.includes('@media (min-width: 1024px)'), 'Wide desktop breakpoint exists');

// 4. Verify authentic personal & technical parameters in data.js
const dataContent = fs.readFileSync('./js/data.js', 'utf8');

assert(dataContent.includes('Uday Saha'), 'data.js: Name is Uday Saha');
assert(dataContent.includes('98.93%ile in JEE Main') || dataContent.includes('98.93 percentile'), 'data.js: JEE Main 98.93 percentile accurate');
assert(dataContent.includes('Newton School of Technology / Rishihood University'), 'data.js: Institution is Newton School of Technology / Rishihood University');
assert(dataContent.includes('1016') && dataContent.includes('1045'), 'data.js: Codeforces 1016 current / 1045 max accurate');
assert(dataContent.includes('Imuday08_'), 'data.js: Codeforces handle Imuday08_ accurate');
assert(dataContent.includes('450+') && dataContent.includes('102-day'), 'data.js: LeetCode 450+ submissions and 102-day streak accurate');
assert(dataContent.includes('Imuday08__'), 'data.js: LeetCode handle Imuday08__ accurate');
assert(dataContent.includes('https://hexamind-ai-neon.vercel.app/'), 'data.js: MedMatch AI live URL accurate');
assert(dataContent.includes('us8.dev@gmail.com'), 'data.js: Contact email is us8.dev@gmail.com');
assert(dataContent.includes('https://github.com/imuday8'), 'data.js: GitHub profile accurate');
assert(dataContent.includes('https://www.linkedin.com/in/imuday08/'), 'data.js: LinkedIn profile accurate');

// 5. Test local server response at http://localhost:3457
const req = http.get('http://localhost:3457/', (res) => {
  assert(res.statusCode === 200, `Local server on port 3457 returned HTTP ${res.statusCode}`);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    assert(body.includes('Uday Saha'), 'Server served index.html containing Uday Saha');
    assert(body.includes('styles.css'), 'Server served index.html linking to styles.css');
    console.log(`\n--- TEST SUMMARY: ${passedTests}/${totalTests} PASSED ---`);
    process.exit(passedTests === totalTests ? 0 : 1);
  });
});

req.on('error', (e) => {
  assert(false, `Local server connection error: ${e.message}`);
  console.log(`\n--- TEST SUMMARY: ${passedTests}/${totalTests} PASSED ---`);
  process.exit(1);
});
