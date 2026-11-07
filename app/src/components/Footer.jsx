import { ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

export default function Footer() {
  return (
    <footer className="site-footer section-frame">
      <a className="brand-mark" href="#home" aria-label="Back to top">
        {portfolioData.identity.monogram}
        <i>.</i>
      </a>
      <span className="mono-label">
        MADE WITH CURIOSITY / {portfolioData.identity.name.toUpperCase()} / 2026
      </span>
      <a
        className="footer-link mono-label"
        href={portfolioData.profiles.github.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        SOURCE / GITHUB <ArrowUpRight size={12} aria-hidden="true" />
      </a>
      <a
        className="footer-link mono-label"
        href="https://science.nasa.gov/earth/earth-observatory/earth-at-night/maps/"
        target="_blank"
        rel="noopener noreferrer"
      >
        EARTH TEXTURE / NASA <ArrowUpRight size={12} aria-hidden="true" />
      </a>
    </footer>
  );
}
