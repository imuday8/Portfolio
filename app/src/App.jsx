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
import CinematicIntro from "./components/CinematicIntro.jsx";
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
import { portfolioData } from "./data/portfolioData.js";
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
  const introReturnFocus = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneStatus, setSceneStatus] = useState("WAITING FOR 3D SCENE");
  const [reducedMotion, setReducedMotion] = useState(userPrefersReducedMotion);
  const [introDone, setIntroDone] = useState(() => userPrefersReducedMotion());

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => {
      sceneMotion.reducedMotion = query.matches;
      setReducedMotion(query.matches);
      if (query.matches) {
        setSceneReady(true);
        setIntroDone(true);
      }
    };
    syncMotion();
    query.addEventListener?.("change", syncMotion);
    return () => query.removeEventListener?.("change", syncMotion);
  }, []);

  useEffect(() => {
    sceneMotion.introActive = !introDone && !reducedMotion;
    sceneMotion.introProgress = sceneMotion.introActive ? 0 : 1;
    const updateProgress = (event) => {
      sceneMotion.introProgress = event.detail;
    };
    window.addEventListener("portfolio:entry-progress", updateProgress);
    return () =>
      window.removeEventListener("portfolio:entry-progress", updateProgress);
  }, [introDone, reducedMotion]);

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
      duration: 0.62,
      smoothWheel: true,
      syncTouch: false,
      autoRaf: false,
      anchors: true,
    });
    const onScroll = () => ScrollTrigger.update();
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.lagSmoothing(0);
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
        onRefresh: (self) => {
          sceneMotion.scroll = self.progress;
        },
      });
      gsap.fromTo(
        ".hero-dashboard",
        { y: 0, rotateX: 0, scale: 1 },
        {
          y: -54,
          rotateX: 2,
          scale: 0.965,
          ease: "none",
          transformOrigin: "50% 0%",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.65,
          },
        },
      );
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
            duration: 0.82,
            ease: "power3.out",
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
      setSceneStatus("3D PREVIEW UNAVAILABLE · CONTINUING");
      setSceneReady(true);
    }, 7000);
    return () => window.clearTimeout(fallback);
  }, [reducedMotion, sceneReady]);

  const markSceneReady = useCallback(() => {
    setSceneStatus("3D ENVIRONMENT READY");
    setSceneReady(true);
  }, []);

  const markSceneFallback = useCallback(() => {
    setSceneStatus("3D PREVIEW UNAVAILABLE · CONTINUING");
    setSceneReady(true);
  }, []);

  const enterExperience = useCallback((options = {}) => {
    sceneMotion.introActive = false;
    sceneMotion.introProgress = 1;
    setIntroDone(true);
    requestAnimationFrame(() => {
      const target = introReturnFocus.current || document.querySelector("#hero-title");
      target?.focus?.({ preventScroll: true });
      introReturnFocus.current = null;
      if (options.toProjects) {
        document.querySelector("#work")?.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    });
  }, [reducedMotion]);

  const replayIntro = useCallback((trigger) => {
    if (reducedMotion) return;
    introReturnFocus.current = trigger || null;
    sceneMotion.introActive = true;
    sceneMotion.introProgress = 0;
    setIntroDone(false);
  }, [reducedMotion]);

  return (
    <div className="app-root" ref={rootRef}>
      {!introDone && !reducedMotion && (
        <CinematicIntro
          identity={portfolioData.identity}
          sceneStatus={sceneStatus}
          ready={sceneReady}
          onEnter={enterExperience}
        />
      )}
      <div
        className={"scene-stage" + (sceneReady ? " scene-ready" : "")}
        aria-hidden="true"
        inert={!introDone && !reducedMotion}
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
      <div
        className={"site-shell" + (introDone || reducedMotion ? " intro-complete" : "")}
        inert={!introDone && !reducedMotion}
      >
        <Navigation onReplayIntro={reducedMotion ? undefined : replayIntro} />
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
