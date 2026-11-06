import { ArrowUpRight, Asterisk } from 'lucide-react';

export default function About() {
  return (
    <section className="about section-frame content-section" id="about" aria-labelledby="about-title">
      <div className="section-eyebrow" data-reveal><span className="mono-label">CHAPTER 03 / THE PERSON BEHIND THE PROCESS</span><span className="section-count mono-label">03 — 06</span></div>
      <div className="about-layout">
        <div className="about-heading" data-reveal><h2 className="section-title" id="about-title">Curiosity is a <em>practice.</em></h2><p className="about-aside mono-label">A WORKING NOTE<br />NOT A FINISHED STORY</p></div>
        <div className="about-story" data-reveal>
          <span className="dropcap" aria-hidden="true">U</span>
          <div><p className="about-lede">I’m a B.Tech student in Computer Science &amp; Artificial Intelligence at Newton School of Technology, Rishihood University.</p>
            <p>I like the moment when a messy problem becomes something you can reason about. That curiosity pulls me between frontend interfaces, algorithms, and tools that make systems easier to inspect.</p>
            <p>Right now, I’m building foundations — writing code, joining team projects, and learning to make every decision a little more deliberate.</p>
            <div className="about-signoff"><span className="signature">Uday Saha</span><span className="mono-label">DELHI NCR / INDIA <Asterisk size={12} aria-hidden="true" /></span></div>
          </div>
        </div>
      </div>
      <div className="about-proof" data-reveal>
        <div className="proof-block"><span className="proof-number">98.93<small>%ile</small></span><span className="mono-label">JEE MAIN / 2026</span></div>
        <div className="proof-block"><span className="proof-overline mono-label">CURRENTLY STUDYING</span><strong>B.Tech / Computer Science &amp; AI</strong><span className="proof-sub">Newton School of Technology · Rishihood University</span></div>
        <div className="proof-block proof-link-block"><span className="proof-overline mono-label">SHOW UP, SOLVE, REPEAT</span><a href="https://codeforces.com/profile/Imuday08_" target="_blank" rel="noreferrer">My problem-solving practice <ArrowUpRight size={15} aria-hidden="true" /></a><span className="proof-sub">Codeforces · LeetCode</span></div>
      </div>
    </section>
  );
}

