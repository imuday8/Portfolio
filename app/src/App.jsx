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
import ExperimentalLab from "./components/ExperimentalLab.jsx";
import Contact from "./components/Contact.jsx";
import Footer from "./components/Footer.jsx";
import CinematicIntro from "./components/CinematicIntro.jsx";
import GitHubArchive from "./components/GitHubArchive.jsx";
import AcademicJourney from "./components/AcademicJourney.jsx";
import { sceneMotion } from "./sceneState.js";
import { portfolioData } from "./data/portfolioData.js";

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
  const introReturnFocus = useRef(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [sceneStatus, setSceneStatus] = useState("WAITING FOR WEBGL SCENE");
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
    sceneMotion.introActive = firstVisit.current;
    sceneMotion.introProgress = firstVisit.current ? 0 : 1;
    const updateIntroProgress = (event) => {
      sceneMotion.introProgress = event.detail;
    };
    window.addEventListener("portfolio:entry-progress", updateIntroProgress);
    return () =>
      window.removeEventListener(
        "portfolio:entry-progress",
        updateIntroProgress,
      );
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
    const fallback = window.setTimeout(() => {
      setSceneStatus("3D PREVIEW UNAVAILABLE · CONTINUING IN 2D");
      setSceneReady(true);
    }, 6000);
    return () => window.clearTimeout(fallback);
  }, [reducedMotion]);

  const enterExperience = useCallback(() => {
    firstVisit.current = false;
    sceneMotion.introActive = false;
    sceneMotion.introProgress = 1;
    try {
      sessionStorage.setItem("uday-intro-seen", "1");
    } catch {}
    setSceneReady(true);
    setIntroDone(true);
    requestAnimationFrame(() => {
      const target =
        introReturnFocus.current || document.querySelector("#hero-title");
      target?.focus?.({ preventScroll: true });
      introReturnFocus.current = null;
    });
  }, []);

  const replayIntro = useCallback(
    (trigger) => {
      if (reducedMotion) return;
      introReturnFocus.current = trigger || null;
      sceneMotion.introActive = true;
      sceneMotion.introProgress = 0;
      setIntroDone(false);
    },
    [reducedMotion],
  );

  const markSceneReady = useCallback(() => {
    setSceneStatus("3D ENVIRONMENT READY");
    setSceneReady(true);
  }, []);

  const markSceneFallback = useCallback(() => {
    setSceneStatus("3D PREVIEW UNAVAILABLE · CONTINUING IN 2D");
    setSceneReady(true);
  }, []);

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
        className={`scene-stage${sceneReady ? " scene-ready" : ""}`}
        aria-hidden="true"
        inert={!introDone && !reducedMotion}
      >
        <Suspense
          fallback={<div className="orb-fallback scene-loading-fallback" />}
        >
          <SceneEnvironment
            onReady={markSceneReady}
            onFallback={markSceneFallback}
          />
        </Suspense>
        <div className="scene-grain" />
        <div className="scene-vignette" />
      </div>
      <div
        className={`site-shell${introDone || reducedMotion ? " intro-complete" : ""}`}
        inert={!introDone && !reducedMotion}
      >
        <Navigation onReplayIntro={reducedMotion ? undefined : replayIntro} />
        <main className="site-main" id="main">
          <Hero />
          <Projects />
          <GitHubArchive />
          <AcademicJourney />
          <CompetitiveProfiles />
          <Toolkit />
          <About />
          <ExperimentalLab />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
