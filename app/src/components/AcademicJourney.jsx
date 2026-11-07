import { ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

export default function AcademicJourney() {
  const identity = portfolioData.identity;
  return (
    <section
      className="academic section-frame content-section"
      id="journey"
      aria-labelledby="academic-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">06 / ACHIEVEMENTS & EDUCATION</span>
        <span className="section-count mono-label">06 — 08</span>
      </div>
      <div className="academic-stage" data-reveal data-motion="orbit">
        <div className="academic-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>01</span>
        </div>
        <div className="academic-copy">
          <p className="mono-label academic-kicker">JEE MAIN / PERCENTILE</p>
          <h2 className="academic-number" id="academic-title">
            {identity.jeeMainPercentile}
            <span>%ile</span>
          </h2>
          <p className="academic-caption">
            One measured milestone. The next one is still being written.
          </p>
        </div>
        <div className="academic-education">
          <span className="mono-label">CURRENT CHAPTER / {identity.years}</span>
          <h3>{identity.school}</h3>
          <p>{identity.program}</p>
          <p className="academic-note">
            Computer Science & Artificial Intelligence, at the beginning of a
            longer path through engineering and creative work.
          </p>
          <a href="#about">
            The person behind the process{" "}
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
