import React from 'react';
import { Settings } from 'lucide-react';

const Header = ({ title, onOpenSettings }) => (
  <header className="header card">
    <div>
      <h1>{title}</h1>
      <p>Game Dev Unified Dashboard v2</p>
    </div>
    <button className="btn" onClick={onOpenSettings} type="button">
      <span className="row"><Settings size={14} aria-hidden="true" /> Settings</span>
    </button>
  </header>
);

export default Header;
