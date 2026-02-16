import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import IconGlyph from './IconGlyph';

type SidebarProps = {
  onOpenSettings: () => void;
};

const Sidebar = ({ onOpenSettings }: SidebarProps) => {
  const { projects, currentProject, setCurrentProjectId } = useProjectContext() as any;

  return (
    <aside className="md3-card h-fit space-y-4 p-4 lg:sticky lg:top-6">
      <h2 className="md3-label">Projects</h2>
      <div className="space-y-2">
        {projects.map((project: any) => {
          const active = currentProject?.id === project.id;
          return (
            <button
              key={project.id}
              className={`md3-button w-full justify-start gap-2 ${
                active ? 'border-md3-primary bg-white/[0.05] text-white' : 'border-md3-outline bg-transparent'
              }`}
              onClick={() => setCurrentProjectId(project.id)}
              type="button"
            >
              <IconGlyph name={project.icon} type={project.type} />
              <span className="truncate">{project.name}</span>
            </button>
          );
        })}
      </div>
      <button className="md3-button w-full" onClick={onOpenSettings} type="button">
        Open Settings
      </button>
    </aside>
  );
};

export default Sidebar;
