import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CONFIG } from '../utils/config';
import { loadConfig, saveConfig } from '../utils/storage';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState(DEFAULT_CONFIG.projects);
  const [currentProjectId, setCurrentProjectId] = useState(DEFAULT_CONFIG.currentProjectId);

  useEffect(() => {
    loadConfig().then((config) => {
      if (!config) return;
      setProjects(config.projects || DEFAULT_CONFIG.projects);
      setCurrentProjectId(config.currentProjectId || DEFAULT_CONFIG.currentProjectId);
    });
  }, []);

  useEffect(() => {
    saveConfig({ projects, currentProjectId });
  }, [projects, currentProjectId]);

  const value = useMemo(() => {
    const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];
    return {
      projects,
      currentProject,
      setCurrentProjectId,
      setProjects,
      addProject: (project) => setProjects((prev) => [...prev, project]),
      updateProject: (id, update) => setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...update } : p))),
      removeProject: (id) => setProjects((prev) => prev.filter((p) => p.id !== id))
    };
  }, [projects, currentProjectId]);

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};

export const useProjectContext = () => useContext(ProjectContext);
