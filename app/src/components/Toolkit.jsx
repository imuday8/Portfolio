import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { skillGroups } from '../data/skills.js';

export default function Toolkit() {
  const [active, setActive] = useState('Build');
  const group = skillGroups[active];
  const selectWithArrow = (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const names = Object.keys(skillGroups);
    const current = names.indexOf(active);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? names.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : names.length - 1)) % names.length;
    setActive(names[next]);
    requestAnimationFrame(() => document.getElementById(`skill-tab-${names[next].toLowerCase()}`)?.focus());
  };
  return (
    <section className="toolkit section-frame content-section" id="toolkit" aria-labelledby="toolkit-title">
      <div className="section-eyebrow" data-reveal><span className="mono-label">CHAPTER 04 / THE TOOLKIT</span><span className="section-count mono-label">04 — 06</span></div>
      <div className="section-title-row" data-reveal>
        <h2 className="section-title" id="toolkit-title">Tools for the <em>in-between.</em></h2>
        <p className="section-deck">Not a list of scores. Just the tools I reach for, and the things I’m still learning to do with them.</p>
      </div>
      <div className="toolkit-panel" data-reveal>
        <div className="toolkit-index"><span className="mono-label">CHOOSE A MODE</span><span className="toolkit-asterisk" aria-hidden="true">✳</span>
          <div className="skill-tabs" role="tablist" aria-label="Explore Uday’s toolkit">
            {Object.keys(skillGroups).map((name, i) => <button key={name} type="button" role="tab" id={`skill-tab-${name.toLowerCase()}`} aria-selected={active === name} aria-controls="skill-panel" tabIndex={active === name ? 0 : -1} onKeyDown={selectWithArrow} onClick={() => setActive(name)}><span>0{i+1}</span>{name}<ArrowUpRight size={14} aria-hidden="true" /></button>)}
          </div>
        </div>
        <div className="skill-panel" id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${active.toLowerCase()}`} key={active}>
          <p className="mono-label skill-eyebrow">{group.eyebrow}</p>
          <p className="skill-description">{group.copy}</p>
          <ul className="skill-list">{group.items.map((item, i) => <li key={item}><span className="skill-seq mono-label">0{i+1}</span>{item}<span className="skill-spark" aria-hidden="true">✳</span></li>)}</ul>
        </div>
      </div>
      <div className="toolkit-foot mono-label" data-reveal><span>GIT / GITHUB / VS CODE</span><span>LEARNING IS PART OF THE BUILD <i>↗</i></span></div>
    </section>
  );
}

