import { ArrowDown } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

export default function Hero() {
  return (
    <section
      className="hero section-frame"
      id="home"
      aria-labelledby="hero-title"
    >
      <div className="hero-coordinate mono-label">
        EARTH AT NIGHT <span>·</span> 01 / 06
      </div>
      <div className="hero-copy">
        <p className="intro-kicker mono-label">
          <span className="live-pip" aria-hidden="true" />
          {portfolioData.identity.role}
        </p>
        <p className="hero-byline mono-label">
          {portfolioData.identity.name} <span>·</span> COMPUTER SCIENCE & AI
        </p>
        <h1 className="hero-title" id="hero-title" tabIndex={-1}>
          <span className="hero-title-clip">
            <span className="hero-title-line hero-serif">Beyond the</span>
          </span>
          <span className="hero-title-clip">
            <span className="hero-title-line hero-condensed">
              Horizon<span className="period">.</span>
            </span>
          </span>
        </h1>
        <p className="hero-description">
          I’m {portfolioData.identity.name.split(" ")[0]} — a student builder
          interested in careful engineering, clear interfaces, and tools that
          help people see how systems work.
        </p>
      </div>
      <div className="hero-captions" aria-hidden="true">
        <span>01 — THE WORLD, SEEN FROM HERE</span>
        <span>AN INTERACTIVE PORTFOLIO BY UDAY SAHA</span>
      </div>
      <a
        className="scroll-cue"
        href="#work"
        aria-label="Scroll to discover projects"
      >
        <span>SCROLL TO DISCOVER</span>
        <ArrowDown size={15} strokeWidth={1.3} aria-hidden="true" />
      </a>
      <span className="hero-orb-caption mono-label" aria-hidden="true">
        ORBITAL STUDY / 001
      </span>
      <span className="hero-side-index mono-label" aria-hidden="true">
        FIG. A
      </span>
    </section>
  );
}
