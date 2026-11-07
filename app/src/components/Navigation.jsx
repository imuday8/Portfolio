import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Menu, RotateCcw, X } from "lucide-react";

const links = [
  ["Home", "#home"],
  ["Projects", "#work"],
  ["Achievements", "#journey"],
  ["Coding", "#profiles"],
  ["About", "#about"],
  ["Contact", "#contact"],
];

export default function Navigation({ onReplayIntro }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("#home");
  const toggleRef = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    const sections = links
      .map(([, href]) => document.querySelector(href))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-22% 0px -65% 0px", threshold: [0, 0.25, 0.5, 0.75] },
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
      <a className="brand-mark" href="#home" aria-label="Uday Saha, home">
        <span>UDAY SAHA</span>
        <i aria-hidden="true">.</i>
      </a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a
            href={href}
            key={href}
            className={active === href ? "is-active" : undefined}
            aria-current={active === href ? "location" : undefined}
          >
            {label}
          </a>
        ))}
      </nav>
      <a className="nav-contact" href="#contact">
        Start a conversation{" "}
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
        <RotateCcw size={14} aria-hidden="true" />
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
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav
        className="mobile-nav"
        id="mobile-nav"
        aria-label="Mobile navigation"
        inert={!open}
      >
        {links.map(([label, href]) => (
          <a
            href={href}
            key={href}
            onClick={close}
            className={active === href ? "is-active" : undefined}
            aria-current={active === href ? "location" : undefined}
          >
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
          <span aria-hidden="true">↺</span>
          Replay the intro
        </button>
      </nav>
    </header>
  );
}
