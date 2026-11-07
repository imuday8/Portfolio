import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const particlePositions = [
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
  const [complete, setComplete] = useState(false);
  const name = identity.name.split("");

  useEffect(() => {
    if (!ready) return undefined;
    const context = gsap.context(() => {
      const sequence = { progress: 0 };
      const timeline = gsap.timeline({
        defaults: { ease: "power2.out" },
        onComplete: () => {
          try {
            sessionStorage.setItem("uday-intro-seen", "1");
          } catch {}
          setComplete(true);
        },
      });
      timeline
        .to(
          ".intro-laser",
          {
            scaleX: 1,
            duration: 0.7,
            ease: "power3.inOut",
          },
          0,
        )
        .fromTo(
          ".intro-initialize",
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.42 },
          0.15,
        )
        .fromTo(
          ".cinematic-letter",
          { autoAlpha: 0, rotateY: 96, rotateX: 14, z: -72, y: 12 },
          {
            autoAlpha: 1,
            rotateY: 0,
            rotateX: 0,
            z: 0,
            y: 0,
            duration: 0.56,
            stagger: 0.075,
            ease: "back.out(1.35)",
          },
          0.72,
        )
        .to(
          ".intro-particle",
          {
            left: "50%",
            top: "50%",
            opacity: 0.85,
            scale: 1,
            duration: 1.25,
            stagger: { each: 0.025, from: "random" },
            ease: "power3.inOut",
          },
          1.05,
        )
        .to(
          ".intro-sweep",
          { left: "112%", opacity: 0.75, duration: 0.9, ease: "power2.inOut" },
          3.25,
        )
        .fromTo(
          ".intro-role, .intro-enter",
          { autoAlpha: 0, y: 13 },
          { autoAlpha: 1, y: 0, duration: 0.52, stagger: 0.12 },
          3.65,
        )
        .to(
          sequence,
          {
            progress: 100,
            duration: 5.3,
            ease: "none",
            onUpdate: () => {
              if (countRef.current)
                countRef.current.textContent = `${Math.floor(sequence.progress)}%`;
              window.dispatchEvent(
                new CustomEvent("portfolio:entry-progress", {
                  detail: sequence.progress / 100,
                }),
              );
            },
          },
          0.4,
        )
        .to(
          ".intro-progress-fill",
          { scaleX: 1, duration: 5.3, ease: "none" },
          0.4,
        );
    }, rootRef);
    return () => {
      context.revert();
    };
  }, [ready]);

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
    const trapFocus = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEnter();
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
    window.addEventListener("keydown", trapFocus);
    return () => window.removeEventListener("keydown", trapFocus);
  }, [onEnter]);

  return (
    <div
      className="cinematic-intro"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-name"
    >
      <div className="intro-grain" aria-hidden="true" />
      <div className="intro-topline">
        <span className="mono-label">
          {identity.name.toUpperCase()} / DIGITAL STUDIO
        </span>
        <span className="mono-label">ENTRY 001</span>
      </div>
      <div className="intro-center">
        <div className="intro-laser" aria-hidden="true" />
        <p className="intro-initialize mono-label">
          INITIALIZING CREATIVE UNIVERSE
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
          {particlePositions.map(([x, y], index) => (
            <i
              className="intro-particle"
              key={index}
              style={{ "--particle-x": `${x}vw`, "--particle-y": `${y}vh` }}
            />
          ))}
        </div>
        <p className="intro-role mono-label">{identity.role.toUpperCase()}</p>
        <div className="intro-enter-wrap">
          <button
            className="intro-enter"
            type="button"
            disabled={!complete}
            onClick={onEnter}
          >
            {complete ? "Explore my universe" : "Preparing the experience"}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <div className="intro-bottomline">
        <div className="intro-status">
          <span className="status-light" aria-hidden="true" />
          <span className="mono-label">SCENE STATUS · {sceneStatus}</span>
        </div>
        <div className="intro-counter">
          <span className="mono-label">ENTRY SEQUENCE</span>
          <strong ref={countRef}>0%</strong>
        </div>
      </div>
      <div className="intro-progress-track" aria-hidden="true">
        <div className="intro-progress-fill" />
      </div>
      <button
        ref={skipRef}
        className="intro-skip"
        type="button"
        onClick={onEnter}
      >
        Skip intro <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}
