import React, { useState } from 'react';
import ProjectManager from './settings/ProjectManager';
import ThemeCustomizer from './settings/ThemeCustomizer';
import CalendarSettings from './settings/CalendarSettings';

const tabs = ['Projects', 'Theme', 'Calendar', 'Tools'];

const SettingsPanel = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState('Projects');
  if (!open) return null;

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="settings card">
        <div className="row between">
          <h2>Settings</h2>
          <button className="btn" onClick={onClose} type="button">Close</button>
        </div>
        <div className="row">
          {tabs.map((tab) => (
            <button key={tab} className={`btn ${tab === activeTab ? 'active' : ''}`} onClick={() => setActiveTab(tab)} type="button">
              {tab}
            </button>
          ))}
        </div>
        {activeTab === 'Projects' ? <ProjectManager /> : null}
        {activeTab === 'Theme' ? <ThemeCustomizer /> : null}
        {activeTab === 'Calendar' ? <CalendarSettings /> : null}
        {activeTab === 'Tools' ? <p>Tool paths are configured per-project in this MVP.</p> : null}
      </div>
    </div>
  );
};

export default SettingsPanel;
