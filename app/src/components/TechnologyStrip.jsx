const technologies = [
  "JavaScript",
  "React",
  "Python",
  "C++",
  "Three.js",
  "FastAPI",
  "GitHub Actions",
];

export default function TechnologyStrip() {
  return (
    <div
      className="technology-strip section-frame"
      aria-label="Tools used across my projects"
    >
      <span className="technology-strip-label">TOOLS I’M LEARNING WITH</span>
      <div className="technology-list">
        {technologies.map((technology) => (
          <span key={technology}>{technology}</span>
        ))}
      </div>
    </div>
  );
}
