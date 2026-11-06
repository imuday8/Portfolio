import { ArrowDown, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero section-frame" id="top" aria-labelledby="hero-title">
      <div className="hero-coordinate mono-label">NEWTON SCHOOL OF TECHNOLOGY <span>·</span> 2026—2030</div>
      <div className="hero-copy">
        <p className="intro-kicker mono-label"><span className="live-pip" aria-hidden="true" />CREATIVE TECHNOLOGIST / COMPUTER SCIENCE &amp; AI</p>
        <h1 className="hero-title" id="hero-title">
          <span className="hero-title-clip"><span className="hero-title-line hero-serif">Creative</span></span>
          <span className="hero-title-clip"><span className="hero-title-line hero-condensed">Developer<span className="period">.</span></span></span>
        </h1>
        <div className="hero-lower">
          <p className="hero-description">I’m Uday — a student builder exploring how careful engineering and considered design can make complex things easier to see.</p>
          <div className="hero-actions">
            <a className="button-primary" href="#work">Explore selected work <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a className="button-text" href="#about">A little about me <span aria-hidden="true">↘</span></a>
          </div>
        </div>
      </div>
      <aside className="hero-aside" aria-label="A little context">
        <span className="aside-index mono-label">FIELD NOTE / 01</span>
        <p>Designing the unexpected.<br /><em>Engineering with intent.</em></p>
        <span className="aside-rule" />
        <span className="mono-label aside-bottom">DELHI NCR, INDIA<br />ONLINE / OPEN TO IDEAS</span>
      </aside>
      <div className="hero-captions" aria-hidden="true"><span>01 — 06 / THE MAKING OF A SIGNAL</span><span>AN INTERACTIVE PORTFOLIO BY UDAY SAHA</span></div>
      <a className="scroll-cue" href="#work"><span>SCROLL TO BEGIN</span><ArrowDown size={15} strokeWidth={1.3} aria-hidden="true" /></a>
      <span className="hero-orb-caption mono-label" aria-hidden="true">ORBITAL STUDY / 001</span>
      <span className="hero-side-index mono-label" aria-hidden="true">FIG. A</span>
    </section>
  );
}

