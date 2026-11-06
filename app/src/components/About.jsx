import { ArrowUpRight, Asterisk } from "lucide-react";
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
          CHAPTER 04 / THE PERSON BEHIND THE PROCESS
        </span>
        <span className="section-count mono-label">04 — 07</span>
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
      <div className="about-proof" data-reveal>
        <div className="proof-block">
          <span className="proof-number">
            {portfolioData.identity.jeeMainPercentile}
            <small>%ile</small>
          </span>
          <span className="mono-label">JEE MAIN / 2026</span>
        </div>
        <div className="proof-block">
          <span className="proof-overline mono-label">CURRENTLY STUDYING</span>
          <strong>{portfolioData.identity.program}</strong>
          <span className="proof-sub">{portfolioData.identity.school}</span>
        </div>
        <div className="proof-block proof-link-block">
          <span className="proof-overline mono-label">
            SHOW UP, SOLVE, REPEAT
          </span>
          <a
            href={portfolioData.profiles.codeforces.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Codeforces profile <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <a
            href={portfolioData.profiles.leetcode.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            LeetCode profile <ArrowUpRight size={15} aria-hidden="true" />
          </a>
          <span className="proof-sub">Two views of the same practice.</span>
        </div>
      </div>
    </section>
  );
}
