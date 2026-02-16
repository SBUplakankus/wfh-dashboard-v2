
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ThemeConfig, ModularityConfig, ViewType, Toast } from './types';
import { mockMeetings } from './mockData';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import HomePage from './views/HomePage';
import DashboardView from './views/DashboardView';
import CalendarView from './components/CalendarView';
import WorkWeekView from './components/WorkWeekView';
import ToolsView from './views/ToolsView';
import IntegrationsView from './views/IntegrationsView';
import AnalyticsView from './views/AnalyticsView';
import SettingsModal from './components/SettingsModal';
import ToastSystem from './components/ToastSystem';
import GlobalSearch from './components/GlobalSearch';
import KeyboardShortcutsHelp from './components/KeyboardShortcutsHelp';
import CreateTaskModal from './components/integrations/CreateTaskModal';
import { motion, AnimatePresence } from 'framer-motion';

const AppContent: React.FC = () => {
  const { projects, activeProjectId, setActiveProjectId } = useProjects();
  const [activeView, setActiveView] = useState<ViewType>('Home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isShortcutsHelpOpen, setIsShortcutsHelpOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  const [theme, setTheme] = useState<ThemeConfig>({
    background: '#08090a',
    sidebarBackground: '#08090a',
    headerBackground: '#08090a',
    cardBackground: '#111111',
    accent: '#0070f3',
    border: '#1f1f1f',
    textPrimary: '#ededed',
    textSecondary: '#888888',
    bgType: 'solid',
    bgGradientColor: '#111827',
    bgGradientAngle: 135,
    borderRadius: '12px',
    spacingBase: 8,
    glassEnabled: true,
    glassIntensity: 12,
    controlLevel: 'simple',
  });

  const [modularity, setModularity] = useState<ModularityConfig>({
    showQuickActions: true,
    showResources: true,
    showSprintProgress: true,
    showUpcomingMeeting: true,
    showSchedule: true,
  });

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--app-bg', theme.background);
    root.style.setProperty('--sidebar-bg', theme.sidebarBackground);
    root.style.setProperty('--header-bg', theme.headerBackground);
    root.style.setProperty('--card-bg', theme.cardBackground);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--border', theme.border);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--radius', theme.borderRadius);
    root.style.setProperty('--glass-blur', `${theme.glassIntensity}px`);

    let bgStyle = theme.background;
    if (theme.bgType === 'linear') {
      bgStyle = `linear-gradient(${theme.bgGradientAngle}deg, ${theme.background} 0%, ${theme.bgGradientColor} 100%)`;
    } else if (theme.bgType === 'radial') {
      bgStyle = `radial-gradient(circle at center, ${theme.bgGradientColor} 0%, ${theme.background} 100%)`;
    }
    root.style.setProperty('--full-bg', bgStyle);
  }, [theme]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K for global search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      
      // Cmd+, or Ctrl+, for settings
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault();
        setIsSettingsOpen(true);
      }
      
      // ? for keyboard shortcuts help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setIsShortcutsHelpOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId) || projects[0],
    [projects, activeProjectId]
  );

  const renderView = () => {
    switch(activeView) {
      case 'Home': return <HomePage />;
      case 'Dashboard': return <DashboardView theme={theme} modularity={modularity} meetings={mockMeetings} currentProject={activeProject} onNavigateToView={setActiveView} onOpenCreateTask={() => setIsCreateTaskOpen(true)} />;
      case 'Calendar': return <div className="p-10 max-w-[1200px] mx-auto"><CalendarView theme={theme} /></div>;
      case 'WorkWeek': return <div className="p-8 h-full"><WorkWeekView theme={theme} meetings={mockMeetings} /></div>;
      case 'Tools': return <ToolsView theme={theme} />;
      case 'Integrations': return <IntegrationsView />;
      case 'Analytics': return <AnalyticsView currentProjectId={activeProjectId} />;
      default: return <HomePage />;
    }
  };

  return (
    <div 
      className="flex h-screen w-full overflow-hidden" 
      style={{ background: 'var(--full-bg)', color: 'var(--text-primary)' }}
    >
      <Sidebar 
        projects={projects} 
        activeProjectId={activeProjectId} 
        onSelectProject={setActiveProjectId}
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
      />

      <div className="flex-1 flex flex-col overflow-hidden relative">
        <Header 
          activeView={activeView}
          project={activeProject} 
          onOpenSettings={() => setIsSettingsOpen(true)}
          theme={theme}
        />
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeView}-${activeProjectId}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="h-full"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen} 
            onClose={() => {
              setIsSettingsOpen(false);
              addToast("Preferences saved successfully", "success");
            }}
            theme={theme}
            setTheme={setTheme}
            modularity={modularity}
            setModularity={setModularity}
            projects={projects}
            setProjects={() => {
              // Projects are now managed through HomePage and ProjectContext
              // This prop is kept for backward compatibility with SettingsModal
            }}
          />
        )}
      </AnimatePresence>

      <GlobalSearch 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <KeyboardShortcutsHelp 
        isOpen={isShortcutsHelpOpen}
        onClose={() => setIsShortcutsHelpOpen(false)}
      />

      <AnimatePresence>
        {isCreateTaskOpen && (
          <CreateTaskModal
            isOpen={isCreateTaskOpen}
            onClose={() => setIsCreateTaskOpen(false)}
            onTaskCreated={() => {
              setIsCreateTaskOpen(false);
              addToast('Task created successfully', 'success');
            }}
          />
        )}
      </AnimatePresence>

      <ToastSystem toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
};

export default App;
