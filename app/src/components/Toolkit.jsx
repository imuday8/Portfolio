import {
  ArrowUpRight,
  Code2,
  GitBranch,
  Orbit,
  Search,
  Shapes,
  Workflow,
} from "lucide-react";

const capabilities = [
  {
    icon: Code2,
    title: "Interfaces",
    copy: "Responsive React experiences with clear hierarchy and useful detail.",
    tools: "REACT / JAVASCRIPT / CSS",
    tone: "violet",
  },
  {
    icon: Search,
    title: "Systems thinking",
    copy: "Follow a problem from its inputs to an explanation someone can inspect.",
    tools: "PYTHON / AST / ALGORITHMS",
    tone: "blue",
  },
  {
    icon: Workflow,
    title: "Useful tooling",
    copy: "Small workflows, dashboards, and automations shaped around real tasks.",
    tools: "NODE.JS / FASTAPI / GITHUB ACTIONS",
    tone: "indigo",
  },
  {
    icon: Orbit,
    title: "Visual computing",
    copy: "Explore motion, depth, and data as part of an interactive interface.",
    tools: "THREE.JS / REACT THREE FIBER",
    tone: "cyan",
  },
  {
    icon: Shapes,
    title: "Product exploration",
    copy: "Turn early ideas into flows people can understand and try.",
    tools: "PROTOTYPING / UI ENGINEERING",
    tone: "pink",
  },
  {
    icon: GitBranch,
    title: "Team building",
    copy: "Share work, clarify contributions, and learn through collaboration.",
    tools: "GIT / CODE REVIEW / ITERATION",
    tone: "violet",
  },
];

export default function Toolkit() {
  return (
    <section
      className="toolkit section-frame content-section"
      id="toolkit"
      aria-labelledby="toolkit-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">03 / HOW I LIKE TO BUILD</span>
        <span className="section-count mono-label">03 — 08</span>
      </div>
      <div className="capabilities-heading" data-reveal>
        <div>
          <p className="capabilities-overline">CURIOSITY, PUT TO WORK</p>
          <h2 className="section-title" id="toolkit-title">
            A few useful <em>directions.</em>
          </h2>
        </div>
        <p className="section-deck">
          Different projects call for different tools. These are the areas I’m
          practicing, building, and learning in.
        </p>
      </div>
      <div className="capability-grid">
        {capabilities.map(({ icon: Icon, title, copy, tools, tone }, index) => (
          <article
            className={"capability-card capability-" + tone}
            data-reveal
            key={title}
          >
            <div className="capability-card-top">
              <span className="capability-icon">
                <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="capability-index">0{index + 1}</span>
            </div>
            <h3>{title}</h3>
            <p>{copy}</p>
            <div className="capability-card-foot">
              <span>{tools}</span>
              <ArrowUpRight size={14} aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
