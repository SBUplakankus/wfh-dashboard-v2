import React from 'react';
import { openApp, openFile } from '../../utils/ipc';

const ToolButton = ({ label, onClick }) => (
  <button className="btn" type="button" onClick={onClick}>
    {label}
  </button>
);

const ToolsSection = ({ project }) => {
  const paths = project.paths || {};
  return (
    <section className="card stack">
      <h3>Tools</h3>
      <div className="tools-grid">
        <ToolButton label="Open Kanri" onClick={() => openApp(paths.kanriPath)} />
        <ToolButton label="Open Joplin" onClick={() => openApp(paths.joplinPath)} />
        <ToolButton label="Open MarkText" onClick={() => openApp(paths.marktextPath)} />
        <ToolButton label="Open MkDocs" onClick={() => openFile(paths.mkdocsPath)} />
      </div>
    </section>
  );
};

export default ToolsSection;
