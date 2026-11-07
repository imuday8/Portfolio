import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, RotateCcw, X } from "lucide-react";

const links = [
  ["Projects", "#work"],
  ["GitHub", "#github"],
  ["Journey", "#journey"],
  ["Profiles", "#profiles"],
  ["About", "#about"],
  ["Skills", "#toolkit"],
];
const trackedSections = [
  ["Projects", "#work"],
  ["GitHub", "#github"],
  ["Journey", "#journey"],
  ["Profiles", "#profiles"],
  ["About", "#about"],
  ["Skills", "#toolkit"],
  ["Contact", "#contact"],
];

export default function Navigation({ onReplayIntro }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#top");
  const toggleRef = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    const sections = trackedSections
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-25% 0px -62% 0px", threshold: [0, 0.2, 0.45, 0.7] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={`site-header${open ? " menu-open" : ""}`}>
      <a className="brand-mark" href="#top" aria-label="Uday Saha, back to top">
        <span>US</span>
        <i>.</i>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href], index) => (
          <a
            href={href}
            key={href}
            className={active === href ? "is-active" : undefined}
            aria-current={active === href ? "location" : undefined}
          >
            <span>0{index + 1}</span>
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-contact" href="#contact">
        Let’s connect{" "}
        <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
      </a>
      <button
        className="nav-replay"
        type="button"
        onClick={(event) => onReplayIntro?.(event.currentTarget)}
        disabled={!onReplayIntro}
        aria-label="Replay cinematic introduction"
        title={
          onReplayIntro
            ? "Replay intro"
            : "Intro animation is off while reduced motion is enabled"
        }
      >
        <RotateCcw size={13} aria-hidden="true" />
        <span>Replay</span>
      </button>
      <button
        ref={toggleRef}
        className="menu-toggle"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav
        className="mobile-nav"
        id="mobile-nav"
        aria-label="Mobile navigation"
        inert={!open}
      >
        {trackedSections.map(([label, href], index) => (
          <a
            href={href}
            key={href}
            onClick={close}
            className={active === href ? "is-active" : undefined}
          >
            <span>0{index + 1} /</span>
            {label}
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        ))}
        <button
          className="mobile-replay"
          type="button"
          disabled={!onReplayIntro}
          onClick={(event) => {
            close();
            onReplayIntro?.(event.currentTarget);
          }}
        >
          <span>↺ /</span>
          Replay intro
        </button>
      </nav>
    </header>
  );
}
