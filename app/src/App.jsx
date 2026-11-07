import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Navigation from "./components/Navigation.jsx";
import Hero from "./components/Hero.jsx";
import CompetitiveProfiles from "./components/CompetitiveProfiles.jsx";
import Projects from "./components/Projects.jsx";
import About from "./components/About.jsx";
import Toolkit from "./components/Toolkit.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import TechnologyStrip from "./components/TechnologyStrip.jsx";
import GitHubArchive from "./components/GitHubArchive.jsx";
import AcademicJourney from "./components/AcademicJourney.jsx";
import { sceneMotion } from "./sceneState.js";

const SceneEnvironment = lazy(
  () => import("./components/SceneEnvironment.jsx"),
);
gsap.registerPlugin(ScrollTrigger);

function userPrefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function App() {
  const rootRef = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(userPrefersReducedMotion);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      sceneMotion.reducedMotion = query.matches;
      setReducedMotion(query.matches);
      if (query.matches) {
        setSceneReady(true);
      }
    };
    syncMotion();
    query.addEventListener?.("change", syncMotion);
    return () => query.removeEventListener?.("change", syncMotion);
  }, []);

  useEffect(() => {
    sceneMotion.introActive = false;
    sceneMotion.introProgress = 1;
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
          const sceneStage = document.querySelector(".scene-stage");
          if (sceneStage) {
            const presence = 0.18 + 0.74 * Math.exp(-self.progress * 11);
            sceneStage.style.opacity = String(
              presence * (window.innerWidth <= 680 ? 0.76 : 1),
            );
          }
        },
      });
      gsap.utils.toArray("[data-reveal]").forEach((target) => {
        const motion = target.dataset.motion || "up";
        const initial = {
          left: { x: -38, y: 4, rotateY: 2 },
          right: { x: 38, y: 4, rotateY: -2 },
          depth: { z: -58, scale: 0.96, y: 14 },
          orbit: { x: -18, y: 20, rotate: -1.5 },
          up: { y: 22 },
        }[motion];
        gsap.fromTo(
          target,
          { autoAlpha: 0, ...initial },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            z: 0,
            rotate: 0,
            rotateY: 0,
            scale: 1,
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
    if (reducedMotion || sceneReady) return undefined;
    const fallback = window.setTimeout(() => {
      setSceneReady(true);
    }, 12000);
    return () => window.clearTimeout(fallback);
  }, [reducedMotion, sceneReady]);

  const markSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  const markSceneFallback = useCallback(() => {
    setSceneReady(true);
  }, []);

  return (
    <div className="app-root" ref={rootRef}>
      <div
        className={"scene-stage" + (sceneReady ? " scene-ready" : "")}
        aria-hidden="true"
      >
        <Suspense
          fallback={<div className="orb-fallback scene-loading-fallback" />}
        >
          <SceneEnvironment
            onReady={markSceneReady}
            onUnavailable={markSceneFallback}
          />
        </Suspense>
        <div className="scene-grain" />
        <div className="scene-vignette" />
      </div>
      <div className="site-shell intro-complete">
        <Navigation />
        <main className="site-main" id="main">
          <Hero />
          <TechnologyStrip />
          <Projects />
          <Toolkit />
          <CompetitiveProfiles />
          <GitHubArchive />
          <AcademicJourney />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
