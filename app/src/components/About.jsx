import { Asterisk } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

export default function About() {
  return (
    <section
      className="about section-frame content-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">
          CHAPTER 09 / THE PERSON BEHIND THE PROCESS
        </span>
        <span className="section-count mono-label">09 — 10</span>
      </div>
      <div className="about-layout">
        <div className="about-heading" data-reveal>
          <h2 className="section-title" id="about-title">
            Curiosity is a <em>practice.</em>
          </h2>
          <p className="about-aside mono-label">
            A WORKING NOTE
            <br />
            NOT A FINISHED STORY
          </p>
        </div>
        <div className="about-story" data-reveal>
          <span className="dropcap" aria-hidden="true">
            U
          </span>
          <div>
            <p className="about-lede">
              I’m studying {portfolioData.identity.program.split(" / ")[0]} in{" "}
              {portfolioData.identity.program.split(" / ")[1]} at{" "}
              {portfolioData.identity.school}.
            </p>
            <p>
              I like the moment when a messy problem becomes something you can
              reason about. That curiosity pulls me between frontend interfaces,
              algorithms, and tools that make systems easier to inspect.
            </p>
            <p>
              Right now, I’m building foundations — writing code, joining team
              projects, and learning to make every decision a little more
              deliberate.
            </p>
            <div className="about-signoff">
              <span className="signature">{portfolioData.identity.name}</span>
              <span className="mono-label">
                {portfolioData.identity.location.toUpperCase()}{" "}
                <Asterisk size={12} aria-hidden="true" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
