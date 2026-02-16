import { DEFAULT_THEME } from './themes';

const projectBase = {
  features: { calendar: true, kanri: true, joplin: true, mkdocs: true, marktext: true, customLinks: true },
  paths: { mkdocsPath: '', calendarFile: '', kanriPath: '', joplinPath: '', marktextPath: '' },
  links: [],
  theme: null
};

export const DEFAULT_PROJECTS = [
  { id: 'game-dev', name: 'Game Dev Project', description: 'Main game development', icon: '🎮', color: '#6366f1', type: 'game-dev', ...projectBase, createdAt: Date.now(), lastAccessed: Date.now() },
  { id: 'work', name: 'Work Project', description: 'Daily productivity and docs', icon: '💼', color: '#0ea5e9', type: 'work', ...projectBase, createdAt: Date.now(), lastAccessed: Date.now() },
  { id: 'learning', name: 'Learning Project', description: 'Study and notes', icon: '📘', color: '#22c55e', type: 'learning', ...projectBase, createdAt: Date.now(), lastAccessed: Date.now() }
];

export const DEFAULT_CONFIG = {
  projects: DEFAULT_PROJECTS,
  currentProjectId: DEFAULT_PROJECTS[0].id,
  globalTheme: DEFAULT_THEME,
  themes: []
};
