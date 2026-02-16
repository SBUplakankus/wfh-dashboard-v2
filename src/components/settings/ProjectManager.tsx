import React, { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import IconGlyph from '../IconGlyph';

const ProjectManager = () => {
  const { projects, addProject, removeProject } = useProjectContext() as any;
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
      paths: { mkdocsPath: '', calendarFile: '', kanriPath: '', joplinPath: '', marktextPath: '', joplinDataFile: '', kanriDataFile: '' },
      calendarSettings: { hideAllDayEvents: false, hidePastMeetings: false, timeZone: '' },
      links: [],
      theme: null,
      createdAt: Date.now(),
      lastAccessed: Date.now()
    });
    setName('');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold tracking-tight">Project Manager</h3>
      <div className="flex flex-wrap items-center gap-2">
        <input className="md3-input max-w-sm" value={name} onChange={(e) => setName(e.target.value)} placeholder="New project name" />
        <button className="md3-button md3-button-primary" type="button" onClick={createProject}>
          Add
        </button>
      </div>
      <div className="space-y-2">
        {projects.map((project: any) => (
          <div key={project.id} className="md3-card flex items-center justify-between gap-2 p-3">
            <span className="flex items-center gap-2 text-sm text-md3-on-surface"><IconGlyph name={project.icon} type={project.type} /> {project.name}</span>
            {!['game-dev', 'work', 'learning'].includes(project.id) ? (
              <button className="md3-button border-red-900 bg-red-950/25 text-red-200 hover:bg-red-900/35" type="button" onClick={() => removeProject(project.id)}>
                Delete
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectManager;
