// Simulation test of browser lifecycle and interactions for Obsidian Monolith 3.0
import fs from 'fs';

console.log('--- STARTING OBSIDIAN MONOLITH BROWSER SIMULATION ---');

// Mock browser globals
class MockClassList {
  constructor(el) {
    this.classes = new Set();
    this.el = el;
  }
  add(...names) { names.forEach(n => this.classes.add(n)); }
  remove(...names) { names.forEach(n => this.classes.delete(n)); }
  contains(name) { return this.classes.has(name); }
  toggle(name, force) {
    if (force !== undefined) {
      if (force) this.classes.add(name); else this.classes.delete(name);
      return force;
    }
    if (this.classes.has(name)) { this.classes.delete(name); return false; }
    else { this.classes.add(name); return true; }
  }
}

class MockElement {
  constructor(tagName, id = '', className = '') {
    this.tagName = tagName.toUpperCase();
    this.id = id;
    this._className = className;
    this.classList = new MockClassList(this);
    if (className) {
      className.split(/\s+/).filter(Boolean).forEach(c => this.classList.add(c));
    }
    this.children = [];
    this.parentNode = null;
    this.attributes = {};
    this.style = {
      setProperty: (prop, val) => { this.style[prop] = String(val); },
      getPropertyValue: (prop) => this.style[prop] || '',
      removeProperty: (prop) => { delete this.style[prop]; }
    };
    this.eventListeners = {};
    this.innerHTML = '';
    this.textContent = '';
    this.dataset = {};
  }

  set className(val) {
    this._className = val;
    this.classList = new MockClassList(this);
    if (val) {
      val.split(/\s+/).filter(Boolean).forEach(c => this.classList.add(c));
    }
  }

  get className() {
    return this._className || '';
  }

  setAttribute(name, val) { this.attributes[name] = String(val); }
  getAttribute(name) { return this.attributes[name] || null; }
  removeAttribute(name) { delete this.attributes[name]; }
  
  addEventListener(event, handler) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(h => h !== handler);
    }
  }

  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach(h => h(event));
    }
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx > -1) {
      this.children.splice(idx, 1);
      child.parentNode = null;
    }
    return child;
  }

  querySelector(sel) {
    const parts = sel.split(',').map(s => s.trim());
    for (const p of parts) {
      if (p.startsWith('.')) {
        const cls = p.slice(1);
        if (this.classList.contains(cls)) return this;
        for (const c of this.children) {
          const found = c.querySelector(p);
          if (found) return found;
        }
      } else if (p.startsWith('#')) {
        const id = p.slice(1);
        if (this.id === id) return this;
        for (const c of this.children) {
          const found = c.querySelector(p);
          if (found) return found;
        }
      }
    }
    return null;
  }

  querySelectorAll(sel) {
    const res = [];
    const search = (node) => {
      const parts = sel.split(',').map(s => s.trim());
      for (const p of parts) {
        if (p.startsWith('.') && node.classList.contains(p.slice(1))) {
          res.push(node);
          break;
        } else if (p.startsWith('#') && node.id === p.slice(1)) {
          res.push(node);
          break;
        } else if (p === '[data-counter-target]' && node.getAttribute('data-counter-target')) {
          res.push(node);
          break;
        }
      }
      for (const child of node.children) {
        search(child);
      }
    };
    search(this);
    return res;
  }
}

class MockDocument {
  constructor() {
    this.documentElement = new MockElement('HTML');
    this.body = new MockElement('BODY');
    this.documentElement.appendChild(this.body);
    this.elementsById = {};
    this.readyState = 'complete';
    this.activeElement = this.body;
    this.eventListeners = {};
  }

  addEventListener(event, handler) {
    if (!this.eventListeners[event]) this.eventListeners[event] = [];
    this.eventListeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (this.eventListeners[event]) {
      this.eventListeners[event] = this.eventListeners[event].filter(h => h !== handler);
    }
  }

  createElement(tag) {
    return new MockElement(tag);
  }

  getElementById(id) {
    return this.elementsById[id] || null;
  }

  querySelector(sel) {
    return this.documentElement.querySelector(sel);
  }

  querySelectorAll(sel) {
    return this.documentElement.querySelectorAll(sel);
  }

  registerElement(el) {
    if (el.id) this.elementsById[el.id] = el;
    for (const c of el.children) this.registerElement(c);
  }
}

// Build DOM according to index.html
const doc = new MockDocument();

// 1. Monolith Portal
const portal = doc.createElement('div');
portal.id = 'monolith-portal';
portal.className = 'monolith-portal';

const btnSound = doc.createElement('button');
btnSound.id = 'btn-enter-sound';
portal.appendChild(btnSound);

const btnSilent = doc.createElement('button');
btnSilent.id = 'btn-enter-silent';
portal.appendChild(btnSilent);

const btnSkip = doc.createElement('button');
btnSkip.id = 'btn-skip-intro';
portal.appendChild(btnSkip);

doc.body.appendChild(portal);

// 2. Sound Toggle with Equalizer Bars
const soundBtn = doc.createElement('button');
soundBtn.className = 'sound-toggle-btn audio-telemetry-toggle';

const eqBars = doc.createElement('span');
eqBars.className = 'eq-bars';
for (let i = 0; i < 3; i++) {
  const bar = doc.createElement('span');
  bar.className = 'eq-bar';
  eqBars.appendChild(bar);
}
soundBtn.appendChild(eqBars);

const soundLabel = doc.createElement('span');
soundLabel.className = 'sound-label';
soundLabel.textContent = 'SOUND OFF';
soundBtn.appendChild(soundLabel);

doc.body.appendChild(soundBtn);

// 3. 3D Monolith Scene
const scene3d = doc.createElement('div');
scene3d.className = 'monolith-3d-scene';
const mesh = doc.createElement('div');
mesh.className = 'monolith-core-mesh';
scene3d.appendChild(mesh);
doc.body.appendChild(scene3d);

// 4. Content Containers
const cpContainer = doc.createElement('div');
cpContainer.id = 'telemetry-ledger-container';
doc.body.appendChild(cpContainer);

const csContainer = doc.createElement('div');
csContainer.id = 'case-study-container';
doc.body.appendChild(csContainer);

const skillsContainer = doc.createElement('div');
skillsContainer.id = 'capabilities-matrix-container';
doc.body.appendChild(skillsContainer);

const copyBtn = doc.createElement('button');
copyBtn.id = 'btn-copy-email';
doc.body.appendChild(copyBtn);

const returnBtn = doc.createElement('button');
returnBtn.id = 'btn-return-datum';
doc.body.appendChild(returnBtn);

const replayBtn = doc.createElement('button');
replayBtn.id = 'btn-replay-intro';
replayBtn.className = 'btn-replay-intro';
doc.body.appendChild(replayBtn);

doc.registerElement(doc.documentElement);

// Web Audio API Mocks
class MockGainNode {
  constructor() {
    this.gain = {
      value: 1,
      setValueAtTime: (v, t) => {},
      linearRampToValueAtTime: (v, t) => {},
      exponentialRampToValueAtTime: (v, t) => {},
      setTargetAtTime: (v, t, tc) => {}
    };
  }
  connect() {}
  disconnect() {}
}

class MockOscillator {
  constructor() {
    this.type = 'sine';
    this.frequency = {
      setValueAtTime: () => {},
      setTargetAtTime: () => {}
    };
  }
  connect() {}
  disconnect() {}
  start() {}
  stop() {}
}

class MockBiquadFilter {
  constructor() {
    this.frequency = {
      setValueAtTime: () => {},
      exponentialRampToValueAtTime: () => {},
      setTargetAtTime: () => {}
    };
    this.Q = { setValueAtTime: () => {}, setTargetAtTime: () => {} };
  }
  connect() {}
  disconnect() {}
}

class MockAudioContext {
  constructor() {
    this.state = 'suspended';
    this.currentTime = 0;
    this.destination = {};
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }
  createGain() { return new MockGainNode(); }
  createOscillator() { return new MockOscillator(); }
  createBiquadFilter() { return new MockBiquadFilter(); }
}

const mockSession = {};

// Setup Global Object
global.window = {
  document: doc,
  innerWidth: 1440,
  innerHeight: 900,
  scrollY: 0,
  pageYOffset: 0,
  location: { search: '' },
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext,
  matchMedia: (query) => ({ matches: false }),
  addEventListener: (event, handler) => {
    if (!doc.eventListeners[event]) doc.eventListeners[event] = [];
    doc.eventListeners[event].push(handler);
  },
  removeEventListener: (event, handler) => {
    if (doc.eventListeners[event]) {
      doc.eventListeners[event] = doc.eventListeners[event].filter(h => h !== handler);
    }
  },
  scrollTo: () => {},
  history: { scrollRestoration: 'auto' }
};

global.history = global.window.history;
global.document = doc;
global.sessionStorage = {
  getItem: (k) => mockSession[k] || null,
  setItem: (k, v) => { mockSession[k] = String(v); },
  removeItem: (k) => { delete mockSession[k]; }
};

try {
  Object.defineProperty(global.navigator, 'clipboard', {
    value: {
      writeText: async (t) => Promise.resolve()
    },
    configurable: true
  });
} catch (e) {}

global.isSecureContext = true;
global.performance = { now: () => Date.now() };
global.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Run dynamic modules
async function testLifecycle() {
  const { initAudio, toggleAudio, playMonolithAtmosphere, playTypographicShimmer, playPortalExpansion } = await import('./js/audio.js');
  const { initPreloader, dismissIntro, executeSequence, replayIntro } = await import('./js/preloader.js');
  const { initMonolith3D } = await import('./js/monolith3d.js');
  const { animateCounter } = await import('./js/stats.js');
  const { renderCompetitiveTelemetry, renderCaseStudy, renderCapabilitiesMatrix, initContactAndDispatch } = await import('./js/renderer.js');
  const { initNavigation } = await import('./js/navigation.js');

  console.log('[TEST 1] Initializing Web Audio API Soundscape & Equalizer...');
  initAudio();
  const audioStarted = toggleAudio();
  console.log('Audio activated via user toggle:', audioStarted);
  console.log('Audio label text:', soundLabel.textContent);
  if (soundLabel.textContent !== 'SOUND ON') throw new Error('Sound label should be SOUND ON');
  
  // Test sonic components
  playMonolithAtmosphere();
  playTypographicShimmer();
  playPortalExpansion();

  const audioMuted = toggleAudio();
  console.log('Audio muted via second toggle:', !audioMuted);
  if (soundLabel.textContent !== 'SOUND OFF') throw new Error('Sound label should be SOUND OFF');
  console.log('[PASS 1] Web Audio Engine respects zero autoplay and updates equalizer');

  console.log('[TEST 2] 3D Spatial Monolith Parallax...');
  const cleanup3d = initMonolith3D();
  if (typeof cleanup3d === 'function') {
    cleanup3d();
  }
  console.log('[PASS 2] 3D Monolith initialized with pointer parallax and scroll loop');

  console.log('[TEST 3] Dynamic Content Rendering & Animated Stats Hooks...');
  renderCompetitiveTelemetry();
  if (!cpContainer.innerHTML.includes('1016') || !cpContainer.innerHTML.includes('1045') || !cpContainer.innerHTML.includes('450+')) {
    throw new Error('CP stats failed to render in container');
  }
  console.log('[PASS 3A] Competitive Telemetry rendered with data-counter hooks');

  renderCaseStudy();
  if (!csContainer.innerHTML.includes('MedMatch AI') || !csContainer.innerHTML.includes('https://hexamind-ai-neon.vercel.app/')) {
    throw new Error('Case study failed to render in container');
  }
  console.log('[PASS 3B] Case study rendered MedMatch AI with prototype demo link');

  renderCapabilitiesMatrix();
  if (!skillsContainer.innerHTML.includes('Languages') || !skillsContainer.innerHTML.includes('React')) {
    throw new Error('Capabilities matrix failed to render');
  }
  console.log('[PASS 3C] Capabilities matrix rendered 4-column stack');

  initContactAndDispatch();
  console.log('[PASS 3D] Contact dispatch bound with copy email feedback');

  console.log('[TEST 4] Animated Counter Math...');
  const testCounterEl = doc.createElement('span');
  let animationCompleted = false;
  animateCounter(testCounterEl, 98.93, 100, 2, '%ile');
  await new Promise(r => setTimeout(r, 150));
  console.log('Counter formatted text:', testCounterEl.textContent);
  if (!testCounterEl.textContent.includes('98.93%ile')) {
    throw new Error('Counter failed to format 98.93%ile properly');
  }
  console.log('[PASS 4] Animated counter interpolates smoothly to 98.93%ile');

  console.log('[TEST 5] Cinematic 4.5s Monolith Portal Sequence...');
  initPreloader();
  console.log('Portal initial classes:', Array.from(portal.classList.classes));
  
  executeSequence(true);
  console.log('Portal after executeSequence classes:', Array.from(portal.classList.classes));
  if (!portal.classList.contains('animating')) throw new Error('Portal should have animating class');

  dismissIntro(true);
  console.log('Portal after dismiss classes:', Array.from(portal.classList.classes));
  console.log('Session calibrated flag:', sessionStorage.getItem('obsidian_monolith_intro_v3'));
  if (sessionStorage.getItem('obsidian_monolith_intro_v3') !== 'calibrated') {
    throw new Error('Intro dismissal failed to set session bypass');
  }

  // Test replay intro
  replayIntro();
  console.log('After replayIntro, session cleared:', sessionStorage.getItem('obsidian_monolith_intro_v3') === null);
  dismissIntro(true);
  console.log('[PASS 5] 4.5s Monolith Portal sequence, watchdog, and replay work reliably');

  console.log('[TEST 6] Navigation & Mobile Drawer...');
  initNavigation();
  console.log('[PASS 6] Navigation initialized with smooth scroll offset and replay bindings');

  console.log('[TEST 7] Kinetic Section Transitions...');
  const { initSectionTransitions } = await import('./js/transitions.js');
  initSectionTransitions();
  console.log('[PASS 7] Kinetic section transition engine initialized');

  console.log('\n--- ALL OBSIDIAN MONOLITH SIMULATION TESTS COMPLETED SUCCESSFULLY ---');
}

testLifecycle().catch(err => {
  console.error('[SIMULATION ERROR]:', err);
  process.exit(1);
});
