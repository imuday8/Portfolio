import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navigation from "./components/Navigation.jsx";
import Hero from "./components/Hero.jsx";
import CompetitiveProfiles from "./components/CompetitiveProfiles.jsx";
import Projects from "./components/Projects.jsx";
import About from "./components/About.jsx";
import Toolkit from "./components/Toolkit.jsx";
import ExperimentalLab from "./components/ExperimentalLab.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import { sceneMotion } from "./sceneState.js";

const SceneEnvironment = lazy(
  () => import("./components/SceneEnvironment.jsx"),
);
gsap.registerPlugin(ScrollTrigger);

function hasSeenIntro() {
  try {
    return sessionStorage.getItem("uday-intro-seen") === "1";
  } catch {
    return false;
  }
}

function userPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const firstVisit = useRef(!hasSeenIntro() && !userPrefersReducedMotion());
  const rootRef = useRef(null);
  const introTimeline = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(userPrefersReducedMotion);
  const [introDone, setIntroDone] = useState(
    () => hasSeenIntro() || userPrefersReducedMotion(),
  );

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      sceneMotion.reducedMotion = query.matches;
      setReducedMotion(query.matches);
      if (query.matches) {
        firstVisit.current = false;
        setSceneReady(true);
        setIntroDone(true);
      }
    };
    syncMotion();
    query.addEventListener?.("change", syncMotion);
    return () => query.removeEventListener?.("change", syncMotion);
  }, []);

  useEffect(() => {
    sceneMotion.visible = document.visibilityState === "visible";
    const updateVisibility = () => {
      sceneMotion.visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", updateVisibility);
    return () =>
      document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  useEffect(() => {
    const movePointer = (event) => {
      sceneMotion.pointerX = (event.clientX / window.innerWidth) * 2 - 1;
      sceneMotion.pointerY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", movePointer, { passive: true });
    return () => window.removeEventListener("pointermove", movePointer);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const lenis = new Lenis({
      duration: 0.9,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: true,
    });
    const onScroll = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);
    lenis.on("scroll", onScroll);
    gsap.ticker.add(tick);

    const context = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".site-main",
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          sceneMotion.scroll = self.progress;
        },
      });
      gsap.utils.toArray("[data-reveal]").forEach((target) => {
        gsap.fromTo(
          target,
          { autoAlpha: 0, y: 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.68,
            ease: "power2.out",
            scrollTrigger: { trigger: target, start: "top 88%", once: true },
          },
        );
      });
    }, rootRef);

    const refreshOnFonts = () => ScrollTrigger.refresh();
    document.fonts?.ready?.then(refreshOnFonts);
    window.addEventListener("load", refreshOnFonts, { once: true });
    return () => {
      window.removeEventListener("load", refreshOnFonts);
      gsap.ticker.remove(tick);
      context.revert();
      lenis.destroy();
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const fallback = window.setTimeout(() => setSceneReady(true), 1250);
    return () => window.clearTimeout(fallback);
  }, [reducedMotion]);

  useEffect(() => {
    if (!sceneReady || introDone || reducedMotion) return undefined;
    const context = gsap.context(() => {
      introTimeline.current = gsap
        .timeline({
          defaults: { ease: "power2.out" },
          onComplete: () => {
            try {
              sessionStorage.setItem("uday-intro-seen", "1");
            } catch {}
            setIntroDone(true);
          },
        })
        .to(
          ".boot-line",
          { scaleX: 1, duration: 0.95, ease: "power3.inOut" },
          0,
        )
        .fromTo(
          ".boot-kicker",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.18,
        )
        .fromTo(
          ".boot-copy",
          { autoAlpha: 0, y: 14, letterSpacing: "0.32em" },
          { autoAlpha: 1, y: 0, letterSpacing: "0.16em", duration: 0.72 },
          0.45,
        )
        .fromTo(
          ".boot-subtitle",
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.55 },
          0.86,
        )
        .to(
          ".boot-screen",
          { autoAlpha: 0, duration: 0.65, ease: "power2.inOut" },
          "+=0.72",
        );
    }, rootRef);
    return () => {
      context.revert();
      introTimeline.current = null;
    };
  }, [sceneReady, introDone, reducedMotion]);

  useEffect(() => {
    if (!introDone || !firstVisit.current || reducedMotion) return undefined;
    firstVisit.current = false;
    const context = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".intro-kicker",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.35 },
          0,
        )
        .fromTo(
          ".hero-title-line",
          { yPercent: 106, rotate: 2 },
          { yPercent: 0, rotate: 0, duration: 0.75, stagger: 0.07 },
          0.06,
        )
        .fromTo(
          ".hero-description, .hero-actions, .site-header",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.48, stagger: 0.06 },
          0.35,
        );
    }, rootRef);
    return () => context.revert();
  }, [introDone, reducedMotion]);

  const skipIntro = () => {
    introTimeline.current?.kill();
    firstVisit.current = false;
    try {
      sessionStorage.setItem("uday-intro-seen", "1");
    } catch {}
    setSceneReady(true);
    setIntroDone(true);
  };

  return (
    <div className="app-root" ref={rootRef}>
      {!introDone && !reducedMotion && (
        <div className="boot-screen" role="status" aria-live="polite">
          <span className="boot-kicker mono-label">
            UDAY SAHA / DIGITAL STUDIO · 001
          </span>
          <span className="boot-copy">WELCOME TO MY UNIVERSE</span>
          <span className="boot-subtitle mono-label">
            CREATIVE TECHNOLOGIST · DELHI NCR
          </span>
          <button type="button" className="boot-skip" onClick={skipIntro}>
            Skip intro <span aria-hidden="true">↗</span>
          </button>
          <div className="boot-line" />
        </div>
      )}
      <div
        className={`scene-stage${sceneReady ? " scene-ready" : ""}`}
        aria-hidden="true"
      >
        <Suspense fallback={<div className="orb-fallback" />}>
          <SceneEnvironment onReady={() => setSceneReady(true)} />
        </Suspense>
        <div className="scene-grain" />
        <div className="scene-vignette" />
      </div>
      <div
        className={`site-shell${introDone || reducedMotion ? " intro-complete" : ""}`}
        inert={!introDone && !reducedMotion}
      >
        <Navigation />
        <main className="site-main" id="main">
          <Hero />
          <CompetitiveProfiles />
          <Projects />
          <About />
          <Toolkit />
          <ExperimentalLab />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
