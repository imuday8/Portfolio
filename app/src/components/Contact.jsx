import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { portfolioData } from "../data/portfolioData.js";

export default function Contact() {
  return (
    <section
      className="contact section-frame content-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="section-eyebrow" data-reveal>
        <span className="mono-label">CHAPTER 10 / THE NEXT CONVERSATION</span>
        <span className="section-count mono-label">10 — 10</span>
      </div>
      <div className="contact-body" data-reveal>
        <p className="mono-label contact-kicker">SOMETHING ON YOUR MIND?</p>
        <h2 className="contact-title" id="contact-title">
          Let’s make
          <br />
          <em>something matter.</em>
        </h2>
        <a
          className="contact-cta"
          href={`mailto:${portfolioData.identity.email}`}
        >
          <span>Write me a note</span>
          <ArrowUpRight size={19} aria-hidden="true" />
        </a>
      </div>
      <div className="contact-bottom" data-reveal>
        <div>
          <span className="mono-label">ELSEWHERE ON THE INTERNET</span>
          <div className="social-links">
            {portfolioData.socials.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
        <a className="return-link mono-label" href="#top">
          RETURN TO THE SURFACE <ArrowDownRight size={14} aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
