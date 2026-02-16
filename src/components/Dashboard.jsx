import React, { useEffect, useMemo, useState } from 'react';
import { useProjectContext } from '../context/ProjectContext';
import Header from './Header';
import Sidebar from './Sidebar';
import CalendarSection from './sections/CalendarSection';
import ToolsSection from './sections/ToolsSection';
import CustomLinksSection from './sections/CustomLinksSection';
import { readFile } from '../utils/ipc';
import { parseICS } from '../utils/calendarParser';

const sampleEvents = [
  {
    id: '1',
    title: 'Daily Standup',
    start: new Date(),
    end: new Date(Date.now() + 30 * 60 * 1000),
    allDay: false,
    url: 'https://meet.google.com',
    calendarName: 'Default Calendar'
  },
  {
    id: '2',
    title: 'Build Review',
    start: new Date(Date.now() + 86400000),
    end: new Date(Date.now() + 90000000),
    allDay: false,
    url: '',
    calendarName: 'Default Calendar'
  }
];

const Dashboard = ({ onOpenSettings }) => {
  const { currentProject } = useProjectContext();
  const features = currentProject?.features || {};
  const [events, setEvents] = useState(sampleEvents);
  const calendarSettings = currentProject?.calendarSettings || { hideAllDayEvents: false, hidePastMeetings: false, timeZone: '' };

  useEffect(() => {
    const calendarFile = currentProject?.paths?.calendarFile;
    if (!calendarFile) {
      setEvents(sampleEvents);
      return;
    }
    readFile(calendarFile)
      .then((content) => setEvents(parseICS(content)))
      .catch(() => setEvents(sampleEvents));
  }, [currentProject?.paths?.calendarFile]);

  const filteredEvents = useMemo(() => {
    const now = Date.now();
    return events.filter((event) => {
      if (calendarSettings.hideAllDayEvents && event.allDay) return false;
      if (calendarSettings.hidePastMeetings && new Date(event.end).getTime() < now) return false;
      return true;
    });
  }, [events, calendarSettings.hideAllDayEvents, calendarSettings.hidePastMeetings]);

  return (
    <div className="layout">
      <Sidebar onOpenSettings={onOpenSettings} />
      <main className="content stack">
        <Header title={currentProject?.name || 'Dashboard'} onOpenSettings={onOpenSettings} />
        {features.calendar ? <CalendarSection events={filteredEvents} calendarSettings={calendarSettings} /> : null}
        {features.kanri || features.joplin || features.mkdocs || features.marktext ? <ToolsSection project={currentProject} /> : null}
        {features.customLinks ? <CustomLinksSection links={currentProject?.links} /> : null}
      </main>
    </div>
  );
};

export default Dashboard;
