import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown } from "lucide-react";

const particles = [
  [-42, -28],
  [-31, 17],
  [-25, -40],
  [-15, 33],
  [-8, -22],
  [4, 41],
  [13, -35],
  [22, 26],
  [34, -12],
  [42, 32],
  [-47, 5],
  [46, -25],
  [-34, 42],
  [29, 44],
  [-4, -44],
  [39, 9],
  [-20, 4],
  [9, 17],
];

export default function CinematicIntro({
  identity,
  sceneStatus,
  onEnter,
  ready,
}) {
  const rootRef = useRef(null);
  const skipRef = useRef(null);
  const countRef = useRef(null);
  const name = identity.name.split("");

  useEffect(() => {
    if (!ready) return undefined;
    const sequence = { progress: 1 };
    countRef.current.textContent = "1%";
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => onEnter(),
      });
      timeline
        .fromTo(
          ".intro-starveil",
          { opacity: 0 },
          { opacity: 1, duration: 1.8, ease: "power1.out" },
          0,
        )
        .fromTo(
          ".intro-initialize",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.55 },
          0.75,
        )
        .fromTo(
          ".intro-laser",
          { scaleX: 0 },
          { scaleX: 1, duration: 1.2, ease: "power3.inOut" },
          1.2,
        )
        .fromTo(
          ".cinematic-letter",
          { autoAlpha: 0, rotateY: 100, rotateX: 12, z: -90, y: 12 },
          {
            autoAlpha: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            y: 0,
            duration: 0.68,
            stagger: 0.12,
            ease: "power3.out",
          },
          4.85,
        )
        .to(
          ".intro-particle",
          {
            left: "50%",
            top: "50%",
            opacity: 0.74,
            scale: 1,
            duration: 1.5,
            stagger: { each: 0.025, from: "random" },
            ease: "power3.inOut",
          },
          5.15,
        )
        .fromTo(
          ".intro-role",
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.7 },
          7.6,
        )
        .fromTo(
          ".intro-arrival",
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.6 },
          9.25,
        )
        .to(
          sequence,
          {
            progress: 100,
            duration: 11,
            ease: "none",
            onUpdate: () => {
              const progress = sequence.progress / 100;
              if (countRef.current)
                countRef.current.textContent = `${Math.floor(sequence.progress)}%`;
              window.dispatchEvent(
                new CustomEvent("portfolio:entry-progress", {
                  detail: progress,
                }),
              );
            },
          },
          0,
        )
        .to(
          ".intro-progress-fill",
          { scaleX: 1, duration: 11, ease: "none" },
          0,
        )
        .to(rootRef.current, { autoAlpha: 0, duration: 0.72 }, 10.28);
    }, rootRef);
    return () => context.revert();
  }, [onEnter, ready]);

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    let touchStartY = null;
    const fastForward = (event) => {
      event.preventDefault();
      event.stopPropagation();
      onEnter({ toProjects: true });
    };
    const handleWheel = (event) => {
      if (event.deltaY > 12) fastForward(event);
    };
    const handleTouchStart = (event) => {
      touchStartY = event.touches[0]?.clientY ?? null;
    };
    const handleTouchMove = (event) => {
      const currentY = event.touches[0]?.clientY;
      if (touchStartY !== null && currentY < touchStartY - 28)
        fastForward(event);
    };
    const trapFocus = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEnter();
        return;
      }
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        fastForward(event);
        return;
      }
      if (event.key !== "Tab" || !rootRef.current) return;
      const focusable = [
        ...rootRef.current.querySelectorAll("button:not([disabled])"),
      ];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const root = rootRef.current;
    root?.addEventListener("wheel", handleWheel, { passive: false });
    root?.addEventListener("touchstart", handleTouchStart, { passive: true });
    root?.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", trapFocus);
    return () => {
      root?.removeEventListener("wheel", handleWheel);
      root?.removeEventListener("touchstart", handleTouchStart);
      root?.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", trapFocus);
    };
  }, [onEnter]);

  return (
    <div
      className="cinematic-intro"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-name"
    >
      <div className="intro-starveil" aria-hidden="true" />
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-topline">
        <span className="mono-label">{identity.name.toUpperCase()}</span>
        <span className="mono-label">BEYOND THE HORIZON / 001</span>
      </div>
      <div className="intro-center">
        <div className="intro-laser" aria-hidden="true" />
        <p className="intro-initialize mono-label">
          INITIALIZING THE EXPERIENCE
        </p>
        <h1
          className="cinematic-name"
          id="intro-name"
          aria-label={identity.name}
        >
          {name.map((letter, index) => (
            <span
              className={`cinematic-letter${letter === " " ? " letter-space" : ""}`}
              aria-hidden="true"
              key={`${letter}-${index}`}
            >
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
          <i className="intro-sweep" aria-hidden="true" />
        </h1>
        <div className="intro-particles" aria-hidden="true">
          {particles.map(([x, y], index) => (
            <i
              className="intro-particle"
              key={index}
              style={{ "--particle-x": `${x}vw`, "--particle-y": `${y}vh` }}
            />
          ))}
        </div>
        <p className="intro-role mono-label">
          A STUDENT BUILDER / DELHI NCR, INDIA
        </p>
        <div className="intro-arrival mono-label">
          <span>THE HORIZON IS IN VIEW</span>
          <ArrowDown size={14} aria-hidden="true" />
        </div>
      </div>
      <div className="intro-bottomline">
        <div className="intro-status">
          <span className="status-light" aria-hidden="true" />
          <span className="mono-label" role="status">
            SCENE STATUS · {sceneStatus}
          </span>
        </div>
        <div className="intro-counter" aria-label="Cinematic sequence timeline">
          <span className="mono-label">CINEMATIC SEQUENCE</span>
          <strong ref={countRef}>1%</strong>
        </div>
      </div>
      <div className="intro-progress-track" aria-hidden="true">
        <div className="intro-progress-fill" />
      </div>
      <button
        ref={skipRef}
        className="intro-skip"
        type="button"
        onClick={() => onEnter()}
      >
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
