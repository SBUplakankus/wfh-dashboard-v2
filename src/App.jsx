import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import SettingsPanel from './components/SettingsPanel';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';
import { ProjectProvider } from './context/ProjectContext';
import { useTheme } from './hooks/useTheme';

const AppContent = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme } = useThemeContext();
  useTheme(theme);

  return (
    <>
      <Dashboard onOpenSettings={() => setSettingsOpen(true)} />
      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
};

const App = () => (
  <ThemeProvider>
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  </ThemeProvider>
);

export default App;
