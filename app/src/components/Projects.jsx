import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";
import hexamindLogo from "../../public/hexamind-logo.png";

function ProjectLink({ href, children }) {
  return (
    <a className="project-link" href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" />
    </a>
  );
}

function PyReachArt() {
  return (
    <div className="project-art pyreach-art" aria-hidden="true">
      <div className="art-browser-bar">
        <span />
        <span />
        <span />
        <i>PYREACH / EVIDENCE GRAPH</i>
        <small>STATIC · SAMPLE</small>
      </div>
      <div className="pyreach-console">
        <div className="code-card">
          <span className="code-file mono-label">/ app.py</span>
          <code>
            <i>01</i> import yaml
            <br />
            <i>02</i>
            <br />
            <i>03</i> <b>def</b> run():
            <br />
            <i>04</i> <mark> yaml.load(payload)</mark>
          </code>
        </div>
        <div className="graph-line" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="verdict-card">
          <span className="verdict-pip" />
          <span className="mono-label">RESULT</span>
          <strong>REACHABLE</strong>
          <small>
            run() → yaml.load
            <br />
            app.py : 04
          </small>
        </div>
      </div>
      <div className="project-art-bottom">
        <span className="mono-label">AST / BFS / EXPLAINABLE</span>
        <span className="art-coordinate mono-label">01—03</span>
      </div>
      <span className="art-watermark" aria-hidden="true">
        P
      </span>
    </div>
  );
}

function MedMatchArt() {
  return (
    <div className="project-art medmatch-art" aria-hidden="true">
      <div className="art-browser-bar med-bar">
        <span />
        <span />
        <span />
        <i>MEDMATCH / RESOURCE FINDER</i>
        <small>CONCEPT</small>
      </div>
      <div className="hexamind-project-lockup">
        <img src={hexamindLogo} alt="" />
        <span className="mono-label">MEDMATCH AI / TEAM HEXAMIND</span>
      </div>
      <div className="med-grid">
        <div className="med-map" aria-hidden="true">
          <svg viewBox="0 0 460 240">
            <path d="M18 177 C97 156 109 198 171 136 S280 108 320 139 S379 99 442 36" />
            <path d="M27 28 C104 70 139 21 198 71 S291 183 363 166 S409 180 452 151" />
            <path d="M49 235 C94 180 146 223 190 176 S253 170 289 104 S374 98 423 59" />
            <circle cx="318" cy="139" r="11" />
            <circle cx="171" cy="136" r="6" />
            <circle cx="442" cy="36" r="6" />
          </svg>
          <span className="map-pin pin-a">+</span>
          <span className="map-pin pin-b">+</span>
          <span className="map-ring" />
        </div>
        <div className="med-list">
          <span className="mono-label">PROTOTYPE INTERFACE / NOT LIVE</span>
          <strong>Hospital finder</strong>
          <div>
            <i>01</i>
            <span>
              City filters<small>Prototype control</small>
            </span>
            <b>UI</b>
          </div>
          <div>
            <i>02</i>
            <span>
              Hospital search<small>Prototype flow</small>
            </span>
            <b>UI</b>
          </div>
          <div>
            <i>03</i>
            <span>
              Bed / ICU counts<small>Simulated values</small>
            </span>
            <b>DEMO</b>
          </div>
        </div>
      </div>
      <div className="project-art-bottom">
        <span className="mono-label">TEAM HEXAMIND / INTERFACE STUDY</span>
        <span className="art-coordinate mono-label">02—03</span>
      </div>
    </div>
  );
}

function PortfolioArt() {
  return (
    <div className="project-art portfolio-art" aria-hidden="true">
      <div className="art-browser-bar portfolio-bar">
        <span />
        <span />
        <span />
        <i>UDAY SAHA / BEYOND THE ORDINARY</i>
        <small>COVER STUDY</small>
      </div>
      <div className="portfolio-browser-scene">
        <span className="mono-label">A DIGITAL STUDIO / 001</span>
        <strong>
          Creative
          <br />
          <em>Developer.</em>
        </strong>
        <div className="portfolio-browser-lines">
          <i />
          <i />
          <i />
        </div>
        <span className="portfolio-browser-orbit" />
        <span className="mono-label portfolio-browser-foot">
          WEBGL / REACT / EDITORIAL
        </span>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section
      className="projects section-frame content-section"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">CHAPTER 03 / SELECTED WORK</span>
        <span className="section-count mono-label">03 — 10</span>
      </div>
      <div className="section-title-row" data-reveal>
        <h2 className="section-title" id="work-title">
          Proof in the <em>process.</em>
        </h2>
        <p className="section-deck">
          Three live windows into the process: a team-built health prototype, a
          security analysis tool, and this portfolio itself.
        </p>
      </div>
      <article className="project-feature" data-reveal>
        <PyReachArt />
        <div className="project-copy">
          <div className="project-meta mono-label">
            <span>01 / HACK DAY SONIPAT</span>
            <span>{portfolioData.projects.pyreach.team.toUpperCase()}</span>
          </div>
          <h3>
            {portfolioData.projects.pyreach.name}
            <span className="period">.</span>
          </h3>
          <p className="project-lede">
            Can a vulnerability actually be reached from an application?
          </p>
          <p className="project-body">
            PyReach statically traces Python call paths from an app entry point
            to vulnerable dependency functions. Each verdict comes with evidence
            a developer can inspect.
          </p>
          <div className="role-line">
            <span className="mono-label">MY CONTRIBUTION</span>
            <p>{portfolioData.projects.pyreach.contribution}</p>
          </div>
          <div className="tech-row" aria-label="Technologies used">
            <span>Python</span>
            <span>AST</span>
            <span>FastAPI</span>
            <span>JavaScript</span>
          </div>
          <ProjectLink href={portfolioData.projects.pyreach.url}>
            Explore Team CodeSins on GitHub
          </ProjectLink>
          <ProjectLink href={portfolioData.projects.pyreach.forkUrl}>
            Open my public fork
          </ProjectLink>
          <p className="project-caveat">
            The visual is an explanatory sample fixture, not a live scan.
            PyReach parses source statically and does not execute scanned code.
          </p>
        </div>
      </article>
      <article className="project-secondary" data-reveal>
        <div className="project-copy secondary-copy">
          <div className="project-meta mono-label">
            <span>
              02 / {portfolioData.projects.medmatch.team.toUpperCase()}
            </span>
            <span>MULTI-PAGE PROTOTYPE</span>
          </div>
          <h3>
            {portfolioData.projects.medmatch.name}
            <span className="period">.</span>
          </h3>
          <p className="project-lede">
            Emergency-care discovery, explored as a connected workflow.
          </p>
          <p className="project-body">
            {portfolioData.projects.medmatch.description}
          </p>
          <div className="role-line">
            <span className="mono-label">MY CONTRIBUTION</span>
            <p>{portfolioData.projects.medmatch.contribution}</p>
          </div>
          <div className="tech-row">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>Node.js</span>
          </div>
          <ProjectLink href={portfolioData.projects.medmatch.url}>
            Explore MedMatch AI
          </ProjectLink>
          <ProjectLink href={portfolioData.projects.medmatch.repositoryUrl}>
            Browse the Hexamind source
          </ProjectLink>
          <ProjectLink href={portfolioData.projects.medmatch.repositoryReadme}>
            Read project notes
          </ProjectLink>
          <p className="project-caveat">
            The visual is an interface study, not a screenshot.{" "}
            {portfolioData.projects.medmatch.dataNote} It is not medical
            guidance.
          </p>
        </div>
        <MedMatchArt />
      </article>
      <article className="project-portfolio" data-reveal>
        <PortfolioArt />
        <div className="project-copy">
          <div className="project-meta mono-label">
            <span>03 / PERSONAL PROJECT</span>
            <span>LIVE ON GITHUB PAGES</span>
          </div>
          <h3>
            {portfolioData.projects.portfolio.name}
            <span className="period">.</span>
          </h3>
          <p className="project-lede">
            An interactive portfolio built as a small digital exhibition.
          </p>
          <p className="project-body">
            A React experience that pairs an editorial reading rhythm with a
            procedural WebGL sculpture, motion-led transitions, and public
            profile data.
          </p>
          <div className="role-line">
            <span className="mono-label">MY CONTRIBUTION</span>
            <p>{portfolioData.projects.portfolio.contribution}</p>
          </div>
          <div className="tech-row" aria-label="Technologies used">
            <span>React</span>
            <span>Three.js</span>
            <span>GSAP</span>
            <span>Lenis</span>
          </div>
          <ProjectLink href={portfolioData.projects.portfolio.url}>
            Open the live portfolio
          </ProjectLink>
          <ProjectLink href={portfolioData.projects.portfolio.repositoryUrl}>
            Browse the source
          </ProjectLink>
          <p className="project-caveat">
            The browser frame is an editorial study, not a screen capture.
          </p>
        </div>
      </article>
      <div className="project-endnote mono-label" data-reveal>
        <span>TEAM WORK, CLEARLY CREDITED</span>
        <span>
          THE WORK IS THE STORY <MoveUpRight size={13} aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
