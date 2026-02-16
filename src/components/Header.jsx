import React from 'react';

const Header = ({ title, onOpenSettings }) => (
  <header className="header card">
    <div>
      <h1>{title}</h1>
      <p>Game Dev Unified Dashboard v2</p>
    </div>
    <button className="btn" onClick={onOpenSettings} type="button">
      Settings
    </button>
  </header>
);

export default Header;
