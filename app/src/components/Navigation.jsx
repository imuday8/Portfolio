import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';

const links = [
  ['Work', '#work'],
  ['About', '#about'],
  ['Toolkit', '#toolkit'],
  ['Lab', '#lab']
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className={`site-header${open ? ' menu-open' : ''}`}>
      <a className="brand-mark" href="#top" aria-label="Uday Saha, back to top"><span>US</span><i>.</i></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href], index) => <a href={href} key={href}><span>0{index+1}</span>{label}</a>)}
      </nav>
      <a className="nav-contact" href="#contact">Let’s connect <ArrowUpRight size={14} strokeWidth={1.5} aria-hidden="true" /></a>
      <button className="menu-toggle" type="button" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
        {open ? <X size={19} /> : <Menu size={19} />}
      </button>
      <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation" inert={!open}>
        {links.map(([label, href], index) => <a href={href} key={href} onClick={close}><span>0{index+1} /</span>{label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}
        <a href="https://github.com/imuday8" target="_blank" rel="noreferrer" onClick={close}><span>↗</span>GitHub</a>
      </nav>
    </header>
  );
}

