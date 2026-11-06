import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navigation from './components/Navigation.jsx';
import Hero from './components/Hero.jsx';
import Projects from './components/Projects.jsx';
import About from './components/About.jsx';
import Toolkit from './components/Toolkit.jsx';
import ExperimentalLab from './components/ExperimentalLab.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';
import { sceneMotion } from './sceneState.js';

const SceneEnvironment = lazy(() => import('./components/SceneEnvironment.jsx'));
gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const bootTimer = useRef(null);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => {
      sceneMotion.reducedMotion = query.matches;
      setReducedMotion(query.matches);
      if (query.matches) setIntroDone(true);
    };
    syncMotion();
    query.addEventListener?.('change', syncMotion);
    return () => query.removeEventListener?.('change', syncMotion);
  }, []);

  useEffect(() => {
    const updateVisibility = () => { sceneMotion.visible = document.visibilityState === 'visible'; };
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const movePointer = (event) => {
      sceneMotion.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      sceneMotion.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', movePointer, { passive: true });
    return () => window.removeEventListener('pointermove', movePointer);
  }, []);

  useEffect(() => {
    if (!sceneReady) return undefined;
    if (reducedMotion || sessionStorage.getItem('uday-intro-seen') === '1') {
      setIntroDone(true);
      return undefined;
    }
    const timeline = gsap.timeline({
      onComplete: () => {
        setIntroDone(true);
        sessionStorage.setItem('uday-intro-seen', '1');
      }
    });
    timeline
      .fromTo('.intro-kicker', { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0)
      .fromTo('.hero-title-line', { yPercent: 110, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 0.82, stagger: 0.08, ease: 'power4.out' }, 0.15)
      .fromTo('.hero-description, .hero-actions, .hero-aside, .site-header', { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' }, 0.48);
    return () => timeline.kill();
  }, [sceneReady, reducedMotion]);

  useEffect(() => {
    if (reducedMotion) {
      setSceneReady(true);
      return undefined;
    }
    bootTimer.current = window.setTimeout(() => setSceneReady(true), 1800);
    return () => window.clearTimeout(bootTimer.current);
  }, [reducedMotion]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: reducedMotion ? 0 : 1.05,
      smoothWheel: !reducedMotion,
      syncTouch: false,
      autoRaf: false
    });
    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const pathTrigger = ScrollTrigger.create({
      trigger: '.site-main',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => { sceneMotion.scroll = self.progress; }
    });
    const revealTargets = gsap.utils.toArray('[data-reveal]');
    const revealTriggers = revealTargets.map((target) => gsap.fromTo(target,
      { autoAlpha: 0, y: reducedMotion ? 0 : 26 },
      { autoAlpha: 1, y: 0, duration: reducedMotion ? 0 : 0.8, ease: 'power3.out', scrollTrigger: { trigger: target, start: 'top 84%', once: true } }
    ));
    return () => {
      gsap.ticker.remove(tick);
      pathTrigger.kill();
      revealTriggers.forEach((animation) => animation.scrollTrigger?.kill());
      lenis.destroy();
    };
  }, [reducedMotion]);

  const skipIntro = () => {
    gsap.killTweensOf('.hero-title-line, .intro-kicker, .hero-description, .hero-actions, .hero-aside, .site-header');
    gsap.set('.intro-kicker, .hero-title-line, .hero-description, .hero-actions, .hero-aside, .site-header', { clearProps: 'all' });
    sessionStorage.setItem('uday-intro-seen', '1');
    setIntroDone(true);
  };

  return (
    <>
      {!sceneReady && !reducedMotion && <div className="boot-screen" role="status" aria-live="polite">
        <span className="boot-mark">US<span>.</span></span>
        <span className="boot-copy">LIGHTING THE SCENE</span>
        <button type="button" className="boot-skip" onClick={() => { setSceneReady(true); skipIntro(); }}>Skip intro <span aria-hidden="true">↗</span></button>
        <div className="boot-line"><i /></div>
      </div>}
      <div className={`scene-stage${sceneReady ? ' scene-ready' : ''}`} aria-hidden="true">
        <Suspense fallback={<div className="orb-fallback" />}>
          <SceneEnvironment onReady={() => setSceneReady(true)} />
        </Suspense>
        <div className="scene-grain" />
        <div className="scene-vignette" />
      </div>
      <div className={`site-shell${introDone || reducedMotion ? ' intro-complete' : ''}`}>
        <Navigation />
        <main className="site-main" id="main">
          <Hero onSceneReady={() => setSceneReady(true)} />
          <Projects />
          <About />
          <Toolkit />
          <ExperimentalLab />
          <Contact />
        </main>
        <Footer />
      </div>
      <div className="motion-hint" aria-hidden="true"><span>SCROLL TO CHANGE THE LIGHT</span><i /></div>
    </>
  );
}

