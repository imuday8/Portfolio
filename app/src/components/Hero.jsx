import { ArrowDown, ArrowUpRight, GitBranch } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

export default function Hero() {
  const { identity, profiles, projects } = portfolioData;
  const stats = [
    {
      label: "LeetCode solved",
      value: profiles.leetcode.stats.solved,
      note: "public profile",
    },
    {
      label: "Codeforces rating",
      value: profiles.codeforces.stats.rating,
      note: profiles.codeforces.stats.rank,
    },
    {
      label: "Public repositories",
      value: profiles.github.stats.publicRepos,
      note: "GitHub",
    },
  ];

  return (
    <section
      className="hero section-frame"
      id="home"
      aria-labelledby="hero-title"
    >
      <div className="hero-copy">
        <p className="intro-kicker mono-label">
          <span className="live-pip" aria-hidden="true" />
          {identity.role}{" "}
          <span className="hero-location">/ {identity.location}</span>
        </p>
        <h1 className="hero-title" id="hero-title">
          I build tools
          <br />
          <em>with intent.</em>
        </h1>
        <p className="hero-description">
          I’m {identity.name.split(" ")[0]}, a student developer drawn to
          thoughtful interfaces, clear systems, and ideas that become useful.
        </p>
        <div className="hero-actions">
          <a className="hero-primary" href="#work">
            Explore my work <ArrowDown size={15} aria-hidden="true" />
          </a>
          <a
            className="hero-secondary"
            href={profiles.github.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitBranch size={15} aria-hidden="true" /> GitHub{" "}
            <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div
        className="hero-dashboard"
        aria-label="Portfolio overview with verified public profile statistics and featured projects"
      >
        <div className="dashboard-topbar">
          <div className="dashboard-brand">
            <span className="dashboard-mark">US</span>
            <span>
              UDAY / PORTFOLIO
              <small>PUBLIC PROFILE SNAPSHOT</small>
            </span>
          </div>
          <div className="dashboard-tabs" aria-hidden="true">
            <span className="selected">Overview</span>
            <span>Projects</span>
            <span>Signals</span>
          </div>
          <a className="dashboard-top-link" href="#contact">
            Say hello <ArrowUpRight size={13} aria-hidden="true" />
          </a>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-welcome">
            <span className="dashboard-eyebrow">
              A STUDENT BUILDER / DELHI NCR
            </span>
            <h2>
              Good ideas,
              <br />
              <em>made tangible.</em>
            </h2>
            <p>
              Frontend experiments, engineering tools, and the lessons learned
              while building them.
            </p>
            <a href="#work">
              Selected work <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>

          <div className="dashboard-projects" aria-label="Featured projects">
            <div className="dashboard-project-heading">
              <span>FEATURED WORK</span>
              <span>01 — 03</span>
            </div>
            <a
              className="dashboard-project dashboard-project-pyreach"
              href="#work"
            >
              <span className="dashboard-project-icon">P</span>
              <span>
                <strong>{projects.pyreach.name}</strong>
                <small>Python / static analysis</small>
              </span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              className="dashboard-project dashboard-project-portfolio"
              href="#work"
            >
              <span className="dashboard-project-icon">✳</span>
              <span>
                <strong>Portfolio</strong>
                <small>React / interactive design</small>
              </span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
            <a
              className="dashboard-project dashboard-project-hexamind"
              href="#work"
            >
              <span className="dashboard-project-icon">H</span>
              <span>
                <strong>{projects.hexamind.name}</strong>
                <small>Team prototype / emergency-care discovery</small>
              </span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="dashboard-metrics">
          {stats.map((stat) => (
            <div className="dashboard-metric" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value.toLocaleString("en-IN")}</strong>
              <small>{stat.note}</small>
            </div>
          ))}
          <div className="dashboard-note">
            <span className="dashboard-note-dot" />
            <span>Numbers shown as published by each profile</span>
          </div>
        </div>
      </div>
      <span className="hero-caption mono-label">
        A WORK IN PROGRESS / ALWAYS LEARNING
      </span>
    </section>
  );
}
