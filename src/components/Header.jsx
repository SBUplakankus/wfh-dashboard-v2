import React from 'react';
import { Settings } from 'lucide-react';

const Header = ({ title, onOpenSettings }) => (
  <header className="header card">
    <div>
      <h1>{title}</h1>
      <p>Game Dev Unified Dashboard v2</p>
    </div>
    <button className="btn icon-btn" aria-label="Open settings" onClick={onOpenSettings} type="button">
      <Settings size={15} aria-hidden="true" />
    </button>
  </header>
);

export default Header;
