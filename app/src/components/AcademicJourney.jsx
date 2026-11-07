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
        <span className="mono-label">
          CHAPTER 05 / THE JOURNEY BEHIND THE CODE
        </span>
        <span className="section-count mono-label">05 — 10</span>
      </div>
      <div className="academic-stage" data-reveal>
        <div className="academic-orbit" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>01</span>
        </div>
        <div className="academic-copy">
          <p className="mono-label academic-kicker">
            ACADEMIC CHECKPOINT / JEE MAIN
          </p>
          <h2 className="academic-number" id="academic-title">
            {identity.jeeMainPercentile}
            <span>%ile</span>
          </h2>
          <p className="academic-caption">
            A verified percentile, and one milestone on a much longer path.
          </p>
          <div className="academic-facts">
            <div>
              <span className="mono-label">EXAM YEAR</span>
              <strong>{identity.jeeMainYear || "Not provided"}</strong>
            </div>
            <div>
              <span className="mono-label">JEE MAIN RANK</span>
              <strong>
                {identity.jeeMainRank
                  ? `#${identity.jeeMainRank.toLocaleString("en-IN")}`
                  : "Not provided"}
              </strong>
            </div>
          </div>
        </div>
        <div className="academic-education">
          <span className="mono-label">NOW / {identity.years}</span>
          <h3>{identity.program}</h3>
          <p>{identity.school}</p>
          <p className="academic-note">
            Rank and examination year are left blank because they are not
            present in the verified profile details.
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
