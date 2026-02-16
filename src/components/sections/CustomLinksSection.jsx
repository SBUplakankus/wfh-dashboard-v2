import React from 'react';
import IconGlyph from '../IconGlyph';

const CustomLinksSection = ({ links = [] }) => (
  <section className="card stack">
    <h3>Custom Links</h3>
    {links.length === 0 ? <p className="muted">No custom links configured.</p> : null}
    {links.map((link) => (
      <a className="btn" href={link.path} key={link.id} target="_blank" rel="noreferrer">
        <span className="row"><IconGlyph name={link.icon || 'link'} /> {link.label}</span>
      </a>
    ))}
  </section>
);

export default CustomLinksSection;
