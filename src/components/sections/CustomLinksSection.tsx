import React from 'react';
import IconGlyph from '../IconGlyph';

const CustomLinksSection = ({ links = [] }: { links?: any[] }) => (
  <section className="md3-card space-y-4 p-6">
    <h3 className="text-base font-semibold tracking-tight">Custom Links</h3>
    {links.length === 0 ? <p className="text-sm text-md3-on-surface-variant">No custom links configured.</p> : null}
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {links.map((link) => (
        <a className="md3-button w-full justify-start gap-2" href={link.path} key={link.id} target="_blank" rel="noreferrer">
          <IconGlyph name={link.icon || 'link'} />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  </section>
);

export default CustomLinksSection;
