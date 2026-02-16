import React from 'react';
import { useProjectContext } from '../context/ProjectContext';
import Header from './Header';
import Sidebar from './Sidebar';
import CalendarSection from './sections/CalendarSection';
import ToolsSection from './sections/ToolsSection';
import CustomLinksSection from './sections/CustomLinksSection';

const sampleEvents = [
  { id: '1', title: 'Daily Standup', start: new Date(), end: new Date(), allDay: false },
  { id: '2', title: 'Build Review', start: new Date(Date.now() + 86400000), end: new Date(Date.now() + 90000000), allDay: false }
];

const Dashboard = ({ onOpenSettings }) => {
  const { currentProject } = useProjectContext();
  const features = currentProject?.features || {};

  return (
    <div className="layout">
      <Sidebar onOpenSettings={onOpenSettings} />
      <main className="content stack">
        <Header title={currentProject?.name || 'Dashboard'} onOpenSettings={onOpenSettings} />
        {features.calendar ? <CalendarSection events={sampleEvents} /> : null}
        {features.kanri || features.joplin || features.mkdocs || features.marktext ? <ToolsSection project={currentProject} /> : null}
        {features.customLinks ? <CustomLinksSection links={currentProject?.links} /> : null}
      </main>
    </div>
  );
};

export default Dashboard;
