
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Project, ThemeConfig, ModularityConfig, ViewType, Toast } from './types';
import { mockProjects, mockMeetings } from './mockData';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './views/DashboardView';
import CalendarView from './components/CalendarView';
import WorkWeekView from './components/WorkWeekView';
import ToolsView from './views/ToolsView';
import DesignSystemView from './views/DesignSystemView';
import SettingsModal from './components/SettingsModal';
import ToastSystem from './components/ToastSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const App: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [activeProjectId, setActiveProjectId] = useState<string>(projects[0].id);
  const [activeView, setActiveView] = useState<ViewType>('Dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    borderRadius: '8px',
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
    if (projects.length === 0) {
      return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
           <div className="p-4 bg-white/5 rounded-2xl mb-4 border border-white/10">
              <Plus className="w-8 h-8 text-neutral-600" />
           </div>
           <h2 className="text-xl font-bold mb-2">No projects found</h2>
           <p className="text-neutral-500 text-sm max-w-xs mb-6">Create your first project to start managing your game development workflow.</p>
           <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl active:scale-95 transition-all shadow-xl shadow-blue-500/20">Create Project</button>
        </div>
      );
    }

    switch(activeView) {
      case 'Dashboard': return <DashboardView theme={theme} modularity={modularity} meetings={mockMeetings} />;
      case 'Calendar': return <div className="p-10 max-w-[1200px] mx-auto"><CalendarView theme={theme} /></div>;
      case 'WorkWeek': return <div className="p-8 h-full"><WorkWeekView theme={theme} meetings={mockMeetings} /></div>;
      case 'Tools': return <ToolsView theme={theme} />;
      case 'DesignSystem': return <DesignSystemView theme={theme} />;
      default: return <DashboardView theme={theme} modularity={modularity} meetings={mockMeetings} />;
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
            setProjects={setProjects as any}
          />
        )}
      </AnimatePresence>

      <ToastSystem toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
