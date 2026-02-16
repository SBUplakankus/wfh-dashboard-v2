import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import IconGlyph from '../IconGlyph';

const ProjectManager = () => {
  const { projects, addProject, removeProject } = useProjectContext();
  const [name, setName] = useState('');

  const createProject = () => {
    if (!name.trim()) return;
    const id = `custom-${Date.now()}`;
    addProject({
      id,
      name,
      description: 'Custom project',
      icon: 'puzzle',
      color: '#a855f7',
      type: 'custom',
      features: { calendar: true, kanri: true, joplin: true, mkdocs: true, marktext: true, customLinks: true },
      paths: {},
      calendarSettings: { hideAllDayEvents: false, hidePastMeetings: false, timeZone: '' },
      links: [],
      theme: null,
      createdAt: Date.now(),
      lastAccessed: Date.now()
    });
    setName('');
  };

  return (
    <div className="stack">
      <h3>Project Manager</h3>
      <div className="row">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New project name" />
        <button className="btn" type="button" onClick={createProject}>
          Add
        </button>
      </div>
      {projects.map((project) => (
        <div key={project.id} className="row card-inline">
          <span className="row"><IconGlyph name={project.icon} type={project.type} /> {project.name}</span>
          {!['game-dev', 'work', 'learning'].includes(project.id) ? (
            <button className="btn danger" type="button" onClick={() => removeProject(project.id)}>
              Delete
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default ProjectManager;
