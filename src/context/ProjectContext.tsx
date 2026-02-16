import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project } from '../types';
import { mockProjects } from '../mockData';

interface ProjectContextType {
  projects: Project[];
  activeProjectId: string;
  setActiveProjectId: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(mockProjects[0]?.id || '');

  // Load projects from Electron storage on mount
  useEffect(() => {
    const loadProjects = async () => {
      if (window.dashboardAPI) {
        try {
          const result = await window.dashboardAPI.loadConfig();
          if (result.success && result.data) {
            if (result.data.projects) {
              setProjects(result.data.projects);
            }
            if (result.data.activeProjectId) {
              setActiveProjectId(result.data.activeProjectId);
            }
          }
        } catch (error) {
          console.error('Failed to load projects:', error);
        }
      }
    };
    loadProjects();
  }, []);

  // Save projects to Electron storage when they change
  useEffect(() => {
    const saveProjects = async () => {
      if (window.dashboardAPI) {
        try {
          await window.dashboardAPI.saveConfig({
            projects,
            activeProjectId,
          });
        } catch (error) {
          console.error('Failed to save projects:', error);
        }
      }
    };
    saveProjects();
  }, [projects, activeProjectId]);

  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = {
      ...project,
      id: Date.now().toString(),
    };
    setProjects((prev) => [...prev, newProject]);
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProjectId === id) {
      setActiveProjectId(projects[0]?.id || '');
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        activeProjectId,
        setActiveProjectId,
        addProject,
        updateProject,
        deleteProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
