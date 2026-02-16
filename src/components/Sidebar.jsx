import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import IconGlyph from './IconGlyph';

const Sidebar = ({ onOpenSettings }) => {
  const { projects, currentProject, setCurrentProjectId } = useProjectContext();

  return (
    <aside className="sidebar card">
      <h2>Projects</h2>
      <div className="project-list">
        {projects.map((project) => (
          <button
            key={project.id}
            className={`btn project-btn ${currentProject?.id === project.id ? 'active' : ''}`}
            onClick={() => setCurrentProjectId(project.id)}
            type="button"
          >
            <span className="row"><IconGlyph name={project.icon} type={project.type} /> {project.name}</span>
          </button>
        ))}
      </div>
      <button className="btn" onClick={onOpenSettings} type="button">
        Open Settings
      </button>
    </aside>
  );
};

export default Sidebar;
