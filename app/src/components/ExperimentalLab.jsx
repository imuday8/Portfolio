import { useState } from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { sceneMotion } from '../sceneState.js';

const palettes = [
  { label: 'Violet film', number: '01', value: 0, note: 'Pearl / lavender / silver' },
  { label: 'Tidal glass', number: '02', value: 1, note: 'Pale cyan / deep teal / ice' },
  { label: 'Last light', number: '03', value: 2, note: 'Warm chrome / rose / dusk' }
];

export default function ExperimentalLab() {
  const [active, setActive] = useState(0);
  const change = (palette) => {
    setActive(palette.value);
    sceneMotion.palette = palette.value;
  };
  return (
    <section className="lab section-frame content-section" id="lab" aria-labelledby="lab-title">
      <div className="section-eyebrow" data-reveal><span className="mono-label">CHAPTER 05 / EXPERIMENTAL LAB</span><span className="section-count mono-label">05 — 06</span></div>
      <div className="lab-grid" data-reveal>
        <div className="lab-copy">
          <p className="mono-label lab-kicker"><Sparkles size={13} aria-hidden="true" /> A SMALL STUDY IN LIGHT</p>
          <h2 className="section-title" id="lab-title">Change the <em>signal.</em></h2>
          <p className="section-deck">The sculpture follows the page. Here, change its light and watch the surface respond — an experiment in procedural color, not a pre-rendered loop.</p>
          <div className="palette-controls" role="group" aria-label="Choose sculpture palette">
            {palettes.map((palette) => <button key={palette.value} className={active === palette.value ? 'palette-button is-active' : 'palette-button'} type="button" aria-pressed={active === palette.value} onClick={() => change(palette)}><span className={`palette-swatch swatch-${palette.value}`} /><span className="palette-name"><small>{palette.number} /</small>{palette.label}</span><span className="palette-note">{palette.note}</span><span className="palette-check" aria-hidden="true">{active === palette.value ? '●' : '○'}</span></button>)}
          </div>
          <p className="mono-label lab-footnote">LIVE SHADER / TOUCH OR CLICK TO SWITCH</p>
        </div>
        <div className="lab-stage" role="img" aria-label="Decorative light study with a holographic sculpture and orbital rings">
          <div className="lab-crosshair cross-a" aria-hidden="true">+</div><div className="lab-crosshair cross-b" aria-hidden="true">+</div>
          <div className="lab-orbit-line orbit-a" aria-hidden="true" /><div className="lab-orbit-line orbit-b" aria-hidden="true" />
          <span className="lab-stage-label mono-label">MATERIAL STUDY / 01—03</span>
          <div className="lab-floor-light" aria-hidden="true" />
          <span className="lab-stage-index mono-label">FRESNEL / IRIDESCENCE / NOISE</span>
        </div>
      </div>
    </section>
  );
}

