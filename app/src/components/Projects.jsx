import { ArrowUpRight, MoveUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";
import hexamindLogo from "../../public/hexamind-logo.png";

function ProjectLink({ href, children }) {
  return (
    <a
      className="project-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
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

function PortfolioArt() {
  return (
    <div className="project-art portfolio-art" aria-hidden="true">
      <div className="art-browser-bar portfolio-bar">
        <span />
        <span />
        <span />
        <i>UDAY SAHA / BEYOND THE HORIZON</i>
        <small>LIVE EXPERIENCE</small>
      </div>
      <div className="portfolio-browser-scene">
        <span className="mono-label">A DIGITAL STUDIO / 001</span>
        <strong>
          Beyond
          <br />
          <em>the horizon.</em>
        </strong>
        <div className="portfolio-browser-lines">
          <i />
          <i />
          <i />
        </div>
        <span className="portfolio-browser-orbit" />
        <span className="mono-label portfolio-browser-foot">
          REACT / THREE.JS / GSAP
        </span>
      </div>
    </div>
  );
}

function HexamindArt() {
  return (
    <div className="project-art medmatch-art" aria-hidden="true">
      <div className="art-browser-bar med-bar">
        <span />
        <span />
        <span />
        <i>HEXAMIND / RESOURCE FINDER</i>
        <small>PROTOTYPE</small>
      </div>
      <div className="hexamind-project-lockup">
        <img src={hexamindLogo} alt="" />
        <span className="mono-label">
          TEAM HEXAMIND / EMERGENCY-CARE DISCOVERY
        </span>
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
        <span className="art-coordinate mono-label">03—03</span>
      </div>
    </div>
  );
}

export default function Projects() {
  const { pyreach, portfolio, hexamind } = portfolioData.projects;
  return (
    <section
      className="projects section-frame content-section"
      id="work"
      aria-labelledby="work-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">02 / THREE PROJECT CHAPTERS</span>
        <span className="section-count mono-label">02 — 06</span>
      </div>
      <div className="section-title-row" data-reveal>
        <h2 className="section-title" id="work-title">
          Work with a <em>point of view.</em>
        </h2>
        <p className="section-deck">
          Three different questions, explored through software, systems, and the
          way we see them.
        </p>
      </div>

      <article
        className="project-feature project-chapter"
        data-reveal
        data-motion="left"
      >
        <PyReachArt />
        <div className="project-copy">
          <div className="project-meta mono-label">
            <span>01 / TEAM CODESINS</span>
            <span>STATIC ANALYSIS TOOL</span>
          </div>
          <h3>
            {pyreach.name}
            <span className="period">.</span>
          </h3>
          <p className="project-lede">
            Trace whether a vulnerability can be reached from an application
            entry point.
          </p>
          <p className="project-body">
            PyReach statically follows Python call paths to vulnerable
            dependency functions and presents the path as inspectable evidence.
          </p>
          <div className="role-line">
            <span className="mono-label">MY CONTRIBUTION</span>
            <p>{pyreach.contribution}</p>
          </div>
          <div className="tech-row" aria-label="Technologies used">
            <span>Python</span>
            <span>AST</span>
            <span>FastAPI</span>
            <span>JavaScript</span>
          </div>
          <div className="project-links">
            <ProjectLink href={pyreach.url}>Team repository</ProjectLink>
            <ProjectLink href={pyreach.forkUrl}>My public fork</ProjectLink>
          </div>
          <p className="project-caveat">
            The interface is an explanatory sample, not a live scan. PyReach
            parses source statically and does not execute scanned code.
          </p>
        </div>
      </article>

      <article
        className="project-portfolio project-chapter"
        data-reveal
        data-motion="depth"
      >
        <PortfolioArt />
        <div className="project-copy">
          <div className="project-meta mono-label">
            <span>02 / PERSONAL PROJECT</span>
            <span>LIVE ON GITHUB PAGES</span>
          </div>
          <h3>
            {portfolio.name}
            <span className="period">.</span>
          </h3>
          <p className="project-lede">
            An interactive portfolio staged as a journey from orbit to the work.
          </p>
          <p className="project-body">
            React and Three.js bring a NASA Black Marble Earth into an editorial
            experience shaped by scroll, motion, and real project details.
          </p>
          <div className="role-line">
            <span className="mono-label">MY CONTRIBUTION</span>
            <p>{portfolio.contribution}</p>
          </div>
          <div className="tech-row" aria-label="Technologies used">
            <span>React</span>
            <span>Three.js</span>
            <span>GSAP</span>
            <span>Lenis</span>
          </div>
          <div className="project-links">
            <ProjectLink href={portfolio.url}>Open live portfolio</ProjectLink>
            <ProjectLink href={portfolio.repositoryUrl}>
              Browse source
            </ProjectLink>
          </div>
        </div>
      </article>

      <article
        className="project-secondary project-chapter"
        data-reveal
        data-motion="right"
      >
        <div className="project-copy secondary-copy">
          <div className="project-meta mono-label">
            <span>03 / {hexamind.team.toUpperCase()}</span>
            <span>MULTI-PAGE PROTOTYPE</span>
          </div>
          <h3>
            {hexamind.name}
            <span className="period">.</span>
          </h3>
          <p className="project-lede">
            Emergency-care discovery, explored as a connected workflow.
          </p>
          <p className="project-body">{hexamind.description}</p>
          <div className="role-line">
            <span className="mono-label">MY CONTRIBUTION</span>
            <p>{hexamind.contribution}</p>
          </div>
          <div className="tech-row" aria-label="Technologies used">
            <span>HTML</span>
            <span>CSS</span>
            <span>JavaScript</span>
            <span>Node.js</span>
          </div>
          <div className="project-links">
            <ProjectLink href={hexamind.url}>
              Open the live prototype
            </ProjectLink>
            <ProjectLink href={hexamind.repositoryUrl}>
              Browse Hexamind source
            </ProjectLink>
          </div>
          <p className="project-caveat">
            The display is an interface study, not a screenshot.{" "}
            {hexamind.dataNote}
          </p>
        </div>
        <HexamindArt />
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
